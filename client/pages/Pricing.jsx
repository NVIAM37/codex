import React, { useEffect, useRef } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "./Pricing.css";
import { gsap } from "gsap";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const PricingPage = () => {
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
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ReinhardToneMapping;

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85,
    );
    bloomPass.threshold = 0.1;
    bloomPass.strength = 1.2;
    bloomPass.radius = 0.5;
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 5000;
    const posArray = new Float32Array(particlesCnt * 3);
    for (let i = 0; i < particlesCnt * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3),
    );
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: 0x00d4ff,
    });
    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial,
    );
    scene.add(particlesMesh);

    let mouseX = 0,
      mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    document.addEventListener("mousemove", handleMouseMove);

    const clock = new THREE.Clock();
    let animationFrameId;
    function animate() {
      const elapsedTime = clock.getElapsedTime();
      particlesMesh.rotation.y = -0.1 * elapsedTime;
      particlesMesh.rotation.x = -mouseY * 0.00008;
      particlesMesh.rotation.y += mouseX * 0.00008;
      composer.render();
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // --- GSAP ANIMATIONS ---
    gsap.to(".pricing-card", {
      duration: 1.5,
      opacity: 1,
      ease: "power3.out",
      stagger: 0.2,
      delay: 0.5,
    });

    const cards = document.querySelectorAll(".pricing-card");
    const handleCardMouseMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = -1 * ((x - rect.width / 2) / rect.width) * 15;
      const rotateX = ((y - rect.height / 2) / rect.height) * 15;

      gsap.to(card, {
        duration: 0.8,
        rotationY: rotateY,
        rotationX: rotateX,
        scale: 1.05,
        transformPerspective: 1000,
        ease: "power2.out",
      });
    };
    const handleCardMouseLeave = (e) => {
      gsap.to(e.currentTarget, {
        duration: 1.2,
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        ease: "elastic.out(1, 0.5)",
      });
    };

    cards.forEach((card) => {
      card.addEventListener("mousemove", handleCardMouseMove);
      card.addEventListener("mouseleave", handleCardMouseLeave);
    });

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);
      cards.forEach((card) => {
        card.removeEventListener("mousemove", handleCardMouseMove);
        card.removeEventListener("mouseleave", handleCardMouseLeave);
      });
      renderer.dispose();
    };
  }, []);

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>CODEX Pricing - Animated & Responsive</title>
          <link
            rel="icon"
            type="image/x-icon"
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


        <canvas id="bg-canvas" ref={canvasRef}></canvas>

        <main className="pricing-container">
          <header className="pricing-header">
            <h1>Our Pricing Plans</h1>
            <p>Choose the perfect plan to elevate your business.</p>
          </header>
          <div className="pricing-card basic">
            <h3 className="plan-title">Business Website</h3>
            <p className="plan-price">Rs 20,000</p>
            <h4>PACKAGE 1</h4>
            <ul className="features-list">
              <li>
                <i className="fas fa-check-circle"></i> Up To 4 Total Pages
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Basic SEO
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Speed Optimization
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Mobile Responsive
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Custom Design
              </li>
              <li>
                <i className="fas fa-check-circle"></i> W3C Validation
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Training & Support
              </li>
            </ul>
            <a href="#" className="cta-button">
              Select Plan
            </a>
          </div>
          <div className="pricing-card standard">
            <h3 className="plan-title">Business Website</h3>
            <p className="plan-price">Rs 25,000</p>
            <h4>PACKAGE 2</h4>
            <ul className="features-list">
              <li>
                <i className="fas fa-check-circle"></i> Up To 6 Total Pages
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Basic SEO
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Speed Optimization
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Mobile Responsive
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Custom Design
              </li>
              <li>
                <i className="fas fa-check-circle"></i> W3C Validation
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Training & Support
              </li>
            </ul>
            <a href="#" className="cta-button">
              Select Plan
            </a>
          </div>
          <div className="pricing-card premium">
            <h3 className="plan-title">Business Website</h3>
            <p className="plan-price">Rs 30,000</p>
            <h4>PACKAGE 3</h4>
            <ul className="features-list">
              <li>
                <i className="fas fa-star"></i> Up To 10 Total Pages
              </li>
              <li>
                <i className="fas fa-star"></i> Complete SEO
              </li>
              <li>
                <i className="fas fa-star"></i> Speed Optimization
              </li>
              <li>
                <i className="fas fa-star"></i> Mobile Responsive
              </li>
              <li>
                <i className="fas fa-star"></i> Custom Design
              </li>
              <li>
                <i className="fas fa-star"></i> W3C Validation
              </li>
              <li>
                <i className="fas fa-star"></i> Priority Support
              </li>
            </ul>
            <a href="#" className="cta-button">
              Select Plan
            </a>
          </div>
        </main>

      </div>
    </HelmetProvider>
  );
};

export default PricingPage;
