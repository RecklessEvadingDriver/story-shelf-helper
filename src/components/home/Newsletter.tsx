import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const Newsletter = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you for subscribing!",
      description: "You'll receive our latest updates in your inbox.",
      duration: 3000,
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section className="py-12 bg-primary/5 dark:bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 text-primary dark:text-primary/90" />
          <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-foreground/90">Join Our Reading Community</h2>
          <p className="text-muted-foreground dark:text-muted-foreground/80 mb-6">
            Stay connected with our latest book recommendations, author interviews, and exclusive offers.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 dark:bg-background/95 dark:border-accent/20"
              aria-label="Email subscription"
            />
            <Button 
              type="submit" 
              className="interactive-scale bg-primary hover:bg-primary/90 dark:bg-primary/90 dark:hover:bg-primary text-primary-foreground"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};