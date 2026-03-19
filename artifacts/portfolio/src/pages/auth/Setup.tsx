import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShieldAlert, Loader2 } from "lucide-react";
import { useSetupAdmin, useCheckNeedsSetup } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const setupSchema = z.object({
  username: z.string().min(3, "Min 3 caractères"),
  password: z.string().min(6, "Min 6 caractères"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
});
type SetupFormValues = z.infer<typeof setupSchema>;

export default function Setup() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const { data: status, isLoading } = useCheckNeedsSetup();
  const setupMutation = useSetupAdmin();

  useEffect(() => {
    // ✅ Redirige SEULEMENT quand la réponse est arrivée ET qu'un admin existe déjà
    if (!isLoading && status && !status.needsSetup) {
      setLocation("/login");
    }
  }, [isLoading, status, setLocation]);

  const { register, handleSubmit, formState: { errors } } = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
  });

  const onSubmit = async (data: SetupFormValues) => {
    try {
      const result = await setupMutation.mutateAsync({ data });
      login(result.token, result.user);
      toast({ title: "Admin créé avec succès ✅" });
      setLocation("/admin");
    } catch {
      toast({ title: "Erreur lors de la création", variant: "destructive" });
    }
  };

  // Chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Admin déjà existant → redirect géré par useEffect
  if (!isLoading && status && !status.needsSetup) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        className="w-full max-w-md glass-card p-10 rounded-3xl border border-accent/30 shadow-[0_0_40px_rgba(168,85,247,0.15)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <ShieldAlert className="w-12 h-12 text-accent mb-4" />
          <h1 className="text-2xl font-display font-bold">Initialisation Système</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Aucun administrateur détecté. Créez le compte maître.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Nom d'utilisateur
            </label>
            <input
              {...register("username")}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
            />
            {errors.username && (
              <span className="text-xs text-red-500 mt-1 block">{errors.username.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Email (optionnel)
            </label>
            <input
              {...register("email")}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
            />
            {errors.email && (
              <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
            />
            {errors.password && (
              <span className="text-xs text-red-500 mt-1 block">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={setupMutation.isPending}
            className="w-full bg-accent text-white font-bold rounded-xl px-4 py-3 mt-6 hover:bg-accent/80 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {setupMutation.isPending
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : "Créer l'administrateur"
            }
          </button>
        </form>
      </motion.div>
    </div>
  );
}