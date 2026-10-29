export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  image: string;
  inStock?: boolean;
}

const WISHLIST_STORAGE_KEY = "customer_wishlist";

export function getStoredWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read wishlist from localStorage:", e);
    return [];
  }
}

export function saveStoredWishlist(items: WishlistItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("wishlistUpdated"));
  } catch (e) {
    console.error("Failed to save wishlist:", e);
  }
}

export function toggleWishlistItem(item: WishlistItem): boolean {
  const current = getStoredWishlist();
  const exists = current.some((w) => w.id === item.id);
  let updated: WishlistItem[];
  if (exists) {
    updated = current.filter((w) => w.id !== item.id);
  } else {
    updated = [item, ...current];
  }
  saveStoredWishlist(updated);
  return !exists; // true = added, false = removed
}

export function removeFromWishlist(id: string): void {
  const current = getStoredWishlist();
  const updated = current.filter((w) => w.id !== id);
  saveStoredWishlist(updated);
}

export function isItemInWishlist(id: string): boolean {
  const current = getStoredWishlist();
  return current.some((w) => w.id === id);
}

export function clearWishlist(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(WISHLIST_STORAGE_KEY);
  window.dispatchEvent(new Event("wishlistUpdated"));
}
