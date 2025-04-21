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
import { ApplicationFormFields } from "./ApplicationFormFields";
import { ApplicationFormDialog } from "./ApplicationFormDialog";
import { validateApplicationForm } from "./ApplicationFormValidation";

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
  const [initialDataRef] = useState({...emptyApplication});
  const [dialogOpen, setDialogOpen] = useState(isOpen);

  const isEditing = !!application;

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
    } else {
      setFormData({...emptyApplication});
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
    const newErrors = validateApplicationForm(formData);
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
    const initial = initialDataRef;
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
  }, [formData, initialDataRef]);

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
    setDialogOpen(true);
  };

  return (
    <>
      <ApplicationFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        title={isEditing ? "Modifier la candidature" : "Ajouter une candidature"}
        description={
          isEditing
            ? "Modifiez les détails de votre candidature ci-dessous."
            : "Ajoutez les détails de votre nouvelle candidature."
        }
        footer={
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
              onClick={handleSubmit}
            >
              {isSubmitting
                ? "Traitement en cours..."
                : isEditing
                ? "Mettre à jour"
                : "Ajouter"}
            </Button>
          </DialogFooter>
        }
      >
        <ApplicationFormFields
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onStatusChange={handleStatusChange}
          onDateChange={handleDateChange}
          isEditing={isEditing}
        />
      </ApplicationFormDialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
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
