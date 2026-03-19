import { useAuth } from "@/lib/auth-context";
import {
  useGetProjects,
  useGetSkills,
  useGetProfile,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@workspace/api-client-react";
import { useMemo } from "react";

export function useAuthHeaders() {
  const { token } = useAuth();
  return useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);
}

export function useProjectsList() {
  return useGetProjects({});
}

export function usePortfolioSkills() {
  return useGetSkills({});
}

export function usePortfolioProfile() {
  return useGetProfile({});
}

export function useAdminCreateProject() {
  const headers = useAuthHeaders();
  return useCreateProject({ request: { headers: headers.Authorization ? headers : undefined } });
}

export function useAdminUpdateProject() {
  const headers = useAuthHeaders();
  return useUpdateProject({ request: { headers: headers.Authorization ? headers : undefined } });
}

export function useAdminDeleteProject() {
  const headers = useAuthHeaders();
  return useDeleteProject({ request: { headers: headers.Authorization ? headers : undefined } });
}