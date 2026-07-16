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

const PHOTOS: PhotoDef[] = [
  { src: "/images/Photo1.jpg", shape: "square" },
  { src: "/images/Photo2.webp", shape: "landscape" },
  { src: "/images/Photo3.webp", shape: "portrait" },
];

const PHOTO_CONFIGS: PhotoConfig[] = [
  {
    rotate: -40,
    x: "-52%",
    y: "-28%",
    widthClass: "w-48 sm:w-56",
    aspectClass: "aspect-square",
    zIndex: 10,
    floatDelay: 0,
  },
  {
    rotate: -30,
    x: "48%",
    y: "26%",
    widthClass: "w-64 sm:w-72",
    aspectClass: "aspect-3/2",
    zIndex: 30,
    floatDelay: 0.4,
  },
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

const PHOTO_COLOR_INTERVAL = 1500;

// ── Composant de transition en gouttes de peinture animées ──
function DrippingTransition({ color }: { color: string }) {
  // Tracé SVG précis reproduisant l'effet bulbeux et organique
  const dripPath =
    "M 0,0 L 1000,0 L 1000,30 C 970,30 960,50 950,75 C 945,85 940,90 930,90 C 920,90 915,85 910,75 C 900,50 890,30 860,30 C 830,30 815,45 810,75 C 805,90 795,95 785,95 C 775,95 765,90 760,75 C 755,45 740,30 710,30 C 680,30 670,50 650,50 C 630,50 620,30 590,30 C 550,30 535,45 530,85 C 528,100 522,108 510,108 C 498,108 492,100 490,85 C 485,45 470,30 430,30 C 400,30 390,50 370,75 C 360,85 350,85 340,75 C 320,50 310,30 280,30 C 250,30 240,45 230,75 C 225,95 215,105 200,105 C 185,105 175,95 170,75 C 160,45 150,30 120,30 C 90,30 80,60 60,60 C 40,60 30,30 0,30 Z";

  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none z-20 h-16 sm:h-24 translate-y-[98%]">
      {/* Conteneur doublé pour assurer un défilement infini et fluide sans coupure */}
      <motion.div
        className="flex w-[200%] h-full"
        animate={{ x: ["-50%", "0%"] }}
        transition={{
          ease: "linear",
          duration: 25, // Vitesse lente et organique
          repeat: Infinity,
        }}
        style={{
          filter: "drop-shadow(0px 12px 10px rgba(0, 0, 0, 0.75))",
        }}
      >
        <svg
          viewBox="0 0 1000 120"
          preserveAspectRatio="none"
          className="w-1/2 h-full scale-y-110"
        >
          <motion.path
            d={dripPath}
            animate={{ fill: color }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </svg>
        <svg
          viewBox="0 0 1000 120"
          preserveAspectRatio="none"
          className="w-1/2 h-full scale-y-110"
          aria-hidden="true"
        >
          <motion.path
            d={dripPath}
            animate={{ fill: color }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

function ZigZagTransition({ color }: { color: string }) {
  const path = `
    M0,0
    L1000,0
    L1000,8
    L990,12
    L980,8
    L970,12
    L960,8
    L950,12
    L940,8
    L930,12
    L920,8
    L910,12
    L900,8
    L890,12
    L880,8
    L870,12
    L860,8
    L850,12
    L840,8
    L830,12
    L820,8
    L810,12
    L800,8
    L790,12
    L780,8
    L770,12
    L760,8
    L750,12
    L740,8
    L730,12
    L720,8
    L710,12
    L700,8
    L690,12
    L680,8
    L670,12
    L660,8
    L650,12
    L640,8
    L630,12
    L620,8
    L610,12
    L600,8
    L590,12
    L580,8
    L570,12
    L560,8
    L550,12
    L540,8
    L530,12
    L520,8
    L510,12
    L500,8
    L490,12
    L480,8
    L470,12
    L460,8
    L450,12
    L440,8
    L430,12
    L420,8
    L410,12
    L400,8
    L390,12
    L380,8
    L370,12
    L360,8
    L350,12
    L340,8
    L330,12
    L320,8
    L310,12
    L300,8
    L290,12
    L280,8
    L270,12
    L260,8
    L250,12
    L240,8
    L230,12
    L220,8
    L210,12
    L200,8
    L190,12
    L180,8
    L170,12
    L160,8
    L150,12
    L140,8
    L130,12
    L120,8
    L110,12
    L100,8
    L90,12
    L80,8
    L70,12
    L60,8
    L50,12
    L40,8
    L30,12
    L20,8
    L10,12
    L0,8
    Z
  `;

  return (
    <div className="absolute bottom-0 left-0 w-full h-3 overflow-hidden pointer-events-none translate-y-full z-30">
      <motion.div
        className="flex w-[200%] h-full"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 18,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {[0, 1].map((i) => (
          <svg
            key={i}
            viewBox="0 0 1000 12"
            preserveAspectRatio="none"
            className="w-1/2 h-full"
          >
            <path d={path} fill={color} />
          </svg>
        ))}
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [showAllProjects, setShowAllProjects] = useState(false);
  const palette: Palette = PALETTES[paletteIndex];
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [colorPhotoIndex, setColorPhotoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPaletteIndex((prev) => (prev + 1) % PALETTES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorPhotoIndex((prev) => (prev + 1) % PHOTOS.length);
    }, PHOTO_COLOR_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (document.getElementById("gf-allura")) return;

    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";

    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";

    const stylesheet = document.createElement("link");
    stylesheet.id = "gf-allura";
    stylesheet.rel = "stylesheet";
    stylesheet.href = "https://fonts.googleapis.com/css2?family=Allura&display=swap";

    document.head.appendChild(preconnect1);
    document.head.appendChild(preconnect2);
    document.head.appendChild(stylesheet);
  }, []);

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
  const projectsArray: Project[] = Array.isArray(projects) ? (projects as unknown as Project[]) : [];
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
                    style={{ fontSize: "clamp(1.5rem, 2vw, 2rem)", color: palette.accent }}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    {"</ Hello World>"}
                  </motion.h2>
                </div>

                <div className="overflow-hidden">
                  <motion.h1
                    className="leading-none inline-block text-transparent bg-clip-text bg-linear-to-r"
                    style={{
                      fontFamily: "'Allura', cursive",
                      fontWeight: 400,
                      fontSize: "clamp(4.5rem, 11vw, 10rem)",
                      letterSpacing: "0",
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
                    className="leading-none inline-block text-transparent bg-clip-text"
                    style={{
                      fontFamily: "'Allura', cursive",
                      fontWeight: 400,
                      fontSize: "clamp(2.5rem, 8vw, 6.5rem)",
                      letterSpacing: "0",
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

              {/* 3 Photos superposées */}
              <div className="relative flex items-center justify-center w-full lg:w-1/2 h-112.5">
                {PHOTOS.map((photo, index) => {
                  const config = PHOTO_CONFIGS[index];
                  const borderColor =
                    index === 0 ? palette.accent : index === 1 ? palette.accentSecondary : "#ffffff";
                  const isColor = selectedPhoto === index || colorPhotoIndex === index;

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
                        className="w-full h-full object-cover object-top transition-[filter] duration-700 ease-in-out"
                        style={{
                          filter: isColor
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

        {/* ── Transition goutte de peinture dynamique placée en bas du Hero ── */}
        <DrippingTransition color={palette.bg} />
      </div>

      {/* ═══════════════════════════════════════
          STATS SECTION (Bordure droite supprimée pour un fondu parfait)
      ═══════════════════════════════════════ */}
      <section className="py-36 relative bg-black/40">
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
        <ZigZagTransition color="#050505" />
      </section>

      {/* ═══════════════════════════════════════
          À PROPOS
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