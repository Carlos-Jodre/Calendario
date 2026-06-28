import { CATEGORIES } from "../App";

const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${d} de ${MONTHS_ES[m - 1]} de ${y}`;
}

function groupByMonth(events) {
  const groups = {};
  events.forEach(ev => {
    const [y, m] = ev.fecha.split("-").map(Number);
    const key = `${y}-${String(m).padStart(2, "0")}`;
    const label = `${MONTHS_ES[m - 1]} ${y}`;
    if (!groups[key]) groups[key] = { label, events: [] };
    groups[key].events.push(ev);
  });
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

export default function EventList({ events, members, onEdit, onDelete }) {
  const today = new Date().toISOString().split("T")[0];
  const upcoming = events.filter(e => e.fecha >= today);
  const past = events.filter(e => e.fecha < today);

  const getMember = (id) => (members || []).find(m => m.id === id) || { name: "Todos", color: "#c8956c" };
  const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[7];

  const renderEvent = (ev) => {
    const member = getMember(ev.miembro);
    const cat = getCat(ev.categoria);
    return (
      <div key={ev.id} className="event-card" style={{ borderLeftColor: member.color }} onClick={() => onEdit(ev)}>
        <div className="event-card-color" style={{ background: member.color }} />
        <div className="event-card-body">
          <div className="event-card-title">{cat.icon} {ev.titulo}</div>
          <div className="event-card-meta">
            <span className="event-card-time">📅 {formatDate(ev.fecha)}</span>
            {ev.hora && <span className="event-card-time">🕐 {ev.hora}</span>}
            {ev.lugar && <span className="event-card-time">📍 {ev.lugar}</span>}
            <span className="event-card-cat">{cat.label}</span>
            <span className="event-card-member" style={{ color: member.color }}>{member.name}</span>
          </div>
          {ev.descripcion && <div className="event-card-desc">{ev.descripcion}</div>}
        </div>
        <div className="event-card-actions">
          <button className="btn-action edit" onClick={e => { e.stopPropagation(); onEdit(ev); }} title="Editar">✏️</button>
          <button className="btn-action delete" onClick={e => { e.stopPropagation(); onDelete(ev.id); }} title="Eliminar">🗑</button>
        </div>
      </div>
    );
  };

  if (events.length === 0) return (
    <div className="event-list-wrap">
      <div className="event-list-empty">
        <div className="empty-icon">📅</div>
        <h3>No hay eventos todavía</h3>
        <p>Pulsa "+ Evento" para añadir el primero</p>
      </div>
    </div>
  );

  return (
    <div className="event-list-wrap">
      {upcoming.length > 0 && (
        <>
          <div className="event-group-header">📌 Próximos eventos</div>
          {groupByMonth(upcoming).map(([key, group]) => (
            <div key={key}>
              <div className="event-group-header" style={{ fontSize: "0.7rem", marginTop: 6 }}>{group.label}</div>
              {group.events.map(renderEvent)}
            </div>
          ))}
        </>
      )}
      {past.length > 0 && (
        <>
          <div className="event-group-header" style={{ marginTop: 24, color: "#bbb" }}>⏪ Pasados</div>
          {groupByMonth([...past].reverse()).map(([key, group]) => (
            <div key={key}>
              <div className="event-group-header" style={{ fontSize: "0.7rem", marginTop: 6, opacity: 0.6 }}>{group.label}</div>
              {group.events.map(ev => <div key={ev.id} style={{ opacity: 0.6 }}>{renderEvent(ev)}</div>)}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
