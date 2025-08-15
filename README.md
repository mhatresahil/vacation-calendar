# Vacation Calendar

A full-stack vacation planning and holiday tracking application that allows users to view public holidays across different countries in **monthly** and **quarterly** views with an elegant, responsive UI.

---

## ✨ Features

- **Multiple Country Support** – View official public holidays for any supported country.
- **Monthly & Quarterly Views** – Switch seamlessly between two calendar perspectives.
- **Color-Coded Holidays** – Light green for 1 holiday in a week, dark green for 2+ holidays.
- **Fast & Reliable API** – Backend powered by FastAPI for quick and efficient holiday data retrieval.
- **Modern, Classy UI** – Built with Next.js and Tailwind CSS for a clean, responsive design.

---

## 🛠 Tech Stack

**Frontend**
- Next.js 15
- React 19
- Tailwind CSS
- TypeScript

**Backend**
- FastAPI (Python)
- Uvicorn (ASGI server)
- Custom API integration with Nager.Date public holiday API

---

## 📦 Project Structure

```
Wissen/
├── api/              # FastAPI backend
│   ├── app/
│   │   ├── routers/  # API endpoints
│   │   ├── services/ # Business logic
│   │   ├── main.py   # Entry point for backend
├── web/              # Next.js + Tailwind frontend
│   ├── src/components/  # Reusable UI components
│   ├── src/app/         # Pages and layouts
│   ├── public/          # Static assets
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/mhatresahil/vacation-calendar.git
cd vacation-calendar
```

### 2️⃣ Start the Backend
```bash
cd api
pip install -r requirements.txt
uvicorn app.main:app --reload
```
By default, the backend runs at:  
`http://localhost:8000`

### 3️⃣ Start the Frontend
```bash
cd web
pnpm install   # or npm install
pnpm dev       # or npm run dev
```
The frontend runs at:  
`http://localhost:3000`

---

## 📖 Usage
1. Select a country from the dropdown.
2. Choose a year.
3. Toggle between **Monthly** or **Quarterly** views.
4. Hover over holiday dates to see their descriptions.

---

## 📌 Notes
- Requires internet connection to fetch live holiday data.
- Styling is optimized for both light and dark modes.
- This project is interview-ready and can be extended for personal or corporate use.

---

## 📄 License
MIT License
