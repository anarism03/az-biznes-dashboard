export function PageIntro({ eyebrow, title, description, actions }) {
  return (
    <section className="page-intro">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {actions && <div className="intro-actions">{actions}</div>}
    </section>
  )
}
