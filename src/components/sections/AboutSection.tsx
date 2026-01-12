import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ParallaxSection from '@/components/ParallaxSection';
import forestValley from '@/assets/forest-valley.jpg';

const stats = [
  { number: '2+', label: 'Years Experience' },
  { number: '4+', label: 'Years Trading' },
  { number: '1M+', label: 'Requests Handled' },
  { number: '99.9%', label: 'System Uptime' },
];

const interests = ['AI', 'Full Stack Development', 'Open Source', 'System Design', 'Trading', 'Innovation'];

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
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
          {/* Left Column - Text Content */}
          <div ref={contentRef}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-body text-xs tracking-[0.15em] sm:tracking-[0.2em] text-primary-foreground/60 uppercase mb-4 block"
            >
              About Me
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary-foreground tracking-[0.1em] sm:tracking-[0.15em] mb-6 sm:mb-8"
            >
              Prabhat Kumar
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-body text-primary-foreground/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6"
            >
              Hi! I'm a passionate Java Software Developer driven by a vision to merge intelligence with innovation. 
              I dive deep into AI, web technologies, and system design - crafting software that solves real-world problems.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-body text-primary-foreground/70 leading-relaxed mb-6"
            >
              With love for Java, Spring Boot, React, and Machine Learning, I thrive on crafting scalable, 
              high-performance apps. I also have 4+ years of trading experience across Stocks, Crypto, 
              Forex & Derivatives.
            </motion.p>

            {/* Interests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {interests.map((interest, index) => (
                <motion.span
                  key={interest}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  className="font-body text-xs px-3 py-1.5 bg-accent/20 text-primary-foreground/80 rounded-full"
                >
                  {interest}
                </motion.span>
              ))}
            </motion.div>

            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              href="#contact"
              className="btn-montfort text-primary-foreground border-primary-foreground/30"
              data-cursor-hover
            >
              <span>Get in Touch</span>
              <span>→</span>
            </motion.a>
          </div>

          {/* Right Column - Stats */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className="text-center lg:text-left"
              >
                <div className="font-display text-4xl sm:text-5xl md:text-6xl text-primary-foreground mb-2">
                  {stat.number}
                </div>
                <div className="font-body text-xs sm:text-sm tracking-wider text-primary-foreground/60 uppercase">
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
