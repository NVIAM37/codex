import { useEffect, useRef, useState } from 'react';
import './ApplicationPage.css';
// Assuming your Footer component is in a 'components' folder
import React from 'react';
const ApplicationPage = () => {
  const canvasRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [faqOpenItems, setFaqOpenItems] = useState({});
  const [formData, setFormData] = useState({
    name: '', fname: '', email: '', phone: '', category: '',
    qualification: '', url: '', address: '', gender: ''
  });

  const slides = [
    'https://codepro.com.pk/images/courses/wordpress_course.png',
    'https://codepro.com.pk/images/courses/webandmobile_course.png'
  ];

  const faqItems = [
    { question: 'How do I register for the course?', answer: 'You can register online by filling out the form on this page. After registration, you will receive a link to join a WhatsApp group for further instructions.' },
    { question: 'What is the course fee?', answer: 'Course fee information is mentioned in the description of the announcement post. If you cannot find it, please contact the number provided on the post.' },
    { question: 'Is the course available online or onsite?', answer: 'Currently, all our courses are available onsite. We will explicitly mention if any courses are offered online in the future.' },
    { question: 'Will video recordings be provided?', answer: 'Yes, participants will receive both video recordings and lecture notes for their reference throughout the course.' },
    { question: 'What is the age limit for the course?', answer: 'The course is open to individuals aged 18 to 35 years. Exceptions may be considered on a case-by-case basis.' }
  ];

  useEffect(() => {
    const backgroundCleanupPromise = init3DBackground();
    initAnimations();
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => {
      clearInterval(slideInterval);
      backgroundCleanupPromise.then(cleanup => cleanup && cleanup());
    };
  }, []);

  const init3DBackground = async () => {
    try {
      const THREE = await import('three');
      const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js');
      const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js');
      const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js');

      const canvasContainer = canvasRef.current;
      if (!canvasContainer) return () => { };

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const initialCameraZ = 15;
      camera.position.z = initialCameraZ;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      canvasContainer.appendChild(renderer.domElement);

      const renderScene = new RenderPass(scene, camera);
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.3, 0.5, 0.1);

      const composer = new EffectComposer(renderer);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);

      const crystalGroup = new THREE.Group();
      const geometry = new THREE.IcosahedronGeometry(1, 0);
      const material = new THREE.MeshStandardMaterial({
        color: 0x89CFF0, emissive: 0x00d4ff, emissiveIntensity: 1.5,
        metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.8
      });

      const count = 300;
      for (let i = 0; i < count; i++) {
        const crystal = new THREE.Mesh(geometry, material);
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(50));
        crystal.position.set(x, y, z);
        crystal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        const scale = THREE.MathUtils.randFloat(0.1, 0.5);
        crystal.scale.set(scale, scale, scale);
        crystal.userData.rotationSpeed = { x: Math.random() * 0.003, y: Math.random() * 0.003 };
        crystalGroup.add(crystal);
      }
      scene.add(crystalGroup);

      scene.add(new THREE.AmbientLight(0xffffff, 0.1));

      const mouse = new THREE.Vector2();
      const handleMouseMove = (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', handleMouseMove);

      const clock = new THREE.Clock();
      const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        crystalGroup.position.x = Math.sin(elapsedTime * 0.05) * 2;
        crystalGroup.position.y = Math.cos(elapsedTime * 0.05) * 2;
        crystalGroup.children.forEach(c => { c.rotation.x += c.userData.rotationSpeed.x; c.rotation.y += c.userData.rotationSpeed.y; });
        if (window.gsap) {
          window.gsap.to(camera.rotation, { x: -mouse.y * 0.08, y: -mouse.x * 0.08, duration: 1.5, ease: 'power2.out' });
        }
        requestAnimationFrame(animate);
        composer.render();
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      const handleScroll = () => {
        const newZ = initialCameraZ - window.scrollY * 0.01;
        if (window.gsap) {
          window.gsap.to(camera.position, { z: Math.max(newZ, 5), duration: 1.5, ease: 'power3.out' });
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('mousemove', handleMouseMove);
        if (renderer) renderer.dispose();
        if (renderer?.domElement) canvasContainer.removeChild(renderer.domElement);
      };
    } catch (error) {
      console.log('Error initializing Three.js scene:', error);
      return () => { };
    }
  };

  const initAnimations = () => {
    if (!window.gsap) return;
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    gsap.from('.page-header', { opacity: 0, y: -50, duration: 1, ease: 'power3.out' });
    gsap.utils.toArray(['.form-section', '.image-section', '.faq-section', '.site-footer']).forEach(elem => {
      gsap.from(elem, {
        scrollTrigger: { trigger: elem, start: 'top 95%', toggleActions: 'play none none none' },
        opacity: 0, y: 50, duration: 1, ease: 'power3.out'
      });
    });
  };

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); console.log('Form submitted:', formData); };
  const toggleFAQ = (index) => setFaqOpenItems(prev => ({ ...prev, [index]: !prev[index] }));
  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="application-page">
      <div ref={canvasRef} id="canvas-container"></div>
      <div className="main-content-wrapper">
        <header className="page-header">
          <h1>Apply for Course or Internship</h1>
          <p>Registrations are open! Industry needs coders with cross-platform talent. Start today!</p>
        </header>

        <main className="content-grid">
          <section className="form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-inner-grid">
                <div className="form-group"><input required name="name" type="text" className="form-control" placeholder="Name" value={formData.name} onChange={handleInputChange} /><i className="fas fa-user"></i></div>
                <div className="form-group"><input required name="fname" type="text" className="form-control" placeholder="Father's Name" value={formData.fname} onChange={handleInputChange} /><i className="fas fa-user-shield"></i></div>
                <div className="form-group"><input required name="email" type="email" className="form-control" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} /><i className="fas fa-envelope"></i></div>
                <div className="form-group"><input required name="phone" type="tel" className="form-control" placeholder="WhatsApp number" value={formData.phone} onChange={handleInputChange} /><i className="fab fa-whatsapp"></i></div>
                <div className="form-group full-width"><select name="category" className="form-control" required value={formData.category} onChange={handleInputChange}><option value="" disabled>Applying For...</option><option value="learntouseai">Convert Ideas into Digital Assets Using AI</option><option value="webandmobile">Web and Mobile App Development (Diploma)</option><option value="wordpress">WordPress - Ecommerce</option><option value="python" disabled>Python for Automation and AI</option><option value="htmlcss" disabled>Frontend Design with HTML & CSS</option></select><i className="fas fa-laptop-code"></i></div>
                <div className="form-group full-width"><select required className="form-control" name="qualification" value={formData.qualification} onChange={handleInputChange} ><option value="" disabled>Highest Qualification...</option><option value="MS">Masters</option><option value="BS">Bachelors</option><option value="Intermediate">Intermediate</option><option value="Matric">Matric</option><option value="Other">Other</option></select><i className="fas fa-user-graduate"></i></div>
                <div className="form-group full-width"><input name="url" type="url" className="form-control" placeholder="Portfolio Link (e.g., GitHub, Behance) - Optional" value={formData.url} onChange={handleInputChange} /><i className="fas fa-link"></i></div>
                <div className="form-group full-width"><input required name="address" type="text" className="form-control" placeholder="Address" value={formData.address} onChange={handleInputChange} /><i className="fas fa-map-marker-alt"></i></div>
                <div className="gender-group"><p><i className="fas fa-venus-mars"></i> Gender:</p><label className="radio-container"><input required name="gender" type="radio" value="male" checked={formData.gender === 'male'} onChange={handleInputChange} /><span className="radio-custom"></span> Male</label><label className="radio-container"><input required name="gender" type="radio" value="female" checked={formData.gender === 'female'} onChange={handleInputChange} /><span className="radio-custom"></span> Female</label></div>
                <div className="form-group full-width"><input type="submit" className="submit-btn" value="Submit Application" /></div>
              </div>
            </form>
          </section>

          <section className="image-section">
            <div className="image-carousel">
              <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {slides.map((slide, index) => <img key={index} src={slide} alt={`Course ${index + 1}`} />)}
              </div>
              <button className="carousel-btn prev-btn" onClick={prevSlide}><i className="fas fa-chevron-left"></i></button>
              <button className="carousel-btn next-btn" onClick={nextSlide}><i className="fas fa-chevron-right"></i></button>
            </div>
          </section>
        </main>

        <section className="faq-section">
          <h2>Frequently Asked <span>Questions</span></h2>
          <div className="faq-list">
            {faqItems.map((item, index) => (
              <div key={index} className={`faq-item ${faqOpenItems[index] ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => toggleFAQ(index)}>{item.question}<span className="icon fas fa-plus"></span></div>
                <div className="faq-answer"><p>{item.answer}</p></div>
              </div>
            ))}
          </div>
        </section>


      </div>
    </div>
  );
};


const App = () => <ApplicationPage />;
export default App;