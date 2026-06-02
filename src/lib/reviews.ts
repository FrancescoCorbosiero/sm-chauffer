/**
 * Google reviews scaffold.
 *
 * The fake aggregateRating has been removed from JSON-LD (see JsonLd.tsx) to
 * stay within Google's structured-data policy. When real reviews exist, set
 * NEXT_PUBLIC_GOOGLE_PLACE_ID (the Business Profile Place ID) to switch on the
 * live reviews surface, and re-add a *real* aggregateRating sourced from the
 * Places API.
 *
 * To go live later:
 *  1. Find the Place ID: https://developers.google.com/maps/documentation/places/web-service/place-id
 *  2. Set NEXT_PUBLIC_GOOGLE_PLACE_ID (build arg) for the review link/badge.
 *  3. For real ratings in schema, fetch the Places "Place Details" (rating +
 *     userRatingCount) server-side with a Places API key (PLACES_API_KEY,
 *     runtime env) and feed it back into the AggregateRating.
 */

export const GOOGLE_PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

export const hasGoogleReviews = Boolean(GOOGLE_PLACE_ID);

/** Public "write a review" / "see reviews" deep link for the badge/CTA. */
export function googleReviewUrl(): string | null {
  if (!GOOGLE_PLACE_ID) return null;
  return `https://search.google.com/local/reviews?placeid=${GOOGLE_PLACE_ID}`;
}
