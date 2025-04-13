
import React, { createContext, useContext, useState, useEffect } from "react";
import { Application, ApplicationStatus } from "@/types/application";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface ApplicationContextType {
  applications: Application[];
  addApplication: (application: Omit<Application, "id" | "createdAt" | "updatedAt">) => void;
  updateApplication: (id: string, application: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  filteredApplications: Application[];
  setStatusFilter: (status: ApplicationStatus | null) => void;
  setCompanyFilter: (company: string) => void;
  setLocationFilter: (location: string) => void;
  statusFilter: ApplicationStatus | null;
  companyFilter: string;
  locationFilter: string;
  clearFilters: () => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplications must be used within an ApplicationProvider");
  }
  return context;
};

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>(() => {
    const savedApplications = localStorage.getItem("jobApplications");
    if (savedApplications) {
      try {
        const parsed = JSON.parse(savedApplications);
        // Convert string dates to Date objects
        return parsed.map((app: any) => ({
          ...app,
          createdAt: new Date(app.createdAt),
          updatedAt: new Date(app.updatedAt)
        }));
      } catch (error) {
        console.error("Erreur lors du chargement des candidatures:", error);
        return [];
      }
    }
    return [];
  });

  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | null>(null);
  const [companyFilter, setCompanyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  // Sauvegarde dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("jobApplications", JSON.stringify(applications));
  }, [applications]);

  const addApplication = (newApp: Omit<Application, "id" | "createdAt" | "updatedAt">) => {
    const application: Application = {
      ...newApp,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setApplications(prev => [...prev, application]);
    toast.success("Candidature ajoutée avec succès");
  };

  const updateApplication = (id: string, updatedFields: Partial<Application>) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id 
          ? { ...app, ...updatedFields, updatedAt: new Date() } 
          : app
      )
    );
    toast.success("Candidature mise à jour");
  };

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    toast.success("Candidature supprimée");
  };

  const clearFilters = () => {
    setStatusFilter(null);
    setCompanyFilter("");
    setLocationFilter("");
  };

  // Filtrage des candidatures
  const filteredApplications = applications.filter(app => {
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const matchesCompany = !companyFilter || 
      app.companyName.toLowerCase().includes(companyFilter.toLowerCase());
    const matchesLocation = !locationFilter || 
      app.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesStatus && matchesCompany && matchesLocation;
  });

  return (
    <ApplicationContext.Provider 
      value={{ 
        applications, 
        addApplication, 
        updateApplication, 
        deleteApplication,
        filteredApplications,
        setStatusFilter,
        setCompanyFilter,
        setLocationFilter,
        statusFilter,
        companyFilter,
        locationFilter,
        clearFilters
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
