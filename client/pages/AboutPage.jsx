import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AboutPage.css'; // Your main CSS

// The rest of your component logic remains the same...
const AboutUs = () => {
    const canvasRef = useRef(null);
    const mainContainerRef = useRef(null);

    const teamMembers = [
        { name: "Abrar Hussain", title: "Founder / CEO", imgId: "abrar" },
        { name: "Waqas Tunio", title: "Team Lead", imgId: "waqas" },
        { name: "Waseem Ahmed", title: "Sr. Fullstack Developer", imgId: "waseem" },
        { name: "Moomal Sadhwani", title: "Sr. Frontend Developer", imgId: "moomal" },
        { name: "Awais Ur Rehman", title: "Sr. Frontend Developer", imgId: "awais" },
        { name: "Alisha", title: "Frontend Developer", imgId: "alisha" },
        { name: "Kiran", title: "Frontend Developer", imgId: "kiran" },
        { name: "Natasha Asnani", title: "Frontend Developer", imgId: "natasha" },
        { name: "Afia Charan", title: "Frontend Developer", imgId: "afia" },
        { name: "Sana Ali", title: "Frontend Developer", imgId: "sana" }
    ];

    useEffect(() => {
        // --- NEBULA BACKGROUND SCRIPT ---
        const vertexShader = `
            varying vec3 v_world_position;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                v_world_position = worldPosition.xyz;
                gl_Position = projectionMatrix * viewMatrix * worldPosition;
            }
        `;

        const fragmentShader = `
            uniform float u_time;
            uniform vec3 u_sky_color_1; uniform vec3 u_sky_color_2; uniform vec3 u_sky_color_3; uniform vec3 u_sky_color_4;
            varying vec3 v_world_position;

            vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
            vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
            vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
            float cnoise(vec3 P){
                vec3 Pi0 = floor(P); vec3 Pi1 = Pi0 + vec3(1.0); Pi0 = mod(Pi0, 289.0); Pi1 = mod(Pi1, 289.0);
                vec3 Pf0 = fract(P); vec3 Pf1 = Pf0 - vec3(1.0);
                vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x); vec4 iy = vec4(Pi0.yy, Pi1.yy);
                vec4 iz0 = Pi0.zzzz; vec4 iz1 = Pi1.zzzz;
                vec4 ixy = permute(permute(ix) + iy); vec4 ixy0 = permute(ixy + iz0); vec4 ixy1 = permute(ixy + iz1);
                vec4 gx0 = ixy0 / 7.0; vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5; gx0 = fract(gx0);
                vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0); vec4 sz0 = step(gz0, vec4(0.0));
                gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
                vec4 gx1 = ixy1 / 7.0; vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5; gx1 = fract(gx1);
                vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1); vec4 sz1 = step(gz1, vec4(0.0));
                gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
                vec3 g000 = vec3(gx0.x,gy0.x,gz0.x); vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
                vec3 g010 = vec3(gx0.z,gy0.z,gz0.z); vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
                vec3 g001 = vec3(gx1.x,gy1.x,gz1.x); vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
                vec3 g011 = vec3(gx1.z,gy1.z,gz1.z); vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
                vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
                g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
                vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
                g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
                float n000 = dot(g000, Pf0); float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
                float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z)); float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
                float n001 = dot(g001, vec3(Pf0.xy, Pf1.z)); float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
                float n011 = dot(g011, vec3(Pf0.x, Pf1.yz)); float n111 = dot(g111, Pf1);
                vec3 fade_xyz = fade(Pf0); vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
                vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y); float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
                return 2.2 * n_xyz;
            }

            float fbm(vec3 p) {
                float value = 0.0; float amplitude = 0.5; float freq = 1.0;
                for(int i = 0; i < 4; i++) { value += amplitude * cnoise(p * freq); freq *= 2.0; amplitude *= 0.5; }
                return value;
            }

            void main() {
                vec3 p = normalize(v_world_position); float time = u_time * 0.05;
                float noise_layer_1 = fbm(p * 2.5 + time); float noise_layer_2 = fbm(p * 6.0 + time);
                float combined_noise = noise_layer_1 * 0.7 + noise_layer_2 * 0.3;
                float intensity = smoothstep(0.1, 0.4, combined_noise);
                float core_intensity = pow(intensity, 3.0);
                float hotspot_intensity = pow(smoothstep(0.3, 0.6, combined_noise), 5.0);
                vec3 color = mix(u_sky_color_1, u_sky_color_2, intensity);
                color = mix(color, u_sky_color_3, core_intensity);
                color += u_sky_color_4 * hotspot_intensity;
                float ray_effect = pow(max(0.0, dot(p, normalize(vec3(0.5, 0.5, -0.5)))), 2.0);
                color += u_sky_color_3 * ray_effect * core_intensity * 0.25;
                gl_FragColor = vec4(color, intensity);
            }
        `;

        let scene, camera, renderer, composer, clock, skyMesh, bloomPass;
        const mouse = new THREE.Vector2(0, 0);

        const initThree = () => {
            clock = new THREE.Clock();
            scene = new THREE.Scene();
            const canvas = canvasRef.current;
            if (!canvas) return;

            renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.0;

            camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
            camera.position.set(0, 0, 0);

            const skyUniforms = {
                u_time: { value: 0.0 },
                u_sky_color_1: { value: new THREE.Color('#010814') },
                u_sky_color_2: { value: new THREE.Color('#004455') },
                u_sky_color_3: { value: new THREE.Color('#44aaff') },
                u_sky_color_4: { value: new THREE.Color('#bbfeff') }
            };

            const skyGeometry = new THREE.SphereGeometry(800, 64, 32);
            const skyMaterial = new THREE.ShaderMaterial({
                uniforms: skyUniforms,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                side: THREE.BackSide,
                depthWrite: false,
                transparent: true,
            });
            skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
            scene.add(skyMesh);

            const renderScene = new RenderPass(scene, camera);
            bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
            bloomPass.threshold = 0.05;
            bloomPass.strength = 2.2;
            bloomPass.radius = 1;

            composer = new EffectComposer(renderer);
            composer.addPass(renderScene);
            composer.addPass(bloomPass);

            let animationFrameId;
            const animate = () => {
                animationFrameId = requestAnimationFrame(animate);
                const elapsedTime = clock.getElapsedTime();
                skyUniforms.u_time.value = elapsedTime;
                skyMesh.rotation.y = elapsedTime * 0.01;
                skyMesh.rotation.x = elapsedTime * 0.005;
                const bloomPulse = (Math.sin(elapsedTime * 0.5) + 1.0) / 2.0;
                bloomPass.strength = 2.0 + bloomPulse * 1.2;
                const targetX = mouse.x * -0.2;
                const targetY = mouse.y * -0.2;
                camera.rotation.y += (targetX - camera.rotation.y) * 0.02;
                camera.rotation.x += (targetY - camera.rotation.x) * 0.02;
                composer.render();
            };
            animate();

            return () => {
                cancelAnimationFrame(animationFrameId);
                renderer.dispose();
            }
        };

        const onWindowResize = () => {
            if (camera && renderer && composer) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                composer.setSize(window.innerWidth, window.innerHeight);
            }
        };

        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
            mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
        };

        window.addEventListener('resize', onWindowResize);
        window.addEventListener('mousemove', onMouseMove);
        const cleanupThree = initThree();


        // --- GSAP ANIMATIONS ---
        gsap.registerPlugin(ScrollTrigger);
        let ctx = gsap.context(() => {
            gsap.from(".hero-glass-panel", { duration: 1.5, opacity: 0, y: 30, scale: 0.95, ease: "power2.out", delay: 0.5 });

            gsap.utils.toArray('.anim-element').forEach(el => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
                    duration: 1, opacity: 0, y: 50, ease: "power2.out"
                });
            });

            const cards = gsap.utils.toArray('.glass-card, .flip-card');
            cards.forEach(card => {
                card.addEventListener('mousemove', e => {
                    if (card.classList.contains('glass-card')) {
                        const rect = card.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        card.style.setProperty('--x', `${x}px`);
                        card.style.setProperty('--y', `${y}px`);
                    }
                });
            });
        }, mainContainerRef); // scope the context

        // --- CLEANUP ---
        return () => {
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('mousemove', onMouseMove);
            if (cleanupThree) cleanupThree();
            ctx.revert(); // cleanup GSAP
        };


    }, []);

    return (
        <>
            <canvas id="webgl-canvas" ref={canvasRef}></canvas>
            {/* hero section */}

            <header className="hero-section" id="about-us-hero">
                <div className="hero-glass-panel">
                    <h1>CODEX</h1>
                    <p>We build exceptional digital brands and empower the next generation of tech talent through professional web services and cutting-edge courses.</p>
                </div>
            </header>

            <div className="main-container" ref={mainContainerRef}>
                <main>
                    {/* our story section */}
                    <section className="content-section">
                        <h2 className="section-title">Our Story</h2>
                        <div className="glass-card anim-element" style={{ padding: '40px' }}>
                            <h3>How It All Started</h3>
                            <p>At CODEX, we champion the transformative power of a strong digital presence. Founded by Engr. Abrar Hussain and built with a team of his most talented students, our mission is to ensure every business can thrive online. We are united by a vision of advancing the world through digital solutions, crafting fully responsive websites and automation tools that make life easier for our clients and establish their brand in a competitive landscape.</p>
                        </div>
                    </section>

                    {/* our mission section */}
                    <section className="content-section">
                        <h2 className="section-title">Our Mission & Vision</h2>
                        <div className="glass-card anim-element">
                            <div className="directives-container">
                                <div className="directive-item"><div className="icon"><i className="fas fa-bullseye"></i></div><h3>Our Mission</h3><p>To provide extraordinary web and software services that empower our community to compete effectively in the global market, all delivered with a commitment to excellence and a passion for innovation.</p></div>
                                <div className="directive-item"><div className="icon"><i className="fas fa-eye"></i></div><h3>Our Vision</h3><p>To be the definitive partner for businesses seeking a powerful yet affordable digital presence, making a high-quality online identity an achievable goal for small, medium, and large enterprises alike.</p></div>
                            </div>
                        </div>
                    </section>
                    {/* our solution section */}
                    <section className="content-section">
                        <h2 className="section-title">Our Solution</h2>
                        <div className="glass-card anim-element" style={{ padding: '40px' }}>
                            <h3>A Smarter Approach</h3>
                            <p>In our interactions with clients, we observed a recurring challenge: many customers had only a vague idea of how they wanted their websites to look, leading to significant effort from designers and missed deadlines for clients. To address this, we pioneered the concept of theme installation. This approach simplifies the design process for our clients and programmers, ensuring a smoother, more efficient workflow and delivering high-quality results on time.</p>
                        </div>
                    </section>
                    {/* Our proven process section */}

                    <section className="content-section">
                        <h2 className="section-title">Our Proven Process</h2>

                        {/* A container for our new horizontal stepper layout */}
                        <div className="process-steps-container">

                            {/* Step 1: Discovery */}
                            <div className="process-step glass-card">
                                <div className="process-step-icon">
                                    <i className="fas fa-search"></i>
                                </div>
                                <h4 className="process-step-title">1. Discovery</h4>
                                <p className="process-step-description">We start by understanding your goals and presenting a curated selection of high-quality themes.</p>
                            </div>

                            {/* Connector Arrow (visible on desktop only) */}
                            <div className="process-step-connector">
                                <i className="fas fa-long-arrow-alt-right"></i>
                            </div>

                            {/* Step 2: Customization */}
                            <div className="process-step glass-card">
                                <div className="process-step-icon">
                                    <i className="fas fa-drafting-compass"></i>
                                </div>
                                <h4 className="process-step-title">2. Customization</h4>
                                <p className="process-step-description">We tailor the chosen theme with your branding, content, and unique features.</p>
                            </div>

                            {/* Connector Arrow (visible on desktop only) */}
                            <div className="process-step-connector">
                                <i className="fas fa-long-arrow-alt-right"></i>
                            </div>

                            {/* Step 3: Deployment */}
                            <div className="process-step glass-card">
                                <div className="process-step-icon">
                                    <i className="fas fa-rocket"></i>
                                </div>
                                <h4 className="process-step-title">3. Deployment</h4>
                                <p className="process-step-description">We launch your professional, responsive, and performance-optimized website.</p>
                            </div>

                        </div>
                    </section>
                    <section className="content-section">
                        <h2 className="section-title">Empowering The Next Generation</h2>
                        <p className="section-intro anim-element">We believe in bridging the gap between academic knowledge and real-world industry demands. Our training programs are designed to equip aspiring developers with the practical skills and hands-on experience needed to excel in the tech world.</p>
                        <div className="empowerment-grid">
                            <div className="glass-card empowerment-card anim-element"><div className="icon"><i className="fas fa-code"></i></div><h3>Hands-On Projects</h3><p>Our courses are built around real-world projects, ensuring students gain practical, portfolio-ready experience.</p><a href="#" className="empower-btn">View Projects</a></div>
                            <div className="glass-card empowerment-card anim-element"><div className="icon"><i className="fas fa-users"></i></div><h3>Expert Mentorship</h3><p>Learn directly from senior developers and architects who are actively building modern web applications.</p><a href="#" className="empower-btn">Meet Mentors</a></div>
                            <div className="glass-card empowerment-card anim-element"><div className="icon"><i className="fas fa-graduation-cap"></i></div><h3>Career-Ready Skills</h3><p>We focus on teaching in-demand technologies and best practices that today's top companies are looking for.</p><a href="#" className="empower-btn">Explore Courses</a></div>
                        </div>
                    </section>

                    <section id="team" className="content-section">
                        <h2 className="section-title">Meet the Architects</h2>
                        <div className="team-grid">
                            {teamMembers.map((member, index) => (
                                <div className="flip-card anim-element" key={index}>
                                    <div className="flip-card-inner">
                                        <div className="flip-card-front" style={{ backgroundImage: `url('https://i.pravatar.cc/400?u=${member.imgId}')` }}></div>
                                        <div className="flip-card-back">
                                            <h4>{member.name}</h4>
                                            <span>{member.title}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="content-section anim-element">
                        <div className="cta-banner glass-card">
                            <h2>Ready to elevate your brand or your skills?</h2>
                            <a href="#" className="cta-button">Get a Service Quote</a>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
};

export default AboutUs;