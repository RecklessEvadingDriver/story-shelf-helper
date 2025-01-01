import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookCard } from "@/components/BookCard";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/SearchBar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Books = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const searchQuery = searchParams.get("search");
  const { toast } = useToast();

  const { data: books, isLoading } = useQuery({
    queryKey: ["books", category, searchQuery],
    queryFn: async () => {
      // First try to get books from Supabase
      const query = searchQuery || category || "programming";
      let { data: supabaseBooks, error: supabaseError } = await supabase
        .from('books')
        .select('*')
        .or(`title.ilike.%${query}%,category.ilike.%${query}%,author.ilike.%${query}%`)
        .limit(40);

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
      }

      // If we have results from Supabase, return them
      if (supabaseBooks && supabaseBooks.length > 0) {
        return supabaseBooks;
      }

      // If no results from Supabase, try Google Books API
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            query
          )}&maxResults=40`
        );

        if (!response.ok) {
          if (response.status === 429) {
            toast({
              title: "API Limit Reached",
              description: "We're experiencing high traffic. Please try again later or browse our existing collection.",
              variant: "destructive",
            });
            // Return empty array to prevent further API calls
            return [];
          }
          throw new Error(`Google Books API error: ${response.statusText}`);
        }

        const data = await response.json();
        const googleBooks = data.items?.map((book: any) => ({
          id: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors?.[0] || "Unknown Author",
          price: book.saleInfo?.listPrice?.amount || 9.99,
          cover_image: book.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || "/placeholder.svg",
          description: book.volumeInfo.description,
          category: book.volumeInfo.categories?.[0] || "Uncategorized",
        })) || [];

        // Store fetched books in Supabase for future use
        if (googleBooks.length > 0) {
          const { error: insertError } = await supabase
            .from('books')
            .upsert(googleBooks, { 
              onConflict: 'id',
              ignoreDuplicates: true 
            });

          if (insertError) {
            console.error('Error storing books:', insertError);
          }
        }

        return googleBooks;
      } catch (error) {
        console.error('Error fetching books:', error);
        toast({
          title: "Error fetching books",
          description: "Please try again later or browse our existing collection.",
          variant: "destructive",
        });
        return [];
      }
    },
    retry: false,
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