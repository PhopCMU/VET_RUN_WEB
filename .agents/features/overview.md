# Feature Overview

## Home

`src/pages/home.tsx` loads project status and sponsors and links to registration, participant list, shirt sale, and order tracking. It supports Thai/English translations.

## Participant Registration

`src/pages/page.tsx` coordinates step state, form state, validation, upload progress, confirmation, and submission. `Step1SelectType`, `Step2SubOptions`, and `Step3Form` own input sections.

## Participant List

`src/pages/table_list.tsx` looks up participants by normalized email through `FunctionGetParticipantByEmail`, then supports category/subcategory filtering for the returned participant list. The complete response shape is not typed in the client.

## Shirt Sale and Tracking

`src/pages/Sale_shirts/page.tsx` collects buyer/order details, obtains model/color/size data, filters size options by API point ranges, calculates model-based shirt totals and delivery, uploads a transfer slip, and confirms before posting. `tracking.tsx` searches by normalized order email and displays payment, collection, EMS tracking, item count, and order date.

## Internationalization

`src/i18n.ts` initializes i18next with `en` fallback, reads `localStorage.language`, and loads both public translation JSON files at startup.

## Environment Notices

`src/main.tsx` renders the dedicated maintenance screen in `DEV`. `src/App.tsx` displays a dismissible testing warning in `TEST`; `PROD` does not show an environment notice. See `features/dev-mode.md` for the maintenance behavior.
