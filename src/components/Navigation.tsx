import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScrollProgress();

  useEffect(() => {
    setIsScrolled(scrollY > 100);
  }, [scrollY]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Projects', href: '#projects' },
    { name: 'About', href: '#about' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-primary/90 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <motion.a
              href="#home"
              className="font-display text-xl lg:text-2xl tracking-[0.3em] text-primary-foreground uppercase"
              whileHover={{ scale: 1.02 }}
              data-cursor-hover
            >
              M o n t f o r t
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="nav-link text-primary-foreground"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  data-cursor-hover
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-primary-foreground p-2"
              data-cursor-hover
            >
              <motion.div className="w-6 flex flex-col gap-1.5">
                <motion.span
                  className="w-full h-0.5 bg-current origin-left"
                  animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? -2 : 0 }}
                />
                <motion.span
                  className="w-full h-0.5 bg-current"
                  animate={{ opacity: isMenuOpen ? 0 : 1 }}
                />
                <motion.span
                  className="w-full h-0.5 bg-current origin-left"
                  animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? 2 : 0 }}
                />
              </motion.div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-primary/95 backdrop-blur-lg lg:hidden flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="font-display text-3xl text-primary-foreground tracking-widest"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                  data-cursor-hover
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
