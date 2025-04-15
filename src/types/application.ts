
export type ApplicationStatus = 
  | "not-sent" 
  | "sent" 
  | "response-positive" 
  | "response-negative" 
  | "interview-scheduled" 
  | "interview-done" 
  | "waiting";

export interface Application {
  id: string;
  jobTitle: string;
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  linkedinUrl: string;
  location: string;
  status: ApplicationStatus;
  interviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const statusOptions = [
  { value: "not-sent", label: "Candidature non envoyée" },
  { value: "sent", label: "Candidature envoyée" },
  { value: "response-positive", label: "Réponse reçue - positive" },
  { value: "response-negative", label: "Réponse reçue - négative" },
  { value: "interview-scheduled", label: "Entretien prévu" },
  { value: "interview-done", label: "Entretien passé" },
  { value: "waiting", label: "En attente de réponse" },
];

export const getStatusLabel = (status: ApplicationStatus): string => {
  return statusOptions.find(option => option.value === status)?.label || status;
};
