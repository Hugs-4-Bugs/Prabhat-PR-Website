import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLenis } from '@/hooks/useLenis';
import Navigation from '@/components/Navigation';
import LiquidCursor from '@/components/LiquidCursor';
import CosmicBackground from '@/components/CosmicBackground';
import SpaceParticles3D from '@/components/SpaceParticles3D';
import AccessibleFocus from '@/components/AccessibleFocus';
import LoadingScreen from '@/components/LoadingScreen';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import PageTransition from '@/components/PageTransition';
import ResumeModal from '@/components/ResumeModal';
import CinematicHero from '@/components/sections/CinematicHero';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import GallerySection from '@/components/sections/GallerySection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  
  useLenis();

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isLoading]);

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
      <LoadingScreen onComplete={handleLoadingComplete} />
      {showContent && <CosmicBackground />}
      {showContent && <SpaceParticles3D />}
      <LiquidCursor />
      <AccessibleFocus />
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />

      <AnimatePresence mode="wait">
        {showContent && (
          <PageTransition>
            <div className="min-h-screen relative z-10">
              <Navigation />
              <ThemeToggle />
              <MusicPlayer />
              
              <main>
                <CinematicHero />
                <AboutSection />
                <ProjectsSection />
                <SkillsSection />
                <ExperienceSection />
                <GallerySection />
                <TestimonialsSection />
                <BlogSection />
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
