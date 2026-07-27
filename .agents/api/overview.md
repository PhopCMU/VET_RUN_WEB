# API Overview

## Base URL

`src/configs/conf.tsx` selects `VITE_URL_API` when `VITE_ENV === "PROD"`, otherwise `VITE_URL_API_DEV`. Environment values are intentionally not copied here.

## GET Endpoints

| Method | Path | Evidence / use |
|---|---|---|
| GET | `/role/project/projectId` | `FunctionOpenProject`; sends fixed project ID query parameter and reads `{ success, data }`. |
| GET | `/vetrun/size/shirt` | `FunctionMenuSizeShirt`; shirt-size options. |
| GET | `/vetrun/limit/animal` | `FunctionLimitAnimal`; registration limit response. |
| GET | `/vetrun/participant/all` | `FunctionGetParticipantAll`; participant list. |
| GET | `/vetrun/sponsors` | `FunctionGetSponsorAll`; sponsor list. |
| GET | `/vetrun/tracking` | `FunctionGetTrackingAll`; sends `X-Visitor-Id`. |

## POST Endpoints

| Method | Path | Payload behavior |
|---|---|---|
| POST | `/vetrun/register/participant` | Multipart form. Non-file values are JSON/string-normalized, AES-encrypted into `encryptedData`; files remain multipart parts. |
| POST | `/vetrun/sale/shirt` | Same multipart/encryption pattern for shirt orders. |

Both POST helpers use `CryptoJS.AES`, `VITE_SECRET_KEY_CRYPTO_FRONTEND`, and a simulated 10-second progress indicator. Error handling returns backend error data when available, otherwise a Thai connection-error message.

## Contract Gaps

Exact response schemas, HTTP status matrix, authentication, rate limits, server-side validation, and backend encryption key handling are not defined in this repository. `ApiResponse.data` is typed as `any`.

