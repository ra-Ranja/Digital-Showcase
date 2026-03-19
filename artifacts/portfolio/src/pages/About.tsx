import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, User, MapPin } from "lucide-react";

const BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";

const SKILLS = [
  // Langages — éparpillés à gauche
  { id: 0,  label: "JavaScript", color: "#f7df1e", cx: 8,  cy: 12, cat: "lang",  logo: `${BASE}javascript/javascript-original.svg` },
  { id: 1,  label: "Java",       color: "#f89820", cx: 18, cy: 52, cat: "lang",  logo: `${BASE}java/java-original.svg` },
  { id: 2,  label: "PHP",        color: "#8892be", cx: 5,  cy: 78, cat: "lang",  logo: `${BASE}php/php-original.svg` },
  { id: 3,  label: "Python",     color: "#3776ab", cx: 22, cy: 30, cat: "lang",  logo: `${BASE}python/python-original.svg` },

  // Frameworks — zone centre, dispersés
  { id: 4,  label: "ReactJS",    color: "#61dafb", cx: 38, cy: 8,  cat: "fw",    logo: `${BASE}react/react-original.svg` },
  { id: 5,  label: "Tailwind",   color: "#06b6d4", cx: 30, cy: 65, cat: "fw",    logo: `${BASE}tailwindcss/tailwindcss-original.svg` },
  { id: 6,  label: "Next.js",    color: "#ffffff", cx: 52, cy: 28, cat: "fw",    logo: `${BASE}nextjs/nextjs-original.svg` },
  { id: 7,  label: "Laravel",    color: "#ff2d20", cx: 44, cy: 82, cat: "fw",    logo: `${BASE}laravel/laravel-original.svg` },
  { id: 8,  label: "FastAPI",    color: "#009688", cx: 62, cy: 58, cat: "fw",    logo: `${BASE}fastapi/fastapi-original.svg` },

  // BDD — droite, éparpillées
  { id: 9,  label: "PostgreSQL", color: "#336791", cx: 72, cy: 14, cat: "db",    logo: `${BASE}postgresql/postgresql-original.svg` },
  { id: 10, label: "MySQL",      color: "#4479a1", cx: 85, cy: 40, cat: "db",    logo: `${BASE}mysql/mysql-original.svg` },
  { id: 11, label: "SQLite",     color: "#07405e", cx: 76, cy: 72, cat: "db",    logo: `${BASE}sqlite/sqlite-original.svg` },
  { id: 12, label: "Oracle",     color: "#c74634", cx: 92, cy: 82, cat: "db",    logo: `${BASE}oracle/oracle-original.svg` },
];

const PATH_IDS = [0, 4, 5, 6, 9, 10, 12];

const EXTRA_LINKS = [
  [0, 5], [0, 4], [1, 7], [2, 7], [2, 8],
  [3, 8], [4, 6], [5, 7], [5, 8], [6, 9],
  [8, 10],[7, 11],[9, 12],[10, 11],[11, 12],
];

const CAT_LABELS: Record<string, string> = {
  lang: "Langages",
  fw:   "Frameworks",
  db:   "Bases de données",
};

const CAT_COLORS: Record<string, string> = {
  lang: "#f97316",
  fw:   "#61dafb",
  db:   "#336791",
};

function HexSkills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 560 });
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setDims({ w, h: Math.min(w * 0.72, 580) });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { w, h } = dims;
  const hexR = Math.max(26, Math.min(44, w / 20));
  const logoSize = hexR * 0.75;

  const pos = (s: typeof SKILLS[0]) => ({
    x: (s.cx / 100) * w,
    y: (s.cy / 100) * h,
  });

  const hexPath = (cx: number, cy: number, r: number) => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    });
    return `M${pts.join("L")}Z`;
  };

  const mainPathD = PATH_IDS.map((id, i) => {
    const { x, y } = pos(SKILLS[id]);
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");

  const connectedIds = hovered !== null
    ? new Set(
        EXTRA_LINKS
          .filter(([a, b]) => a === hovered || b === hovered)
          .flatMap(([a, b]) => [a, b])
      )
    : new Set<number>();

  const hoveredSkill = hovered !== null ? SKILLS[hovered] : null;

  return (
    <div ref={containerRef} className="w-full select-none">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
        <defs>
          {SKILLS.map((s) => (
            <radialGradient key={s.id} id={`hg-${s.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={s.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.03" />
            </radialGradient>
          ))}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-strong">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Chemin principal ── */}
        <path
          d={mainPathD}
          fill="none"
          stroke="rgba(249,115,22,0.12)"
          strokeWidth="1.2"
          strokeDasharray="6 5"
        />
        <circle r="4" fill="#f97316" filter="url(#glow)" opacity="0.9">
          <animateMotion dur="9s" repeatCount="indefinite" path={mainPathD} />
        </circle>
        <circle r="2.5" fill="#ef4444" filter="url(#glow)" opacity="0.6">
          <animateMotion dur="13s" repeatCount="indefinite" begin="5s" path={mainPathD} />
        </circle>

        {/* ── Liens secondaires ── */}
        {EXTRA_LINKS.map(([a, b], i) => {
          const pa = pos(SKILLS[a]);
          const pb = pos(SKILLS[b]);
          const isActive = hovered === a || hovered === b;
          return (
            <g key={i}>
              <line
                x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                stroke={isActive ? SKILLS[hovered === a ? b : a].color : "rgba(255,255,255,0.04)"}
                strokeWidth={isActive ? 1.2 : 0.5}
                strokeDasharray={isActive ? "none" : "3 6"}
                style={{ transition: "all 0.35s" }}
              />
              {isActive && (
                <circle r="2.5" fill={SKILLS[b].color} opacity="0.9" filter="url(#glow)">
                  <animateMotion
                    dur={`${2.2 + (i % 5) * 0.4}s`}
                    repeatCount="indefinite"
                    path={`M${pa.x},${pa.y} L${pb.x},${pb.y}`}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* ── Hexagones ── */}
        {SKILLS.map((skill, i) => {
          const { x, y } = pos(skill);
          const isHov = hovered === skill.id;
          const isConn = connectedIds.has(skill.id);
          const isDim = hovered !== null && !isHov && !isConn;

          return (
            <motion.g
              key={skill.id}
              onMouseEnter={() => setHovered(skill.id)}
              onMouseLeave={() => setHovered(null)}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 160, damping: 14 }}
              animate={{
                y: [0, -5, 0],
                transition: {
                  duration: 3.5 + (i % 4) * 0.6,
                  delay: i * 0.35,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              style={{
                opacity: isDim ? 0.15 : 1,
                transition: "opacity 0.3s",
                cursor: "default",
              }}
            >
              {/* Anneau pulsant */}
              <motion.path
                d={hexPath(x, y, hexR + 8)}
                fill="none"
                stroke={skill.color}
                animate={{
                  opacity: isHov ? [0.5, 1, 0.5] : [0.04, 0.18, 0.04],
                  strokeWidth: isHov ? ["1.5px", "2.5px", "1.5px"] : ["0.5px", "1px", "0.5px"],
                }}
                transition={{
                  duration: 2.2 + (i % 3) * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.18,
                }}
              />

              {/* Fond */}
              <path d={hexPath(x, y, hexR)} fill={`url(#hg-${skill.id})`} />

              {/* Glow hover */}
              {isHov && (
                <path
                  d={hexPath(x, y, hexR + 4)}
                  fill={skill.color}
                  opacity="0.12"
                  filter="url(#glow-strong)"
                />
              )}

              {/* Bordure */}
              <path
                d={hexPath(x, y, hexR)}
                fill="none"
                stroke={skill.color}
                strokeWidth={isHov ? 2 : isConn ? 1 : 0.6}
                opacity={isHov ? 1 : isConn ? 0.65 : 0.22}
                style={{ transition: "all 0.3s" }}
              />

              {/* Logo */}
              <image
                href={skill.logo}
                x={x - logoSize / 2}
                y={y - logoSize / 2 - hexR * 0.1}
                width={logoSize}
                height={logoSize}
                style={{ opacity: isHov ? 1 : 0.8, transition: "opacity 0.2s" }}
              />

              {/* Label sous le logo */}
              <text
                x={x}
                y={y + hexR * 0.52}
                textAnchor="middle"
                fill={isHov ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)"}
                fontSize={hexR * 0.24}
                fontFamily="sans-serif"
                style={{ transition: "fill 0.2s", userSelect: "none" }}
              >
                {skill.label}
              </text>
            </motion.g>
          );
        })}

        {/* Tooltip */}
        {hoveredSkill && (() => {
          const { x, y } = pos(hoveredSkill);
          return (
            <g>
              <rect
                x={x - 55} y={y - hexR - 38}
                width="110" height="26"
                rx="6"
                fill="rgba(0,0,0,0.85)"
                stroke={hoveredSkill.color}
                strokeWidth="0.8"
                strokeOpacity="0.5"
              />
              <text
                x={x} y={y - hexR - 21}
                textAnchor="middle"
                fill={hoveredSkill.color}
                fontSize="11"
                fontWeight="600"
                fontFamily="sans-serif"
              >
                {CAT_LABELS[hoveredSkill.cat]}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

export default function About() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-3 gap-6 mb-20">
          <motion.div className="col-span-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="rounded-[10rem] overflow-hidden glass-card mb-4 p-1">
              <img
                src={`${import.meta.env.BASE_URL}images/Profil.jpg`}
                alt="Ranja Andriamiadana"
                className="w-full h-full object-cover rounded-[10rem]"
              />
            </div>
            <div className="space-y-3 text-muted-foreground text-xs sm:text-sm">
              <p className="flex items-center gap-2">
                <User className="w-4 h-4 shrink-0" style={{ color: "#f97316" }} />
                <span>Ranja ANDRIAMIADANA</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: "#f97316" }} />
                <span>Antananarivo, Madagascar</span>
              </p>
              <p className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 shrink-0" style={{ color: "#f97316" }} />
                <span>ENI Fianarantsoa</span>
              </p>
            </div>
          </motion.div>

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
            <div className="text-muted-foreground leading-relaxed" style={{ fontSize: "clamp(0.75rem, 2vw, 1rem)" }}>
              <p className="mb-3">
                Actuellement étudiant en troisième année de Licence en Génie Logiciel
                à l'École Nationale d'Informatique (ENI) de Fianarantsoa, j'ai développé
                une appétence pour la résolution de problèmes par le code.
              </p>
              <p>
                Mon parcours m'a permis de toucher à une variété de technologies, de la
                programmation système au développement d'applications web modernes.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stack */}
        <motion.section className="mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-display font-bold mb-10 flex items-center gap-3">
            <BookOpen style={{ color: "#f97316" }} /> Stack Technique
          </h2>
          <HexSkills />
        </motion.section>

        {/* Timeline */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-display font-bold mb-10 flex items-center gap-3">
            <Award style={{ color: "#ef4444" }} /> Formations
          </h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-white/10 before:to-transparent">
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" style={{ borderColor: "rgba(249,115,22,0.4)", color: "#f97316" }}>
                <Award className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 rounded-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                  <h3 className="font-bold text-lg text-white">ENI - Fianarantsoa</h3>
                  <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#f97316" }}>En cours</span>
                </div>
                <p className="text-muted-foreground text-sm">3ème année de Licence professionnelle en Génie Logiciel et Base de Données.</p>
              </div>
            </div>
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" style={{ borderColor: "rgba(239,68,68,0.4)", color: "#ef4444" }}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 rounded-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                  <h3 className="font-bold text-lg text-white">ESCA Antanimena - Antananarivo</h3>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-white/10 text-white/70">2023</span>
                </div>
                <p className="text-muted-foreground text-sm">Baccalauréat série C, Mention Assez Bien.</p>
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}