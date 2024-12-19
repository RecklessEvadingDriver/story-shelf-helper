import { useQuery } from "@tanstack/react-query";

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";

export interface BookApiResponse {
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

export const useSearchBooks = (query: string) => {
  return useQuery({
    queryKey: ["books", query],
    queryFn: async () => {
      if (!query) return [];
      const response = await fetch(
        `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}&maxResults=40`
      );
      const data = await response.json();
      return data.items?.map((book: BookApiResponse) => ({
        id: book.id,
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors?.[0] || "Unknown Author",
        description: book.volumeInfo.description || "",
        cover_image: book.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || "/placeholder.svg",
        price: book.saleInfo?.listPrice?.amount || 9.99,
        category: book.volumeInfo.categories?.[0] || "General",
      })) || [];
    },
    enabled: Boolean(query),
  });
};

export const useGetBookById = (id: string) => {
  return useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const response = await fetch(`${GOOGLE_BOOKS_API_URL}/${id}`);
      const book: BookApiResponse = await response.json();
      return {
        id: book.id,
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors?.[0] || "Unknown Author",
        description: book.volumeInfo.description || "",
        cover_image: book.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || "/placeholder.svg",
        price: book.saleInfo?.listPrice?.amount || 9.99,
        category: book.volumeInfo.categories?.[0] || "General",
      };
    },
  });
};