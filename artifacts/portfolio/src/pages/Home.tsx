import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Code2, Database } from "lucide-react";
import { useProjectsList } from "@/hooks/use-portfolio-api";
import { ProjectCard } from "@/components/ui/ProjectCard";

export default function Home() {
  const { data: projects, isLoading } = useProjectsList();
  const featuredProjects = projects?.filter(p => p.featured).slice(0, 4) || projects?.slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-accent/20 rounded-full blur-[150px] mix-blend-screen" style={{ animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&q=80')] opacity-5 bg-cover bg-center mix-blend-overlay" />
          {/* Using requested generated image if available */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-screen" 
            style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/hero-abstract.png)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="text-sm font-medium tracking-wide">Disponible pour de nouvelles opportunités</span>
            </motion.div>

            <motion.h1 
              className="text-5xl sm:text-7xl md:text-8xl font-display font-bold leading-[1.1] tracking-tighter mb-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Bonjour, je suis <br />
              <span className="gradient-text">Ranja Andriamiadana.</span>
            </motion.h1>

            <motion.p 
              className="text-xl sm:text-2xl text-muted-foreground md:max-w-2xl leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Développeur Junior en <span className="text-white font-medium">Génie Logiciel</span>. 
              Je conçois et développe des expériences web et logicielles modernes, performantes et esthétiques.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link 
                href="/projects" 
                className="px-8 py-4 rounded-xl font-semibold bg-white text-black hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group"
              >
                Voir mes travaux
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/about" 
                className="px-8 py-4 rounded-xl font-semibold glass-panel hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                À propos de moi
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-24 relative bg-background border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="glass-card p-8 rounded-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Terminal className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-2xl font-display font-bold mb-4">Frontend</h3>
              <p className="text-muted-foreground leading-relaxed">
                Création d'interfaces immersives avec ReactJS, Tailwind CSS, et des animations fluides pour une expérience utilisateur exceptionnelle.
              </p>
            </motion.div>
            
            <motion.div 
              className="glass-card p-8 rounded-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Database className="w-10 h-10 text-accent mb-6" />
              <h3 className="text-2xl font-display font-bold mb-4">Backend & DB</h3>
              <p className="text-muted-foreground leading-relaxed">
                Conception d'APIs robustes avec Express.js, PHP, et modélisation de bases de données relationnelles (PostgreSQL, MySQL).
              </p>
            </motion.div>

            <motion.div 
              className="glass-card p-8 rounded-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Code2 className="w-10 h-10 text-emerald-400 mb-6" />
              <h3 className="text-2xl font-display font-bold mb-4">Logiciel Desktop</h3>
              <p className="text-muted-foreground leading-relaxed">
                Développement d'applications natives performantes en C, C++, C# et Java pour des besoins de gestion complexes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Selected Projects */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Projets <span className="text-primary">Sélectionnés</span></h2>
              <p className="text-muted-foreground max-w-2xl text-lg">Quelques-unes de mes réalisations récentes, des hackathons aux applications de gestion.</p>
            </div>
            <Link href="/projects" className="hidden md:flex items-center gap-2 text-white hover:text-primary transition-colors font-medium">
              Voir tout <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1,2,3,4].map(i => <div key={i} className="h-80 rounded-2xl glass-card animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProjects?.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link href="/projects" className="inline-flex items-center gap-2 text-white bg-white/5 px-6 py-3 rounded-full border border-white/10">
              Voir tous les projets <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
