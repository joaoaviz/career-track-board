
import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Application, ApplicationStatus, statusOptions } from "@/types/application";
import { useApplications } from "@/context/ApplicationContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface ApplicationFormProps {
  application?: Application;
  isOpen: boolean;
  onClose: () => void;
}

const emptyApplication = {
  jobTitle: "",
  companyName: "",
  contactEmail: "",
  contactPhone: "",
  linkedinUrl: "",
  location: "",
  status: "not-sent" as ApplicationStatus,
  interviewDate: undefined,
  comment: "",
};

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  application,
  isOpen,
  onClose
}) => {
  const { addApplication, updateApplication, addCommentToApplication } = useApplications();
  const [formData, setFormData] = useState({...emptyApplication});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingCloseReason, setPendingCloseReason] = useState<null | "close" | "outside">(null);
  const initialDataRef = useRef({...emptyApplication});
  const [dialogOpen, setDialogOpen] = useState(isOpen);

  const isEditing = !!application;

  // Update dialog open state when isOpen prop changes
  useEffect(() => {
    setDialogOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (application) {
      const updatedFormData = {
        jobTitle: application.jobTitle,
        companyName: application.companyName,
        contactEmail: application.contactEmail || "",
        contactPhone: application.contactPhone || "",
        linkedinUrl: application.linkedinUrl || "",
        location: application.location || "",
        status: application.status,
        interviewDate: application.interviewDate,
        comment: "",
      };
      setFormData(updatedFormData);
      initialDataRef.current = { ...updatedFormData };
    } else {
      setFormData({...emptyApplication});
      initialDataRef.current = {...emptyApplication};
    }
    setErrors({});
  }, [application, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as ApplicationStatus }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, interviewDate: date }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Le nom du poste est requis";
    }
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Le nom de l'entreprise est requis";
    }
    
    if (formData.contactEmail && !/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Email invalide";
    }
    
    if (
      formData.linkedinUrl && 
      !formData.linkedinUrl.startsWith('http://') && 
      !formData.linkedinUrl.startsWith('https://')
    ) {
      newErrors.linkedinUrl = "URL invalide. Doit commencer par http:// ou https://";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEditing && application) {
        await updateApplication(application.id, formData);
        if (formData.comment) {
          await addCommentToApplication(application.id, formData.comment);
        }
      } else {
        const newApp = await addApplication(formData);
        if (formData.comment && newApp?.id) {
          await addCommentToApplication(newApp.id, formData.comment);
        }
      }
      setShowConfirmDialog(false);
      setDialogOpen(false);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDirty = React.useMemo(() => {
    const initial = initialDataRef.current;
    return (
      initial.jobTitle !== formData.jobTitle ||
      initial.companyName !== formData.companyName ||
      initial.contactEmail !== formData.contactEmail ||
      initial.contactPhone !== formData.contactPhone ||
      initial.linkedinUrl !== formData.linkedinUrl ||
      initial.location !== formData.location ||
      initial.status !== formData.status ||
      (initial.interviewDate?.toString() || "") !== (formData.interviewDate?.toString() || "") ||
      formData.comment.trim() !== ""
    );
  }, [formData]);

  const handleInternalClose = (reason: "close" | "outside") => {
    if (isDirty && !isSubmitting) {
      setPendingCloseReason(reason);
      setShowConfirmDialog(true);
    } else {
      setDialogOpen(false);
      onClose();
    }
  };

  const handleCancel = () => {
    handleInternalClose("close");
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      handleInternalClose("outside");
    } else {
      setDialogOpen(true);
    }
  };

  const confirmClose = () => {
    setShowConfirmDialog(false);
    setDialogOpen(false);
    onClose();
  };

  const cancelClose = () => {
    setShowConfirmDialog(false);
    setPendingCloseReason(null);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifier la candidature" : "Ajouter une candidature"}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "Modifiez les détails de votre candidature ci-dessous." : "Ajoutez les détails de votre nouvelle candidature."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Nom du poste *</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Développeur Frontend, Chef de Projet, etc."
                className={errors.jobTitle ? "border-red-500" : ""}
              />
              {errors.jobTitle && (
                <p className="text-red-500 text-xs">{errors.jobTitle}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Nom de l'entreprise *</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Nom de l'entreprise"
                className={errors.companyName ? "border-red-500" : ""}
              />
              {errors.companyName && (
                <p className="text-red-500 text-xs">{errors.companyName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de contact</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="contact@entreprise.com"
                className={errors.contactEmail ? "border-red-500" : ""}
              />
              {errors.contactEmail && (
                <p className="text-red-500 text-xs">{errors.contactEmail}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Téléphone de contact</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+33 1 23 45 67 89"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">Lien</Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://www.example.com/..."
                className={errors.linkedinUrl ? "border-red-500" : ""}
              />
              {errors.linkedinUrl && (
                <p className="text-red-500 text-xs">{errors.linkedinUrl}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Paris, Marseille, Remote, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Date d'entretien</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.interviewDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.interviewDate ? (
                      format(formData.interviewDate, "PPP")
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50">
                  <Calendar
                    mode="single"
                    selected={formData.interviewDate}
                    onSelect={handleDateChange}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={formData.status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent className="z-50 max-h-60">
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Commentaire</Label>
              <Textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Ajoutez un commentaire à propos de cette candidature..."
                className="min-h-[100px]"
              />
            </div>
            
            <DialogFooter className="mt-6 flex-col sm:flex-row gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Traitement en cours..." : isEditing ? "Mettre à jour" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Abandonner les modifications&nbsp;?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous avez effectué des modifications qui n'ont pas été enregistrées.<br />
              Êtes-vous sûr de vouloir quitter et perdre ces informations&nbsp;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelClose}>Continuer l'édition</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose}>Abandonner</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
