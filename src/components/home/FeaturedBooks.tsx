import { useSearchBooks } from "@/services/bookApi";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const FeaturedBooks = () => {
  const navigate = useNavigate();

  // First try to get featured books from Supabase
  const { data: books, isLoading } = useQuery({
    queryKey: ['featured-books'],
    queryFn: async () => {
      const { data: supabaseBooks, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching featured books:', error);
        // Fallback to Google Books API
        const googleBooksResponse = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=bestseller&maxResults=4`
        );
        
        if (!googleBooksResponse.ok) {
          if (googleBooksResponse.status === 429) {
            return [];
          }
          throw new Error('Failed to fetch books');
        }

        const data = await googleBooksResponse.json();
        return data.items?.map((book: any) => ({
          id: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors?.[0] || "Unknown Author",
          price: book.saleInfo?.listPrice?.amount || 9.99,
          cover_image: book.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || "/placeholder.svg",
          description: book.volumeInfo.description,
          category: book.volumeInfo.categories?.[0] || "General",
        })) || [];
      }

      return supabaseBooks;
    },
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

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background via-secondary/30 to-background dark:from-background dark:via-secondary/5 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Books</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
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
    return null;
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
            Featured Books
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button
              variant="ghost"
              className="group hover:bg-primary/5"
              onClick={() => navigate("/books")}
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
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8"
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