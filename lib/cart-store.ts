export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxStock: number;
  sku?: string;
  image: string;
  color?: string;
  isFlashDeal?: boolean;
}

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: "1",
    name: "Wireless Noise-Canceling Premium Headphones",
    price: 199.99,
    quantity: 1,
    maxStock: 18,
    sku: "SD-HEAD-9081",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    color: "Space Gray"
  },
  {
    id: "2",
    name: "Ultra Smart Watch Series 7 Pro",
    price: 149.00,
    quantity: 2,
    maxStock: 25,
    sku: "SD-WTC-7721",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    color: "Matte Black"
  },
  {
    id: "3",
    name: "Ergonomic Mechanical Gaming Keyboard",
    price: 89.99,
    quantity: 1,
    maxStock: 4,
    sku: "SD-KEY-1022",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
    color: "RGB Black"
  }
];

export function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return INITIAL_CART_ITEMS;
  try {
    const raw = localStorage.getItem("customer_cart");
    if (!raw) {
      localStorage.setItem("customer_cart", JSON.stringify(INITIAL_CART_ITEMS));
      return INITIAL_CART_ITEMS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_CART_ITEMS;
  } catch (e) {
    console.error("Failed to read cart from localStorage:", e);
    return INITIAL_CART_ITEMS;
  }
}

export function saveStoredCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("customer_cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (e) {
    console.error("Failed to save cart to localStorage:", e);
  }
}

export function addToCart(newItem: CartItem): { success: boolean; cart: CartItem[]; message: string } {
  const cart = getStoredCart();
  const existingIdx = cart.findIndex((item) => item.id === newItem.id);

  if (existingIdx > -1) {
    const existing = cart[existingIdx];
    const newQty = existing.quantity + newItem.quantity;
    if (newQty > existing.maxStock) {
      existing.quantity = existing.maxStock;
      saveStoredCart(cart);
      return {
        success: true,
        cart,
        message: `Max available stock (${existing.maxStock}) added for "${newItem.name}"`
      };
    }
    existing.quantity = newQty;
    // Update price if it's a flash deal
    if (newItem.isFlashDeal) {
      existing.price = newItem.price;
      existing.isFlashDeal = true;
    }
  } else {
    cart.unshift(newItem);
  }

  saveStoredCart(cart);
  return {
    success: true,
    cart,
    message: `"${newItem.name}" added to cart at ৳${newItem.price.toLocaleString()}!`
  };
}
