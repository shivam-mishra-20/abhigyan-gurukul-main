What I changed to fix the Vercel/npm peer-dependency build error

- Problem: `react-helmet-async@2.0.5` required a peer of React up to v18 (peer: `^16.6.0 || ^17.0.0 || ^18.0.0`). The project (and some transitive deps) were resolving React 19, which caused npm to fail the dependency resolution during deploy.

- Fix applied:
  - Removed `react-helmet-async` from `package.json`.
  - Added a small, dependency-free `SEO` component at `src/components/SEO.jsx` that injects title/meta/link/script tags into `document.head` via `useEffect`.
  - Replaced `HelmetProvider` usage in `src/App.jsx` and `Helmet` usage in `src/pages/Admissions.jsx` with the new `SEO` component.
  - Updated `react` and `react-dom` entries in `package.json` to `^18.2.0` earlier while exploring; however the current install resolved packages cleanly after removing `react-helmet-async`.

- Why this is safe:
  - `react-helmet-async` is only used to set document head metadata. The custom `SEO` component covers the same needs without introducing a peer dependency mismatch.
  - The new component is simple and contained — it only manipulates `document.head` and cleans up script nodes on unmount.

- After this change:
  - `npm install` completes locally without the ERESOLVE failure.
  - `npm run build` (Vite) completes successfully (produces only warnings about chunk sizes and dynamic imports).

If you'd prefer to keep `react-helmet-async`, we can instead upgrade/downgrade React or try to find a version of `react-helmet-async` that supports React 19, or configure Vercel to use `npm install --legacy-peer-deps` via a custom build command. Tell me which approach you prefer and I can adjust.
