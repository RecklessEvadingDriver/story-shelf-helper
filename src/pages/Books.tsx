import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookCard } from "@/components/BookCard";
import { Skeleton } from "@/components/ui/skeleton";

const Books = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  const { data: books, isLoading } = useQuery({
    queryKey: ["books", category, searchQuery],
    queryFn: async () => {
      let query = searchQuery || category || "programming";
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&maxResults=40`
      );
      const data = await response.json();
      
      return data.items?.map((book: any) => ({
        id: book.id,
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors?.[0] || "Unknown Author",
        price: book.saleInfo?.listPrice?.amount || 9.99,
        cover_image: book.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg",
        description: book.volumeInfo.description,
        category: book.volumeInfo.categories?.[0] || "Uncategorized",
      })) || [];
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
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