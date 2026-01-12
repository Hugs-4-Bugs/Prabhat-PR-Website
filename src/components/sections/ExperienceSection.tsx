import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ParallaxSection from '@/components/ParallaxSection';
import forestValley from '@/assets/forest-valley.jpg';

const experiences = [
  {
    title: 'Java Software Developer',
    company: 'Netcore Cloud',
    period: 'Jan 2023 – Present',
    location: 'Bengaluru, India',
    description: 'Developed and maintained scalable backend services using Java, Spring Boot, Hibernate, and Microservices. Led backend development for Real Estate Blog Management System.',
    achievements: [
      '40% faster performance optimization',
      '1M+ requests handled',
      '99.9% system uptime',
    ],
    technologies: ['Java', 'Spring Boot', 'Hibernate', 'AWS', 'MySQL', 'Microservices'],
  },
  {
    title: 'Java Software Engineer Intern',
    company: 'CodeSpeedy Technology Pvt Ltd',
    period: 'Oct 2022 – Dec 2022',
    location: 'Remote',
    description: 'Optimized Hibernate ORM and built secure JWT authentication systems. Enhanced database performance through query optimization.',
    achievements: [
      'Improved query performance by 30%',
      'Implemented secure authentication',
      'Built reusable component library',
    ],
    technologies: ['Java', 'Spring Security', 'JWT', 'Hibernate', 'PostgreSQL'],
  },
  {
    title: 'Software Engineer',
    company: 'Walmart USA',
    period: '2022',
    location: 'Remote',
    description: 'Solved technical simulations and designed custom heap structures for logistics handling 2M+ operations daily.',
    achievements: [
      'Designed custom data structures',
      'Handled 2M+ daily operations',
      'Optimized logistics algorithms',
    ],
    technologies: ['Java', 'Data Structures', 'Algorithms', 'System Design'],
  },
];

const ExperienceSection = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true, margin: '-10%' });

  return (
    <ParallaxSection
      id="experience"
      backgroundImage={forestValley}
      overlayOpacity={0.8}
      backgroundSpeed={0.2}
      zoomEffect={false}
    >
      <div className="container mx-auto px-6 py-20">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-body text-xs tracking-[0.3em] text-primary-foreground/60 uppercase mb-4 block"
          >
            Professional Journey
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-primary-foreground tracking-wider"
          >
            E X P E R I E N C E
          </motion.h2>
        </div>

        {/* Experience Timeline */}
        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative pl-8 pb-12 border-l border-primary-foreground/20 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-accent border-2 border-primary-foreground/30" />
              
              {/* Content */}
              <div className="group">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl text-primary-foreground mb-1">
                      {exp.title}
                    </h3>
                    <p className="font-body text-accent text-lg">
                      {exp.company}
                    </p>
                  </div>
                  <div className="text-right mt-2 md:mt-0">
                    <p className="font-body text-sm text-primary-foreground/60">
                      {exp.period}
                    </p>
                    <p className="font-body text-xs text-primary-foreground/40">
                      {exp.location}
                    </p>
                  </div>
                </div>

                <p className="font-body text-primary-foreground/70 mb-4 leading-relaxed">
                  {exp.description}
                </p>

                {/* Achievements */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {exp.achievements.map((achievement) => (
                    <span
                      key={achievement}
                      className="font-body text-xs px-3 py-1 bg-accent/20 text-primary-foreground/80 rounded-full"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="font-body text-xs px-2 py-1 border border-primary-foreground/20 text-primary-foreground/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ParallaxSection>
  );
};

export default ExperienceSection;
