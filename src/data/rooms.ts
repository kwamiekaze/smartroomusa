/**
 * ROOM LISTINGS
 * ----------------------------------------------------------------------------
 * Room data lives in ./rooms.json (synced from https://smartroomzusa.com —
 * 504 listings, photos self-hosted in /public/rooms so they never disappear).
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
  city: string;
  /** e.g. "Private room · 1 Queen bed · Shared bath" */
  details: string;
  weeklyRent: string;
  moveInCost: string;
  biweeklyRent: string;
  monthlyRent: string;
  availability: string;
  amenities: string[];
  description: string;
  /** Primary image (legacy single-image field). Used as fallback if `images` is empty. */
  imageUrl: string;
  /** Full gallery of images for this room. First item is the cover photo. */
  images: string[];
  photoNote: string;
  featured: boolean;
  sourceUrl: string;
};

import roomsData from "./rooms.json";

// De-duplicate by id as a safety net (first occurrence wins).
export const rooms: Room[] = Array.from(
  new Map((roomsData as Room[]).map((r) => [r.id, r])).values(),
);
