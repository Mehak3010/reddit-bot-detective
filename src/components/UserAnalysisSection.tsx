import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, User, Calendar, TrendingUp, MessageSquare, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { searchUserInCSV, UserData } from "@/utils/csvParser";
import { analyzeUser, ModelPrediction } from "@/utils/botDetection";
import { toast } from "sonner";
import { z } from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDatasets } from "@/utils/api";

const usernameSchema = z.string()
  .trim()
  .min(1, { message: "Username cannot be empty" })
  .max(50, { message: "Username must be less than 50 characters" })
  .regex(/^[a-zA-Z0-9_-]+$/, { message: "Username can only contain letters, numbers, underscores, and hyphens" });

const UserAnalysisSection = ({ onAnalysis, onSummary }: { onAnalysis: () => void; onSummary?: (user: UserData, predictions: ModelPrediction[]) => void }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [predictions, setPredictions] = useState<ModelPrediction[]>([]);
  const [datasets, setDatasets] = useState<{ name: string; count: number }[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getDatasets();
        const list = Array.isArray(res?.datasets) ? res.datasets : [];
        setDatasets(list);
      } catch (e) {
        // ignore; UI will still work with CSV fallback
      }
    })();
  }, []);

  const handleSearch = async () => {
    try {
      // Validate username
      const validatedUsername = usernameSchema.parse(username);
      
      setLoading(true);
      const user = await searchUserInCSV(validatedUsername, selectedDataset || undefined);
      
      if (user) {
        setUserData(user);
        const analysis = analyzeUser(user);
        setPredictions(analysis);
        toast.success(`Found user: ${user.author_name}`);
        if (onSummary) onSummary(user, analysis);
        onAnalysis();
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
      <div className="flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter Reddit username (e.g., RayesArmstrong)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 text-sm sm:text-base"
          />
        </div>
        <div className="w-full sm:w-64">
          <Select value={selectedDataset} onValueChange={(v) => setSelectedDataset(v)}>
            <SelectTrigger>
              <SelectValue placeholder="All datasets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All datasets</SelectItem>
              {datasets.map((d) => (
                <SelectItem key={d.name} value={d.name}>{d.name} ({d.count})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSearch} disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>

      {/* Account summary is rendered in main content via AccountSummaryPanel */}
    </div>
  );
};

export default UserAnalysisSection;
