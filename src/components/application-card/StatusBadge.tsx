
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ApplicationStatus, getStatusLabel } from "@/types/application";

interface StatusBadgeProps {
  currentStatus: ApplicationStatus;
  getStatusColor: (status: string) => string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  currentStatus, 
  getStatusColor
}) => {
  return (
    <Badge 
      className={`${getStatusColor(currentStatus)} text-xs font-medium text-black`}
    >
      {getStatusLabel(currentStatus)}
    </Badge>
  );
};
