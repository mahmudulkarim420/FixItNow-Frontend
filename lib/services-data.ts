export type ServiceCategory =
  | "Cooling"
  | "Plumbing"
  | "Electrical"
  | "Appliances"
  | "Home Care";

export interface RepairService {
  id: string;
  name: string;
  shortName: string;
  category: ServiceCategory;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  priceLabel: string;
  originalPrice?: number;
  duration: string;
  rating: number;
  reviews: number;
  badge: string;
  image: string;
  imagePosition?: string;
  includes: string[];
  features: string[];
  technicianProfileId?: string;
  technician: {
    id?: string;
    name: string;
    email?: string;
    role: string;
    experience: string;
    rating: number;
    jobs: number;
    image: string;
    bio?: string;
    location?: string;
    skills?: string[];
    hourlyRate?: number;
    isVerified?: boolean;
  };
}

export const serviceCategories = [
  "All Services",
  "Cooling",
  "Plumbing",
  "Electrical",
  "Appliances",
  "Home Care",
] as const;

export type ServiceFilter = (typeof serviceCategories)[number];

export const services: RepairService[] = [
  {
    id: "ac-repair",
    name: "AC Repair & Tune-Up",
    shortName: "AC Repair",
    category: "Cooling",
    tagline: "Cool comfort, restored in one expert visit.",
    description:
      "Complete diagnosis, deep cleaning, and performance tuning for split and window AC units.",
    longDescription:
      "When your AC stops keeping up, our cooling specialists find the real cause instead of guessing. We inspect airflow, electrical components, refrigerant performance, drainage, and filters, then explain every recommended fix before work begins.",
    price: 79,
    priceLabel: "Starts at",
    originalPrice: 99,
    duration: "60-90 min",
    rating: 4.9,
    reviews: 328,
    badge: "Most booked",
    image:
      "https://images.unsplash.com/photo-1631545806609-1c2397f6c58d?auto=format&fit=crop&q=85&w=1200",
    includes: [
      "Full 18-point system inspection",
      "Filter and drainage cleaning",
      "Cooling performance test",
      "Upfront repair recommendation",
    ],
    features: [
      "Same-day appointments",
      "30-day service guarantee",
      "No hidden call-out fees",
      "Certified cooling specialists",
    ],
    technician: {
      name: "Marcus Reed",
      role: "Senior HVAC Specialist",
      experience: "12 years experience",
      rating: 4.98,
      jobs: 1240,
      image:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=85&w=400",
    },
  },
  {
    id: "plumbing-care",
    name: "Plumbing & Leak Care",
    shortName: "Plumbing",
    category: "Plumbing",
    tagline: "Small drip or big problem, we stop it fast.",
    description:
      "Fast help for leaking taps, blocked drains, pipe repairs, and everyday plumbing emergencies.",
    longDescription:
      "Our licensed plumbers arrive prepared to diagnose and resolve the most common household plumbing issues in a single visit. You get a clear assessment, transparent options, and tidy workmanship that respects your home.",
    price: 65,
    priceLabel: "Starts at",
    duration: "45-90 min",
    rating: 4.8,
    reviews: 264,
    badge: "Same day",
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=85&w=1200",
    includes: [
      "Leak and pressure diagnosis",
      "Minor fittings and seal repair",
      "Drain flow inspection",
      "Clean-up after completion",
    ],
    features: [
      "Licensed local plumbers",
      "Emergency slots available",
      "90-day workmanship warranty",
      "Transparent parts pricing",
    ],
    technician: {
      name: "Daniel Foster",
      role: "Master Plumber",
      experience: "10 years experience",
      rating: 4.94,
      jobs: 980,
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=85&w=400",
    },
  },
  {
    id: "electrical-safety",
    name: "Electrical Safety Fix",
    shortName: "Electrical",
    category: "Electrical",
    tagline: "Safe, precise electrical work you can trust.",
    description:
      "Expert troubleshooting for sockets, switches, lighting, breakers, and wiring concerns.",
    longDescription:
      "Electrical issues deserve careful attention. Our certified electricians use professional diagnostic equipment to isolate faults, check safety, and complete approved minor repairs with minimal disruption to your day.",
    price: 72,
    priceLabel: "Starts at",
    duration: "45-75 min",
    rating: 4.9,
    reviews: 219,
    badge: "Safety checked",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=85&w=1200",
    includes: [
      "Electrical safety assessment",
      "Fault and circuit diagnosis",
      "Minor switch or socket repair",
      "Written service summary",
    ],
    features: [
      "Certified electricians",
      "Safety-first procedures",
      "Insured workmanship",
      "Clear scope before work",
    ],
    technician: {
      name: "Elena Torres",
      role: "Certified Electrician",
      experience: "9 years experience",
      rating: 4.97,
      jobs: 846,
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=85&w=400",
    },
  },
  {
    id: "appliance-fixing",
    name: "Appliance Fixing",
    shortName: "Appliances",
    category: "Appliances",
    tagline: "Give your essential appliances a second life.",
    description:
      "Reliable diagnosis and repair for washers, dryers, refrigerators, ovens, and dishwashers.",
    longDescription:
      "Avoid replacing an appliance before its time. Our technicians test the core components, identify the failing part, and provide a practical repair estimate for the appliances your household relies on most.",
    price: 89,
    priceLabel: "Diagnosis from",
    originalPrice: 109,
    duration: "60-120 min",
    rating: 4.7,
    reviews: 187,
    badge: "Best value",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=85&w=1200",
    includes: [
      "Complete appliance diagnosis",
      "Performance and safety testing",
      "Repair-versus-replace advice",
      "Itemized parts estimate",
    ],
    features: [
      "All major brands supported",
      "Genuine parts available",
      "60-day repair warranty",
      "Flexible appointment windows",
    ],
    technician: {
      name: "Noah Williams",
      role: "Appliance Technician",
      experience: "8 years experience",
      rating: 4.91,
      jobs: 735,
      image:
        "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?auto=format&fit=crop&q=85&w=400",
    },
  },
  {
    id: "water-heater-repair",
    name: "Water Heater Repair",
    shortName: "Water Heater",
    category: "Plumbing",
    tagline: "Bring reliable hot water back to your home.",
    description:
      "Inspection and repair for inconsistent heating, leaks, unusual noise, and pilot issues.",
    longDescription:
      "A struggling water heater can disrupt your whole routine. We inspect heating elements, controls, valves, connections, and sediment buildup to restore dependable performance safely and efficiently.",
    price: 95,
    priceLabel: "Starts at",
    duration: "60-120 min",
    rating: 4.8,
    reviews: 143,
    badge: "Expert pick",
    image:
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=85&w=1200",
    includes: [
      "Tank and connection inspection",
      "Heating element diagnosis",
      "Valve and thermostat check",
      "Safety and temperature test",
    ],
    features: [
      "Gas and electric systems",
      "Upfront replacement advice",
      "90-day workmanship warranty",
      "Code-compliant service",
    ],
    technician: {
      name: "Daniel Foster",
      role: "Master Plumber",
      experience: "10 years experience",
      rating: 4.94,
      jobs: 980,
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=85&w=400",
    },
  },
  {
    id: "home-maintenance",
    name: "Home Maintenance Visit",
    shortName: "Home Care",
    category: "Home Care",
    tagline: "Your lingering fix-it list, finally finished.",
    description:
      "A versatile expert for mounting, minor repairs, adjustments, sealing, and household upkeep.",
    longDescription:
      "Bundle the small jobs that have been waiting around the house into one productive visit. Our multi-skilled home specialists bring a broad toolkit and work through your prioritized list with care and efficiency.",
    price: 59,
    priceLabel: "First hour",
    duration: "60 min+",
    rating: 4.9,
    reviews: 301,
    badge: "Customer favorite",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=85&w=1200",
    includes: [
      "Pre-visit task review",
      "One hour of skilled labor",
      "Professional tool kit",
      "Post-service quality check",
    ],
    features: [
      "Multi-skilled professionals",
      "Extend time as needed",
      "Respectful home protection",
      "30-day service guarantee",
    ],
    technician: {
      name: "Avery Brooks",
      role: "Home Care Specialist",
      experience: "11 years experience",
      rating: 4.96,
      jobs: 1105,
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=400",
    },
  },
  {
    id: "fan-installation",
    name: "Fan & Lighting Install",
    shortName: "Installation",
    category: "Electrical",
    tagline: "A polished installation, done safely.",
    description:
      "Professional installation for ceiling fans, pendant lights, sconces, and smart switches.",
    longDescription:
      "Upgrade the comfort and character of your room without the installation stress. We verify the mounting point and wiring, assemble your fixture, install it securely, and test every function before leaving.",
    price: 68,
    priceLabel: "Per fixture from",
    duration: "45-90 min",
    rating: 4.8,
    reviews: 168,
    badge: "Quick install",
    image:
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=85&w=1200",
    includes: [
      "Mounting point inspection",
      "Fixture assembly and install",
      "Wiring and function test",
      "Packaging clean-up",
    ],
    features: [
      "Standard fixtures included",
      "Smart controls supported",
      "Insured installation",
      "Safety tested on completion",
    ],
    technician: {
      name: "Elena Torres",
      role: "Certified Electrician",
      experience: "9 years experience",
      rating: 4.97,
      jobs: 846,
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=85&w=400",
    },
  },
  {
    id: "deep-home-clean",
    name: "Deep Home Refresh",
    shortName: "Deep Cleaning",
    category: "Home Care",
    tagline: "A detailed reset for a calmer home.",
    description:
      "A thorough top-to-bottom clean for kitchens, bathrooms, living areas, and overlooked corners.",
    longDescription:
      "Our deep refresh goes beyond the weekly routine. A trained home-care team follows a detailed checklist, focuses on buildup and high-touch surfaces, and leaves your most-used spaces noticeably fresher.",
    price: 129,
    priceLabel: "Starts at",
    duration: "2-4 hours",
    rating: 4.9,
    reviews: 212,
    badge: "Top rated",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=85&w=1200",
    includes: [
      "Kitchen and bathroom detail",
      "Floors and surface cleaning",
      "High-touch point sanitizing",
      "Final quality walkthrough",
    ],
    features: [
      "Background-checked team",
      "Supplies included",
      "Pet-conscious products",
      "Satisfaction guarantee",
    ],
    technician: {
      name: "Avery Brooks",
      role: "Home Care Specialist",
      experience: "11 years experience",
      rating: 4.96,
      jobs: 1105,
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=400",
    },
  },
];

export function getServiceById(id: string) {
  return services.find((service) => service.id === id);
}
