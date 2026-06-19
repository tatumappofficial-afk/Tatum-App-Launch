# Tatum Signup Email Function

Google Cloud Function that receives the app signup webhook, records the signup in Firestore, sends the Tatum welcome email through Gmail/Workspace SMTP with Nodemailer, and records sent emails so each address only gets the welcome email once.

## Required env vars

- `SIGNUP_TOKEN` - shared secret sent by the app.
- `SMTP_USER` - Gmail/Workspace mailbox, for example `tatum.app.official@gmail.com`.
- `SMTP_PASS` - Gmail app password or Workspace SMTP password.

## Optional env vars

- `MAIL_FROM` - defaults to `"Tatum" <SMTP_USER>`.
- `REPLY_TO` - defaults to `SMTP_USER`.
- `SMTP_HOST` - defaults to `smtp.gmail.com`.
- `SMTP_PORT` - defaults to `465`.
- `SMTP_SECURE` - defaults to `true`.
- `SIGNUPS_COLLECTION` - defaults to `signups`.
- `SENT_COLLECTION` - defaults to `tatum_welcome_emails`.

## Local smoke test

```bash
npm install
npm run check
npm run start
```

Then POST the app-shaped payload to `http://localhost:8080`.

## Deploy to Google Cloud Functions

From this folder:

```bash
gcloud functions deploy tatum-signup \
  --gen2 \
  --runtime=nodejs22 \
  --region=us-central1 \
  --source=. \
  --entry-point=tatumSignup \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars=SIGNUP_TOKEN="SIGNUP_TOKEN",SMTP_USER=tatum.app.official@gmail.com,MAIL_FROM='"Tatum" <tatum.app.official@gmail.com>',REPLY_TO=tatum.app.official@gmail.com \
  --set-secrets=SMTP_PASS=tatum-smtp-pass:latest
```

If Secret Manager is not enabled yet, enable it first and store the Gmail app password:

```bash
gcloud services enable secretmanager.googleapis.com --project=project-492ba181-a904-4ba2-b23
printf "GMAIL_APP_PASSWORD" | gcloud secrets create tatum-smtp-pass --project=project-492ba181-a904-4ba2-b23 --data-file=-
```

The current app webhook URL should remain:

```text
https://us-central1-project-492ba181-a904-4ba2-b23.cloudfunctions.net/tatum-signup
```

The app's `EXPO_PUBLIC_SIGNUP_TOKEN` should match `SIGNUP_TOKEN`.

If deploying with Secret Manager for every secret:

```bash
gcloud functions deploy tatum-signup \
  --gen2 \
  --runtime=nodejs22 \
  --region=us-central1 \
  --source=. \
  --entry-point=tatumSignup \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars=MAIL_FROM='"Tatum" <tatum.app.official@gmail.com>',REPLY_TO=tatum.app.official@gmail.com \
  --set-secrets=SIGNUP_TOKEN=tatum-signup-token:latest,SMTP_USER=tatum-smtp-user:latest,SMTP_PASS=tatum-smtp-pass:latest
```

## Test the deployed function

From the repo root:

```bash
npm run test:signup-webhook -- --url "https://FUNCTION_URL" --token "SIGNUP_TOKEN" --email tori@buildwithtori.com --name "Tori"
```
