"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { StrapiImage } from "@/lib/cms/types";

/** Decorative cloud artwork from the CMS Global record (`cloudEdge`, `cloudBand`). */
export type CloudArt = {
  edge?: StrapiImage | null;
  band?: StrapiImage | null;
};

const CloudsContext = createContext<CloudArt>({});

/** Set once in the root layout so any hero — server or client component — can render clouds. */
export function CloudsProvider({ value, children }: { value: CloudArt; children: ReactNode }) {
  return <CloudsContext.Provider value={value}>{children}</CloudsContext.Provider>;
}

export const useCloudArt = () => useContext(CloudsContext);
