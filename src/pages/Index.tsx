import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLenis } from '@/hooks/useLenis';
import Navigation from '@/components/Navigation';
import LiquidCursor from '@/components/LiquidCursor';
import ParticlesBackground from '@/components/ParticlesBackground';
import AnimatedBackground from '@/components/AnimatedBackground';
import AccessibleFocus from '@/components/AccessibleFocus';
import LoadingScreen from '@/components/LoadingScreen';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import PageTransition from '@/components/PageTransition';
import WebGLHero from '@/components/sections/WebGLHero';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  
  // Initialize Lenis smooth scroll
  useLenis();

  useEffect(() => {
    // Prevent scroll during loading
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isLoading]);

  // Initialize dark mode by default
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setShowContent(true);
  };

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen onComplete={handleLoadingComplete} />

      {/* Animated Background - moves when not scrolling */}
      {showContent && <AnimatedBackground />}

      {/* 3D Particles Background */}
      {showContent && <ParticlesBackground />}

      {/* Liquid Cursor - visible on all pages */}
      <LiquidCursor />

      {/* Accessibility Focus Handler */}
      <AccessibleFocus />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {showContent && (
          <PageTransition>
            <div className="min-h-screen relative z-10">
              <Navigation />
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Music Player */}
              <MusicPlayer />
              
              <main>
                {/* WebGL Hero with liquid distortion */}
                <WebGLHero />
                
                {/* About - comes right after hero */}
                <AboutSection />
                
                {/* Projects */}
                <ProjectsSection />
                
                {/* Skills & Services */}
                <SkillsSection />
                
                {/* Experience Timeline */}
                <ExperienceSection />
                
                {/* Blog */}
                <BlogSection />
                
                {/* Contact */}
                <ContactSection />
              </main>

              <Footer />
            </div>
          </PageTransition>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
