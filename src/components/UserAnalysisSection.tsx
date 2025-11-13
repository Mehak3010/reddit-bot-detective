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

  return (
    <div className="w-full">
      <div className="flex w-full items-center space-x-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter Reddit username (e.g., RayesArmstrong)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>

      {userData && predictions.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>{userData.author_name}</CardTitle>
              </div>
              {(() => {
                const botVotes = predictions.filter(p => p.isBot).length;
                const overallIsBot = botVotes >= 2; // majority vote among 4 models
                return overallIsBot ? (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" /> Suspicious
                  </Badge>
                ) : (
                  <Badge variant="default" className="flex items-center gap-1 bg-green-600 text-white hover:bg-green-600/90">
                    <CheckCircle className="h-4 w-4" /> Human
                  </Badge>
                );
              })()}
            </div>
            <CardDescription>Summary and model verdicts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-sm">
                <p className="text-muted-foreground">Total karma</p>
                <p className="font-semibold">{userData.total_karma}</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Account age</p>
                <p className="font-semibold">{userData.account_age_days} days</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Verified email</p>
                <p className="font-semibold flex items-center gap-1">
                  {userData.has_verified_email ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  {userData.has_verified_email ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Subreddit diversity</p>
                <p className="font-semibold">{userData.subreddit_diversity}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">Model verdicts</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {predictions.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between border rounded px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-sm">{p.model}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.isBot ? (
                        <Badge variant="destructive">Bot</Badge>
                      ) : (
                        <Badge variant="outline">Human</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">conf: {(p.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserAnalysisSection;
