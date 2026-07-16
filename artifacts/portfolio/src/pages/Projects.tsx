import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectsList } from "@/hooks/use-portfolio-api";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Search, Layers, Download } from "lucide-react";

const ACCENT  = "#10b981"; // vert émeraude
const ACCENT2 = "#eab308"; // jaune

export default function Projects() {
  const { data: projects, isLoading } = useProjectsList();
  const [filter, setFilter] = useState("Tous");
  const [showAllProjects, setShowAllProjects] = useState(false);

  const safeProjects = Array.isArray(projects) ? projects : [];

  const categories = [
    "Tous",
    ...Array.from(
      new Set(
        safeProjects
          .map((p: any) => p?.category?.split(" / ")[0])
          .filter(Boolean)
      )
    ),
  ];

  const filteredProjects = safeProjects.filter((p: any) =>
    filter === "Tous" ? true : p?.category?.includes(filter)
  );

  const displayedProjects = showAllProjects
  ? filteredProjects
  : filteredProjects.slice(0, 6);

  return (
    <div className="pt-32 pb-24 min-h-screen relative overflow-hidden">

      {/* ── Aurora verte/jaune en fond ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-10"
          style={{
            background: `radial-gradient(circle, ${ACCENT}, transparent 70%)`,
            top: "-10%",
            left: "-10%",
          }}
        />
        <div
          className="absolute w-[35vw] h-[35vw] rounded-full blur-[100px] opacity-8"
          style={{
            background: `radial-gradient(circle, ${ACCENT2}, transparent 70%)`,
            bottom: "5%",
            right: "5%",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── En-tête ── */}
        <motion.div
          className="max-w-3xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Tag */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{
              backgroundColor: `${ACCENT}18`,
              border: `1px solid ${ACCENT}30`,
              color: ACCENT,
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            📁

            {safeProjects.length > 0 ? (
              <span className="text-[#e3dfdf]">{safeProjects.length} projets</span>
            ) : (
              <span className="flex items-center gap-1 text-[#c4ab78]">
                Connexion instable, importation des projets en cours

                <span className="flex">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="mx-px"
                      animate={{
                        opacity: [0.2, 1, 0.2],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    >
                      •
                    </motion.span>
                  ))}
                </span>
              </span>
            )}
          </motion.div>

          <h1
            className="font-display font-black mb-6 leading-none"
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
          >
            Mes{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
              }}
            >
              Réalisations
            </span>
          </h1>
          <p className="text-lg text-white/40 leading-relaxed max-w-2xl">
            Des applications web modernes aux logiciels desktop, chaque projet
            reflète ma passion pour la Programmation propre et les interfaces intuitives.
          </p>
        </motion.div>

        {/* ── Filtres ── */}
        <motion.div
          className="flex flex-wrap gap-2 mb-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((cat) => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setFilter(cat);
                  setShowAllProjects(false);
                }}
                className="relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  backgroundColor: active ? ACCENT : "rgba(255,255,255,0.05)",
                  color: active ? "#000" : "rgba(255,255,255,0.5)",
                  border: `1px solid ${active ? ACCENT : "rgba(255,255,255,0.08)"}`,
                  boxShadow: active ? `0 0 20px ${ACCENT}40` : "none",
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.borderColor = `${ACCENT}50`;
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)";
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                  }
                }}
              >
                {cat}
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: ACCENT, zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── Grille ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl animate-pulse"
                style={{ backgroundColor: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.08)" }}
              />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProjects.map((project: any, i: number) => (
                <motion.div
                  key={project?.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <ProjectCard project={project as any} index={i} />
                </motion.div>
              ))}

              {filteredProjects.length === 0 && (
                <motion.div
                  className="col-span-full py-28 text-center rounded-3xl"
                  style={{
                    backgroundColor: "rgba(16,185,129,0.04)",
                    border: "1px solid rgba(16,185,129,0.12)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ backgroundColor: `${ACCENT}15` }}
                  >
                    <Search className="w-7 h-7" style={{ color: ACCENT }} />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2 text-white/80">
                    Portfolio en cours de maintenance...
                  </h3>
                  <p className="text-white/30 text-sm">Les projets s'afficheront plus tard.</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      {/* Bouton Afficher tout / Réduire */}
      {filteredProjects.length > 6 && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={() => setShowAllProjects(!showAllProjects)}
            className="px-8 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider border-2 transition-all duration-300 relative overflow-hidden group shadow-lg active:scale-95"
            style={{
              borderColor: ACCENT,
              boxShadow: `0 4px 20px -10px ${ACCENT}`,
            }}
          >
            <span
              className={`relative z-10 transition-colors duration-300 ${
                showAllProjects ? "text-black" : "group-hover:text-black"
              }`}
            >
              {showAllProjects
                ? "Réduire l'affichage"
                : `Afficher tout (${filteredProjects.length})`}
            </span>

            <div
              className={`absolute inset-0 z-0 transition-transform duration-300 ${
                showAllProjects
                  ? "translate-y-0"
                  : "translate-y-full group-hover:translate-y-0"
              }`}
              style={{
                backgroundColor: ACCENT,
              }}
            />
          </button>
        </div>
      )}
    </div>
  );
}