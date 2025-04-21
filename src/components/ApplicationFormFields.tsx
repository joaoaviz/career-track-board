
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApplicationStatus, statusOptions } from "@/types/application";

interface ApplicationFormFieldsProps {
  formData: Record<string, any>;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onStatusChange: (status: string) => void;
  onDateChange: (date: Date | undefined) => void;
  isEditing: boolean;
}

export const ApplicationFormFields: React.FC<ApplicationFormFieldsProps> = ({
  formData,
  errors,
  onChange,
  onStatusChange,
  onDateChange,
}) => (
  <>
    <div className="space-y-2">
      <Label htmlFor="jobTitle">Nom du poste *</Label>
      <Input
        id="jobTitle"
        name="jobTitle"
        value={formData.jobTitle}
        onChange={onChange}
        placeholder="Développeur Frontend, Chef de Projet, etc."
        className={errors.jobTitle ? "border-red-500" : ""}
      />
      {errors.jobTitle && <p className="text-red-500 text-xs">{errors.jobTitle}</p>}
    </div>
    <div className="space-y-2">
      <Label htmlFor="companyName">Nom de l'entreprise *</Label>
      <Input
        id="companyName"
        name="companyName"
        value={formData.companyName}
        onChange={onChange}
        placeholder="Nom de l'entreprise"
        className={errors.companyName ? "border-red-500" : ""}
      />
      {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName}</p>}
    </div>
    <div className="space-y-2">
      <Label htmlFor="contactEmail">Email de contact</Label>
      <Input
        id="contactEmail"
        name="contactEmail"
        type="email"
        value={formData.contactEmail}
        onChange={onChange}
        placeholder="contact@entreprise.com"
        className={errors.contactEmail ? "border-red-500" : ""}
      />
      {errors.contactEmail && <p className="text-red-500 text-xs">{errors.contactEmail}</p>}
    </div>
    <div className="space-y-2">
      <Label htmlFor="contactPhone">Téléphone de contact</Label>
      <Input
        id="contactPhone"
        name="contactPhone"
        type="tel"
        value={formData.contactPhone}
        onChange={onChange}
        placeholder="+33 1 23 45 67 89"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="urlField">Lien</Label>
      <Input
        id="urlField"
        name="linkedinUrl"
        value={formData.linkedinUrl}
        onChange={onChange}
        placeholder="https://www.example.com/..."
        className={errors.linkedinUrl ? "border-red-500" : ""}
      />
      {errors.linkedinUrl && <p className="text-red-500 text-xs">{errors.linkedinUrl}</p>}
    </div>
    <div className="space-y-2">
      <Label htmlFor="location">Localisation</Label>
      <Input
        id="location"
        name="location"
        value={formData.location}
        onChange={onChange}
        placeholder="Paris, Marseille, Remote, etc."
      />
    </div>
    <div className="space-y-2">
      <Label>Date d'entretien</Label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full justify-start text-left font-normal border rounded-md px-3 py-2",
              !formData.interviewDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 inline" />
            {formData.interviewDate ? (
              format(formData.interviewDate, "PPP")
            ) : (
              <span>Sélectionner une date</span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-50">
          <Calendar
            mode="single"
            selected={formData.interviewDate}
            onSelect={onDateChange}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
    <div className="space-y-2">
      <Label htmlFor="status">Statut</Label>
      <Select value={formData.status} onValueChange={onStatusChange}>
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
        onChange={onChange}
        placeholder="Ajoutez un commentaire à propos de cette candidature..."
        className="min-h-[100px]"
      />
    </div>
  </>
);

