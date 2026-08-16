import Ajv from "ajv";

/**
 * body: { schema: string, data: string }
 */
export default function jsonSchemaValidator(body = {}) {
  const { schema = "", data = "" } = body;

  if (!schema.trim() || !data.trim()) {
    return { ok: false, error: "Provide both a JSON Schema and JSON data to validate." };
  }

  let parsedSchema, parsedData;
  try {
    parsedSchema = JSON.parse(schema);
  } catch {
    return { ok: false, error: "Schema is not valid JSON." };
  }
  try {
    parsedData = JSON.parse(data);
  } catch {
    return { ok: false, error: "Data is not valid JSON." };
  }

  try {
    const ajv = new Ajv({ allErrors: true, strict: false });
    const validate = ajv.compile(parsedSchema);
    const valid = validate(parsedData);

    if (valid) {
      return { ok: true, output: "Valid \u2713 — data matches the schema." };
    }

    const errors = (validate.errors || [])
      .map((e) => `${e.instancePath || "(root)"} ${e.message}`)
      .join("\n");
    return { ok: true, output: `Invalid \u2717\n\n${errors}` };
  } catch (err) {
    return { ok: false, error: "Could not compile that schema: " + err.message };
  }
}
