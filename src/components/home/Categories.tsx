import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Bookmark, GraduationCap, Brain, Briefcase, Palette } from "lucide-react";

export const Categories = () => {
  const navigate = useNavigate();
  
  const categories = [
    { name: "Fiction", icon: BookOpen, color: "text-violet-500 dark:text-violet-400", description: "Immerse yourself in captivating stories and imaginative worlds" },
    { name: "Non-Fiction", icon: Brain, color: "text-blue-500 dark:text-blue-400", description: "Expand your knowledge with real-world insights" },
    { name: "Science", icon: GraduationCap, color: "text-green-500 dark:text-green-400", description: "Explore the wonders of scientific discovery" },
    { name: "Technology", icon: Bookmark, color: "text-red-500 dark:text-red-400", description: "Stay ahead with cutting-edge tech insights" },
    { name: "Business", icon: Briefcase, color: "text-yellow-500 dark:text-yellow-400", description: "Master the art of business success" },
    { name: "Arts", icon: Palette, color: "text-pink-500 dark:text-pink-400", description: "Discover the beauty of creative expression" },
  ];

  return (
    <section 
      className="py-12 bg-secondary/50 dark:bg-secondary/5" 
      aria-labelledby="categories-heading"
    >
      <div className="container mx-auto px-4">
        <h2 
          id="categories-heading" 
          className="text-3xl font-bold mb-8 text-center text-foreground dark:text-foreground/90"
        >
          Explore Our Collections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant="outline"
              className="h-auto py-6 flex flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 interactive-scale dark:border-accent/20 dark:hover:bg-primary/90"
              onClick={() => navigate(`/books?category=${category.name}`)}
              aria-label={`Browse ${category.name} books`}
            >
              <category.icon className={`h-8 w-8 ${category.color}`} aria-hidden="true" />
              <span className="font-medium text-foreground dark:text-foreground/90">{category.name}</span>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground/80 line-clamp-2 px-2">
                {category.description}
              </p>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};