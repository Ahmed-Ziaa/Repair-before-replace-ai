 # Repair Before Replace AI
 
 Full-stack React, Express, MongoDB and JWT application for diagnosing items and choosing repair before replacement.
 
 ## Run locally
 
 1. Install dependencies:
 
 ```bash
 npm install
 ```
 
 2. Copy `.env.example` to `.env` and set `MONGODB_URI`, a long `JWT_SECRET`, and the Cloudinary credentials used for image uploads.
 
 3. Start the API and frontend together:
 
 ```bash
 npm run dev:full
 ```
 
 Frontend: `http://localhost:5173`  
 API: `http://localhost:5000`
 
 You can also run them separately with `npm run server:dev` and `npm run dev`.
 
 ## API
 
 - `POST /api/auth/register`
 - `POST /api/auth/login`
 - `POST /api/auth/logout`
 - `GET /api/auth/me`
 - `GET/PATCH /api/profile`
 - `GET /api/dashboard`
 - `POST/GET /api/diagnoses`
 - `GET /api/diagnoses/:id`
 - `PATCH /api/diagnoses/:id/status`
 - `POST /api/diagnoses/:id/feedback`
 - `GET/POST /api/maintenance`
 - `PATCH/DELETE /api/maintenance/:id`
 
 The AI service is currently a deterministic backend service that returns structured diagnosis data. Replace `generateDiagnosis` in `server/services.js` with a provider call when an AI key is available.
 
 ## Validation
 
 ```bash
 npm run lint
 npm run build
 ```

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
