import { useEffect } from "react";
import "./HTMLCoursePage.css"; // Reusing shared styles
import React from 'react';
const JavaScriptCoursePage = () => {
  useEffect(() => {
    // Initialize GSAP animations
    if (window.gsap && window.ScrollTrigger) {
      const gsap = window.gsap;
      gsap.registerPlugin(window.ScrollTrigger);

      const banner = document.getElementById("course-banner-anim");
      const isTouchDevice = () =>
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      if (banner && !isTouchDevice()) {
        banner.addEventListener("mousemove", (e) => {
          const { left, top, width, height } = banner.getBoundingClientRect();
          const x = (e.clientX - left) / width - 0.5;
          const y = (e.clientY - top) / height - 0.5;
          gsap.to(banner, {
            duration: 0.5,
            rotationY: x * 15,
            rotationX: y * -15,
            ease: "power1.out",
          });
        });
        banner.addEventListener("mouseleave", () => {
          gsap.to(banner, {
            duration: 0.8,
            rotationY: 0,
            rotationX: 0,
            ease: "elastic.out(1, 0.5)",
          });
        });
      }

      gsap.from(".lecture-item", {
        scrollTrigger: {
          trigger: ".lecture-list",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.1,
        ease: "power1.out",
      });
    }

    window.redirectToWhatsApp = () => {
      window.open("https://wa.me/923330288555", "_blank");
    };
  }, []);

  return (
    <div className="javascript-course-page">
      <div id="dynamic-bg"></div>

      <div className="container module-container">
        <div className="hero-perspective-wrapper">
          <div
            className="course-banner text-center p-4 rounded"
            id="course-banner-anim"
          >
            <img
              src="https://codepro.com.pk/images/javascript.jpg"
              alt="JavaScript Full Course"
              className="mb-3 img-fluid"
            />
            <h4 className="fw-bold">JAVASCRIPT FULL COURSE</h4>
            <p className="lead">Functionality for Your Website</p>
          </div>
        </div>

        <div className="row module-section mt-5">
          <div className="col-md-7 col-lg-8">
            <h5 className="module-title">Module 1: JavaScript</h5>
            <ul className="lecture-list list-unstyled p-3">
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/RDk3ideHK9M"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  JavaScript Lecture 1: External and Internal JS
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/KTEcF5_TOeM"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  JavaScript Lecture 2: Creating Variables
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/hwxvBJaGgJQ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  JavaScript Lecture 3: Arithmetic Operators
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/MqoDzqeV5T4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  JavaScript Lecture 4: Conditional Operators
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/A1zkfhQaMBs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  JavaScript Lecture 5: Conditional Statements (If)
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/gEKEXY9Jxig"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  JavaScript Lecture 6: Conditional Statements (If...Else)
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/YRwrusdcDO0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  JavaScript Lecture 7: Conditional Statements (If...Else If)
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/mfvMsZw8W1s"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  JavaScript Lecture 8: For Loop
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/VXGJ0n9AZoQ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  JavaScript Lecture 9: While and Do...While
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/Ax9G_gLc1kk"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  JavaScript Lecture 10: Functions
                </div>
              </li>
            </ul>
          </div>
          <div className="col-md-5 col-lg-4 mt-5 mt-md-0">
            <div
              className="card card-custom p-3 position-sticky"
              style={{ top: "110px" }}
            >
              <ul className="list-unstyled">
                <li className="mb-3 d-flex align-items-center">
                  <i className="icon fa-solid fa-clock me-3 fa-fw"></i>
                  <span className="ms-2 fw-bold">
                    Course Duration:{" "}
                    <span className="text-muted text-title">02 Months</span>
                  </span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <i className="icon fa-solid fa-book me-3 fa-fw"></i>
                  <span className="ms-2 fw-bold">
                    Study Lecture:{" "}
                    <span className="text-muted text-title">10 Lectures</span>
                  </span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <i className="icon fa-solid fa-signal me-3 fa-fw"></i>
                  <span className="ms-2 fw-bold">
                    Skill Level:{" "}
                    <span className="text-muted text-title">
                      Advance Course
                    </span>
                  </span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <i className="icon fa-solid fa-graduation-cap me-3 fa-fw"></i>
                  <span className="ms-2 fw-bold">
                    Training Mode:{" "}
                    <span className="text-muted text-title">
                      Online & On-Campus
                    </span>
                  </span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <i className="icon fa-solid fa-file-certificate me-3 fa-fw"></i>
                  <span className="ms-2 fw-bold">
                    Certificate:{" "}
                    <span className="text-muted text-title">Yes</span>
                  </span>
                </li>
              </ul>
              <button
                className="btn btn-register w-100 mt-3"
                onClick={() => window.redirectToWhatsApp()}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JavaScriptCoursePage;
