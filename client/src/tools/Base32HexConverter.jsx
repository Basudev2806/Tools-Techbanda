import GeneratorForm from "../components/GeneratorForm";

export default function Base32HexConverter() {
  return (
    <GeneratorForm
      toolId="base32-hex-converter"
      hint="Encode or decode text as Base32 or hex."
      initial={{ input: "techbanda", encoding: "hex", mode: "encode" }}
      actionLabel="Convert"
      fields={[
        { key: "input", label: "input", type: "textarea", rows: 4 },
        { key: "encoding", label: "encoding", type: "select", options: ["hex", "base32"] },
        { key: "mode", label: "direction", type: "select", options: ["encode", "decode"] },
      ]}
    />
  );
}
