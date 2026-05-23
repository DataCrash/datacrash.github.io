type HighlightCardsProps = {
  items: string[];
};

export function HighlightCards({ items }: Readonly<HighlightCardsProps>) {
  return (
    <div className="highlight-grid">
      {items.map((item) => (
        <article key={item} className="highlight-card">
          <p>{item}</p>
        </article>
      ))}
    </div>
  );
}
