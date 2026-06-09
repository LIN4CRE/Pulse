import { useState } from 'react';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import IssuesSection from './components/IssuesSection';
import CodeSection from './components/CodeSection';
import WorkflowSection from './components/WorkflowSection';
import ArchitectureSection from './components/ArchitectureSection';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1E293B',
            color: '#fff',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          },
        }}
      />
      <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />
      <HeroSection />
      <FeaturesSection />
      <IssuesSection />
      <ArchitectureSection />
      <CodeSection />
      <WorkflowSection />
      <Footer />
    </div>
  );
}
