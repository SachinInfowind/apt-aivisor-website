/**
 * Design Partner application — the only form data that stays in code.
 *
 * Option lists (dropdowns, buyer/seller, vendor + category chips) and all
 * field labels / placeholders / hints live in Strapi
 * (`sections.design-partner-form` → `options` + `fields`). Option values are
 * plain strings to the validation schema, so editors can rename, reorder,
 * add or remove them freely.
 *
 * What can't be CMS-driven is which *state field* a tech category reveals —
 * that's tied to the submission schema.
 */

/** Maps a tech category value to the conditional detail field it reveals. */
export const CATEGORY_DETAIL_FIELD: Record<string, string> = {
  "cloud-standalone-storage": "storageDetail",
  "cloud-standalone-data-analytics": "dataAnalyticsDetail",
  "cloud-standalone-compute": "computeDetail",
  "cloud-standalone-networking": "networkingDetail",
  "cloud-ai-services": "aiServicesDetail",
  "cloud-managed-services": "managedServicesCloudDetail",
  "computer-peripherals": "peripheralsDetail",
  "managed-services": "managedServicesDetail",
  bundled: "bundledDetail",
};
