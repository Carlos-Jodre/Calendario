import { useState, useEffect } from "react";
import { CATEGORIES } from "../App";

export default function EventModal({ date, event, members, onSave, onClose, onDelete }) {
  const [form, setForm] = useState({
    titulo: "",
    fecha: date || new Date().toISOString().split("T")[0],
    hora: "",
    categoria: "otro",
    miembro: "todos",
    descripcion: "",
    lugar: "",
  });

  useEffect(() => {
    if (event) {
      setForm({
        titulo: event.titulo || "",
        fecha: event.fecha || date,
        hora: event.hora || "",
        categoria: event.categoria || "otro",
        miembro: event.miembro || "todos",
        descripcion: event.descripcion || "",
        lugar: event.lugar || "",
      });
    } else {
      setForm(f => ({ ...f, fecha: date || f.fecha }));
    }
  }, [event, date]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.titulo.trim()) return alert("El título es obligatorio");
    if (!form.fecha) return alert("La fecha es obligatoria");
    onSave({
      ...form,
      titulo: form.titulo.trim(),
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
          <div className="form-group">
            <label className="form-label">Título *</label>
            <input
              className="form-input"
              placeholder="Ej: Visita al médico, Cumpleaños..."
              value={form.titulo}
              onChange={e => set("titulo", e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fecha *</label>
              <input type="date" className="form-input" value={form.fecha} onChange={e => set("fecha", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Hora (opcional)</label>
              <input type="time" className="form-input" value={form.hora} onChange={e => set("hora", e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Lugar (opcional)</label>
            <input className="form-input" placeholder="Ej: Hospital, Colegio, Casa..." value={form.lugar} onChange={e => set("lugar", e.target.value)} />
          </div>

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

          <div className="form-group">
            <label className="form-label">¿Para quién?</label>
            <div className="member-grid">
              {(members || []).map(m => (
                <button
                  key={m.id}
                  className={`member-chip ${form.miembro === m.id ? "selected" : ""}`}
                  style={form.miembro === m.id ? { background: m.color, borderColor: m.color, color: "#fff" } : {}}
                  onClick={() => set("miembro", m.id)}
                  type="button"
                >
                  <span className="member-dot" style={{ background: m.color }} />
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notas (opcional)</label>
            <textarea className="form-textarea" placeholder="Información adicional..." value={form.descripcion} onChange={e => set("descripcion", e.target.value)} />
          </div>
        </div>

        <div className="modal-footer">
          {onDelete && (
            <button className="btn-delete" onClick={onDelete} type="button">🗑 Eliminar</button>
          )}
          <button className="btn-save" onClick={handleSave} type="button">
            {event ? "💾 Guardar cambios" : "✅ Añadir evento"}
          </button>
        </div>
      </div>
    </div>
  );
}
