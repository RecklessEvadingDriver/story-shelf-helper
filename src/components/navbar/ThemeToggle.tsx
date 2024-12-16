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
    if (!user?.id) {
      // If no user, just toggle the theme locally
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      document.documentElement.classList.toggle("dark");
      return;
    }
    
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark");
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          dark_mode: newMode,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error saving dark mode preference:', error);
      toast({
        title: "Error saving preference",
        description: "Your dark mode preference couldn't be saved.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadDarkModePreference = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('dark_mode')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setIsDarkMode(data.dark_mode || false);
          if (data.dark_mode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      } catch (error: any) {
        console.error('Error loading dark mode preference:', error);
        // Don't show toast for loading errors to avoid spamming the user
      }
    };

    loadDarkModePreference();
  }, [user?.id]); // Only reload when user ID changes

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