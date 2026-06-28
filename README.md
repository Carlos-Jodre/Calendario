# 📅 Calendario Familiar

App web PWA para compartir eventos y actividades en familia, con sincronización en tiempo real via Firebase Firestore.

## Stack
- **React + Vite** — frontend
- **Firebase Firestore** — base de datos en tiempo real
- **Vercel** — despliegue (igual que tareas-casa y lista-compras)
- **PWA** — instalable en móvil

---

## 🚀 Setup paso a paso

### 1. Firebase — Crear proyecto

1. Ve a [firebase.google.com](https://firebase.google.com) → **Add project**
2. Nombre: `calendario-familia` (o el que quieras)
3. Activa **Firestore Database** → modo **Test** por ahora
4. En **Project Settings** → **Your apps** → añade una Web App
5. Copia la configuración `firebaseConfig`

### 2. Configura las credenciales

Abre `src/App.jsx` y reemplaza el bloque `firebaseConfig`:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

### 3. Personaliza los miembros de la familia

En `src/App.jsx`, edita el array `MEMBERS`:

```js
export const MEMBERS = [
  { id: "todos",   name: "Todos",    color: "#c8956c" },
  { id: "carlos",  name: "Carlos",   color: "#5b8fb9" },
  { id: "familia1",name: "Mamá",     color: "#c77daa" },
  { id: "familia2",name: "Hijo/a 1", color: "#6ab187" },
  { id: "familia3",name: "Hijo/a 2", color: "#e8a838" },
];
```

### 4. Instalar y ejecutar

```bash
npm install
npm run dev
```

### 5. Desplegar en Vercel

```bash
# Igual que las otras apps
git init && git add . && git commit -m "init"
# Conecta el repo en vercel.com → Import Project
```

---

## Estructura de Firestore

Colección: `eventos`

```json
{
  "titulo": "Visita al médico",
  "fecha": "2026-07-15",
  "hora": "10:30",
  "categoria": "medico",
  "miembro": "carlos",
  "lugar": "Hospital La Fe",
  "descripcion": "Revisión anual",
  "createdAt": "2026-06-28T...",
  "updatedAt": "2026-06-28T..."
}
```

## Categorías disponibles

| ID | Nombre | Emoji |
|---|---|---|
| reunion | Reunión | 👥 |
| medico | Médico | 🏥 |
| colegio | Colegio | 🎒 |
| deporte | Deporte | ⚽ |
| ocio | Ocio | 🎉 |
| viaje | Viaje | ✈️ |
| trabajo | Trabajo | 💼 |
| otro | Otro | 📌 |
