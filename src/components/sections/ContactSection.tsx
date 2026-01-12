import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ParallaxSection from '@/components/ParallaxSection';
import oceanIslands from '@/assets/ocean-islands.jpg';

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/prabhat-kumar' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/prabhat-kumar' },
  { name: 'Twitter', url: 'https://twitter.com/prabhat' },
  { name: 'Portfolio', url: 'https://prabhat-codes.vercel.app' },
];

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
            Let's Connect
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-primary-foreground/80 text-lg mb-12 max-w-xl mx-auto"
          >
            Have a project in mind or want to collaborate? I'd love to hear from you. 
            Let's build something amazing together.
          </motion.p>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-12"
          >
            <a
              href="mailto:mailtoprabhat72@gmail.com"
              className="font-display text-xl md:text-2xl text-primary-foreground hover:text-accent transition-colors duration-300"
              data-cursor-hover
            >
              mailtoprabhat72@gmail.com
            </a>
            <span className="hidden md:block text-primary-foreground/30">|</span>
            <a
              href="tel:+917250063206"
              className="font-display text-xl md:text-2xl text-primary-foreground hover:text-accent transition-colors duration-300"
              data-cursor-hover
            >
              +91 7250063206
            </a>
          </motion.div>

          {/* Location */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-body text-sm text-primary-foreground/60 mb-8"
          >
            📍 Bengaluru, India
          </motion.p>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center gap-8"
          >
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link text-primary-foreground/70 hover:text-primary-foreground"
                data-cursor-hover
              >
                {social.name}
              </a>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12"
          >
            <a
              href="https://prabhat-codes.vercel.app/Prabhat%20Experience%20Profile.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-montfort text-primary-foreground border-primary-foreground/50"
              data-cursor-hover
            >
              <span>Download Resume</span>
              <span>↓</span>
            </a>
          </motion.div>
        </div>
      </div>
    </ParallaxSection>
  );
};

export default ContactSection;
