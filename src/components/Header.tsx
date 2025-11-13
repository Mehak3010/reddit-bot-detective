import React from 'react';
import UserAnalysisSection from './UserAnalysisSection';

const Header = ({ onAnalysis }: { onAnalysis: () => void }) => {
  return (
    <header className="py-12 px-4 md:px-8 bg-gradient-to-br from-primary/25 via-accent/15 to-background/60 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-left">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight">
            Reddit Bot Detection Analysis
          </h1>
          <p className="text-base md:text-lg text-muted-foreground inline-block">
            Comparative study of unsupervised learning algorithms for detecting automated accounts on Reddit
          </p>
        </div>
        <div className="w-full max-w-lg">
          <UserAnalysisSection onAnalysis={onAnalysis} />
        </div>
      </div>
    </header>
  );
};

export default Header;