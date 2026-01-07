import { useEffect, useRef } from 'react';
import './AioSocialBot.css';
import React from 'react';
const SocialPage = () => {
  const bgCanvasRef = useRef(null);
  const heroRobotCanvasRef = useRef(null);

  useEffect(() => {
    // Initialize 3D backgrounds and animations
    const initializeThreeJS = async () => {
      try {
        const THREE = await import('three');
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js');
        const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js');
        const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js');

        // Background Canvas Setup
        const bgScene = new THREE.Scene();
        const bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        bgCamera.position.z = 5;
        const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvasRef.current, antialias: true });
        bgRenderer.setSize(window.innerWidth, window.innerHeight);
        bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const bgComposer = new EffectComposer(bgRenderer);
        bgComposer.addPass(new RenderPass(bgScene, bgCamera));
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.6, 0.4, 0.85);
        bloomPass.threshold = 0.21;
        bloomPass.strength = 1.8;
        bloomPass.radius = 0.55;
        bgComposer.addPass(bloomPass);

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 8000;
        const posArray = new Float32Array(particlesCount * 3);
        const originalPosArray = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 25;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        originalPosArray.set(posArray);
        const particlesMesh = new THREE.Points(particlesGeometry, new THREE.PointsMaterial({ size: 0.015, color: 0x00d4ff }));
        bgScene.add(particlesMesh);

        // Robot Canvas Setup
        const robotScene = new THREE.Scene();
        const robotCamera = new THREE.PerspectiveCamera(50, heroRobotCanvasRef.current.clientWidth / heroRobotCanvasRef.current.clientHeight, 0.1, 100);
        robotCamera.position.z = 8;
        const robotRenderer = new THREE.WebGLRenderer({ canvas: heroRobotCanvasRef.current, antialias: true, alpha: true });
        robotRenderer.setSize(heroRobotCanvasRef.current.clientWidth, heroRobotCanvasRef.current.clientHeight);
        robotRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        robotScene.add(new THREE.AmbientLight(0xffffff, 1.5));
        const robotDirLight = new THREE.DirectionalLight(0x00d4ff, 4);
        robotDirLight.position.set(2, 5, 5);
        robotScene.add(robotDirLight);

        let robotModel;
        const loader = new GLTFLoader();
        loader.load('https://api.poly.pizza/v1/download/2a665239-51a8-466d-8526-0e6538b975e5', (gltf) => {
          robotModel = gltf.scene;
          robotModel.scale.set(3.5, 3.5, 3.5);
          robotModel.position.y = -4;
          robotScene.add(robotModel);
        });

        const clock = new THREE.Clock();
        const mouse = new THREE.Vector2();

        function animateGlobal() {
          const elapsedTime = clock.getElapsedTime();
          particlesMesh.geometry.attributes.position.needsUpdate = true;
          for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            particlesMesh.geometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime * 0.5 + originalPosArray[i3] * 0.5) * 0.5;
          }
          bgComposer.render();
          requestAnimationFrame(animateGlobal);
        }

        function animateRobot() {
          if (robotModel) {
            robotModel.rotation.y = (mouse.x * 0.4);
            robotModel.position.x = mouse.x * 1.5;
            robotModel.position.y = -4 + mouse.y * -1;
          }
          if (window.gsap) {
            window.gsap.to('.hero-content', { x: -mouse.x * 30, y: -mouse.y * 30, duration: 1, ease: 'power2.out' });
          }
          robotRenderer.render(robotScene, robotCamera);
          requestAnimationFrame(animateRobot);
        }

        animateGlobal();
        animateRobot();

        const handleMouseMove = (event) => {
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        const handleResize = () => {
          bgCamera.aspect = window.innerWidth / window.innerHeight;
          bgCamera.updateProjectionMatrix();
          bgRenderer.setSize(window.innerWidth, window.innerHeight);
          bgComposer.setSize(window.innerWidth, window.innerHeight);
          robotCamera.aspect = heroRobotCanvasRef.current.clientWidth / heroRobotCanvasRef.current.clientHeight;
          robotCamera.updateProjectionMatrix();
          robotRenderer.setSize(heroRobotCanvasRef.current.clientWidth, heroRobotCanvasRef.current.clientHeight);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('resize', handleResize);
        };
      } catch (error) {
        console.log('Three.js not available, using fallback');
      }
    };

    // Initialize GSAP animations
    const initializeGSAP = () => {
      if (window.gsap && window.ScrollTrigger) {
        const gsap = window.gsap;
        gsap.registerPlugin(window.ScrollTrigger);

        document.querySelectorAll('.glass-card, .section-title, .feature-text, .feature-image').forEach(el => {
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none", once: true },
            opacity: 0, y: 50, scale: 0.98, duration: 0.8, ease: "power2.out"
          });
        });

        const heroHeadline = document.querySelector('.hero-headline');
        if (heroHeadline) {
          heroHeadline.innerHTML = heroHeadline.textContent.replace(/([^.\s]+)/g, "<span>$1</span>").replace('<span>Reclaim</span><span>Your</span><span>Time.</span>', '<span class="highlight">Reclaim Your Time.</span>');
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.from('nav', { y: -50, opacity: 0, duration: 1 })
            .from('.hero-headline span', { y: 30, opacity: 0, stagger: 0.1 }, "-=0.5")
            .from(['.hero-content p', '.platform-icons', '.giveaway-banner'], { y: 20, opacity: 0, stagger: 0.2 }, "-=0.8");
        }
      }
    };

    initializeThreeJS();
    initializeGSAP();
  }, []);

  return (
    <div className="social-page">
      <canvas ref={bgCanvasRef} id="bg-canvas"></canvas>

      <main>
        <header className="container hero ">
          <canvas ref={heroRobotCanvasRef} id="hero-robot-canvas"></canvas>
          <div className="hero-content">
            <h1 className="hero-headline">Automate Your Social Media. <span className="highlight">Reclaim Your Time.</span></h1>
            <p>One-click posting and scheduling across all your essential platforms. Stop the manual work and focus on what truly matters—growing your brand.</p>
            <div className="platform-icons">
              <i className="fab fa-linkedin" title="LinkedIn"></i>
              <i className="fab fa-instagram" title="Instagram"></i>
              <i className="fab fa-twitter" title="Twitter (X)"></i>
              <i className="fab fa-threads" title="Threads"></i>
              <i className="fab fa-facebook-f" title="Facebook"></i>
            </div>
            <div className="giveaway-banner ">
              <a href="#">
                <span><strong>Flash Giveaway!</strong> Claim your 3-month premium key now.</span>
                <i className="fas fa-arrow-right animated-arrow"></i>
              </a>
            </div>
          </div>
        </header>

        <section id="features" className="container">
          <h2 className="section-title">One Tool, <span>Infinite Possibilities</span></h2>
          <div className="feature-row">
            <div className="feature-text">
              <h3>Schedule with Confidence</h3>
              <p>Plan your entire content calendar. Write posts, attach media, and set them to publish at the optimal time. Our bot ensures your content goes live, even if you're offline.</p>
            </div>
            <div className="feature-image glass-card">
              <img src="https://trading4business.co.uk/wp-content/uploads/2019/10/High-Tech0.jpg" alt="Scheduling Interface" />
            </div>
          </div>
          <div className="feature-row reverse">
            <div className="feature-text">
              <h3>Never Lose a Post</h3>
              <p>Internet dropped? PC shut down? No problem. For scheduled posts, our tool automatically retries failed attempts and provides a simple one-click restore option, guaranteeing your content is never lost.</p>
            </div>
            <div className="feature-image glass-card">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyPhSGXcCWcn2l39WMp_qPFglHQlBss3fdpA&s" alt="Post Management" />
            </div>
          </div>
          <div className="feature-row">
            <div className="feature-text">
              <h3>Total Control & Security</h3>
              <p>Edit, update, or delete upcoming posts from a single dashboard. Your license is secured to your machine with hardware-locked validation, ensuring your account is always safe and private.</p>
            </div>
            <div className="feature-image glass-card">
              <img src="https://media.licdn.com/dms/image/v2/D4E12AQEytPzoULNe7g/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1692201801161?e=2147483647&v=beta&t=WFhyYiybUjHWl-1KcigLwRtap1GEDIYWzDaBGTNNe0U" alt="Security Lock" />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="container">
          <h2 className="section-title">A Simple <span>3-Step Workflow</span></h2>
          <div className="workflow-steps">
            <div className="workflow-step glass-card">
              <div className="step-number">1</div>
              <h3>Connect Your Accounts</h3>
              <p>Securely add your social media profiles. Choose between manual login or a direct connection via Google/Facebook for a seamless setup.</p>
            </div>
            <div className="workflow-step glass-card">
              <div className="step-number">2</div>
              <h3>Create Your Content</h3>
              <p>Write compelling copy, attach your images or videos, and select the platforms you want to post to. Handle everything from one unified interface.</p>
            </div>
            <div className="workflow-step glass-card">
              <div className="step-number">3</div>
              <h3>Publish or Schedule</h3>
              <p>Click "Post Now" for instant sharing, or "Schedule Post" to add it to your queue. Scheduling enables our powerful auto-retry and restore features.</p>
            </div>
          </div>
        </section>

        <section id="for-who" className="container">
          <h2 className="section-title">Perfect For <span>Any Creator</span></h2>
          <div className="personas-grid">
            <div className="glass-card persona-card">
              <div className="icon"><i className="fas fa-bullhorn"></i></div>
              <h3>Marketers</h3>
              <p>Run multiple campaigns across different platforms effortlessly. Schedule promotional content weeks in advance and maintain a consistent brand voice.</p>
            </div>
            <div className="glass-card persona-card">
              <div className="icon"><i className="fas fa-lightbulb"></i></div>
              <h3>Entrepreneurs</h3>
              <p>Be your own social media manager. Save countless hours each week so you can focus on building your business, not just posting about it.</p>
            </div>
            <div className="glass-card persona-card">
              <div className="icon"><i className="fas fa-palette"></i></div>
              <h3>Content Creators</h3>
              <p>Batch create and schedule your content in one go. Keep your audience engaged with a steady stream of posts while you focus on your creative work.</p>
            </div>
          </div>
        </section>

        <section id="pricing" className="container">
          <h2 className="section-title">Start Free, <span>Upgrade When Ready</span></h2>
          <div className="pricing-grid">
            <div className="glass-card price-card">
              <h3>Free Trial</h3>
              <div className="price">₨0</div>
              <p>7 days full-feature access</p>
              <ul>
                <li><i className="fas fa-check-circle"></i> Schedule & Manage Posts</li>
                <li><i className="fas fa-check-circle"></i> Auto-Retry & Restore</li>
                <li><i className="fas fa-check-circle"></i> Hardware-Locked Security</li>
                <li><i className="fas fa-check-circle"></i> Full Platform Access</li>
              </ul>
              <a href="#get-started" className="btn btn-outline mt-auto">Start For Free</a>
            </div>
            <div className="glass-card price-card highlighted-plan">
              <h3>Monthly</h3>
              <div className="price">₨500</div>
              <p>Affordable monthly billing</p>
              <ul>
                <li><i className="fas fa-check-circle"></i> All Features in Trial</li>
                <li><i className="fas fa-check-circle"></i> Priority Customer Support</li>
                <li><i className="fas fa-check-circle"></i> Ongoing Updates</li>
                <li><i className="fas fa-check-circle"></i> Flexible Monthly Renewal</li>
              </ul>
              <a href="https://wa.me/923330288555" target="_blank" rel="noopener noreferrer" className="btn mt-auto">Subscribe Now</a>
            </div>
            <div className="glass-card price-card">
              <h3>Lifetime Access</h3>
              <div className="price">₨25,000</div>
              <p>One-time payment</p>
              <ul>
                <li><i className="fas fa-check-circle"></i> Everything in Monthly</li>
                <li><i className="fas fa-check-circle"></i> <strong>All Future Updates Free</strong></li>
                <li><i className="fas fa-check-circle"></i> <strong>All Future Platforms Free</strong></li>
                <li><i className="fas fa-check-circle"></i> Full Ownership License</li>
              </ul>
              <a href="https://wa.me/923330288555" target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-auto">Get Lifetime</a>
            </div>
          </div>
        </section>

        <section id="get-started" className="container">
          <h2 className="section-title">Ready To <span>Get Started?</span></h2>
          <div className="get-started-container">
            <div className="requirements-list glass-card">
              <h3>System Requirements</h3>
              <ul className="mt-4">
                <li><i className="fab fa-windows"></i> Windows 10 or Higher</li>
                <li><i className="fab fa-python"></i> Embedded Python 3.13+ (Included)</li>
                <li><i className="fab fa-chrome"></i> Google Chrome Installed</li>
                <li><i className="fas fa-wifi"></i> Active Internet Connection</li>
              </ul>
            </div>
            <div className="download-box glass-card">
              <h3>Download The Tool</h3>
              <p>Your download (~53MB) includes the main executable and all necessary utilities. No extra installation required.</p>
              <div className="download-buttons">
                <a href="#" className="btn"><i className="fas fa-download"></i> Download for Windows</a>
                <a href="https://youtu.be/XocfHnQS7BE" target="_blank" rel="noopener noreferrer" className="btn btn-outline"><i className="fab fa-youtube"></i> Watch Tutorial</a>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
};

export default SocialPage;