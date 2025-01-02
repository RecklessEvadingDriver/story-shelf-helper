import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Bookmark, GraduationCap, Brain, Briefcase, Palette } from "lucide-react";
import { motion } from "framer-motion";

export const Categories = () => {
  const navigate = useNavigate();
  
  const categories = [
    { name: "Fiction", icon: BookOpen, color: "text-violet-500 dark:text-violet-400", description: "Immerse yourself in captivating stories" },
    { name: "Non-Fiction", icon: Brain, color: "text-blue-500 dark:text-blue-400", description: "Expand your knowledge" },
    { name: "Science", icon: GraduationCap, color: "text-green-500 dark:text-green-400", description: "Explore scientific discoveries" },
    { name: "Technology", icon: Bookmark, color: "text-red-500 dark:text-red-400", description: "Stay ahead with tech insights" },
    { name: "Business", icon: Briefcase, color: "text-yellow-500 dark:text-yellow-400", description: "Master business success" },
    { name: "Arts", icon: Palette, color: "text-pink-500 dark:text-pink-400", description: "Discover creative expression" },
  ];

  return (
    <section 
      className="py-16 bg-gradient-to-b from-secondary/30 to-background dark:from-secondary/5 dark:to-background"
      aria-labelledby="categories-heading"
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="categories-heading" 
          className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
        >
          Explore Our Collections
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                className="w-full h-auto py-6 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary transition-all duration-300 group dark:border-accent/20"
                onClick={() => navigate(`/books?category=${category.name}`)}
                aria-label={`Browse ${category.name} books`}
              >
                <category.icon className={`h-8 w-8 ${category.color} transition-transform duration-300 group-hover:scale-110`} aria-hidden="true" />
                <span className="font-medium text-foreground dark:text-foreground/90">{category.name}</span>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground/80 px-2 line-clamp-1">
                  {category.description}
                </p>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};