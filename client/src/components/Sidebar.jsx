const CATEGORY_LABELS = {
  format: "format",
  encode: "encode / decode",
  text: "text",
  generate: "generate",
  seo: "seo",
  legal: "legal",
  network: "network",
  client: "runs in browser",
};

const CATEGORY_ORDER = ["format", "encode", "text", "generate", "seo", "legal", "network", "client"];

function groupByCategory(tools) {
  const groups = new Map();
  for (const tool of tools) {
    const cat = tool.category || "other";
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat).push(tool);
  }
  return CATEGORY_ORDER.filter((c) => groups.has(c)).map((c) => [c, groups.get(c)]);
}

export default function Sidebar({ tools, activeId, onSelect, status }) {
  const groups = groupByCategory(tools);

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__dot" aria-hidden="true" />
        techbanda<span className="sidebar__brand-accent">/tools</span>
      </div>

      <nav className="sidebar__list">
        {groups.map(([category, items]) => (
          <div key={category}>
            <div className="sidebar__section-label">{CATEGORY_LABELS[category] || category}</div>
            {items.map((tool) => (
              <button
                key={tool.id}
                className={"sidebar__item" + (tool.id === activeId ? " sidebar__item--active" : "")}
                onClick={() => onSelect(tool.id)}
              >
                <span className="sidebar__prompt mono">$</span>
                <span className="sidebar__item-text">
                  <span className="sidebar__item-name">{tool.name}</span>
                  <span className="sidebar__item-desc">{tool.description}</span>
                </span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar__status mono">
        <span className={"sidebar__status-dot sidebar__status-dot--" + status} />
        {status === "online" ? "api connected" : status === "offline" ? "api offline" : "connecting…"}
      </div>
    </aside>
  );
}
