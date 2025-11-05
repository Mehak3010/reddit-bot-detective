import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, User, Calendar, TrendingUp, MessageSquare, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { searchUserInCSV, UserData } from "@/utils/csvParser";
import { analyzeUser, ModelPrediction } from "@/utils/botDetection";
import { toast } from "sonner";
import { z } from 'zod';

const usernameSchema = z.string()
  .trim()
  .min(1, { message: "Username cannot be empty" })
  .max(50, { message: "Username must be less than 50 characters" })
  .regex(/^[a-zA-Z0-9_-]+$/, { message: "Username can only contain letters, numbers, underscores, and hyphens" });

const UserAnalysisSection = ({ onAnalysis }: { onAnalysis: () => void }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [predictions, setPredictions] = useState<ModelPrediction[]>([]);

  const handleSearch = async () => {
    try {
      // Validate username
      const validatedUsername = usernameSchema.parse(username);
      
      setLoading(true);
      const user = await searchUserInCSV(validatedUsername);
      
      if (user) {
        setUserData(user);
        const analysis = analyzeUser(user);
        setPredictions(analysis);
        toast.success(`Found user: ${user.author_name}`);
        onAnalysis(); // Trigger analysis in parent component
      } else {
        setUserData(null);
        setPredictions([]);
        toast.error('User not found in dataset');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('Error searching for user');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getBotVerdict = () => {
    const botVotes = predictions.filter(p => p.isBot).length;
    if (botVotes >= 3) return { verdict: 'Likely Bot', color: 'destructive', icon: XCircle };
    if (botVotes >= 2) return { verdict: 'Suspicious', color: 'secondary', icon: AlertTriangle };
    return { verdict: 'Likely Human', color: 'default', icon: CheckCircle };
  };

  return (
    <section className="py-12 px-4 md:px-8 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Analyze Specific User</h2>
          <p className="text-muted-foreground">
            Enter a Reddit username to see how each model would classify them
          </p>
        </div>

        <Card className="max-w-2xl mx-auto mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter Reddit username (e.g., RayesArmstrong)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                  maxLength={50}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Analyze'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {userData && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-2xl">{userData.author_name}</CardTitle>
                      <CardDescription>User Profile Analysis</CardDescription>
                    </div>
                  </div>
                  {predictions.length > 0 && (() => {
                    const { verdict, color, icon: Icon } = getBotVerdict();
                    return (
                      <Badge variant={color as any} className="text-sm py-2 px-4 flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {verdict}
                      </Badge>
                    );
                  })()}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Account Age</p>
                      <p className="font-semibold">{userData.account_age_days} days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Karma</p>
                      <p className="font-semibold">{userData.total_karma.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Comments</p>
                      <p className="font-semibold">{userData.comment_count}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Verified Email</p>
                      <p className="font-semibold">{userData.has_verified_email ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="font-semibold mb-2 text-sm">Behavioral Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Karma/Day:</span>
                      <span className="ml-2 font-medium">{userData.karma_per_day.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Subreddits:</span>
                      <span className="ml-2 font-medium">{userData.subreddit_diversity}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg Comment:</span>
                      <span className="ml-2 font-medium">{userData.avg_comment_length.toFixed(0)} chars</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Comment Ratio:</span>
                      <span className="ml-2 font-medium">{(userData.comment_ratio * 100).toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Username Length:</span>
                      <span className="ml-2 font-medium">{userData.username_length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Has Numbers:</span>
                      <span className="ml-2 font-medium">{userData.username_has_number ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {predictions.map((prediction, index) => (
                <Card 
                  key={index} 
                  className={`border-l-4 ${prediction.isBot ? 'border-l-destructive' : 'border-l-green-500'}`}
                  style={{ borderLeftColor: prediction.color }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg" style={{ color: prediction.color }}>
                        {prediction.model}
                      </CardTitle>
                      <Badge variant={prediction.isBot ? 'destructive' : 'default'}>
                        {prediction.isBot ? 'Bot Detected' : 'Human'}
                      </Badge>
                    </div>
                    <CardDescription>
                      Confidence: {(prediction.confidence * 100).toFixed(1)}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">
                        {prediction.isBot ? 'Suspicion Factors:' : 'Analysis:'}
                      </h4>
                      <ul className="space-y-1">
                        {prediction.suspicionFactors.map((factor, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-xs mt-1">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default UserAnalysisSection;
