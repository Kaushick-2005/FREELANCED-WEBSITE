'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, Lang } from './types';

type CartItem = { product: Product; quantity: number };
type WishlistItem = { product: Product };
type CompareItem = Product;

type UIState = {
  // language
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;

  // cart
  cart: CartItem[];
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: () => number;
  cartTotal: () => number;

  // wishlist
  wishlist: WishlistItem[];
  toggleWishlist: (p: Product) => void;
  isWished: (id: string) => boolean;
  removeFromWishlist: (id: string) => void;

  // compare
  compare: CompareItem[];
  toggleCompare: (p: Product) => void;

  // recently viewed
  recentlyViewed: Product[];
  addRecentlyViewed: (p: Product) => void;

  // drawers / modals
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  wishlistOpen: boolean;
  setWishlistOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  loginOpen: boolean;
  setLoginOpen: (v: boolean) => void;
  adminOpen: boolean;
  setAdminOpen: (v: boolean) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (v: boolean) => void;
  quickView: Product | null;
  setQuickView: (p: Product | null) => void;

  // mobile menu
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;

  // auth
  user: { id: string; name: string; email: string; phone: string; address?: string; city?: string; pincode?: string } | null;
  setUser: (u: { id: string; name: string; email: string; phone: string; address?: string; city?: string; pincode?: string } | null) => void;
  requireAuth: () => boolean; // returns true if logged in, opens auth modal if not

  // all products overlay
  allProductsOpen: boolean;
  setAllProductsOpen: (v: boolean) => void;

  // coupon
  coupon: { code: string; discount: number; type: 'percent' | 'flat' } | null;
  setCoupon: (c: { code: string; discount: number; type: 'percent' | 'flat' } | null) => void;
};

export const useStore = create<UIState>()(
  persist(
    (set, get) => ({
      lang: 'ta',
      setLang: (l) => set({ lang: l }),
      toggleLang: () => set((s) => ({ lang: s.lang === 'ta' ? 'en' : 'ta' })),

      cart: [],
      addToCart: (p, qty = 1) =>
        set((s) => {
          const existing = s.cart.find((c) => c.product.id === p.id);
          if (existing) {
            return {
              cart: s.cart.map((c) =>
                c.product.id === p.id ? { ...c, quantity: c.quantity + qty } : c
              ),
            };
          }
          return { cart: [...s.cart, { product: p, quantity: qty }] };
        }),
      removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((c) => c.product.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          cart: s.cart.map((c) =>
            c.product.id === id ? { ...c, quantity: Math.max(1, qty) } : c
          ),
        })),
      clearCart: () => set({ cart: [], coupon: null }),
      cartCount: () => get().cart.reduce((n, c) => n + c.quantity, 0),
      cartTotal: () =>
        get().cart.reduce((sum, c) => sum + c.product.price * c.quantity, 0),

      wishlist: [],
      toggleWishlist: (p) =>
        set((s) => {
          const exists = s.wishlist.some((w) => w.product.id === p.id);
          return {
            wishlist: exists
              ? s.wishlist.filter((w) => w.product.id !== p.id)
              : [...s.wishlist, { product: p }],
          };
        }),
      isWished: (id) => get().wishlist.some((w) => w.product.id === id),
      removeFromWishlist: (id) =>
        set((s) => ({ wishlist: s.wishlist.filter((w) => w.product.id !== id) })),

      compare: [],
      toggleCompare: (p) =>
        set((s) => {
          const exists = s.compare.some((c) => c.id === p.id);
          if (exists) return { compare: s.compare.filter((c) => c.id !== p.id) };
          if (s.compare.length >= 4) return { compare: [...s.compare.slice(1), p] };
          return { compare: [...s.compare, p] };
        }),

      recentlyViewed: [],
      addRecentlyViewed: (p) =>
        set((s) => ({
          recentlyViewed: [p, ...s.recentlyViewed.filter((r) => r.id !== p.id)].slice(0, 8),
        })),

      cartOpen: false,
      setCartOpen: (v) => set({ cartOpen: v }),
      wishlistOpen: false,
      setWishlistOpen: (v) => set({ wishlistOpen: v }),
      searchOpen: false,
      setSearchOpen: (v) => set({ searchOpen: v }),
      loginOpen: false,
      setLoginOpen: (v) => set({ loginOpen: v }),
      adminOpen: false,
      setAdminOpen: (v) => set({ adminOpen: v }),
      checkoutOpen: false,
      setCheckoutOpen: (v) => set({ checkoutOpen: v }),
      quickView: null,
      setQuickView: (p) => set({ quickView: p }),
      menuOpen: false,
      setMenuOpen: (v) => set({ menuOpen: v }),

      user: null,
      setUser: (u) => set({ user: u }),
      requireAuth: () => {
        if (get().user) return true;
        set({ loginOpen: true });
        return false;
      },

      allProductsOpen: false,
      setAllProductsOpen: (v) => set({ allProductsOpen: v }),

      coupon: null,
      setCoupon: (c) => set({ coupon: c }),
    }),
    {
      name: 'rameez-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        cart: s.cart,
        wishlist: s.wishlist,
        compare: s.compare,
        recentlyViewed: s.recentlyViewed,
        lang: s.lang,
        user: s.user,
      }),
    }
  )
);
