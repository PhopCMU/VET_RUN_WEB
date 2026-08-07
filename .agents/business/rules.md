# Business Rules Evidence

Only rules directly observable in the client are listed. Server-side rules remain unknown.

## Project Availability

- Home registration and shirt-sale actions navigate only when fetched project `status === true`.
- Project lookup uses a fixed project ID in `FunctionOpenProject`.

## Participant Registration

- Four-step flow: event/type, option, personal information, confirmation.
- Client validation checks required personal fields, phone format, receipt address when requested, dog information for dog-related selection, and transfer-file presence.
- Animal limits are fetched from `/vetrun/limit/animal`; enforcement authority is not established as client-only.
- Submission posts multipart data to `/vetrun/register/participant`.

## Shirt Sale

- Shirt sizes are fetched from `/vetrun/size/shirt`.
- The form collects buyer contact data, quantity, per-shirt model/size, collection method, address for delivery, and transfer-slip upload.
- The UI displays 350 baht per shirt, delivery fees, and a 5-baht additional-shirt fee. These are client calculations and are not authoritative server pricing.
- Submission posts multipart data to `/vetrun/sale/shirt`.

## Tracking

- Tracking requests require a non-empty string visitor ID and send it as `X-Visitor-Id`.
- Client-side filtering searches fullname, phone, or email; payment, collection, tracking number, item count, and date are rendered from API data.

