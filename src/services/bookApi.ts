import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";

export interface BookApiResponse {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_image: string | null;
  price: number;
  category: string;
}

const transformGoogleBookData = (book: any): BookApiResponse => ({
  id: book.id,
  title: book.volumeInfo.title,
  author: book.volumeInfo.authors?.[0] || "Unknown Author",
  description: book.volumeInfo.description || null,
  cover_image: book.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || "/placeholder.svg",
  price: book.saleInfo?.listPrice?.amount || 9.99,
  category: book.volumeInfo.categories?.[0] || "General",
});

export const useSearchBooks = (query: string) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["books", query],
    queryFn: async () => {
      if (!query) return [];

      // First, try to fetch from Supabase
      const { data: supabaseBooks, error: supabaseError } = await supabase
        .from('books')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('created_at', { ascending: false })
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
          `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}&maxResults=40`
        );

        if (!response.ok) {
          if (response.status === 429) {
            toast({
              title: "API Limit Reached",
              description: "Please try again later or search in our existing collection.",
              variant: "destructive",
            });
            return [];
          }
          throw new Error(`Google Books API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.items?.map(transformGoogleBookData) || [];
      } catch (error) {
        console.error('Google Books API error:', error);
        toast({
          title: "Error fetching books",
          description: "Please try again later.",
          variant: "destructive",
        });
        return [];
      }
    },
    retry: false,
  });
};

export const useGetBookById = (id: string) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      // First try to fetch from Supabase
      const { data: supabaseBook, error: supabaseError } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (!supabaseError && supabaseBook) {
        return supabaseBook;
      }

      // If not found in Supabase, try Google Books API
      try {
        const response = await fetch(`${GOOGLE_BOOKS_API_URL}/${id}`);
        
        if (!response.ok) {
          if (response.status === 429) {
            toast({
              title: "API Limit Reached",
              description: "Please try again later.",
              variant: "destructive",
            });
            throw new Error('API limit reached');
          }
          throw new Error(`Google Books API error: ${response.statusText}`);
        }

        const book = await response.json();
        return transformGoogleBookData(book);
      } catch (error) {
        console.error('Error fetching book:', error);
        toast({
          title: "Error fetching book details",
          description: "Please try again later.",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: false,
  });
};