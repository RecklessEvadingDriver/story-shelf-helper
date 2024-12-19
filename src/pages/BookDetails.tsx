import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBookById } from "@/services/bookApi";
import { BookInfo } from "@/components/book-details/BookInfo";
import { ReviewsList } from "@/components/book-details/ReviewsList";
import { RelatedBooks } from "@/components/book-details/RelatedBooks";

const BookDetails = () => {
  const { id } = useParams();

  const { data: book, isLoading } = useGetBookById(id || "");

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["book-reviews", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("book_id", id);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: relatedBooks, isLoading: relatedLoading } = useQuery({
    queryKey: ["related-books", book?.category],
    enabled: !!book,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("category", book.category)
        .neq("id", id)
        .limit(4);
      
      if (error) {
        return [];
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[500px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Book not found</h1>
      </div>
    );
  }

  const averageRating = reviews?.length
    ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / reviews.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative group">
          <img
            src={book.cover_image || "/placeholder.svg"}
            alt={book.title}
            className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <BookInfo 
          book={book} 
          averageRating={averageRating} 
          reviewCount={reviews?.length || 0} 
        />
      </div>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Customer Reviews</h2>
        <ReviewsList reviews={reviews} isLoading={reviewsLoading} />
      </section>

      <RelatedBooks books={relatedBooks} isLoading={relatedLoading} />
    </div>
  );
};

export default BookDetails;