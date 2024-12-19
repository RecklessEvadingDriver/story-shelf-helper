import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const Newsletter = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success!",
      description: "Thank you for subscribing to our newsletter.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section className="py-12 bg-primary/5 dark:bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-muted-foreground mb-6">
            Stay updated with our latest book releases, reviews, and special offers.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1"
            />
            <Button type="submit" className="interactive-scale">Subscribe</Button>
          </form>
        </div>
      </div>
    </section>
  );
};