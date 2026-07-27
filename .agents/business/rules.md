# Business Rules Evidence

Only rules directly observable in the client are listed. Server-side rules remain unknown.

## Project Availability

- Home registration and shirt-sale actions navigate only when the fetched project `status === true`.
- The project lookup uses a fixed project ID in `FunctionOpenProject`.

## Participant Registration

- The UI is a four-step flow: event/type, option, personal information, confirmation.
- Client validation checks required personal fields, phone format, receipt address when receipt is requested, dog information for dog-related selection, and transfer file presence.
- Animal limits are fetched from `/vetrun/limit/animal` before/around the registration flow; enforcement authority is not established as client-only.
- Submission posts multipart data to `/vetrun/register/participant`.

## Shirt Sale

- Shirt size options are fetched from `/vetrun/size/shirt`.
- A shirt order includes buyer contact data, quantity, per-shirt model/size details, collection method, address when delivery is selected, and transfer-slip upload as implemented by the form.
- The UI displays 350 baht per shirt, a delivery fee rule, and a 5-baht additional-shirt fee; these are presentation/client calculations and must not be treated as authoritative server pricing.
- Submission posts multipart data to `/vetrun/sale/shirt`.

## Tracking

- Tracking requests require a non-empty string visitor ID and send it as `X-Visitor-Id`.
- Client-side filtering searches fullname, phone, or email. Payment, collection, tracking number, item count, and date are rendered from API data.

