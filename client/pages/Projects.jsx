import React, { useEffect, useRef } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "./Projects.css";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const ProjectsPage = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // --- THREE.JS SCENE ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 6;
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const atomicModel = new THREE.Group();
    const orbitalRings = [];
    const nucleusGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const nucleusMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00d4ff,
      emissiveIntensity: 2,
    });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    atomicModel.add(nucleus);

    const numRings = 5;
    for (let i = 0; i < numRings; i++) {
      const particlesPerRing = 1000;
      const radius = 1.5 + i * 0.7;
      const positions = new Float32Array(particlesPerRing * 3);
      for (let j = 0; j < particlesPerRing; j++) {
        const angle = (j / particlesPerRing) * Math.PI * 2;
        positions[j * 3] = Math.cos(angle) * radius;
        positions[j * 3 + 1] = (Math.random() - 0.5) * 0.2;
        positions[j * 3 + 2] = Math.sin(angle) * radius;
      }
      const ringGeometry = new THREE.BufferGeometry();
      ringGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      const ringMaterial = new THREE.PointsMaterial({
        color: 0x00aefd,
        size: 0.02,
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Points(ringGeometry, ringMaterial);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      orbitalRings.push(ring);
      atomicModel.add(ring);
    }
    scene.add(atomicModel);

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85,
    );
    bloomPass.threshold = 0.1;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0.5;
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const handleScroll = () => {
      const scrollPercent =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      const rotation = scrollPercent * Math.PI * 2;
      atomicModel.rotation.y = rotation;
      camera.position.z = 6 - scrollPercent * 2;
    };
    window.addEventListener("scroll", handleScroll);

    const clock = new THREE.Clock();
    let animationFrameId;
    function animate() {
      const elapsedTime = clock.getElapsedTime();
      orbitalRings.forEach((ring, index) => {
        const speed = 0.1 * (index * 0.5 + 1);
        ring.rotation.z = elapsedTime * speed;
      });
      atomicModel.position.y = Math.sin(elapsedTime * 0.5) * 0.1;
      composer.render();
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    // --- INTERACTIVITY & ANIMATIONS ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    const cards = document.querySelectorAll(".project-card");
    const handleCardMouseMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { width, height } = rect;
      const rotateX = (y / height - 0.5) * -15;
      const rotateY = (x / width - 0.5) * 25;
      card.style.setProperty("--rotateX", `${rotateX}deg`);
      card.style.setProperty("--rotateY", `${rotateY}deg`);
    };
    const handleCardMouseLeave = (e) => {
      const card = e.currentTarget;
      card.style.setProperty("--rotateX", "0deg");
      card.style.setProperty("--rotateY", "0deg");
    };
    cards.forEach((card) => {
      card.addEventListener("mousemove", handleCardMouseMove);
      card.addEventListener("mouseleave", handleCardMouseLeave);
    });

    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    const elementsToReveal = document.querySelectorAll(".reveal-on-scroll");
    elementsToReveal.forEach((el) => observer.observe(el));

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cards.forEach((card) => {
        card.removeEventListener("mousemove", handleCardMouseMove);
        card.removeEventListener("mouseleave", handleCardMouseLeave);
      });
      observer.disconnect();
      renderer.dispose();
    };
  }, []);

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>CODEX | Digital Experiences</title>
          <link
            rel="icon"
            type="image/x-icon"
            href="/logo.jpg"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          />
        </Helmet>


        <canvas id="bg-canvas" ref={canvasRef}></canvas>

        <div className="content-wrapper">
          <header className="project-hero-header">
            <div className="hero-text-container">
              <h1>We Build Digital Experiences</h1>
              <p>
                From stunning designs to powerful code, we transform your vision
                into a seamless reality that captivates and converts.
              </p>
            </div>
          </header>

          <main className="section">
            <h2 className="section-title">Featured Themes</h2>
            <div className="projects-grid">
              <div className="project-card reveal-on-scroll">
                <div className="card-content-wrapper">
                  <img
                    src="https://codepro.com.pk/images/bluiderThemes.png"
                    className="card-img-top"
                    alt="Builder Template"
                  />
                  <div className="card-body">
                    <h3>
                      <i className="fa-brands fa-bootstrap"></i> Builder Theme
                    </h3>
                    <p className="card-text">
                      By Codepro | HTML, CSS, Bootstrap
                    </p>
                    <div className="card-footer">
                      <a
                        href="https://www.youtube.com/watch?v=TvI0OqpSPDk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="live-preview-btn"
                      >
                        Live Preview
                      </a>
                      <a
                        href="https://wa.me/+923343401969"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-btn"
                      >
                        <i className="fa-brands fa-whatsapp"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="project-card reveal-on-scroll">
                <div className="card-content-wrapper">
                  <img
                    src="https://codepro.com.pk/images/hotelTheme.png"
                    className="card-img-top"
                    alt="Hotel Template"
                  />
                  <div className="card-body">
                    <h3>
                      <i className="fa-brands fa-bootstrap"></i> Hotel Theme
                    </h3>
                    <p className="card-text">
                      By Codepro | HTML, CSS, Bootstrap
                    </p>
                    <div className="card-footer">
                      <a
                        href="https://youtu.be/3BnAgugJFFA?si=9FO1JkOQTuZNnGVB"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="live-preview-btn"
                      >
                        Live Preview
                      </a>
                      <a
                        href="https://wa.me/+923343401969"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-btn"
                      >
                        <i className="fa-brands fa-whatsapp"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="project-card reveal-on-scroll">
                <div className="card-content-wrapper">
                  <img
                    src="https://codepro.com.pk/images/coffeeThemes.png"
                    className="card-img-top"
                    alt="Coffee Template"
                  />
                  <div className="card-body">
                    <h3>
                      <i className="fa-brands fa-bootstrap"></i> Coffee Shop
                      Theme
                    </h3>
                    <p className="card-text">
                      By Codepro | HTML, CSS, Bootstrap
                    </p>
                    <div className="card-footer">
                      <a
                        href="https://youtu.be/QI9NI1TIHgI?si=3oV4VB04Sjq7rSI2"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="live-preview-btn"
                      >
                        Live Preview
                      </a>
                      <a
                        href="https://wa.me/+923343401969"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-btn"
                      >
                        <i className="fa-brands fa-whatsapp"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="project-card reveal-on-scroll">
                <div className="card-content-wrapper">
                  <img
                    src="https://codepro.com.pk/images/Ecommerce-furniture.png"
                    className="card-img-top"
                    alt="Ecommerce Template"
                  />
                  <div className="card-body">
                    <h3>
                      <i className="fa-brands fa-bootstrap"></i> Furniture Store
                      Theme
                    </h3>
                    <p className="card-text">
                      By Codepro | HTML, CSS, Bootstrap
                    </p>
                    <div className="card-footer">
                      <a
                        href="https://youtu.be/TTeKJbC3JJQ?si=-ca1frKFnNcRtRxc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="live-preview-btn"
                      >
                        Live Preview
                      </a>
                      <a
                        href="https://wa.me/+923343401969"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-btn"
                      >
                        <i className="fa-brands fa-whatsapp"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <section className="section">
            <h2 className="section-title">Our Process</h2>
            <div className="process-grid">
              <div className="process-step reveal-on-scroll">
                <div className="icon-wrapper">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h3>1. Discover & Plan</h3>
                <p>
                  We start by understanding your vision, goals, and audience to
                  create a strategic plan for success.
                </p>
              </div>
              <div className="process-step reveal-on-scroll">
                <div className="icon-wrapper">
                  <i className="fas fa-drafting-compass"></i>
                </div>
                <h3>2. Design & Prototype</h3>
                <p>
                  Our team crafts stunning, user-centric designs and interactive
                  prototypes for your approval.
                </p>
              </div>
              <div className="process-step reveal-on-scroll">
                <div className="icon-wrapper">
                  <i className="fas fa-code"></i>
                </div>
                <h3>3. Develop & Build</h3>
                <p>
                  Using the latest tech, we write clean, efficient code to bring
                  the approved designs to life.
                </p>
              </div>
              <div className="process-step reveal-on-scroll">
                <div className="icon-wrapper">
                  <i className="fas fa-rocket"></i>
                </div>
                <h3>4. Deploy & Grow</h3>
                <p>
                  We launch your project, and provide support for future growth.
                </p>
              </div>
            </div>
          </section>

          <section className="section cta-section">
            <div className="cta-container reveal-on-scroll">
              <h2>Ready to Build Your Vision?</h2>
              <p>
                Let's collaborate to create something extraordinary. We're
                excited to hear your ideas and turn them into a stunning digital
                product.
              </p>
              <a
                href="https://wa.me/+923343401969"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button"
              >
                <i className="fas fa-paper-plane"></i> Contact Us
              </a>
            </div>
          </section>
        </div>

      </div>
    </HelmetProvider>
  );
};

export default ProjectsPage;
