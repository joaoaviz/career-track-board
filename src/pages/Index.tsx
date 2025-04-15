
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ApplicationCard } from "@/components/ApplicationCard";
import { ApplicationForm } from "@/components/ApplicationForm";
import { useApplications } from "@/context/ApplicationContext";
import { PlusCircle, Info } from "lucide-react";
import { Application } from "@/types/application";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ApplicationStats } from "@/components/ApplicationStats";
import { SearchBar } from "@/components/SearchBar";

const ApplicationsBoard: React.FC = () => {
  const { filteredApplications, deleteApplication } = useApplications();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | undefined>(undefined);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleAddNewClick = () => {
    setSelectedApplication(undefined);
    setIsFormOpen(true);
  };

  const handleEditApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedApplication(undefined);
  };

  const handleDeleteApplication = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")) {
      deleteApplication(id);
    }
  };

  const hasApplications = filteredApplications.length > 0;

  if (!user) return null;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Suivi de candidatures</h1>
            <p className="text-muted-foreground mt-1">
              Gérez et suivez l'état de vos candidatures professionnelles
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
            <SearchBar />
            <Button 
              onClick={handleAddNewClick}
              className="shrink-0"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nouvelle candidature
            </Button>
          </div>
        </div>
        
        <ApplicationStats />
        
        {!hasApplications && (
          <Alert className="mt-8 bg-blue-50 border-blue-100">
            <Info className="h-5 w-5" />
            <AlertDescription>
              {filteredApplications.length === 0 && applications.length !== 0 
                ? "Aucune candidature ne correspond à votre recherche." 
                : "Vous n'avez pas encore ajouté de candidature. Cliquez sur 'Nouvelle candidature' pour commencer."}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onEdit={handleEditApplication}
              onDelete={handleDeleteApplication}
            />
          ))}
        </div>
        
        <ApplicationForm 
          application={selectedApplication}
          isOpen={isFormOpen}
          onClose={handleCloseForm}
        />
      </div>
    </div>
  );
};

const Index = () => {
  return <ApplicationsBoard />;
};

export default Index;
