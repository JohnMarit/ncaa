import annualImage from "@/images/annual.jpg";
import awardsImage from "@/images/awards.jpg";
import nca2Image from "@/images/nca2.jpg";
import ncaReportImage from "@/images/nca-report.jpeg";
import panyagoorImage from "@/images/nca1.jpg";
import womenImage from "@/images/Women.PNG";

export type UpcomingEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  description: string;
  image?: string;
};

export type PastEvent = {
  id: number;
  title: string;
  date: string;
  location: string;
  attendees: number;
  image?: string;
  description?: string;
};

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: 1,
    title: "Monthly General Meeting",
    date: "December 15, 2025",
    time: "6:00 PM - 8:00 PM",
    location: "NCAA Hall, Juba",
    attendees: 45,
    description: "Regular monthly meeting to discuss community matters and upcoming initiatives.",
  },
  {
    id: 2,
    title: "NCAA Awards 2026",
    date: "December 20, 2026",
    time: "5:00 PM - 10:00 PM",
    location: "NCAA Hall, Juba",
    attendees: 300,
    description: "Annual NCAA Awards ceremony recognizing outstanding members, leaders, and community contributors. Join us for an evening of celebration, entertainment, and appreciation for those who have made significant contributions to our community.",
    image: awardsImage,
  },
  {
    id: 3,
    title: "Executive Committee Elections",
    date: "January 20, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "NCAA Hall, Juba",
    attendees: 150,
    description: "Annual elections for Executive Committee positions. All members encouraged to participate.",
  },
  {
    id: 4,
    title: "Education Fund Fundraiser",
    date: "February 5, 2026",
    time: "4:00 PM - 9:00 PM",
    location: "Community Center",
    attendees: 200,
    description: "Annual fundraising event to support educational scholarships for members.",
  },
  {
    id: 5,
    title: "International Women's Day",
    date: "March 8, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Gold Orchid, Juba",
    attendees: 150,
    description: "Join us in celebrating International Women's Day with themes of equality, empowerment, and solidarity. A day of reflection, discussion, and celebration of women's achievements and the path ahead.",
    image: womenImage,
  },
];

export const pastEvents: PastEvent[] = [
  {
    id: 3,
    title: "NCAA Annual Trade Fair",
    date: "December 15, 2024",
    location: "NCAA Hall, Juba",
    attendees: 250,
    image: annualImage,
    description: "A vibrant showcase of local businesses and entrepreneurs from the Nuer community. The event featured over 50 vendors displaying traditional crafts, modern products, and services. Attendees enjoyed cultural performances, networking opportunities, and business development workshops. The fair successfully promoted economic empowerment and strengthened community bonds.",
  },
  {
    id: 4,
    title: "Nyan Cit Arialbeek Uniform Launching",
    date: "January 1, 2025",
    location: "NCAA Hall, Juba",
    attendees: 180,
    image: nca2Image,
    description: "The official launching ceremony for the Nyan Cit Arialbeek uniforms. This event marked the introduction of the new uniforms that represent our community's identity and values. Members gathered to witness the unveiling and celebrate this important milestone for our organization.",
  },
  {
    id: 5,
    title: "Quarterly Financial Review",
    date: "November 30, 2025",
    location: "Virtual Meeting",
    attendees: 65,
    image: ncaReportImage,
    description: "A comprehensive review of the association's financial performance for the quarter. Members received detailed reports on income, expenditures, and fund allocations. The session included presentations on budget updates, fundraising progress, and financial projections for upcoming initiatives. Members had the opportunity to ask questions and provide feedback on financial decisions.",
  },
  {
    id: 6,
    title: "Visit to Panyagoor",
    date: "October 20, 2025",
    location: "Panyagoor, Twic East County",
    attendees: 120,
    image: panyagoorImage,
    description: "A meaningful homecoming visit by the NCAA Executive Committee to Panyagoor, the hometown of Twic East County. The executives traveled back to their roots to reconnect with their people and demonstrate the association's commitment to community welfare. During this visit, the committee distributed essential supplies and basic needs to families in the area, including food items, clothing, and other necessities. The visit strengthened the bond between the association and the community, showcasing NCAA's dedication to supporting the people of Twic East County both in Juba and in their ancestral homeland. This initiative reflected the core values of unity, care, and community support that define the association.",
  },
];



