import React from "react";
import Navbar from "./components/Navbar/Navbar";
import CarouselFarmacia from "./components/CarouselFarmacia/CarouselFarmacia";
import HeroSection from "./components/HeroSection/HeroSection";
import FeaturedProductsCarousel from "./components/FeaturedProductsCarousel/FeaturedProductsCarousel";
import CategoriaSection from "./components/CategoriaSection/CategoriaSection";
import ContactHeroSection from "./components/ContactHeroSection/ContactHeroSection";
import Footer from "./components/Footer/Footer";
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton/WhatsAppFloatingButton";
import LoginModal from "./components/Login/LoginModal";

export default function App() {
  return (
    <>
      <Navbar />
      <CarouselFarmacia />
      <HeroSection />
      <FeaturedProductsCarousel />
      <CategoriaSection />
      <ContactHeroSection />
      <WhatsAppFloatingButton />
      <Footer />
      <LoginModal />
    </>
  );
}
