import LookupTool from "../components/LookupTool";

export default function NsLookup() {
  return (
    <LookupTool
      toolId="ns-lookup"
      hint="Look up a domain's nameservers."
      fieldKey="domain"
      fieldLabel="domain"
      placeholder="github.com"
      actionLabel="Look up"
    />
  );
}
