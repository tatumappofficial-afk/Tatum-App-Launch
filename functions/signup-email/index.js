const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const { Firestore, FieldValue, Timestamp } = require('@google-cloud/firestore')
const nodemailer = require('nodemailer')

const firestore = new Firestore()
const SIGNUPS_COLLECTION = process.env.SIGNUPS_COLLECTION || 'signups'
const SENT_COLLECTION = process.env.SENT_COLLECTION || 'tatum_welcome_emails'
const LOCK_TTL_MS = Number(process.env.LOCK_TTL_MS || 10 * 60 * 1000)

function json(res, status, body) {
  res.status(status).set('Content-Type', 'application/json').send(JSON.stringify(body))
}

function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase()
}

function docIdForEmail(email) {
  return crypto.createHash('sha256').update(normalizeEmail(email)).digest('hex')
}

function firstName(name) {
  const trimmed = String(name || '').trim()
  return trimmed ? trimmed.split(/\s+/)[0] : ''
}

function transporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || 465)
  const secure = String(process.env.SMTP_SECURE || 'true') !== 'false'
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!user || !pass) {
    throw new Error('Missing SMTP_USER or SMTP_PASS')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
}

function smtpConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)
}

function welcomeHtml({ name }) {
  const greeting = firstName(name) ? `Hi ${escapeHtml(firstName(name))},` : 'Hi,'

  return `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Welcome to Tatum</title>
  </head>
  <body style="margin:0;background:#f5efe8;padding:0;color:#31211d;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Thank you for downloading Tatum. A private space to see it, track it, and journal about it.
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5efe8;">
      <tr>
        <td align="center" style="padding:34px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fffaf4;border:1px solid #eadfd7;">
            <tr>
              <td align="center" style="padding:38px 30px 22px 30px;">
                <img src="cid:tatum-logo" alt="Tatum" width="96" style="display:block;width:96px;max-width:96px;height:auto;margin:0 auto 16px auto;" />
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:38px;letter-spacing:12px;color:#b7785e;line-height:1.1;">
                  TATUM
                </div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.45;color:#8e8077;margin-top:12px;">
                  Born from a notebook kept in a nightstand &mdash;<br />
                  dates and initials, a private record of showing up.
                </div>
                <div style="width:180px;border-top:1px solid #d8b7ac;margin:22px auto 0 auto;"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 42px 34px 42px;background-image:linear-gradient(to bottom, rgba(216,198,185,0.32) 1px, transparent 1px);background-size:100% 30px;">
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.35;color:#86485f;margin-bottom:16px;">
                  ${greeting}
                </div>

                ${paragraph('Tatum was built for all the phases of life a woman goes through. It is for the woman who is dating and has never had a single, private space to log her partners, rank her experiences, and decide if a second date is even worth it.')}

                ${paragraph('Tatum is for the new mom who thinks intimacy twice this month means she is failing, when really she is balancing it all and doing great. Tatum is for women navigating perimenopause and menopause who might feel disconnected from their bodies amidst all the constant changes. And Tatum was made to help the woman with low desire who has never once been told that fluctuation is completely normal.')}

                ${paragraph('Whichever phase you are in, and whatever season of life you are experiencing, Tatum was made to help. My hope is that we can remove the negative thoughts so many of us carry about our sex lives. Now you can see it, track it, and journal about it.')}

                <p style="font-family:Georgia,'Times New Roman',serif;font-size:21px;line-height:1.58;color:#86485f;margin:28px 0 28px 0;">
                  With so much appreciation, support, and love, thank you for downloading Tatum.
                </p>

                <div style="font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.1;color:#86485f;margin-top:16px;">
                  Alanna Small
                </div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9b8d83;margin-top:7px;">
                  Founder, Tatum App LLC
                </div>

                <div style="border-top:1px solid #ead8d0;margin:26px 0 20px 0;"></div>

                ${paragraph('P.S. &mdash; I would love for you to share Tatum with the other women in your life who need this same support, and who may have never had a tool to track their sex life and see just how much they are showing up.', '#86485f')}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 30px 30px 30px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#b7785e;">
                  tatumapp.com &nbsp;&middot;&nbsp; @thetatumapp
                </div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9b8d83;margin-top:12px;">
                  You are receiving this because you downloaded Tatum.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function paragraph(text, color = '#31211d') {
  return `<p style="font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:1.62;color:${color};margin:0 0 22px 0;">${text}</p>`
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function welcomeText({ name }) {
  const greeting = firstName(name) ? `Hi ${firstName(name)},` : 'Hi,'
  return `${greeting}

Tatum was built for all the phases of life a woman goes through. It is for the woman who is dating and has never had a single, private space to log her partners, rank her experiences, and decide if a second date is even worth it.

Tatum is for the new mom who thinks intimacy twice this month means she is failing, when really she is balancing it all and doing great. Tatum is for women navigating perimenopause and menopause who might feel disconnected from their bodies amidst all the constant changes. And Tatum was made to help the woman with low desire who has never once been told that fluctuation is completely normal.

Whichever phase you are in, and whatever season of life you are experiencing, Tatum was made to help. My hope is that we can remove the negative thoughts so many of us carry about our sex lives. Now you can see it, track it, and journal about it.

With so much appreciation, support, and love, thank you for downloading Tatum.

Alanna Small
Founder, Tatum App LLC

P.S. - I would love for you to share Tatum with the other women in your life who need this same support, and who may have never had a tool to track their sex life and see just how much they are showing up.

tatumapp.com - @thetatumapp
You are receiving this because you downloaded Tatum.`
}

async function claimSend(email, record) {
  const ref = firestore.collection(SENT_COLLECTION).doc(docIdForEmail(email))
  const now = Timestamp.now()
  const lockExpiresAt = Timestamp.fromMillis(Date.now() + LOCK_TTL_MS)

  return firestore.runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    const data = snap.exists ? snap.data() : null

    if (data?.welcomeSentAt) {
      return { status: 'already_sent', ref }
    }

    if (data?.status === 'sending' && data.lockExpiresAt?.toMillis?.() > Date.now()) {
      return { status: 'in_progress', ref }
    }

    tx.set(
      ref,
      {
        email,
        status: 'sending',
        signup: record,
        updatedAt: now,
        lockExpiresAt,
        createdAt: data?.createdAt || now,
      },
      { merge: true },
    )

    return { status: 'claimed', ref }
  })
}

async function recordSignupLog(record) {
  await firestore.collection(SIGNUPS_COLLECTION).add({
    name: record.name,
    email: record.email,
    attested18: record.attested18,
    ageVerdict: record.ageVerdict,
    platform: record.platform,
    provider: record.provider,
    providerUserId: record.providerUserId,
    createdAt: FieldValue.serverTimestamp(),
  })
}

async function markSent(ref, messageId) {
  await ref.set(
    {
      status: 'sent',
      welcomeSentAt: FieldValue.serverTimestamp(),
      messageId,
      updatedAt: FieldValue.serverTimestamp(),
      lockExpiresAt: FieldValue.delete(),
    },
    { merge: true },
  )
}

async function markFailed(ref, err) {
  await ref.set(
    {
      status: 'failed',
      error: String(err?.message || err).slice(0, 1000),
      updatedAt: FieldValue.serverTimestamp(),
      lockExpiresAt: FieldValue.delete(),
    },
    { merge: true },
  )
}

// In-app "Delete Account & Data" (App Store guideline 5.1.1(v)). Removes every
// server-side trace of a signup: the signups log entries (matched by email
// and/or providerUserId) and the welcome-email doc (which embeds a copy of the
// signup record). The user's actual content never leaves their device, so this
// completes the account deletion.
async function handleDelete(req, res) {
  const email = normalizeEmail(req.body?.email)
  const providerUserId = req.body?.providerUserId ? String(req.body.providerUserId) : null

  if (!email && !providerUserId) {
    json(res, 200, { ok: true, skipped: 'missing_identity' })
    return
  }

  const refs = new Map()
  if (email) {
    const byEmail = await firestore.collection(SIGNUPS_COLLECTION).where('email', '==', email).get()
    byEmail.docs.forEach((doc) => refs.set(doc.ref.path, doc.ref))
  }
  if (providerUserId) {
    const byProvider = await firestore
      .collection(SIGNUPS_COLLECTION)
      .where('providerUserId', '==', providerUserId)
      .get()
    byProvider.docs.forEach((doc) => refs.set(doc.ref.path, doc.ref))
  }
  if (email) {
    refs.set(
      `${SENT_COLLECTION}/${docIdForEmail(email)}`,
      firestore.collection(SENT_COLLECTION).doc(docIdForEmail(email)),
    )
  }

  const batch = firestore.batch()
  refs.forEach((ref) => batch.delete(ref))
  await batch.commit()

  json(res, 200, { ok: true, deleted: refs.size })
}

async function handleSignup(req, res) {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'POST') {
    json(res, 405, { ok: false, error: 'method_not_allowed' })
    return
  }

  const expectedToken = process.env.SIGNUP_TOKEN
  if (!expectedToken || req.body?.token !== expectedToken) {
    json(res, 401, { ok: false, error: 'unauthorized' })
    return
  }

  if (req.body?.action === 'delete') {
    await handleDelete(req, res)
    return
  }

  const email = normalizeEmail(req.body?.email)
  if (!email) {
    json(res, 200, { ok: true, skipped: 'missing_email' })
    return
  }

  const record = {
    name: String(req.body?.name || '').trim(),
    email,
    platform: String(req.body?.platform || 'unknown'),
    attested18: Boolean(req.body?.attested18),
    ageVerdict: String(req.body?.ageVerdict || 'unknown'),
    provider: req.body?.provider ? String(req.body.provider) : null,
    providerUserId: req.body?.providerUserId ? String(req.body.providerUserId) : null,
    receivedAt: new Date().toISOString(),
  }

  await recordSignupLog(record)

  if (!smtpConfigured()) {
    json(res, 200, { ok: true, skipped: 'smtp_not_configured' })
    return
  }

  const claim = await claimSend(email, record)
  if (claim.status !== 'claimed') {
    json(res, 200, { ok: true, skipped: claim.status })
    return
  }

  try {
    const logoPath = path.join(process.cwd(), 'assets', 'tatum-logo-email.png')
    const info = await transporter().sendMail({
      from: process.env.MAIL_FROM || `"Tatum" <${process.env.SMTP_USER}>`,
      to: email,
      replyTo: process.env.REPLY_TO || process.env.SMTP_USER,
      subject: process.env.MAIL_SUBJECT || 'Welcome to Tatum',
      text: welcomeText(record),
      html: welcomeHtml(record),
      attachments: fs.existsSync(logoPath)
        ? [
            {
              filename: 'tatum-logo.png',
              path: logoPath,
              cid: 'tatum-logo',
            },
          ]
        : [],
    })

    await markSent(claim.ref, info.messageId)
    json(res, 200, { ok: true, sent: true })
  } catch (err) {
    await markFailed(claim.ref, err)
    console.error('welcome email failed', err)
    json(res, 500, { ok: false, error: 'email_send_failed' })
  }
}

exports.tatumSignup = handleSignup
exports.signupEmail = handleSignup
