import { HeroSection } from "@/components/HeroSection";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Mock data for featured books
const featuredBooks = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 19.99,
    cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 24.99,
    cover_image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    price: 21.99,
    cover_image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 18.99,
    cover_image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <HeroSection />
      
      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground dark:text-foreground/90">Featured Books</h2>
            <Button variant="outline" onClick={() => navigate("/books")} className="dark:border-accent/20 dark:text-foreground/90">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-foreground dark:text-foreground/90">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["Fiction", "Non-Fiction", "Science", "Technology", "Business", "Arts"].map((category) => (
              <div
                key={category}
                onClick={() => navigate(`/books?category=${encodeURIComponent(category)}`)}
                className="bg-secondary dark:bg-accent/10 rounded-lg p-6 text-center hover:bg-primary hover:text-white dark:hover:bg-accent transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-sm hover:shadow-md dark:text-foreground/90"
              >
                <h3 className="font-semibold">{category}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-accent/10 dark:bg-accent/5 rounded-2xl p-8 md:p-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground dark:text-foreground/90">Join Our Book Club</h2>
              <p className="text-lg text-muted-foreground dark:text-muted-foreground/80 mb-6">
                Get exclusive access to new releases, author interviews, and special discounts.
              </p>
              <Button size="lg" onClick={() => navigate("/join-club")} className="dark:bg-accent dark:text-accent-foreground">
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;