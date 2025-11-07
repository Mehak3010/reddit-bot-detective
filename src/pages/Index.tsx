import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ModelCards from "@/components/ModelCards";
import DatasetOverview from "@/components/DatasetOverview";
import ModelComparison from "@/components/ModelComparison";
import ModelDetails from "@/components/ModelDetails";
import { getUsersFromCSV, UserData } from "@/utils/csvParser";
import { calculatePerformanceData, calculateRadarData, calculateDetectionTrend } from "@/utils/graphUtils";

const Index = () => {
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [detectionTrend, setDetectionTrend] = useState<any[]>([]);
  const [analysisPerformed, setAnalysisPerformed] = useState(false);

  const handleAnalysis = async () => {
    const users = await getUsersFromCSV();
    setPerformanceData(calculatePerformanceData(users));
    setRadarData(calculateRadarData(users));
    setDetectionTrend(calculateDetectionTrend(users));
    setAnalysisPerformed(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onAnalysis={handleAnalysis} />
      <ModelCards />
      <DatasetOverview />
      <ModelComparison
        performanceData={performanceData}
        radarData={radarData}
        detectionTrend={detectionTrend}
      />
      <ModelDetails
        performanceData={analysisPerformed ? performanceData : []}
        radarData={analysisPerformed ? radarData : []}
      />

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
