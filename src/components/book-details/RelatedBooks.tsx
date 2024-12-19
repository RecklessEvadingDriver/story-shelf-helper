import { BookCard } from "@/components/BookCard";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  cover_image: string | null;
  description: string | null;
  category: string;
}

interface RelatedBooksProps {
  books: Book[] | null;
  isLoading: boolean;
}

export const RelatedBooks = ({ books, isLoading }: RelatedBooksProps) => {
  if (isLoading || !books?.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">Related Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </div>
    </section>
  );
};