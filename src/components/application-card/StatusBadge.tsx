
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ApplicationStatus, getStatusLabel, statusOptions } from "@/types/application";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StatusBadgeProps {
  currentStatus: ApplicationStatus;
  onStatusChange: (newStatus: ApplicationStatus) => void;
  getStatusColor: (status: string) => string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  currentStatus, 
  onStatusChange,
  getStatusColor
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2">
          <Badge className={getStatusColor(currentStatus) + " text-xs font-medium"}>
            {getStatusLabel(currentStatus)}
          </Badge>
          <ChevronDown size={14} className="ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statusOptions.map((option) => (
          <DropdownMenuItem 
            key={option.value}
            onClick={() => onStatusChange(option.value as ApplicationStatus)}
            className="cursor-pointer"
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
