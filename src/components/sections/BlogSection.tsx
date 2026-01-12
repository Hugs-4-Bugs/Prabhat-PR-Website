import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import ParallaxSection from '@/components/ParallaxSection';
import skyClouds from '@/assets/sky-clouds.jpg';
import oceanIslands from '@/assets/ocean-islands.jpg';
import forestValley from '@/assets/forest-valley.jpg';

const blogPosts = [
  {
    title: 'The Art of Digital Immersion',
    excerpt: 'Exploring how WebGL and modern web technologies are reshaping user experiences.',
    date: 'January 8, 2026',
    image: skyClouds,
    category: 'Technology',
  },
  {
    title: 'Designing for Emotion',
    excerpt: 'Why emotional design is the key to creating memorable digital products.',
    date: 'January 3, 2026',
    image: oceanIslands,
    category: 'Design',
  },
  {
    title: 'The Future of Interactive',
    excerpt: 'Predictions and insights on where interactive design is heading in 2026.',
    date: 'December 28, 2025',
    image: forestValley,
    category: 'Insights',
  },
];

const BlogCard = ({ post, index }: { post: typeof blogPosts[0]; index: number }) => {
  return (
    <motion.a
      href="https://prabhatblogs.lovable.app/"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="group cursor-pointer block"
      data-cursor-hover
    >
      {/* Premium Card Container */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-card/50 to-card/30 backdrop-blur-sm border border-primary-foreground/10 hover:border-primary-foreground/30 transition-all duration-500">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[16/10]">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.image})` }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-80" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-xs font-body tracking-wider uppercase bg-accent/90 text-accent-foreground rounded-full backdrop-blur-sm">
              {post.category}
            </span>
          </div>

          {/* External Link Icon */}
          <motion.div
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ scale: 1.1 }}
          >
            <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          <span className="font-body text-xs tracking-wider text-muted-foreground uppercase">
            {post.date}
          </span>
          <h3 className="font-display text-xl md:text-2xl text-primary-foreground mt-2 mb-3 group-hover:text-accent transition-colors duration-300 leading-tight">
            {post.title}
          </h3>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>

          {/* Read More Link */}
          <div className="mt-4 flex items-center gap-2 text-accent">
            <span className="font-body text-xs tracking-wider uppercase">
              Read on Blog
            </span>
            <motion.span
              className="inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ExternalLink className="w-3 h-3" />
            </motion.span>
          </div>
        </div>

        {/* Premium Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </motion.a>
  );
};

const BlogSection = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true, margin: '-10%' });

  const handleViewAllBlogs = () => {
    window.open('https://prabhatblogs.lovable.app/', '_blank');
  };

  return (
    <ParallaxSection
      id="blog"
      backgroundImage={skyClouds}
      overlayOpacity={0.65}
      backgroundSpeed={0.3}
      zoomEffect={true}
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
            Latest Insights
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-primary-foreground tracking-wider"
          >
            B L O G
          </motion.h2>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <BlogCard key={post.title} post={post} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <button
            onClick={handleViewAllBlogs}
            className="btn-montfort text-primary-foreground border-primary-foreground/50 hover:border-primary-foreground inline-flex items-center gap-2"
            data-cursor-hover
          >
            <span>View All Posts</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </ParallaxSection>
  );
};

export default BlogSection;
