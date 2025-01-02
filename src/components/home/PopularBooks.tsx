import { useQuery } from "@tanstack/react-query";
import { BookCard } from "@/components/BookCard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PopularBooks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: books, isLoading, error } = useQuery({
    queryKey: ['popular-books'],
    queryFn: async () => {
      console.log('Fetching popular books...');
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .limit(4);
      
      if (error) {
        console.error('Error fetching popular books:', error);
        toast({
          title: "Error loading books",
          description: "There was a problem loading the popular books. Please try again later.",
          variant: "destructive",
        });
        throw error;
      }

      console.log('Fetched popular books:', data);
      return data;
    }
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (error) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500">Failed to load popular books. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background via-secondary/30 to-background dark:from-background dark:via-secondary/5 dark:to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Popular Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[400px] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!books?.length) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">No popular books available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background via-secondary/30 to-background dark:from-background dark:via-secondary/5 dark:to-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
          >
            Popular Books
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button
              variant="ghost"
              className="group hover:bg-primary/5"
              onClick={() => navigate('/books')}
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {books?.map((book) => (
            <motion.div 
              key={book.id} 
              variants={item}
              className="transform transition-all duration-300 hover:-translate-y-1"
            >
              <BookCard {...book} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};