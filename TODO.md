# TODO

- Confirm the Bank of Georgia account number `GE12BG0000000536600132` once more before launch.
- Connect Vercel Postgres and Vercel Blob before production deploy.
- Configure EmailJS production template variables and test approve/reject emails end to end.
- Add a real user authentication provider if customer accounts must work across devices and browsers.
- Add automated Bank of Georgia API payments when ready; reuse `itemId`, `paymentCode`, and entitlement status.
- Add more books/courses to the catalog by extending `Team4Library.catalog` and the order item metadata.
- Add server-side rate limits for receipt upload and order creation in production.
