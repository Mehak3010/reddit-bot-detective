import { Card } from "@/components/ui/card";

const HeroSection = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Reddit Bot Detection Analysis
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comparative study of unsupervised learning algorithms for detecting automated accounts on Reddit
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="p-6 border-l-4 border-l-primary hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-sm text-muted-foreground mb-1">Model 1</h3>
            <p className="text-lg font-bold text-primary">Isolation Forest</p>
            <p className="text-xs text-muted-foreground mt-2">Tree-based anomaly detection</p>
          </Card>

          <Card className="p-6 border-l-4 border-l-accent hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-sm text-muted-foreground mb-1">Model 2</h3>
            <p className="text-lg font-bold text-accent">One-Class SVM</p>
            <p className="text-xs text-muted-foreground mt-2">Support vector boundaries</p>
          </Card>

          <Card className="p-6 border-l-4 border-l-chart-3 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-sm text-muted-foreground mb-1">Model 3</h3>
            <p className="text-lg font-bold text-chart-3">Elliptic Envelope</p>
            <p className="text-xs text-muted-foreground mt-2">Gaussian distribution fitting</p>
          </Card>

          <Card className="p-6 border-l-4 border-l-chart-4 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-sm text-muted-foreground mb-1">Model 4</h3>
            <p className="text-lg font-bold text-chart-4">Local Outlier Factor</p>
            <p className="text-xs text-muted-foreground mt-2">Density-based detection</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
