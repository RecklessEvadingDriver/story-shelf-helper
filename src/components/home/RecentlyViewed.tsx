import { useQuery } from "@tanstack/react-query";
import { BookCard } from "@/components/BookCard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

export const RecentlyViewed = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: books, isLoading } = useQuery({
    queryKey: ['recently-viewed', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('recently_viewed')
        .select(`
          books (
            id,
            title,
            author,
            price,
            cover_image,
            description
          )
        `)
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data?.map(item => item.books) || [];
    },
    enabled: !!user
  });

  if (!user || !books?.length) return null;

  if (isLoading) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recently Viewed</h2>
        <Button variant="outline" onClick={() => navigate('/books')}>
          View All
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books?.map((book) => (
          <BookCard 
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            price={book.price}
            cover_image={book.cover_image}
            description={book.description}
          />
        ))}
      </div>
    </section>
  );
};