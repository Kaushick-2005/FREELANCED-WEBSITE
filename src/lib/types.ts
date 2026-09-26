export type Material = 'Gold' | 'Silver' | 'Rose Gold' | 'Diamond' | 'Platinum';

export type Product = {
  id: string;
  name: string;
  nameTa?: string;
  slug: string;
  description: string;
  descriptionTa?: string;
  category: string;
  material: Material;
  purity?: string;
  weight: number;
  makingCharge: number;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isOffer: boolean;
  tags: string[];
};

export type CartLine = {
  product: Product;
  quantity: number;
};

export type WishlistLine = {
  product: Product;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  productName?: string;
};

export type GoldRate = {
  gold24k: number;
  gold22k: number;
  silver: number;
  roseGold: number;
  updated: string;
  change24k: number;
  changeSilver: number;
};
