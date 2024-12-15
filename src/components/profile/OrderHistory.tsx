import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockOrders = [
  {
    id: "1",
    date: "2024-02-20",
    total: 59.99,
    status: "Delivered",
    items: ["The Great Gatsby", "1984"],
  },
  {
    id: "2",
    date: "2024-02-15",
    total: 29.99,
    status: "Processing",
    items: ["Pride and Prejudice"],
  },
];

export const OrderHistory = () => {
  return (
    <div className="space-y-4">
      <ScrollArea className="w-full">
        <div className="min-w-[600px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{order.items.join(", ")}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                      }`}>
                      {order.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      
      {mockOrders.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No orders found
        </div>
      )}
    </div>
  );
};