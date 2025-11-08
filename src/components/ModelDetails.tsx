import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

interface ModelDetailsProps {
  performanceData: any[];
  radarData: any[];
}

const ModelDetails = ({ performanceData, radarData }: ModelDetailsProps) => {
  const getAccuracy = (modelName: string) => {
    if (performanceData.length === 0) return "N/A";
    const accuracyMetric = performanceData.find((d) => d.metric === "Accuracy");
    return accuracyMetric && accuracyMetric[modelName] !== undefined 
      ? `${(accuracyMetric[modelName] * 100).toFixed(0)}%` 
      : "N/A";
  };

  const getSpeed = (modelName: string) => {
    if (radarData.length === 0) return "N/A";
    const speedFeature = radarData.find((d) => d.feature === "Speed");
    return speedFeature && speedFeature[modelName] !== undefined 
      ? `${Math.round(speedFeature[modelName])}` 
      : "N/A";
  };

  const getModelKey = (modelName: string): string => {
    switch (modelName) {
      case "Isolation Forest":
        return "isolation";
      case "One-Class SVM":
        return "svm";
      case "Elliptic Envelope":
        return "elliptic";
      case "Local Outlier Factor":
        return "lof";
      default:
        return "";
    }
  };

  const modelDetailsData = [
    {
      value: "isolation",
      name: "Isolation Forest",
      badge: "Best Overall",
      description: "Tree-based anomaly detection algorithm that isolates observations",
      strengths: [
        "Excellent performance with high-dimensional data",
        "Fast training and prediction times",
        "Minimal parameter tuning required",
        "Handles large datasets efficiently",
      ],
      limitations: [
        "May struggle with normal data having multiple modes",
        "Less interpretable than some other methods",
      ],
    },
    {
      value: "svm",
      name: "One-Class SVM",
      badge: "Best Recall",
      description: "Learns a decision boundary around the normal data class",
      strengths: [
        "Robust to outliers in training data",
        "Effective with non-linear decision boundaries",
        "Strong theoretical foundation",
        "Highest recall among tested models",
      ],
      limitations: [
        "Slower training time compared to Isolation Forest",
        "Sensitive to parameter selection (kernel, nu)",
        "Less scalable to very large datasets",
      ],
    },
    {
      value: "elliptic",
      name: "Elliptic Envelope",
      badge: "Most Interpretable",
      description: "Assumes data follows a Gaussian distribution and fits an ellipse",
      strengths: [
        "Simple and interpretable approach",
        "Works well when data is normally distributed",
        "Fast computation for small to medium datasets",
        "Easy to visualize in lower dimensions",
      ],
      limitations: [
        "Assumes Gaussian distribution (may not fit real data)",
        "Sensitive to outliers in training data",
        "Lower accuracy compared to other methods",
      ],
    },
    {
      value: "lof",
      name: "Local Outlier Factor",
      badge: "Best Robustness",
      description: "Density-based approach measuring local deviation of data points",
      strengths: [
        "Excellent at detecting local anomalies",
        "Does not assume global data distribution",
        "Handles varying density regions well",
        "Robust to different types of anomalies",
      ],
      limitations: [
        "Computationally expensive for large datasets",
        "Sensitive to number of neighbors parameter",
        "Struggles with high-dimensional data",
      ],
    },
  ];

  return (
    <section className="pt-4 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Model Deep Dive</h2>

        <Tabs defaultValue="isolation" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {modelDetailsData.map((model) => (
              <TabsTrigger key={model.value} value={model.value}>
                {model.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {modelDetailsData.map((model) => (
            <TabsContent key={model.value} value={model.value} className="mt-6">
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-primary">{model.name}</CardTitle>
                    <Badge variant="default">{model.badge}</Badge>
                  </div>
                  <CardDescription>{model.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Strengths
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {model.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      Limitations
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {model.limitations.map((limitation, i) => (
                        <li key={i}>{limitation}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                        <p className="font-semibold">{getAccuracy(getModelKey(model.name))}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ModelDetails;
