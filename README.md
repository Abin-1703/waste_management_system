Waste Management System

A full-stack Waste Management System developed using Django, Django REST Framework, React (Vite), and MySQL.  
This platform helps manage waste collection, track requests, and monitor waste management activities efficiently.

---

Features
- User Registration & Login
- Waste Pickup Request System
- Admin Dashboard
- Waste Collection Tracking
- Interactive Charts & Data Visualization
- Location-based waste tracking using maps
- Notifications and alerts
- Responsive UI

---

Tech Stack

Backend
- Python
- Django
- Django REST Framework
- MySQL

Frontend
- React (Vite)
- Tailwind CSS
- Axios
- Chart.js
- React Router
- Leaflet Maps

---

Project Structure

WasteManagementSystem
│
├── backend
│   ├── manage.py
│   ├── requirements.txt
│   └── apps
│
├── frontend
│   ├── package.json
│   └── src
│
└── README.md

---

Backend Setup

cd backend  
python -m venv venv  
venv\Scripts\activate  
pip install -r requirements.txt  
python manage.py migrate  
python manage.py runserver  

Backend runs on:

http://127.0.0.1:8000

---

Frontend Setup

cd frontend  
npm install  
npm run dev  

Frontend runs on:

http://localhost:5173

---

Database

MySQL database. Configure credentials in `settings.py`.

---

Author

Developed by Abin Kuruvila