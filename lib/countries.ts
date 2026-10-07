import { getCountries } from "react-phone-number-input";
import countryNames from "react-phone-number-input/locale/en.json";

/**
 * Full list of country display names, sorted alphabetically with the United
 * States pinned first. Reuses `react-phone-number-input`'s ISO country list
 * and English name locale data — already an installed dependency (used for
 * the Contact form's phone country picker) — rather than adding a second
 * country-data package.
 */
export const ALL_COUNTRY_NAMES: string[] = (() => {
  const names = getCountries()
    .map((code) => countryNames[code])
    .filter((name): name is string => Boolean(name))
    .sort((a, b) => a.localeCompare(b));

  const withoutUS = names.filter((name) => name !== "United States");
  return ["United States", ...withoutUS];
})();
