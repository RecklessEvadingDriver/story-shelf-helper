import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookCard } from "@/components/BookCard";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/SearchBar";
import { supabase } from "@/integrations/supabase/client";

const Books = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  const { data: books, isLoading } = useQuery({
    queryKey: ["books", category, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('books')
        .select('*')
        .limit(40);

      if (category) {
        query = query.eq('category', category);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar />
        </div>
        
        <h1 className="text-3xl font-bold mb-8 text-foreground">
          {category ? `${category} Books` : searchQuery ? `Search Results: "${searchQuery}"` : "All Books"}
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : books?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No books found {category ? `in ${category}` : searchQuery ? `for "${searchQuery}"` : ""}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books?.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;