import LookupTool from "../components/LookupTool";

export default function MetaDescriptionChecker() {
  return (
    <LookupTool
      toolId="meta-description-checker"
      hint="Fetch a page and check its meta description length against SEO best practice."
      fieldKey="url"
      fieldLabel="url"
      placeholder="https://github.com"
      actionLabel="Check"
    />
  );
}
