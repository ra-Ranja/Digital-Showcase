import React, { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProject } from "@workspace/api-client-react";
import { useProjectsList } from "@/hooks/use-portfolio-api";
import { ArrowLeft, Github, ExternalLink, Calendar, Tag, Play } from "lucide-react";

// ── Palettes ──────────────────────────────────────────────
const PALETTES = [
  { accent: "#6366f1", accentSecondary: "#a855f7" },
  { accent: "#10b981", accentSecondary: "#06b6d4" },
  { accent: "#f97316", accentSecondary: "#ef4444" },
  { accent: "#e879f9", accentSecondary: "#818cf8" },
];

export default function ProjectDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);

  const { data: apiProject, isError } = useGetProject(id);
  const { data: allProjects } = useProjectsList();
  const project = isError
    ? allProjects?.find(p => p.id === id)
    : (apiProject || allProjects?.find(p => p.id === id));

  const [paletteIdx, setPaletteIdx] = useState(0);

  // Cycle des palettes toutes les 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setPaletteIdx(i => (i + 1) % PALETTES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Projet introuvable</h2>
          <Link href="/#projects" className="text-primary hover:underline">Retour aux projets</Link>
        </div>
      </div>
    );
  }

  const palette = PALETTES[paletteIdx];
  const img = (project as any).coverImageBase64 || project.coverImage;
  const videoMedia = (project as any).media?.find(
    (m: any) => m.type === "youtube" || m.type === "video"
  );
  const ytId = videoMedia?.type === "youtube"
    ? videoMedia.url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1]
    : null;

  return (
    <div className="min-h-screen pt-24 pb-24 relative transition-colors duration-1000">

      {/* ── Glow animé ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={palette.accent}
          className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[50vh] blur-[150px] opacity-20 pointer-events-none z-0"
          style={{ background: `radial-gradient(ellipse at top, ${palette.accent}, transparent 70%)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      </AnimatePresence>

      {/* ── Glow secondaire ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={palette.accentSecondary}
          className="fixed bottom-0 right-0 w-[40vw] h-[40vh] blur-[120px] opacity-10 pointer-events-none z-0"
          style={{ background: `radial-gradient(circle, ${palette.accentSecondary}, transparent 70%)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Back ── */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux projets
        </Link>

        {/* ── Hero : texte gauche / image droite ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">

          {/* Gauche */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <motion.span
                className="px-3 py-1 rounded-full text-xs font-medium border"
                animate={{
                  backgroundColor: `${palette.accent}20`,
                  borderColor: `${palette.accent}40`,
                  color: palette.accent,
                }}
                transition={{ duration: 1 }}
              >
                {project.category}
              </motion.span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-muted-foreground border border-white/10 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {(project as any).projectDate
                  ? new Date((project as any).projectDate).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
                  : project.year}
              </span>
            </div>

            {/* Titre */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
              {project.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {project.description}
            </p>
          </motion.div>

          {/* Droite — Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {img ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                <img
                  src={img}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {/* Bordure animée */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{ borderColor: `${palette.accent}40` }}
                  transition={{ duration: 1 }}
                  style={{ border: `1px solid ${palette.accent}40` }}
                />
                {/* Glow image */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{ boxShadow: `0 0 60px ${palette.accent}20` }}
                  transition={{ duration: 1 }}
                />
              </div>
            ) : (
              <div
                className="rounded-2xl aspect-video flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${palette.accent}20, ${palette.accentSecondary}10)`,
                  border: `1px solid ${palette.accent}20`,
                }}
              >
                <span className="text-white/20 text-sm">Aucune image</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Séparateur ── */}
        <motion.div
          className="w-full h-px mb-16"
          animate={{ background: `linear-gradient(90deg, transparent, ${palette.accent}40, transparent)` }}
          transition={{ duration: 1 }}
        />

        {/* ── Contenu bas ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Description longue */}
          <motion.div
            className="md:col-span-2 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-display font-bold">À propos du projet</h2>
            <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
              <p>{project.longDescription || project.description}</p>
            </div>

            {/* Vidéo intégrée */}
            {videoMedia && (
              <div className="mt-8">
                <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5" style={{ color: palette.accent }} /> Démo vidéo
                </h2>
                <div
                  className="rounded-2xl overflow-hidden aspect-video"
                  style={{ border: `1px solid ${palette.accent}20` }}
                >
                  {ytId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={videoMedia.url} controls className="w-full h-full" />
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Technologies */}
            <motion.div
              className="p-6 rounded-2xl glass-card"
              animate={{ borderColor: `${palette.accent}20` }}
              transition={{ duration: 1 }}
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <motion.span animate={{ color: palette.accent }} transition={{ duration: 1 }}>
                  <Tag className="w-5 h-5" />
                </motion.span>
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map(tech => (
                  <motion.span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium border"
                    animate={{
                      backgroundColor: `${palette.accent}10`,
                      borderColor: `${palette.accent}25`,
                      color: palette.accent,
                    }}
                    transition={{ duration: 1 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Contact */}
            <div className="glass-card p-6 rounded-2xl"
              style={{ background: `linear-gradient(135deg, ${palette.accent}08, transparent)` }}
            >
              <h3 className="text-lg font-bold mb-2">Besoin d'un développeur ?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Je suis ouvert à de nouvelles expériences et opportunités.
              </p>
              <motion.a
                href="mailto:ranjaandriamiadana667@gmail.com"
                className="block w-full py-3 text-center rounded-xl font-semibold transition-all"
                animate={{ backgroundColor: palette.accent }}
                transition={{ duration: 1 }}
                style={{ color: "#000" }}
              >
                Me contacter
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}