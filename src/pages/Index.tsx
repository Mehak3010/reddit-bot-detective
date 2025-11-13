import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ModelCards from "@/components/ModelCards";
import DatasetOverview from "@/components/DatasetOverview";
import ModelComparison from "@/components/ModelComparison";
import ModelDetails from "@/components/ModelDetails";
import ResearcherUpload from "@/components/ResearcherUpload";
import MobilePerformanceTabs from "@/components/MobilePerformanceTabs";
import AccountSummaryPanel from "@/components/AccountSummaryPanel";
import { getUsersFromCSV, UserData } from "@/utils/csvParser";
import { calculatePerformanceData, calculateRadarData, calculateDetectionTrend } from "@/utils/graphUtils";

const Index = () => {
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [detectionTrend, setDetectionTrend] = useState<any[]>([]);
  const [analysisPerformed, setAnalysisPerformed] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedPredictions, setSelectedPredictions] = useState<any[]>([]);

  const handleAnalysis = async () => {
    const users = await getUsersFromCSV();
    setPerformanceData(calculatePerformanceData(users));
    setRadarData(calculateRadarData(users));
    setDetectionTrend(calculateDetectionTrend(users));
    setAnalysisPerformed(true);
  };

  const handleUserSummary = (user: UserData, predictions: any[]) => {
    setSelectedUser(user);
    setSelectedPredictions(predictions);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onAnalysis={handleAnalysis} onSummary={handleUserSummary} />
      <ResearcherUpload />
      <ModelCards />
      <DatasetOverview />
      {selectedUser && selectedPredictions.length > 0 && (
        <AccountSummaryPanel userData={selectedUser} predictions={selectedPredictions} />
      )}
      <MobilePerformanceTabs
        performanceData={performanceData}
        radarData={radarData}
        detectionTrend={detectionTrend}
        analysisPerformed={analysisPerformed}
      />
      <div className="hidden md:block">
        <ModelComparison
          performanceData={performanceData}
          radarData={radarData}
          detectionTrend={detectionTrend}
        />
        <ModelDetails
          performanceData={analysisPerformed ? performanceData : []}
          radarData={analysisPerformed ? radarData : []}
        />
      </div>

      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>Reddit Bot Detection Comparative Analysis • Unsupervised Learning Models</p>
          <p className="mt-2">Dataset: 370 users • 31 behavioral features</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
