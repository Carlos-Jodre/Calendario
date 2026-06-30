import { useState, useEffect } from "react";
import { CATEGORIES } from "../App";

const RECURRENCE_OPTIONS = [
  { id: "none",    label: "No se repite" },
  { id: "daily",   label: "Cada día" },
  { id: "weekly",  label: "Cada semana" },
  { id: "monthly", label: "Cada mes" },
  { id: "yearly",  label: "Cada año" },
];

export default function EventModal({ date, event, members, onSave, onClose, onDelete }) {
  const [form, setForm] = useState({
    titulo: "", fecha: date || new Date().toISOString().split("T")[0],
    fechaFin: "", hora: "", horaFin: "",
    categoria: "otro", miembro: "todos",
    descripcion: "", lugar: "",
    recurrencia: "none",
  });

  useEffect(() => {
    if (event) {
      setForm({
        titulo: event.titulo || "", fecha: event.fecha || date,
        fechaFin: event.fechaFin || "",
        hora: event.hora || "", horaFin: event.horaFin || "",
        categoria: event.categoria || "otro", miembro: event.miembro || "todos",
        descripcion: event.descripcion || "", lugar: event.lugar || "",
        recurrencia: event.recurrencia || "none",
      });
    } else {
      setForm(f => ({ ...f, fecha: date || f.fecha }));
    }
  }, [event, date]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.titulo.trim()) return alert("El título es obligatorio");
    if (!form.fecha) return alert("La fecha es obligatoria");
    if (form.hora && form.horaFin && form.horaFin <= form.hora)
      return alert("La hora de fin debe ser posterior a la hora de inicio");
    if (form.fechaFin && form.fechaFin < form.fecha)
      return alert("La fecha de fin debe ser igual o posterior a la fecha de inicio");

    onSave({
      ...form, titulo: form.titulo.trim(),
      createdAt: event?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{event ? "Editar evento" : "Nuevo evento"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Título */}
          <div className="form-group">
            <label className="form-label">Título *</label>
            <input className="form-input" placeholder="Ej: Visita al médico, Cumpleaños..." value={form.titulo} onChange={e => set("titulo", e.target.value)} autoFocus />
          </div>

          {/* Fecha inicio */}
          <div className="form-group">
            <label className="form-label">Fecha *</label>
            <input type="date" className="form-input" value={form.fecha} onChange={e => set("fecha", e.target.value)} />
          </div>

          {/* Fecha fin (opcional) */}
          <div className="form-group">
            <label className="form-label">Fecha de fin (opcional)</label>
            <input
              type="date" className="form-input" value={form.fechaFin}
              min={form.fecha}
              onChange={e => set("fechaFin", e.target.value)}
              placeholder="Para eventos de varios días"
            />
            <p className="field-hint">Solo para eventos que duran más de un día (ej: viaje, vacaciones)</p>
          </div>

          {/* Hora inicio */}
          <div className="form-group">
            <label className="form-label">Hora inicio (opcional)</label>
            <input type="time" className="form-input" value={form.hora} onChange={e => set("hora", e.target.value)} />
          </div>

          {/* Hora fin */}
          <div className="form-group">
            <label className="form-label">Hora fin (opcional)</label>
            <input
              type="time" className="form-input" value={form.horaFin}
              onChange={e => set("horaFin", e.target.value)}
              disabled={!form.hora}
              style={{ opacity: form.hora ? 1 : 0.45 }}
            />
            {!form.hora && (
              <p className="field-hint">Introduce primero la hora de inicio</p>
            )}
          </div>

          {/* Lugar */}
          <div className="form-group">
            <label className="form-label">Lugar (opcional)</label>
            <input className="form-input" placeholder="Ej: Hospital, Colegio, Casa..." value={form.lugar} onChange={e => set("lugar", e.target.value)} />
          </div>

          {/* Repetición */}
          <div className="form-group">
            <label className="form-label">Repetir evento</label>
            <select className="form-select" value={form.recurrencia} onChange={e => set("recurrencia", e.target.value)}>
              {RECURRENCE_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Categoría */}
          <div className="form-group">
            <label className="form-label">Categoría</label>
            <div className="cat-grid">
              {CATEGORIES.map(cat => (
                <button key={cat.id} className={`cat-chip ${form.categoria === cat.id ? "selected" : ""}`} onClick={() => set("categoria", cat.id)} type="button">
                  <span className="cat-icon">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Miembro */}
          <div className="form-group">
            <label className="form-label">¿Para quién?</label>
            <div className="member-grid">
              {(members || []).map(m => (
                <button
                  key={m.id} type="button"
                  className={`member-chip ${form.miembro === m.id ? "selected" : ""}`}
                  style={form.miembro === m.id ? { background: m.color, borderColor: m.color, color: "#fff" } : {}}
                  onClick={() => set("miembro", m.id)}
                >
                  <span className="member-dot" style={{ background: m.color }} />
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div className="form-group">
            <label className="form-label">Notas (opcional)</label>
            <textarea className="form-textarea" placeholder="Información adicional..." value={form.descripcion} onChange={e => set("descripcion", e.target.value)} />
          </div>
        </div>

        <div className="modal-footer">
          {onDelete && <button className="btn-delete" onClick={onDelete} type="button">🗑 Eliminar</button>}
          <button className="btn-save" onClick={handleSave} type="button">
            {event ? "💾 Guardar cambios" : "✅ Añadir evento"}
          </button>
        </div>
      </div>
    </div>
  );
}
