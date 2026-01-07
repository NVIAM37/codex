import React, { useEffect, useRef } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "./SoftwareProduct.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TypeIt from "typeit";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";

const SoftwareProductPage = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // --- GSAP & TypeIt ANIMATIONS ---
    gsap.set(".hero-title", { opacity: 1 });
    gsap.set([".hero-subtitle", ".cta-button"], { opacity: 0, y: 20 });
    gsap.from(".software-header", {
      y: -100,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
    });
    gsap.to(".hero-card", {
      opacity: 1,
      duration: 1.2,
      ease: "power4.out",
      delay: 0.3,
    });

    const typeitInstance = new TypeIt(".hero-title", {
      speed: 50,
      startDelay: 1500,
      html: true,
      waitUntilVisible: true,
      afterComplete: () => {
        gsap.to(".hero-subtitle", {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        });
        gsap.to(".cta-button", {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
        });
      },
    })
      .empty()
      .type("Innovative Software,", { delay: 200 })
      .break()
      .type('<span class="highlight">Engineered for Growth.</span>')
      .go();

    const cards = gsap.utils.toArray(".glass-card");
    cards.forEach((card) => {
      if (!card.classList.contains("hero-card")) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      }

      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const midCardX = rect.width / 2;
        const midCardY = rect.height / 2;
        const rotateX = (y - midCardY) / -10;
        const rotateY = (x - midCardX) / 10;
        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          ease: "power1.out",
          duration: 0.5,
        });
        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);
      };
      const handleMouseLeave = () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          ease: "power3.out",
          duration: 1,
        });
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    });

    // --- THREE.JS STARFIELD BACKGROUND ---
    let scene,
      camera,
      renderer,
      composer,
      clock,
      nucleus,
      orbitingRings,
      particleSystem;
    const noise = new SimplexNoise();
    let mouseX = 0,
      mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    let animationFrameId;

    function init() {
      clock = new THREE.Clock();
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      camera.position.z = 40;
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);

      // ... (rest of the three.js setup code from the HTML)
      const nucleusGeometry = new THREE.IcosahedronGeometry(8, 20);
      nucleusGeometry.setAttribute(
        "originalPosition",
        nucleusGeometry.attributes.position.clone(),
      );
      const nucleusMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
      });
      nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
      scene.add(nucleus);

      orbitingRings = new THREE.Group();
      const ringCount = 8;
      for (let i = 0; i < ringCount; i++) {
        const isVertical = Math.random() > 0.5;
        const radius = 12 + i * 2;
        const tubeRadius = 0.05 + Math.random() * 0.1;
        const ringGeometry = new THREE.TorusGeometry(
          radius,
          tubeRadius,
          16,
          100,
        );
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0x4a00e0,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.6,
          wireframe: true,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = isVertical ? Math.PI / 2 : 0;
        ring.rotation.y = Math.random() * Math.PI;
        orbitingRings.add(ring);
      }
      scene.add(orbitingRings);

      const particleCount = 3000;
      const positions = new Float32Array(particleCount * 3);
      const scales = new Float32Array(particleCount);
      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = 30 + Math.random() * 40;
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
        scales[i] = Math.random();
      }
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      particleGeometry.setAttribute(
        "aScale",
        new THREE.BufferAttribute(scales, 1),
      );
      const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0.0 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        },
        vertexShader: `
                    uniform float uPixelRatio; attribute float aScale; varying float vAlpha;
                    void main() {
                        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                        vec4 viewPosition = viewMatrix * modelPosition;
                        vec4 projectionPosition = projectionMatrix * viewPosition;
                        gl_Position = projectionPosition; gl_PointSize = 25.0 * aScale * uPixelRatio;
                        gl_PointSize *= (1.0 / -viewPosition.z); vAlpha = aScale;
                    }`,
        fragmentShader: `
                    uniform float uTime; varying float vAlpha;
                    void main() {
                        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                        if(distanceToCenter > 0.5) { discard; }
                        float twinkle = 0.4 + 0.6 * sin(uTime * 2.0 + vAlpha * 20.0);
                        gl_FragColor = vec4(0.8, 0.9, 1.0, vAlpha * twinkle * 1.2);
                    }`,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });
      particleSystem = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particleSystem);

      const renderScene = new RenderPass(scene, camera);
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85,
      );
      bloomPass.threshold = 0;
      bloomPass.strength = 1.2;
      bloomPass.radius = 0.5;
      composer = new EffectComposer(renderer);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);

      document.addEventListener("mousemove", onDocumentMouseMove);
      window.addEventListener("resize", onWindowResize);
      animate();
    }

    function onWindowResize() {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      if (particleSystem)
        particleSystem.material.uniforms.uPixelRatio.value = Math.min(
          window.devicePixelRatio,
          2,
        );
    }

    function onDocumentMouseMove(event) {
      mouseX = (event.clientX - windowHalfX) / 4;
      mouseY = (event.clientY - windowHalfY) / 4;
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const time = elapsedTime * 0.1;

      const positionAttribute = nucleus.geometry.attributes.position;
      const originalPositionAttribute =
        nucleus.geometry.attributes.originalPosition;
      const vertex = new THREE.Vector3();
      for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(originalPositionAttribute, i);
        const distortion =
          1.5 *
          noise.noise3d(
            vertex.x * 0.1 + time,
            vertex.y * 0.1 + time,
            vertex.z * 0.1 + time,
          );
        vertex.multiplyScalar(1 + distortion);
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      positionAttribute.needsUpdate = true;
      nucleus.rotation.y += 0.0005;

      orbitingRings.children.forEach((ring, i) => {
        const speed = 0.0005 + i * 0.0001;
        if (i % 2 === 0) {
          ring.rotation.y += speed;
          ring.rotation.x += speed * 0.5;
        } else {
          ring.rotation.y -= speed;
        }
      });

      particleSystem.material.uniforms.uTime.value = elapsedTime;
      particleSystem.rotation.y = time * 0.1;
      particleSystem.rotation.x = time * 0.05;

      camera.position.x += (mouseX - camera.position.x) * 0.02;
      camera.position.y += (-mouseY - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      composer.render();
    }

    init();

    // Cleanup
    return () => {
      if (typeitInstance) typeitInstance.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf(
        ".glass-card, .software-header, .hero-subtitle, .cta-button",
      );
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onWindowResize);
      document.removeEventListener("mousemove", onDocumentMouseMove);
      renderer.dispose();
    };
  }, []);

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>CODEX - Next Gen Software Solutions</title>
          <link
            rel="icon"
            type="image/png"
            href="/logo.jpg"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          />
        </Helmet>


        <canvas id="webgl-canvas" ref={canvasRef}></canvas>

        <main className="container">
          <section className="hero">
            <div className="glass-card hero-card">
              <h1 className="hero-title"></h1>
              <p className="hero-subtitle">
                From streamlined POS systems to comprehensive management
                solutions, we build digital tools designed for precision,
                performance, and user-friendliness.
              </p>
              <a href="#products" className="cta-button">
                Explore Solutions
              </a>
            </div>
          </section>

          <section id="products" className="products-section">
            <h2 className="section-title">Our Software Suite</h2>
            <div className="product-grid">
              <div className="glass-card product-card">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                  alt="Data Analytics Dashboard"
                  className="card-image"
                />
                <div className="card-content">
                  <h3>Fish Market Management</h3>
                  <p className="tech-stack">
                    PHP OOP, MySQL, Bootstrap 5, Chart.js
                  </p>
                  <p>
                    A complete digital solution for fish vendors to manage daily
                    sales, supplier records, dues, customer tracking and
                    reporting.
                  </p>
                  <a
                    href="https://wa.me/923330288555"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-btn"
                  >
                    <i className="fab fa-whatsapp"></i> Request Demo
                  </a>
                </div>
              </div>
              <div className="glass-card product-card">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
                  alt="Modern Restaurant Interior"
                  className="card-image"
                />
                <div className="card-content">
                  <h3>Restaurant POS & Inventory</h3>
                  <p className="tech-stack">
                    PHP, JavaScript, MySQL, Bootstrap
                  </p>
                  <p>
                    Manages inventory, table orders, billing, and kitchen
                    updates. Designed to reduce waste and improve service speed.
                  </p>
                  <a
                    href="https://wa.me/923330288555"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-btn"
                  >
                    <i className="fab fa-whatsapp"></i> Request Demo
                  </a>
                </div>
              </div>
              <div className="glass-card product-card">
                <img
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop"
                  alt="Students in a classroom"
                  className="card-image"
                />
                <div className="card-content">
                  <h3>School Management System</h3>
                  <p className="tech-stack">
                    PHP OOP, jQuery, Bootstrap, MySQL
                  </p>
                  <p>
                    Handles admissions, student records, fee collection,
                    attendance, exams, and results for educational institutions.
                  </p>
                  <a
                    href="https://wa.me/923330288555"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-btn"
                  >
                    <i className="fab fa-whatsapp"></i> Request Demo
                  </a>
                </div>
              </div>
              <div className="glass-card product-card">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
                  alt="Doctor reviewing medical data on a tablet"
                  className="card-image"
                />
                <div className="card-content">
                  <h3>Clinic & Appointment System</h3>
                  <p className="tech-stack">
                    Laravel, MySQL, Bootstrap 5, FullCalendar.js
                  </p>
                  <p>
                    Manage patients, appointments, prescriptions, and follow-ups
                    with an intuitive, doctor-friendly user interface.
                  </p>
                  <a
                    href="https://wa.me/923330288555"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-btn"
                  >
                    <i className="fab fa-whatsapp"></i> Request Demo
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

      </div>
    </HelmetProvider>
  );
};

export default SoftwareProductPage;
