
import React, { useRef, useEffect } from "react";
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
  // Using ref to close the dropdown after selection
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isMenuOpen = useRef(false);

  const handleStatusSelect = (newStatus: ApplicationStatus) => {
    if (newStatus !== currentStatus) {
      onStatusChange(newStatus);
    }
    
    // Close the dropdown menu
    if (triggerRef.current && isMenuOpen.current) {
      triggerRef.current.click();
    }
  };
  
  return (
    <DropdownMenu onOpenChange={(open) => { isMenuOpen.current = open; }}>
      <DropdownMenuTrigger asChild>
        <Button 
          ref={triggerRef} 
          variant="outline" 
          size="sm" 
          className="h-8 px-2"
          onClick={(e) => {
            // Prevent event propagation to parent elements
            e.stopPropagation();
          }}
        >
          <Badge className={getStatusColor(currentStatus) + " text-xs font-medium"}>
            {getStatusLabel(currentStatus)}
          </Badge>
          <ChevronDown size={14} className="ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50 bg-white">
        {statusOptions.map((option) => (
          <DropdownMenuItem 
            key={option.value}
            onClick={(e) => {
              e.stopPropagation();
              handleStatusSelect(option.value as ApplicationStatus);
            }}
            className="cursor-pointer"
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
