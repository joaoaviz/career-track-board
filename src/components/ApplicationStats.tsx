import React, { useState } from "react";
import { useApplications } from "@/context/ApplicationContext";
import { Application, ApplicationStatus } from "@/types/application";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPie, MessageSquareText, ThumbsUp, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export const ApplicationStats = () => {
  const { applications, setStatusFilter } = useApplications();
  const [isOpen, setIsOpen] = useState(true);
  
  const getStatusCount = (status: ApplicationStatus): number => {
    return applications.filter(app => app.status === status).length;
  };
  
  const stats = [
    {
      title: "Total de candidatures",
      value: applications.length,
      icon: ChartPie,
      className: "bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 hover:from-primary/10 hover:via-primary/15 hover:to-primary/10 cursor-pointer transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(147,51,234,0.3)] border-primary/20",
      iconClassName: "text-primary",
      onClick: () => setStatusFilter(null)
    },
    {
      title: "Réponses reçues",
      value: getStatusCount("response-positive") + getStatusCount("response-negative"),
      icon: MessageSquareText,
      className: "bg-gradient-to-br from-purple-500/5 via-purple-500/10 to-purple-500/5 hover:from-purple-500/10 hover:via-purple-500/15 hover:to-purple-500/10 cursor-pointer transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] border-purple-500/20",
      iconClassName: "text-purple-500",
      onClick: () => {
        const currentFilter = "response-positive";
        setStatusFilter(currentFilter);
      }
    },
    {
      title: "Réponses positives",
      value: getStatusCount("response-positive"),
      icon: ThumbsUp,
      className: "bg-gradient-to-br from-green-500/5 via-green-500/10 to-green-500/5 hover:from-green-500/10 hover:via-green-500/15 hover:to-green-500/10 cursor-pointer transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)] border-green-500/20",
      iconClassName: "text-green-500",
      onClick: () => setStatusFilter("response-positive")
    },
    {
      title: "Entretiens prévus",
      value: getStatusCount("interview-scheduled"),
      icon: Calendar,
      className: "bg-gradient-to-br from-amber-500/5 via-amber-500/10 to-amber-500/5 hover:from-amber-500/10 hover:via-amber-500/15 hover:to-amber-500/10 cursor-pointer transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)] border-amber-500/20",
      iconClassName: "text-amber-500",
      onClick: () => setStatusFilter("interview-scheduled")
    }
  ];

  const StatCard = ({ stat }: { stat: typeof stats[0] }) => (
    <Card 
      className={cn(
        "relative overflow-hidden backdrop-blur-sm border group animate-in fade-in-50 duration-1000",
        "hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500",
        stat.className
      )}
      onClick={stat.onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 dark:to-white/10" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {stat.title}
        </CardTitle>
        <div className="relative">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-transparent to-primary/20 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
          <stat.icon className={cn(
            "h-4 w-4 relative z-10 transition-transform duration-500 group-hover:scale-110",
            stat.iconClassName
          )} />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-xl md:text-2xl font-bold tracking-tight animate-in slide-in-from-left-5 duration-1000">
          {stat.value}
        </div>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );

  return (
    <div className="mb-8 relative">
      {/* Mobile Collapsible Stats */}
      <div className="md:hidden">
        <Collapsible 
          open={isOpen} 
          onOpenChange={setIsOpen}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary animate-shimmer bg-[length:200%_100%]">
              Tableau de bord
            </h2>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-8 w-8 hover:bg-primary/10 rounded-full transition-colors duration-300"
              >
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 text-primary transition-transform duration-300",
                    isOpen ? "rotate-180" : ""
                  )} 
                />
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <div key={stat.title} className="animate-in fade-in-50 duration-1000" style={{ animationDelay: `${index * 100}ms` }}>
                  <StatCard stat={stat} />
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Desktop Stats */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={stat.title} className="animate-in fade-in-50 duration-1000" style={{ animationDelay: `${index * 100}ms` }}>
            <StatCard stat={stat} />
          </div>
        ))}
      </div>
    </div>
  );
};
