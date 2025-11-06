import { UserData } from './csvParser';

export interface ModelPrediction {
  model: string;
  isBot: boolean;
  confidence: number;
  suspicionFactors: string[];
  color: string;
}

// Simulated bot detection logic based on behavioral patterns
export const analyzeWithIsolationForest = (user: UserData): ModelPrediction => {
  const suspicionFactors: string[] = [];
  let suspicionScore = 0;

  // High posting frequency
  if (user.karma_per_day > 50) {
    suspicionFactors.push('Unusually high karma accumulation rate');
    suspicionScore += 30;
  }

  // Very consistent posting patterns (low std deviation)
  if (user.std_comment_length < 100 && user.comment_count > 5) {
    suspicionFactors.push('Highly consistent comment patterns');
    suspicionScore += 25;
  }

  // Low subreddit diversity
  if (user.subreddit_diversity < 8 && user.comment_count > 10) {
    suspicionFactors.push('Limited subreddit diversity');
    suspicionScore += 20;
  }

  // Unverified email
  if (!user.has_verified_email) {
    suspicionFactors.push('Unverified email address');
    suspicionScore += 15;
  }

  // Username patterns
  if (user.username_has_number && user.username_length < 10) {
    suspicionFactors.push('Generic username pattern');
    suspicionScore += 20;
  }

  const isBot = suspicionScore > 30;
  const confidence = Math.min(suspicionScore / 100, 0.95);

  return {
    model: 'Isolation Forest',
    isBot,
    confidence,
    suspicionFactors: suspicionFactors.length > 0 ? suspicionFactors : ['Normal user behavior detected'],
    color: 'hsl(var(--chart-1))',
  };
};

export const analyzeWithSVM = (user: UserData): ModelPrediction => {
  const suspicionFactors: string[] = [];
  let suspicionScore = 0;

  // Extreme karma ratios
  if (user.comment_ratio < 0.15 || user.comment_ratio > 0.9) {
    suspicionFactors.push('Unusual comment/link karma ratio');
    suspicionScore += 35;
  }

  // Very frequent posting
  if (user.avg_time_between_comments < 5400 && user.comment_count > 10) {
    suspicionFactors.push('Rapid posting frequency');
    suspicionScore += 30;
  }

  // Account age vs activity
  if (user.account_age_days < 60 && user.total_karma > 3000) {
    suspicionFactors.push('High karma for young account');
    suspicionScore += 25;
  }

  // Profile completeness
  if (!user.has_verified_email && !user.is_gold) {
    suspicionFactors.push('Incomplete profile setup');
    suspicionScore += 20;
  }

  const isBot = suspicionScore > 35;
  const confidence = Math.min(suspicionScore / 100, 0.92);

  return {
    model: 'One-Class SVM',
    isBot,
    confidence,
    suspicionFactors: suspicionFactors.length > 0 ? suspicionFactors : ['Behavior within normal boundaries'],
    color: 'hsl(var(--chart-2))',
  };
};

export const analyzeWithEllipticEnvelope = (user: UserData): ModelPrediction => {
  const suspicionFactors: string[] = [];
  let suspicionScore = 0;

  // Statistical outliers in karma
  if (user.karma_per_day > 80 || user.karma_per_day < 0.05) {
    suspicionFactors.push('Karma rate deviates from normal distribution');
    suspicionScore += 35;
  }

  // Comment length patterns
  if (user.avg_comment_length > 400 || user.avg_comment_length < 30) {
    suspicionFactors.push('Abnormal comment length patterns');
    suspicionScore += 25;
  }

  // Activity consistency
  if (user.std_comment_length > 250 || user.std_comment_length < 20) {
    suspicionFactors.push('High variance in comment behavior');
    suspicionScore += 20;
  }

  const isBot = suspicionScore > 28;
  const confidence = Math.min(suspicionScore / 100, 0.88);

  return {
    model: 'Elliptic Envelope',
    isBot,
    confidence,
    suspicionFactors: suspicionFactors.length > 0 ? suspicionFactors : ['Fits normal user distribution'],
    color: 'hsl(var(--chart-3))',
  };
};

export const analyzeWithLOF = (user: UserData): ModelPrediction => {
  const suspicionFactors: string[] = [];
  let suspicionScore = 0;

  // Local density analysis
  const activityDensity = user.comment_count / Math.max(user.account_age_days, 1);
  if (activityDensity > 3) {
    suspicionFactors.push('High local activity density');
    suspicionScore += 30;
  }

  // Engagement patterns
  if (user.subreddit_diversity < 6 && user.comment_count > 8) {
    suspicionFactors.push('Concentrated subreddit activity');
    suspicionScore += 25;
  }

  // Temporal patterns
  if (user.avg_time_between_comments < 3600 && user.comment_count > 5) {
    suspicionFactors.push('Unusually regular posting intervals');
    suspicionScore += 30;
  }

  // Authentication factors
  if (!user.has_verified_email && user.total_karma > 500) {
    suspicionFactors.push('High activity without verification');
    suspicionScore += 20;
  }

  const isBot = suspicionScore > 25;
  const confidence = Math.min(0.05 + suspicionScore / 110, 0.91);

  return {
    model: 'Local Outlier Factor',
    isBot,
    confidence,
    suspicionFactors: suspicionFactors.length > 0 ? suspicionFactors : ['Normal local density patterns'],
    color: 'hsl(var(--chart-4))',
  };
};

export const analyzeUser = (user: UserData): ModelPrediction[] => {
  return [
    analyzeWithIsolationForest(user),
    analyzeWithSVM(user),
    analyzeWithEllipticEnvelope(user),
    analyzeWithLOF(user),
  ];
};
