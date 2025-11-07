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
  );
};

export default UserAnalysisSection;
