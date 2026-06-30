import { CATEGORIES } from "../App";

const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS_FULL = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];

function formatDateLabel(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
  const todayStr = today.toISOString().split("T")[0];
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  if (dateStr === todayStr) return "Hoy";
  if (dateStr === tomorrowStr) return "Mañana";
  const dayName = DAYS_FULL[date.getDay()];
  return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${d} de ${MONTHS_ES[m - 1]}`;
}

function formatTime(hora, horaFin) {
  if (!hora) return null;
  if (horaFin) return `${hora} – ${horaFin}`;
  return hora;
}

function groupByDate(events) {
  const groups = {};
  events.forEach(ev => {
    if (!groups[ev.fecha]) groups[ev.fecha] = [];
    groups[ev.fecha].push(ev);
  });
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

export default function EventList({ currentDate, events, members, onEdit, onDelete }) {
  const today = new Date().toISOString().split("T")[0];
  // Show events for current month and beyond, plus today if past month shown
  const upcoming = events.filter(e => e.fecha >= today);
  const past = events.filter(e => e.fecha < today);

  const getMember = (id) => (members || []).find(m => m.id === id) || { name: "Todos", color: "#c8956c" };
  const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[7];

  const renderEvent = (ev) => {
    const member = getMember(ev.miembro);
    const cat = getCat(ev.categoria);
    const timeStr = formatTime(ev.hora, ev.horaFin);

    return (
      <div
        key={ev.id}
        className="event-card"
        style={{ borderLeftColor: member.color }}
        onClick={() => onEdit(ev)}
      >
        <div className="event-card-left">
          {timeStr ? (
            <div className="event-card-time-block">
              <span className="event-time-start">{ev.hora}</span>
              {ev.horaFin && <span className="event-time-end">{ev.horaFin}</span>}
            </div>
          ) : (
            <div className="event-card-time-block">
              <span className="event-time-allday">Todo el día</span>
            </div>
          )}
        </div>

        <div className="event-card-divider" style={{ background: member.color }} />

        <div className="event-card-body">
          <div className="event-card-title">{cat.icon} {ev.titulo}</div>
          <div className="event-card-meta">
            {ev.lugar && <span className="event-meta-item">📍 {ev.lugar}</span>}
            <span className="event-meta-item" style={{ color: member.color, fontWeight: 700 }}>{member.name}</span>
            <span className="event-meta-item">{cat.label}</span>
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

  return (
    <div className="event-list-section">
      <div className="event-list-header">
        <span>Próximos eventos</span>
      </div>

      {upcoming.length === 0 ? (
        <div className="event-list-empty">
          <div className="empty-icon">🗓</div>
          <p>No hay eventos próximos</p>
          <p className="empty-sub">Pulsa "+ Evento" o toca un día para añadir uno</p>
        </div>
      ) : (
        <div className="event-list-wrap">
          {groupByDate(upcoming).map(([date, evs]) => (
            <div key={date} className="event-date-group">
              <div className="event-date-label">
                <span className="event-date-text">{formatDateLabel(date)}</span>
                <span className="event-date-count">{evs.length} evento{evs.length > 1 ? "s" : ""}</span>
              </div>
              {evs.map(renderEvent)}
            </div>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <>
          <div className="event-list-header event-list-header-past">Eventos pasados</div>
          <div className="event-list-wrap">
            {groupByDate([...past].reverse()).map(([date, evs]) => (
              <div key={date} className="event-date-group past-group">
                <div className="event-date-label">
                  <span className="event-date-text">{formatDateLabel(date)}</span>
                </div>
                {evs.map(ev => (
                  <div key={ev.id} style={{ opacity: 0.55 }}>{renderEvent(ev)}</div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
