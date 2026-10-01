# Next.js Production Boilerplate

This is a robust [Next.js](https://nextjs.org) boilerplate codebase designed to serve as a **standard reference** for our team when starting new Next.js projects. It includes enterprise-grade configurations, state management, route protection, API interceptors, and more, significantly reducing setup time while maintaining best practices.

## 🚀 Boilerplate Features Included

This boilerplate includes the following standard configurations out of the box:

### 1. **State Management (Redux Toolkit)**
- Configured robust global state management using `@reduxjs/toolkit` and `react-redux`.
- **Location:** `store/` directory.
- **Why:** Centralizes the frontend application state (e.g., authentication status, user profile) to ensure predictability and easier debugging. Redux is provided to the entire app via the `StoreProvider` in `app/layout.tsx`.

### 2. **API Interceptor Hook (Axios)**
- A custom hook for standardized API calls with interceptors.
- **Location:** `hooks/useApi.ts`.
- **Why:** Ensures that every API call automatically attaches authentication headers (like Bearer tokens) and centrally handles responses and global errors (e.g., handling 401 Unauthorized globally), keeping component code clean.

### 3. **Public & Protected Route Configuration**
- Edge Middleware configuration for route protection.
- **Location:** `middleware.ts` & `config/routes.ts`.
- **Why:** Centralizes the logic to determine which routes require authentication (`PROTECTED_ROUTES`) and which routes are meant for unauthenticated users (`AUTH_ROUTES` like login/register). This prevents unauthorized access to sensitive application areas at the edge before the page even renders.

### 4. **Higher Order Component (HOC) Layout**
- A standard Layout Higher Order Component.
- **Location:** `hoc/withLayout.tsx`.
- **Why:** Provides a powerful way to inject shared UI (like Headers, Footers, and Sidebars) across specific pages dynamically. An example can be seen in `app/dashboard/page.tsx`.

### 5. **Server-Side Rendering (SSR) Support**
- An example of data fetching using Next.js 13+ App Router Server Components.
- **Location:** `app/ssr-example/page.tsx`.
- **Why:** Demonstrates how to fetch data securely on the server side (SSR) before streaming the HTML to the client. This is crucial for SEO and keeping sensitive keys off the frontend.

## 💻 Getting Started

First, install the dependencies (if you haven't already):
```bash
npm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Strapi CMS (sibling project)

Content is managed in the sibling repo **`aptaivisor-cms`** (not inside this
app). Run both locally:

```bash
# terminal 1 — CMS
cd ../aptaivisor-cms && npm run develop   # http://localhost:1337

# terminal 2 — Next
npm run dev                              # http://localhost:3000
```

Copy `.env.example` → `.env` and set `STRAPI_URL=http://localhost:1337` (plus
tokens if you use authenticated API / preview / revalidate).

## 📁 Key File Structure Highlights

- **`app/layout.tsx`**: The Root Layout wrapping the whole application. The `StoreProvider` is initialized here to provide Redux state.
- **`app/dashboard/page.tsx`**: Example of a page wrapped in our Layout HOC.
- **`app/ssr-example/page.tsx`**: Example of an SSR page fetching secure data on the server.
- **`store/store.ts`**: The main Redux store configuration.
- **`hooks/useApi.ts`**: Axios instance configuration and custom hook for API interactions.
- **`middleware.ts`**: Next.js Edge Middleware guarding routes.
- **`config/routes.ts`**: Dictionary of application routes for auth checking.

## 💡 Developer Guidelines
- **Comments & Documentation:** Ensure you document *why* a particular piece of logic is implemented, especially for custom hooks and complex state management. Check the provided files for our inline comment standards.
- **Strict Typing:** Always leverage TypeScript to provide strong typing for API responses and Redux state.
- **Server vs Client Components:** By default, use Server Components for data fetching (like `ssr-example`), and add `'use client'` only when you need React interactivity, hooks (like `useState`, `useEffect`), or accessing the DOM (like `StoreProvider`).

---
Happy coding!

## reCAPTCHA v3 (form protection)

All six forms (contact, waitlist, newsletter — both the Contact page and the blog — design-partner
application, demo "notify me", and the Career "Express interest" modal) are protected by Google
reCAPTCHA v3. It is shared code, so a new form only needs three steps:

1. **Client** — in the form component: `const { execute } = useRecaptcha();` (from
   `components/ui/Recaptcha.tsx`), then send `recaptchaToken: await execute(RECAPTCHA_ACTIONS.<name>)`
   with the submission (JSON field, or `form.set("recaptchaToken", …)` for multipart).
2. **Server** — in the API route, right after parsing the request:
   `verifyRecaptcha({ token: recaptchaTokenFrom(body), action: RECAPTCHA_ACTIONS.<name>, request })`
   from `lib/recaptcha.ts`; return `{ message }` with the returned status when `!captcha.ok`.
3. **Action name** — add it to `lib/recaptcha-actions.ts` (the server checks the token was issued for that exact action).

Env (`.env.local`; see `.env.example`):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | public site key (sent to the browser) |
| `RECAPTCHA_SECRET_KEY` | secret key — server only, never commit it |
| `RECAPTCHA_MIN_SCORE` | optional, default `0.5` — requests scoring below it are rejected |
| `RECAPTCHA_ALLOWED_HOSTNAMES` | optional, comma-separated hostname allow-list |

Behaviour: without the secret key, **production rejects** submissions (503) and development skips the
check with a console warning. Create keys at google.com/recaptcha/admin (type: score based v3) — use a
separate key pair per environment and add each environment's domain (`localhost` for dev).
Rejections are logged as `[recaptcha] rejected action=… : reason` (score, action mismatch, …), which is
how to tune the threshold.
