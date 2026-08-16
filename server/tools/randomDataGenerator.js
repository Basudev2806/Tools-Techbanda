import crypto from "node:crypto";

const FIRST_NAMES = ["Aarav", "Priya", "James", "Emma", "Wei", "Fatima", "Liam", "Sofia", "Noah", "Ananya", "Lucas", "Mia", "Rohan", "Isla", "Kenji", "Zara", "Omar", "Elena", "Arjun", "Chloe"];
const LAST_NAMES = ["Sharma", "Patel", "Smith", "Johnson", "Chen", "Khan", "Garcia", "Müller", "Nguyen", "Kapoor", "Brown", "Silva", "Kim", "Fischer", "Yamada", "Ali", "Rossi", "Andersen", "Singh", "Costa"];
const STREETS = ["Park Ave", "Main St", "Oak Rd", "Maple Ln", "Cedar Blvd", "Elm St", "Sunset Dr", "Lake View Rd", "Church St", "Station Rd"];
const CITIES = ["Kolkata", "Mumbai", "Austin", "Berlin", "Toronto", "Singapore", "Lagos", "Osaka", "Madrid", "Sydney"];
const DOMAINS = ["example.com", "mail.test", "sample.org", "demo.dev"];
const COMPANIES = ["Globex", "Initech", "Umbrella Corp", "Acme Inc", "Hooli", "Wayne Enterprises", "Stark Industries", "Wonka Co"];

function pick(arr) {
  return arr[crypto.randomInt(0, arr.length)];
}

function randomDigits(n) {
  let s = "";
  for (let i = 0; i < n; i++) s += crypto.randomInt(0, 10);
  return s;
}

function makePerson() {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  return {
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${crypto.randomInt(1, 99)}@${pick(DOMAINS)}`,
    phone: `+1-${randomDigits(3)}-${randomDigits(3)}-${randomDigits(4)}`,
    address: `${crypto.randomInt(1, 9999)} ${pick(STREETS)}, ${pick(CITIES)}`,
    company: pick(COMPANIES),
  };
}

/**
 * body: { count?: number, fields?: string[] }
 * fields subset of: name, email, phone, address, company
 */
export default function randomDataGenerator(body = {}) {
  const { count = 5, fields = ["name", "email", "phone", "address", "company"] } = body;
  const n = Math.min(Math.max(Number(count) || 5, 1), 50);
  const wanted = Array.isArray(fields) && fields.length ? fields : ["name", "email", "phone", "address", "company"];

  const rows = [];
  for (let i = 0; i < n; i++) {
    const person = makePerson();
    const row = {};
    wanted.forEach((f) => {
      if (person[f] !== undefined) row[f] = person[f];
    });
    rows.push(row);
  }

  return { ok: true, output: JSON.stringify(rows, null, 2) };
}
