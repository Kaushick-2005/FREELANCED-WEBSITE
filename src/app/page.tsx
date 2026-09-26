'use client';

import { useEffect } from 'react';
import { Loader } from '@/components/luxury/loader';
import { Navbar } from '@/components/luxury/navbar';
import { Footer } from '@/components/luxury/footer';
import { CursorGlow } from '@/components/luxury/cursor-glow';
import { GoldParticles } from '@/components/luxury/gold-particles';
import { WhatsAppButton } from '@/components/luxury/whatsapp-button';
import { CartDrawer } from '@/components/luxury/cart-drawer';
import { WishlistDrawer } from '@/components/luxury/wishlist-drawer';
import { QuickViewModal } from '@/components/luxury/quick-view-modal';
import { SearchModal } from '@/components/luxury/search-modal';
import { AuthModal } from '@/components/luxury/auth-modal';
import { CheckoutModal } from '@/components/luxury/checkout-modal';
import { UserProfileModal } from '@/components/luxury/user-profile-modal';
import { UserOrdersModal } from '@/components/luxury/user-orders-modal';
import { AllProductsOverlay } from '@/components/luxury/all-products-overlay';
import { useStore } from '@/lib/store';
import type { Product } from '@/lib/types';

import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { FeaturedProducts } from '@/components/sections/featured-products';
import { CarouselSection } from '@/components/sections/carousel-section';
import { SpecialOffers } from '@/components/sections/special-offers';
import { GoldRate } from '@/components/sections/gold-rate';
import { Reviews } from '@/components/sections/reviews';
import { CustomizedJewellery } from '@/components/sections/customized-jewellery';
import { Gallery } from '@/components/sections/gallery';
import { Contact } from '@/components/sections/contact';

export default function Home() {
  const { setQuickView } = useStore();

  useEffect(() => {
    // Check if URL has ?product=ID — if so, open that product's quick view
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    if (productId) {
      // Fetch the specific product and open its quick view
      (async () => {
        try {
          const res = await fetch('/api/products');
          const data = await res.json();
          const product = (data.products || []).find((p: Product) => p.id === productId);
          if (product) {
            setQuickView(product);
          }
        } catch { /* ignore */ }
      })();
      // Clean the URL (remove ?product=... so it doesn't reopen on refresh)
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [setQuickView]);

  return (
    <div className="relative flex min-h-screen flex-col marble-bg">
      <Loader />
      <CursorGlow />
      <GoldParticles count={18} />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          <Hero />
          <About />
          <WhyChooseUs />
          <FeaturedProducts />
          <CarouselSection type="new" />
          <CarouselSection type="best" />
          <SpecialOffers />
          <GoldRate />
          <Reviews />
          <CustomizedJewellery />
          <Gallery />
          <Contact />
        </main>

        <Footer />
      </div>

      {/* Overlays */}
      <WhatsAppButton />
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <SearchModal />
      <AuthModal />
      <CheckoutModal />
      <UserProfileModal />
      <UserOrdersModal />
      <AllProductsOverlay />
    </div>
  );
}
