import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  LineChart as ReLineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

type PerformanceSwitcherProps = {
  performanceData: any[];
  radarData: any[];
  detectionTrend: any[];
};

const PerformanceSwitcher = ({ performanceData, radarData, detectionTrend }: PerformanceSwitcherProps) => {
  return (
    <section className="pt-4 pb-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle>Model Performance Comparison</CardTitle>
            <Tabs defaultValue="metrics" className="w-full md:w-auto">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="metrics" className="flex-1">Metrics</TabsTrigger>
                <TabsTrigger value="characteristics" className="flex-1">Characteristics</TabsTrigger>
                <TabsTrigger value="trend" className="flex-1">Detection Trend</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="metrics">
              <TabsContent value="metrics">
                <div className="w-full overflow-x-auto">
                  <ReBarChart width={600} height={300} data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" />
                    <YAxis />
                    <ReTooltip />
                    <Legend />
                    <Bar dataKey="accuracy" fill="#4f46e5" name="Accuracy" />
                    <Bar dataKey="precision" fill="#06b6d4" name="Precision" />
                    <Bar dataKey="recall" fill="#f59e0b" name="Recall" />
                  </ReBarChart>
                </div>
              </TabsContent>

              <TabsContent value="characteristics">
                <div className="w-full overflow-x-auto">
                  <ReRadarChart width={600} height={300} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="attribute" />
                    <Radar dataKey="Isolation Forest" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                    <Radar dataKey="One-Class SVM" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                    <Radar dataKey="Elliptic Envelope" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                  </ReRadarChart>
                </div>
              </TabsContent>

              <TabsContent value="trend">
                <div className="w-full overflow-x-auto">
                  <ReLineChart width={600} height={300} data={detectionTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="threshold" />
                    <YAxis />
                    <ReTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Isolation Forest" stroke="#4f46e5" />
                    <Line type="monotone" dataKey="One-Class SVM" stroke="#06b6d4" />
                    <Line type="monotone" dataKey="Elliptic Envelope" stroke="#f59e0b" />
                  </ReLineChart>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PerformanceSwitcher;