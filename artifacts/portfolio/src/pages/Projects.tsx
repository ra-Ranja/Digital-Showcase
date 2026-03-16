import React, { useState } from "react";
import { motion } from "framer-motion";
import { useProjectsList } from "@/hooks/use-portfolio-api";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Search } from "lucide-react";

export default function Projects() {
  const { data: projects, isLoading } = useProjectsList();
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(projects?.map(p => p.category.split(' / ')[0]) || []))];

  const filteredProjects = projects?.filter(p => 
    filter === "All" ? true : p.category.includes(filter)
  );

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          className="max-w-3xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Mon <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Découvrez l'ensemble de mes réalisations. Des applications web modernes aux logiciels desktop, 
            chaque projet reflète ma passion pour le code propre et les interfaces intuitives.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="flex flex-wrap gap-3 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === cat 
                  ? "bg-white text-black" 
                  : "glass-panel text-muted-foreground hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 rounded-2xl glass-card animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects?.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
            
            {filteredProjects?.length === 0 && (
              <div className="col-span-full py-24 text-center glass-card rounded-3xl">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-display font-bold mb-2">Aucun projet trouvé</h3>
                <p className="text-muted-foreground">Essayez une autre catégorie.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
