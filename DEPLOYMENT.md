# Vercel Live Deployment

This project is prepared for Vercel + GitHub.

Customer order data is stored in Vercel Postgres.
Receipt uploads are stored in Vercel Blob.

## 1. Push To GitHub

Create a GitHub repository and upload the project files.

## 2. Import In Vercel

In Vercel:

```text
Add New -> Project -> Import GitHub Repository
```

Use these settings:

```text
Framework Preset: Other
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

## 3. Add Storage

In the Vercel project dashboard, add:

```text
Storage -> Create Database -> Postgres
Storage -> Create Blob Store
```

Connect both stores to this project.

Vercel will add the required Postgres and Blob environment variables automatically.

## 4. Environment Variables

Add these in:

```text
Project Settings -> Environment Variables
```

Required:

```text
NODE_ENV=production
ADMIN_USERNAME=TEAM4ADMIN
ADMIN_PASSWORD=123456789ns@
ADMIN_EMAIL=collegeteam4you@gmail.com
SESSION_SECRET=replace-with-long-random-secret
MANUAL_PAYMENT_RECEIVER=ლაშა ხურციძე
MANUAL_PAYMENT_ACCOUNT=GE12BG0000000536600132
BOOK_PRICE_GEL=14.9
```

Optional email notifications:

```text
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
```

## 5. Deploy

Click:

```text
Deploy
```

After deploy, test:

```text
https://your-vercel-domain.vercel.app
https://your-vercel-domain.vercel.app/library
https://your-vercel-domain.vercel.app/admin
```

Admin login:

```text
Username: TEAM4ADMIN
Password: 123456789ns@
```

## 6. Where Buyer Data Is Stored

Buyer order fields are stored in Vercel Postgres:

- order number
- first name
- last name
- email
- phone
- amount
- payment code
- receipt URL
- status
- rejection reason
- created date
- approved/rejected dates

Receipt files are stored in Vercel Blob, and the public Blob URL is saved in Postgres.

## 7. Domain

In Vercel:

```text
Project -> Settings -> Domains
```

Add:

```text
team4.ge
www.team4.ge
```

Then copy Vercel's DNS records into the DNS provider where the domain is registered.
