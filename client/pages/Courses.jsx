import React, { useEffect, useRef } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "./Courses.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const coursesData = [
  {
    title: "HTML Full Course",
    description:
      "Build the foundation of the web with structured and semantic code.",
    imgSrc: "https://codepro.com.pk/images/html-course.jpg",
    imgAlt: "HTML Icon",
    link: "/courses/html",
  },
  {
    title: "CSS Full Course",
    description:
      "Design beautiful, responsive websites and bring your visions to life.",
    imgSrc: "https://codepro.com.pk/images/CSS.jpg",
    imgAlt: "CSS Icon",
    link: "/courses/css",
  },
  {
    title: "Bootstrap Course",
    description:
      "Master responsive design and build professional layouts effortlessly.",
    imgSrc: "https://codepro.com.pk/images/bootstrap.jpg",
    imgAlt: "Bootstrap Icon",
    link: "/courses/bootstrap",
  },
  {
    title: "JavaScript Course",
    description:
      "From basics to advanced, build dynamic and interactive web apps.",
    imgSrc: "https://codepro.com.pk/images/javascript.jpg",
    imgAlt: "JS Icon",
    link: "/courses/javascript",
  },
];

const CoursesPage = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let waves = [];
    const scrollSpeed = { value: 1 };
    let animationFrameId;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    function Wave(options) {
      this.options = options || {};
      this.progress = Math.random() * Math.PI * 2;
      this.color = this.options.color || "#00d4ff";
      this.amplitude = this.options.amplitude || 40;
      this.wavelength = this.options.wavelength || 400;
      this.speed = this.options.speed || 0.02;
      this.baseY = this.options.y || height / 2;
      this.y = this.baseY;
      this.lineWidth = this.options.lineWidth || 2;
      this.tick = Math.random() * 1000;
    }

    Wave.prototype.draw = function () {
      this.tick += 0.005;
      const verticalOffset = Math.sin(this.tick) * (this.amplitude * 0.2);
      this.y = this.baseY + verticalOffset;

      ctx.beginPath();
      ctx.moveTo(0, this.y);
      for (let x = 0; x < width; x++) {
        const y =
          Math.sin((x / this.wavelength) * Math.PI * 2 + this.progress) *
          this.amplitude +
          this.y;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.lineWidth;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.closePath();

      this.progress += this.speed * scrollSpeed.value;
    };

    waves.push(
      new Wave({
        color: "#00d4ff",
        y: height * 0.4,
        speed: 0.01,
        amplitude: 50,
        wavelength: 600,
        lineWidth: 2.5,
      }),
    );
    waves.push(
      new Wave({
        color: "#00aefd",
        y: height * 0.5,
        speed: 0.015,
        amplitude: 60,
        wavelength: 500,
        lineWidth: 2,
      }),
    );
    waves.push(
      new Wave({
        color: "#00d4ff",
        y: height * 0.6,
        speed: 0.008,
        amplitude: 30,
        wavelength: 700,
        lineWidth: 1.5,
      }),
    );
    waves.push(
      new Wave({
        color: "rgba(0, 174, 253, 0.5)",
        y: height * 0.45,
        speed: 0.02,
        amplitude: 40,
        wavelength: 400,
        lineWidth: 1,
      }),
    );
    waves.push(
      new Wave({
        color: "rgba(0, 212, 255, 0.7)",
        y: height * 0.55,
        speed: 0.012,
        amplitude: 70,
        wavelength: 550,
        lineWidth: 1,
      }),
    );
    waves.push(
      new Wave({
        color: "rgba(0, 174, 253, 0.8)",
        y: height * 0.65,
        speed: 0.005,
        amplitude: 25,
        wavelength: 800,
        lineWidth: 0.5,
      }),
    );

    function animate() {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";

      for (let wave of waves) {
        wave.draw();
      }
    }

    gsap.ticker.add(animate);

    const st = ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity() / 500);
        gsap.to(scrollSpeed, {
          value: 1 + velocity * 4,
          duration: 0.5,
          ease: "power2.out",
        });
      },
    });

    const scrollEndHandler = () => {
      gsap.to(scrollSpeed, { value: 1, duration: 0.5, ease: "power2.out" });
    };
    ScrollTrigger.addEventListener("scrollEnd", scrollEndHandler);

    gsap.to("#crystal", {
      rotationY: 360,
      rotationX: 36,
      y: -20,
      duration: 25,
      ease: "none",
      repeat: -1,
    });
    gsap.from(".hero-title-wrapper", {
      duration: 1,
      y: 30,
      opacity: 0,
      ease: "power3.out",
      delay: 0.5,
    });
    gsap.from(
      ".crystal",
      { duration: 1.5, scale: 0, opacity: 0, ease: "power3.out" },
      "-=1",
    );

    gsap.utils.toArray(".course-card-wrapper").forEach((card) => {
      gsap.fromTo(
        card,
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.removeEventListener("scrollEnd", scrollEndHandler);
      gsap.ticker.remove(animate);
      if (st) st.kill();
      gsap.killTweensOf(
        "#crystal, .hero-title-wrapper, .crystal, .course-card-wrapper, .scrollSpeed",
      );
    };
  }, []);

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>CODEX Courses | The Future of Learning</title>
          <link
            rel="icon"
            type="image/x-icon"
            href="/logo.jpg"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap"
            rel="stylesheet"
          />
        </Helmet>


        <canvas id="wave-canvas" ref={canvasRef}></canvas>

        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-title-wrapper">
              <h1 id="hero-title">A New Dimension of Learning with CODEX</h1>
            </div>
          </div>
          <div className="hero-3d-container">
            <div className="crystal" id="crystal">
              <div className="crystal-face front"></div>
              <div className="crystal-face back"></div>
              <div className="crystal-face right"></div>
              <div className="crystal-face left"></div>
              <div className="crystal-face top"></div>
              <div className="crystal-face bottom"></div>
            </div>
          </div>
        </section>

        <div id="courses" className="course-container">
          <h2 className="section-title">Explore Our Free Courses</h2>
          <div className="courses-grid">
            {coursesData.map((course, index) => (
              <div className="course-card-wrapper" key={index}>
                <div className="course-card">
                  <div className="course-icon">
                    <img src={course.imgSrc} alt={course.imgAlt} />
                  </div>
                  <div>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <a href={course.link} className="view-course-btn">
                      Start Learning
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </HelmetProvider>
  );
};

export default CoursesPage;
