import React from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useGetProject } from "@workspace/api-client-react";
import { useProjectsList } from "@/hooks/use-portfolio-api";
import { ArrowLeft, Github, ExternalLink, Calendar, Tag } from "lucide-react";

export default function ProjectDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  // Try to get from API, fallback to mock list if missing/error (to support mock mode)
  const { data: apiProject, isError } = useGetProject(id);
  const { data: allProjects } = useProjectsList();
  
  const project = isError ? allProjects?.find(p => p.id === id) : (apiProject || allProjects?.find(p => p.id === id));

  if (!project) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Projet introuvable</h2>
          <Link href="/projects" className="text-primary hover:underline">Retour aux projets</Link>
        </div>
      </div>
    );
  }

  const accentColor = project.color || "#06b6d4";

  return (
    <div className="min-h-screen pt-24 pb-24 relative">
      {/* Dynamic Background Glow based on project color */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[50vh] blur-[150px] opacity-20 pointer-events-none z-0"
        style={{ background: `radial-gradient(ellipse at top, ${accentColor}, transparent 70%)` }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <Link href="/projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Retour aux projets
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
              {project.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-muted-foreground border border-white/10 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {project.year}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
            {project.title}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12">
            {project.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-16 pb-16 border-b border-white/10">
            {project.demoUrl && (
              <a 
                href={project.demoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-6 py-3 rounded-xl font-medium bg-white text-black hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-5 h-5" /> Voir le projet en direct
              </a>
            )}
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-6 py-3 rounded-xl font-medium glass-panel hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Github className="w-5 h-5" /> Code Source
              </a>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div 
            className="md:col-span-2 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-display font-bold">À propos du projet</h2>
            <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
              <p>{project.longDescription || project.description}</p>
              {/* Fallback specific descriptions based on mock data to make it look rich */}
              {!project.longDescription && project.id === 991 && (
                <>
                  <p>Ce projet a remporté la première place lors du prestigieux hackathon Devhunt 5.0. Le défi consistait à créer une solution technologique innovante pour l'éducation.</p>
                  <p>Nous avons conçu une application web interactive qui utilise des mini-jeux et des métaphores visuelles pour expliquer les concepts complexes de l'informatique aux enfants de 8 à 12 ans.</p>
                </>
              )}
            </div>

            {/* Media Gallery (if API provides it) */}
            {project.media && project.media.length > 0 && (
              <div className="mt-12 space-y-6">
                <h2 className="text-2xl font-display font-bold">Galerie</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.media.map(media => (
                    <div key={media.id} className="rounded-xl overflow-hidden glass-card aspect-video relative group">
                      {media.type === 'image' && (
                        <img src={media.url} alt={media.caption || "Project screenshot"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                      {media.caption && (
                        <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-sm font-medium">{media.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" /> Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map(tech => (
                  <span key={tech} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent">
              <h3 className="text-lg font-bold mb-2">Besoin d'un développeur ?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Je suis disponible pour des projets similaires ou pour rejoindre votre équipe.
              </p>
              <a href="mailto:ranjaandriamiadana667@gmail.com" className="block w-full py-3 text-center rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
                Me contacter
              </a>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
