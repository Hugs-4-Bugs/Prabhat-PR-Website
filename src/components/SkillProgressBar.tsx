import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SkillProgressBarProps {
  name: string;
  percentage: number;
  delay?: number;
  color?: string;
  index?: number;
}

const SkillProgressBar = ({ name, percentage, delay = 0, index = 0 }: SkillProgressBarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const barFill = barFillRef.current;
    const percentEl = percentRef.current;
    const glow = glowRef.current;
    const dot = dotRef.current;
    if (!container || !barFill || !percentEl || !glow || !dot) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      // Slide in the entire row
      tl.fromTo(
        container,
        { opacity: 0, x: -60, skewX: -3 },
        { opacity: 1, x: 0, skewX: 0, duration: 0.6, delay: index * 0.12, ease: 'power3.out' }
      );

      // Animate bar fill width
      tl.fromTo(
        barFill,
        { width: '0%' },
        { width: `${percentage}%`, duration: 1.2, ease: 'power2.out' },
        '-=0.3'
      );

      // Count up the percentage number
      tl.fromTo(
        percentEl,
        { innerText: '0' },
        {
          innerText: percentage,
          duration: 1.2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: function () {
            const val = Math.round(gsap.getProperty(percentEl, 'innerText') as number);
            percentEl.textContent = `${val}%`;
          },
        },
        '<'
      );

      // Glow pulse on the fill end
      tl.fromTo(
        glow,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' },
        '-=0.4'
      );

      // Dot indicator bounce
      tl.fromTo(
        dot,
        { scale: 0 },
        { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' },
        '-=0.3'
      );

      // Continuous glow pulse
      gsap.to(glow, {
        opacity: 0.4,
        scale: 1.5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.12 + 1.5,
      });
    }, container);

    return () => ctx.revert();
  }, [percentage, index]);

  // Unique gradient per index
  const gradients = [
    'linear-gradient(90deg, #ff6b6b, #ee5a24)',
    'linear-gradient(90deg, #a855f7, #6366f1)',
    'linear-gradient(90deg, #06b6d4, #3b82f6)',
    'linear-gradient(90deg, #f59e0b, #ef4444)',
    'linear-gradient(90deg, #10b981, #06b6d4)',
    'linear-gradient(90deg, #ec4899, #a855f7)',
  ];

  const glowColors = [
    '#ee5a24',
    '#6366f1',
    '#3b82f6',
    '#ef4444',
    '#06b6d4',
    '#a855f7',
  ];

  const gradient = gradients[index % gradients.length];
  const glowColor = glowColors[index % glowColors.length];

  return (
    <div ref={containerRef} className="mb-7 opacity-0 group">
      {/* Label row */}
      <div className="flex justify-between items-center mb-2.5">
        <span className="font-display text-sm tracking-widest text-foreground/90 uppercase">
          {name}
        </span>
        <span
          ref={percentRef}
          className="font-display text-lg font-bold tracking-wider"
          style={{ color: glowColor }}
        >
          0%
        </span>
      </div>

      {/* Bar track */}
      <div className="relative h-3 bg-foreground/5 rounded-full overflow-visible border border-foreground/10">
        {/* Filled bar */}
        <div
          ref={barFillRef}
          className="h-full rounded-full relative"
          style={{
            background: gradient,
            width: '0%',
            boxShadow: `0 0 12px ${glowColor}40, 0 0 4px ${glowColor}20`,
          }}
        >
          {/* Shimmer sweep */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
              animation: 'shimmer 2.5s ease-in-out infinite',
              animationDelay: `${index * 0.3}s`,
            }}
          />
        </div>

        {/* Glow orb at the end of the bar */}
        <div
          ref={glowRef}
          className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: 20,
            height: 20,
            right: `${100 - percentage}%`,
            marginRight: -10,
            background: `radial-gradient(circle, ${glowColor}80, transparent 70%)`,
            opacity: 0,
          }}
        />

        {/* End dot */}
        <div
          ref={dotRef}
          className="absolute top-1/2 -translate-y-1/2 rounded-full border-2 border-background"
          style={{
            width: 14,
            height: 14,
            left: `${percentage}%`,
            marginLeft: -7,
            background: gradient,
            boxShadow: `0 0 8px ${glowColor}60`,
            scale: 0,
          }}
        />
      </div>
    </div>
  );
};

export default SkillProgressBar;