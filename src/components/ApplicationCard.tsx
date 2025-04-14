
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Application, ApplicationStatus } from "@/types/application";
import { Edit, Trash2 } from "lucide-react";
import { StatusBadge } from "./application-card/StatusBadge";
import { ApplicationDetails } from "./application-card/ApplicationDetails";
import { ApplicationTimeline } from "./application-card/ApplicationTimeline";

interface ApplicationCardProps {
  application: Application;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onDelete
}) => {
  const { id, jobTitle, companyName, status } = application;
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      "not-sent": "bg-status-not-sent border-status-not-sent",
      "sent": "bg-status-sent border-status-sent",
      "response-positive": "bg-status-response-positive border-status-response-positive",
      "response-negative": "bg-status-response-negative border-status-response-negative",
      "interview-scheduled": "bg-status-interview-scheduled border-status-interview-scheduled",
      "interview-done": "bg-status-interview-done border-status-interview-done",
      "waiting": "bg-status-waiting border-status-waiting"
    };
    return statusColors[status] || "bg-gray-200 border-gray-300";
  };

  // Handle status change directly from dropdown without opening the edit form
  const handleStatusChange = (newStatus: ApplicationStatus) => {
    if (newStatus !== status) {
      onEdit({ ...application, status: newStatus });
    }
  };

  // Handle full edit with form
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(application);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <Card className={`w-full h-full shadow-md hover:shadow-lg transition-shadow ${getStatusColor(status)} bg-opacity-10 border-2`}>
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold line-clamp-2">{jobTitle}</h3>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="line-clamp-1">{companyName}</span>
            </div>
          </div>
          
          <StatusBadge 
            currentStatus={status} 
            onStatusChange={handleStatusChange} 
            getStatusColor={getStatusColor}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 py-0">
        <ApplicationDetails application={application} />
        
        <ApplicationTimeline 
          application={application}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleEditClick}
          className="h-8 px-2 text-blue-600"
        >
          <Edit size={16} className="mr-1" />
          <span>Modifier</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDeleteClick}
          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 size={16} className="mr-1" />
          <span>Supprimer</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
