/**
 * ROOM LISTINGS
 * ----------------------------------------------------------------------------
 * This file is the single source of truth for every room shown on the
 * /rooms page. The layout reads from this array, so you can add, edit,
 * or remove a room here WITHOUT touching any layout code.
 *
 * HOW TO ADD A NEW ROOM
 * ---------------------
 * 1. Copy one of the objects in the `rooms` array below.
 * 2. Paste it at the top or bottom of the array.
 * 3. Give it a unique `id` (any short slug — e.g. "room-26").
 * 4. Fill in `name`, `location`, `weeklyRent`, `moveInCost`,
 *    `availability`, `amenities`, `description`, `images`, `sourceUrl`.
 *
 * HOW TO ADD / UPDATE ROOM PICTURES
 * ---------------------------------
 * Put one or more publicly accessible image URLs into the `images` array
 * (e.g. https:// links, or paths like "/rooms/my-room.jpg" if the image
 * lives in /public). The first item in `images` is shown by default and
 * the rest become swipeable additional photos on the card. If `images`
 * is empty the card automatically shows an elegant "Room photo coming
 * soon" placeholder.
 *
 * `imageUrl` (legacy) is kept for backwards compatibility and is treated
 * as a fallback when `images` is empty.
 *
 * HOW TO UPDATE PRICE / ADDRESS / AMENITIES / AVAILABILITY
 * --------------------------------------------------------
 * Just edit the string values on the matching room object. The page
 * re-renders automatically on save. Keep the format consistent
 * (e.g. "$200 weekly", "Available", etc.) so cards stay aligned.
 */

export type Room = {
  id: string;
  name: string;
  location: string;
  weeklyRent: string;
  moveInCost: string;
  availability: string;
  amenities: string[];
  description: string;
  /** Primary image (legacy single-image field). Used as fallback if `images` is empty. */
  imageUrl: string;
  /** Full gallery of images for this room. First item is the cover photo. */
  images: string[];
  sourceUrl: string;
};

const DEFAULT_AMENITIES = [
  "WiFi",
  "Utilities",
  "Kitchen Access",
  "Bathroom Access",
];

const DEFAULT_DESCRIPTION =
  "Comfortable private bedroom inside a thoughtfully kept smartroomusa.com residence. Enjoy fully furnished shared living spaces, straightforward weekly rent, and a quick, hassle-free move-in.";

export const rooms: Room[] = [
  {
    id: "east-point",
    name: "East Point",
    location: "East Point, Atlanta, GA",
    weeklyRent: "from $1/week",
    moveInCost: "Call for move-in cost",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-58_1.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-58_1.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-58_2.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-58.jpg",
    ],
    sourceUrl: "https://smartroomzusa.com/room/east-point/",
  },
  {
    id: "midtown-howell-mill",
    name: "Midtown Howell Mill",
    location: "Midtown / Howell Mill, Atlanta, GA",
    weeklyRent: "from $250/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-25_1-2.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-25_1-2.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-25_2-2.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-25-2.jpg",
    ],
    sourceUrl: "https://smartroomzusa.com/room/midtown-howell-mill/",
  },
  {
    id: "boulevard-midtown",
    name: "Boulevard Midtown",
    location: "Boulevard / Midtown, Atlanta, GA",
    weeklyRent: "from $250/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-25_1-1.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-25_1-1.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-25_2-1.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-25_3-1.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-25_4.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-25-1.jpg",
    ],
    sourceUrl: "https://smartroomzusa.com/room/boulevard-midtown/",
  },
  {
    id: "ellen-wood-suite",
    name: "Ellen Wood Traditional Suite",
    location: "Ellen Wood, Atlanta, GA",
    weeklyRent: "from $200/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-25_1.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-25_1.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-25_2.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-25_3.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/PHOTO-2024-03-24-18-19-25.jpg",
    ],
    sourceUrl: "https://smartroomzusa.com/room/ellen-wood-traditional-suite/",
  },
  {
    id: "mountain-view-pass-2",
    name: "Mountain View Pass",
    location: "5605 Mountain View Pass, Stone Mountain, GA",
    weeklyRent: "from $194/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-03-at-10.36.04-PM.jpeg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-03-at-10.36.04-PM.jpeg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-03-at-10.35.58-PM.jpeg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-03-at-10.35.03-PM.jpeg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-03-at-10.34.47-PM.jpeg",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/5605-mountain-view-pass-stone-mountain-ga-2/",
  },
  {
    id: "ormond-st-sw",
    name: "Ormond St SW",
    location: "50 Ormond St SW, Atlanta, GA 30315",
    weeklyRent: "from $200/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-07-at-4.24.09-AM.jpeg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-07-at-4.24.09-AM.jpeg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-07-at-4.23.42-AM.jpeg",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/50-ormond-st-sw-atlanta-ga-30315/",
  },
  {
    id: "mountain-view-pass",
    name: "Mountain View Pass",
    location: "5605 Mountain View Pass, Stone Mountain, GA",
    weeklyRent: "from $194/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-03-at-10.36.04-PM.jpeg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-03-at-10.36.04-PM.jpeg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-03-at-10.35.58-PM.jpeg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-03-at-10.35.03-PM.jpeg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-03-at-10.34.47-PM.jpeg",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/5605-mountain-view-pass-stone-mountain-ga/",
  },
  {
    id: "santa-barbara-dr",
    name: "Santa Barbara Dr",
    location: "2909 Santa Barbara Dr, Decatur, GA",
    weeklyRent: "from $163/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-02-at-8.14.33-AM.jpeg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-02-at-8.14.33-AM.jpeg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-02-at-8.14.27-AM.jpeg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-02-at-8.14.21-AM.jpeg",
    ],
    sourceUrl: "https://smartroomzusa.com/room/2909-santa-barbara-dr-decatur-ga/",
  },
  {
    id: "bonds-lake-rd",
    name: "Bonds Lake Rd",
    location: "2527 Bonds Lake Rd NW, Conyers, GA 30012",
    weeklyRent: "from $250/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-02-at-8.13.40-AM.jpeg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-02-at-8.13.40-AM.jpeg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-02-at-8.12.43-AM.jpeg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-02-at-8.12.32-AM.jpeg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-02-at-8.12.17-AM.jpeg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-02-at-6.21.17-AM.jpeg",
      "https://smartroomzusa.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-02-at-6.21.10-AM.jpeg",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/2527-bonds-lake-rd-nw-conyers-30012/",
  },
  {
    id: "kenora-grove-park",
    name: "Kenora Dr SW — Grove Park",
    location: "Kenora Dr SW / Grove Park, Atlanta, GA 30331",
    weeklyRent: "from $200/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.12_04d05ea7.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.12_04d05ea7.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.12_07df3693.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.12_51f9ae52.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.12_d30407e5.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_5a9b95fa.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_5a428cde.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_56c8315d.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_98f50ae9.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_36791de8.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_0648639e.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_fb9b99c2.jpg",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/test-kenora-dr-sw-grove-park-atlanta-ga-30331/",
  },
  {
    id: "eastridge-oakland-city",
    name: "Eastridge Rd — Oakland City",
    location: "1204 Eastridge Rd / Oakland City, Atlanta, GA 30311",
    weeklyRent: "from $175/week",
    moveInCost: "$464 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-11-at-20.30.10_08cca79f.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-11-at-20.30.10_08cca79f.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-11-at-20.34.42_e2d12094.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-11-at-20.40.08_3bcb99ce.jpg",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/1204-eastridge-road-oakland-city-atlanta-ga-3314/",
  },
  {
    id: "_placeholder_removed",
    name: "",
    location: "",
    weeklyRent: "",
    moveInCost: "",
    availability: "",
    amenities: [],
    description: "",
    imageUrl: "",
    images: [],
    sourceUrl: "",
  },
  {
    id: "jones-west-midtown",
    name: "Jones Ave — West Midtown",
    location: "581 Jones Ave / West Midtown, Atlanta, GA 30314",
    weeklyRent: "from $200/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl: "https://smartroomzusa.com/wp-content/uploads/2023/12/newwww.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2023/12/newwww.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-11-at-20.19.25_709113d4.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/other-bedroom.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/kitchen.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/laundry.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-11-at-20.24.47_5b3a3dcc.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/bathroom.jpg",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/581-jones-ave-west-midtown-atlanta-ga-30314/",
  },
  {
    id: "sandy-springs-buckhead",
    name: "Sandy Springs / Buckhead",
    location: "Sandy Springs / Buckhead, Atlanta, GA 30327",
    weeklyRent: "from $250/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-14.30.22_6f63e678.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-14.30.22_6f63e678.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-14.30.42_81452250.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-14.31.01_5df49147.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-14.31.31_6c203539.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-14.31.52_a62fa2db.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-14.32.17_638a811a.jpg",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/sandy-springs-buck-head-atlanta-ga-30327/",
  },
  {
    id: "melrose-adair-park",
    name: "Melrose Dr SW — Adair Park",
    location: "Melrose Dr SW / Adair Park, Atlanta, GA 30310",
    weeklyRent: "from $200/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.30.48_2df5a6b6.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.30.48_2df5a6b6.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.30.48_7bc04f9f.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.30.48_e8b3dee7.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.30.49_2bb637cb.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.30.49_977f677b.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.30.49_998caff7.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.30.49_d8c734a5.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.30.49_f4efdedc.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.30.49_ff746979.jpg",
    ],
    sourceUrl: "https://smartroomzusa.com/room/melrose-dr-sw-atlanta-ga-30310/",
  },
  {
    id: "kenora-grove-park-2",
    name: "Kenora Dr SW — Grove Park",
    location: "Kenora Dr SW / Grove Park, Atlanta, GA 30331",
    weeklyRent: "from $200/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.12_04d05ea7.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.12_04d05ea7.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.12_07df3693.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.12_51f9ae52.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.12_d30407e5.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_5a9b95fa.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_5a428cde.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_7be20e0b.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_7c7e6633.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_56c8315d.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_98f50ae9.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_36791de8.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_0648639e.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_fb9b99c2.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-13.29.13_fc2f4fdf.jpg",
    ],
    sourceUrl: "https://smartroomzusa.com/room/kenora-dr-sw-atlanta-ga-30331/",
  },
  {
    id: "lockwood-oakland-city",
    name: "Lockwood Dr SW — Oakland City",
    location: "Lockwood Dr SW / Oakland City, Atlanta, GA 30311",
    weeklyRent: "from $175/week",
    moveInCost: "$464 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-11.26.26_8b0164f2.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-11.26.26_8b0164f2.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-11.24.08_7f0b376e.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-11.25.48_bb6080d0.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/new.jpg",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/lockwood-dr-sw-atlanta-ga-30311/",
  },
  {
    id: "sarah-harden-oakland-city",
    name: "Sarah M Harden Dr SW — Oakland City",
    location: "Sarah M Harden Dr SW / Oakland City, Atlanta, GA 30311",
    weeklyRent: "from $200/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-29-at-20.20.53_edabdba8-1.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-29-at-20.20.53_edabdba8-1.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-29-at-20.17.02_b6ac1589-1.jpg",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/sarah-m-harden-dr-sw-atlanta-ga-30311/",
  },
  {
    id: "childress-cascade",
    name: "Childress Dr SW — Cascade",
    location: "1560 Childress Dr SW / Cascade, Atlanta, GA 30311",
    weeklyRent: "from $200/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-11.32.45_1ad9c172.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-11.32.45_1ad9c172.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-11-30-at-11.33.07_c02d3244.jpg",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/1560-childress-dr-sw-atlanta-ga-30311/",
  },
  {
    id: "misty-valley-decatur",
    name: "Misty Valley Rd — Decatur",
    location: "Misty Valley Rd / Decatur, Atlanta, GA 30032",
    weeklyRent: "from $250/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl: "https://smartroomzusa.com/wp-content/uploads/2023/12/mist.jpg",
    images: ["https://smartroomzusa.com/wp-content/uploads/2023/12/mist.jpg"],
    sourceUrl: "https://smartroomzusa.com/room/mist-valley/",
  },
  {
    id: "bennington-mableton",
    name: "Bennington Bluff Ct — Mableton",
    location: "Bennington Bluff Ct / Mableton, Atlanta, GA 30126",
    weeklyRent: "from $206.25/week",
    moveInCost: "$495 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2023/12/Mableton4.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2023/12/Mableton4.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/Mableton3.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/Mableton2.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/Mableton1.jpg",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/bennington-bluff-ct-mableton-ga-30126/",
  },
  {
    id: "fairington-stonecrest",
    name: "Fairington Farms Ln — Stonecrest",
    location: "5886 Fairington Farms Ln / Lithonia – Stonecrest, GA 30038",
    weeklyRent: "from $200/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2023/12/stonecrest11.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2023/12/stonecrest11.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/stonecrest10.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/stonecrest9.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/stonecrest8.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/stonecrest7.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/stonecrest6.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/stonecrest5.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/stonecrest4.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/stonecrest1.jpg",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/5886-fairington-farms-lnstonecrest-ga-30038/",
  },
  {
    id: "rockbridge-stone-mountain",
    name: "Rockbridge Rd SW — Stone Mountain",
    location: "2388 Rockbridge Rd SW / Stone Mountain, Atlanta, GA 30087",
    weeklyRent: "from $187.50/week",
    moveInCost: "$478 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2023/12/mountain2.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2023/12/mountain2.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/mountain1.jpg",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/2388-rockbridge-rd-swstone-mountain-ga-30087/",
  },
  {
    id: "vesta-dixie-hills",
    name: "Vesta Ave NW — Dixie Hills",
    location: "2176 Vesta Ave NW / Dixie Hills, Atlanta, GA 30314",
    weeklyRent: "from $200/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2023/12/vista-5.png",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2023/12/vista-5.png",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/vista-4.png",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/vista-3.png",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/vista-2.png",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/2176-vesta-ave-nw-atlanta-ga-30314/",
  },
  {
    id: "westley-riverdale",
    name: "Westley Dr — Riverdale",
    location: "1986 Westley Dr / Riverdale, Atlanta, GA 30296",
    weeklyRent: "from $200/week",
    moveInCost: "$489 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl:
      "https://smartroomzusa.com/wp-content/uploads/2023/12/westley1.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2023/12/westley1.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/westley3.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/westley4.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/westley5.jpg",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/1986-westley-drriverdale-ga-30296/",
  },
  {
    id: "n-druid-hills",
    name: "N Druid Hills Rd",
    location: "1478 N Druid Hills Rd, Atlanta, GA 30319",
    weeklyRent: "from $300/week",
    moveInCost: "$589 estimated move-in",
    availability: "Call for availability",
    amenities: DEFAULT_AMENITIES,
    description: DEFAULT_DESCRIPTION,
    imageUrl: "https://smartroomzusa.com/wp-content/uploads/2023/12/druid3.jpg",
    images: [
      "https://smartroomzusa.com/wp-content/uploads/2023/12/druid3.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/druid2.jpg",
      "https://smartroomzusa.com/wp-content/uploads/2023/12/druid1.jpg",
    ],
    sourceUrl:
      "https://smartroomzusa.com/room/1478-n-druid-hills-rd-atlanta-ga-30319/",
  },
];
