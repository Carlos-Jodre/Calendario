import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  setDoc,
  getDoc,
} from "firebase/firestore";
import CalendarView from "./components/CalendarView";
import EventModal from "./components/EventModal";
import EventList from "./components/EventList";
import Header from "./components/Header";
import MembersModal from "./components/MembersModal";
import "./App.css";

const firebaseConfig = {
  apiKey: "AIzaSyDfq4oVaFxhGaqipx52itBxUARcajJhHfA",
  authDomain: "tareas-casa-11c7b.firebaseapp.com",
  projectId: "tareas-casa-11c7b",
  storageBucket: "tareas-casa-11c7b.firebasestorage.app",
  messagingSenderId: "956111451974",
  appId: "1:956111451974:web:aab85979e536d5770e1747",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const DEFAULT_MEMBERS = [
  { id: "todos",  name: "Todos",  color: "#c8956c" },
  { id: "m1",    name: "Carlos", color: "#5b8fb9" },
  { id: "m2",    name: "Pareja", color: "#c77daa" },
];

export const MEMBER_COLORS = [
  "#5b8fb9", "#c77daa", "#6ab187", "#e8a838",
  "#c8956c", "#7b68ee", "#e07b7b", "#4db6ac",
  "#ff8a65", "#a1887f", "#78909c", "#66bb6a",
];

export const CATEGORIES = [
  { id: "reunion", label: "Reunión",  icon: "👥" },
  { id: "medico",  label: "Médico",   icon: "🏥" },
  { id: "colegio", label: "Colegio",  icon: "🎒" },
  { id: "deporte", label: "Deporte",  icon: "⚽" },
  { id: "ocio",    label: "Ocio",     icon: "🎉" },
  { id: "viaje",   label: "Viaje",    icon: "✈️" },
  { id: "trabajo", label: "Trabajo",  icon: "💼" },
  { id: "otro",    label: "Otro",     icon: "📌" },
];

export default function App() {
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [view, setView] = useState("month");
  const [loading, setLoading] = useState(true);

  // Load members from Firestore (single doc in "config" collection)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "config", "miembros"), (snap) => {
      if (snap.exists()) {
        setMembers(snap.data().lista || DEFAULT_MEMBERS);
      } else {
        // First time: seed defaults
        setDoc(doc(db, "config", "miembros"), { lista: DEFAULT_MEMBERS });
      }
    });
    return unsub;
  }, []);

  // Load events
  useEffect(() => {
    const q = query(collection(db, "eventos"), orderBy("fecha", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleAddEvent = (date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setSelectedDate(event.fecha);
    setShowModal(true);
  };

  const handleSaveEvent = async (eventData) => {
    if (editingEvent) {
      await updateDoc(doc(db, "eventos", editingEvent.id), eventData);
    } else {
      await addDoc(collection(db, "eventos"), eventData);
    }
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (eventId) => {
    if (confirm("¿Eliminar este evento?")) {
      await deleteDoc(doc(db, "eventos", eventId));
    }
  };

  const handleSaveMembers = async (newMembers) => {
    await setDoc(doc(db, "config", "miembros"), { lista: newMembers });
    setShowMembers(false);
  };

  return (
    <div className="app">
      <Header
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
        members={members}
        onAddEvent={() => handleAddEvent(new Date().toISOString().split("T")[0])}
        onOpenMembers={() => setShowMembers(true)}
      />

      {loading ? (
        <div className="loading">
          <div className="loading-spinner" />
          <p>Cargando calendario...</p>
        </div>
      ) : (
        <main className="main-content">
          {view === "month" ? (
            <CalendarView
              currentDate={currentDate}
              events={events}
              members={members}
              onDayClick={handleAddEvent}
              onEventClick={handleEditEvent}
            />
          ) : (
            <EventList
              events={events}
              members={members}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          )}
        </main>
      )}

      {showModal && (
        <EventModal
          date={selectedDate}
          event={editingEvent}
          members={members}
          onSave={handleSaveEvent}
          onClose={() => { setShowModal(false); setEditingEvent(null); }}
          onDelete={editingEvent ? () => handleDeleteEvent(editingEvent.id).then(() => setShowModal(false)) : null}
        />
      )}

      {showMembers && (
        <MembersModal
          members={members}
          onSave={handleSaveMembers}
          onClose={() => setShowMembers(false)}
        />
      )}
    </div>
  );
}
