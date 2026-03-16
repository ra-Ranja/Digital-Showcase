import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TerminalSquare, Loader2, Lock } from "lucide-react";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Nom d'utilisateur requis"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { login: setAuthContext } = useAuth();
  const { toast } = useToast();
  
  const loginMutation = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await loginMutation.mutateAsync({ data });
      setAuthContext(result.token, result.user);
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${result.user.username}`,
      });
      setLocation("/admin");
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: "Identifiants invalides",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Cinematic Lighting Effect */}
      <div className="absolute top-0 w-full h-full flex justify-center pointer-events-none">
        <div className="absolute top-[-20%] w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute w-[2px] h-[100vh] bg-gradient-to-b from-primary/50 to-transparent shadow-[0_0_20px_2px_rgba(6,182,212,0.5)]" />
      </div>

      <motion.div 
        className="w-full max-w-md z-10 px-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-card p-10 rounded-3xl border-t border-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold text-center">Accès Restreint</h1>
            <p className="text-muted-foreground text-center mt-2">Administration du portfolio</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Utilisateur</label>
              <input 
                {...register("username")}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Admin"
              />
              {errors.username && <span className="text-xs text-red-500 mt-1 block">{errors.username.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Mot de passe</label>
              <input 
                type="password"
                {...register("password")}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
              {errors.password && <span className="text-xs text-red-500 mt-1 block">{errors.password.message}</span>}
            </div>

            <button 
              type="submit" 
              disabled={loginMutation.isPending}
              className="w-full bg-white text-black font-bold rounded-xl px-4 py-3 mt-4 hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loginMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authentification"}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <TerminalSquare className="w-4 h-4" /> v1.0.0 Secure System
          </div>
        </div>
      </motion.div>
    </div>
  );
}
