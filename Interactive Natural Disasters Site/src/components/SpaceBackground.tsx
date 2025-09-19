import { useEffect, useRef } from 'react';

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      brightness: number;
      twinklePhase: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      stars.length = 0;
      const numStars = Math.floor((canvas.width * canvas.height) / 3000);
      
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.3 + 0.1,
          brightness: Math.random() * 0.8 + 0.2,
          twinklePhase: Math.random() * Math.PI * 2
        });
      }
    };

    const drawStars = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)'); // slate-900 with opacity
      gradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.9)'); // slate-800 with opacity
      gradient.addColorStop(1, 'rgba(51, 65, 85, 0.8)'); // slate-700 with opacity
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((star, index) => {
        // Update twinkle
        star.twinklePhase += 0.02;
        const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
        const opacity = star.brightness * (0.3 + twinkle * 0.7);

        // Slow drift
        star.x += star.speed * Math.sin(time * 0.0001 + index);
        star.y += star.speed * Math.cos(time * 0.0001 + index);

        // Wrap around edges
        if (star.x > canvas.width) star.x = 0;
        if (star.x < 0) star.x = canvas.width;
        if (star.y > canvas.height) star.y = 0;
        if (star.y < 0) star.y = canvas.height;

        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Create glow effect for larger stars
        if (star.size > 1.5) {
          const glowGradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
          );
          glowGradient.addColorStop(0, 'rgba(147, 197, 253, 0.8)'); // blue-300
          glowGradient.addColorStop(0.5, 'rgba(147, 197, 253, 0.3)');
          glowGradient.addColorStop(1, 'rgba(147, 197, 253, 0)');
          
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw star
        ctx.fillStyle = star.size > 1.2 ? '#e0e7ff' : '#cbd5e1'; // indigo-100 or slate-300
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Add sparkle effect for bright stars
        if (star.size > 1.8 && twinkle > 0.7) {
          ctx.strokeStyle = 'rgba(147, 197, 253, 0.6)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - star.size * 2, star.y);
          ctx.lineTo(star.x + star.size * 2, star.y);
          ctx.moveTo(star.x, star.y - star.size * 2);
          ctx.lineTo(star.x, star.y + star.size * 2);
          ctx.stroke();
        }

        ctx.restore();
      });

      // Add some nebula-like effects
      const nebulaGradient = ctx.createRadialGradient(
        canvas.width * 0.8, canvas.height * 0.3, 0,
        canvas.width * 0.8, canvas.height * 0.3, canvas.width * 0.4
      );
      nebulaGradient.addColorStop(0, 'rgba(99, 102, 241, 0.03)'); // indigo-500
      nebulaGradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.02)'); // purple-600
      nebulaGradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
      
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nebula2Gradient = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.7, 0,
        canvas.width * 0.2, canvas.height * 0.7, canvas.width * 0.3
      );
      nebula2Gradient.addColorStop(0, 'rgba(59, 130, 246, 0.02)'); // blue-500
      nebula2Gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.015)'); // emerald-500
      nebula2Gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      
      ctx.fillStyle = nebula2Gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = (time: number) => {
      drawStars(time);
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createStars();
    animate(0);

    const handleResize = () => {
      resizeCanvas();
      createStars();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}
    />
  );
}