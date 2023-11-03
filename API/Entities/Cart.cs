namespace API.Entities
{
    public class Cart
    {
        // Properties of the Cart class
        public int Id { get; set; } // Unique identifier for the cart   
        public string BuyerId { get; set; } // Identifier for the buyer/user owning the cart             
        public List<CartItem> Items { get; set; } = new(); // A list to hold CartItem objects representing items in the cart 

        // Method to add an item to the cart
        public void AddItem(Product product, int quantity)
        {
            // Look for an existing item in the cart that matches the product Id
            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);

            // If such an item exists, increment its quantity by the specified amount
            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
            }
            else
            {
                // Since the item doesn't exist, add a new CartItem to Items with the product and quantity
                Items.Add(new CartItem { ProductId = product.Id, Quantity = quantity });
                // Assuming that CartItem has a ProductId property, otherwise you may need to set the Product itself
            }
        }   

        // Method to remove an item from the cart or reduce its quantity
        public void RemoveItem(int productId, int quantity)
        {
            // Find the item in the cart that matches the product Id
            var item = Items.FirstOrDefault(item => item.ProductId == productId);
            // If the item doesn't exist, exit the method
            if (item == null) return;

            // Subtract the specified quantity from the item's quantity
            item.Quantity -= quantity;
            // If the quantity reaches zero, remove the item from the cart
            if (item.Quantity == 0) Items.Remove(item); 
        }    
    }
}