/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import express, {Request, Response} from "express";
import {initializeApp as initializeAdminApp} from "firebase-admin/app";
import * as admin from "firebase-admin";
import {getFirestore, FieldValue} from "firebase-admin/firestore";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

initializeAdminApp();
const adminDb = getFirestore();

const api = express();
api.use(express.json({limit: "1mb"}));

api.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ok: true});
});

api.post("/admin/grant", async (req: Request, res: Response) => {
  try {
    const adminKey = process.env.ADMIN_GRANT_KEY;
    const providedKey = (req.header("x-admin-key") || "").trim();

    if (!adminKey) {
      res.status(500).json({error: "Missing ADMIN_GRANT_KEY"});
      return;
    }

    if (!providedKey || providedKey !== adminKey) {
      res.status(403).json({error: "Forbidden"});
      return;
    }

    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (!email || !email.includes("@")) {
      res.status(400).json({error: "Invalid email"});
      return;
    }

    const auth = admin.auth();
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, {admin: true});

    res.status(200).json({ok: true, uid: user.uid, email});
  } catch (err) {
    logger.error("Failed to grant admin", err);
    res.status(500).json({error: "Internal error"});
  }
});

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
      res.status(400).json({error: "Invalid amount"});
      return;
    }

    if (typeof currency !== "string" || !currency) {
      res.status(400).json({error: "Invalid currency"});
      return;
    }

    if (typeof donorEmail !== "string" || !donorEmail.includes("@")) {
      res.status(400).json({error: "Invalid donorEmail"});
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

    res.status(201).json({id: docRef.id});
  } catch (err) {
    logger.error("Failed to create donation", err);
    res.status(500).json({error: "Internal error"});
  }
});

export const apiV1 = onRequest({cors: true}, api);

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
