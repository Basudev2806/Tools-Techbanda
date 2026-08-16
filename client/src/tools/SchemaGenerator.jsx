import { useState } from "react";
import { runTool } from "../api";

export default function SchemaGenerator() {
  const [type, setType] = useState("Article");

  const [title, setTitle] = useState("How to Build a Tools Console");
  const [author, setAuthor] = useState("Basu");
  const [datePublished, setDatePublished] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [name, setName] = useState("Wireless Headphones");
  const [price, setPrice] = useState("49.99");
  const [currency, setCurrency] = useState("USD");
  const [availability, setAvailability] = useState("InStock");

  const [faqJson, setFaqJson] = useState('[\n  { "question": "Is this free?", "answer": "Yes." }\n]');

  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    setOutput("");

    const body =
      type === "Product"
        ? { type, name, description, image, price, currency, availability }
        : type === "FAQPage"
        ? { type, faqJson }
        : { type, title, author, datePublished, image, description };

    const result = await runTool("schema-generator", body);
    setBusy(false);
    if (result.ok) {
      setOutput(result.output);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">Generate a Schema.org JSON-LD snippet to embed in your page's &lt;head&gt;.</p>

      <label className="tool__label" htmlFor="sg-type">
        type
      </label>
      <select id="sg-type" className="tool__input mono" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Article">Article</option>
        <option value="Product">Product</option>
        <option value="FAQPage">FAQ Page</option>
      </select>

      {type === "Article" && (
        <>
          <label className="tool__label">title</label>
          <input className="tool__input mono" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className="tool__label">author</label>
          <input className="tool__input mono" value={author} onChange={(e) => setAuthor(e.target.value)} />
          <label className="tool__label">date published (optional)</label>
          <input className="tool__input mono" placeholder="YYYY-MM-DD" value={datePublished} onChange={(e) => setDatePublished(e.target.value)} />
          <label className="tool__label">image url (optional)</label>
          <input className="tool__input mono" value={image} onChange={(e) => setImage(e.target.value)} />
          <label className="tool__label">description (optional)</label>
          <textarea className="tool__textarea mono" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </>
      )}

      {type === "Product" && (
        <>
          <label className="tool__label">name</label>
          <input className="tool__input mono" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="tool__label">description (optional)</label>
          <textarea className="tool__textarea mono" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          <label className="tool__label">image url (optional)</label>
          <input className="tool__input mono" value={image} onChange={(e) => setImage(e.target.value)} />
          <div className="tool__row">
            <div className="tool__field">
              <label className="tool__label">price</label>
              <input className="tool__input mono" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="tool__field">
              <label className="tool__label">currency</label>
              <input className="tool__input mono" value={currency} onChange={(e) => setCurrency(e.target.value)} />
            </div>
            <div className="tool__field tool__field--grow">
              <label className="tool__label">availability</label>
              <select className="tool__input mono" value={availability} onChange={(e) => setAvailability(e.target.value)}>
                <option value="InStock">In stock</option>
                <option value="OutOfStock">Out of stock</option>
                <option value="PreOrder">Pre-order</option>
              </select>
            </div>
          </div>
        </>
      )}

      {type === "FAQPage" && (
        <>
          <label className="tool__label">questions (JSON array of question/answer)</label>
          <textarea className="tool__textarea mono" rows={6} value={faqJson} onChange={(e) => setFaqJson(e.target.value)} />
        </>
      )}

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Generate
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="sg-out">
        output
      </label>
      <pre id="sg-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
