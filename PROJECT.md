# Team4.ge Project

## Manual Payment And Reader

The site includes a manual bank-transfer payment flow for the online book `მე ვარ პასუხი`.

Customer flow:
- The `/library` page redirects unauthenticated visitors to a Login / Register form.
- Authenticated users can create a manual payment order for `14.90 GEL`.
- After order creation the page shows bank details, receiver `ლაშა ხურციძე`, account `GE12BG0000000536600132`, and a unique purpose code such as `TEAM4-1025`.
- Customers upload a receipt file after making the transfer.
- Approved users see the book in `ჩემი წიგნები` and can read it only inside the site.

Admin flow:
- `/admin` shows manual payment orders from `/api/admin/orders`.
- Admin can view order number, first name, last name, email, phone, amount, payment code, receipt, status, and created date.
- `Approve` unlocks the book and sends the approval email through EmailJS when EmailJS environment variables are configured.
- `Reject` stores a rejection reason and sends it to the customer through EmailJS when configured.

Reader protection:
- The book is rendered as online HTML content, not as a downloadable PDF.
- Access is based on approved manual orders.
- Reader includes chapters, resume position, reading progress, email watermark, right-click blocking, print shortcut blocking, and copy/select blocking.

Vercel production storage:
- Live Vercel deployments use Vercel Postgres for buyer/order data.
- Receipt uploads use Vercel Blob, with receipt URLs stored on the order.
- The local `server.js` file still supports `.data/` for localhost development.

Extensibility:
- Orders store `itemId`, `itemTitle`, and `itemType`, so new books/courses can reuse the same data model.
- Bank/account values can be moved to environment variables.
- The manual payment endpoints can later be replaced or complemented by a Bank of Georgia API payment provider while keeping the entitlement model.

## Environment

Optional variables:
- `MANUAL_PAYMENT_RECEIVER`
- `MANUAL_PAYMENT_ACCOUNT`
- `BOOK_PRICE_GEL`
- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `EMAILJS_PUBLIC_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_EMAIL`
- `SESSION_SECRET`
- `DATA_DIR`
- Vercel Postgres variables, added automatically when Postgres is connected
- Vercel Blob variables, added automatically when Blob is connected

Runtime data is stored in `.data/` and should not be committed.
