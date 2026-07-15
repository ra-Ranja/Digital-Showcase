import React, { useState, useEffect } from "react";
import { GraduationCap, Award, BookOpen, User, MapPin } from "lucide-react";
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
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  [key: string]: unknown;
}

type PhotoShape = "square" | "landscape" | "portrait";

interface PhotoDef {
  src: string;
  shape: PhotoShape;
}

interface PhotoConfig {
  rotate: number;
  x: string;
  y: string;
  widthClass: string;
  aspectClass: string;
  zIndex: number;
  floatDelay: number;
}

// ── Palettes ───────────────────────────────────────────
const PALETTES: Palette[] = [
  { bg: "#0a0a0f", accent: "#6366f1", accentSecondary: "#a855f7", word: "" },
  { bg: "#0a0f0a", accent: "#10b981", accentSecondary: "#06b6d4", word: "BATIR" },
  { bg: "#0f0a0a", accent: "#f97316", accentSecondary: "#ef4444", word: "CODER" },
  { bg: "#0f0a0f", accent: "#e879f9", accentSecondary: "#818cf8", word: "CREER" },
];

// Photo1 = carrée (gauche, oblique haut-gauche)
// Photo2 = rectangle horizontal (droite, oblique bas-droite)
// Photo3 = rectangle vertical (centre, au premier plan, droite)
const PHOTOS: PhotoDef[] = [
  { src: "/images/Photo1.jpg", shape: "square" },
  { src: "/images/Photo2.webp", shape: "landscape" },
  { src: "/images/Photo3.webp", shape: "portrait" },
];

// Configuration géométrique par photo (index correspond à l'ordre dans PHOTOS)
const PHOTO_CONFIGS: PhotoConfig[] = [
  // Photo1 — carrée, en haut à gauche, oblique -40°
  {
    rotate: -40,
    x: "-52%",
    y: "-28%",
    widthClass: "w-48 sm:w-56",
    aspectClass: "aspect-square",
    zIndex: 10,
    floatDelay: 0,
  },
  // Photo2 — rectangle horizontal, en bas à droite, oblique +40°
  {
    rotate: -30,
    x: "48%",
    y: "26%",
    widthClass: "w-64 sm:w-72",
    aspectClass: "aspect-3/2",
    zIndex: 30,
    floatDelay: 0.4,
  },
  // Photo3 — rectangle vertical, au centre, droite, premier plan
  {
    rotate: 0,
    x: "0%",
    y: "0%",
    widthClass: "w-55 sm:w-65",
    aspectClass: "aspect-3/4",
    zIndex: 20,
    floatDelay: 0.2,
  },
];

export default function Home() {
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [showAllProjects, setShowAllProjects] = useState(false);
  const palette: Palette = PALETTES[paletteIndex];
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  // Auto-changement de palette toutes les 3 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setPaletteIndex((prev) => (prev + 1) % PALETTES.length);
    }, 3000);
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

  // Gestion des projets
  const { data: projects, isLoading } = useProjectsList();
  const projectsArray: Project[] = Array.isArray(projects) ? (projects as unknown as Project[]) : [];

  // Filtrage : afficher soit 6 projets soit la totalité
  const displayedProjects = showAllProjects ? projectsArray : projectsArray.slice(0, 6);

  return (
    <div className="flex flex-col w-full text-white overflow-x-hidden">
      
      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <div className="relative min-h-screen container-hero">
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
          {/* Aurora effect */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div
              className="absolute w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-25"
              animate={{
                left: `${mousePos.x - 30}%`,
                top: `${mousePos.y - 30}%`,
                background: `radial-gradient(circle, ${palette.accent}, transparent 70%)`,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Giant background text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <AnimatePresence mode="wait">
              {palette.word && (
                <motion.span
                  key={palette.word}
                  className="font-black text-transparent bg-clip-text"
                  style={{
                    fontSize: "clamp(10rem, 28vw, 26rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.05em",
                    backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)`,
                  }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                >
                  {palette.word}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Main Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full min-h-screen flex flex-col justify-between pt-24 pb-12">
            
            {/* Palette Indicators */}
            <div className="flex items-center gap-2">
              {PALETTES.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPaletteIndex(i)}
                  className="transition-all duration-500 h-2 rounded-full"
                  style={{
                    width: i === paletteIndex ? "28px" : "8px",
                    backgroundColor: i === paletteIndex ? p.accent : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-16 flex-1 justify-center my-auto">
              
              {/* Left Column: Typography */}
              <div className="flex flex-col max-w-2xl">
                <div className="overflow-hidden mb-1">
                  <motion.h2
                    className="font-black opacity-80"
                    style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)", color: palette.accent }}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    {"</ Hello World>"}
                  </motion.h2>
                </div>

                <div className="overflow-hidden">
                  <motion.h1
                    className="font-black leading-none inline-block text-transparent bg-clip-text bg-linear-to-r"
                    style={{
                      fontSize: "clamp(3.5rem, 9vw, 8rem)",
                      letterSpacing: "-0.04em",
                      backgroundImage: `linear-gradient(135deg, ${palette.accent}, ${palette.accentSecondary}, white)`
                    }}
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  >
                    Ranja
                  </motion.h1>
                </div>

                <div className="overflow-hidden mb-6">
                  <motion.h1
                    className="font-black leading-none inline-block text-transparent bg-clip-text"
                    style={{
                      fontSize: "clamp(2rem, 6.5vw, 5.5rem)",
                      letterSpacing: "-0.04em",
                      backgroundImage: `linear-gradient(135deg, ${palette.accentSecondary}, rgba(255,255,255,0.9))`
                    }}
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Andriamiadana.
                  </motion.h1>
                </div>

                <motion.div
                  className="flex flex-col gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-xl">
                    Développeur <span className="text-white font-semibold">Logiciel</span> Junior.
                    Je conçois des solutions web et applicatives modernes, alliant performance technique et architectures soignées.
                  </p>
                  <CTASocials accent={palette.accent} />
                </motion.div>
              </div>

              {/* MODIFICATION 1 : 3 Photos superposées, cadrages différenciés + obliques */}
              <div className="relative flex items-center justify-center w-full lg:w-1/2 h-112.5">
                {PHOTOS.map((photo, index) => {
                  const config = PHOTO_CONFIGS[index];
                  const borderColor =
                    index === 0 ? palette.accent : index === 1 ? palette.accentSecondary : "#ffffff";

                  return (
                    <motion.div
                      key={photo.src}
                      className={`absolute ${config.widthClass} ${config.aspectClass} overflow-hidden rounded-[2.5rem] border-4 shadow-2xl group bg-neutral-900`}
                      onClick={() =>
                        setSelectedPhoto(selectedPhoto === index ? null : index)
                      }
                      style={{
                        zIndex: config.zIndex,
                        borderColor,
                      }}
                      initial={{ opacity: 0, scale: 0.5, y: 100, rotate: config.rotate }}
                      animate={{
                        opacity: 1,
                        scale: selectedPhoto === index ? 1.05 : 1,
                        rotate: selectedPhoto === index ? 0 : config.rotate,
                        x: config.x,
                        y: [
                          config.y,
                          `calc(${config.y} - 15px)`,
                          config.y,
                        ],
                        zIndex: selectedPhoto === index ? 40 : config.zIndex,
                      }}
                      transition={{
                        opacity: { duration: 0.8, delay: index * 0.2 },
                        scale: { duration: 0.8, delay: index * 0.2 },
                        y: {
                          duration: 4 + index,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                      whileHover={{
                        scale: 1.05,
                        rotate: 0,
                        zIndex: 40,
                        transition: { duration: 0.3 },
                      }}
                      whileTap={{
                        scale: 1.05,
                        rotate: 0,
                        zIndex: 40,
                      }}
                    >
                      <img
                        src={photo.src}
                        alt={`Ran's Showcase ${index + 1}`}
                        className="w-full h-full object-cover object-top transition-all duration-500"
                        style={{
                          filter:
                            selectedPhoto === index
                              ? "grayscale(0%) contrast(1)"
                              : "grayscale(100%) contrast(1.25)",
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    </motion.div>
                  );
                })}
              </div>

            </div>

            {/* Scroll Indicator */}
            <div className="flex flex-col items-center gap-2 self-center pt-4">
              <motion.div
                className="w-px h-10 origin-top"
                style={{ backgroundColor: palette.accent }}
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════
          STATS SECTION
      ═══════════════════════════════════════ */}
      <section className="py-24 relative bg-black/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: "1ère", label: "Place", sub: "Hackathon DevFest 2025", description: "Vainqueur du hackathon DevFest 2025 à Antananarivo.", color: palette.accent, icon: "🏆" },
              { value: "3 Ans", label: "d'études", sub: "Génie Logiciel", description: "En cours de validation de Licence à l'ENI Fianarantsoa.", color: palette.accentSecondary, icon: "⚡" },
              { value: "10+", label: "Projets", sub: "conçus", description: "Des applications de bureau aux plateformes web modernes et robustes.", color: "#ffffff", icon: "🌐" },
            ].map(({ value, label, sub, description, color, icon }, i) => (
              <motion.div
                key={label}
                className="bg-white/2 border border-white/10 backdrop-blur-md p-8 rounded-3xl relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4, borderColor: color }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)` }}
                />
                <div className="text-3xl mb-4">{icon}</div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="font-black text-4xl sm:text-5xl tracking-tight" style={{ color }}>{value}</span>
                  <span className="font-bold text-lg mb-1 text-white/80">{label}</span>
                </div>
                <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-4">{sub}</p>
                <div className="w-12 h-0.5 mb-4 rounded-full" style={{ backgroundColor: color, opacity: 0.4 }} />
                <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MODIFICATION 2 : À PROPOS (Stylisé avec animations)
      ═══════════════════════════════════════ */}
      <section id="about" className="py-32 relative max-w-5xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            
            <motion.div className="col-span-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="rounded-[10rem] overflow-hidden glass-card mb-4 p-1">
                <img
                  src={`${import.meta.env.BASE_URL}images/Profil.jpg`}
                  alt="Ranja Andriamiadana"
                  className="w-full h-full object-cover rounded-[10rem]"
                />
              </div>
              <div className="space-y-3 text-muted-foreground text-xs sm:text-sm ml-14">
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 shrink-0" style={{ color: "#2bce6f" }} />
                  <span>Ranja ANDRIAMIADANA</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" style={{ color: "#2bce6f" }} />
                  <span>Antananarivo, Madagascar</span>
                </p>
                <p className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 shrink-0" style={{ color: "#2bce6f" }} />
                  <span>ENI Fianarantsoa</span>
                </p>
              </div>
            </motion.div>
          </div>
          
          <div className="md:col-span-8 flex flex-col gap-12">
            <motion.div className="col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1
                className="font-display font-bold mb-4 leading-tight"
                style={{ fontSize: "clamp(1.4rem, 4vw, 3.5rem)" }}
              >
                Développeur passionné par la{" "}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f97316, #ef4444)" }}>
                  création d'expériences
                </span>{" "}
                interactives.
              </h1>
            </motion.div>

            {/* Paragraphe 01 */}
            <motion.div 
              className="relative pl-8 sm:pl-12 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="absolute left-0 top-0 text-2xl font-mono font-bold text-transparent bg-clip-text bg-linear-to-r" style={{ backgroundImage: `linear-gradient(to right, ${palette.accent}, ${palette.accentSecondary})` }}>
                I
              </span>
              <p className="text-lg sm:text-xl text-neutral-300 font-medium leading-relaxed group-hover:text-white transition-colors duration-300">
              Un bon logiciel ne se limite pas à fonctionner : il doit être intuitif, performant et agréable à utiliser. C'est cette<span className="text-[#b1b474] font-semibold"> recherche de qualité</span> qui me pousse à explorer les subtilités du développement.
              </p>
            </motion.div>

            {/* Paragraphe 02 */}
            <motion.div 
              className="relative pl-8 sm:pl-12 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="absolute left-0 top-0 text-2xl font-mono font-bold text-transparent bg-clip-text bg-linear-to-r" style={{ backgroundImage: `linear-gradient(to right, ${palette.accentSecondary}, #fff)` }}>
                II
              </span>
              <p className="text-lg sm:text-xl text-neutral-300 font-medium leading-relaxed group-hover:text-white transition-colors duration-300">
              Je considère chaque projet comme une occasion de concevoir une solution dont je peux être fier.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="mt-25">
          <About />
        </div>

      </section>

      <section id="projects">
        <div className="">
          <Projects />
        </div>
      </section>

    </div>
  );
}