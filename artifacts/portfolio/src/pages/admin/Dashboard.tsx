import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { useProjectsList, useAdminCreateProject, useAdminDeleteProject } from "@/hooks/use-portfolio-api";
import { useCheckNeedsSetup, type CreateProjectRequest } from "@workspace/api-client-react";
import { LogOut, Plus, Trash2, Edit, LayoutDashboard, Loader2, FolderGit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Reusable Admin Dialog
function ProjectModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isPending 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSubmit: (data: CreateProjectRequest) => void,
  isPending: boolean
}) {
  const [formData, setFormData] = useState<CreateProjectRequest>({
    title: "",
    description: "",
    category: "Web App",
    year: new Date().getFullYear(),
    technologies: [],
    featured: false,
    color: "#06b6d4",
  });
  
  const [techInput, setTechInput] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-2xl rounded-2xl border border-white/10 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6">Ajouter un Projet</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm text-muted-foreground">Titre</label>
              <input 
                required
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary outline-none" 
              />
            </div>
            
            <div className="col-span-2">
              <label className="text-sm text-muted-foreground">Description Courte</label>
              <textarea 
                required
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary outline-none h-20" 
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Catégorie</label>
              <input 
                required
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary outline-none" 
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Année</label>
              <input 
                type="number" required
                value={formData.year} 
                onChange={e => setFormData({...formData, year: parseInt(e.target.value) || 2025})}
                className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary outline-none" 
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm text-muted-foreground">Technologies (Entrée pour ajouter)</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {formData.technologies.map(t => (
                  <span key={t} className="bg-white/10 px-2 py-1 rounded text-xs flex items-center gap-1">
                    {t} <button type="button" onClick={() => setFormData({...formData, technologies: formData.technologies.filter(x => x !== t)})}>&times;</button>
                  </span>
                ))}
              </div>
              <input 
                value={techInput} 
                onChange={e => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === 'Enter' && techInput.trim()) {
                    e.preventDefault();
                    if(!formData.technologies.includes(techInput.trim())) {
                      setFormData({...formData, technologies: [...formData.technologies, techInput.trim()]});
                    }
                    setTechInput("");
                  }
                }}
                placeholder="Ex: React..."
                className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary outline-none" 
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">URL Démo (optionnel)</label>
              <input 
                value={formData.demoUrl || ""} 
                onChange={e => setFormData({...formData, demoUrl: e.target.value})}
                className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary outline-none" 
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Couleur Accent</label>
              <div className="flex gap-2 items-center mt-1">
                <input 
                  type="color" 
                  value={formData.color || "#06b6d4"} 
                  onChange={e => setFormData({...formData, color: e.target.value})}
                  className="h-10 w-10 rounded border-0 bg-transparent cursor-pointer" 
                />
                <span className="text-sm uppercase">{formData.color}</span>
              </div>
            </div>
            
            <div className="col-span-2 flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="featured"
                checked={formData.featured}
                onChange={e => setFormData({...formData, featured: e.target.checked})}
                className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary bg-background"
              />
              <label htmlFor="featured" className="text-white font-medium">Mettre en avant sur l'accueil</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-secondary text-white hover:bg-secondary/80">Annuler</button>
            <button type="submit" disabled={isPending || formData.technologies.length === 0} className="px-4 py-2 rounded-lg bg-primary text-black font-bold hover:bg-primary/80 flex items-center gap-2">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />} Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, logout, isReady } = useAuth();
  const { data: needsSetupStatus } = useCheckNeedsSetup();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Data hooks
  const { data: projects, refetch } = useProjectsList();
  const createProject = useAdminCreateProject();
  const deleteProject = useAdminDeleteProject();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      setLocation("/login");
    }
    if (needsSetupStatus?.needsSetup) {
      setLocation("/setup");
    }
  }, [isAuthenticated, isReady, needsSetupStatus, setLocation]);

  if (!isAuthenticated) return null;

  const handleCreate = async (data: CreateProjectRequest) => {
    try {
      await createProject.mutateAsync({ data });
      toast({ title: "Projet créé avec succès" });
      setIsModalOpen(false);
      refetch();
    } catch (e) {
      toast({ title: "Erreur lors de la création", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm("Supprimer ce projet définitivement ?")) {
      try {
        await deleteProject.mutateAsync({ id });
        toast({ title: "Projet supprimé" });
        refetch();
      } catch (e) {
        toast({ title: "Erreur de suppression", variant: "destructive" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" /> Admin Panel
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium flex items-center gap-3">
            <FolderGit2 className="w-5 h-5" /> Projets
          </button>
          {/* Future tabs: Skills, Profile */}
        </nav>
        <div className="p-4 border-t border-border">
          <button 
            onClick={() => { logout(); setLocation("/"); }}
            className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 font-medium flex items-center gap-3 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 pt-24 md:pt-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold">Gestion des Projets</h1>
              <p className="text-muted-foreground mt-1">Gérez votre portfolio dynamique.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Nouveau Projet
            </button>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-black/20">
                    <th className="p-4 font-medium text-muted-foreground">ID</th>
                    <th className="p-4 font-medium text-muted-foreground">Titre</th>
                    <th className="p-4 font-medium text-muted-foreground">Catégorie</th>
                    <th className="p-4 font-medium text-muted-foreground">Année</th>
                    <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects?.map(project => (
                    <tr key={project.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-muted-foreground">#{project.id}</td>
                      <td className="p-4 font-medium flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color || '#fff' }} />
                        {project.title}
                        {project.featured && <span className="px-2 py-0.5 text-[10px] rounded bg-primary/20 text-primary uppercase">Mise en avant</span>}
                      </td>
                      <td className="p-4 text-muted-foreground">{project.category}</td>
                      <td className="p-4 text-muted-foreground">{project.year}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors" title="Modifier (Bientôt dispo)">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(project.id)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {projects?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">Aucun projet trouvé. Les données affichées côté public sont des mocks temporaires.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreate}
        isPending={createProject.isPending}
      />
    </div>
  );
}
