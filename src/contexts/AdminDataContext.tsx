import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { upcomingEvents as staticUpcomingEvents, pastEvents as staticPastEvents } from "@/data/events";
import type { UpcomingEvent, PastEvent } from "@/data/events";
import { executiveCommittee as staticExecutive, payamRepresentatives as staticPayam } from "@/data/leadership";
import type { ExecutiveCommitteeMember, PayamRepresentative } from "@/data/leadership";
import { onIdTokenChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";

export type MemberStatus = "approved" | "pending" | "rejected";
export type PaymentStatus = "paid" | "pending" | "failed";

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  payam: string;
  currentLocation?: string;
  status: MemberStatus;
  membershipType?: string;
  appliedDate: string;
  paymentStatus: PaymentStatus;
}

export interface Payment {
  id: string;
  memberName: string;
  memberEmail: string;
  amount: string;
  type: string;
  date: string;
  status: PaymentStatus;
  method: string;
}

export type NotificationType = "approval" | "message";

export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  link: string;
}

export interface Election {
  id: string;
  title: string;
  positions: string[];
  status: string;
  startDate: string;
  endDate: string;
  totalVoters: number;
  nominationsReceived: number;
  votesCast: number;
}

export interface Nomination {
  id: string;
  candidateName: string;
  position: string;
  electionId: string;
  status: "pending" | "approved";
  submittedDate: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  version: string;
  date: string;
  size: string;
  type: string;
  status: "published" | "draft";
  fileUrl?: string;
}

export interface AdminExecutiveMember {
  id: string;
  name: string;
  position: string;
  description: string;
  color: string;
  icon?: string;
  image?: string;
}

export interface AdminPayamRepresentative {
  id: string;
  name: string;
  payam: string;
  /** Optional title e.g. Chairlady of Kongor First Class */
  position?: string;
  /** Optional profile image URL */
  image?: string;
}

export interface AdminEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "upcoming" | "past";
  attendees: number;
  status: "active" | "completed";
  image?: string;
  /** ISO timestamp set when an admin explicitly moves an event to Past (used for ordering). */
  pastMarkedAt?: string;
  /** ISO date string; set on create for ordering. */
  createdAt?: string;
  /** If true, event is shown on public site. Draft events are admin-only. */
  published?: boolean;
}

export interface AdminScholarship {
  id: string;
  title: string;
  description: string;
  /** URL for the application form or page */
  applicationLink: string;
  /** ISO date string; set on create for ordering. */
  createdAt?: string;
}

interface AdminDataContextType {
  members: Member[];
  payments: Payment[];
  notifications: AdminNotification[];
  elections: Election[];
  nominations: Nomination[];
  documents: DocumentItem[];
  executiveCommittee: AdminExecutiveMember[];
  payamRepresentatives: AdminPayamRepresentative[];
  events: AdminEvent[];
  scholarships: AdminScholarship[];
  addMember: (member: Omit<Member, "id" | "status" | "appliedDate" | "paymentStatus">) => void;
  updateMember: (id: string, updates: Partial<Omit<Member, "id" | "appliedDate">>) => void;
  approveMember: (id: string) => void;
  rejectMember: (id: string) => void;
  addPayment: (payment: Omit<Payment, "id" | "date" | "status"> & { status?: PaymentStatus }) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addElection: (election: Omit<Election, "id" | "nominationsReceived" | "votesCast">) => void;
  updateElection: (id: string, updates: Partial<Election>) => void;
  deleteElection: (id: string) => void;
  addNomination: (nomination: Omit<Nomination, "id" | "submittedDate">) => void;
  approveNomination: (id: string) => void;
  rejectNomination: (id: string) => void;
  addDocument: (document: Omit<DocumentItem, "id" | "date">) => void;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;
  addExecutiveMember: (member: Omit<AdminExecutiveMember, "id">) => Promise<void>;
  updateExecutiveMember: (id: string, updates: Partial<AdminExecutiveMember>) => Promise<void>;
  deleteExecutiveMember: (id: string) => Promise<void>;
  addPayamRepresentative: (rep: Omit<AdminPayamRepresentative, "id">) => Promise<void>;
  updatePayamRepresentative: (id: string, updates: Partial<AdminPayamRepresentative>) => Promise<void>;
  deletePayamRepresentative: (id: string) => Promise<void>;
  addEvent: (event: Omit<AdminEvent, "id">) => Promise<void>;
  updateEvent: (id: string, updates: Partial<AdminEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addScholarship: (scholarship: Omit<AdminScholarship, "id">) => void;
  updateScholarship: (id: string, updates: Partial<AdminScholarship>) => void;
  deleteScholarship: (id: string) => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  members: "nca_admin_members",
  payments: "nca_admin_payments",
  notifications: "nca_admin_notifications",
  elections: "nca_admin_elections",
  nominations: "nca_admin_nominations",
  documents: "nca_admin_documents",
  executiveCommittee: "nca_admin_executive_committee",
  payamRepresentatives: "nca_admin_payam_representatives",
  events: "nca_admin_events",
  scholarships: "nca_admin_scholarships",
};

const FIRESTORE_COLLECTIONS = {
  events: "events",
  leadershipExecutive: "leadership_executive",
  leadershipPayam: "leadership_payam",
  documents: "documents",
  scholarships: "scholarships",
  members: "members",
  payments: "payments",
  notifications: "notifications",
  elections: "elections",
  nominations: "nominations",
} as const;

const FIRESTORE_DOCS = {
  leadership: "default",
} as const;

/** Map of event title -> static image URL so we can apply images to events loaded from localStorage. */
const staticEventImages: Record<string, string> = {};
[...staticUpcomingEvents, ...staticPastEvents].forEach((e) => {
  if (e.image && typeof e.image === "string") staticEventImages[e.title] = e.image;
});

function seedEventsFromStatic(): AdminEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const result: AdminEvent[] = [];
  staticUpcomingEvents.forEach((e: UpcomingEvent) => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    result.push({
      id: `seed-upcoming-${e.id}`,
      title: e.title,
      description: e.description,
      date: e.date,
      time: e.time,
      location: e.location,
      type: eventDate >= today ? "upcoming" : "past",
      attendees: e.attendees,
      status: "active",
      image: e.image,
      createdAt: new Date(0).toISOString(),
      published: true,
    });
  });
  staticPastEvents.forEach((e: PastEvent) => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    result.push({
      id: `seed-past-${e.id}`,
      title: e.title,
      description: e.description ?? "",
      date: e.date,
      time: "",
      location: e.location,
      type: "past",
      attendees: e.attendees,
      status: "completed",
      image: typeof e.image === "string" ? e.image : undefined,
      createdAt: new Date(0).toISOString(),
      published: true,
    });
  });
  return result;
}

function seedExecutiveFromStatic(): AdminExecutiveMember[] {
  return staticExecutive.map((m: ExecutiveCommitteeMember) => {
    let iconName = "UserCircle";
    try {
      if (typeof m.icon === "function") {
        const iconFunc = m.icon as { name?: string };
        iconName = iconFunc.name || "UserCircle";
      }
    } catch {
      iconName = "UserCircle";
    }
    return {
      id: crypto.randomUUID(),
      name: m.name,
      position: m.position,
      description: m.description,
      color: m.color,
      icon: iconName,
      image: m.image,
    };
  });
}

function seedPayamFromStatic(): AdminPayamRepresentative[] {
  return staticPayam.map((p: PayamRepresentative) => ({
    id: crypto.randomUUID(),
    name: p.name,
    payam: p.payam,
    ...(p.position !== undefined && { position: p.position }),
    ...(p.image !== undefined && { image: p.image }),
  }));
}

export const AdminDataProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [elections, setElections] = useState<Election[]>([]);
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [executiveCommittee, setExecutiveCommittee] = useState<AdminExecutiveMember[]>([]);
  const [payamRepresentatives, setPayamRepresentatives] = useState<AdminPayamRepresentative[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [scholarships, setScholarships] = useState<AdminScholarship[]>([]);
  const [isAdminUser, setIsAdminUser] = useState(false);

  const requireAdminSession = () => {
    if (!auth.currentUser) {
      throw new Error("You must be logged in as an admin to perform this action.");
    }
    if (!isAdminUser) {
      throw new Error("Admin permissions are not available yet. Please wait a moment and try again.");
    }
  };

  useEffect(() => {
    const unsub = onIdTokenChanged(auth, (user) => {
      if (!user) {
        setIsAdminUser(false);
        return;
      }

      user
        .getIdTokenResult()
        .then(async (r) => {
          if (r?.claims?.admin === true) {
            setIsAdminUser(true);
            return;
          }

          try {
            const refreshed = await user.getIdTokenResult(true);
            setIsAdminUser(refreshed?.claims?.admin === true);
          } catch {
            setIsAdminUser(false);
          }
        })
        .catch(() => {
          setIsAdminUser(false);
        });
    });

    return () => {
      unsub();
    };
  }, []);

  // Load from localStorage on mount (for non-Firestore-backed datasets)
  useEffect(() => {
    // Intentionally empty: all datasets are now Firestore-backed.
  }, []);

  useEffect(() => {
    if (isAdminUser) return;
    setMembers([]);
    setPayments([]);
    setNotifications([]);
    setNominations([]);
  }, [isAdminUser]);

  // Firestore: members – real-time sync + one-time seed
  useEffect(() => {
    if (!isAdminUser) return;
    const membersCol = collection(db, FIRESTORE_COLLECTIONS.members);

    const seedMembersIfEmpty = async () => {
      const snap = await getDocs(query(membersCol));
      if (!snap.empty) return;

      let seed: Member[] | null = null;
      const stored = localStorage.getItem(STORAGE_KEYS.members);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Member[];
          if (Array.isArray(parsed) && parsed.length > 0) seed = parsed;
        } catch {
          // ignore
        }
      }

      if (!seed) return;
      await Promise.all(seed.map((m) => setDoc(doc(db, FIRESTORE_COLLECTIONS.members, m.id), m)));
    };

    seedMembersIfEmpty().catch(() => {
      // ignore
    });

    const unsub = onSnapshot(
      query(membersCol),
      (snap) => {
        const loaded: Member[] = [];
        snap.forEach((d) => {
          const raw = d.data() as Omit<Member, "id">;
          loaded.push({ id: d.id, ...raw });
        });
        setMembers(loaded);
      },
      () => {
        // ignore
      }
    );

    return () => {
      unsub();
    };
  }, [isAdminUser]);

  // Firestore: payments – real-time sync + one-time seed
  useEffect(() => {
    if (!isAdminUser) return;
    const paymentsCol = collection(db, FIRESTORE_COLLECTIONS.payments);

    const seedPaymentsIfEmpty = async () => {
      const snap = await getDocs(query(paymentsCol));
      if (!snap.empty) return;

      let seed: Payment[] | null = null;
      const stored = localStorage.getItem(STORAGE_KEYS.payments);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Payment[];
          if (Array.isArray(parsed) && parsed.length > 0) seed = parsed;
        } catch {
          // ignore
        }
      }

      if (!seed) return;
      await Promise.all(seed.map((p) => setDoc(doc(db, FIRESTORE_COLLECTIONS.payments, p.id), p)));
    };

    seedPaymentsIfEmpty().catch(() => {
      // ignore
    });

    const unsub = onSnapshot(
      query(paymentsCol),
      (snap) => {
        const loaded: Payment[] = [];
        snap.forEach((d) => {
          const raw = d.data() as Omit<Payment, "id">;
          loaded.push({ id: d.id, ...raw });
        });
        setPayments(loaded);
      },
      () => {
        // ignore
      }
    );

    return () => {
      unsub();
    };
  }, [isAdminUser]);

  // Firestore: notifications – real-time sync + one-time seed
  useEffect(() => {
    if (!isAdminUser) return;
    const notificationsCol = collection(db, FIRESTORE_COLLECTIONS.notifications);

    const seedNotificationsIfEmpty = async () => {
      const snap = await getDocs(query(notificationsCol));
      if (!snap.empty) return;

      let seed: AdminNotification[] | null = null;
      const stored = localStorage.getItem(STORAGE_KEYS.notifications);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as AdminNotification[];
          if (Array.isArray(parsed) && parsed.length > 0) seed = parsed;
        } catch {
          // ignore
        }
      }

      if (!seed) return;
      await Promise.all(seed.map((n) => setDoc(doc(db, FIRESTORE_COLLECTIONS.notifications, n.id), n)));
    };

    seedNotificationsIfEmpty().catch(() => {
      // ignore
    });

    const unsub = onSnapshot(
      query(notificationsCol),
      (snap) => {
        const loaded: AdminNotification[] = [];
        snap.forEach((d) => {
          const raw = d.data() as Omit<AdminNotification, "id">;
          loaded.push({ id: d.id, ...raw });
        });
        setNotifications(loaded);
      },
      () => {
        // ignore
      }
    );

    return () => {
      unsub();
    };
  }, [isAdminUser]);

  // Firestore: elections – real-time sync + one-time seed
  useEffect(() => {
    const electionsCol = collection(db, FIRESTORE_COLLECTIONS.elections);

    const seedElectionsIfEmpty = async () => {
      if (!isAdminUser) return;
      const snap = await getDocs(query(electionsCol));
      if (!snap.empty) return;

      let seed: Election[] | null = null;
      const stored = localStorage.getItem(STORAGE_KEYS.elections);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Election[];
          if (Array.isArray(parsed) && parsed.length > 0) seed = parsed;
        } catch {
          // ignore
        }
      }

      if (!seed) return;
      await Promise.all(seed.map((e) => setDoc(doc(db, FIRESTORE_COLLECTIONS.elections, e.id), e)));
    };

    seedElectionsIfEmpty().catch(() => {
      // ignore
    });

    const unsub = onSnapshot(
      query(electionsCol),
      (snap) => {
        const loaded: Election[] = [];
        snap.forEach((d) => {
          const raw = d.data() as Omit<Election, "id">;
          loaded.push({ id: d.id, ...raw });
        });
        setElections(loaded);
      },
      () => {
        // ignore
      }
    );

    return () => {
      unsub();
    };
  }, [isAdminUser]);

  // Firestore: nominations – real-time sync + one-time seed
  useEffect(() => {
    if (!isAdminUser) return;
    const nominationsCol = collection(db, FIRESTORE_COLLECTIONS.nominations);

    const seedNominationsIfEmpty = async () => {
      const snap = await getDocs(query(nominationsCol));
      if (!snap.empty) return;

      let seed: Nomination[] | null = null;
      const stored = localStorage.getItem(STORAGE_KEYS.nominations);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Nomination[];
          if (Array.isArray(parsed) && parsed.length > 0) seed = parsed;
        } catch {
          // ignore
        }
      }

      if (!seed) return;
      await Promise.all(seed.map((n) => setDoc(doc(db, FIRESTORE_COLLECTIONS.nominations, n.id), n)));
    };

    seedNominationsIfEmpty().catch(() => {
      // ignore
    });

    const unsub = onSnapshot(
      query(nominationsCol),
      (snap) => {
        const loaded: Nomination[] = [];
        snap.forEach((d) => {
          const raw = d.data() as Omit<Nomination, "id">;
          loaded.push({ id: d.id, ...raw });
        });
        setNominations(loaded);
      },
      () => {
        // ignore
      }
    );

    return () => {
      unsub();
    };
  }, [isAdminUser]);

  // Firestore: documents – real-time sync + one-time seed
  useEffect(() => {
    const docsCol = collection(db, FIRESTORE_COLLECTIONS.documents);

    const seedDocumentsIfEmpty = async () => {
      if (!isAdminUser) return;
      const snap = await getDocs(query(docsCol));
      if (!snap.empty) return;

      let seed: DocumentItem[] | null = null;
      const stored = localStorage.getItem(STORAGE_KEYS.documents);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as DocumentItem[];
          if (Array.isArray(parsed) && parsed.length > 0) seed = parsed;
        } catch {
          // ignore
        }
      }

      if (!seed) return;

      await Promise.all(seed.map((d) => setDoc(doc(db, FIRESTORE_COLLECTIONS.documents, d.id), d)));
    };

    seedDocumentsIfEmpty().catch(() => {
      // ignore
    });

    const unsub = onSnapshot(
      query(docsCol),
      (snap) => {
        const loaded: DocumentItem[] = [];
        snap.forEach((d) => {
          const raw = d.data() as Omit<DocumentItem, "id">;
          loaded.push({ id: d.id, ...raw });
        });
        setDocuments(loaded);
      },
      () => {
        // ignore
      }
    );

    return () => {
      unsub();
    };
  }, [isAdminUser]);

  // Firestore: scholarships – real-time sync + one-time seed
  useEffect(() => {
    const scholarshipsCol = collection(db, FIRESTORE_COLLECTIONS.scholarships);

    const seedScholarshipsIfEmpty = async () => {
      if (!isAdminUser) return;
      const snap = await getDocs(query(scholarshipsCol));
      if (!snap.empty) return;

      let seed: AdminScholarship[] | null = null;
      const stored = localStorage.getItem(STORAGE_KEYS.scholarships);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as AdminScholarship[];
          if (Array.isArray(parsed) && parsed.length > 0) seed = parsed;
        } catch {
          // ignore
        }
      }

      if (!seed) return;
      await Promise.all(seed.map((s) => setDoc(doc(db, FIRESTORE_COLLECTIONS.scholarships, s.id), s)));
    };

    seedScholarshipsIfEmpty().catch(() => {
      // ignore
    });

    const unsub = onSnapshot(
      query(scholarshipsCol),
      (snap) => {
        const loaded: AdminScholarship[] = [];
        snap.forEach((d) => {
          const raw = d.data() as Omit<AdminScholarship, "id">;
          loaded.push({ id: d.id, ...raw });
        });
        setScholarships(loaded);
      },
      () => {
        // ignore
      }
    );

    return () => {
      unsub();
    };
  }, [isAdminUser]);

  // Firestore: leadership (executive + payam) – real-time sync + one-time seed
  useEffect(() => {
    const execRef = doc(db, FIRESTORE_COLLECTIONS.leadershipExecutive, FIRESTORE_DOCS.leadership);
    const payamRef = doc(db, FIRESTORE_COLLECTIONS.leadershipPayam, FIRESTORE_DOCS.leadership);

    const seedLeadershipIfMissing = async () => {
      const [execSnap, payamSnap] = await Promise.all([getDoc(execRef), getDoc(payamRef)]);

      if (!execSnap.exists()) {
        let seed: AdminExecutiveMember[] | null = null;
        const stored = localStorage.getItem(STORAGE_KEYS.executiveCommittee);
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as AdminExecutiveMember[];
            if (Array.isArray(parsed) && parsed.length > 0) seed = parsed;
          } catch {
            // ignore
          }
        }
        if (!seed) seed = seedExecutiveFromStatic();
        await setDoc(execRef, { items: seed });
      }

      if (!payamSnap.exists()) {
        let seed: AdminPayamRepresentative[] | null = null;
        const stored = localStorage.getItem(STORAGE_KEYS.payamRepresentatives);
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as AdminPayamRepresentative[];
            if (Array.isArray(parsed) && parsed.length > 0) seed = parsed;
          } catch {
            // ignore
          }
        }
        if (!seed) seed = seedPayamFromStatic();
        await setDoc(payamRef, { items: seed });
      }
    };

    if (isAdminUser) {
      seedLeadershipIfMissing().catch(() => {
        // ignore; subscriptions will still attempt to read.
      });
    }

    const unsubExec = onSnapshot(
      execRef,
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data() as { items?: AdminExecutiveMember[] };
        if (Array.isArray(data.items)) setExecutiveCommittee(data.items);
      },
      () => {
        // ignore
      }
    );

    const unsubPayam = onSnapshot(
      payamRef,
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data() as { items?: AdminPayamRepresentative[] };
        if (Array.isArray(data.items)) setPayamRepresentatives(data.items);
      },
      () => {
        // ignore
      }
    );

    return () => {
      unsubExec();
      unsubPayam();
    };
  }, [isAdminUser]);

  // Firestore: events – real-time sync + one-time seed
  useEffect(() => {
    const eventsCol = collection(db, FIRESTORE_COLLECTIONS.events);

    const seedEventsIfEmpty = async () => {
      if (!isAdminUser) return;
      const snap = await getDocs(query(eventsCol));
      if (!snap.empty) return;

      let seed: AdminEvent[] | null = null;
      const stored = localStorage.getItem(STORAGE_KEYS.events);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as AdminEvent[];
          if (Array.isArray(parsed) && parsed.length > 0) seed = parsed;
        } catch {
          // ignore
        }
      }
      if (!seed) seed = seedEventsFromStatic();

      await Promise.all(
        seed.map((e) =>
          setDoc(doc(db, FIRESTORE_COLLECTIONS.events, e.id), {
            ...e,
            image: e.image || staticEventImages[e.title] || undefined,
          })
        )
      );
    };

    seedEventsIfEmpty().catch(() => {
      // ignore
    });

    const unsub = onSnapshot(
      query(eventsCol),
      (snap) => {
        const loaded: AdminEvent[] = [];
        snap.forEach((d) => {
          const raw = d.data() as Omit<AdminEvent, "id">;
          let updated: AdminEvent = { id: d.id, ...raw };

        // Normalize legacy content changes
        if (updated.title === "International Girls' Day") {
          updated = { ...updated, title: "International Women's Day" };
        }
        if (updated.description && updated.description.includes("International Girls' Day")) {
          updated = {
            ...updated,
            description: updated.description.replace(/International Girls' Day/g, "International Women's Day"),
          };
        }
        if (updated.description && updated.description.includes("girls' achievements")) {
          updated = {
            ...updated,
            description: updated.description.replace(/girls' achievements/g, "women's achievements"),
          };
        }

          loaded.push({
            ...updated,
            image: updated.image || staticEventImages[updated.title] || undefined,
          });
        });
        setEvents(loaded);
      },
      () => {
        // ignore
      }
    );

    return () => {
      unsub();
    };
  }, [isAdminUser]);

  // Note: leadership + events are Firestore-backed; we intentionally do not persist them to localStorage.

  // Note: documents + scholarships are Firestore-backed; we intentionally do not persist them to localStorage.

  const addMember: AdminDataContextType["addMember"] = (input) => {
    const now = new Date();
    const newMember: Member = {
      id: crypto.randomUUID(),
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      payam: input.payam,
      currentLocation: input.currentLocation,
      membershipType: input.membershipType,
      appliedDate: now.toISOString(),
      status: "pending",
      paymentStatus: "pending",
    };

    void setDoc(doc(db, FIRESTORE_COLLECTIONS.members, newMember.id), newMember);

    // Create an admin notification only when an authenticated admin is present.
    // Public membership applications should still succeed without Firebase Auth.
    if (auth.currentUser) {
      const notification: AdminNotification = {
        id: crypto.randomUUID(),
        type: "approval",
        title: "New Membership Application",
        description: `${newMember.firstName} ${newMember.lastName} has applied for membership.`,
        time: now.toISOString(),
        unread: true,
        link: "/admin/members",
      };
      void setDoc(doc(db, FIRESTORE_COLLECTIONS.notifications, notification.id), notification).catch(() => {
        // ignore
      });
    }
  };

  const updateMember = (id: string, updates: Partial<Omit<Member, "id" | "appliedDate">>) => {
    void updateDoc(doc(db, FIRESTORE_COLLECTIONS.members, id), updates as Record<string, unknown>);
  };

  const approveMember = (id: string) => {
    void updateDoc(doc(db, FIRESTORE_COLLECTIONS.members, id), { status: "approved" });
  };

  const rejectMember = (id: string) => {
    void updateDoc(doc(db, FIRESTORE_COLLECTIONS.members, id), { status: "rejected" });
  };

  const addPayment: AdminDataContextType["addPayment"] = (input) => {
    const now = new Date();
    const payment: Payment = {
      id: crypto.randomUUID(),
      memberName: input.memberName,
      memberEmail: input.memberEmail,
      amount: input.amount,
      type: input.type,
      method: input.method,
      date: now.toISOString(),
      status: input.status ?? "pending",
    };
    void setDoc(doc(db, FIRESTORE_COLLECTIONS.payments, payment.id), payment);
  };

  const markNotificationRead = (id: string) => {
    void updateDoc(doc(db, FIRESTORE_COLLECTIONS.notifications, id), { unread: false });
  };

  const markAllNotificationsRead = () => {
    void Promise.all(
      notifications
        .filter((n) => n.unread)
        .map((n) => updateDoc(doc(db, FIRESTORE_COLLECTIONS.notifications, n.id), { unread: false }))
    ).catch(() => {
      // ignore
    });
  };

  const addElection: AdminDataContextType["addElection"] = (input) => {
    const election: Election = {
      id: crypto.randomUUID(),
      title: input.title,
      positions: input.positions,
      status: input.status,
      startDate: input.startDate,
      endDate: input.endDate,
      totalVoters: input.totalVoters,
      nominationsReceived: 0,
      votesCast: 0,
    };
    void setDoc(doc(db, FIRESTORE_COLLECTIONS.elections, election.id), election);
  };

  const updateElection = (id: string, updates: Partial<Election>) => {
    void updateDoc(doc(db, FIRESTORE_COLLECTIONS.elections, id), updates as Record<string, unknown>);
  };

  const deleteElection = (id: string) => {
    void deleteDoc(doc(db, FIRESTORE_COLLECTIONS.elections, id));
  };

  const addNomination: AdminDataContextType["addNomination"] = (input) => {
    const now = new Date();
    const nomination: Nomination = {
      id: crypto.randomUUID(),
      candidateName: input.candidateName,
      position: input.position,
      electionId: input.electionId,
      status: "pending",
      submittedDate: now.toISOString(),
    };
    void setDoc(doc(db, FIRESTORE_COLLECTIONS.nominations, nomination.id), nomination);
    void (async () => {
      try {
        const electionRef = doc(db, FIRESTORE_COLLECTIONS.elections, input.electionId);
        const snap = await getDoc(electionRef);
        if (!snap.exists()) return;
        const data = snap.data() as Election;
        const current = typeof data.nominationsReceived === "number" ? data.nominationsReceived : 0;
        await updateDoc(electionRef, { nominationsReceived: current + 1 });
      } catch {
        // ignore
      }
    })();
  };

  const approveNomination = (id: string) => {
    void updateDoc(doc(db, FIRESTORE_COLLECTIONS.nominations, id), { status: "approved" });
  };

  const rejectNomination = (id: string) => {
    void deleteDoc(doc(db, FIRESTORE_COLLECTIONS.nominations, id));
  };

  const addDocument: AdminDataContextType["addDocument"] = (input) => {
    const now = new Date();
    const document: DocumentItem = {
      id: crypto.randomUUID(),
      title: input.title,
      category: input.category,
      version: input.version,
      size: input.size,
      type: input.type,
      status: input.status,
      fileUrl: input.fileUrl,
      date: now.toISOString(),
    };
    void setDoc(doc(db, FIRESTORE_COLLECTIONS.documents, document.id), document);
  };

  const updateDocument = (id: string, updates: Partial<DocumentItem>) => {
    void updateDoc(doc(db, FIRESTORE_COLLECTIONS.documents, id), updates as Record<string, unknown>);
  };

  const deleteDocument = (id: string) => {
    void deleteDoc(doc(db, FIRESTORE_COLLECTIONS.documents, id));
  };

  const addExecutiveMember: AdminDataContextType["addExecutiveMember"] = async (input) => {
    requireAdminSession();
    const member: AdminExecutiveMember = {
      id: crypto.randomUUID(),
      name: input.name,
      position: input.position,
      description: input.description,
      color: input.color || "from-purple-500 to-pink-500",
      icon: input.icon,
      image: input.image,
    };

    const execRef = doc(db, FIRESTORE_COLLECTIONS.leadershipExecutive, FIRESTORE_DOCS.leadership);
    const snap = await getDoc(execRef);
    const data = (snap.exists() ? (snap.data() as { items?: AdminExecutiveMember[] }) : {}) ?? {};
    const items = Array.isArray(data.items) ? data.items : [];
    await setDoc(execRef, { items: [member, ...items] });
  };

  const updateExecutiveMember: AdminDataContextType["updateExecutiveMember"] = async (id, updates) => {
    requireAdminSession();
    const execRef = doc(db, FIRESTORE_COLLECTIONS.leadershipExecutive, FIRESTORE_DOCS.leadership);
    const snap = await getDoc(execRef);
    if (!snap.exists()) return;
    const data = snap.data() as { items?: AdminExecutiveMember[] };
    const items = Array.isArray(data.items) ? data.items : [];
    const next = items.map((m) => (m.id === id ? { ...m, ...updates } : m));
    await setDoc(execRef, { items: next });
  };

  const deleteExecutiveMember: AdminDataContextType["deleteExecutiveMember"] = async (id) => {
    requireAdminSession();
    const execRef = doc(db, FIRESTORE_COLLECTIONS.leadershipExecutive, FIRESTORE_DOCS.leadership);
    const snap = await getDoc(execRef);
    if (!snap.exists()) return;
    const data = snap.data() as { items?: AdminExecutiveMember[] };
    const items = Array.isArray(data.items) ? data.items : [];
    const next = items.filter((m) => m.id !== id);
    await setDoc(execRef, { items: next });
  };

  const addPayamRepresentative: AdminDataContextType["addPayamRepresentative"] = async (input) => {
    requireAdminSession();
    const rep: AdminPayamRepresentative = {
      id: crypto.randomUUID(),
      name: input.name,
      payam: input.payam,
      ...(input.position !== undefined && { position: input.position }),
      ...(input.image !== undefined && { image: input.image }),
    };

    const payamRef = doc(db, FIRESTORE_COLLECTIONS.leadershipPayam, FIRESTORE_DOCS.leadership);
    const snap = await getDoc(payamRef);
    const data = (snap.exists() ? (snap.data() as { items?: AdminPayamRepresentative[] }) : {}) ?? {};
    const items = Array.isArray(data.items) ? data.items : [];
    await setDoc(payamRef, { items: [rep, ...items] });
  };

  const updatePayamRepresentative: AdminDataContextType["updatePayamRepresentative"] = async (id, updates) => {
    requireAdminSession();
    const payamRef = doc(db, FIRESTORE_COLLECTIONS.leadershipPayam, FIRESTORE_DOCS.leadership);
    const snap = await getDoc(payamRef);
    if (!snap.exists()) return;
    const data = snap.data() as { items?: AdminPayamRepresentative[] };
    const items = Array.isArray(data.items) ? data.items : [];
    const next = items.map((r) => (r.id === id ? { ...r, ...updates } : r));
    await setDoc(payamRef, { items: next });
  };

  const deletePayamRepresentative: AdminDataContextType["deletePayamRepresentative"] = async (id) => {
    requireAdminSession();
    const payamRef = doc(db, FIRESTORE_COLLECTIONS.leadershipPayam, FIRESTORE_DOCS.leadership);
    const snap = await getDoc(payamRef);
    if (!snap.exists()) return;
    const data = snap.data() as { items?: AdminPayamRepresentative[] };
    const items = Array.isArray(data.items) ? data.items : [];
    const next = items.filter((r) => r.id !== id);
    await setDoc(payamRef, { items: next });
  };

  const addEvent: AdminDataContextType["addEvent"] = async (input) => {
    requireAdminSession();
    const eventDate = new Date(input.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    const dateDerivedType: "upcoming" | "past" = eventDate >= today ? "upcoming" : "past";
    const type: "upcoming" | "past" = input.type ?? dateDerivedType;
    const event: AdminEvent = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      date: input.date,
      time: input.time,
      location: input.location,
      type,
      attendees: input.attendees ?? 0,
      status: input.status ?? (type === "past" ? "completed" : "active"),
      image: input.image,
      createdAt: new Date().toISOString(),
      published: input.published ?? true,
    };
    await setDoc(doc(db, FIRESTORE_COLLECTIONS.events, event.id), event);
  };

  const updateEvent: AdminDataContextType["updateEvent"] = async (id, updates) => {
    requireAdminSession();
    await updateDoc(doc(db, FIRESTORE_COLLECTIONS.events, id), updates as Record<string, unknown>);
  };

  const deleteEvent: AdminDataContextType["deleteEvent"] = async (id) => {
    requireAdminSession();
    await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.events, id));
  };

  const addScholarship: AdminDataContextType["addScholarship"] = (input) => {
    const scholarship: AdminScholarship = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      applicationLink: input.applicationLink,
      createdAt: new Date().toISOString(),
    };
    void setDoc(doc(db, FIRESTORE_COLLECTIONS.scholarships, scholarship.id), scholarship);
  };

  const updateScholarship = (id: string, updates: Partial<AdminScholarship>) => {
    void updateDoc(doc(db, FIRESTORE_COLLECTIONS.scholarships, id), updates as Record<string, unknown>);
  };

  const deleteScholarship = (id: string) => {
    void deleteDoc(doc(db, FIRESTORE_COLLECTIONS.scholarships, id));
  };

  return (
    <AdminDataContext.Provider
      value={{
        members,
        payments,
        notifications,
        elections,
        nominations,
        documents,
        executiveCommittee,
        payamRepresentatives,
        events,
        scholarships,
        addMember,
        updateMember,
        approveMember,
        rejectMember,
        addPayment,
        markNotificationRead,
        markAllNotificationsRead,
        addElection,
        updateElection,
        deleteElection,
        addNomination,
        approveNomination,
        rejectNomination,
        addDocument,
        updateDocument,
        deleteDocument,
        addExecutiveMember,
        updateExecutiveMember,
        deleteExecutiveMember,
        addPayamRepresentative,
        updatePayamRepresentative,
        deletePayamRepresentative,
        addEvent,
        updateEvent,
        deleteEvent,
        addScholarship,
        updateScholarship,
        deleteScholarship,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return ctx;
};








