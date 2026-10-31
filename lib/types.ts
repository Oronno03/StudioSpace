// Shared types for the StudioSpace client

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
}

export interface Review {
  _id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  gallery: string[];
  amenities: string[];
  overview: string;
  ownerEmail: string;
  ownerName: string;
  hostPhone?: string;
  rating: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  ownerEmail: string;
  userEmail: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export const STUDIO_CATEGORIES = [
  "Photo Studio",
  "Sound Stage",
  "Podcast Lounge",
  "Music Suite",
  "Art Workshop",
  "Film Stage",
] as const;

/** Home page "Browse by category" cards */
export const CATEGORY_CARDS = [
  {
    name: "Photo Studios",
    query: "Photo Studio",
    blurb: "Cyclorama walls, daylight lofts and strobe-ready stages.",
    image:
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sound Stages",
    query: "Sound Stage",
    blurb: "Grid-rigged cinema stages for film, TV and commercial work.",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Podcast Rooms",
    query: "Podcast Lounge",
    blurb: "Acoustically treated booths with broadcast mics ready to roll.",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Music Suites",
    query: "Music Suite",
    blurb: "Tracking rooms, vocal booths and consoles with character.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Art Workshops",
    query: "Art Workshop",
    blurb: "Kilns, wheels and mess-friendly spaces for making things.",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
  },
];
