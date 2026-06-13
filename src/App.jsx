import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import agroLogo from './assets/AgroFarmy Logo White.svg';
import agroIcon from './assets/Icon.svg';

// Custom inline SVG icons
const SendIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="22" x2="11" y1="2" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowRightIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="5" x2="19" y1="12" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// High-end ambient dust particle canvas (Very slow, 90% opacity reduction for premium look)
const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const particleCount = 20; // Drastically reduced for subtle elegance

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5; // Tiny specks
        this.speedY = -(Math.random() * 0.15 + 0.05); // Slow upward float
        this.speedX = Math.random() * 0.1 - 0.05; // Almost static drift
        this.opacity = Math.random() * 0.2 + 0.05; // Very dim
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.y < -10) {
          this.reset();
          this.y = height + 10;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      const p = new Particle();
      p.y = Math.random() * height;
      particles.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />;
};

// Leaf SVG component for organic movement
const LeafIcon = ({ className, color = '#A1B200' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 22C2 22 6 18 12 17C18 16 22 10 22 2C22 2 14 2 9 8C4 14 2 22 2 22Z"
      fill={color}
      fillOpacity="0.08"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 22C6 18 12 14 22 2"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity="0.25"
    />
  </svg>
);

// 3D-like floating leaves container (Ultra-small, subtle organic specks)
const FloatingLeaves = () => {
  const leaves = Array.from({ length: 10 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {leaves.map((_, i) => {
        const duration = 30 + i * 6;
        const delay = i * 2.5;
        const startX = `${5 + i * 10}%`;
        
        // Random leaf size ranging from 6px to 12px (extremely small/delicate)
        const size = 6 + (i % 3) * 3; 
        
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ 
              left: startX, 
              top: '110%',
              width: size,
              height: size
            }}
            animate={{
              y: ['0vh', '-120vh'],
              x: ['0px', `${(i % 2 === 0 ? 1 : -1) * (15 + i * 5)}px`],
              rotate: [0, 360],
              rotateX: [0, 180],
              rotateY: [0, 360],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: 'linear',
              delay: delay,
            }}
          >
            <LeafIcon className="w-full h-full opacity-40" />
          </motion.div>
        );
      })}
    </div>
  );
};

// GSAP Magnetic Button wrapper
const MagneticButton = ({ children, className, onClick, type = "button", disabled = false }) => {
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const button = buttonRef.current;
    if (!container || !button || disabled) return;

    let isHovered = false;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < 80) {
        isHovered = true;
        gsap.to(button, {
          x: distanceX * 0.35,
          y: distanceY * 0.35,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else if (isHovered) {
        isHovered = false;
        gsap.to(button, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)',
        });
      }
    };

    const handleMouseLeave = () => {
      isHovered = false;
      gsap.to(button, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [disabled]);

  return (
    <div ref={containerRef} className="w-full">
      <button
        ref={buttonRef}
        type={type}
        className={className}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
};

export default function App() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(() => {
    return localStorage.getItem('agrofarmy_waitlist_submitted') === 'true';
  });
  const [error, setError] = useState('');

  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const cursorRef = useRef(null);
  const glowRef = useRef(null);

  // Smooth custom mouse glow, logo cursor, & Parallax interactions
  useEffect(() => {
    const cursor = cursorRef.current;
    const glow = glowRef.current;
    const container = containerRef.current;
    const bg = bgRef.current;
    
    if (!container) return;

    // Center the custom elements on the pointer coordinates
    gsap.set([cursor, glow], { xPercent: -50, yPercent: -50 });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Snappy cursor tracking
      if (cursor) {
        gsap.to(cursor, {
          x: clientX,
          y: clientY,
          duration: 0.1,
          ease: 'power2.out',
        });
      }

      // Smooth ambient glow tracking
      if (glow) {
        gsap.to(glow, {
          x: clientX,
          y: clientY,
          duration: 0.6,
          ease: 'power1.out',
        });
      }

      // Detect hover state over interactive elements to scale/rotate logo cursor
      if (cursor) {
        const isInteractive = e.target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');
        if (isInteractive) {
          gsap.to(cursor, {
            scale: 1.4,
            rotation: 15,
            duration: 0.3,
            overwrite: 'auto',
          });
        } else {
          gsap.to(cursor, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            overwrite: 'auto',
          });
        }
      }

      // Subtle background parallax shifts
      const xOffset = (clientX / innerWidth) - 0.5;
      const yOffset = (clientY / innerHeight) - 0.5;

      if (bg) {
        gsap.to(bg, {
          x: xOffset * -10,
          y: yOffset * -10,
          duration: 1,
          ease: 'power1.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Waitlist submission handler
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    setError('');
    setIsSubmitted(true);
    localStorage.setItem('agrofarmy_waitlist_submitted', 'true');
    localStorage.setItem('agrofarmy_waitlist_email', email);
    setTimeout(() => {
      setEmail('');
    }, 1000);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen w-full flex flex-col justify-between items-center px-6 py-6 md:px-16 md:py-10 bg-[#080605]"
    >
      {/* Custom Mouse Glow (Ambient Background) */}
      <div ref={glowRef} className="cursor-glow hidden md:block" style={{ top: 0, left: 0 }} />

      {/* Custom Interactive Logo Cursor */}
      <div ref={cursorRef} className="custom-cursor hidden md:block" style={{ top: 0, left: 0 }}>
        <img src={agroIcon} alt="Custom Cursor" className="w-full h-full object-contain pointer-events-none" />
      </div>

      {/* Background container wrapper to isolate and clip background assets */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Cinematic background with blur depth */}
        <div 
          ref={bgRef}
          className="absolute inset-0 bg-cover bg-center select-none scale-102"
          style={{ 
            backgroundImage: `url('/farm-bg.png')`,
          }}
        />

        {/* Background gradients and overlays */}
        <div className="absolute inset-0 bg-[#080605]/75 backdrop-blur-[1px]" />
        
        {/* Subtle organic radial gradient blobs */}
        <div className="absolute top-[10%] left-[-10%] w-[60vw] h-[60vw] bg-brand-brown/5 rounded-full bg-blob" />
        <div className="absolute bottom-[5%] right-[-10%] w-[50vw] h-[50vw] bg-brand-green/5 rounded-full bg-blob" />
        
        {/* Bottom vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080605] via-[#080605]/20 to-transparent" />

        {/* Particle Canvas & Leaves floating */}
        <ParticleCanvas />
        <FloatingLeaves />
      </div>

      {/* Header */}
      <header className="relative w-full flex justify-center items-center z-20">
        <motion.div 
          className="flex items-center space-x-2.5 cursor-pointer group"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={agroLogo} alt="Agro Farmy" className="h-12 sm:h-14 w-auto" />
        </motion.div>
      </header>

      {/* Header Divider Line */}
      <div className="w-full h-[1px] bg-white/5 relative z-20 mt-6" />

      {/* Main Content Area */}
      <main className="relative w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center my-auto z-20 pt-8 pb-10">
        
        {/* Left Column: Premium Typography & Branding */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* Tagline Badge */}
          <motion.div
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-brand-green/20 bg-brand-green/5 text-brand-green mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
              The Technology Framework for Soil
            </span>
          </motion.div>

          {/* Main Title */}
          <div className="overflow-hidden py-1">
            <motion.h1 
              className="text-gradient-silver text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none uppercase font-cmu"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              Coming Soon
            </motion.h1>
          </div>

          {/* Core Subtitle */}
          <motion.p
            className="text-neutral-400 text-base sm:text-lg font-light mt-6 max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="text-white font-medium block mb-2 text-lg sm:text-xl">
              Reimagining agriculture for a finite planet.
            </span>
            Agro Farmy is building the infrastructure for the next green revolution. 
            By integrating real-time soil telemetry, satellite crop analytics, and organic 
            soil regeneration science, we unlock sustainable yield increases at scale.
          </motion.p>

          {/* Value Pillars */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-10 pt-8 border-t border-white/5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {[
              { num: '01', title: 'Smart Telemetry', desc: 'Real-time soil microbial metrics.' },
              { num: '02', title: 'Soil Restoration', desc: 'Premium custom organic substrates.' },
              { num: '03', title: 'Predictive Analytics', desc: 'Weather & disease machine learning.' }
            ].map((pillar, idx) => (
              <div key={idx} className="flex flex-col space-y-1">
                <span className="font-mono text-xs text-brand-green font-semibold">{pillar.num}</span>
                <h3 className="text-white text-sm font-bold tracking-wide">{pillar.title}</h3>
                <p className="text-neutral-500 text-xs leading-normal">{pillar.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Floating Operations Panel */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <motion.div
            className="glass-panel w-full max-w-[420px] rounded-3xl p-8 border border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            {/* Soft decorative glow */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-brand-green/10 rounded-full blur-2xl pointer-events-none" />



            {/* Waitlist Call To Action */}
            <div className="space-y-4">
              <div>
                <h3 className="text-white text-sm font-bold tracking-wide">Request Private Invite</h3>
                <p className="text-neutral-400 text-xs mt-1 leading-normal">
                  Early beta spots are strictly limited. Enter your email to apply for first-wave access.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubscribe}
                    className="space-y-3 pt-2"
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your professional email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                        }}
                        className="w-full px-4 py-3.5 rounded-xl text-white outline-none glass-input-premium placeholder-neutral-600 text-xs font-sans tracking-wide"
                      />
                      {error && (
                        <motion.span
                          className="absolute -bottom-5 left-1 text-red-400 text-[10px] font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {error}
                        </motion.span>
                      )}
                    </div>

                    <MagneticButton
                      type="submit"
                      className="w-full py-3.5 bg-brand-green text-neutral-900 font-bold rounded-xl text-[10px] tracking-widest uppercase transition-colors duration-300 flex items-center justify-center space-x-2 shrink-0 border border-brand-green/20 glow-green-subtle glow-green-subtle-hover mt-3"
                    >
                      <span>Request Invitation</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </MagneticButton>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-3.5 py-4 px-5 rounded-2xl border border-brand-green/20 bg-brand-green/5 shadow-2xl mt-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-green flex items-center justify-center shrink-0">
                      <CheckIcon className="w-4 h-4 text-neutral-900" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-white font-bold text-xs tracking-wider uppercase">Application Received</h4>
                      <p className="text-neutral-400 text-[10px] mt-0.5">We will review your access request shortly.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full flex flex-col sm:flex-row justify-between items-center gap-4 z-20 pt-6 border-t border-white/5 text-[11px] font-medium tracking-wide text-neutral-500 font-sans">
        
        <div className="text-center sm:text-left">
          <span>&copy; 2026 Agro Farmy Inc. </span>
          <span className="hidden sm:inline text-neutral-600 font-normal ml-1">|</span>
          <span className="block sm:inline sm:ml-2 text-neutral-400 font-normal">
            Growing Agriculture Through Innovation
          </span>
        </div>

        <div className="flex space-x-6">
          {['LinkedIn', 'X', 'Instagram', 'Contact'].map((item, idx) => (
            <a
              key={idx}
              href="#"
              className="hover:text-brand-green transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}