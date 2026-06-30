import { CATEGORIES } from "../App";

const DAYS_ES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function getMonthDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = startDow - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, month: month - 1, year, otherMonth: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, month, year, otherMonth: false });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, month: month + 1, year, otherMonth: true });
  return cells;
}

function toDateStr(cell) {
  const m = String(cell.month + 1).padStart(2, "0");
  const d = String(cell.day).padStart(2, "0");
  return `${cell.year}-${m}-${d}`;
}

function isToday(cell) {
  const t = new Date();
  return !cell.otherMonth && cell.day === t.getDate() && cell.month === t.getMonth() && cell.year === t.getFullYear();
}

export default function CalendarView({ currentDate, events, members, onDayClick, onEventClick }) {
  const cells = getMonthDays(currentDate);

  const getMemberColor = (memberId) => {
    const m = (members || []).find(m => m.id === memberId);
    return m ? m.color : "#c8956c";
  };

  const eventsByDate = {};
  events.forEach(ev => {
    if (!eventsByDate[ev.fecha]) eventsByDate[ev.fecha] = [];
    eventsByDate[ev.fecha].push(ev);
  });

  return (
    <div className="calendar-wrap">
      <div className="calendar-weekdays">
        {DAYS_ES.map(d => <div key={d} className="weekday-label">{d}</div>)}
      </div>
      <div className="calendar-grid">
        {cells.map((cell, i) => {
          const dateStr = toDateStr(cell);
          const dayEvents = eventsByDate[dateStr] || [];
          const today = isToday(cell);

          return (
            <div
              key={i}
              className={[
                "calendar-day",
                cell.otherMonth ? "other-month" : "",
                today ? "today" : "",
              ].join(" ")}
              onClick={() => !cell.otherMonth && onDayClick(dateStr)}
            >
              <div className="day-number-wrap">
                <span className={`day-number ${today ? "today-circle" : ""}`}>
                  {cell.day}
                </span>
              </div>

              {/* iPhone-style dots */}
              {dayEvents.length > 0 && !cell.otherMonth && (
                <div className="day-dots">
                  {dayEvents.slice(0, 3).map((ev, idx) => (
                    <span
                      key={idx}
                      className="day-dot"
                      style={{ background: getMemberColor(ev.miembro) }}
                      onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="day-dot day-dot-more" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
