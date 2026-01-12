import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
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
  },
  {
    title: 'Designing for Emotion',
    excerpt: 'Why emotional design is the key to creating memorable digital products.',
    date: 'January 3, 2026',
    image: oceanIslands,
  },
  {
    title: 'The Future of Interactive',
    excerpt: 'Predictions and insights on where interactive design is heading in 2026.',
    date: 'December 28, 2025',
    image: forestValley,
  },
];

const BlogSection = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true, margin: '-10%' });

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
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group cursor-pointer"
              data-cursor-hover
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[4/3] mb-6">
                <motion.div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${post.image})` }}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors duration-500" />
              </div>

              {/* Content */}
              <span className="font-body text-xs tracking-wider text-primary-foreground/50 uppercase">
                {post.date}
              </span>
              <h3 className="font-display text-xl md:text-2xl text-primary-foreground mt-2 mb-3 group-hover:text-accent transition-colors duration-300">
                {post.title}
              </h3>
              <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Read More */}
              <motion.span
                className="inline-block mt-4 font-body text-xs tracking-wider text-primary-foreground/60 uppercase group-hover:text-primary-foreground transition-colors duration-300"
                whileHover={{ x: 5 }}
              >
                Read More →
              </motion.span>
            </motion.article>
          ))}
        </div>
      </div>
    </ParallaxSection>
  );
};

export default BlogSection;
