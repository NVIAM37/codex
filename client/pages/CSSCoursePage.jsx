import { useEffect } from "react";
import "./HTMLCoursePage.css"; // Reusing shared styles
import React from 'react';
const CSSCoursePage = () => {
  useEffect(() => {
    // Initialize GSAP animations
    if (window.gsap && window.ScrollTrigger) {
      const gsap = window.gsap;
      gsap.registerPlugin(window.ScrollTrigger);

      // 3D Tilt Animation for the course banner
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

      // Scroll Animation for lecture items
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
    <div className="css-course-page">
      <div id="dynamic-bg"></div>

      <div className="container module-container">
        <div className="hero-perspective-wrapper">
          <div
            className="course-banner text-center p-4 rounded"
            id="course-banner-anim"
          >
            <img
              src="https://codepro.com.pk/images/CSS.jpg"
              alt="CSS Full Course"
              className="mb-3 img-fluid"
            />
            <h4 className="fw-bold">CSS FULL COURSE</h4>
            <p className="lead">Web Design & Development</p>
          </div>
        </div>

        <div className="row module-section mt-5">
          <div className="col-md-7 col-lg-8">
            <h5 className="module-title">Module 1: CSS</h5>
            <ul className="lecture-list list-unstyled p-3">
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/uLyczKK7P_Q"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">CSS Lecture 1: Introduction</div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/0rt7f81hm5Q"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  CSS Lecture 2: Core Concepts Part 1
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/gbQ5OPPfeDw"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  CSS Lecture 3: Core Concepts Part 2
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/23PSj_AJND8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  CSS Lecture 4: Core Concepts Part 3
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/ST-0XryF6g0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  CSS Lecture 5: Core Concepts ID-Sector Part 4
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/WB4D42ciMqQ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  CSS Lecture 6: Core Concepts Part 5
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/-0IwtZXbuGk"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  CSS Lecture 7: Core Concepts Part 6
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/uADIgOxo0Gs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  CSS Lecture 9: The Box Model | Display Property
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/pbjGQZFxkwE"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">CSS Lecture 10: Typography</div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/Q4rZE-nZD5Q"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">CSS Lecture 11: Float</div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/Q4rZE-nZD5Q"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">CSS Lecture 12: Flex</div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/JZ4VHY-SAp0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">
                  CSS Lecture 13: Box Module and Layout
                </div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/pUjzf0HtIFo"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">CSS Lecture 14: Flexbox</div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/MTFhA67LQjg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">CSS Lecture 15: Grid</div>
              </li>
              <li className="d-flex align-items-center mb-3 lecture-item">
                <div className="play-icon-wrapper me-3">
                  <a
                    href="https://youtu.be/AmoikjgsPc4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
                <div className="lecture-title">CSS Lecture 16: Index</div>
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
                    <span className="text-muted text-title">01 Month</span>
                  </span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <i className="icon fa-solid fa-book me-3 fa-fw"></i>
                  <span className="ms-2 fw-bold">
                    Study Lecture:{" "}
                    <span className="text-muted text-title">16 Lectures</span>
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

export default CSSCoursePage;
