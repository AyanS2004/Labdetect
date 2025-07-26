# Detection Lab

**Automated Breach Simulation & Multi-SIEM Detection Platform**

---

## 🚀 Overview
Detection Lab is a next-generation cybersecurity platform for running automated, MITRE-mapped breach simulations, streaming real-time telemetry to multiple SIEMs, and converting detection rules across SIEM formats. It empowers security teams to validate detection coverage, identify gaps, and improve their security posture with ease.

---

## ✨ Features
- **Automated APT Simulations**: Run realistic attack chains mapped to MITRE ATT&CK (e.g., APT29, Lazarus, APT41)
- **Live Telemetry Streaming**: Generate and stream authentic security events to SIEMs (Splunk, Elastic, Grafana, QRadar)
- **Multi-SIEM Rule Conversion**: Instantly convert detection rules between Splunk SPL, Elastic YAML, QRadar XML, and Sigma formats using PySigma
- **Detection Coverage Analysis**: Visualize detection results, identify gaps, and get actionable recommendations
- **Modern UI/UX**: Intuitive React-based frontend with real-time dashboards and modals
- **Secure Authentication**: JWT-based user authentication and role management
- **Configurable & Extensible**: Modular backend (Flask, MongoDB, Docker) for easy integration and scaling

---

## 🏗️ Architecture
- **Frontend**: React (Next.js), Zustand, Tailwind CSS, Radix UI, Framer Motion
- **Backend**: Flask (Python), MongoDB, PySigma, Docker
- **Authentication**: JWT, Flask-CORS
- **SIEM Integrations**: Splunk, Elastic, Grafana, QRadar, Sigma

```
[User] ⇄ [React Frontend] ⇄ [Flask API] ⇄ [MongoDB]
                                 ⇓
                        [SIEM Integrations]
```

---

## ⚡ Quick Start

### 1. **Clone the Repository**
```bash
git clone https://github.com/your-org/detection-lab.git
cd detection-lab
```

### 2. **Start MongoDB & Backend (Docker Recommended)**
```bash
docker-compose up -d
```

### 3. **Install Backend Dependencies**
```bash
cd Labdetect
pip install -r requirements-auth.txt
```

### 4. **Run the Auth/Backend Server**
```bash
python auth_server_mongo.py
```

### 5. **Install Frontend Dependencies & Start**
```bash
cd web_ui/react_front
npm install
npm run dev
```

### 6. **Access the App**
- Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 🔑 Usage
- **Sign in/Register**: Create an account and log in
- **Run Simulation**: Select an APT group and launch a breach simulation
- **View Attack Chain**: Watch real-time progress mapped to MITRE techniques
- **Stream Telemetry**: See live events sent to your SIEMs
- **Convert Rules**: Instantly convert and export detection rules for any SIEM
- **Analyze Results**: Review detection coverage and identify gaps

---

## 🛠️ Configuration
- **Environment Variables**: Set in `.env` (see `.env.example`)
  - `MONGODB_URI`, `JWT_SECRET`, `PORT`, etc.
- **SIEM Endpoints**: Configure in the app settings modal
- **Custom APT Groups/Techniques**: Extend in backend or via UI

---

## 📚 Documentation
- In-app documentation available via the sidebar "Help" button
- MITRE technique mapping, SIEM integration, and rule conversion guides included

---

## 🧪 Testing
- Use the provided `test_database.py` to populate MongoDB with sample data
- Run simulations and verify telemetry in your SIEM (Splunk, Elastic, etc.)

---

## 👥 Contributing
1. Fork the repo and create your feature branch (`git checkout -b feature/your-feature`)
2. Commit your changes (`git commit -am 'Add new feature'`)
3. Push to the branch (`git push origin feature/your-feature`)
4. Open a Pull Request

---

## 📄 License
[MIT](LICENSE)

---

## 📞 Contact & Support
- **Website**: [detectionlab.com]
- **Email**: contact@detectionlab.com
- **Demo Requests**: demo@detectionlab.com

---

## 🙏 Acknowledgements
- MITRE ATT&CK
- Atomic Red Team, Caldera, PurpleSharp
- PySigma, Detection Studio
- Splunk, Elastic, Grafana, QRadar
- All open-source contributors
