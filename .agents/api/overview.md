# API Overview

## Base URL

`src/configs/conf.tsx` selects `VITE_URL_API` when `VITE_ENV === "PROD"`, otherwise `VITE_URL_API_DEV`. Environment values are intentionally not copied here. The tracking page obtains the visitor ID through `useVisitorData` from `@fingerprintjs/fingerprintjs-pro-react` before calling the tracking endpoint.

## GET Endpoints

| Method | Path | Client function |
|---|---|---|
| GET | `/role/project/projectId` | `FunctionOpenProject`; fixed project ID query parameter |
| GET | `/vetrun/size/shirt` | `FunctionMenuSizeShirt` |
| GET | `/vetrun/limit/animal` | `FunctionLimitAnimal` |
| GET | `/vetrun/participant/email?email=<email>` | `FunctionGetParticipantByEmail`; called only after the registration-status form is submitted |
| GET | `/vetrun/sponsors` | `FunctionGetSponsorAll` |
| GET | `/vetrun/tracking` | `FunctionGetTrackingAll`; sends `X-Visitor-Id` |

## POST Endpoints

| Method | Path | Payload behavior |
|---|---|---|
| POST | `/vetrun/register/participant` | Multipart; non-file values are AES-encrypted into `encryptedData`, files remain multipart parts |
| POST | `/vetrun/sale/shirt` | Same multipart/encryption pattern for shirt orders |

Both POST helpers use `CryptoJS.AES`, `VITE_SECRET_KEY_CRYPTO_FRONTEND`, and a simulated 10-second progress indicator. Error handling returns backend error data when available, otherwise a Thai connection-error message.

## Contract Gaps

Exact response schemas, HTTP status matrix, authentication, rate limits, server-side validation, and backend encryption-key handling are not defined in this repository. `ApiResponse.data` is typed as `any`; the participant email lookup UI accepts either one participant object or an array.

