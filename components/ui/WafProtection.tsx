"use client";

import { useCallback, useEffect } from "react";

/**
 * Client side of AWS WAF bot protection (replaces Google reCAPTCHA), used by every form.
 *
 *   const wafFetch = useWafFetch();
 *   const res = await wafFetch("/api/contact", { method: "POST", body: JSON.stringify(values) });
 *
 * AWS WAF runs in front of the site (CloudFront / ALB). A rule with the `Challenge` action
 * (silent, no puzzle — the closest thing to reCAPTCHA v3) or `CAPTCHA` action on the form
 * endpoints requires a valid `aws-waf-token`. The AWS JS SDK acquires that token in the
 * background and `AwsWafIntegration.fetch` attaches it, so the app itself verifies nothing.
 *
 * Switched by env, so it can stay off until the site is deployed behind WAF:
 *   NEXT_PUBLIC_ENABLE_AWS_WAF=true            turn it on (anything else = off, plain `fetch`)
 *   NEXT_PUBLIC_AWS_WAF_INTEGRATION_URL=the SDK script URL from the console
 *       (console: WAF & Shield → Web ACLs → <acl> → Application integration → JavaScript SDK)
 *
 * When off — local development — `wafFetch` is just `fetch` and no script is loaded. When on
 * but the SDK can't load (ad blocker, wrong URL), it also falls back to `fetch`; WAF then
 * rejects the request at the edge and the form shows its normal error.
 */
const ENABLED = process.env.NEXT_PUBLIC_ENABLE_AWS_WAF === "true";
const SDK_URL = process.env.NEXT_PUBLIC_AWS_WAF_INTEGRATION_URL;

type AwsWafIntegration = {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  getToken?: () => Promise<string>;
};

const sdk = () => (window as unknown as { AwsWafIntegration?: AwsWafIntegration }).AwsWafIntegration;

let scriptPromise: Promise<AwsWafIntegration | null> | null = null;

function loadWafSdk(): Promise<AwsWafIntegration | null> {
  if (!ENABLED || typeof window === "undefined") return Promise.resolve(null);
  if (!SDK_URL) {
    console.warn("[waf] NEXT_PUBLIC_ENABLE_AWS_WAF is on but NEXT_PUBLIC_AWS_WAF_INTEGRATION_URL is not set");
    return Promise.resolve(null);
  }
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<AwsWafIntegration | null>((resolve) => {
    if (sdk()) return resolve(sdk() ?? null);

    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(sdk() ?? null);
    script.onerror = () => {
      scriptPromise = null; // allow a retry on the next submit
      resolve(null);
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

/**
 * Returns a `fetch` that carries the AWS WAF token when WAF is enabled, and is plain `fetch`
 * otherwise. The SDK starts loading as soon as a form is on screen so the token is ready on submit.
 */
export function useWafFetch() {
  useEffect(() => {
    void loadWafSdk();
  }, []);

  return useCallback(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    if (!ENABLED) return fetch(input, init);
    const waf = await loadWafSdk();
    return waf ? waf.fetch(input, init) : fetch(input, init);
  }, []);
}
