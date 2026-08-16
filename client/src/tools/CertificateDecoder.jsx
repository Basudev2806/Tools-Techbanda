import GeneratorForm from "../components/GeneratorForm";

export default function CertificateDecoder() {
  return (
    <GeneratorForm
      toolId="certificate-decoder"
      hint="Paste a PEM certificate to see its parsed fields."
      initial={{ pem: "" }}
      actionLabel="Decode"
      fields={[{ key: "pem", label: "PEM certificate", type: "textarea", rows: 10, placeholder: "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----" }]}
    />
  );
}
