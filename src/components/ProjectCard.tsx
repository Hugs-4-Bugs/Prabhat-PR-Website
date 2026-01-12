import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
  index: number;
  description?: string;
  techStack?: string[];
  link?: string;
  github?: string;
}

const ProjectCard = ({ 
  title, 
  category, 
  image, 
  index, 
  description,
  techStack = [],
  link,
  github
}: ProjectCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <motion.div
      ref={ref}
      className="group cursor-pointer relative"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      data-cursor-hover
    >
      {/* Premium Card Container - Glassmorphism style */}
      <div className="relative overflow-hidden aspect-[4/3] sm:aspect-[3/2] rounded-xl bg-card/60 backdrop-blur-xl border border-border/50 group-hover:border-accent/50 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-accent/10">
        {/* Image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Gradient Overlay - Better visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
          {/* Category Badge */}
          <motion.span 
            className="inline-block self-start px-3 py-1 mb-3 text-xs font-body tracking-wider uppercase bg-accent text-accent-foreground rounded-full shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.15 + 0.2 }}
          >
            {category}
          </motion.span>

          {/* Title */}
          <h3 className="font-display text-xl sm:text-2xl text-foreground mb-2 group-hover:text-accent transition-colors duration-300 drop-shadow-sm">
            {title}
          </h3>

          {/* Description - Always visible */}
          <p className="font-body text-sm text-foreground/80 mb-3 line-clamp-2">
            {description || 'Click to view project details'}
          </p>

          {/* Tech Stack Pills */}
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-xs font-body bg-foreground/10 text-foreground/90 rounded-full backdrop-blur-sm border border-foreground/10"
                >
                  {tech}
                </span>
              ))}
              {techStack.length > 3 && (
                <span className="px-2 py-0.5 text-xs font-body text-foreground/60">
                  +{techStack.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-body tracking-wider uppercase bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition-colors shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-body tracking-wider uppercase bg-foreground/10 text-foreground rounded-full hover:bg-foreground/20 transition-colors backdrop-blur-sm border border-foreground/10"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Corner Arrow */}
        <motion.div
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-foreground/10"
          whileHover={{ scale: 1.1, rotate: 45 }}
        >
          <ArrowUpRight className="w-4 h-4 text-foreground" />
        </motion.div>

        {/* Premium Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
