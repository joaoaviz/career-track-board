
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
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
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.email}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="shrink-0">
                <LogOut size={16} className="mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
                <span className="sm:hidden">Sortir</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
