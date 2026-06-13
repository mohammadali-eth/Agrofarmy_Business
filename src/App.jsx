import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import agroLogo from './assets/Agro Farmy Logo.svg';

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
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || disabled) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const distanceX = clientX - buttonCenterX;
      const distanceY = clientY - buttonCenterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < 80) {
        gsap.to(button, {
          x: distanceX * 0.25,
          y: distanceY * 0.25,
          scale: 1.01,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
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
      gsap.to(button, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [disabled]);

  return (
    <button
      ref={buttonRef}
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default function App() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  // Target date exactly 135 days from now
  const [timeLeft, setTimeLeft] = useState({ days: 135, hours: 12, minutes: 45, seconds: 30 });

  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const cursorRef = useRef(null);

  // Countdown timer logic
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 135);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Smooth custom mouse glow & Parallax interactions
  useEffect(() => {
    const cursor = cursorRef.current;
    const container = containerRef.current;
    const bg = bgRef.current;
    
    if (!container) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Update custom cursor glow position
      if (cursor) {
        gsap.to(cursor, {
          x: clientX,
          y: clientY,
          duration: 0.5,
          ease: 'power2.out',
        });
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
    setTimeout(() => {
      setEmail('');
    }, 1000);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen w-full flex flex-col justify-between items-center px-6 py-6 md:px-16 md:py-10 overflow-hidden bg-[#080605]"
    >
      {/* Custom Mouse Glow cursor */}
      <div ref={cursorRef} className="cursor-glow hidden md:block" style={{ top: 0, left: 0 }} />

      {/* Cinematic background with blur depth */}
      <div 
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center select-none pointer-events-none scale-102 z-0"
        style={{ 
          backgroundImage: `url('/farm-bg.png')`,
        }}
      />

      {/* Background gradients and overlays */}
      <div className="absolute inset-0 bg-[#080605]/75 backdrop-blur-[1px] z-0" />
      
      {/* Subtle organic radial gradient blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[60vw] h-[60vw] bg-brand-brown/5 rounded-full bg-blob pointer-events-none z-0" />
      <div className="absolute bottom-[5%] right-[-10%] w-[50vw] h-[50vw] bg-brand-green/5 rounded-full bg-blob pointer-events-none z-0" />
      
      {/* Bottom vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080605] via-[#080605]/20 to-transparent z-0" />

      {/* Particle Canvas & Leaves floating */}
      <ParticleCanvas />
      <FloatingLeaves />

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

        {/* Top-right Status badge */}
        {/* <motion.div
          className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full border border-white/5 bg-white/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
          <span className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
            Alpha 1.0 Release
          </span>
        </motion.div> */}
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

            {/* Panel Title / Telemetry Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                Launch Telemetry
              </span>
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                <span className="text-[9px] font-mono text-brand-green uppercase tracking-wide">
                  Live
                </span>
              </div>
            </div>

            {/* Segmented Monospace Countdown */}
            <div className="flex justify-between items-center segment-font bg-white/2 rounded-2xl p-5 border border-white/5 mb-8">
              {[
                { val: timeLeft.days, label: 'D' },
                { val: timeLeft.hours, label: 'H' },
                { val: timeLeft.minutes, label: 'M' },
                { val: timeLeft.seconds, label: 'S' }
              ].map((item, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] font-sans font-medium text-neutral-500 tracking-wider uppercase mt-1">
                      {item.label}
                    </span>
                  </div>
                  {idx < 3 && (
                    <span className="text-xl font-bold text-neutral-700 select-none pb-4">:</span>
                  )}
                </React.Fragment>
              ))}
            </div>

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
                      className="w-full py-3.5 bg-brand-green text-neutral-900 font-bold rounded-xl text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 shrink-0 border border-brand-green/20 glow-green-subtle glow-green-subtle-hover mt-3"
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
