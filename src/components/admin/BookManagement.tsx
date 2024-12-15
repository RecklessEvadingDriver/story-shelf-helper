import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { BookPlus, Edit, Trash2, Save } from "lucide-react";

export const BookManagement = () => {
  const [books, setBooks] = useState([
    { id: 1, title: "Sample Book", price: 29.99, stock: 50 },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddBook = () => {
    // Add book logic here
    console.log("Adding new book");
  };

  const handleEditBook = (id: number) => {
    setEditingId(id);
  };

  const handleSaveBook = (id: number) => {
    setEditingId(null);
    // Save book logic here
    console.log("Saving book", id);
  };

  const handleDeleteBook = (id: number) => {
    // Delete book logic here
    console.log("Deleting book", id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Books Management</h2>
        <Button onClick={handleAddBook}>
          <BookPlus className="mr-2 h-4 w-4" />
          Add New Book
        </Button>
      </div>

      <div className="grid gap-4">
        {books.map((book) => (
          <Card key={book.id} className="p-4">
            <div className="flex items-center justify-between">
              {editingId === book.id ? (
                <div className="flex-1 flex gap-4">
                  <Input defaultValue={book.title} placeholder="Book title" />
                  <Input defaultValue={book.price} type="number" placeholder="Price" />
                  <Input defaultValue={book.stock} type="number" placeholder="Stock" />
                  <Button onClick={() => handleSaveBook(book.id)}>
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <h3 className="font-semibold">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Price: ${book.price} | Stock: {book.stock}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => handleEditBook(book.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" onClick={() => handleDeleteBook(book.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};