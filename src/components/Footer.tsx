import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, ExternalLink } from 'lucide-react';

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/Hugs-4-Bugs', icon: Github },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/prabhat-kumar-6963661a4/', icon: Linkedin },
  { name: 'Instagram', url: 'https://www.instagram.com/_s_4_sharma/', icon: Instagram },
  { name: 'Portfolio', url: 'https://prabhat-codes.vercel.app/', icon: ExternalLink },
];

const Footer = () => {
  return (
    <footer className="bg-primary py-8 sm:py-12 border-t border-primary-foreground/10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:gap-8">
          {/* Logo */}
          <motion.a
            href="#home"
            className="font-display text-base sm:text-lg tracking-[0.15em] sm:tracking-[0.2em] text-primary-foreground uppercase"
            whileHover={{ scale: 1.02 }}
            data-cursor-hover
            aria-label="Go to home"
          >
            Prabhat Kumar
          </motion.a>

          {/* Social Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground hover:border-primary-foreground/50 hover:bg-primary-foreground/5 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                data-cursor-hover
                aria-label={`Visit ${social.name}`}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>

          {/* Copyright & Back to Top */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-center">
            <p className="font-body text-xs tracking-wider text-primary-foreground/50">
              © 2026 Prabhat Kumar. All rights reserved.
            </p>
            
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
      </div>
    </footer>
  );
};

export default Footer;
