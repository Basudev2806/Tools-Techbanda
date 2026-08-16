/**
 * body: { siteName, siteUrl, contactEmail, collectsCookies?, collectsAnalytics?, effectiveDate? }
 */
export default function privacyPolicyGenerator(body = {}) {
  const {
    siteName = "",
    siteUrl = "",
    contactEmail = "",
    collectsCookies = true,
    collectsAnalytics = true,
    effectiveDate = "",
  } = body;

  if (!siteName.trim() || !contactEmail.trim()) {
    return { ok: false, error: "Site name and contact email are required." };
  }

  const date = effectiveDate.trim() || new Date().toISOString().slice(0, 10);

  const parts = [
    `Privacy Policy for ${siteName}`,
    `Effective date: ${date}`,
    "",
    `This Privacy Policy describes how ${siteName}${siteUrl ? ` (${siteUrl})` : ""} collects, uses, and discloses information when you use our website.`,
    "",
    "Information We Collect",
    "We may collect information you provide directly to us, such as your name and email address when you contact us, along with technical information like your IP address and browser type.",
  ];

  if (collectsCookies) {
    parts.push(
      "",
      "Cookies",
      "We use cookies and similar tracking technologies to operate our site and improve your experience. You can control cookies through your browser settings."
    );
  }

  if (collectsAnalytics) {
    parts.push(
      "",
      "Analytics",
      "We use analytics tools to understand how visitors use our site. These tools may collect information such as pages visited and time spent on the site."
    );
  }

  parts.push(
    "",
    "How We Use Information",
    "We use the information we collect to operate, maintain, and improve our website, and to respond to your inquiries.",
    "",
    "Data Sharing",
    "We do not sell your personal information. We may share information with service providers who help us operate our website, under confidentiality obligations.",
    "",
    "Your Rights",
    "You may contact us to request access to, correction of, or deletion of your personal information.",
    "",
    "Contact Us",
    `If you have questions about this Privacy Policy, contact us at ${contactEmail}.`
  );

  return { ok: true, output: parts.join("\n") };
}
