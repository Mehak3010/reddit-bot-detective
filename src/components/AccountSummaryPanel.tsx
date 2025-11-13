import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { UserData } from "@/utils/csvParser";
import { ModelPrediction } from "@/utils/botDetection";

interface AccountSummaryPanelProps {
  userData: UserData;
  predictions: ModelPrediction[];
}

const AccountSummaryPanel = ({ userData, predictions }: AccountSummaryPanelProps) => {
  const botVotes = predictions.filter((p) => p.isBot).length;
  const overallIsBot = botVotes >= 2;

  return (
    <section className="px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                <CardTitle>{userData.author_name}</CardTitle>
              </div>
              {overallIsBot ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" /> Suspicious
                </Badge>
              ) : (
                <Badge variant="default" className="flex items-center gap-1 bg-green-600 text-white hover:bg-green-600/90">
                  <CheckCircle className="h-4 w-4" /> Human
                </Badge>
              )}
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
                  {userData.has_verified_email ? "Yes" : "No"}
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
      </div>
    </section>
  );
};

export default AccountSummaryPanel;