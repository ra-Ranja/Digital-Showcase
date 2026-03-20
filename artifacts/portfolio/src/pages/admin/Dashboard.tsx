import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import {
  useProjectsList,
  useAdminCreateProject,
  useAdminDeleteProject,
  useAuthHeaders,
  useAdminUpdateProject,
} from "@/hooks/use-portfolio-api";
import { useCheckNeedsSetup } from "@workspace/api-client-react";
import {
  LogOut, Plus, Trash2, Edit, LayoutDashboard,
  Loader2, FolderGit2, FileText, Upload, X,
  Image as ImageIcon, Video, ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ── Types ────────────────────────────────────────────────
interface ProjectForm {
  title: string;
  description: string;
  longDescription: string;
  category: string;
  projectType: string;
  year: number;
  projectDate: string;
  technologies: string[];
  featured: boolean;
  color: string;
  demoUrl: string;
  githubUrl: string;
  videoUrl: string;
  coverImageBase64: string;
  coverImagePreview: string;
  coverImageFile?: File | null; // Added this property
}

const CATEGORIES = ["Application Web", "Application Mobile", "Logiciel Desktop", "API / Backend", "Autre"];
const PROJECT_TYPES = ["Personnel", "Académique", "Hackathon", "Professionnel"];

// ── Modal Projet ─────────────────────────────────────────
function ProjectModal({
  isOpen, onClose, onSubmit, isPending, initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: ProjectForm) => void;
  isPending: boolean;
  initialData?: any;
}) {
  const parseCategory = (cat: string) => {
    const parts = cat?.split(" / ") ?? [];
    return {
      category: parts[0] ?? "Application Web",
      projectType: parts[1] ?? "Personnel",
    };
  };

  const [form, setForm] = useState<ProjectForm>(() => {
    if (initialData) {
      const { category, projectType } = parseCategory(initialData.category);
      return {
        title: initialData.title ?? "",
        description: initialData.description ?? "",
        longDescription: initialData.longDescription ?? "",
        category,
        projectType,
        year: initialData.year ?? new Date().getFullYear(),
        projectDate: initialData.projectDate ?? "",
        technologies: initialData.technologies ?? [],
        featured: initialData.featured ?? false,
        color: initialData.color ?? "#10b981",
        demoUrl: initialData.demoUrl ?? "",
        githubUrl: initialData.githubUrl ?? "",
        videoUrl: "",
        coverImageBase64: initialData.coverImageBase64 ?? "",
        coverImagePreview: initialData.coverImageBase64 ?? "",
      };
    }
    return {
      title: "", description: "", longDescription: "",
      category: "Application Web", projectType: "Personnel",
      year: new Date().getFullYear(), projectDate: "",
      technologies: [], featured: false, color: "#10b981",
      demoUrl: "", githubUrl: "", videoUrl: "",
      coverImageBase64: "", coverImagePreview: "",
    };
  });

  // Reset quand initialData change
  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      const { category, projectType } = parseCategory(initialData.category);
      setForm({
        title: initialData.title ?? "",
        description: initialData.description ?? "",
        longDescription: initialData.longDescription ?? "",
        category,
        projectType,
        year: initialData.year ?? new Date().getFullYear(),
        projectDate: initialData.projectDate ?? "",
        technologies: initialData.technologies ?? [],
        featured: initialData.featured ?? false,
        color: initialData.color ?? "#10b981",
        demoUrl: initialData.demoUrl ?? "",
        githubUrl: initialData.githubUrl ?? "",
        videoUrl: "",
        coverImageBase64: initialData.coverImageBase64 ?? "",
        coverImagePreview: initialData.coverImageBase64 ?? "",
      });
    } else {
      setForm({
        title: "", description: "", longDescription: "",
        category: "Application Web", projectType: "Personnel",
        year: new Date().getFullYear(), projectDate: "",
        technologies: [], featured: false, color: "#10b981",
        demoUrl: "", githubUrl: "", videoUrl: "",
        coverImageBase64: "", coverImagePreview: "",
      });
    }
  }, [isOpen, initialData]);


  const [techInput, setTechInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof ProjectForm, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      set("coverImageBase64", base64);
      set("coverImagePreview", base64);
    };
    reader.readAsDataURL(file);
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) {
      set("technologies", [...form.technologies, t]);
    }
    setTechInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border">
          {/* Titre modal dynamique */}
          <h2 className="text-xl font-bold">
            {initialData ? "Modifier le Projet" : "Nouveau Projet"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={e => { e.preventDefault(); onSubmit(form); }}
          className="p-6 space-y-5"
        >
          {/* Image de couverture */}
          <div>
            <label className="text-sm text-muted-foreground block mb-2">Image de couverture</label>
            {form.coverImagePreview ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden group">
                <img src={form.coverImagePreview} className="w-full h-full object-cover" alt="preview" />
                <button
                  type="button"
                  onClick={() => { set("coverImageFile", null); set("coverImagePreview", ""); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-36 rounded-xl border-2 border-dashed border-white/15 hover:border-white/30 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white/60 transition-all"
              >
                <ImageIcon className="w-8 h-8" />
                <span className="text-sm">Cliquez pour importer une image</span>
                <span className="text-xs">PNG, JPG, WEBP — max 5 Mo</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>

          {/* Titre */}
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Titre *</label>
            <input
              required value={form.title}
              onChange={e => set("title", e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary outline-none"
            />
          </div>

          {/* Catégorie + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Catégorie *</label>
              <select
                value={form.category}
                onChange={e => set("category", e.target.value)}
                className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary outline-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Type *</label>
              <select
                value={form.projectType}
                onChange={e => set("projectType", e.target.value)}
                className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary outline-none"
              >
                {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Année + Couleur */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Année *</label>
              <input
                type="number" required value={form.year}
                onChange={e => set("year", parseInt(e.target.value) || 2025)}
                className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Couleur accent</label>
              <div className="flex gap-2 items-center mt-1">
                <input
                  type="color" value={form.color}
                  onChange={e => set("color", e.target.value)}
                  className="h-10 w-10 rounded border-0 bg-transparent cursor-pointer"
                />
                <span className="text-sm text-white/50 uppercase font-mono">{form.color}</span>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <label className="text-sm text-muted-foreground block mb-1">
              Date du projet
            </label>
            <input
              type="date"
              value={form.projectDate}
              onChange={e => set("projectDate", e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary outline-none"
            />
          </div>

          {/* Description courte */}
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Description courte *</label>
            <textarea
              required value={form.description}
              onChange={e => set("description", e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary outline-none h-20 resize-none"
            />
          </div>

          {/* Description longue */}
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Description détaillée</label>
            <textarea
              value={form.longDescription}
              onChange={e => set("longDescription", e.target.value)}
              placeholder="Contexte, objectifs, fonctionnalités, défis relevés..."
              className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary outline-none h-32 resize-none"
            />
          </div>

          {/* Technologies */}
          <div>
            <label className="text-sm text-muted-foreground block mb-2">Technologies *</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.technologies.map(t => (
                <span key={t} className="bg-white/10 px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5">
                  {t}
                  <button
                    type="button"
                    onClick={() => set("technologies", form.technologies.filter(x => x !== t))}
                    className="text-white/50 hover:text-white"
                  >×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }}
                placeholder="Ex: React, TypeScript..."
                className="flex-1 bg-background border border-border rounded-lg p-3 text-white focus:border-primary outline-none"
              />
              <button
                type="button" onClick={addTech}
                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Liens */}
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                <ExternalLink className="w-3.5 h-3.5" /> Lien démo (optionnel)
              </label>
              <input
                value={form.demoUrl}
                onChange={e => set("demoUrl", e.target.value)}
                placeholder="https://..."
                className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                GitHub (optionnel)
              </label>
              <input
                value={form.githubUrl}
                onChange={e => set("githubUrl", e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending || form.technologies.length === 0}
              className="px-5 py-2 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Onglet CV ─────────────────────────────────────────────
function CVManager({ token }: { token: string | null }) {
  const [cvInfo, setCvInfo] = useState<{ filename: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Vérifie si un CV existe
  useEffect(() => {
    fetch("/api/profile/cv-info", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => { setCvInfo(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("cv", file);
    try {
      const r = await fetch("/api/profile/cv", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (r.ok) {
        const d = await r.json();
        setCvInfo({ filename: d.filename });
        toast({ title: "CV uploadé avec succès ✅" });
      } else {
        toast({ title: "Erreur upload", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erreur réseau", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer le CV ?")) return;
    try {
      const r = await fetch("/api/profile/cv", {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (r.ok) {
        setCvInfo(null);
        toast({ title: "CV supprimé" });
      }
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Gestion du CV</h1>
        <p className="text-muted-foreground mt-1">Le CV uploadé sera téléchargeable publiquement.</p>
      </div>

      <div className="glass-card rounded-2xl p-8 max-w-lg">
        {loading ? (
          <div className="flex items-center gap-3 text-white/40">
            <Loader2 className="w-5 h-5 animate-spin" /> Chargement...
          </div>
        ) : cvInfo ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{cvInfo.filename}</p>
                <p className="text-xs text-white/40 mt-0.5">CV actuel</p>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href="/api/profile/cv"
                download
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/15 text-primary hover:bg-primary/25 transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" /> Prévisualiser
              </a>
              <button
                onClick={() => fileRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
              >
                <Upload className="w-4 h-4" /> Remplacer
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full h-40 rounded-xl border-2 border-dashed border-white/15 hover:border-primary/50 flex flex-col items-center justify-center gap-3 text-white/40 hover:text-white/70 transition-all group"
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : (
              <>
                <Upload className="w-8 h-8 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium">Importer votre CV (PDF)</span>
                <span className="text-xs">Cliquez pour sélectionner</span>
              </>
            )}
          </button>
        )}

        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
    </div>
  );
}

// ── Dashboard principal ───────────────────────────────────
type Tab = "projects" | "cv";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, logout, isReady, token } = useAuth();
  const { data: needsSetupStatus } = useCheckNeedsSetup();
  const { toast } = useToast();
  const headers = useAuthHeaders();

  const [tab, setTab] = useState<Tab>("projects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  const { data: projects, refetch } = useProjectsList();
  const createProject = useAdminCreateProject();
  const deleteProject = useAdminDeleteProject();
  const updateProject = useAdminUpdateProject();

  useEffect(() => {
    if (isReady && !isAuthenticated) setLocation("/login");
    if (needsSetupStatus?.needsSetup) setLocation("/setup");
  }, [isAuthenticated, isReady, needsSetupStatus, setLocation]);

  if (!isAuthenticated) return null;

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };
  
  const handleCreate = async (form: ProjectForm) => {
    try {
      const payload = {
        title: form.title,
        description: form.description,
        longDescription: form.longDescription || undefined,
        category: `${form.category} / ${form.projectType}`,
        year: form.year,
        projectDate: form.projectDate || undefined,
        technologies: form.technologies,
        featured: form.featured,
        color: form.color,
        demoUrl: form.demoUrl || undefined,
        githubUrl: form.githubUrl || undefined,
        coverImageBase64: form.coverImageBase64 || undefined,
      } as any;
  
      if (editingProject) {
        // ── MODE ÉDITION ──
        await updateProject.mutateAsync({ id: editingProject.id, data: payload });
        toast({ title: "Projet mis à jour ✅" });
      } else {
        // ── MODE CRÉATION ──
        const created = await createProject.mutateAsync({ data: payload });
        const newId = (created as any)?.id;
        if (form.videoUrl && newId) {
          const isYt = form.videoUrl.includes("youtube") || form.videoUrl.includes("youtu.be");
          await fetch(`/api/projects/${newId}/media`, {
            method: "POST",
            headers: { ...(headers as any), "Content-Type": "application/json" },
            body: JSON.stringify({
              type: isYt ? "youtube" : "video",
              url: form.videoUrl,
              caption: "Démo vidéo",
              order: 0,
            }),
          });
        }
        toast({ title: "Projet créé ✅" });
      }
  
      setIsModalOpen(false);
      setEditingProject(null);
      refetch();
    } catch (e) {
      console.error(e);
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce projet ?")) return;
    try {
      await deleteProject.mutateAsync({ id });
      toast({ title: "Projet supprimé" });
      refetch();
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const safeProjects = Array.isArray(projects) ? projects : [];

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Sidebar ── */}
      <aside className="w-64 border-r border-border bg-card/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" /> Admin Panel
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {([
            { id: "projects", label: "Projets", icon: FolderGit2 },
            { id: "cv",       label: "Mon CV",  icon: FileText },
          ] as { id: Tab; label: string; icon: any }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors"
              style={{
                backgroundColor: tab === id ? "rgba(16,185,129,0.12)" : "transparent",
                color: tab === id ? "#10b981" : "rgba(255,255,255,0.5)",
              }}
            >
              <Icon className="w-5 h-5" /> {label}
            </button>
          ))}
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

      {/* ── Contenu ── */}
      <main className="flex-1 p-8 pt-24 md:pt-8 overflow-auto">
        <div className="max-w-5xl mx-auto">

          {tab === "cv" && <CVManager token={token} />}

          {tab === "projects" && (
            <>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-display font-bold">Gestion des Projets</h1>
                  <p className="text-muted-foreground mt-1">{safeProjects.length} projet(s) en base.</p>
                </div>
                <button
                  onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
                  className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" /> Nouveau Projet
                </button>
              </div>

              {/* Grille de cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {safeProjects.map(project => {
                    const img = (project as any).coverImageBase64 || project.coverImage;
                    return (
                      <div
                        key={project.id}
                        className="relative rounded-2xl overflow-hidden group border border-white/8"
                        style={{ minHeight: "200px" }}
                      >
                        {/* Background image */}
                        {img ? (
                          <img
                            src={img}
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="absolute inset-0"
                            style={{ background: `linear-gradient(135deg, ${project.color}22, ${project.color}08)` }}
                          />
                        )}

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

                        {/* Actions top-right */}
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={() => handleEdit(project)}
                            className="p-2 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-sm transition-colors"
                            title="Modifier (bientôt)"
                          >
                            <Edit className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-2 rounded-lg bg-red-500/70 hover:bg-red-500/90 backdrop-blur-sm transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>

                        {/* Featured badge */}
                        {project.featured && (
                          <div
                            className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase z-10"
                            style={{ backgroundColor: `${project.color}cc`, color: "#000" }}
                          >
                            Featured
                          </div>
                        )}

                        {/* Infos bas */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: project.color || "#fff" }}
                            />
                            <span className="text-xs text-white/50 font-medium">
                              {project.category}
                            </span>
                          </div>
                          <h3 className="font-bold text-white text-base leading-tight mb-1">
                            {project.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/40">
                              {(project as any).projectDate
                                ? new Date((project as any).projectDate).toLocaleDateString("fr-FR", {
                                    month: "long", year: "numeric",
                                  })
                                : project.year}
                            </span>
                            <div className="flex gap-1 flex-wrap justify-end">
                              {project.technologies?.slice(0, 2).map((t: string) => (
                                <span
                                  key={t}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60"
                                >
                                  {t}
                                </span>
                              ))}
                              {(project.technologies?.length ?? 0) > 2 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/40">
                                  +{project.technologies.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Card ajout */}
                  <button
                    onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
                    className="rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/40 flex flex-col items-center justify-center gap-3 text-white/30 hover:text-primary transition-all min-h-50"
                  >
                    <Plus className="w-8 h-8" />
                    <span className="text-sm font-medium">Nouveau projet</span>
                  </button>
                </div>
            </>
          )}
        </div>
      </main>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProject(null); }}
        onSubmit={handleCreate}
        isPending={createProject.isPending || updateProject.isPending}
        initialData={editingProject}
      />
    </div>
  );
}