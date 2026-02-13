import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Images from public/gallery/ — add your images there
const galleryImages = [
  { src: '/gallery/1.jpg', title: 'The Developer\'s Den' },
  { src: '/gallery/2.jpg', title: 'Speaking at Tech Summit' },
  { src: '/gallery/3.jpg', title: 'Crafting the Future' },
  { src: '/gallery/4.jpg', title: 'Team Collaboration' },
  { src: '/gallery/5.jpg', title: 'Recognition & Awards' },
  { src: '/gallery/6.jpg', title: 'Command Center' },
];

const GallerySection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true, margin: '-10%' });

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % galleryImages.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, []);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  const handleManual = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      scale: 0.85,
      rotateY: dir > 0 ? 15 : -15,
      opacity: 0,
    }),
    center: {
      x: 0,
      scale: 1,
      rotateY: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      scale: 0.85,
      rotateY: dir > 0 ? -15 : 15,
      opacity: 0,
    }),
  };

  return (
    <section id="gallery" className="relative min-h-screen overflow-hidden py-20">
      {/* Space-themed section background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Floating cosmic particles for this section */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `hsl(${350 + Math.random() * 40} 70% 60%)`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              delay: Math.random() * 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-body text-xs tracking-[0.2em] text-muted-foreground uppercase mb-4 block"
          >
            Snapshots & Memories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground tracking-[0.15em]"
          >
            GALLERY
          </motion.h2>
        </div>

        {/* Main Slideshow */}
        <div
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ perspective: '1200px' }}
        >
          {/* Frame */}
          <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm shadow-[0_0_80px_-20px_hsl(350_80%_40%/0.15)]">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.7,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="absolute inset-0"
              >
                <img
                  src={galleryImages[current].src}
                  alt={galleryImages[current].title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                {/* Cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                
                {/* Image title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-6 left-6 right-6"
                >
                  <span className="font-display text-xl sm:text-2xl text-foreground/90">
                    {galleryImages[current].title}
                  </span>
                  <span className="font-body text-xs text-muted-foreground ml-4">
                    {current + 1} / {galleryImages.length}
                  </span>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Decorative corner frames */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-accent/40 rounded-tl-sm" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-accent/40 rounded-tr-sm" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-accent/40 rounded-bl-sm" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-accent/40 rounded-br-sm" />
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => { prev(); setIsPaused(true); setTimeout(() => setIsPaused(false), 8000); }}
            className="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card/60 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground hover:bg-accent/20 hover:border-accent/50 transition-all z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => { next(); setIsPaused(true); setTimeout(() => setIsPaused(false), 8000); }}
            className="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card/60 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground hover:bg-accent/20 hover:border-accent/50 transition-all z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot indicators instead of thumbnails */}
        <div className="flex justify-center gap-2 mt-8">
          {galleryImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleManual(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === current
                  ? 'w-8 h-2 bg-accent'
                  : 'w-2 h-2 bg-foreground/30 hover:bg-foreground/50'
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>

        {/* Auto-slide progress */}
        {!isPaused && (
          <div className="max-w-5xl mx-auto mt-4">
            <motion.div
              className="h-0.5 bg-accent/60 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 4, ease: 'linear' }}
              key={current}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
