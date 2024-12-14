import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { BookCard } from "@/components/BookCard";

// Mock data for featured books
const featuredBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    price: 21.99,
    imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 18.99,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Featured Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["Fiction", "Non-Fiction", "Science", "Technology", "Business", "Arts"].map((category) => (
              <div
                key={category}
                className="bg-secondary rounded-lg p-6 text-center hover:bg-primary hover:text-white transition-colors cursor-pointer"
              >
                <h3 className="font-semibold">{category}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;