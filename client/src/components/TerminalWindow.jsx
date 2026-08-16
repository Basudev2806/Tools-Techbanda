export default function TerminalWindow({ title, children }) {
  return (
    <section className="term">
      <header className="term__bar">
        <span className="term__dots" aria-hidden="true">
          <span className="term__dot term__dot--r" />
          <span className="term__dot term__dot--y" />
          <span className="term__dot term__dot--g" />
        </span>
        <span className="term__title mono">{title}</span>
      </header>
      <div className="term__body">{children}</div>
    </section>
  );
}
