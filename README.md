# CODEX Frontend: Digital Solutions & IT Training UI

CODEX Frontend is a modern web application built with **React 18** and **Vite**. It features a glassmorphic UI, 3D interactive backgrounds, and a management system for expert-led IT courses.

---

## 🚀 Key Features

### 🧠 CODEX Intelligence Layer

* **Dynamic 3D Environment:** Interactive Three.js background with real-time mouse tracking and bloom effects.
* **GSAP Motion Engine:** High-performance scroll-triggered animations and staggered entrance effects.
* **Glassmorphic Design:** A premium visual style using backdrop blur, neon accents, and HUD overlays.

### 📡 Educational Ecosystem

* **Course Management:** Curriculum pages for HTML, CSS, JavaScript, and Bootstrap.
* **Internship Tracking:** Structured paths for UI/UX, Linux, and Frontend development.
* **Mentorship Hub:** Integrated access to startup incubation and technical consulting.

---

## 🏗️ Technical Stack

| Category | Tools Used |
| --- | --- |
| **Framework** | React 18, Vite |
| **Graphics** | Three.js, GLSL Shaders |
| **Animations** | GSAP (GreenSock), ScrollTrigger |
| **Styling** | Vanilla CSS Grid/Flex, Bootstrap 5 |
| **Icons** | Lucide React, Font Awesome |

---

## 📂 Project Structure

```text
frontend/
├── client/
│   ├── components/
│   │   ├── Navbar.jsx    # Glassmorphic navigation
│   │   └── Footer.jsx    # Corporate footer
│   ├── pages/
│   │   ├── HomePage.jsx  # 3D Landing page
│   │   ├── Courses.jsx   # Training programs
│   │   └── Projects.jsx  # Software portfolio
│   ├── App.jsx           # Main application logic
│   └── global.css        # Global styles & glassmorphic variables
├── public/               # Static assets
└── vite.config.js        # Vite configuration

```

---

## 🛠️ Quick Start

Follow these steps to set up the project locally:

1. **Install Dependencies**
```bash
npm install

```


2. **Set Up Environment Variables**
Copy the example file to a new `.env` file:
```bash
cp .env.example .env

```


3. **Run Development Server**
```bash
npm run dev

```


The app will be available at: `http://localhost:5173`
4. **Build for Production**
```bash
npm run build

```


Files will be generated in the `dist/` directory.

---

## 📦 Deployment

### Render.com

1. Connect your GitHub repository.
2. **Build Command:** `npm install && npm run build`
3. **Publish Directory:** `dist`

### Vercel

1. Import the repository.
2. Select **Vite** as the Framework Preset.
3. The build command and output directory (`dist`) will be detected automatically.

---

## 🎯 Usage

* **Local Testing:** Use `npm run dev` to explore the 3D interactive elements.
* **Permissions:** Some modules may request camera or location permissions for specific training features.
* **Navigation:** Use the glassmorphic sidebar/navbar to switch between the Training and Software Portfolio sections.

---

## 📄 License & Maintenance

* **License:** GPL-3.0
* **Maintained by:** NVIAM
* **Project Context:** Part of CODEX V2 (Advanced Entity Tracking & Heuristic Evaluation Resource).

