import { motion } from 'framer-motion';
import ParallaxSection from '@/components/ParallaxSection';
import AnimatedText from '@/components/AnimatedText';
import ScrollIndicator from '@/components/ScrollIndicator';
import heroMountain from '@/assets/hero-mountain.jpg';

const HeroSection = () => {
  return (
    <ParallaxSection
      id="home"
      backgroundImage={heroMountain}
      overlayOpacity={0.4}
      backgroundSpeed={0.4}
      zoomEffect={true}
    >
      <div className="container mx-auto px-6 text-center">
        {/* Main title with letter spacing */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8"
        >
          <h1 className="hero-title-large text-5xl md:text-7xl lg:text-9xl text-primary-foreground">
            M O N T F O R T
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12"
        >
          <p className="font-body text-sm md:text-base tracking-[0.3em] text-primary-foreground/80 uppercase">
            Digital Experiences & Creative Design
          </p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <p className="font-display text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
            We craft immersive digital journeys that blend artistry with technology,
            creating experiences that captivate and inspire.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <a
            href="#projects"
            className="btn-montfort text-primary-foreground border-primary-foreground/50 hover:border-primary-foreground"
            data-cursor-hover
          >
            <span>Explore Work</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </div>

      <ScrollIndicator />
    </ParallaxSection>
  );
};

export default HeroSection;
