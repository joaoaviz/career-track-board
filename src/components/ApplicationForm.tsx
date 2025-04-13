
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Application, ApplicationStatus, statusOptions } from "@/types/application";
import { useApplications } from "@/context/ApplicationContext";

interface ApplicationFormProps {
  application?: Application;
  isOpen: boolean;
  onClose: () => void;
}

const emptyApplication = {
  jobTitle: "",
  companyName: "",
  contactEmail: "",
  linkedinUrl: "",
  location: "",
  status: "not-sent" as ApplicationStatus
};

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  application,
  isOpen,
  onClose
}) => {
  const { addApplication, updateApplication } = useApplications();
  const [formData, setFormData] = useState(emptyApplication);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const isEditing = !!application;

  useEffect(() => {
    if (application) {
      setFormData({
        jobTitle: application.jobTitle,
        companyName: application.companyName,
        contactEmail: application.contactEmail,
        linkedinUrl: application.linkedinUrl,
        location: application.location,
        status: application.status
      });
    } else {
      setFormData(emptyApplication);
    }
    setErrors({});
  }, [application, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as ApplicationStatus }));
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
      !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(formData.linkedinUrl)
    ) {
      newErrors.linkedinUrl = "URL LinkedIn invalide";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isEditing && application) {
      updateApplication(application.id, formData);
    } else {
      addApplication(formData);
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la candidature" : "Ajouter une candidature"}
          </DialogTitle>
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
            <Label htmlFor="linkedinUrl">Lien LinkedIn</Label>
            <Input
              id="linkedinUrl"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              placeholder="https://www.linkedin.com/company/..."
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
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={formData.status} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
