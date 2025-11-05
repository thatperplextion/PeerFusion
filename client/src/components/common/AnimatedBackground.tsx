"use client";

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Enhanced Particle class with more effects
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      baseColor: string;
      opacity: number;
      opacitySpeed: number;
      rotation: number;
      rotationSpeed: number;
      pulsePhase: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.size = Math.random() * 200 + 100;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        
        // Enhanced dark color palette with subtle teal hints
        const colors = [
          'rgba(40, 40, 45, 0.18)',      // Dark grey
          'rgba(35, 45, 50, 0.16)',      // Dark slate blue
          'rgba(30, 35, 40, 0.2)',       // Charcoal
          'rgba(25, 30, 35, 0.17)',      // Deep grey
          'rgba(20, 35, 40, 0.19)',      // Dark teal hint
          'rgba(45, 50, 55, 0.15)',      // Medium grey
        ];
        this.baseColor = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.2;
        this.opacitySpeed = (Math.random() - 0.5) * 0.01;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.002;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Smooth edge wrapping with fade
        const width = canvas?.width || window.innerWidth;
        const height = canvas?.height || window.innerHeight;
        
        if (this.x > width + this.size) this.x = -this.size;
        if (this.x < -this.size) this.x = width + this.size;
        if (this.y > height + this.size) this.y = -this.size;
        if (this.y < -this.size) this.y = height + this.size;

        // Enhanced pulsing opacity
        this.opacity += this.opacitySpeed;
        if (this.opacity > 0.6 || this.opacity < 0.1) this.opacitySpeed *= -1;

        // Rotation for more dynamic effect
        this.rotation += this.rotationSpeed;
        this.pulsePhase += 0.02;
      }

      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Create multi-layer gradient for depth
        const pulse = Math.sin(this.pulsePhase) * 0.2 + 0.8;
        const currentSize = this.size * pulse;
        
        // Outer glow
        const outerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize * 1.2);
        outerGradient.addColorStop(0, this.baseColor.replace(/[\d.]+\)$/g, `${this.opacity * 0.8})`));
        outerGradient.addColorStop(0.5, this.baseColor.replace(/[\d.]+\)$/g, `${this.opacity * 0.4})`));
        outerGradient.addColorStop(1, this.baseColor.replace(/[\d.]+\)$/g, '0)'));
        
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize * 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner core with brighter center
        const innerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize * 0.6);
        innerGradient.addColorStop(0, this.baseColor.replace(/[\d.]+\)$/g, `${this.opacity * 1.2})`));
        innerGradient.addColorStop(0.7, this.baseColor.replace(/[\d.]+\)$/g, `${this.opacity * 0.6})`));
        innerGradient.addColorStop(1, this.baseColor.replace(/[\d.]+\)$/g, '0)'));
        
        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    // Connecting lines between nearby particles
    class Connection {
      static draw(p1: Particle, p2: Particle) {
        if (!ctx) return;
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 400;
        
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.15;
          
          ctx.save();
          ctx.strokeStyle = `rgba(16, 163, 127, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // Create more particles for richer effect
    const particles: Particle[] = [];
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop with enhanced effects
    let animationId: number;
    const animate = () => {
      // Fade effect instead of clear for trails
      ctx.fillStyle = 'rgba(33, 33, 33, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          Connection.draw(particles[i], particles[j]);
        }
      }

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
      style={{ background: 'transparent' }}
    />
  );
}
