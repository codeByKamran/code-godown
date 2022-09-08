import {
  BookmarkAltIcon,
  PhoneIcon,
  MailIcon,
  PlayIcon,
  RefreshIcon,
  ShieldCheckIcon,
  SupportIcon,
  GlobeAltIcon,
  ShoppingCartIcon,
  PencilIcon,
} from "@heroicons/react/outline";
import { BookOpenIcon } from "@heroicons/react/solid";

export const features = [
  {
    name: "Automations",
    description:
      "Build strategic funnels that will drive your customers to convert",
    href: "#",
    icon: RefreshIcon,
  },
  {
    name: "Help Center",
    description:
      "Get all of your questions answered in our forums or contact support.",
    href: "#",
    icon: SupportIcon,
  },
  {
    name: "Guides",
    description:
      "Learn how to maximize our platform to get the most out of it.",
    href: "#",
    icon: BookmarkAltIcon,
  },
  {
    name: "Privacy",
    description: "Understand how we take your privacy seriously.",
    href: "#",
    icon: ShieldCheckIcon,
  },
];

export const callsToAction = [
  { name: "Watch Demo", href: "#", icon: PlayIcon },
  { name: "Contact Support", href: "#", icon: PhoneIcon },
];

export const moreFromMe = [
  {
    name: "Personal Blog",
    description:
      "Personal blog built with Next.js with Sanity CMS. Using SSR and ISR by Next.js.",
    href: "https://blogbykamran.vercel.app/",
    icon: PencilIcon,
  },
  {
    name: "COVID-19 Tracker",
    description:
      "Realtime COVID-19 tracker built with ReactJs and desease.sh api.",
    href: "https://covidtracker-kamran.vercel.app/",
    icon: ShieldCheckIcon,
  },
  {
    name: "API Archive application",
    description:
      "Built API archive application using MERN stack with over 1400+ apis at the moment. ",
    href: "http://apiarchive-kamran.vercel.app/",
    icon: ShoppingCartIcon,
  },
  {
    name: "Library Application",
    description:
      "Simple library application built with MERN stack, to manage students and books.",
    href: "http://library-kamran.vercel.app/",
    icon: BookOpenIcon,
  },
];

export const moreFromMeActions = [
  {
    name: "Visit Website",
    href: "https://kamranashraf.vercel.app/",
    icon: GlobeAltIcon,
  },
  {
    name: "Contact Me",
    href: "mailto:kamran.contactme@gmail.com",
    icon: MailIcon,
  },
];
