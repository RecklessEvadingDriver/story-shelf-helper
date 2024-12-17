import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
    if (user) {
      loadDarkModePreference();
    }
  }, [user]);

  const loadDarkModePreference = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('dark_mode')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error loading dark mode preference:', error);
        return;
      }

      if (data?.dark_mode !== undefined) {
        setTheme(data.dark_mode ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Error loading dark mode preference:', error);
    }
  };

  const saveDarkModePreference = async (isDark: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          dark_mode: isDark,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving dark mode preference:', error);
        toast.error('Failed to save theme preference');
      }
    } catch (error) {
      console.error('Error saving dark mode preference:', error);
      toast.error('Failed to save theme preference');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (user) {
      saveDarkModePreference(newTheme === 'dark');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="interactive-scale text-foreground hover:text-primary dark:text-foreground/90"
    >
      {theme === 'dark' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}