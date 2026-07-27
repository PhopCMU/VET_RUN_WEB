# Feature Overview

## Home

`src/pages/home.tsx` loads project status and sponsors, displays the VET CMU RUN entry point, and links to registration, participant list, shirt sale, and order tracking. It supports Thai/English translations.

## Participant Registration

`src/pages/page.tsx` coordinates step state, form state, validation, upload progress, confirmation modal, and submission. `Step1SelectType`, `Step2SubOptions`, and `Step3Form` own portions of the input UI.

## Participant List

`src/pages/table_list.tsx` loads all participants through `FunctionGetParticipantAll` and renders the returned data. The complete server response shape is not typed in the client.

## Shirt Sale and Confirmation

`src/pages/Sale_shirts/page.tsx` collects buyer/order details, obtains shirt sizes, calculates a displayed total, uploads a transfer slip, and delegates confirmation rendering to `ConfirmationSale.tsx` before posting.

## Order Tracking

`src/pages/Sale_shirts/tracking.tsx` obtains a visitor identifier, loads tracking data, filters locally by name/phone/email, and displays payment, collection, EMS tracking, item count, and order date fields.

## Internationalization

`src/i18n.ts` initializes i18next with `en` fallback, reads the preferred language from `localStorage.language`, and loads both public translation JSON files at startup.

