import LookupTool from "../components/LookupTool";

export default function WebsiteStatus() {
  return (
    <LookupTool
      toolId="website-status"
      hint="Check a URL's HTTP status and response time."
      fieldKey="url"
      fieldLabel="url"
      placeholder="https://github.com"
      actionLabel="Check status"
    />
  );
}
