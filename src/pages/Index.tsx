import { useState, useEffect } from 'react';
import { useLenis } from '@/hooks/useLenis';
import Navigation from '@/components/Navigation';
import MouseTrail from '@/components/MouseTrail';
import ParticlesBackground from '@/components/ParticlesBackground';
import LoadingScreen from '@/components/LoadingScreen';
import WebGLHero from '@/components/sections/WebGLHero';
import HorizontalGallery from '@/components/sections/HorizontalGallery';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import AboutSection from '@/components/sections/AboutSection';
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

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setShowContent(true);
  };

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen onComplete={handleLoadingComplete} />

      {/* 3D Particles Background */}
      {showContent && <ParticlesBackground />}

      {/* Custom Mouse Trail */}
      <MouseTrail />

      {/* Main Content */}
      {showContent && (
        <div className="min-h-screen relative z-10">
          <Navigation />
          
          <main>
            {/* WebGL Hero with liquid distortion */}
            <WebGLHero />
            
            {/* Horizontal scrolling gallery */}
            <HorizontalGallery />
            
            {/* Projects */}
            <ProjectsSection />
            
            {/* Skills & Services */}
            <SkillsSection />
            
            {/* Experience Timeline */}
            <ExperienceSection />
            
            {/* About */}
            <AboutSection />
            
            {/* Contact */}
            <ContactSection />
          </main>

          <Footer />
        </div>
      )}
    </>
  );
};

export default Index;
