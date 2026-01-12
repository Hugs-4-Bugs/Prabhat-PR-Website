import { useRef, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PinnedSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  pinDuration?: number;
  backgroundImage?: string;
  overlayOpacity?: number;
}

const PinnedSection = ({
  children,
  id,
  className = '',
  pinDuration = 1,
  backgroundImage,
  overlayOpacity = 0.6,
}: PinnedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const bg = bgRef.current;

    if (!section || !content) return;

    // Create ScrollTrigger for pinning
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${window.innerHeight * pinDuration}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Scale and fade content based on scroll progress
        gsap.to(content, {
          scale: 1 + progress * 0.1,
          opacity: 1 - progress * 0.3,
          duration: 0,
        });

        // Zoom background
        if (bg) {
          gsap.to(bg, {
            scale: 1.1 + progress * 0.2,
            duration: 0,
          });
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [pinDuration]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative min-h-screen overflow-hidden ${className}`}
    >
      {/* Background with zoom effect */}
      {backgroundImage && (
        <>
          <div
            ref={bgRef}
            className="absolute inset-[-10%] bg-cover bg-center will-change-transform"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, 
                hsl(205 52% 15% / ${overlayOpacity * 0.9}) 0%, 
                hsl(205 52% 20% / ${overlayOpacity}) 50%, 
                hsl(205 52% 15% / ${overlayOpacity * 0.8}) 100%)`,
            }}
          />
        </>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex items-center justify-center min-h-screen will-change-transform"
      >
        {children}
      </div>
    </section>
  );
};

export default PinnedSection;
