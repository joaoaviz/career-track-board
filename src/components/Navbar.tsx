
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Settings } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleSelector } from "./RoleSelector";

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { userRole } = useUserRole();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };
  
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Link to="/" className="text-xl font-bold shrink-0">
            Suivi de candidatures
          </Link>
          
          {user && (
            <div className="flex flex-wrap items-center gap-4 ml-auto">
              <div className="flex items-center gap-2">
                <User size={18} className="text-muted-foreground" />
                <div className="hidden sm:block">
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                  {userRole && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {userRole === 'manager' ? 'Manager' : 'Utilisateur'}
                    </span>
                  )}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="shrink-0">
                    <Settings size={16} className="mr-2" />
                    <span className="hidden sm:inline">Paramètres</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4">
                    <RoleSelector />
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut size={16} className="mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
