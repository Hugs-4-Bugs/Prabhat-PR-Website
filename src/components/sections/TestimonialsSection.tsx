import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import ParallaxSection from '@/components/ParallaxSection';
import heroMountain from '@/assets/hero-mountain.jpg';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    role: 'Tech Lead at TCS',
    content: 'Prabhat delivered exceptional quality on our Spring Boot microservices project. His attention to detail and problem-solving skills are remarkable.',
    avatar: 'RS',
  },
  {
    id: 2,
    name: 'Priya Patel',
    role: 'Product Manager at Infosys',
    content: 'Working with Prabhat was a pleasure. He understood our requirements quickly and delivered a React application that exceeded our expectations.',
    avatar: 'PP',
  },
  {
    id: 3,
    name: 'Amit Kumar',
    role: 'Founder at StartupX',
    content: 'Prabhat built our entire ML-based trading analytics platform. His expertise in both Java and Python made the integration seamless.',
    avatar: 'AK',
  },
  {
    id: 4,
    name: 'Sarah Johnson',
    role: 'CTO at TechCorp',
    content: 'Outstanding developer with deep knowledge of cloud architecture. Prabhat helped us migrate to AWS and reduced our infrastructure costs by 40%.',
    avatar: 'SJ',
  },
];

const clientLogos = [
  { name: 'AWS', text: 'AWS' },
  { name: 'Google Cloud', text: 'GCP' },
  { name: 'Microsoft', text: 'Azure' },
  { name: 'Oracle', text: 'Oracle' },
  { name: 'IBM', text: 'IBM' },
];

const TestimonialsSection = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true, margin: '-10%' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => goToSlide((currentIndex + 1) % testimonials.length);
  const prevSlide = () => goToSlide((currentIndex - 1 + testimonials.length) % testimonials.length);

  return (
    <ParallaxSection
      id="testimonials"
      backgroundImage={heroMountain}
      overlayOpacity={0.8}
      backgroundSpeed={0.2}
      zoomEffect={false}
    >
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-body text-xs tracking-[0.15em] sm:tracking-[0.2em] text-primary-foreground/60 uppercase mb-4 block"
          >
            What People Say
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary-foreground tracking-[0.1em] sm:tracking-[0.15em]"
          >
            TESTIMONIALS
          </motion.h2>
        </div>

        {/* Testimonials Slider */}
        <div className="max-w-4xl mx-auto relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
            data-cursor-hover
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
            data-cursor-hover
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Testimonial Cards */}
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-card/30 backdrop-blur-md border border-primary-foreground/10 rounded-lg p-6 sm:p-10 text-center">
                    {/* Quote Icon */}
                    <Quote className="w-10 h-10 text-accent/50 mx-auto mb-6" />
                    
                    {/* Content */}
                    <p className="font-body text-lg sm:text-xl text-primary-foreground leading-relaxed mb-8">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-primary-foreground font-display text-lg mb-3">
                        {testimonial.avatar}
                      </div>
                      <h4 className="font-display text-lg text-primary-foreground">
                        {testimonial.name}
                      </h4>
                      <p className="font-body text-sm text-primary-foreground/60">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-accent'
                    : 'bg-primary-foreground/30 hover:bg-primary-foreground/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Client Logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 sm:mt-20"
        >
          <p className="font-body text-xs tracking-widest text-primary-foreground/50 uppercase text-center mb-8">
            Trusted Technologies & Platforms
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            {clientLogos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="px-6 py-3 border border-primary-foreground/10 rounded-lg bg-primary-foreground/5 backdrop-blur-sm"
                data-cursor-hover
              >
                <span className="font-display text-lg sm:text-xl text-primary-foreground/60 tracking-wider">
                  {logo.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </ParallaxSection>
  );
};

export default TestimonialsSection;
