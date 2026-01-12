import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ParallaxSection from '@/components/ParallaxSection';
import oceanIslands from '@/assets/ocean-islands.jpg';

const ContactSection = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: '-10%' });

  return (
    <ParallaxSection
      id="contact"
      backgroundImage={oceanIslands}
      overlayOpacity={0.7}
      backgroundSpeed={0.2}
      zoomEffect={false}
    >
      <div className="container mx-auto px-6 py-20">
        <div ref={contentRef} className="max-w-3xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-body text-xs tracking-[0.3em] text-primary-foreground/60 uppercase mb-4 block"
          >
            Get in Touch
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl text-primary-foreground tracking-wider mb-8"
          >
            Let's Create Together
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-primary-foreground/80 text-lg mb-12 max-w-xl mx-auto"
          >
            Have a project in mind? We'd love to hear about it. Let's discuss how 
            we can bring your vision to life.
          </motion.p>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-12"
          >
            <a
              href="mailto:hello@montfort.com"
              className="font-display text-2xl md:text-3xl text-primary-foreground hover:text-accent transition-colors duration-300"
              data-cursor-hover
            >
              hello@montfort.com
            </a>
            <span className="hidden md:block text-primary-foreground/30">|</span>
            <a
              href="tel:+41123456789"
              className="font-display text-2xl md:text-3xl text-primary-foreground hover:text-accent transition-colors duration-300"
              data-cursor-hover
            >
              +41 123 456 789
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center gap-8"
          >
            {['Instagram', 'Dribbble', 'LinkedIn', 'Twitter'].map((social) => (
              <a
                key={social}
                href="#"
                className="nav-link text-primary-foreground/70 hover:text-primary-foreground"
                data-cursor-hover
              >
                {social}
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </ParallaxSection>
  );
};

export default ContactSection;
