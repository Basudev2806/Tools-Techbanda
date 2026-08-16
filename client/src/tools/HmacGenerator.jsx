import GeneratorForm from "../components/GeneratorForm";

export default function HmacGenerator() {
  return (
    <GeneratorForm
      toolId="hmac-generator"
      hint="Sign a message with a secret key."
      initial={{ message: "hello world", secret: "", algorithm: "sha256", encoding: "hex" }}
      actionLabel="Sign"
      fields={[
        { key: "message", label: "message", type: "textarea", rows: 4 },
        { key: "secret", label: "secret key" },
        { key: "algorithm", label: "algorithm", type: "select", options: ["sha256", "sha1", "sha384", "sha512", "md5"] },
        { key: "encoding", label: "output encoding", type: "select", options: ["hex", "base64"] },
      ]}
    />
  );
}
