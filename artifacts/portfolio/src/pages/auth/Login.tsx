import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Nom d'utilisateur requis"),
  password: z.string().min(1, "Mot de passe requis"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

function Lamp({ isOn, onPull }: { isOn: boolean; onPull: () => void }) {
  const cordAnim = useAnimation();
  const [pulling, setPulling] = useState(false);

  const handlePull = async () => {
    if (pulling) return;
    setPulling(true);
    await cordAnim.start({
      y: [0, 20, -8, 12, 0],
      transition: { duration: 0.5, ease: "easeInOut" },
    });
    onPull();
    setPulling(false);
  };

  const shade = isOn ? "#f5e6c8" : "#4b5563";
  const shadeDark = isOn ? "#e8d4a8" : "#374151";
  const stem = isOn ? "#c9b99a" : "#6b7280";
  const base = isOn ? "#b5a48a" : "#4b5563";

  return (
    <div className="relative flex flex-col items-center select-none">
      <svg width="200" height="380" viewBox="0 0 200 380" fill="none">
        <defs>
          <radialGradient id="lightPool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lightCone" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="bulbColor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff9e6" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id="shadeInner" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor={isOn ? "#fffbf0" : "#6b7280"} stopOpacity="0.6" />
            <stop offset="100%" stopColor={shade} stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Cône de lumière ── */}
        <AnimatePresence>
          {isOn && (
            <motion.polygon
              points="60,130 140,130 175,310 25,310"
              fill="url(#lightCone)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* ── Lumière au sol ── */}
        <AnimatePresence>
          {isOn && (
            <motion.ellipse
              cx="100" cy="345" rx="70" ry="18"
              fill="url(#lightPool)"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.7, scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>

        {/* ── Base ── */}
        <ellipse cx="100" cy="338" rx="38" ry="9" fill={base} />
        <rect x="72" y="310" width="56" height="30" rx="8" fill={base} />
        {/* Détail base */}
        <ellipse cx="100" cy="310" rx="28" ry="6" fill={shadeDark} />

        {/* ── Tige ── */}
        <rect x="96" y="120" width="8" height="195" rx="4" fill={stem} />
        {/* Articulation tige */}
        <circle cx="100" cy="200" r="7" fill={shadeDark} />
        <circle cx="100" cy="200" r="4" fill={stem} />

        {/* ── Corps abat-jour (veilleuse arrondie) ── */}
        <motion.g
          animate={{ filter: isOn ? "drop-shadow(0 0 24px #fde68a)" : "none" }}
          transition={{ duration: 0.5 }}
        >
          {/* Abat-jour principal — forme veilleuse ronde évasée */}
          <path
            d="M60 120 
              Q60 70 100 70 
              Q140 70 140 120 
              Q140 145 100 150 
              Q60 145 60 120 Z"
            fill={shade}
          />

          {/* Texture/relief abat-jour */}
          <path
            d="M58 118 Q52 70 100 55 Q148 70 142 118 Q130 138 100 142 Q70 138 58 118 Z"
            fill="url(#shadeInner)"
          />
          {/* Bord bas abat-jour */}
          <ellipse cx="100" cy="140" rx="42" ry="9"
            fill={shadeDark} />
          {/* Bord haut abat-jour */}
          <ellipse cx="100" cy="57" rx="16" ry="5"
            fill={shadeDark} />
          {/* Anneau haut */}
          <rect x="95" y="30" width="10" height="30" rx="5" fill={stem} />
          <ellipse cx="100" cy="30" rx="10" ry="5" fill={shadeDark} />

          {/* ── Ampoule visible sous l'abat-jour ── */}
          <motion.ellipse
            cx="100" cy="138" rx="10" ry="8"
            fill={isOn ? "url(#bulbColor)" : "#1f2937"}
            filter={isOn ? "url(#glow)" : "none"}
            animate={isOn ? { opacity: [1, 0.88, 1] } : { opacity: 1 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>

        

        {/* ── Fil et anneau de tirage ── */}
        <motion.g animate={cordAnim}>
          <motion.path
            d="M100 142 Q94 168 100 188 Q106 208 100 228"
            stroke={isOn ? "#c9b99a" : "#6b7280"}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Anneau */}
          <motion.circle
            cx="100" cy="233" r="7"
            fill="none"
            stroke={isOn ? "#c9b99a" : "#6b7280"}
            strokeWidth="2.5"
            style={{ cursor: "pointer" }}
            whileHover={{ scale: 1.4 }}
            whileTap={{ scale: 0.85 }}
            onClick={handlePull}
          />
          {/* Petit tiret vertical dans l'anneau */}
          <motion.line
            x1="100" y1="228" x2="100" y2="238"
            stroke={isOn ? "#c9b99a" : "#6b7280"}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>
      </svg>

      <motion.p
        className="text-xs mt-0 cursor-pointer font-medium"
        style={{ color: isOn ? "#a8956a" : "#4b5563" }}
        onClick={handlePull}
        whileHover={{ scale: 1.05 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        {isOn ? "Éteindre la lumière" : "Tirer le fil..."}
      </motion.p>
    </div>
  );
}

export default function Login() {
  const [, setLocation] = useLocation();
  const { login: setAuthContext } = useAuth();
  const { toast } = useToast();
  const [isOn, setIsOn] = useState(false);

  const loginMutation = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await loginMutation.mutateAsync({ data });
      setAuthContext(result.token, result.user);
      toast({ title: "Connexion réussie", description: `Bienvenue, ${result.user.username}` });
      setLocation("/admin");
    } catch {
      toast({ title: "Identifiants invalides", variant: "destructive" });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: isOn ? "#0f0e0a" : "#080808" }}
    >
      {/* Ambiance lumineuse */}
      <AnimatePresence>
        {isOn && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="absolute top-1/4 left-1/3 w-125 h-125 rounded-full blur-[160px]"
              style={{ background: "radial-gradient(circle, #fde68a30, transparent 70%)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 px-6 z-10">

        {/* Veilleuse */}
        <Lamp isOn={isOn} onPull={() => setIsOn(v => !v)} />

        {/* Formulaire */}
        <AnimatePresence>
          {isOn && (
            <motion.div
              initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 40, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm"
            >
              <div
                className="p-8 rounded-3xl relative overflow-hidden"
                style={{
                  background: "rgba(15,14,10,0.85)",
                  border: "1px solid rgba(253,230,138,0.15)",
                  boxShadow: "0 0 40px rgba(253,230,138,0.08), inset 0 1px 0 rgba(253,230,138,0.1)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* Ligne dorée top */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, #fde68a60, transparent)" }}
                />

                <h1 className="text-2xl font-display font-bold text-white mb-1">
                  Bon retour 👋
                </h1>
                <p className="text-sm mb-7" style={{ color: "#9ca3af" }}>
                  Administration du portfolio
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>
                      Utilisateur
                    </label>
                    <input
                      {...register("username")}
                      className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      placeholder="Votre Pseudonyme"
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(253,230,138,0.4)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                    />
                    {errors.username && (
                      <span className="text-xs text-red-400 mt-1 block">{errors.username.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      {...register("password")}
                      className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      placeholder="••••••••"
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(253,230,138,0.4)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                    />
                    {errors.password && (
                      <span className="text-xs text-red-400 mt-1 block">{errors.password.message}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all mt-2 flex items-center justify-center gap-2 hover:scale-105 disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, #fde68a, #f59e0b)",
                      color: "#000",
                    }}
                  >
                    {loginMutation.isPending
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : "Se connecter"
                    }
                  </button>
                </form>

                {/* 👇 Lien setup ici, après le bouton */}
                <p className="text-center text-xs mt-5" style={{ color: "#4b5563" }}>
                  Première fois ?{" "}
                  <a
                    href="/setup"
                    className="underline transition-colors hover:text-white"
                    style={{ color: "#9ca3af" }}
                  >
                    Créer un compte admin
                  </a>
                </p>

                <p className="text-center text-xs mt-3" style={{ color: "#374151" }}>
                  Éteindre la lumière pour annuler
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}