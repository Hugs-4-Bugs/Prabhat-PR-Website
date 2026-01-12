import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ParallaxSection from '@/components/ParallaxSection';
import forestValley from '@/assets/forest-valley.jpg';

const stats = [
  { number: '50+', label: 'Projects Completed' },
  { number: '12', label: 'Years Experience' },
  { number: '30+', label: 'Global Clients' },
  { number: '15', label: 'Awards Won' },
];

const AboutSection = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: '-10%' });

  return (
    <ParallaxSection
      id="about"
      backgroundImage={forestValley}
      overlayOpacity={0.75}
      backgroundSpeed={0.2}
      zoomEffect={false}
    >
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column - Text Content */}
          <div ref={contentRef}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-body text-xs tracking-[0.3em] text-primary-foreground/60 uppercase mb-4 block"
            >
              About Us
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-primary-foreground tracking-wider mb-8"
            >
              Crafting Digital Excellence
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-body text-primary-foreground/80 text-lg leading-relaxed mb-6"
            >
              We are a collective of designers, developers, and dreamers dedicated to pushing 
              the boundaries of digital creativity. Our work spans across brand identity, 
              web experiences, and interactive installations.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-body text-primary-foreground/70 leading-relaxed mb-10"
            >
              Every project begins with a story, and we're here to help you tell yours 
              in the most compelling way possible. From concept to execution, we blend 
              strategy with artistry to create experiences that resonate.
            </motion.p>

            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              href="#contact"
              className="btn-montfort text-primary-foreground border-primary-foreground/30"
              data-cursor-hover
            >
              <span>Get in Touch</span>
              <span>→</span>
            </motion.a>
          </div>

          {/* Right Column - Stats */}
          <div className="grid grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className="text-center lg:text-left"
              >
                <div className="font-display text-5xl md:text-6xl text-primary-foreground mb-2">
                  {stat.number}
                </div>
                <div className="font-body text-sm tracking-wider text-primary-foreground/60 uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </ParallaxSection>
  );
};

export default AboutSection;
