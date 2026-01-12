import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ParallaxSection from '@/components/ParallaxSection';
import ProjectCard from '@/components/ProjectCard';
import AnimatedText from '@/components/AnimatedText';
import icelandLandscape from '@/assets/iceland-landscape.jpg';
import forestValley from '@/assets/forest-valley.jpg';
import oceanIslands from '@/assets/ocean-islands.jpg';
import skyClouds from '@/assets/sky-clouds.jpg';

const projects = [
  {
    title: 'Nordic Horizons',
    category: 'Brand Identity',
    image: icelandLandscape,
  },
  {
    title: 'Ocean Dreams',
    category: 'Digital Experience',
    image: oceanIslands,
  },
  {
    title: 'Forest Echoes',
    category: 'Web Design',
    image: forestValley,
  },
  {
    title: 'Sky Canvas',
    category: 'Interactive Art',
    image: skyClouds,
  },
];

const ProjectsSection = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true, margin: '-10%' });

  return (
    <ParallaxSection
      id="projects"
      backgroundImage={icelandLandscape}
      overlayOpacity={0.7}
      backgroundSpeed={0.25}
      zoomEffect={true}
    >
      <div className="container mx-auto px-6 py-20">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-body text-xs tracking-[0.3em] text-primary-foreground/60 uppercase mb-4 block"
          >
            Selected Work
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl text-primary-foreground tracking-wider"
          >
            P R O J E C T S
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-primary-foreground/70 max-w-xl mx-auto mt-6"
          >
            Each project is a unique journey into the intersection of creativity and technology,
            crafted with precision and passion.
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              {...project}
              index={index}
            />
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <a
            href="#"
            className="btn-montfort text-primary-foreground border-primary-foreground/30"
            data-cursor-hover
          >
            <span>View All Projects</span>
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </ParallaxSection>
  );
};

export default ProjectsSection;
