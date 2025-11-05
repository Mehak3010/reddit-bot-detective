import { UserData } from "./csvParser";
import { analyzeWithIsolationForest, analyzeWithSVM, analyzeWithEllipticEnvelope, analyzeWithLOF } from "./botDetection";

export const calculatePerformanceData = (users: UserData[]) => {
  const models = ["svm", "elliptic", "lof"];
  const metrics = ["Precision", "Recall", "F1-Score", "Accuracy"];
  const performance: { [key: string]: any } = {};

  metrics.forEach(metric => {
    performance[metric] = { metric };
  });

  models.forEach(model => {
    let tp = 0, fp = 0, tn = 0, fn = 0;

    users.forEach(user => {
      const groundTruth = analyzeWithIsolationForest(user).isBot;
      let prediction = false;

      switch (model) {
        case "svm":
          prediction = analyzeWithSVM(user).isBot;
          break;
        case "elliptic":
          prediction = analyzeWithEllipticEnvelope(user).isBot;
          break;
        case "lof":
          prediction = analyzeWithLOF(user).isBot;
          break;
      }

      if (prediction && groundTruth) {
        tp++;
      } else if (prediction && !groundTruth) {
        fp++;
      } else if (!prediction && !groundTruth) {
        tn++;
      } else if (!prediction && groundTruth) {
        fn++;
      }
    });

    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
    const accuracy = (tp + tn) / (tp + tn + fp + fn) || 0;

    performance["Precision"][model] = precision;
    performance["Recall"][model] = recall;
    performance["F1-Score"][model] = f1Score;
    performance["Accuracy"][model] = accuracy;
  });

  // Add perfect scores for Isolation Forest (ground truth)
  metrics.forEach(metric => {
    performance[metric]["isolation"] = 1.0;
  });

  return Object.values(performance);
};

export const calculateRadarData = (users: UserData[]) => {
  const models = ["isolation", "svm", "elliptic", "lof"];
  const radarData: any[] = [];

  // Initialize counters for each model
  const modelCounters: { [key: string]: { speed: number, accuracy: number, scalability: number, robustness: number, interpretability: number, count: number } } = {};
  
  models.forEach(model => {
    modelCounters[model] = { speed: 0, accuracy: 0, scalability: 0, robustness: 0, interpretability: 0, count: 0 };
  });

  users.forEach(user => {
    models.forEach(model => {
      let prediction;
      switch (model) {
        case "isolation":
          prediction = analyzeWithIsolationForest(user);
          break;
        case "svm":
          prediction = analyzeWithSVM(user);
          break;
        case "elliptic":
          prediction = analyzeWithEllipticEnvelope(user);
          break;
        case "lof":
          prediction = analyzeWithLOF(user);
          break;
      }

      if (prediction) {
        // Calculate processing speed based on model complexity
        switch (model) {
          case "isolation":
            modelCounters[model].speed += 95; // Fast - tree-based algorithm
            break;
          case "svm":
            modelCounters[model].speed += 65; // Moderate - optimization-based
            break;
          case "elliptic":
            modelCounters[model].speed += 88; // Fast - statistical method
            break;
          case "lof":
            modelCounters[model].speed += 70; // Moderate - density-based
            break;
        }
        
        modelCounters[model].accuracy += prediction.isBot ? 1 : 0;
        modelCounters[model].scalability += user.comment_count > 10 ? 1 : 0;
        modelCounters[model].robustness += prediction.suspicionFactors.length > 1 ? 1 : 0;
        modelCounters[model].interpretability += prediction.suspicionFactors.length > 0 ? 1 : 0;
        modelCounters[model].count++;
      }
    });
  });

  // Calculate averages and create radar data
  models.forEach(model => {
    const counter = modelCounters[model];
    const validCount = Math.max(counter.count, 1); // Avoid division by zero
    
    radarData.push({
      feature: "Speed",
      [model]: counter.speed / validCount
    });
    radarData.push({
      feature: "Accuracy",
      [model]: (counter.accuracy / validCount) * 100
    });
    radarData.push({
      feature: "Scalability",
      [model]: (counter.scalability / validCount) * 100
    });
    radarData.push({
      feature: "Robustness",
      [model]: (counter.robustness / validCount) * 100
    });
    radarData.push({
      feature: "Interpretability",
      [model]: (counter.interpretability / validCount) * 100
    });
  });

  return radarData;
};

export const calculateDetectionTrend = (users: UserData[]) => {
  const thresholds = [0, 20, 40, 60, 80, 100];
  const detectionTrend: any[] = [];

  thresholds.forEach(threshold => {
    const trend = { threshold };
    const models = ["isolation", "svm", "elliptic", "lof"];

    models.forEach(model => {
      let detectionRate = 0;

      users.forEach(user => {
        let prediction;
        switch (model) {
          case "isolation":
            prediction = analyzeWithIsolationForest(user);
            break;
          case "svm":
            prediction = analyzeWithSVM(user);
            break;
          case "elliptic":
            prediction = analyzeWithEllipticEnvelope(user);
            break;
          case "lof":
            prediction = analyzeWithLOF(user);
            break;
        }

        if (prediction && prediction.confidence * 100 >= threshold) {
          detectionRate++;
        }
      });

      (trend as any)[model] = (detectionRate / users.length) * 100;
    });

    detectionTrend.push(trend);
  });

  return detectionTrend;
};