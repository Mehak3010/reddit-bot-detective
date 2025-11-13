import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ModelCards from "@/components/ModelCards";
import DatasetOverview from "@/components/DatasetOverview";
import PerformanceSwitcher from "@/components/PerformanceSwitcher";
import ModelDetails from "@/components/ModelDetails";
import ResearcherUpload from "@/components/ResearcherUpload";
import UserAnalysisSection from "@/components/UserAnalysisSection";
import AccountSummaryPanel from "@/components/AccountSummaryPanel";
import KeyFeaturesAnalyzed from "@/components/KeyFeaturesAnalyzed";
import AnalysisPlaceholder from "@/components/AnalysisPlaceholder";
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
      <Header />
      <ResearcherUpload />
      <div className="px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="w-full max-w-lg mx-auto">
            <UserAnalysisSection onAnalysis={handleAnalysis} onSummary={handleUserSummary} />
          </div>
        </div>
      </div>
      <div className="px-4 md:px-8 pt-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div>
            {selectedUser && selectedPredictions.length > 0 ? (
              <AccountSummaryPanel userData={selectedUser} predictions={selectedPredictions} />
            ) : (
              <AnalysisPlaceholder />
            )}
          </div>
          <div>
            <PerformanceSwitcher
              performanceData={performanceData}
              radarData={radarData}
              detectionTrend={detectionTrend}
            />
          </div>
        </div>
      </div>

      <ModelDetails
        performanceData={analysisPerformed ? performanceData : []}
        radarData={analysisPerformed ? radarData : []}
      />

      <DatasetOverview />
      <KeyFeaturesAnalyzed />

      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>Reddit Bot Detection Comparative Analysis • Unsupervised Learning Models</p>
          <p className="mt-2">Made with love by Dr Puja Munjal,Mehak Arora,  Kunal Srivastava and Lakshay juneja</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
