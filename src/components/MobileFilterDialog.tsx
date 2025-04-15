import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { statusOptions } from "@/types/application";
import { useApplications } from "@/context/ApplicationContext";

interface MobileFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyInput: string;
  locationInput: string;
  onCompanyInputChange: (value: string) => void;
  onLocationInputChange: (value: string) => void;
  companies: string[];
  locations: string[];
}

export const MobileFilterDialog: React.FC<MobileFilterDialogProps> = ({
  isOpen,
  onClose,
  companyInput,
  locationInput,
  onCompanyInputChange,
  onLocationInputChange,
  companies,
  locations,
}) => {
  const { 
    setStatusFilter, 
    statusFilter,
    clearFilters
  } = useApplications();

  const handleClearFilters = () => {
    clearFilters();
    onCompanyInputChange("");
    onLocationInputChange("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtres</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filtrer par entreprise"
                value={companyInput}
                onChange={(e) => onCompanyInputChange(e.target.value)}
                className="pl-8"
                list="mobile-company-options"
              />
              <datalist id="mobile-company-options">
                {companies.map(company => (
                  <option key={company} value={company} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filtrer par localisation"
                value={locationInput}
                onChange={(e) => onLocationInputChange(e.target.value)}
                className="pl-8"
                list="mobile-location-options"
              />
              <datalist id="mobile-location-options">
                {locations.map(location => (
                  <option key={location} value={location} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="space-y-2">
            <Select 
              value={statusFilter || "all"} 
              onValueChange={(value) => setStatusFilter(value === "all" ? null : value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Statut de candidature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(statusFilter || companyInput || locationInput) && (
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearFilters}
                className="h-8 text-xs"
              >
                <X size={14} className="mr-1" />
                Effacer les filtres
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 