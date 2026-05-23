import type { PropsWithChildren } from "react";

type SectionBlockProps = PropsWithChildren<{
  id?: string;
  kicker: string;
  title: string;
  description?: string;
}>;

export function SectionBlock({
  id,
  kicker,
  title,
  description,
  children,
}: Readonly<SectionBlockProps>) {
  return (
    <section id={id} className="section-block">
      <header className="section-header">
        <p className="section-kicker">{kicker}</p>
        <h2>{title}</h2>
        {description ? (
          <p className="section-description">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
