export function isChampaignUrbanaArea(locationDescription: string): boolean {
  const s = locationDescription.toLowerCase();
  return (
    s.includes("champaign") ||
    s.includes("urbana") ||
    s.includes("uiuc") ||
    s.includes("university of illinois")
  );
}
