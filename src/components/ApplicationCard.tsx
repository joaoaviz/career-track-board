
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Application, getStatusLabel, statusOptions, ApplicationStatus } from "@/types/application";
import { 
  Briefcase, Building, Mail, Linkedin, MapPin, Calendar, Edit, Trash2,
  MessageSquare, Clock, ChevronDown, CheckCircle, XCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  };

  // Handle status change directly from dropdown
  const handleStatusChange = (newStatus: ApplicationStatus) => {
    onEdit({ ...application, status: newStatus });
  };

  return (
    <Card className={`w-full h-full shadow-md hover:shadow-lg transition-shadow ${getStatusColor(status)} bg-opacity-10 border-2`}>
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold line-clamp-2">{jobTitle}</h3>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Building size={16} />
              <span className="line-clamp-1">{companyName}</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2">
                <Badge className={getStatusColor(status) + " text-xs font-medium"}>
                  {getStatusLabel(status)}
                </Badge>
                <ChevronDown size={14} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statusOptions.map((option) => (
                <DropdownMenuItem 
                  key={option.value}
                  onClick={() => handleStatusChange(option.value as ApplicationStatus)}
                  className="cursor-pointer"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
          
          <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen} className="mt-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-auto w-full flex justify-center">
                <ChevronDown size={16} className={`transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} />
                <span className="sr-only">Voir plus</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2 pt-2 border-t">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-muted-foreground" />
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <span className="text-xs text-muted-foreground">
                        Créée {formatDate(createdAt)}
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-auto">
                      Candidature créée le {new Date(createdAt).toLocaleDateString('fr-FR')}
                    </HoverCardContent>
                  </HoverCard>
                </div>
                
                {status === "sent" && (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-blue-500" />
                    <span className="text-xs">
                      Candidature envoyée le {new Date(updatedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                
                {status === "response-positive" && (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" />
                    <span className="text-xs">
                      Réponse positive reçue le {new Date(updatedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                
                {status === "response-negative" && (
                  <div className="flex items-center gap-2">
                    <XCircle size={14} className="text-red-500" />
                    <span className="text-xs">
                      Réponse négative reçue le {new Date(updatedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                
                {status === "interview-scheduled" && (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-yellow-500" />
                    <span className="text-xs">
                      Entretien prévu le {new Date(updatedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                
                {status === "interview-done" && (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-purple-500" />
                    <span className="text-xs">
                      Entretien passé le {new Date(updatedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                
                {/* Option pour ajouter des commentaires (placeholder UI) */}
                <div className="pt-1">
                  <Button variant="ghost" size="sm" className="h-7 p-1 text-xs w-full justify-start">
                    <MessageSquare size={14} className="mr-1" />
                    Ajouter un commentaire...
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
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
