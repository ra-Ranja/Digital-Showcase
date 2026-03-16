import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowUpRight, FolderGit2 } from "lucide-react";
import { type Project } from "@workspace/api-client-react";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const accentColor = project.color || "#06b6d4";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link 
        href={`/projects/${project.id}`}
        className="group block relative rounded-2xl overflow-hidden glass-card h-full flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
        style={{ 
          boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 10px 40px -10px ${accentColor}15` 
        }}
      >
        {/* Glow effect on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${accentColor}20 0%, transparent 70%)` }}
        />

        <div className="p-6 md:p-8 flex-1 flex flex-col z-10">
          <div className="flex justify-between items-start mb-6">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center bg-background border border-white/10"
              style={{ color: accentColor }}
            >
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-hover:bg-white/10">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
          </div>

          <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
            {project.title}
          </h3>
          
          <p className="text-muted-foreground mb-6 flex-1 line-clamp-3 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-auto">
            {project.technologies?.slice(0, 4).map((tech) => (
              <span 
                key={tech} 
                className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80"
              >
                {tech}
              </span>
            ))}
            {project.technologies && project.technologies.length > 4 && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
