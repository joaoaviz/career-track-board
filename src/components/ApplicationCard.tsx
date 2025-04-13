
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Application, getStatusLabel } from "@/types/application";
import { 
  Briefcase, Building, Mail, Linkedin, MapPin, Calendar, Edit, Trash2 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

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
  const { id, jobTitle, companyName, contactEmail, linkedinUrl, location, status, createdAt, updatedAt } = application;

  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      "not-sent": "bg-status-not-sent",
      "sent": "bg-status-sent",
      "response-positive": "bg-status-response-positive",
      "response-negative": "bg-status-response-negative",
      "interview-scheduled": "bg-status-interview-scheduled",
      "interview-done": "bg-status-interview-done",
      "waiting": "bg-status-waiting"
    };
    return statusColors[status] || "bg-gray-200";
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  };

  return (
    <Card className="w-full h-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold line-clamp-2">{jobTitle}</h3>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Building size={16} />
              <span className="line-clamp-1">{companyName}</span>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {getStatusLabel(status)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 py-0">
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-muted-foreground flex-shrink-0" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-muted-foreground flex-shrink-0" />
            <a 
              href={`mailto:${contactEmail}`} 
              className="text-sm text-blue-600 hover:underline line-clamp-1"
            >
              {contactEmail}
            </a>
          </div>
          
          {linkedinUrl && (
            <div className="flex items-center gap-2">
              <Linkedin size={16} className="text-muted-foreground flex-shrink-0" />
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-blue-600 hover:underline line-clamp-1"
              >
                Voir sur LinkedIn
              </a>
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            <Calendar size={16} className="text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground">
              Mise à jour {formatDate(updatedAt)}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(application)}
          className="h-8 px-2 text-blue-600"
        >
          <Edit size={16} className="mr-1" />
          <span>Modifier</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDelete(id)}
          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 size={16} className="mr-1" />
          <span>Supprimer</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
