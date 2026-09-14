# Business Rules Evidence

Only rules directly observable in the client are listed. Server-side rules remain unknown.

## Project Availability

- Home registration and shirt-sale actions navigate only when fetched project `status === true`.
- Project lookup uses a fixed project ID in `FunctionOpenProject`.
- Environment handling is client-side: `DEV` replaces the normal app with a maintenance screen, `TEST` displays a dismissible testing notice over the normal app, and `PROD` shows no environment notice.

## Participant Registration

- Four-step flow: event/type, option, personal information, confirmation.
- Client validation checks required personal fields, phone format, receipt address when requested, dog information for dog-related selection, and transfer-file presence.
- Animal limits are fetched from `/vetrun/limit/animal`; enforcement authority is not established as client-only.
- Submission posts multipart data to `/vetrun/register/participant`.

## Shirt Sale

- Shirt sizes are fetched from `/vetrun/size/shirt`.
- The form collects buyer contact data, quantity, per-shirt model/size, collection method, address for delivery, and transfer-slip upload.
- Shirt model prices are read from the `/vetrun/size/shirt` response and calculated per selected model. Delivery uses 50 baht for the first item and 5 baht for each additional item in the form total. These are client calculations and are not authoritative server pricing.
- Size options are filtered by the API `point` field: points 2–17 for regular models and 18–23 for the limited model ID defined in `Sale_shirts/page.tsx`.
- Submission posts multipart data to `/vetrun/sale/shirt`.

## Tracking

- Tracking requests use the trimmed, lowercased order email as the `email` query parameter.
- Tracking results render payment, collection, tracking number, item count, and order date from API data; an object response is normalized to a one-item list.
