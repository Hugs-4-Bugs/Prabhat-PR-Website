import { useState, useEffect } from 'react';
import { useLenis } from '@/hooks/useLenis';
import Navigation from '@/components/Navigation';
import LiquidCursor from '@/components/LiquidCursor';
import LoadingScreen from '@/components/LoadingScreen';
import WebGLHero from '@/components/sections/WebGLHero';
import HorizontalGallery from '@/components/sections/HorizontalGallery';
import ProjectsSection from '@/components/sections/ProjectsSection';
import AboutSection from '@/components/sections/AboutSection';
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

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setShowContent(true);
  };

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen onComplete={handleLoadingComplete} />

      {/* Custom Cursor */}
      <LiquidCursor />

      {/* Main Content */}
      {showContent && (
        <div className="min-h-screen">
          <Navigation />
          
          <main>
            {/* WebGL Hero with liquid distortion */}
            <WebGLHero />
            
            {/* Horizontal scrolling gallery */}
            <HorizontalGallery />
            
            {/* Other sections */}
            <ProjectsSection />
            <AboutSection />
            <BlogSection />
            <ContactSection />
          </main>

          <Footer />
        </div>
      )}
    </>
  );
};

export default Index;
