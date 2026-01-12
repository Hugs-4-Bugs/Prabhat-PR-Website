import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ParallaxSection from '@/components/ParallaxSection';
import skyClouds from '@/assets/sky-clouds.jpg';

const skillCategories = [
  {
    title: 'Languages',
    skills: ['Java', 'JavaScript', 'TypeScript', 'SQL', 'HTML/CSS', 'Python'],
  },
  {
    title: 'Backend',
    skills: ['Spring Boot', 'Spring Security', 'JWT', 'Spring Cloud', 'Hibernate', 'Node.js', 'REST APIs'],
  },
  {
    title: 'Frontend',
    skills: ['React', 'Next.js', 'Angular', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
  },
  {
    title: 'AI/ML',
    skills: ['Spring AI', 'Ollama', 'OpenAI API', 'Scikit-learn', 'Pandas', 'TensorFlow'],
  },
  {
    title: 'Cloud & DevOps',
    skills: ['AWS (EC2, S3, Lambda, RDS)', 'Docker', 'Jenkins', 'Git', 'CI/CD'],
  },
  {
    title: 'Databases',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'],
  },
];

const services = [
  {
    icon: '💻',
    title: 'Web Application Development',
    description: 'End-to-end responsive and performant modern web apps.',
  },
  {
    icon: '🔌',
    title: 'API Design & Integration',
    description: 'RESTful APIs and backend microservices for your apps.',
  },
  {
    icon: '🤖',
    title: 'AI/ML Implementation',
    description: 'Machine learning models integrated into practical applications.',
  },
  {
    icon: '☕',
    title: 'Java Software Development',
    description: 'Expert Java Developer skilled in Spring Boot, Hibernate, Microservices.',
  },
  {
    icon: '☁️',
    title: 'Cloud Infrastructure & DevOps',
    description: 'Cloud-native solutions with AWS, focusing on scalability and automation.',
  },
  {
    icon: '📈',
    title: 'Strategic Trading Solutions',
    description: '4+ years in Stock, Crypto, and Forex trading. Tailored strategies and insights.',
  },
];

const SkillsSection = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true, margin: '-10%' });

  return (
    <ParallaxSection
      id="skills"
      backgroundImage={skyClouds}
      overlayOpacity={0.75}
      backgroundSpeed={0.25}
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
            My Expertise
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-primary-foreground tracking-wider"
          >
            S K I L L S  &  S E R V I C E S
          </motion.h2>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: catIndex * 0.1 }}
              className="group"
            >
              <h3 className="font-display text-xl text-primary-foreground mb-4 tracking-wider">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: catIndex * 0.1 + skillIndex * 0.05 }}
                    whileHover={{ scale: 1.05, backgroundColor: 'hsl(205 60% 45% / 0.3)' }}
                    className="font-body text-sm px-3 py-1.5 bg-primary-foreground/10 text-primary-foreground/80 border border-primary-foreground/20 cursor-default transition-colors"
                    data-cursor-hover
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="font-display text-2xl md:text-3xl text-primary-foreground tracking-wider">
            My Cutting-Edge Services
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="p-6 border border-primary-foreground/20 bg-primary/20 backdrop-blur-sm group cursor-pointer"
              data-cursor-hover
            >
              <span className="text-3xl mb-4 block">{service.icon}</span>
              <h4 className="font-display text-lg text-primary-foreground mb-2 group-hover:text-accent transition-colors">
                {service.title}
              </h4>
              <p className="font-body text-sm text-primary-foreground/60">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </ParallaxSection>
  );
};

export default SkillsSection;
