import GlobalBackground from '@/components/notpetya/3d/GlobalBackground';
import Navigation from '@/components/notpetya/Navigation';
import HeroSection from '@/components/notpetya/HeroSection';
import ExecutiveOverview from '@/components/notpetya/ExecutiveOverview';
import HistoricalContext from '@/components/notpetya/HistoricalContext';
import SupplyChainDiagram from '@/components/notpetya/SupplyChainDiagram';
import TimelineSection from '@/components/notpetya/TimelineSection';
import AttackChain from '@/components/notpetya/AttackChain';
import PropagationSim from '@/components/notpetya/PropagationSim';
import MitreMapping from '@/components/notpetya/MitreMapping';
import GlobalImpact from '@/components/notpetya/GlobalImpact';
import BusinessImpact from '@/components/notpetya/BusinessImpact';
import NotRansomware from '@/components/notpetya/NotRansomware';
import CyberWar from '@/components/notpetya/CyberWar';
import SOCInvestigation from '@/components/notpetya/SOCInvestigation';
import IncidentResponse from '@/components/notpetya/IncidentResponse';
import Prevention from '@/components/notpetya/Prevention';
import ComparativeAnalysis from '@/components/notpetya/ComparativeAnalysis';
import LessonsLearned from '@/components/notpetya/LessonsLearned';
import FinalReflection from '@/components/notpetya/FinalReflection';
import References from '@/components/notpetya/References';
import Footer from '@/components/notpetya/Footer';

export default function NotPetyaPage() {
  return (
    <div className="np-root">
      <GlobalBackground />
      <Navigation />
      <main>
        <HeroSection />
        <ExecutiveOverview />
        <HistoricalContext />
        <SupplyChainDiagram />
        <TimelineSection />
        <AttackChain />
        <PropagationSim />
        <MitreMapping />
        <GlobalImpact />
        <BusinessImpact />
        <NotRansomware />
        <CyberWar />
        <SOCInvestigation />
        <IncidentResponse />
        <Prevention />
        <ComparativeAnalysis />
        <LessonsLearned />
        <FinalReflection />
        <References />
      </main>
      <Footer />
    </div>
  );
}
