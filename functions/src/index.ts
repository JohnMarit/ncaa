/**
 * Firebase Cloud Functions – NCAA Admin API
 * Includes: donations, OTP-based admin login
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import { defineSecret } from "firebase-functions/params";
import express, { Request, Response } from "express";
import cors from "cors";
import { initializeApp as initializeAdminApp } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import * as nodemailer from "nodemailer";

setGlobalOptions({ maxInstances: 10 });

const GMAIL_USER = defineSecret("GMAIL_USER");
const GMAIL_PASS = defineSecret("GMAIL_PASS");

initializeAdminApp();
const adminDb = getFirestore();

const api = express();
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://www.ncaa.org.ss",
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean) as string[];

const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (no Origin) and same-origin.
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

api.use(corsMiddleware);
api.options(/.*/, corsMiddleware);
api.use(express.json({ limit: "1mb" }));

// ─────────────────────────────────────────────
// Email transporter (Gmail SMTP via App Password)
// Set these in Firebase Function config or .env
// ─────────────────────────────────────────────
function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER.value(),   // e.g. johnmarit42@gmail.com
      pass: GMAIL_PASS.value(),   // Gmail App Password (16 chars)
    },
  });
}

// ─────────────────────────────────────────────
// Authorised admin emails (whitelist)
// ─────────────────────────────────────────────
const ADMIN_EMAILS = [
  "johnmarit42@gmail.com",
  // Add more admin emails here later
];

// ─────────────────────────────────────────────
// POST /auth/send-otp
// Body: { email: string }
// ─────────────────────────────────────────────
api.post("/auth/send-otp", async (req: Request, res: Response) => {
  try {
    const { email } = req.body ?? {};

    if (typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ error: "Invalid email" });
      return;
    }

    const normalised = email.trim().toLowerCase();

    if (!ADMIN_EMAILS.includes(normalised)) {
      // Generic error so we don't leak the whitelist
      res.status(403).json({ error: "Email not authorised for admin access" });
      return;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Timestamp.fromDate(new Date(Date.now() + 2 * 60 * 1000)); // 2 min

    // Store OTP in Firestore (overwrite any previous pending OTP for this email)
    await adminDb.collection("admin_otps").doc(normalised).set({
      otp,
      expiresAt,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Send email
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"NCAA Admin" <${GMAIL_USER.value()}>`,
      to: normalised,
      subject: "Your NCAA Admin Login Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: rgb(249,250,251); border-radius: 12px;">
          <h2 style="color: rgb(30,58,95); margin-bottom: 8px;">NCAA Admin Login</h2>
          <p style="color: rgb(75,85,99); margin-bottom: 24px;">Here is your one-time login code. It expires in <strong>2 minutes</strong>.</p>
          <div style="background: rgb(255,255,255); border: 1px solid rgb(229,231,235); border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 40px; font-weight: 700; letter-spacing: 12px; color: rgb(30,58,95);">${otp}</span>
          </div>
          <p style="color: rgb(107,114,128); font-size: 13px;">If you did not request this code, please ignore this email.</p>
        </div>
      `,
    });

    logger.info("OTP sent", { email: normalised });
    res.status(200).json({ success: true });
  } catch (err) {
    logger.error("Failed to send OTP", err);
    res.status(500).json({ error: "Failed to send OTP. Please try again." });
  }
});

// ─────────────────────────────────────────────
// POST /auth/verify-otp
// Body: { email: string, otp: string }
// ─────────────────────────────────────────────
api.post("/auth/verify-otp", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body ?? {};

    if (typeof email !== "string" || typeof otp !== "string") {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const normalised = email.trim().toLowerCase();
    const docRef = adminDb.collection("admin_otps").doc(normalised);
    const snap = await docRef.get();

    if (!snap.exists) {
      res.status(400).json({ error: "No OTP found. Please request a new code." });
      return;
    }

    const data = snap.data()!;
    const expiresAt = (data.expiresAt as Timestamp).toDate();

    if (new Date() > expiresAt) {
      await docRef.delete();
      res.status(400).json({ error: "Code expired. Please request a new code." });
      return;
    }

    if (data.otp !== otp.trim()) {
      res.status(400).json({ error: "Incorrect code. Please try again." });
      return;
    }

    // OTP is valid – delete it (single use)
    await docRef.delete();

    logger.info("OTP verified", { email: normalised });
    res.status(200).json({ success: true });
  } catch (err) {
    logger.error("Failed to verify OTP", err);
    res.status(500).json({ error: "Verification failed. Please try again." });
  }
});

// ─────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────
api.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

// ─────────────────────────────────────────────
// POST /donations
// ─────────────────────────────────────────────
api.post("/donations", async (req: Request, res: Response) => {
  try {
    const {
      amount,
      currency,
      donorName,
      donorEmail,
      donorPhone,
      paystackReference,
    } = req.body ?? {};

    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      res.status(400).json({ error: "Invalid amount" });
      return;
    }

    if (typeof currency !== "string" || !currency) {
      res.status(400).json({ error: "Invalid currency" });
      return;
    }

    if (typeof donorEmail !== "string" || !donorEmail.includes("@")) {
      res.status(400).json({ error: "Invalid donorEmail" });
      return;
    }

    const donationDoc = {
      amount,
      currency,
      donorName: typeof donorName === "string" ? donorName : null,
      donorEmail,
      donorPhone: typeof donorPhone === "string" ? donorPhone : null,
      provider: "paystack",
      paystackReference: typeof paystackReference === "string" ? paystackReference : null,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection("donations").add(donationDoc);
    res.status(201).json({ id: docRef.id });
  } catch (err) {
    logger.error("Failed to create donation", err);
    res.status(500).json({ error: "Internal error" });
  }
});

export const apiV1 = onRequest({ cors: true, secrets: [GMAIL_USER, GMAIL_PASS] }, api);

