import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductExplorer from "./components/ProductExplorer";
import ProductsPage from "./components/ProductsPage";
import ProductDetailPage from "./components/ProductDetailPage";
import ProjectExplorer from "./components/ProjectExplorer";
import ProjectsPage from "./components/ProjectsPage";
import ProjectDetailModal from "./components/ProjectDetailModal";
import CatalogViewer from "./components/CatalogViewer";
import VideoShowcase from "./components/VideoShowcase";
import StyleInspiration from "./components/StyleInspiration";
import CorporateSection from "./components/CorporateSection";
import CorporatePage from "./components/CorporatePage";
import ContactSection from "./components/ContactSection";
import ContactPage from "./components/ContactPage";
import ReferencesSection from "./components/ReferencesSection";
import DealershipsSection from "./components/DealershipsSection";
import PartnersSection from "./components/PartnersSection";
import QuoteModal from "./components/QuoteModal";
import FeedbackModal from "./components/FeedbackModal";
import WhatsAppButton from "./components/WhatsAppButton";
import Footer from "./components/Footer";
import IntroCinematicOverlay from "./components/IntroCinematicOverlay";
import StudioPage from "./components/studio/StudioPage";

export default function App() {
  const [lang, setLang] = useState("TR");
  const [activeTab, setActiveTab] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quoteModalProduct, setQuoteModalProduct] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Parse URL pathname to route to home, urunler, urunler/:stokKodu, projeler, kurumsal, iletisim
  useEffect(() => {
    const handlePopState = (e) => {
      const path = window.location.pathname.replace(/^\//, "");
      const searchParams = new URLSearchParams(window.location.search);
      const catParam = searchParams.get("cat");
      if (catParam) {
        setSelectedCategory(decodeURIComponent(catParam));
      }

      if (path.startsWith("urunler/")) {
        const stockCode = decodeURIComponent(path.replace("urunler/", ""));
        setActiveTab("urun-detay");
        setSelectedProduct({ stokKodu: stockCode });
        setShowIntro(false);
      } else if (path === "urunler" || path.startsWith("urunler")) {
        setActiveTab("urunler");
        setSelectedProduct(null);
        setShowIntro(false);
      } else if (["projeler", "kurumsal", "iletisim", "studio", "tugla-studio"].includes(path)) {
        setActiveTab(path === "tugla-studio" ? "studio" : path);
        setActiveTab(path);
        setSelectedProduct(null);
        setShowIntro(false);
      } else {
        setActiveTab("home");
        setSelectedProduct(null);
      }
    };

    handlePopState();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (tab) => {
    if (tab === "home") {
      setShowIntro(true);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const targetPath = tab === "home" ? "/" : `/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, "", targetPath);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActiveTab("urun-detay");
    setShowIntro(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (product && product.stokKodu) {
      window.history.pushState({ tab: "urun-detay", product }, "", `/urunler/${encodeURIComponent(product.stokKodu)}`);
    }
  };

  const handleOpenQuoteModal = (product = null) => {
    setQuoteModalProduct(product);
    setIsQuoteModalOpen(true);
  };

  const handleSelectCategoryAndNavigate = (cat) => {
    setSelectedCategory(cat);
    setShowIntro(false);
    setActiveTab("urunler");
    window.scrollTo({ top: 0, behavior: "smooth" });
    const targetPath = "/urunler";
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, "", targetPath);
    }
  };

  return (
    <div className="app-main-wrapper">
      {/* Cinematic Architectural Intro Video Overlay */}
      <IntroCinematicOverlay 
        isVisible={showIntro} 
        onComplete={() => setShowIntro(false)} 
      />
      {/* Header Navigation */}
      <Header 
        lang={lang} 
        setLang={setLang} 
        activeTab={activeTab} 
        setActiveTab={navigateTo}
        onOpenQuoteModal={() => handleOpenQuoteModal(null)}
        onSelectCategory={handleSelectCategoryAndNavigate}
      />

      {/* Main Content Sections / Pages */}
      <main>
        {activeTab === "home" && (
          <>
            <Hero 
              lang={lang} 
              onExploreProducts={() => navigateTo("urunler")}
              onExploreProjects={() => navigateTo("projeler")}
              onOpenQuoteModal={() => handleOpenQuoteModal(null)}
            />

            <ProductExplorer 
              lang={lang} 
              onSelectProduct={handleSelectProduct} 
              onNavigateToProducts={() => navigateTo("urunler")}
              onOpenQuoteModal={handleOpenQuoteModal}
              onSelectCategory={handleSelectCategoryAndNavigate}
            />

            <ProjectExplorer 
              lang={lang} 
              onSelectProject={(project) => setSelectedProject(project)} 
              onNavigateToProjects={() => navigateTo("projeler")}
              onOpenQuoteModal={() => handleOpenQuoteModal(null)}
            />

            <CatalogViewer lang={lang} />

            <VideoShowcase lang={lang} />

            <CorporateSection lang={lang} />

            <DealershipsSection lang={lang} />

            <ReferencesSection lang={lang} />

            <ContactSection lang={lang} onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)} />
          </>
        )}

        {activeTab === "urunler" && (
          <ProductsPage 
            lang={lang} 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={handleSelectProduct}
            onNavigate={navigateTo}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        )}

        {activeTab === "urun-detay" && (
          <ProductDetailPage
            stockCode={selectedProduct?.stokKodu || selectedProduct?.id}
            lang={lang}
            onNavigate={navigateTo}
            onSelectProduct={handleSelectProduct}
            onOpenQuoteModal={handleOpenQuoteModal}
            onSelectCategory={handleSelectCategoryAndNavigate}
          />
        )}

        {activeTab === "studio" && (
          <StudioPage 
            lang={lang} 
            onNavigate={navigateTo}
          />
        )}

        {activeTab === "projeler" && (
          <ProjectsPage 
            lang={lang}
            onSelectProject={(project) => setSelectedProject(project)}
            onOpenQuoteModal={() => handleOpenQuoteModal(null)}
            onNavigate={navigateTo}
          />
        )}

        {activeTab === "kurumsal" && (
          <CorporatePage 
            lang={lang}
            onNavigate={navigateTo}
            onOpenCatalog={() => window.open("/assets/catalog/katalog.pdf", "_blank")}
          />
        )}

        {activeTab === "iletisim" && (
          <ContactPage 
            lang={lang}
            onNavigate={navigateTo}
            onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        lang={lang} 
        onNavigate={navigateTo}
        onSelectCategory={handleSelectCategoryAndNavigate}
        onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
      />

      {/* Modals & Floating Components */}
      {isQuoteModalOpen && (
        <QuoteModal 
          isOpen={isQuoteModalOpen}
          product={quoteModalProduct}
          lang={lang}
          activeTab={activeTab}
          onClose={() => setIsQuoteModalOpen(false)} 
        />
      )}

      {isFeedbackModalOpen && (
        <FeedbackModal 
          isOpen={isFeedbackModalOpen}
          lang={lang}
          onClose={() => setIsFeedbackModalOpen(false)} 
        />
      )}

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          lang={lang}
          onClose={() => setSelectedProject(null)}
          onOpenQuoteModal={() => handleOpenQuoteModal(null)}
        />
      )}

      {/* Floating WhatsApp Quick Button */}
      <WhatsAppButton lang={lang} activeTab={activeTab} />
    </div>
  );
}
