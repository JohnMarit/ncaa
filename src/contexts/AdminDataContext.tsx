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
  orderBy,
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
  /** Optional gallery images (max 5). The first image is treated as the cover. */
  images?: string[];
  /** ISO timestamp set when an admin explicitly moves an event to Past (used for ordering). */
  pastMarkedAt?: string;
  /** ISO date string; set on create for ordering. */
  createdAt?: string;
  /** If true, event is shown on public site. Draft events are admin-only. */
  published?: boolean;
}

export type ScholarshipFormFieldType = "text" | "textarea" | "email" | "tel" | "number" | "select";

export interface ScholarshipFormField {
  id: string;
  label: string;
  type: ScholarshipFormFieldType;
  required?: boolean;
  /** Only used for type === "select" */
  options?: string[];
 }

export interface AdminScholarship {
  id: string;
  title: string;
  description: string;
  /** URL for the application form or page */
  applicationLink: string;
  /** Optional internal form definition for collecting applicant info */
  formFields?: ScholarshipFormField[];
  /** ISO date string; set on create for ordering. */
  createdAt?: string;
}

export interface ScholarProfile {
  id: string;
  /** Full name of the sponsored girl. */
  name: string;
  /** Optional short line shown on cards, e.g. school or aspiration. */
  tagline?: string;
  /** Public URL to her photo (can be Firebase Storage or external). */
  photoUrl?: string;
  /** Long-form biography or story text shown on the detail page. */
  story: string;
  /** If true, prioritize showing this profile first. */
  featured?: boolean;
  /** ISO date string; set on create for ordering. */
  createdAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  photoUrl?: string;
  createdAt?: string;
}

export interface MentorProfile {
  id: string;
  /** Full name of the mentor or role model. */
  name: string;
  /** Current position or title the mentor is holding. */
  position: string;
  /** Optional organisation or place where they serve (school, community, etc.). */
  organization?: string;
  /** Public URL for the mentor's photo. */
  photoUrl?: string;
  /**
   * Long-form journey or experience text.
   * Admins can write a brief or full article about their path and lessons for girls.
   */
  story: string;
  /** ISO date string; set on create for ordering. */
  createdAt?: string;
}

export interface Partner {
  id: string;
  /** Name of the partner or organisation. */
  name: string;
  /** Short description of how they support NCAA. */
  description: string;
  /** Optional logo image URL shown on the homepage. */
  logoUrl?: string;
  /** ISO date string; set on create for ordering. */
  createdAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  read: boolean;
}

export interface ScholarshipApplicationSubmission {
  id: string;
  scholarshipId: string;
  scholarshipTitle: string;
  answers: Record<string, unknown>;
  submittedAt: string;
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
  scholars: ScholarProfile[];
  testimonials: Testimonial[];
  mentors: MentorProfile[];
  partners: Partner[];
  contactMessages: ContactMessage[];
  submitScholarshipApplication: (input: Omit<ScholarshipApplicationSubmission, "id" | "submittedAt">) => Promise<void>;
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
  reorderExecutiveCommittee: (nextItems: AdminExecutiveMember[]) => Promise<void>;
  addPayamRepresentative: (rep: Omit<AdminPayamRepresentative, "id">) => Promise<void>;
  updatePayamRepresentative: (id: string, updates: Partial<AdminPayamRepresentative>) => Promise<void>;
  deletePayamRepresentative: (id: string) => Promise<void>;
  reorderPayamRepresentatives: (nextItems: AdminPayamRepresentative[]) => Promise<void>;
  addEvent: (event: Omit<AdminEvent, "id">) => Promise<void>;
  updateEvent: (id: string, updates: Partial<AdminEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addScholarship: (scholarship: Omit<AdminScholarship, "id">) => void;
  updateScholarship: (id: string, updates: Partial<AdminScholarship>) => void;
  deleteScholarship: (id: string) => void;
  addScholarProfile: (scholar: Omit<ScholarProfile, "id" | "createdAt">) => Promise<void>;
  updateScholarProfile: (id: string, updates: Partial<ScholarProfile>) => Promise<void>;
  deleteScholarProfile: (id: string) => Promise<void>;
  addTestimonial: (testimonial: Omit<Testimonial, "id" | "createdAt">) => Promise<void>;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  addMentor: (mentor: Omit<MentorProfile, "id" | "createdAt">) => Promise<void>;
  updateMentor: (id: string, updates: Partial<MentorProfile>) => Promise<void>;
  deleteMentor: (id: string) => Promise<void>;
  addPartner: (partner: Omit<Partner, "id" | "createdAt">) => Promise<void>;
  updatePartner: (id: string, updates: Partial<Partner>) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  submitContactMessage: (data: Omit<ContactMessage, "id" | "submittedAt" | "read">) => Promise<string>;
  markContactMessageRead: (id: string, read: boolean) => Promise<void>;
  deleteContactMessage: (id: string) => Promise<void>;
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
  scholarshipApplications: "scholarship_applications",
  members: "members",
  payments: "payments",
  notifications: "notifications",
  elections: "elections",
  nominations: "nominations",
  scholars: "scholars",
  testimonials: "testimonials",
  mentors: "mentors",
  partners: "partners",
  contactMessages: "contact_messages",
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
  const [scholars, setScholars] = useState<ScholarProfile[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const projectId = (db.app.options as { projectId?: string }).projectId;
    console.info("AdminDataContext Firebase projectId", projectId);
  }, []);

  const requireAdminSession = () => {
    if (!auth.currentUser) {
      throw new Error("You must be logged in as an admin to perform this action.");
    }
    if (!isAdminUser) {
      throw new Error("Admin permissions are not available yet. Please wait a moment and try again.");
    }
  };

  const omitUndefined = (obj: Record<string, unknown>): Record<string, unknown> => {
    const next: Record<string, unknown> = {};
    Object.keys(obj).forEach((k) => {
      const v = obj[k];
      if (v !== undefined) next[k] = v;
    });
    return next;
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
          console.info("AdminDataContext idToken claims", {
            uid: user.uid,
            email: user.email,
            claims: r?.claims,
          });
          if (r?.claims?.admin === true) {
            setIsAdminUser(true);
            return;
          }

          try {
            const refreshed = await user.getIdTokenResult(true);
            console.info("AdminDataContext refreshed idToken claims", {
              uid: user.uid,
              email: user.email,
              claims: refreshed?.claims,
            });
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
      console.info("seedDocumentsIfEmpty snapshot empty", snap.empty);
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

    seedDocumentsIfEmpty().catch((err) => {
      console.error("seedDocumentsIfEmpty failed", err);
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
      (err) => {
        console.error("documents onSnapshot failed", err);
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
      console.info("seedScholarshipsIfEmpty snapshot empty", snap.empty);
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

    seedScholarshipsIfEmpty().catch((err) => {
      console.error("seedScholarshipsIfEmpty failed", err);
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
      (err) => {
        console.error("scholarships onSnapshot failed", err);
      }
    );

    return () => {
      unsub();
    };
  }, [isAdminUser]);

  // Firestore: scholar profiles – real-time sync
  useEffect(() => {
    const scholarsCol = collection(db, FIRESTORE_COLLECTIONS.scholars);

    const unsub = onSnapshot(
      query(scholarsCol),
      (snap) => {
        const loaded: ScholarProfile[] = [];
        snap.forEach((d) => {
          const raw = d.data() as Omit<ScholarProfile, "id">;
          loaded.push({ id: d.id, ...raw });
        });

        // Sort featured first, then by createdAt (newest first), then name.
        loaded.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.createdAt && b.createdAt && a.createdAt !== b.createdAt) {
            return a.createdAt > b.createdAt ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });

        setScholars(loaded);
      },
      (err) => {
        console.error("scholars onSnapshot failed", err);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  // Firestore: testimonials – real-time sync (public read)
  useEffect(() => {
    const testimonialsCol = collection(db, FIRESTORE_COLLECTIONS.testimonials);

    const unsub = onSnapshot(
      query(testimonialsCol),
      (snap) => {
        const loaded: Testimonial[] = [];
        snap.forEach((d) => {
          const raw = d.data() as Omit<Testimonial, "id">;
          loaded.push({ id: d.id, ...raw });
        });
        loaded.sort((a, b) => {
          if (a.createdAt && b.createdAt && a.createdAt !== b.createdAt) {
            return a.createdAt > b.createdAt ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
        setTestimonials(loaded);
      },
      (err) => {
        console.error("testimonials onSnapshot failed", err);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  // Firestore: mentors – real-time sync (public read)
  useEffect(() => {
    const mentorsCol = collection(db, FIRESTORE_COLLECTIONS.mentors);

    const unsub = onSnapshot(
      query(mentorsCol),
      (snap) => {
        const loaded: MentorProfile[] = [];
        snap.forEach((d) => {
          const raw = d.data() as Omit<MentorProfile, "id">;
          loaded.push({ id: d.id, ...raw });
        });
        loaded.sort((a, b) => {
          if (a.createdAt && b.createdAt && a.createdAt !== b.createdAt) {
            return a.createdAt > b.createdAt ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
        setMentors(loaded);
      },
      (err) => {
        console.error("mentors onSnapshot failed", err);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  // Firestore: partners – real-time sync (public read)
  useEffect(() => {
    const partnersCol = collection(db, FIRESTORE_COLLECTIONS.partners);

    const unsub = onSnapshot(
      query(partnersCol),
      (snap) => {
        const loaded: Partner[] = [];
        snap.forEach((d) => {
          const raw = d.data() as Omit<Partner, "id">;
          loaded.push({ id: d.id, ...raw });
        });
        loaded.sort((a, b) => {
          if (a.createdAt && b.createdAt && a.createdAt !== b.createdAt) {
            return a.createdAt > b.createdAt ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
        setPartners(loaded);
      },
      (err) => {
        console.error("partners onSnapshot failed", err);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  // Firestore: contact messages – real-time sync (admin-only read)
  useEffect(() => {
    if (!isAdminUser) return;
    const messagesCol = collection(db, FIRESTORE_COLLECTIONS.contactMessages);

    const unsub = onSnapshot(
      query(messagesCol, orderBy("submittedAt", "desc")),
      (snap) => {
        const loaded: ContactMessage[] = [];
        snap.forEach((d) => {
          const raw = d.data() as Omit<ContactMessage, "id">;
          loaded.push({ id: d.id, ...raw });
        });
        setContactMessages(loaded);
      },
      (err) => {
        console.error("contactMessages onSnapshot failed", err);
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
      seedLeadershipIfMissing().catch((err) => {
        console.error("seedLeadershipIfMissing failed", err);
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
      console.info("seedEventsIfEmpty snapshot empty", snap.empty);
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
          setDoc(
            doc(db, FIRESTORE_COLLECTIONS.events, e.id),
            omitUndefined({
              ...e,
              images:
                Array.isArray((e as AdminEvent).images) && (e as AdminEvent).images.length > 0
                  ? (e as AdminEvent).images.slice(0, 5)
                  : undefined,
              image:
                (Array.isArray((e as AdminEvent).images) && (e as AdminEvent).images[0]) ||
                e.image ||
                staticEventImages[e.title] ||
                undefined,
            }) as Record<string, unknown>
          )
        )
      );
    };

    seedEventsIfEmpty().catch((err) => {
      console.error("seedEventsIfEmpty failed", err);
    });

    const unsub = onSnapshot(
      query(eventsCol),
      (snap) => {
        const loaded: AdminEvent[] = [];
        snap.forEach((d) => {
          const raw = d.data() as Omit<AdminEvent, "id">;

          const rawImages = Array.isArray(raw.images)
            ? raw.images.filter((v): v is string => typeof v === "string" && v.trim().length > 0).slice(0, 5)
            : [];

          const cover = raw.image || rawImages[0] || staticEventImages[raw.title] || undefined;
          const normalizedImages = rawImages.length > 0 ? rawImages : cover ? [cover] : [];

          let updated: AdminEvent = {
            id: d.id,
            ...raw,
            image: cover,
            images: normalizedImages.length > 0 ? normalizedImages : undefined,
          };

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

          const finalCover = updated.image || staticEventImages[updated.title] || undefined;
          const finalImages =
            Array.isArray(updated.images) && updated.images.length > 0
              ? updated.images
              : finalCover
                ? [finalCover]
                : undefined;

          loaded.push({
            ...updated,
            image: finalCover,
            images: finalImages,
          });
        });

        setEvents(loaded);
      },
      (err) => {
        console.error("events onSnapshot failed", err);
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

  const reorderExecutiveCommittee: AdminDataContextType["reorderExecutiveCommittee"] = async (nextItems) => {
    requireAdminSession();
    const execRef = doc(db, FIRESTORE_COLLECTIONS.leadershipExecutive, FIRESTORE_DOCS.leadership);
    await setDoc(execRef, { items: nextItems });
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

  const reorderPayamRepresentatives: AdminDataContextType["reorderPayamRepresentatives"] = async (nextItems) => {
    requireAdminSession();
    const payamRef = doc(db, FIRESTORE_COLLECTIONS.leadershipPayam, FIRESTORE_DOCS.leadership);
    await setDoc(payamRef, { items: nextItems });
  };

  const addEvent: AdminDataContextType["addEvent"] = async (input) => {
    requireAdminSession();
    const eventDate = new Date(input.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    const dateDerivedType: "upcoming" | "past" = eventDate >= today ? "upcoming" : "past";
    const type: "upcoming" | "past" = input.type ?? dateDerivedType;
    const images = Array.isArray((input as AdminEvent).images)
      ? ((input as AdminEvent).images as string[]).filter(Boolean).slice(0, 5)
      : [];

    const coverImage = images[0] || input.image;
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
      ...(coverImage !== undefined && { image: coverImage }),
      ...(images.length > 0 && { images }),
      createdAt: new Date().toISOString(),
      published: input.published ?? true,
    };
    await setDoc(
      doc(db, FIRESTORE_COLLECTIONS.events, event.id),
      omitUndefined(event as unknown as Record<string, unknown>)
    );
  };

  const updateEvent: AdminDataContextType["updateEvent"] = async (id, updates) => {
    requireAdminSession();

    const next: Record<string, unknown> = { ...(updates as unknown as Record<string, unknown>) };

    if ("images" in next) {
      const rawImages = Array.isArray(next.images) ? (next.images as unknown[]) : [];
      const normalized = rawImages
        .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
        .slice(0, 5);
      next.images = normalized.length > 0 ? normalized : undefined;

      // Keep cover in sync if it wasn't explicitly set.
      if (!("image" in next)) {
        next.image = normalized[0] || undefined;
      }
    }

    await updateDoc(
      doc(db, FIRESTORE_COLLECTIONS.events, id),
      omitUndefined(next)
    );
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
      ...(Array.isArray((input as AdminScholarship).formFields) && { formFields: (input as AdminScholarship).formFields }),
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

  const addScholarProfile: AdminDataContextType["addScholarProfile"] = async (input) => {
    requireAdminSession();
    const profile: ScholarProfile = {
      id: crypto.randomUUID(),
      name: input.name,
      tagline: input.tagline,
      photoUrl: input.photoUrl,
      story: input.story,
      featured: input.featured ?? true,
      createdAt: new Date().toISOString(),
    };
    await setDoc(
      doc(db, FIRESTORE_COLLECTIONS.scholars, profile.id),
      profile as unknown as Record<string, unknown>
    );
  };

  const updateScholarProfile: AdminDataContextType["updateScholarProfile"] = async (id, updates) => {
    requireAdminSession();
    const next: Record<string, unknown> = { ...(updates as unknown as Record<string, unknown>) };
    await updateDoc(
      doc(db, FIRESTORE_COLLECTIONS.scholars, id),
      omitUndefined(next)
    );
  };

  const deleteScholarProfile: AdminDataContextType["deleteScholarProfile"] = async (id) => {
    requireAdminSession();
    await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.scholars, id));
  };

  const addTestimonial: AdminDataContextType["addTestimonial"] = async (input) => {
    requireAdminSession();
    const item: Testimonial = {
      id: crypto.randomUUID(),
      name: input.name,
      role: input.role,
      quote: input.quote,
      photoUrl: input.photoUrl,
      createdAt: new Date().toISOString(),
    };
    await setDoc(
      doc(db, FIRESTORE_COLLECTIONS.testimonials, item.id),
      omitUndefined(item as unknown as Record<string, unknown>)
    );
  };

  const updateTestimonial: AdminDataContextType["updateTestimonial"] = async (id, updates) => {
    requireAdminSession();
    await updateDoc(
      doc(db, FIRESTORE_COLLECTIONS.testimonials, id),
      omitUndefined(updates as unknown as Record<string, unknown>)
    );
  };

  const deleteTestimonial: AdminDataContextType["deleteTestimonial"] = async (id) => {
    requireAdminSession();
    await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.testimonials, id));
  };

  const addMentor = async (input: Omit<MentorProfile, "id" | "createdAt">) => {
    requireAdminSession();
    const mentor: MentorProfile = {
      id: crypto.randomUUID(),
      name: input.name,
      position: input.position,
      organization: input.organization,
      photoUrl: input.photoUrl,
      story: input.story,
      createdAt: new Date().toISOString(),
    };
    await setDoc(
      doc(db, FIRESTORE_COLLECTIONS.mentors, mentor.id),
      omitUndefined(mentor as unknown as Record<string, unknown>)
    );
  };

  const updateMentor = async (id: string, updates: Partial<MentorProfile>) => {
    requireAdminSession();
    await updateDoc(
      doc(db, FIRESTORE_COLLECTIONS.mentors, id),
      omitUndefined(updates as unknown as Record<string, unknown>)
    );
  };

  const deleteMentor = async (id: string) => {
    requireAdminSession();
    await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.mentors, id));
  };

  const addPartner: AdminDataContextType["addPartner"] = async (input) => {
    requireAdminSession();
    const partner: Partner = {
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description,
      logoUrl: input.logoUrl,
      createdAt: new Date().toISOString(),
    };
    await setDoc(
      doc(db, FIRESTORE_COLLECTIONS.partners, partner.id),
      omitUndefined(partner as unknown as Record<string, unknown>)
    );
  };

  const updatePartner: AdminDataContextType["updatePartner"] = async (id, updates) => {
    requireAdminSession();
    await updateDoc(
      doc(db, FIRESTORE_COLLECTIONS.partners, id),
      omitUndefined(updates as unknown as Record<string, unknown>)
    );
  };

  const deletePartner: AdminDataContextType["deletePartner"] = async (id) => {
    requireAdminSession();
    await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.partners, id));
  };

  // Contact message methods
  const submitContactMessage: AdminDataContextType["submitContactMessage"] = async (data) => {
    const message: ContactMessage = {
      id: crypto.randomUUID(),
      ...data,
      submittedAt: new Date().toISOString(),
      read: false,
    };
    await setDoc(doc(db, FIRESTORE_COLLECTIONS.contactMessages, message.id), message);
    return message.id;
  };

  const markContactMessageRead: AdminDataContextType["markContactMessageRead"] = async (id, read) => {
    requireAdminSession();
    await updateDoc(doc(db, FIRESTORE_COLLECTIONS.contactMessages, id), { read });
  };

  const deleteContactMessage: AdminDataContextType["deleteContactMessage"] = async (id) => {
    requireAdminSession();
    await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.contactMessages, id));
  };

  const submitScholarshipApplication: AdminDataContextType["submitScholarshipApplication"] = async (input) => {
    const submission: ScholarshipApplicationSubmission = {
      id: crypto.randomUUID(),
      scholarshipId: input.scholarshipId,
      scholarshipTitle: input.scholarshipTitle,
      answers: input.answers,
      submittedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, FIRESTORE_COLLECTIONS.scholarshipApplications, submission.id), submission);
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
        scholars,
        testimonials,
        mentors,
        partners,
        submitScholarshipApplication,
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
        reorderExecutiveCommittee,
        addPayamRepresentative,
        updatePayamRepresentative,
        deletePayamRepresentative,
        reorderPayamRepresentatives,
        addEvent,
        updateEvent,
        deleteEvent,
        addScholarship,
        updateScholarship,
        deleteScholarship,
        addScholarProfile,
        updateScholarProfile,
        deleteScholarProfile,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addMentor,
        updateMentor,
        deleteMentor,
        addPartner,
        updatePartner,
        deletePartner,
        contactMessages,
        submitContactMessage,
        markContactMessageRead,
        deleteContactMessage,
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








