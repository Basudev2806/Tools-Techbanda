import LookupTool from "../components/LookupTool";

export default function BrokenLinkChecker() {
  return (
    <LookupTool
      toolId="broken-link-checker"
      hint="Fetch a page and check the status of every outbound link (checks up to 30 links)."
      fieldKey="url"
      fieldLabel="page url"
      placeholder="https://github.com"
      actionLabel="Check links"
    />
  );
}
