import { useQuery } from "@tanstack/react-query";

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";

// Raw response from Google Books API
interface GoogleBookApiResponse {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
  };
  saleInfo?: {
    listPrice?: {
      amount: number;
    };
  };
}

// Transformed book data that we use in our app
export interface BookApiResponse {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_image: string;
  price: number;
  category: string;
}

const transformBookData = (book: GoogleBookApiResponse): BookApiResponse => ({
  id: book.id,
  title: book.volumeInfo.title,
  author: book.volumeInfo.authors?.[0] || "Unknown Author",
  description: book.volumeInfo.description || "",
  cover_image: book.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || "/placeholder.svg",
  price: book.saleInfo?.listPrice?.amount || 9.99,
  category: book.volumeInfo.categories?.[0] || "General",
});

export const useSearchBooks = (query: string) => {
  return useQuery({
    queryKey: ["books", query],
    queryFn: async () => {
      if (!query) return [];
      const response = await fetch(
        `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}&maxResults=40`
      );
      const data = await response.json();
      return data.items?.map(transformBookData) || [];
    },
    enabled: Boolean(query),
  });
};

export const useGetBookById = (id: string) => {
  return useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const response = await fetch(`${GOOGLE_BOOKS_API_URL}/${id}`);
      const book: GoogleBookApiResponse = await response.json();
      return transformBookData(book);
    },
  });
};