import { User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface UserMenuProps {
  isActiveLink: (path: string) => boolean;
}

export const UserMenu = ({ isActiveLink }: UserMenuProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative text-foreground hover:text-primary dark:text-foreground/90"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-background border border-border shadow-lg mt-2"
        sideOffset={5}
      >
        <DropdownMenuItem 
          onClick={() => navigate("/profile")} 
          className={`cursor-pointer flex items-center px-3 py-2 text-sm ${
            isActiveLink('/profile') ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        {user.role === 'admin' && (
          <DropdownMenuItem 
            onClick={() => navigate("/admin")} 
            className={`cursor-pointer flex items-center px-3 py-2 text-sm ${
              isActiveLink('/admin') ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Admin Dashboard</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={signOut} 
          className="cursor-pointer flex items-center px-3 py-2 text-sm text-red-500 dark:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};