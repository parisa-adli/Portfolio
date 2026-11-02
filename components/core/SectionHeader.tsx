type Props = {
  index: string; // "02"
  file: string; // "~/parisa/projects"
  title: React.ReactNode;
  id: string; // heading id for aria-labelledby
  aside?: React.ReactNode;
};

// IDE file-tab header (§3.2): "02 — ~/parisa/projects" + display title.
export function SectionHeader({ index, file, title, id, aside }: Props) {
  return (
    <header className="section-header">
      <div className="file-tab label">
        <span className="file-tab__idx">{index}</span>
        <span aria-hidden="true">—</span>
        <span className="file-tab__name">{file}</span>
      </div>
      <div className="section-header__row">
        <h2 id={id} className="h2" data-reveal>
          {title}
        </h2>
        {aside}
      </div>
    </header>
  );
}
