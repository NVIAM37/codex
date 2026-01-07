import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import React from 'react';
import './HomePage.css';

const HomePage = () => {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('internship');

  useEffect(() => {
    // Load Three.js and initialize 3D background
    const loadThreeJS = async () => {
      try {
        const THREE = await import('three');
        const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js');
        const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js');
        const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js');
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');

        let container, camera, scene, renderer, composer, clock, controls;
        let uniforms;

        function init() {
          container = containerRef.current;
          if (!container) return;

          scene = new THREE.Scene();
          clock = new THREE.Clock();

          camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1500);
          camera.position.set(0, 100, 250);

          renderer = new THREE.WebGLRenderer({ antialias: true }); // Enable antialias for neon look
          renderer.setPixelRatio(window.devicePixelRatio);
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setClearColor(0x000000, 1);
          renderer.toneMapping = THREE.ReinhardToneMapping;
          container.appendChild(renderer.domElement);

          // Neon Glow Bloom
          const renderScene = new RenderPass(scene, camera);
          const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.8,  // Lightweight strength
            0.3,  // radius
            0.85  // threshold
          );
          composer = new EffectComposer(renderer);
          composer.addPass(renderScene);
          composer.addPass(bloomPass);

          // Controls
          controls = new OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.dampingFactor = 0.04;
          controls.enablePan = false;
          controls.minDistance = 50;
          controls.maxDistance = 500;
          controls.maxPolarAngle = Math.PI / 2 - 0.05;
          controls.target.set(0, 10, 0);

          uniforms = {
            u_time: { value: 0.0 },
            u_color_main: { value: new THREE.Color(0x00d4ff) }, // Vibrant Cyan
            u_color_deep: { value: new THREE.Color(0x000205) }, // Darker black for better contrast
            u_color_grid: { value: new THREE.Color(0xffffff) }, // Pure bright white grid
            u_grid_size: { value: 30.0 }
          };

          const vertexShader = `
                uniform float u_time;
                varying vec2 v_uv;
                varying float v_displacement;

                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
                vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
                float snoise(vec3 v) {
                    const vec2  C = vec2(1.0/6.0, 1.0/3.0);
                    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
                    vec3 i  = floor(v + dot(v, C.yyy) );
                    vec3 x0 =   v - i + dot(i, C.xxx) ;
                    vec3 g = step(x0.yzx, x0.xyz);
                    vec3 l = 1.0 - g;
                    vec3 i1 = min( g.xyz, l.zxy );
                    vec3 i2 = max( g.xyz, l.zxy );
                    vec3 x1 = x0 - i1 + C.xxx;
                    vec3 x2 = x0 - i2 + C.yyy;
                    vec3 x3 = x0 - D.yyy;
                    i = mod289(i);
                    vec4 p = permute( permute( permute(
                                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                    float n_ = 0.142857142857;
                    vec3  ns = n_ * D.wyz - D.xzx;
                    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                    vec4 x_ = floor(j * ns.z);
                    vec4 y_ = floor(j - 7.0 * x_ );
                    vec4 x = x_ * ns.x + vec4(ns.y);
                    vec4 y = y_ * ns.x + vec4(ns.y);
                    vec4 h = 1.0 - abs(x) - abs(y);
                    vec4 b0 = vec4( x.xy, y.xy );
                    vec4 b1 = vec4( x.zw, y.zw );
                    vec4 s0 = floor(b0)*2.0 + 1.0;
                    vec4 s1 = floor(b1)*2.0 + 1.0;
                    vec4 sh = -step(h, vec4(0.0));
                    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                    vec3 p0 = vec3(a0.xy,h.x);
                    vec3 p1 = vec3(a0.zw,h.y);
                    vec3 p2 = vec3(a1.xy,h.z);
                    vec3 p3 = vec3(a1.zw,h.w);
                    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
                    p0 *= norm.x;
                    p1 *= norm.y;
                    p2 *= norm.z;
                    p3 *= norm.w;
                    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                    m = m * m;
                    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
                }

                void main() {
                    v_uv = uv;
                    float time = u_time * 0.1;
                    vec3 noise_coord_1 = vec3(position.x * 0.003 + time, position.y * 0.003, time);
                    vec3 noise_coord_2 = vec3(position.x * 0.002, position.y * 0.002 - time, time * 0.5);
                    float wave1 = snoise(noise_coord_1);
                    float wave2 = snoise(noise_coord_2);
                    v_displacement = (wave1 + wave2) * 35.0;
                    vec3 newPosition = position + normal * v_displacement;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `;

          const fragmentShader = `
                uniform vec3 u_color_main;
                uniform vec3 u_color_deep;
                uniform vec3 u_color_grid;
                uniform float u_grid_size;

                varying vec2 v_uv;
                varying float v_displacement;

                void main() {
                    vec2 grid_uv = fract(v_uv * u_grid_size);
                    vec2 dist = abs(grid_uv - 0.5);
                    float grid_line_alpha = smoothstep(0.47, 0.5, max(dist.x, dist.y));
                    float height_factor = smoothstep(0.0, 30.0, v_displacement);
                    vec3 surface_color = mix(u_color_deep, u_color_main, height_factor);
                    vec3 final_color = mix(surface_color, u_color_grid, grid_line_alpha);
                    float fade = 1.0 - smoothstep(800.0, 1200.0, gl_FragCoord.w);
                    gl_FragColor = vec4(final_color * fade, 1.0);
                }
            `;

          const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide
          });

          const geometry = new THREE.PlaneGeometry(4000, 4000, 30, 30); // Low segments
          const plane = new THREE.Mesh(geometry, material);
          plane.rotation.x = -Math.PI / 2;
          scene.add(plane);

          window.addEventListener('resize', onWindowResize);
          animate();
        }

        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
          composer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
          requestAnimationFrame(animate);
          const elapsedTime = clock.getElapsedTime();
          uniforms.u_time.value = elapsedTime;
          controls.update();
          composer.render();
        }

        init();
      } catch (error) {
        console.log('Three.js error:', error);
      }
    };

    loadThreeJS();
    initAnimations();
  }, []);

  const initAnimations = () => {
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    const isMobile = window.innerWidth < 768;

    // --- HERO: Entrance Animation ---
    gsap.from("#hero .hero-content > *", {
      delay: 0.5,
      duration: 1,
      y: 50,
      opacity: 0,
      stagger: 0.2,
      ease: "power3.out"
    });

    // --- GENERAL: Section Header & Content Animation ---
    gsap.utils.toArray('section').forEach(section => {
      const header = section.querySelector('.section-header');
      const content = section.querySelector('.row, .timeline-wrapper, .logo-slider, .slider-wrapper, .contact-form');

      if (header) {
        gsap.from(header.children, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: header,
            start: 'top 85%'
          }
        });
      }

      if (content && content.classList.contains('card-container')) {
        gsap.from(content.children, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: content,
            start: 'top 85%'
          }
        });
      }
    });

    // --- TIMELINE: Detailed Animations ---
    const timelineWrapper = document.querySelector(".timeline-wrapper");
    if (timelineWrapper) {
      gsap.to(timelineWrapper.querySelector(".timeline-line-progress"), {
        scaleY: 1,
        scrollTrigger: {
          trigger: timelineWrapper,
          start: "top center",
          end: "bottom 80%",
          scrub: 1.5
        }
      });
      gsap.utils.toArray('.timeline-item').forEach(item => {
        gsap.from(item.querySelector('.timeline-card'), {
          x: isMobile ? -50 : (item.offsetLeft === 0 ? -100 : 100),
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%'
          }
        });
        gsap.from(item.querySelector('.timeline-dot'), {
          scale: 0,
          duration: 0.5,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%'
          }
        });
      });
    }

    // --- STATS: Counter Animation ---
    gsap.utils.toArray('.stat-number').forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      let counter = { val: 0 };
      gsap.to(counter, {
        val: target,
        duration: 2.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        onUpdate: () => {
          if (el.getAttribute('data-target').includes('.')) {
            el.textContent = counter.val.toFixed(1);
          } else {
            el.textContent = Math.ceil(counter.val);
          }
        }
      });
    });

    // --- RECENT WORK: Image Hover Animation ---
    document.querySelectorAll('.portfolio-card').forEach(card => {
      const img = card.querySelector('img');
      if (img) {
        card.addEventListener('mouseenter', () => {
          gsap.to(img, { scale: 1.1, duration: 0.4, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
        });
      }
    });

    // --- CONTACT FORM: Staggered Input Animation ---
    gsap.from(".contact-form .form-control, .contact-form .btn-submit", {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.contact-form',
        start: 'top 80%'
      }
    });
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div>
      {/* Container for the 3D Background */}
      <div id="container" ref={containerRef}></div>

      {/* Main Page Content */}
      <div>
        {/* HERO SECTION */}
        <section id="hero">
          <div className="hero-content glass-card">
            <h1>We Build Scalable, Smart & Stunning Digital Solutions</h1>
            <p>From websites to AI bots – everything under one code.</p>
            <div className="hero-cta-group">
              <Link to="/contact" className="btn-glow btn-primary-glow">Start Your Project</Link>
              <Link to="#recent-work" className="btn-glow btn-secondary-glow">View Portfolio</Link>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="stats-section">
          <div className="container position-relative">
            <div className="section-header text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
              <h2>Proven by Numbers</h2>
              <p className="lead">Our performance metrics speak for themselves.</p>
            </div>
            <div className="row text-center gy-5">
              <div className="col-md-3 col-6">
                <h2 className="stat-number-wrapper">
                  <span className="stat-number" data-target="10">0</span>
                  <span className="stat-unit">M+</span>
                </h2>
                <p className="stat-label">API CALLS PER DAY</p>
              </div>
              <div className="col-md-3 col-6">
                <h2 className="stat-number-wrapper">
                  <span className="stat-number" data-target="400">0</span>
                  <span className="stat-unit">%</span>
                </h2>
                <p className="stat-label">PERFORMANCE INCREASE</p>
              </div>
              <div className="col-md-3 col-6">
                <h2 className="stat-number-wrapper">
                  <span className="stat-number" data-target="99.9">0.0</span>
                  <span className="stat-unit">%</span>
                </h2>
                <p className="stat-label">UPTIME GUARANTEE</p>
              </div>
              <div className="col-md-3 col-6">
                <h2 className="stat-number-wrapper">
                  <span className="stat-number" data-target="25">0</span>
                  <span className="stat-unit">k</span>
                </h2>
                <p className="stat-label">ACTIVE USERS</p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="section-container container" id="why-choose-us">
          <div className="section-header text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
            <h2>Why Choose Us</h2>
            <p className="lead">CODEX Delivers What Others Promise.</p>
          </div>
          <div className="row g-4 card-container">
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="choice-card glass-card p-4 d-flex align-items-center gap-3">
                <i className="fas fa-shield-halved fa-2x choice-icon"></i>
                <h5>Secure & Scalable</h5>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="choice-card glass-card p-4 d-flex align-items-center gap-3">
                <i className="fas fa-bolt-lightning fa-2x choice-icon"></i>
                <h5>Agile & Rapid Delivery</h5>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="choice-card glass-card p-4 d-flex align-items-center gap-3">
                <i className="fas fa-face-smile fa-2x choice-icon"></i>
                <h5>50+ Happy Clients</h5>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="choice-card glass-card p-4 d-flex align-items-center gap-3">
                <i className="fas fa-headset fa-2x choice-icon"></i>
                <h5>24/7 Expert Support</h5>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="choice-card glass-card p-4 d-flex align-items-center gap-3">
                <i className="fas fa-chart-line fa-2x choice-icon"></i>
                <h5>Proven SEO Results</h5>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="choice-card glass-card p-4 d-flex align-items-center gap-3">
                <i className="fas fa-handshake fa-2x choice-icon"></i>
                <h5>Free Consultations</h5>
              </div>
            </div>
          </div>
        </section>

        {/* OUR PROVEN PROCESS */}
        <section className="section-container" id="core-works">
          <div className="container">
            <div className="section-header text-center mx-auto mb-5" style={{ maxWidth: '700px' }}>
              <h2>Our Proven Process</h2>
              <p className="lead">Explore our standout process designed to deliver exceptional performance and value.</p>
            </div>
            <div className="timeline-wrapper">
              <div className="timeline-line"></div>
              <div className="timeline-line-progress"></div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-card glass-card">
                  <div className="timeline-icon">
                    <i className="fas fa-search"></i>
                  </div>
                  <h5>Consultation & Discovery</h5>
                  <p>We begin by understanding your goals, challenges, and vision.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-card glass-card">
                  <div className="timeline-icon">
                    <i className="fas fa-drafting-compass"></i>
                  </div>
                  <h5>Planning & Wireframes</h5>
                  <p>Strategic planning lays the foundation for a user-centered experience.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-card glass-card">
                  <div className="timeline-icon">
                    <i className="fas fa-palette"></i>
                  </div>
                  <h5>Design & Prototyping</h5>
                  <p>Visual creativity meets usability in interactive, client-approved prototypes.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-card glass-card">
                  <div className="timeline-icon">
                    <i className="fas fa-code"></i>
                  </div>
                  <h5>Development & Testing</h5>
                  <p>Robust development paired with rigorous testing ensures functionality.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-card glass-card">
                  <div className="timeline-icon">
                    <i className="fas fa-rocket"></i>
                  </div>
                  <h5>Deployment & Launch</h5>
                  <p>Your project goes live with full deployment and launch support.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-card glass-card">
                  <div className="timeline-icon">
                    <i className="fas fa-headset"></i>
                  </div>
                  <h5>Ongoing Support & Growth</h5>
                  <p>Post-launch, we stay with you, offering updates and improvements.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OUR PROGRAMS & COURSES */}
        <section className="section-container container" id="our-programs">
          <div className="section-header text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
            <h2>Our Programs & Courses</h2>
            <p className="lead">Accelerate your career with our hands-on training programs.</p>
          </div>
          <ul className="nav nav-pills justify-content-center mb-5 programs-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'internship' ? 'active' : ''}`}
                onClick={() => handleTabClick('internship')}
                type="button"
              >
                Internship
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => handleTabClick('courses')}
                type="button"
              >
                Online Course
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'mentorship' ? 'active' : ''}`}
                onClick={() => handleTabClick('mentorship')}
                type="button"
              >
                Mentorship
              </button>
            </li>
          </ul>
          <div className="tab-content">
            <div className={`tab-pane fade ${activeTab === 'internship' ? 'show active' : ''}`}>
              <div className="row g-3 justify-content-center card-container">
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="glass-card program-card compact">
                    <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="UI/UX Program" />
                    <div className="program-card-content">
                      <h5>UI/UX Internship</h5>
                      <Link to="#" className="btn btn-program">View Details</Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="glass-card program-card compact">
                    <img src="https://media.istockphoto.com/id/1464853466/photo/place-of-work.jpg?s=612x612&w=0&k=20&c=Jn0W-oZdBjtm80gWhWzropUeWoODxYrxbWIkniAbhGc=" alt="Linux Program" />
                    <div className="program-card-content">
                      <h5>Linux Internship</h5>
                      <Link to="#" className="btn btn-program">View Details</Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="glass-card program-card compact">
                    <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Frontend Program" />
                    <div className="program-card-content">
                      <h5>Frontend Dev Internship</h5>
                      <Link to="#" className="btn btn-program">View Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`tab-pane fade ${activeTab === 'courses' ? 'show active' : ''}`}>
              <div className="row g-3 justify-content-center card-container">
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="glass-card program-card compact">
                    <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="MERN Stack Course" />
                    <div className="program-card-content">
                      <h5>MERN Stack Mastery</h5>
                      <Link to="#" className="btn btn-program">View Details</Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="glass-card program-card compact">
                    <img src="https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Mobile App Course" />
                    <div className="program-card-content">
                      <h5>Mobile App Development</h5>
                      <Link to="#" className="btn btn-program">View Details</Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="glass-card program-card compact">
                    <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="React Development" />
                    <div className="program-card-content">
                      <h5>React Development</h5>
                      <Link to="#" className="btn btn-program">View Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`tab-pane fade ${activeTab === 'mentorship' ? 'show active' : ''}`}>
              <div className="row g-3 justify-content-center card-container">
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="glass-card program-card compact">
                    <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1334&q=80" alt="Startup Mentorship" />
                    <div className="program-card-content">
                      <h5>Startup Incubation</h5>
                      <Link to="#" className="btn btn-program">View Details</Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="glass-card program-card compact">
                    <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Business Mentorship" />
                    <div className="program-card-content">
                      <h5>Business Mentorship</h5>
                      <Link to="#" className="btn btn-program">View Details</Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="glass-card program-card compact">
                    <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Tech Consulting" />
                    <div className="program-card-content">
                      <h5>Tech Consulting</h5>
                      <Link to="#" className="btn btn-program">View Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RECENT WORK */}
        <section className="section-container container" id="recent-work">
          <div className="section-header text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
            <h2>Recent Work</h2>
            <p className="lead">A gallery of our passion, precision, and performance.</p>
          </div>
          <div className="row g-3 card-container">
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="glass-card portfolio-card compact">
                <img src="https://codepro.com.pk/assets_/image/portfolio/aiNextTool.png" alt="AI Next Tool" />
                <div className="card-body">
                  <h5>AI Next Tool Theme</h5>
                  <p className="small opacity-75">A cutting-edge WordPress theme designed for AI tools and SaaS platforms.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="glass-card portfolio-card compact">
                <img src="https://codepro.com.pk/assets_/image/portfolio/renttrade.png" alt="Reliant Trade" />
                <div className="card-body">
                  <h5>Reliant Trade Link Theme</h5>
                  <p className="small opacity-75">A robust and secure theme for trading services with real-time data features.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="glass-card portfolio-card compact">
                <img src="https://codepro.com.pk/assets_/image/portfolio/wp-jdm.png" alt="JDM Garage" />
                <div className="card-body">
                  <h5>JDM Garage Hub Theme</h5>
                  <p className="small opacity-75">A visually rich theme for automotive enthusiasts and service booking.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="section-container container" id="testimonials">
          <div className="section-header text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
            <h2>What Our Clients Say</h2>
            <p className="lead">Success stories from partners who trust our expertise.</p>
          </div>
          <div className="row g-3 card-container">
            <div className="col-lg-4 col-md-4 col-sm-6">
              <figure className="testimonial-card glass-card p-3 compact">
                <blockquote>"Working with this team was a game-changer. Their attention to detail and commitment to quality is unparalleled."</blockquote>
                <figcaption className="d-flex align-items-center gap-2">
                  <img src="https://i.pravatar.cc/50?u=1" alt="Client 1" className="rounded-circle" />
                  <div>
                    <div className="client-name">Alex Johnson</div>
                    <div className="client-title">CEO, Innovatech</div>
                  </div>
                </figcaption>
              </figure>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <figure className="testimonial-card glass-card p-3 compact">
                <blockquote>"The entire process, from concept to launch, was seamless. They transformed our vision into a digital reality."</blockquote>
                <figcaption className="d-flex align-items-center gap-2">
                  <img src="https://i.pravatar.cc/50?u=2" alt="Client 2" className="rounded-circle" />
                  <div>
                    <div className="client-name">Samantha Lee</div>
                    <div className="client-title">Founder, Digital Horizon</div>
                  </div>
                </figcaption>
              </figure>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <figure className="testimonial-card glass-card p-3 compact">
                <blockquote>"Unbelievable performance and constant support. They are not just a vendor; they are a true technology partner."</blockquote>
                <figcaption className="d-flex align-items-center gap-2">
                  <img src="https://i.pravatar.cc/50?u=3" alt="Client 3" className="rounded-circle" />
                  <div>
                    <div className="client-name">David Chen</div>
                    <div className="client-title">CTO, Quantum Solutions</div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* WE WORK WITH (LOGO SLIDER) */}
        <section className="section-container" id="partners">
          <div className="section-header text-center mx-auto mb-4" style={{ maxWidth: '600px' }}>
            <h2>We Work With</h2>
          </div>
          <div className="logo-slider">
            <div className="logo-track">
              <div className="logo-slide"><i className="fab fa-aws"></i></div>
              <div className="logo-slide"><i className="fab fa-google"></i></div>
              <div className="logo-slide"><i className="fab fa-microsoft"></i></div>
              <div className="logo-slide"><i className="fab fa-spotify"></i></div>
              <div className="logo-slide"><i className="fab fa-slack"></i></div>
              <div className="logo-slide"><i className="fab fa-digital-ocean"></i></div>
              <div className="logo-slide"><i className="fab fa-github"></i></div>
              <div className="logo-slide"><i className="fab fa-aws"></i></div>
              <div className="logo-slide"><i className="fab fa-google"></i></div>
              <div className="logo-slide"><i className="fab fa-microsoft"></i></div>
              <div className="logo-slide"><i className="fab fa-spotify"></i></div>
              <div className="logo-slide"><i className="fab fa-slack"></i></div>
              <div className="logo-slide"><i className="fab fa-digital-ocean"></i></div>
              <div className="logo-slide"><i className="fab fa-github"></i></div>
            </div>
          </div>
        </section>
        {/* IMAGE SLIDER */}
        <section className="section-container" id="image-slider-section">
          <div className="container">

            {/* Section Header (remains the same) */}
            <div className="section-header text-center mx-auto" style={{ maxWidth: '600px' }}>
              <h2>A Glimpse Into Our World</h2>
              <p className="lead">We're not just a company; we're a community of innovators and mentors.</p>
            </div>

            {/* The slider wrapper with its new unique class name */}
            <div className="threed-slider-wrapper">
              {/* The rotating container with its new unique class name */}
              <div className="threed-slider-container">
                <div className="threed-slider-slide">
                  <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600" alt="Cybersecurity" />
                </div>
                <div className="threed-slider-slide">
                  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600" alt="Electronics" />
                </div>
                <div className="threed-slider-slide">
                  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600" alt="Global Network" />
                </div>
                <div className="threed-slider-slide">
                  <img src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&q=80&w=600" alt="Robotics" />
                </div>
                <div className="threed-slider-slide">
                  <img src="https://images.unsplash.com/photo-1531297484001-80022131f1a1?auto=format&fit=crop&q=80&w=600" alt="Artificial Intelligence" />
                </div>
                <div className="threed-slider-slide">
                  <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600" alt="Modern Workplace" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT FORM */}
        <section className="section-container container" id="contact">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Section Header */}
              <div className="section-header text-center mx-auto mb-5">
                <h2>Let's Connect</h2>
                <p className="lead">Have a project in mind? We'd love to hear about it.</p>
              </div>

              {/* Glass Card Wrapper for the Form */}
              <div className="glass-card" style={{ padding: '2.5rem' }}> {/* Added a bit more padding */}
                <form>
                  <div className="row g-4"> {/* Increased gutter size for more space */}

                    <div className="col-md-6">
                      <input type="text" className="cform-input" placeholder="Your Name" required />
                    </div>

                    <div className="col-md-6">
                      <input type="email" className="cform-input" placeholder="Your Email" required />
                    </div>

                    <div className="col-md-6">
                      <input type="tel" className="cform-input" placeholder="Phone Number" />
                    </div>

                    <div className="col-md-6">
                      <input type="text" className="cform-input" placeholder="Company" />
                    </div>

                    <div className="col-12">
                      <input type="text" className="cform-input" placeholder="Subject" required />
                    </div>

                    <div className="col-12">
                      <textarea className="cform-input" rows="5" placeholder="Tell us about your project..." required></textarea>
                    </div>

                    <div className="col-12 text-center">
                      <button type="submit" className="cform-submit-button">Send Message</button>
                    </div>

                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
