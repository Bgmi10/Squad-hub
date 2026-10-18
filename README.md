# Squad Hub (Next.js 14 + Prisma + Tailwind + S3)

1. `npm install && cp .env.example .env` and fill it in
2. `npx prisma db push && npm run dev`
3. S3 bucket setup:
   - CORS: allow `PUT` from your site origin, header `Content-Type`
   - Public read for `players/*` (bucket policy) or serve via CloudFront and set `S3_PUBLIC_BASE_URL`
   - IAM user: `s3:PutObject` on `arn:aws:s3:::BUCKET/players/*`
4. Reminders: schedule `GET /api/cron/reminders` every 5-10 min with `Authorization: Bearer $CRON_SECRET`,
   then wire your email/SMS provider into that route.
