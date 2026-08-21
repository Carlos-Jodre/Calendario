import { CATEGORIES } from "../App";

const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS_ES = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];

function formatTime(hora, horaFin) {
  if (!hora) return "Todo el día";
  if (horaFin) return `${hora} – ${horaFin}`;
  return hora;
}

export default function DayPanel({ date, events, members, onClose, onAdd, onEdit, onDelete }) {
  if (!date) return null;

  const [y, m, d] = date.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  const today = new Date().toISOString().split("T")[0];
  const isToday = date === today;

  const dayName = DAYS_ES[dateObj.getDay()];
  const dayLabel = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${d} de ${MONTHS_ES[m - 1]}`;

  const getMember = (id) => (members || []).find(m => m.id === id) || { name: "Todos", color: "#c8956c" };
  const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[7];

  // Sort by time
  const sorted = [...events].sort((a, b) => {
    if (!a.hora && !b.hora) return 0;
    if (!a.hora) return -1;
    if (!b.hora) return 1;
    return a.hora.localeCompare(b.hora);
  });

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal day-panel">
        <div className="modal-header">
          <div className="day-panel-title">
            <span className={`day-panel-number ${isToday ? "today" : ""}`}>{d}</span>
            <div>
              <div className="day-panel-name">{dayLabel}</div>
              {isToday && <div className="day-panel-today-tag">Hoy</div>}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body day-panel-body">
          {sorted.length === 0 ? (
            <div className="day-panel-empty">
              <div className="empty-icon">🗓</div>
              <p>No hay eventos este día</p>
            </div>
          ) : (
            <div className="day-panel-events">
              {sorted.map(ev => {
                const member = getMember(ev.miembro);
                const cat = getCat(ev.categoria);
                return (
                  <div
                    key={ev.id}
                    className="day-panel-event"
                    style={{ borderLeftColor: member.color }}
                    onClick={() => onEdit(ev)}
                  >
                    <div className="day-panel-event-time" style={{ color: member.color }}>
                      {formatTime(ev.hora, ev.horaFin)}
                    </div>
                    <div className="day-panel-event-info">
                      <div className="day-panel-event-title">{cat.icon} {ev.titulo}</div>
                      <div className="day-panel-event-meta">
                        {ev.lugar && <span>📍 {ev.lugar}</span>}
                        <span style={{ color: member.color, fontWeight: 700 }}>{member.name}</span>
                      </div>
                      {ev.descripcion && (
                        <div className="day-panel-event-desc">{ev.descripcion}</div>
                      )}
                    </div>
                    <div className="day-panel-event-actions">
                      <button
                        className="btn-action edit"
                        onClick={e => { e.stopPropagation(); onEdit(ev); }}
                        title="Editar"
                      >✏️</button>
                      <button
                        className="btn-action delete"
                        onClick={e => { e.stopPropagation(); onDelete(ev.id); }}
                        title="Eliminar"
                      >🗑</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-save" onClick={() => onAdd(date)}>
            + Añadir evento este día
          </button>
        </div>
      </div>
    </div>
  );
}
