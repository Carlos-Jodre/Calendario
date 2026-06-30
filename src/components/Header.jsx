const MONTHS_ES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

export default function Header({ currentDate, setCurrentDate, members, onAddEvent, onOpenMembers }) {
  const goMonth = (dir) => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-title">
          <span className="header-icon">📅</span>
          <div>
            <h1>Calendario Familiar</h1>
            <p>Actividades y eventos en familia</p>
          </div>
        </div>

        <nav className="header-nav">
          <div className="nav-arrows">
            <button className="btn-icon" onClick={() => goMonth(-1)}>‹</button>
            <span className="nav-month">
              {MONTHS_ES[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button className="btn-icon" onClick={() => goMonth(1)}>›</button>
          </div>

          <button className="btn-today" onClick={() => setCurrentDate(new Date())}>Hoy</button>

          <button className="btn-icon" onClick={onOpenMembers} title="Gestionar miembros" style={{ fontSize: "1.1rem" }}>
            👥
          </button>

          <button className="btn-add" onClick={onAddEvent}>+ Evento</button>
        </nav>
      </div>

      <div className="calendar-legend">
        {(members || []).filter(m => m.id !== "todos").map(m => (
          <span key={m.id} className="legend-item">
            <span className="legend-dot" style={{ background: m.color }} />
            {m.name}
          </span>
        ))}
        <span className="legend-item legend-edit" onClick={onOpenMembers}>✏️ Editar</span>
      </div>
    </header>
  );
}
