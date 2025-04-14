
import React, { useState, useEffect } from "react";
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
  XCircle, 
  Loader2
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { useApplications } from "@/context/ApplicationContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TimelineComment {
  id: string;
  notes: string;
  created_at: string;
}

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
  const { status, createdAt, updatedAt, id } = application;
  const [comment, setComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isSavingComment, setIsSavingComment] = useState(false);
  const [comments, setComments] = useState<TimelineComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const { addCommentToApplication } = useApplications();

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  };

  // Fetch comments when timeline expands
  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, id]);

  const fetchComments = async () => {
    if (!id) return;
    
    setIsLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('application_timeline')
        .select('*')
        .eq('application_id', id)
        .eq('status', 'comment')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    setIsSavingComment(true);
    try {
      await addCommentToApplication(id, comment);
      // Add the new comment to the local state immediately without refetching
      const newComment = {
        id: 'temp-' + Date.now(),
        notes: comment,
        created_at: new Date().toISOString()
      };
      setComments(prev => [newComment, ...prev]);
      setComment("");
      setIsAddingComment(false);
      toast.success("Commentaire ajouté avec succès");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Erreur lors de l'ajout du commentaire");
    } finally {
      setIsSavingComment(false);
    }
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
          
          {/* Display existing comments */}
          {comments.length > 0 && (
            <div className="mt-3 space-y-2">
              <h4 className="text-xs font-semibold">Commentaires</h4>
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-2 rounded-md text-xs">
                  <p>{comment.notes}</p>
                  <span className="text-[10px] text-gray-500">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: fr })}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {/* Loading indicator for comments */}
          {isLoadingComments && (
            <div className="flex justify-center py-2">
              <Loader2 size={16} className="animate-spin text-muted-foreground" />
            </div>
          )}
          
          {/* Comment section with actual functionality */}
          <div className="pt-2 border-t mt-2">
            {isAddingComment ? (
              <div className="space-y-2">
                <Textarea 
                  placeholder="Ajoutez un commentaire..." 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[60px] text-sm"
                  disabled={isSavingComment}
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsAddingComment(false)}
                    disabled={isSavingComment}
                    className="h-7 text-xs"
                  >
                    Annuler
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleAddComment}
                    disabled={!comment.trim() || isSavingComment}
                    className="h-7 text-xs"
                  >
                    {isSavingComment ? (
                      <>
                        <Loader2 size={12} className="mr-1 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      'Enregistrer'
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingComment(true);
                }}
                className="h-7 p-1 text-xs w-full justify-start"
              >
                <MessageSquare size={14} className="mr-1" />
                Ajouter un commentaire...
              </Button>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
