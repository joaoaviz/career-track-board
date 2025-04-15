import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { statusOptions } from "@/types/application";
import { Filter, Search, X } from "lucide-react";
import { useApplications } from "@/context/ApplicationContext";
import { MobileFilterDialog } from "./MobileFilterDialog";

export const ApplicationFilters: React.FC = () => {
  const { 
    applications,
    setStatusFilter, 
    setCompanyFilter, 
    setLocationFilter, 
    statusFilter, 
    companyFilter, 
    locationFilter,
    clearFilters
  } = useApplications();

  const [companyInput, setCompanyInput] = useState(companyFilter);
  const [locationInput, setLocationInput] = useState(locationFilter);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Companies and locations for filter options
  const [companies, setCompanies] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // Extract unique companies and locations
  useEffect(() => {
    const uniqueCompanies = [...new Set(applications.map(app => app.companyName))];
    const uniqueLocations = [...new Set(applications.map(app => app.location))];
    
    setCompanies(uniqueCompanies);
    setLocations(uniqueLocations);
  }, [applications]);

  // Apply company filter after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setCompanyFilter(companyInput);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [companyInput, setCompanyFilter]);

  // Apply location filter after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocationFilter(locationInput);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [locationInput, setLocationFilter]);

  const handleClearFilters = () => {
    clearFilters();
    setCompanyInput("");
    setLocationInput("");
  };

  const isFiltersActive = statusFilter || companyFilter || locationFilter;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* Mobile Filter Button */}
      <div className="md:hidden">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtres
          {isFiltersActive && (
            <span className="ml-2 rounded-full bg-primary w-2 h-2" />
          )}
        </Button>

        <MobileFilterDialog 
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          companyInput={companyInput}
          locationInput={locationInput}
          onCompanyInputChange={setCompanyInput}
          onLocationInputChange={setLocationInput}
          companies={companies}
          locations={locations}
        />
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filtrer par entreprise"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                className="pl-8"
                list="company-options"
              />
              <datalist id="company-options">
                {companies.map(company => (
                  <option key={company} value={company} />
                ))}
              </datalist>
            </div>
          </div>
          
          <div className="w-full sm:w-1/3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filtrer par localisation"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="pl-8"
                list="location-options"
              />
              <datalist id="location-options">
                {locations.map(location => (
                  <option key={location} value={location} />
                ))}
              </datalist>
            </div>
          </div>
          
          <div className="w-full sm:w-1/3">
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
        </div>
        
        {isFiltersActive && (
          <div className="mt-3 flex justify-end">
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
    </div>
  );
};
