import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Bookmark, GraduationCap, Brain, Briefcase, Palette } from "lucide-react";

export const Categories = () => {
  const navigate = useNavigate();
  
  const categories = [
    { name: "Fiction", icon: BookOpen, color: "text-violet-500" },
    { name: "Non-Fiction", icon: Brain, color: "text-blue-500" },
    { name: "Science", icon: GraduationCap, color: "text-green-500" },
    { name: "Technology", icon: Bookmark, color: "text-red-500" },
    { name: "Business", icon: Briefcase, color: "text-yellow-500" },
    { name: "Arts", icon: Palette, color: "text-pink-500" },
  ];

  return (
    <section className="py-12 bg-secondary/50 dark:bg-secondary/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant="outline"
              className="h-auto py-6 flex flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 interactive-scale"
              onClick={() => navigate(`/books?category=${category.name}`)}
            >
              <category.icon className={`h-8 w-8 ${category.color}`} />
              <span className="font-medium">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};