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
      {/* Premium Card Container */}
      <div className="relative overflow-hidden aspect-[3/4] rounded-lg bg-gradient-to-b from-card/50 to-card/80 border border-primary-foreground/10 group-hover:border-primary-foreground/30 transition-all duration-500">
        {/* Image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-90" />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          {/* Category Badge */}
          <motion.span 
            className="inline-block self-start px-3 py-1 mb-4 text-xs font-body tracking-wider uppercase bg-accent/80 text-accent-foreground rounded-full backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.15 + 0.2 }}
          >
            {category}
          </motion.span>

          {/* Title */}
          <h3 className="font-display text-2xl md:text-3xl text-primary-foreground mb-2 group-hover:text-accent transition-colors duration-300">
            {title}
          </h3>

          {/* Description - Show on Hover */}
          <motion.p
            className="font-body text-sm text-primary-foreground/70 mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ y: 10 }}
            whileHover={{ y: 0 }}
          >
            {description || 'Click to view project details'}
          </motion.p>

          {/* Tech Stack Pills */}
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-xs font-body bg-primary-foreground/10 text-primary-foreground/80 rounded-full backdrop-blur-sm"
                >
                  {tech}
                </span>
              ))}
              {techStack.length > 3 && (
                <span className="px-2 py-0.5 text-xs font-body text-primary-foreground/60">
                  +{techStack.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-body tracking-wider uppercase bg-accent text-accent-foreground rounded-full hover:bg-accent/80 transition-colors"
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
                className="flex items-center gap-2 px-4 py-2 text-xs font-body tracking-wider uppercase bg-primary-foreground/10 text-primary-foreground rounded-full hover:bg-primary-foreground/20 transition-colors backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Corner Arrow */}
        <motion.div
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          whileHover={{ scale: 1.1, rotate: 45 }}
        >
          <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
        </motion.div>

        {/* Premium Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
