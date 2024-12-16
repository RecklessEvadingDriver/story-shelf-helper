import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

interface MobileMenuProps {
  categories: string[];
  isActiveLink: (path: string) => boolean;
}

export const MobileMenu = ({ categories, isActiveLink }: MobileMenuProps) => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] dark:bg-background">
        <div className="flex flex-col gap-4 mt-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className={`justify-start dark:text-foreground/90 dark:hover:text-primary ${
                isActiveLink(`/books?category=${category}`) ? 'bg-accent text-accent-foreground' : ''
              }`}
              onClick={() => navigate(`/books?category=${category}`)}
            >
              {category}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};