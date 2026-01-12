import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroMountain from '@/assets/hero-mountain.jpg';
import icelandLandscape from '@/assets/iceland-landscape.jpg';
import oceanIslands from '@/assets/ocean-islands.jpg';
import forestValley from '@/assets/forest-valley.jpg';
import skyClouds from '@/assets/sky-clouds.jpg';

gsap.registerPlugin(ScrollTrigger);

const galleryItems = [
  {
    id: 1,
    title: 'Alpine Majesty',
    subtitle: 'Switzerland',
    image: heroMountain,
    description: 'Where peaks touch clouds',
  },
  {
    id: 2,
    title: 'Nordic Fire',
    subtitle: 'Iceland',
    image: icelandLandscape,
    description: 'Land of ice and aurora',
  },
  {
    id: 3,
    title: 'Paradise Found',
    subtitle: 'Maldives',
    image: oceanIslands,
    description: 'Crystal waters await',
  },
  {
    id: 4,
    title: 'Misty Valleys',
    subtitle: 'Black Forest',
    image: forestValley,
    description: 'Ancient woods whisper',
  },
  {
    id: 5,
    title: 'Sky Canvas',
    subtitle: 'Patagonia',
    image: skyClouds,
    description: 'Endless horizons',
  },
];

const HorizontalGallery = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;

    if (!section || !container) return;

    // Calculate total scroll width
    const totalWidth = container.scrollWidth - window.innerWidth;

    // Main horizontal scroll animation
    const horizontalScroll = gsap.to(container, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Individual item animations
    itemsRef.current.forEach((item, index) => {
      if (!item) return;

      const image = item.querySelector('.gallery-image');
      const content = item.querySelector('.gallery-content');

      // Parallax effect on images
      gsap.to(image, {
        x: '-20%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          scrub: 1,
        },
      });

      // Scale effect when item is in center
      ScrollTrigger.create({
        trigger: item,
        containerAnimation: horizontalScroll,
        start: 'left center',
        end: 'right center',
        onUpdate: (self) => {
          const progress = self.progress;
          const centerProgress = 1 - Math.abs(progress - 0.5) * 2;
          
          gsap.to(item, {
            scale: 0.9 + centerProgress * 0.1,
            duration: 0.3,
          });

          if (content) {
            gsap.to(content, {
              opacity: 0.5 + centerProgress * 0.5,
              y: 20 - centerProgress * 20,
              duration: 0.3,
            });
          }
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative bg-primary overflow-hidden"
    >
      {/* Section Header */}
      <div className="absolute top-0 left-0 right-0 z-20 py-8 px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between"
        >
          <div>
            <span className="font-body text-xs tracking-[0.3em] text-primary-foreground/60 uppercase block mb-2">
              Featured Destinations
            </span>
            <h2 className="font-display text-3xl md:text-5xl text-primary-foreground tracking-wider">
              G A L L E R Y
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="font-body text-xs tracking-wider text-primary-foreground/50">
              Scroll to explore
            </span>
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-primary-foreground"
            >
              →
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={containerRef}
        className="flex items-center min-h-screen pt-24"
        style={{ width: 'max-content' }}
      >
        {/* Spacer at start */}
        <div className="w-[10vw] flex-shrink-0" />

        {galleryItems.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (itemsRef.current[index] = el)}
            className="relative w-[70vw] md:w-[50vw] lg:w-[40vw] h-[70vh] mx-4 md:mx-8 flex-shrink-0 cursor-pointer group"
            data-cursor-hover
          >
            {/* Image Container */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="gallery-image absolute inset-[-20%] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="gallery-content absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <span className="font-body text-xs tracking-[0.2em] text-primary-foreground/60 uppercase mb-2 block">
                {item.subtitle}
              </span>
              <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-3">
                {item.title}
              </h3>
              <p className="font-body text-sm text-primary-foreground/70">
                {item.description}
              </p>

              {/* Explore button */}
              <motion.div
                className="mt-6 inline-flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                whileHover={{ x: 5 }}
              >
                <span className="font-body text-xs tracking-wider text-primary-foreground uppercase">
                  Explore
                </span>
                <span className="text-primary-foreground">→</span>
              </motion.div>
            </div>

            {/* Index number */}
            <div className="absolute top-6 right-6 md:top-10 md:right-10">
              <span className="font-display text-6xl md:text-8xl text-primary-foreground/10">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        ))}

        {/* Spacer at end */}
        <div className="w-[30vw] flex-shrink-0 flex items-center justify-center">
          <motion.a
            href="#contact"
            className="btn-montfort text-primary-foreground border-primary-foreground/30"
            whileHover={{ scale: 1.05 }}
            data-cursor-hover
          >
            <span>View All</span>
            <span>→</span>
          </motion.a>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex gap-2">
          {galleryItems.map((_, index) => (
            <div
              key={index}
              className="w-8 h-px bg-primary-foreground/30"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HorizontalGallery;
