import { useState } from "react";
import { MEMBER_COLORS, DEFAULT_MEMBERS } from "../App";

function generateId() {
  return "m_" + Math.random().toString(36).slice(2, 8);
}

export default function MembersModal({ members, onSave, onClose }) {
  const [list, setList] = useState(
    members.filter(m => m.id !== "todos").map(m => ({ ...m }))
  );
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(MEMBER_COLORS[0]);
  const [editingId, setEditingId] = useState(null);

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    setList(l => [...l, { id: generateId(), name, color: newColor }]);
    setNewName("");
    setNewColor(MEMBER_COLORS[(list.length) % MEMBER_COLORS.length]);
  };

  const handleDelete = (id) => {
    if (list.length <= 1) return alert("Debe haber al menos un miembro");
    setList(l => l.filter(m => m.id !== id));
  };

  const handleRename = (id, name) => {
    setList(l => l.map(m => m.id === id ? { ...m, name } : m));
  };

  const handleColor = (id, color) => {
    setList(l => l.map(m => m.id === id ? { ...m, color } : m));
  };

  const handleSave = () => {
    if (list.some(m => !m.name.trim())) return alert("Todos los miembros deben tener nombre");
    const todos = { id: "todos", name: "Todos", color: "#c8956c" };
    onSave([todos, ...list]);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>👥 Miembros de la familia</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Current members */}
          <div className="form-group">
            <label className="form-label">Miembros actuales</label>
            <div className="members-list">
              {list.map(m => (
                <div key={m.id} className="member-row">
                  {/* Color picker */}
                  <div className="member-color-pick">
                    <div
                      className="member-color-preview"
                      style={{ background: m.color }}
                      onClick={() => setEditingId(editingId === m.id ? null : m.id)}
                      title="Cambiar color"
                    />
                    {editingId === m.id && (
                      <div className="color-popover">
                        {MEMBER_COLORS.map(c => (
                          <button
                            key={c}
                            className={`color-swatch ${m.color === c ? "selected" : ""}`}
                            style={{ background: c }}
                            onClick={() => { handleColor(m.id, c); setEditingId(null); }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Name input */}
                  <input
                    className="form-input member-name-input"
                    value={m.name}
                    onChange={e => handleRename(m.id, e.target.value)}
                    placeholder="Nombre"
                  />

                  {/* Delete */}
                  <button
                    className="btn-action delete"
                    onClick={() => handleDelete(m.id)}
                    title="Eliminar miembro"
                  >🗑</button>
                </div>
              ))}
            </div>
          </div>

          {/* Add new member */}
          <div className="form-group">
            <label className="form-label">Añadir nuevo miembro</label>
            <div className="member-add-row">
              <div className="member-color-pick">
                <div
                  className="member-color-preview"
                  style={{ background: newColor }}
                  onClick={() => setEditingId(editingId === "new" ? null : "new")}
                  title="Elegir color"
                />
                {editingId === "new" && (
                  <div className="color-popover">
                    {MEMBER_COLORS.map(c => (
                      <button
                        key={c}
                        className={`color-swatch ${newColor === c ? "selected" : ""}`}
                        style={{ background: c }}
                        onClick={() => { setNewColor(c); setEditingId(null); }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <input
                className="form-input member-name-input"
                placeholder="Nombre del miembro..."
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
              />
              <button
                className="btn-action edit"
                onClick={handleAdd}
                disabled={!newName.trim()}
                title="Añadir"
                style={{ fontSize: "1rem" }}
              >＋</button>
            </div>
          </div>

          <p className="form-hint">
            💡 El color identifica a cada miembro en el calendario. Pulsa el círculo de color para cambiarlo.
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn-save" onClick={handleSave}>
            💾 Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
