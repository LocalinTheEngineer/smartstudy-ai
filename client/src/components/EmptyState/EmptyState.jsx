import { Link } from "react-router-dom";

// Bos durumlar (henuz hic ders/materyal/quiz yok) icin ortak bilesen -
// duz "muted-text" satiri yerine ikon + baslik + aciklama + (istege bagli)
// harekete gecirici bir buton gosterir.
function EmptyState({ icon = "📭", title, description, actionLabel, actionTo }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        {icon}
      </div>
      {title && <h3 className="empty-state-title">{title}</h3>}
      {description && <p className="empty-state-desc">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="empty-state-action">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
