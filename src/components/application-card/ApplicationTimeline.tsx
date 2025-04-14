
import React from "react";
import { Application } from "@/types/application";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CheckCircle, 
  ChevronDown, 
  Clock, 
  MessageSquare, 
  XCircle 
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface ApplicationTimelineProps {
  application: Application;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({ 
  application, 
  isOpen, 
  onOpenChange 
}) => {
  const { status, createdAt, updatedAt } = application;

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange} className="mt-3">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0 h-auto w-full flex justify-center">
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
  );
};
