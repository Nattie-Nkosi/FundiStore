namespace API.Entities
{
    public class Cart
    {
        // Properties of the Cart class
        public int Id { get; set; }   
        public string BuyerId { get; set; }            
        public List<CartItem> Items { get; set; } = new(); 
        public string PaymentIntentId { get; set; }
        public string ClientSecret { get; set; }

        // Method to add an item to the cart
        public void AddItem(Product product, int quantity)
        {
            // Check if the product does not exist in the cart (i.e., no item with the same ProductId)
            if(Items.All(item => item.ProductId != product.Id))
            {
                // If it doesn't exist, add a new CartItem to Items with the specified product and quantity
                Items.Add(new CartItem{Product = product, Quantity = quantity});
            }

            // Look for an existing item in the cart that matches the product Id
            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
            // If such an item exists, increment its quantity by the specified amount
            if(existingItem != null) existingItem.Quantity += quantity;
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