// Replit auth shim (deprecated)
// This file is intentionally left as a noop shim. The application now uses a JWT
// based authentication flow implemented in `server/jwtAuth.ts` which is compatible
// with Vercel deployments (stateless tokens). The old Replit/Passport session
// based approach is removed.

export {}; // keep this an ES module
