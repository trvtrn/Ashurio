import { Product } from "@/payload-types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  product: Product;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          // Check if the product already exists in the cart
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          // If the product already exists, do not add it again
          if (existingItem) {
            return state;
          }

          // Otherwise, add the product to the cart
          return { items: [...state.items, { product }] };
          // return { items: [...state.items, { product }] };
        }),
      removeItem: (id) =>
        set((state) => {
          const itemIndex = state.items.findIndex(
            (item) => item.product.id === id
          );

          if (itemIndex !== -1) {
            const updatedItems = [...state.items];
            updatedItems.splice(itemIndex, 1);

            return { items: updatedItems };
          }

          return state;
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
