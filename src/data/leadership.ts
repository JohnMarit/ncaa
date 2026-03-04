import {
    Crown,
    UserCircle,
    FileText,
    DollarSign,
    Users,
    Megaphone,
    MapPin,
    Scale,
    GraduationCap,
    Heart,
    Trophy,
    Lightbulb
} from "lucide-react";

export interface ExecutiveCommitteeMember {
    name: string;
    position: string;
    icon: React.ElementType;
    description: string;
    color: string;
    image?: string;
}

import mukaImage from "@/images/Ahou.jpeg";
import yarKuirImage from "@/images/Yar_K.JPG";
import ayakMajokImage from "@/images/Ayak_M.jpg";
import yarGarangImage from "@/images/Yar_G.JPG";
import dingAkoiImage from "@/images/Ding_A.jpg";
import alekMajokImage from "@/images/Alek_M.jpeg";
import athieiImage from "@/images/Athiei01.png";
import acholGarangImage from "@/images/Achol_G.jpg";
import amerThonImage from "@/images/Amer_T.jpg";
import yomNhianyImage from "@/images/Yom_N.jpg";
import abuolImage from "@/images/Abuol.jpeg";
import abukImage from "@/images/Abuk.jpeg";
import nyandengImage from "@/images/Nyandeng.jpeg";
import alekMayulImage from "@/images/Alek.jpeg";
import aluelImage from "@/images/Aluel.jpeg";
import alakiirImage from "@/images/Alakiir.jpeg";
import athieiAbuoiImage from "@/images/A.Abuoi.jpeg";
import akuchImage from "@/images/Akuch.jpeg";
import abukManyielImage from "@/images/Abukm.jpeg";
import atochImage from "@/images/Atoch.jpeg";

export const executiveCommittee: ExecutiveCommitteeMember[] = [
    {
        name: "Ahou Abit Arok",
        position: "Chairlady",
        icon: Crown,
        description: "Chief executive and representative of the organization",
        color: "from-purple-500 to-pink-500",
        image: mukaImage
    },
    {
        name: "Yar Kuir Mabior",
        position: "Deputy Chairlady",
        icon: UserCircle,
        description: "Supports chairlady and acts in their absence",
        color: "from-blue-500 to-cyan-500",
        image: yarKuirImage
    },
    {
        name: "Ayak Majok Abit",
        position: "Secretary General",
        icon: FileText,
        description: "Handles administrative duties and records",
        color: "from-green-500 to-emerald-500",
        image: ayakMajokImage
    },
    {
        name: "Yar Garang Akak",
        position: "Deputy Secretary General",
        icon: FileText,
        description: "Assists the secretary general",
        color: "from-teal-500 to-green-500",
        image: yarGarangImage
    },
    {
        name: "Nyandeng Deng Khot",
        position: "Finance Secretary",
        icon: DollarSign,
        description: "Manages financial affairs and accounting",
        color: "from-amber-500 to-orange-500",
        image: nyandengImage
    },
    {
        name: "Ding Akoi Deu",
        position: "Deputy Finance Secretary",
        icon: DollarSign,
        description: "Assists the finance secretary",
        color: "from-yellow-500 to-amber-500",
        image: dingAkoiImage
    },
    {
        name: "Alek Majok",
        position: "Information Secretary",
        icon: Megaphone,
        description: "Manages communications and public relations",
        color: "from-rose-500 to-pink-500",
        image: alekMajokImage
    },
    {
        name: "Athiei Lem",
        position: "Deputy Information Secretary",
        icon: Megaphone,
        description: "Assists the information secretary",
        color: "from-pink-500 to-rose-500",
        image: athieiImage
    },
    {
        name: "Alek Mayul Pageer",
        position: "Secretary for Internal and External Affairs",
        icon: Users,
        description: "Coordinates internal operations and external relations",
        color: "from-violet-500 to-purple-600",
        image: alekMayulImage
    },
    {
        name: "Abuol Sarah Chol",
        position: "Secretary for Legal Affairs",
        icon: Scale,
        description: "Handles legal matters and compliance",
        color: "from-indigo-500 to-purple-500",
        image: abuolImage
    },
    {
        name: "Amer Thon Malual",
        position: "Secretary for Education",
        icon: GraduationCap,
        description: "Oversees educational programs and initiatives",
        color: "from-blue-500 to-indigo-500",
        image: amerThonImage
    },
    {
        name: "Yom Nhiany Biar",
        position: "Secretary for Health",
        icon: Heart,
        description: "Manages health programs and wellness initiatives",
        color: "from-red-500 to-pink-500",
        image: yomNhianyImage
    },
    {
        name: "Abuk Mabior",
        position: "Secretary for Culture and Sports",
        icon: Trophy,
        description: "Promotes cultural activities and sports programs",
        color: "from-orange-500 to-red-500",
        image: abukImage
    },
    {
        name: "Achol Garang",
        position: "Advisor",
        icon: Lightbulb,
        description: "Provides strategic guidance and counsel",
        color: "from-cyan-500 to-blue-500",
        image: acholGarangImage
    }
];

export interface PayamRepresentative {
    name: string;
    payam: string;
    /** Optional title e.g. Chairlady of Kongor First Class */
    position?: string;
    /** Optional profile image (import or URL) */
    image?: string;
}

export const payamRepresentatives: PayamRepresentative[] = [
    { name: "Abuk Manyiel Deng", payam: "Ajuong", position: "Chairlady of Ajuong Girls", image: abukManyielImage },
    { name: "Aluel Elizabeth Biar", payam: "Kongor", position: "Chairlady of Kongor First Class", image: aluelImage },
    { name: "Roda Akuch Riak Atem", payam: "Lith", position: "Chairlady of Lith Girls", image: akuchImage },
    { name: "Athiei Abuoi Giet", payam: "Nyuak", position: "Chairlady of Nyuak Pride Girls", image: athieiAbuoiImage },
    { name: "Atoch Atem Juach", payam: "Pakeer", position: "Chairlady of Pakeer Golden Girls", image: atochImage },
    { name: "Alakiir Tit Diing", payam: "Pawuoi", position: "Chairlady of Pawuoi Princess", image: alakiirImage }
];

