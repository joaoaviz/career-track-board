
import React from "react";
import { Application } from "@/types/application";
import { Linkedin, Mail, MapPin } from "lucide-react";

interface ApplicationDetailsProps {
  application: Application;
}

export const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ application }) => {
  const { contactEmail, linkedinUrl, location } = application;
  
  return (
    <div className="grid gap-1">
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-muted-foreground flex-shrink-0" />
        <span className="text-sm line-clamp-1">{location}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Mail size={16} className="text-muted-foreground flex-shrink-0" />
        <a 
          href={`mailto:${contactEmail}`} 
          className="text-sm text-blue-600 hover:underline line-clamp-1"
        >
          {contactEmail}
        </a>
      </div>
      
      {linkedinUrl && (
        <div className="flex items-center gap-2">
          <Linkedin size={16} className="text-muted-foreground flex-shrink-0" />
          <a 
            href={linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-blue-600 hover:underline line-clamp-1"
          >
            Voir sur LinkedIn
          </a>
        </div>
      )}
    </div>
  );
};
