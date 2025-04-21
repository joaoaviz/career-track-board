
import React from "react";
import { Application } from "@/types/application";
import { Link, Mail, MapPin, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ApplicationDetailsProps {
  application: Application;
}

export const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ application }) => {
  const { 
    contactEmail, 
    linkedinUrl, // keep the original name since it's from data model, but treat as generic link
    location, 
    contactPhone, 
    interviewDate 
  } = application;
  
  return (
    <div className="grid gap-1">
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-muted-foreground flex-shrink-0" />
        <span className="text-sm line-clamp-1">{location}</span>
      </div>
      
      {contactEmail && (
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-muted-foreground flex-shrink-0" />
          <a 
            href={`mailto:${contactEmail}`} 
            className="text-sm text-blue-600 hover:underline line-clamp-1"
          >
            {contactEmail}
          </a>
        </div>
      )}
      
      {contactPhone && (
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-muted-foreground flex-shrink-0" />
          <a 
            href={`tel:${contactPhone}`} 
            className="text-sm text-blue-600 hover:underline line-clamp-1"
          >
            {contactPhone}
          </a>
        </div>
      )}
      
      {interviewDate && (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-muted-foreground flex-shrink-0" />
          <span className="text-sm line-clamp-1">
            {format(new Date(interviewDate), "PPP")}
          </span>
        </div>
      )}
      
      {linkedinUrl && (
        <div className="flex items-center gap-2">
          <Link size={16} className="text-muted-foreground flex-shrink-0" />
          <a 
            href={linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-blue-600 hover:underline line-clamp-1"
          >
            {linkedinUrl}
          </a>
        </div>
      )}
    </div>
  );
};

