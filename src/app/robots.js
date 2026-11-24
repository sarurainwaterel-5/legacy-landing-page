import { SITE } from "@/lib/site";
export default function robots() {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/portal", "/admin", "/api/", "/login", "/thank-you"] }], sitemap: `${SITE.url}/sitemap.xml` };
}
