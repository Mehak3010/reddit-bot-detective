import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, TrendingUp, Database } from "lucide-react";

const DatasetOverview = () => {
  return (
    <section className="pt-4 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Dataset Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">370</div>
              <p className="text-xs text-muted-foreground">Reddit accounts analyzed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Features</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">31</div>
              <p className="text-xs text-muted-foreground">Behavioral & metadata features</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">24.5</div>
              <p className="text-xs text-muted-foreground">Per user in dataset</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Karma</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-4">15.2K</div>
              <p className="text-xs text-muted-foreground">Total karma per user</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Key Features Analyzed</CardTitle>
            <CardDescription>
              Behavioral patterns and metadata used for bot detection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <p className="font-medium text-sm">Account Metrics</p>
                  <p className="text-xs text-muted-foreground">Karma, age, verification status</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                <div>
                  <p className="font-medium text-sm">Activity Patterns</p>
                  <p className="text-xs text-muted-foreground">Comment frequency, timing patterns</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-chart-3 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-sm">Content Analysis</p>
                  <p className="text-xs text-muted-foreground">Comment length, diversity metrics</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-chart-4 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-sm">Engagement</p>
                  <p className="text-xs text-muted-foreground">Subreddit diversity, interaction rates</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-chart-5 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-sm">Username Patterns</p>
                  <p className="text-xs text-muted-foreground">Length, numeric indicators</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <p className="font-medium text-sm">Temporal Features</p>
                  <p className="text-xs text-muted-foreground">Activity consistency, time gaps</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DatasetOverview;
