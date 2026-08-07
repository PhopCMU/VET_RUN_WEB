# Feature Overview

## Home

`src/pages/home.tsx` loads project status and sponsors and links to registration, participant list, shirt sale, and order tracking. It supports Thai/English translations.

## Participant Registration

`src/pages/page.tsx` coordinates step state, form state, validation, upload progress, confirmation, and submission. `Step1SelectType`, `Step2SubOptions`, and `Step3Form` own input sections.

## Participant List

`src/pages/table_list.tsx` loads all participants through `FunctionGetParticipantAll` and renders returned data. The complete response shape is not typed in the client.

## Shirt Sale and Tracking

`src/pages/Sale_shirts/page.tsx` collects buyer/order details, obtains shirt sizes, calculates a displayed total, uploads a transfer slip, and confirms before posting. `tracking.tsx` obtains a visitor identifier through FingerprintJS Pro React, loads data, filters by name/phone/email, and displays payment, collection, EMS tracking, item count, and order date.

## Internationalization

`src/i18n.ts` initializes i18next with `en` fallback, reads `localStorage.language`, and loads both public translation JSON files at startup.

