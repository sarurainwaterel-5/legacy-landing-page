import { SITE } from "@/lib/site";
export default function sitemap() {
  return ["", "/life-insurance", "/credit-repair", "/tax-preparation", "/about", "/privacy", "/terms"].map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
