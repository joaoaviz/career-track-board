
import React from "react";
import { useApplications } from "@/context/ApplicationContext";
import { Application, ApplicationStatus } from "@/types/application";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPie, MessageSquareText, ThumbsUp, Calendar } from "lucide-react";

export const ApplicationStats = () => {
  const { applications } = useApplications();
  
  const getStatusCount = (status: ApplicationStatus): number => {
    return applications.filter(app => app.status === status).length;
  };
  
  const stats = [
    {
      title: "Total de candidatures",
      value: applications.length,
      icon: ChartPie,
      className: "bg-blue-50",
      iconClassName: "text-blue-500"
    },
    {
      title: "Réponses reçues",
      value: getStatusCount("response-positive") + getStatusCount("response-negative"),
      icon: MessageSquareText,
      className: "bg-purple-50",
      iconClassName: "text-purple-500"
    },
    {
      title: "Réponses positives",
      value: getStatusCount("response-positive"),
      icon: ThumbsUp,
      className: "bg-green-50",
      iconClassName: "text-green-500"
    },
    {
      title: "Entretiens prévus",
      value: getStatusCount("interview-scheduled"),
      icon: Calendar,
      className: "bg-amber-50",
      iconClassName: "text-amber-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className={stat.className}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.iconClassName}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
