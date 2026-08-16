/**
 * body: { siteName, siteUrl, contactEmail, governingLaw?, effectiveDate? }
 */
export default function termsGenerator(body = {}) {
  const { siteName = "", siteUrl = "", contactEmail = "", governingLaw = "", effectiveDate = "" } = body;

  if (!siteName.trim() || !contactEmail.trim()) {
    return { ok: false, error: "Site name and contact email are required." };
  }

  const date = effectiveDate.trim() || new Date().toISOString().slice(0, 10);

  const parts = [
    `Terms & Conditions for ${siteName}`,
    `Effective date: ${date}`,
    "",
    `By accessing or using ${siteName}${siteUrl ? ` (${siteUrl})` : ""}, you agree to be bound by these Terms & Conditions.`,
    "",
    "Use of the Site",
    "You agree to use this site only for lawful purposes and in a way that does not infringe the rights of, or restrict or inhibit the use of, this site by any third party.",
    "",
    "Intellectual Property",
    "All content on this site, including text, graphics, logos, and images, is the property of its respective owners and protected by applicable intellectual property laws.",
    "",
    "Limitation of Liability",
    `${siteName} shall not be liable for any indirect, incidental, or consequential damages arising from your use of the site.`,
    "",
    "Changes to These Terms",
    "We may update these Terms & Conditions from time to time. Continued use of the site after changes constitutes acceptance of the revised terms.",
  ];

  if (governingLaw.trim()) {
    parts.push("", "Governing Law", `These terms are governed by the laws of ${governingLaw}.`);
  }

  parts.push("", "Contact Us", `Questions about these Terms & Conditions can be sent to ${contactEmail}.`);

  return { ok: true, output: parts.join("\n") };
}
