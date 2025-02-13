import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import Index from "@/pages/Index";
import Books from "@/pages/Books";
import BookDetails from "@/pages/BookDetails";
import Auth from "@/pages/Auth";
import Cart from "@/pages/Cart";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/contexts/CartContext";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/books" element={<Books />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Toaster />
        </Router>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;