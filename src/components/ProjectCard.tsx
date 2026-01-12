import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
  index: number;
}

const ProjectCard = ({ title, category, image, index }: ProjectCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <motion.div
      ref={ref}
      className="project-card cursor-pointer"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      data-cursor-hover
    >
      <div
        className="project-card-image"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="project-card-overlay" />
      <div className="project-card-content">
        <span className="font-body text-xs tracking-[0.2em] text-primary-foreground/70 uppercase mb-2 block">
          {category}
        </span>
        <h3 className="font-display text-2xl md:text-3xl text-primary-foreground">
          {title}
        </h3>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
