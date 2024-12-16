import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark");
    
    if (user?.id) {
      try {
        await supabase
          .from('profiles')
          .upsert({ 
            id: user.id,
            dark_mode: newMode,
            updated_at: new Date().toISOString()
          });
      } catch (error) {
        toast({
          title: "Error saving preference",
          description: "Your dark mode preference couldn't be saved.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    const loadDarkModePreference = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('dark_mode')
            .eq('id', user.id)
            .single();

          if (!error && data) {
            setIsDarkMode(data.dark_mode);
            if (data.dark_mode) {
              document.documentElement.classList.add("dark");
            }
          }
        } catch (error) {
          console.error('Error loading dark mode preference:', error);
        }
      }
    };

    loadDarkModePreference();
  }, [user]);

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleDarkMode}
      className="text-foreground hover:text-primary dark:text-foreground/90"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};