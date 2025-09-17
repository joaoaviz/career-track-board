import React, { createContext, useContext, useState, useEffect } from "react";
import { Application, ApplicationStatus } from "@/types/application";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useUserRole } from "@/hooks/useUserRole";


interface ApplicationContextType {
  applications: Application[];
  addApplication: (application: Omit<Application, "id" | "createdAt" | "updatedAt">) => Promise<Application | undefined>;
  updateApplication: (id: string, application: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => void;
  filteredApplications: Application[];
  setStatusFilter: (status: ApplicationStatus | null) => void;
  setCompanyFilter: (company: string) => void;
  setLocationFilter: (location: string) => void;
  setUserFilter: (userId: string | null) => void;
  statusFilter: ApplicationStatus | null;
  companyFilter: string;
  locationFilter: string;
  userFilter: string | null;
  clearFilters: () => void;
  addCommentToApplication: (applicationId: string, comment: string) => Promise<void>;
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
  const [applications, setApplications] = useState<Application[]>([]);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | null>(null);
  const [companyFilter, setCompanyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [userFilter, setUserFilter] = useState<string | null>(null);
  const { user } = useAuth();
  const { userRole } = useUserRole();
  

  // Fetch applications from Supabase when user or role changes
  useEffect(() => {
    if (user && userRole !== null) {
      fetchApplications();
    } else {
      setApplications([]);
    }
  }, [user, userRole]);

  const fetchApplications = async () => {
    if (!user) return;
    
    try {
      let query = supabase
        .from('applications')
        .select('*');
      
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        // Store user_id for filtering purposes and get user info for managers
        let userFullNames: Record<string, string> = {};
        if (userRole === 'manager') {
          const userIds = [...new Set(data.map(app => app.user_id))];
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds);
          
          userFullNames = Object.fromEntries(
            profiles?.map(p => [p.id, p.full_name || 'Utilisateur inconnu']) || []
          );
        }
        
        // Convert string dates to Date objects and preserve user_id
        const formattedData = data.map(app => ({
          ...app,
          id: app.id,
          jobTitle: app.position,
          companyName: app.company_name,
          contactEmail: app.contact_email || '',
          contactPhone: app.contact_phone || '',
          linkedinUrl: app.application_url || '',
          location: app.location || '',
          status: app.status as ApplicationStatus,
          interviewDate: app.interview_date ? new Date(app.interview_date) : undefined,
          createdAt: new Date(app.created_at),
          updatedAt: new Date(app.updated_at),
          userFullName: userRole === 'manager' ? userFullNames[app.user_id] : undefined,
          user_id: app.user_id // Keep for filtering
        })) as Application[];
        
        setApplications(formattedData);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Erreur lors du chargement des candidatures");
    }
  };

  const addApplication = async (newApp: Omit<Application, "id" | "createdAt" | "updatedAt">): Promise<Application | undefined> => {
    if (!user) return undefined;
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([{
          user_id: user.id,
          position: newApp.jobTitle,
          company_name: newApp.companyName,
          contact_email: newApp.contactEmail,
          contact_phone: newApp.contactPhone,
          application_url: newApp.linkedinUrl,
          location: newApp.location,
          interview_date: newApp.interviewDate?.toISOString(),
          status: newApp.status
        }])
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        const newApplication: Application = {
          ...newApp,
          id: data[0].id,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setApplications(prev => [newApplication, ...prev]);
        toast.success("Candidature ajoutée avec succès");
        return newApplication;
      }
      return undefined;
    } catch (error) {
      console.error("Error adding application:", error);
      toast.error("Erreur lors de l'ajout de la candidature");
      return undefined;
    }
  };

  const updateApplication = async (id: string, updatedFields: Partial<Application>): Promise<void> => {
    if (!user) return Promise.reject("User not authenticated");
    
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          position: updatedFields.jobTitle,
          company_name: updatedFields.companyName,
          contact_email: updatedFields.contactEmail,
          contact_phone: updatedFields.contactPhone,
          application_url: updatedFields.linkedinUrl,
          location: updatedFields.location,
          interview_date: updatedFields.interviewDate?.toISOString(),
          status: updatedFields.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state only after successful database update
      setApplications(prev => 
        prev.map(app => 
          app.id === id 
            ? { ...app, ...updatedFields, updatedAt: new Date() } 
            : app
        )
      );
      
      toast.success("Candidature mise à jour");
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error("Erreur lors de la mise à jour de la candidature");
      return Promise.reject(error);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setApplications(prev => prev.filter(app => app.id !== id));
      toast.success("Candidature supprimée");
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Erreur lors de la suppression de la candidature");
    }
  };

  const addCommentToApplication = async (applicationId: string, comment: string): Promise<void> => {
    if (!user) return Promise.reject("User not authenticated");
    
    try {
      const { error } = await supabase
        .from('application_timeline')
        .insert({
          application_id: applicationId,
          user_id: user.id,
          status: 'comment',
          notes: comment
        });
      
      if (error) throw error;
      
      // We don't need to update the local state here since comments
      // are stored in a separate table and displayed separately
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error adding comment:", error);
      return Promise.reject(error);
    }
  };

  const clearFilters = () => {
    setStatusFilter(null);
    setCompanyFilter("");
    setLocationFilter("");
    setUserFilter(null);
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const matchesCompany = !companyFilter || 
      app.companyName.toLowerCase().includes(companyFilter.toLowerCase());
    const matchesLocation = !locationFilter || 
      app.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesUser = !userFilter || 
      (userRole === 'manager' && (app as any).user_id === userFilter);
    
    return matchesStatus && matchesCompany && matchesLocation && matchesUser;
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
        setUserFilter,
        statusFilter,
        companyFilter,
        locationFilter,
        userFilter,
        clearFilters,
        addCommentToApplication
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
