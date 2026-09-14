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
import PartnersSection from "./components/PartnersSection";
import QuoteModal from "./components/QuoteModal";
import FeedbackModal from "./components/FeedbackModal";
import WhatsAppButton from "./components/WhatsAppButton";
import Footer from "./components/Footer";
import IntroVideoOverlay from "./components/IntroVideoOverlay";

export default function App() {
  const [lang, setLang] = useState("TR");
  const [activeTab, setActiveTab] = useState("home");
  const [showIntro, setShowIntro] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quoteModalProduct, setQuoteModalProduct] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Parse URL pathname & search params to support true step-by-step browser back/forward history
  useEffect(() => {
    const handlePopState = (event) => {
      setShowIntro(false); // Never trigger intro video when pressing back/forward
      const path = window.location.pathname.replace(/^\//, "");
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('kategori');

      if (path.startsWith("urunler/")) {
        const stockCode = decodeURIComponent(path.replace("urunler/", ""));
        setActiveTab("urun-detay");
        setSelectedProduct({ stokKodu: stockCode });
      } else if (path === "urunler" || path.startsWith("urunler")) {
        setActiveTab("urunler");
        setSelectedProduct(null);
        if (catParam) {
          setSelectedCategory(decodeURIComponent(catParam));
        } else if (event && event.state && event.state.category) {
          setSelectedCategory(event.state.category);
        } else {
          setSelectedCategory("Tümü");
        }
      } else if (["projeler", "kurumsal", "iletisim"].includes(path)) {
        setActiveTab(path);
        setSelectedProduct(null);
      } else {
        setActiveTab("home");
        setSelectedProduct(null);
      }
    };

    // Initial load check
    const initialPath = window.location.pathname.replace(/^\//, "");
    if (initialPath && initialPath !== "") {
      setShowIntro(false);
    }
    handlePopState();

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (tab) => {
    if (tab === "home") {
      setShowIntro(true);
    } else {
      setShowIntro(false);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const targetPath = tab === "home" ? "/" : `/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, "", targetPath);
    }
  };

  const handleSelectProduct = (product) => {
    setShowIntro(false);
    setSelectedProduct(product);
    setActiveTab("urun-detay");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (product && product.stokKodu) {
      window.history.pushState({}, "", `/urunler/${encodeURIComponent(product.stokKodu)}`);
    }
  };

  const handleOpenQuoteModal = (product = null) => {
    setQuoteModalProduct(product);
    setIsQuoteModalOpen(true);
  };

  const handleSelectCategoryAndNavigate = (cat) => {
    setShowIntro(false);
    setSelectedCategory(cat);
    setActiveTab("urunler");
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const url = (cat && cat !== "Tümü" && cat !== "All")
      ? `/urunler?kategori=${encodeURIComponent(cat)}`
      : "/urunler";
    window.history.pushState({ tab: "urunler", category: cat }, "", url);
  };

  return (
    <div className="app-main-wrapper">
      {/* Intro Video Overlay on Entrance & Home Clicks */}
      <IntroVideoOverlay 
        isOpen={showIntro} 
        onFinished={() => setShowIntro(false)} 
        lang={lang} 
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
