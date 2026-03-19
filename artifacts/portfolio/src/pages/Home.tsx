import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectsList } from "@/hooks/use-portfolio-api";
import { CTASocials } from "@/components/ui/CTASocials";
import About from "./About";
import Projects from "./Projects";

// ── Types ──────────────────────────────────────────────
interface Palette {
  bg: string;
  accent: string;
  accentSecondary: string;
  word: string;
}

interface Project {
  id: string | number;
  featured?: boolean;
  [key: string]: unknown;
}

// ── Palettes ───────────────────────────────────────────
const PALETTES: Palette[] = [
  { bg: "#0a0a0f",  accent: "#6366f1", accentSecondary: "#a855f7", word: ""    },
  { bg: "#0a0f0a",  accent: "#10b981", accentSecondary: "#06b6d4", word: "BATIR"  },
  { bg: "#0f0a0a",  accent: "#f97316", accentSecondary: "#ef4444", word: "CODER"   },
  { bg: "#0f0a0f",  accent: "#e879f9", accentSecondary: "#818cf8", word: "CREER" },
];

const PHOTOS = ["/images/Photo1.png", "/images/Photo2.png"];

// ── Composant ──────────────────────────────────────────
export default function Home() {
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const palette: Palette = PALETTES[paletteIndex];

  // Auto-changement de palette toutes les 3 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setPaletteIndex((prev) => (prev + 1) % PALETTES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-changement de photo toutes les 6 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % PHOTOS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Suivi de souris pour l'aurora
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const { data: projects, isLoading } = useProjectsList();
  const projectsArray: Project[] = Array.isArray(projects)
    ? projects.map((p) => ({
        ...p,
      }))
    : [];
  const featuredProjects =
    projectsArray.filter((p) => p.featured).slice(0, 4).length > 0
      ? projectsArray.filter((p) => p.featured).slice(0, 4)
      : projectsArray.slice(0, 4);

  return (
    <div className="flex flex-col w-full">

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}

      {/* Fond avec fondu de couleur — séparé pour transition propre */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={palette.bg}
            className="absolute inset-0 min-h-screen"
            style={{ backgroundColor: palette.bg, zIndex: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </AnimatePresence>

        <section className="relative min-h-screen flex items-center overflow-hidden" id="hero">

          {/* ── Aurora (suit la souris) ── */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div
              className="absolute w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-25"
              animate={{
                left: `${mousePos.x - 30}%`,
                top: `${mousePos.y - 30}%`,
                background: `radial-gradient(circle, ${palette.accent}, transparent 70%)`,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ position: "absolute" }}
            />
            <motion.div
              className="absolute w-[35vw] h-[35vw] rounded-full blur-[100px] opacity-15"
              animate={{
                background: `radial-gradient(circle, ${palette.accentSecondary}, transparent 70%)`,
              }}
              transition={{ duration: 1.2 }}
              style={{ right: "5%", bottom: "10%" }}
            />
            {/* Grille de points */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* ── MOT GÉANT EN FOND ── */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <AnimatePresence mode="wait">
              <motion.span
                key={palette.word}
                className="font-black"
                style={{
                  fontSize: "clamp(10rem, 28vw, 26rem)",
                  color: "rgba(255,255,255,0.04)",
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.8 }}
              >
                {palette.word}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* ── CONTENU PRINCIPAL ── */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full min-h-screen flex flex-col justify-between pt-24 pb-12">

            {/* Switcher palette + tag top */}
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Pills de thème cliquables */}
              <div className="flex items-center gap-2">
                {PALETTES.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPaletteIndex(i)}
                    aria-label={`Thème ${i + 1}`}
                    className="transition-all duration-500"
                    style={{
                      width: i === paletteIndex ? "28px" : "8px",
                      height: "8px",
                      borderRadius: "4px",
                      backgroundColor: i === paletteIndex
                        ? p.accent
                        : "rgba(255,255,255,0.2)",
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* ── GRILLE PRINCIPALE : texte gauche / photo droite ── */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 flex-1 justify-end pb-4">

              {/* ── GAUCHE : texte ── */}
              <div className="flex flex-col justify-end max-w-2xl">

                {/* Hello World */}
                <div className="overflow-hidden mb-1">
                  <motion.h2
                    className="font-black text-white leading-none"
                    style={{
                      fontSize: "clamp(2rem, 5.5vw, 5rem)",
                      letterSpacing: "-0.04em",
                    }}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {"</ Hello World>"}
                  </motion.h2>
                </div>

                {/* Ranja */}
                <div className="overflow-hidden">
                <motion.h1
                  className="font-black leading-none inline-block text-transparent bg-clip-text"
                  style={{
                    fontSize: "clamp(3.5rem, 10vw, 9rem)",
                    letterSpacing: "-0.04em",
                    backgroundImage: `linear-gradient(135deg, ${palette.accent}, ${palette.accentSecondary}, white)`
                  }}
                >
                  Ranja
                </motion.h1>
                </div>

                {/* Andriamiadana */}
                <div className="overflow-hidden mb-8">
                <motion.h1
                  className="font-black leading-none inline-block text-transparent bg-clip-text"
                  style={{
                    fontSize: "clamp(2.2rem, 7vw, 6rem)",
                    letterSpacing: "-0.04em",
                    backgroundImage: `linear-gradient(135deg, ${palette.accentSecondary}, rgba(255,255,255,0.85))`
                  }}
                >
                  Andriamiadana.
                </motion.h1>
                </div>

                {/* Description + CTA + Socials */}
                <motion.div
                  className="flex flex-col gap-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <p className="text-white/50 text-base sm:text-lg leading-relaxed max-wxl">
                    Développeur
                    <span className="text-white font-semibold"> Logiciel </span>
                    Junior.
                    Je conçois des solutions web et logicielles modernes, alliant performance technique et esthétique soignée.
                  </p>

                  <CTASocials accent={palette.accent} />
                  
                </motion.div>
              </div>

              {/* ── DROITE : Photo qui alterne (haut → bas) ── */}
              <div className="relative shrink-0 flex items-end justify-center lg:justify-end">
                <div
                  className="relative overflow-hidden"
                  style={{
                    width: "clamp(220px, 28vw, 380px)",
                    height: "clamp(300px, 40vw, 520px)",
                  }}
                >                
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={PHOTOS[photoIndex]}
                      src={PHOTOS[photoIndex]}
                      alt={`Photo ${photoIndex + 1}`}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                      initial={{ y: "-100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "100%", opacity: 0 }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </AnimatePresence>

                  {/* Overlay gradient bas */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1/3 z-10"
                    style={{
                      background: `linear-gradient(to top, ${palette.bg}cc, transparent)`,
                    }}
                  />
                </div>

                {/* Indicateur de photo */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {PHOTOS.map((_, i) => (
                    <div
                      key={i}
                      className="h-1 rounded-full transition-all duration-500"
                      style={{
                        width: i === photoIndex ? "20px" : "6px",
                        backgroundColor: i === photoIndex
                          ? palette.accent
                          : "rgba(255,255,255,0.3)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
              className="flex flex-col items-center gap-2 self-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <span className="text-white/20 text-xs font-mono uppercase tracking-widest"></span>
              <motion.div
                className="w-px h-10 origin-top"
                style={{ backgroundColor: palette.accent }}
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════
          STATS
      ═══════════════════════════════════════ */}
      <section className="py-24 relative bg-background border-t border-white/5" id="hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {[
              {
                value: "1ère",
                label: "Place",
                sub: "Hackathon DevFest 2025",
                description: "Vainqueur du hackathon DevFest 2025 à Antananarivo.",
                color: "#f97316",
                icon: "🏆",
              },
              {
                value: "3",
                label: "Ans",
                sub: "d'expérience",
                description: "En développement web, logiciel et bases de données depuis 2022.",
                color: "#ef4444",
                icon: "⚡",
              },
              {
                value: "10+",
                label: "Projets",
                sub: "réalisés",
                description: "Des applications desktop aux plateformes web modernes.",
                color: "#ffffff",
                icon: "🌐",
              },
            ].map(({ value, label, sub, description, color, icon }, i) => (
              <motion.div
                key={label}
                className="glass-card p-8 rounded-3xl relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
              >
                {/* Glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)` }}
                />

                <div className="text-3xl mb-6">{icon}</div>

                <div className="flex items-end gap-2 mb-1">
                  <span
                    className="font-black leading-none"
                    style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)", color }}
                  >
                    {value}
                  </span>
                  <span className="font-bold text-xl mb-2" style={{ color }}>
                    {label}
                  </span>
                </div>

                <p className="text-white/40 text-sm font-medium uppercase tracking-widest mb-4">
                  {sub}
                </p>

                <div className="w-12 h-0.5 mb-4 rounded-full" style={{ backgroundColor: color, opacity: 0.4 }} />

                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* ── À PROPOS ── */}
      <section id="about">
        <About />
      </section>

      {/* ── PROJETS ── */}
      <section id="projects" className="py-24">
        <Projects />
      </section>

    </div>
  );
}