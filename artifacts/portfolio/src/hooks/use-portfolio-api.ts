import { useAuth } from "@/lib/auth-context";
import { 
  useGetProjects, 
  useGetSkills, 
  useGetProfile,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  type Project 
} from "@workspace/api-client-react";
import { useMemo } from "react";

// Mock data as fallback for when the API is empty (as requested)
const MOCK_PROJECTS: Project[] = [
  {
    id: 991,
    title: "Devhunt 5.0 - 1ère Place",
    description: "Application web pour initier les jeunes enfants à la technologie.",
    longDescription: "Projet gagnant du hackathon Devhunt 5.0. Une plateforme interactive et gamifiée conçue spécifiquement pour l'introduction des concepts technologiques aux enfants.",
    category: "Web App / Hackathon",
    year: 2025,
    technologies: ["React", "Node.js", "Tailwind CSS"],
    featured: true,
    color: "#06b6d4"
  },
  {
    id: 992,
    title: "Devhunt 4.0 - Assistant Handicapé",
    description: "Application web d'assistance pour les personnes en situation de handicap.",
    category: "Web App",
    year: 2025,
    technologies: ["JavaScript", "HTML", "CSS", "Accessibility APIs"],
    featured: true,
    color: "#a855f7"
  },
  {
    id: 993,
    title: "Gestionnaire de Bibliothèque",
    description: "Application Desktop développée en C# pour la gestion complète d'une bibliothèque.",
    category: "Desktop App",
    year: 2025,
    technologies: ["C#", ".NET", "SQL Server"],
    featured: false,
    color: "#3b82f6"
  },
  {
    id: 994,
    title: "Gestion d'Enseignants",
    description: "Plateforme web de gestion des ressources humaines académiques.",
    category: "Web App",
    year: 2025,
    technologies: ["ReactJS", "Express", "PostgreSQL"],
    featured: false,
    color: "#10b981"
  }
];

// Helper to inject auth headers
export function useAuthHeaders() {
  const { token } = useAuth();
  return useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);
}

// Wrapped hooks to automatically apply auth headers and inject mock data if needed
export function useProjectsList() {
  const query = useGetProjects({});
  
  // Inject mock data if API returns empty array successfully
  const data = query.data?.length === 0 ? MOCK_PROJECTS : query.data;
  
  return { ...query, data };
}

export function usePortfolioSkills() {
  const query = useGetSkills({});
  return query;
}

export function usePortfolioProfile() {
  const query = useGetProfile({});
  return query;
}

export function useAdminCreateProject() {
  const headers = useAuthHeaders();
  return useCreateProject({ request: { headers } });
}

export function useAdminUpdateProject() {
  const headers = useAuthHeaders();
  return useUpdateProject({ request: { headers } });
}

export function useAdminDeleteProject() {
  const headers = useAuthHeaders();
  return useDeleteProject({ request: { headers } });
}
