# Installation & Deployment Guide

Last updated: 2026-06-01

## 1. Purpose

This guide explains how to install, configure, build, and deploy the `lims_fe` frontend application.

## 2. Tech Stack

- React 19
- Vite 7
- Redux Toolkit
- React Router
- Tailwind CSS 4
- DaisyUI
- Firebase Hosting

## 3. Prerequisites

Before setup, make sure the machine has:

- Node.js LTS, recommended: Node 20 or later
- npm
- Git
- Firebase CLI for Firebase deployment
- Access to the LIMS backend API

## 4. Repository Setup

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd lims_fe
npm install
```

## 5. Runtime Configuration

### 5.1 API base URL

The frontend currently reads the API base URL from [src/utils/config.jsx](/d:/ritishree/updated/lims_fe/src/utils/config.jsx).

Current code:

```js
export const API_BASE_URL = "http://localhost:3000/api";
```

For non-local environments, update this file before deployment or refactor it to use environment variables.

Recommended future pattern:

```js
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
```

### 5.2 Session timeout

The session timeout is environment-aware through `VITE_SESSION_TIMEOUT_MINUTES` in [src/context/AuthContext.jsx](/d:/ritishree/updated/lims_fe/src/context/AuthContext.jsx).

Create a `.env` file:

```env
VITE_SESSION_TIMEOUT_MINUTES=15
```

Optional environment files:

- `.env.development`
- `.env.uat`
- `.env.production`

Recommended production variables:

```env
VITE_SESSION_TIMEOUT_MINUTES=15
VITE_API_BASE_URL=https://<backend-domain>/api
```

Note: `VITE_API_BASE_URL` is not yet wired into code and would require the small refactor shown above.

## 6. Local Development

Start the Vite development server:

```bash
npm run dev
```

Default behavior:

- Vite serves the application locally.
- The frontend expects the backend API to be reachable at the configured `API_BASE_URL`.
- Authentication and most feature pages will not fully work without a valid backend and test data.

## 7. Build Process

Create a production build:

```bash
npm run build
```

Build output:

- Folder: `dist/`

Optional local validation:

```bash
npm run preview
```

## 8. Firebase Deployment

The repository includes:

- [firebase.json](/d:/ritishree/updated/lims_fe/firebase.json)
- [.firebaserc](/d:/ritishree/updated/lims_fe/.firebaserc)

Current Firebase project:

- `lims-5c18c`

### 8.1 Hosting behavior

Firebase is configured to:

- Publish from `dist`
- Ignore hidden files and `node_modules`
- Rewrite all routes to `index.html`

This supports React Router SPA navigation.

### 8.2 Deployment steps

```bash
npm run build
firebase login
firebase use lims-5c18c
firebase deploy --only hosting
```

### 8.3 Pre-deployment checklist

Before deployment, confirm:

- `API_BASE_URL` points to the correct backend
- backend CORS allows the frontend domain
- production backend is reachable
- session timeout value is correct
- build succeeds locally
- key user flows have been smoke-tested

## 9. Generic Static Hosting Deployment

If Firebase is not used, deploy the `dist/` folder to any static hosting platform that supports SPA rewrites, for example:

- Netlify
- Vercel
- Nginx
- Apache
- S3 + CloudFront

Required behavior:

- all frontend routes must rewrite to `index.html`

## 10. Recommended Deployment Workflow

1. Pull latest code.
2. Update environment-specific configuration.
3. Run `npm install`.
4. Run `npm run build`.
5. Run `npm run preview` or smoke test in target environment.
6. Deploy `dist/`.
7. Validate login, dashboard, projects, land modules, and reports.

## 11. Operational Risks and Hand-off Notes

### 11.1 Hardcoded API URL

The current app uses a hardcoded API base URL in `src/utils/config.jsx`. This creates release risk because environment changes require source changes.

### 11.2 Mixed API access patterns

The codebase uses both:

- shared `apiClient`
- direct `fetch` calls

This means:

- error handling is not fully centralized
- auth/session handling is inconsistent across modules
- deployment validation should include multiple feature areas

### 11.3 Role enforcement gap

`PrivateRoute` currently checks only session presence. Role-based route enforcement is commented out in [src/routes/PrivateRoute.jsx](/d:/ritishree/updated/lims_fe/src/routes/PrivateRoute.jsx). Menu visibility is role-aware, but route-level restrictions are not fully enforced.

### 11.4 Build verification status

On 2026-06-01, a build verification attempt was started, but local approval to rerun the build outside the sandbox was not granted. The KT pack therefore documents the intended build process, but the final build result should still be verified on the target machine.

## 12. Smoke Test Checklist

After deployment, validate at least:

- Login with valid user
- Forgot password page opens
- Dashboard loads with selected project
- Project list loads
- Private land villages, khatas, and plots load
- Government land villages, khatas, and plots load
- Forest project master and stages load
- User management loads for admin
- Reports pages return data
- File upload workflows work for khata/plot documents
- Session timeout redirects to login
