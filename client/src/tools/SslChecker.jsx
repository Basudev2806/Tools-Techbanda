import LookupTool from "../components/LookupTool";

export default function SslChecker() {
  return (
    <LookupTool
      toolId="ssl-checker"
      hint="Inspect a domain's TLS certificate."
      fieldKey="domain"
      fieldLabel="domain"
      placeholder="github.com"
      actionLabel="Check certificate"
    />
  );
}
