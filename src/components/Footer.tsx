import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-primary py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <motion.a
            href="#home"
            className="font-display text-lg tracking-[0.3em] text-primary-foreground uppercase"
            whileHover={{ scale: 1.02 }}
            data-cursor-hover
          >
            M o n t f o r t
          </motion.a>

          {/* Copyright */}
          <p className="font-body text-xs tracking-wider text-primary-foreground/50">
            © 2026 Montfort. All rights reserved.
          </p>

          {/* Back to Top */}
          <motion.a
            href="#home"
            className="font-body text-xs tracking-wider text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300 flex items-center gap-2"
            whileHover={{ y: -2 }}
            data-cursor-hover
          >
            Back to Top
            <span className="rotate-[-90deg]">→</span>
          </motion.a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
