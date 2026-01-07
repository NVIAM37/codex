// App.jsx (Updated)

import "./global.css"; // Assuming this is your global stylesheet
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useEffect } from "react";
import React from 'react';
// Import Layouts and Components
import MainLayout from "./components/MainLayout"; // Our new layout component
import CursorEffect from "./components/CursorEffect";

// Import Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ApplicationPage from "./pages/ApplicationPage";
import Pricing from "./pages/Pricing";
import LoginPage from "./pages/LoginPage";
import Projects from "./pages/Projects";
import SoftwareProduct from "./pages/SoftwareProduct";
import AioSocialBot from "./pages/AioSocialBot";
import Courses from "./pages/Courses";
import HTMLCoursePage from "./pages/HTMLCoursePage";
import CSSCoursePage from "./pages/CSSCoursePage";
import JavaScriptCoursePage from "./pages/JavaScriptCoursePage";
import BootstrapCoursePage from "./pages/BootstrapCoursePage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/LoginPage";

export default function App() {
  useEffect(() => {
    // GSAP scripts loading is fine here
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    script.async = true;
    document.body.appendChild(script);
    // ... other scripts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <BrowserRouter>
      <CursorEffect />
      <Routes>
        {/* Route group for pages using the MainLayout with the vortex background */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="application" element={<ApplicationPage />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="projects" element={<Projects />} />
          <Route path="software" element={<SoftwareProduct />} />
          <Route path="social" element={<AioSocialBot />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/html" element={<HTMLCoursePage />} />
          <Route path="courses/css" element={<CSSCoursePage />} />
          <Route path="courses/javascript" element={<JavaScriptCoursePage />} />
          <Route path="courses/bootstrap" element={<BootstrapCoursePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/login-new" element={<Login />} />
          {/* Add other pages that need the main layout here */}
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}