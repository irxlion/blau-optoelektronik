/**
 * Warenkorb-Context
 * Verwaltet den Warenkorb-Status global in der Anwendung
 */

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CartItem, ShopProduct } from "@/types/shop";

interface CartContextType {
  items: CartItem[];
  addItem: (product: ShopProduct, quantity?: number, configuration?: CartItem["configuration"]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback(
    (product: ShopProduct, quantity: number = 1, configuration?: CartItem["configuration"]) => {
      setItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) => item.product.id === product.id
        );

        if (existingItemIndex >= 0) {
          // Produkt bereits im Warenkorb: Menge erhöhen
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
            configuration: configuration || updatedItems[existingItemIndex].configuration,
          };
          return updatedItems;
        } else {
          // Neues Produkt hinzufügen
          return [
            ...prevItems,
            {
              product,
              quantity,
              configuration,
            },
          ];
        }
      });
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => {
      const itemPrice = item.product.price_eur || 0;
      return total + itemPrice * item.quantity;
    }, 0);
  }, [items]);

  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = items.find((item) => item.product.id === productId);
      return item ? item.quantity : 0;
    },
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

