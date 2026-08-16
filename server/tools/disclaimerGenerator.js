/**
 * body: { siteName, siteUrl, contactEmail, isProfessionalAdvice?, effectiveDate? }
 */
export default function disclaimerGenerator(body = {}) {
  const { siteName = "", siteUrl = "", contactEmail = "", isProfessionalAdvice = false, effectiveDate = "" } = body;

  if (!siteName.trim() || !contactEmail.trim()) {
    return { ok: false, error: "Site name and contact email are required." };
  }

  const date = effectiveDate.trim() || new Date().toISOString().slice(0, 10);

  const parts = [
    `Disclaimer for ${siteName}`,
    `Effective date: ${date}`,
    "",
    `The information provided by ${siteName}${siteUrl ? ` (${siteUrl})` : ""} is for general informational purposes only. All information is provided in good faith; however, we make no representation or warranty of any kind regarding its accuracy, adequacy, or completeness.`,
  ];

  if (isProfessionalAdvice) {
    parts.push(
      "",
      "No Professional Advice",
      "The content on this site does not constitute professional advice. You should consult a qualified professional before making decisions based on this content."
    );
  }

  parts.push(
    "",
    "External Links",
    "This site may contain links to external websites. We are not responsible for the content or practices of any linked sites.",
    "",
    "Limitation of Liability",
    `Under no circumstance shall ${siteName} be liable for any loss or damage incurred as a result of using this site.`,
    "",
    "Contact Us",
    `Questions about this Disclaimer can be sent to ${contactEmail}.`
  );

  return { ok: true, output: parts.join("\n") };
}
