/**
 * Migration script to upload fallback data to Firebase
 * Run this once to populate the database with demo data
 * Usage: npm run migrate-data
 */

import { db, storage } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { Testimonial, MentorProfile, Partner } from "../contexts/AdminDataContext";

// Import images
import NyandengImg from "../images/Nyandeng.jpeg";
import AmerImg from "../images/Amer_T.jpg";
import AluelImg from "../images/Aluel.jpeg";
import AbukImg from "../images/Abuk.jpeg";
import YarGImg from "../images/Yar_G.JPG";
import YarKImg from "../images/Yar_K.JPG";

const COLLECTIONS = {
  testimonials: "testimonials",
  mentors: "mentors",
  partners: "partners",
};

// Helper to upload image to Firebase Storage
async function uploadImageFromUrl(imagePath: string, folder: string, filename: string): Promise<string> {
  try {
    // Fetch the image
    const response = await fetch(imagePath);
    const blob = await response.blob();
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, `${folder}/${filename}`);
    await uploadBytes(storageRef, blob);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error(`Failed to upload ${filename}:`, error);
    return "";
  }
}

async function migrateTestimonials() {
  console.log("📝 Migrating testimonials...");
  
  const testimonials: Array<Testimonial & { localImage?: string }> = [
    {
      id: "testimonial-1",
      name: "Nyandeng A.",
      role: "Secondary school student, Bor",
      quote: "Because of NCAA's support, I stayed in school when my family could no longer afford the fees. I now dream of becoming a nurse.",
      localImage: NyandengImg,
    },
    {
      id: "testimonial-2",
      name: "Abuk M.",
      role: "Parent, Kongor Payam",
      quote: "The scholarship lifted a huge burden from our household. My daughter can focus on her books instead of worrying about school fees.",
      localImage: AbukImg,
    },
    {
      id: "testimonial-3",
      name: "Amer T.",
      role: "University student, Juba",
      quote: "NCAA believed in me from secondary school to campus. Their mentorship and community have shaped the woman I am becoming.",
      localImage: AmerImg,
    },
    {
      id: "testimonial-4",
      name: "Aluel K.",
      role: "Vocational trainee, TEYA Institute",
      quote: "The vocational scholarship gave me practical skills in tailoring. I now support myself and help my younger siblings with school items.",
      localImage: AluelImg,
    },
    {
      id: "testimonial-5",
      name: "Community Elder",
      role: "Arialbeek Community Leader",
      quote: "We are seeing a new generation of educated girls who will lead our community with wisdom and compassion. NCAA is planting good seeds.",
      localImage: YarGImg,
    },
    {
      id: "testimonial-6",
      name: "NCAA Member",
      role: "Diaspora member, Nairobi",
      quote: "Giving through NCAA feels personal. You see exactly how your contribution is changing real lives back home.",
      localImage: YarKImg,
    },
  ];

  for (const testimonial of testimonials) {
    console.log(`  - Uploading ${testimonial.name}...`);
    
    let photoUrl = "";
    if (testimonial.localImage) {
      photoUrl = await uploadImageFromUrl(
        testimonial.localImage,
        "testimonials",
        `${testimonial.id}.jpg`
      );
    }

    const data: Testimonial = {
      id: testimonial.id,
      name: testimonial.name,
      role: testimonial.role,
      quote: testimonial.quote,
      photoUrl,
    };

    await setDoc(doc(db, COLLECTIONS.testimonials, testimonial.id), data);
  }
  
  console.log("✅ Testimonials migrated successfully!");
}

async function migrateMentors() {
  console.log("\n👥 Migrating mentors...");
  
  const mentors: MentorProfile[] = [
    {
      id: "mentor-1",
      name: "Prof. Achol Deng",
      position: "Lecturer",
      organization: "University of Juba",
      story: "Achol was the first girl from her village to complete university. Today she lectures young women and often reminds them that their voices matter in classrooms and in policy spaces.",
      photoUrl: "",
    },
    {
      id: "mentor-2",
      name: "Mama Nyaluak",
      position: "Community Elder",
      organization: "Arialbeek",
      story: "For many years she has walked from home to home encouraging parents to keep their girls in school. Girls say they look up to her courage and strong voice.",
      photoUrl: "",
    },
    {
      id: "mentor-3",
      name: "Deng John",
      position: "Engineer",
      organization: "NCAA Member",
      story: "As a practising engineer, Deng shares his journey with girls who love science and maths, showing them that they too can build roads, bridges and systems.",
      photoUrl: "",
    },
    {
      id: "mentor-4",
      name: "Sr. Mary",
      position: "Head Teacher",
      organization: "Bor",
      story: "She leads a girls' boarding school and offers guidance, prayer and discipline. Many former students credit her for shaping their confidence.",
      photoUrl: "",
    },
  ];

  for (const mentor of mentors) {
    console.log(`  - Adding ${mentor.name}...`);
    await setDoc(doc(db, COLLECTIONS.mentors, mentor.id), mentor);
  }
  
  console.log("✅ Mentors migrated successfully!");
}

async function migratePartners() {
  console.log("\n🤝 Migrating partners...");
  
  const partners: Partner[] = [
    {
      id: "partner-1",
      name: "Local Schools & Head Teachers",
      description: "Schools in Bor, Juba and Twic East that help identify girls in need and walk with them through their studies.",
      logoUrl: "",
    },
    {
      id: "partner-2",
      name: "TEYA Institute & Vocational Centers",
      description: "Training centres that equip girls with practical skills in tailoring, hairdressing and other trades.",
      logoUrl: "",
    },
    {
      id: "partner-3",
      name: "Diaspora Friends of NCAA",
      description: "NCAA members and friends in Nairobi, Kampala, Juba and beyond who contribute towards the scholarship fund.",
      logoUrl: "",
    },
    {
      id: "partner-4",
      name: "Church & Community Leaders",
      description: "Elders, pastors and chiefs who encourage families to keep girls in school and support NCAA initiatives.",
      logoUrl: "",
    },
  ];

  for (const partner of partners) {
    console.log(`  - Adding ${partner.name}...`);
    await setDoc(doc(db, COLLECTIONS.partners, partner.id), partner);
  }
  
  console.log("✅ Partners migrated successfully!");
}

async function runMigration() {
  console.log("🚀 Starting data migration to Firebase...\n");
  
  try {
    await migrateTestimonials();
    await migrateMentors();
    await migratePartners();
    
    console.log("\n🎉 All data migrated successfully!");
    console.log("\nℹ️  You can now:");
    console.log("  - View the data in the admin dashboard");
    console.log("  - Edit or delete these entries");
    console.log("  - Add new entries with photos");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    throw error;
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Error:", error);
    process.exit(1);
  });
