import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, TerminalSquare } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { isAuthenticated } = useAuth();

  // Détecte la section visible
  useEffect(() => {
    const sections = ["hero", "projects", "about"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Pages spéciales qui gardent leur propre route (pas single-page)
  const isSpecialPage = ["/admin", "/login", "/setup"].includes(location);

  const navLinks = [
    { id: "hero",     label: "Accueil" },
    { id: "about",    label: "À Propos" },
    { id: "projects", label: "Projets" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden">
      {/* ── Navigation ── */}
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out border-b border-transparent",
          scrolled ? "bg-background/80 backdrop-blur-md border-white/10 py-3 shadow-lg" : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo → scrolle vers le haut */}
          <button
            onClick={() => window.location.href = "/login"}
            className="font-display font-bold text-xl tracking-tighter flex items-center gap-2 group"
          >
            <TerminalSquare className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
            <span className="group-hover:text-primary transition-colors">RANJA.</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {!isSpecialPage && navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={cn(
                  "text-sm font-medium transition-all hover:text-primary relative group",
                  activeSection === link.id ? "text-white" : "text-muted-foreground"
                )}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                  />
                )}
              </button>
            ))}

            {isAuthenticated && (
              <Link
                href="/admin"
                className={cn(
                  "text-sm font-medium transition-all hover:text-primary",
                  location === "/admin" ? "text-white" : "text-muted-foreground"
                )}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-muted-foreground hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-display font-bold">
              {!isSpecialPage && navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => { scrollTo(link.id); setMobileMenuOpen(false); }}
                  className={cn(
                    "text-left py-2 border-b border-white/10",
                    activeSection === link.id ? "text-primary" : "text-white"
                  )}
                >
                  {link.label}
                </button>
              ))}
              {isAuthenticated && (
                <Link href="/admin" className="py-2 border-b border-white/10 text-white">
                  Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu */}
      <main className="flex-1 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <TerminalSquare className="w-5 h-5 text-muted-foreground" />
            <span className="font-display font-bold text-muted-foreground">ra_RANJA</span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}