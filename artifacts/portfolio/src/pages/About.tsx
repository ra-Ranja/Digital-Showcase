import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Award, GraduationCap, Code2, Layout, Server, Database } from "lucide-react";

const BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";

// Catégorisation logique pour une meilleure lisibilité
const TECH_CATEGORIES = [
  {
    id: "frontend",
    title: "Frontend",
    icon: <Layout className="w-5 h-5 text-cyan-400" />,
    skills: [
      { name: "React", color: "#61dafb", logo: `${BASE}react/react-original.svg` },
      { name: "Next.js", color: "#ffffff", logo: `${BASE}nextjs/nextjs-original.svg` },
      { name: "Tailwind", color: "#06b6d4", logo: `${BASE}tailwindcss/tailwindcss-original.svg` },
      { name: "HTML5", color: "#e34f26", logo: `${BASE}html5/html5-original.svg` },
      { name: "CSS3", color: "#1572b6", logo: `${BASE}css3/css3-original.svg` },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    icon: <Server className="w-5 h-5 text-emerald-400" />,
    skills: [
      { name: "Node.js", color: "#339933", logo: `${BASE}nodejs/nodejs-original.svg` },
      { name: "Express", color: "#ffffff", logo: `${BASE}express/express-original.svg` },
      { name: "Laravel", color: "#ff2d20", logo: `${BASE}laravel/laravel-original.svg` },
      { name: "Spring Boot", color: "#6db33f", logo: `${BASE}spring/spring-original.svg` },
      { name: "FastAPI", color: "#009688", logo: `${BASE}fastapi/fastapi-original.svg` },
      { name: "Flask", color: "#ffffff", logo: `${BASE}flask/flask-original.svg` },
    ],
  },
  {
    id: "languages",
    title: "Langages",
    icon: <Code2 className="w-5 h-5 text-orange-400" />,
    skills: [
      { name: "JavaScript", color: "#f7df1e", logo: `${BASE}javascript/javascript-original.svg` },
      { name: "TypeScript", color: "#3178c6", logo: `${BASE}typescript/typescript-original.svg` },
      { name: "Python", color: "#3776ab", logo: `${BASE}python/python-original.svg` },
      { name: "Java", color: "#f89820", logo: `${BASE}java/java-original.svg` },
      { name: "PHP", color: "#8892be", logo: `${BASE}php/php-original.svg` },
      { name: "C", color: "#a8b9cc", logo: `${BASE}c/c-original.svg` },
      { name: "C++", color: "#00599c", logo: `${BASE}cplusplus/cplusplus-original.svg` },
      { name: "C#", color: "#239120", logo: `${BASE}csharp/csharp-original.svg` },
    ],
  },
  {
    id: "databases",
    title: "Bases de données",
    icon: <Database className="w-5 h-5 text-blue-400" />,
    skills: [
      { name: "PostgreSQL", color: "#336791", logo: `${BASE}postgresql/postgresql-original.svg` },
      { name: "MySQL", color: "#4479a1", logo: `${BASE}mysql/mysql-original.svg` },
      { name: "SQLite", color: "#07405e", logo: `${BASE}sqlite/sqlite-original.svg` },
      { name: "Oracle", color: "#c74634", logo: `${BASE}oracle/oracle-original.svg` },
    ],
  },
];

// Composant pour une bulle de compétence individuelle
const SkillBadge = ({
  skill,
  index,
  active,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  skill: any;
  index: number;
  active: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
      }}
      whileHover={{
        y: -5,
        scale: 1.05,
      }}
      whileTap={{
        scale: 1.05,
      }}
      animate={{
        y: active ? -5 : 0,
        scale: active ? [1, 1.05, 1.02] : 1,
      }}
      className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 hover:border-white/20 transition-all duration-300 backdrop-blur-sm cursor-pointer"
      style={{
        borderColor: active ? skill.color : "rgba(255,255,255,.1)",
        boxShadow: active
          ? `0 0 30px ${skill.color}40`
          : "inset 0 0 20px rgba(255,255,255,.02)",
      }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl blur-xl"
        style={{
          backgroundColor: skill.color,
        }}
        animate={{
          opacity: active ? 0.22 : 0,
        }}
        transition={{
          duration: 0.3,
        }}
      />
      
      <div className="relative z-10 w-10 h-10 mb-3 flex items-center justify-center">
        <img
          src={skill.logo}
          alt={skill.name}
          className="w-full h-full object-contain transition-all duration-300"
          style={{
            filter: active ? "grayscale(0)" : "grayscale(1)",
            opacity: active ? 1 : 0.7,
          }}
        />
      </div>
      <span className="text-xs font-medium transition-colors duration-300"
            style={{
              color: active ? "#fff" : "rgba(255,255,255,.6)",
            }}>
        {skill.name}
      </span>
    </motion.div>
  );
};

export default function About() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const isTouch =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none)").matches;

const allSkills = TECH_CATEGORIES.flatMap(category => category.skills);

useEffect(() => {
  if (!isTouch) return;

  let i = 0;

  const interval = setInterval(() => {
    setActiveSkill(allSkills[i].name);
    i = (i + 1) % allSkills.length;
  }, 700);

  return () => clearInterval(interval);
}, []);

  return (
    <div className="min-h-screen text-white selection:bg-orange-500/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Stack Technique --- */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <BookOpen className="text-orange-500 w-6 h-6" />
            </div>
            <h2 className="text-3xl font-display font-bold tracking-tight">Stack Technique</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TECH_CATEGORIES.map((category, catIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1, duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl p-6 border border-white/10 bg-white/2"
              >
                {/* Subtle gradient background per card */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    {category.icon}
                    <h3 className="text-lg font-semibold text-white/90">{category.title}</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {category.skills.map((skill, index) => (
                      <SkillBadge
                        key={skill.name}
                        skill={skill}
                        index={index}
                        active={activeSkill === skill.name}
                        onClick={() => {
                          if (isTouch)
                            setActiveSkill(
                              activeSkill === skill.name ? null : skill.name
                            );
                        }}
                        onMouseEnter={() => {
                          if (!isTouch) setActiveSkill(skill.name);
                        }}
                        onMouseLeave={() => {
                          if (!isTouch) setActiveSkill(null);
                        }}
                    />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- Formations (Timeline préservée et lissée) --- */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <Award className="text-red-500 w-6 h-6" />
            </div>
            <h2 className="text-3xl font-display font-bold tracking-tight">Formations</h2>
          </div>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-linear-to-b before:from-transparent before:via-white/15 before:to-transparent">
            
            {/* ENI */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-orange-500/30 bg-[#0a0a0a] text-orange-500 shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-110">
                <Award className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white/2 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                  <h3 className="font-bold text-lg text-white/90">ENI - Fianarantsoa</h3>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    En cours
                  </span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  3ème année de Licence professionnelle en Génie Logiciel et Base de Données.
                </p>
              </div>
            </div>

            {/* ESCA */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-red-500/30 bg-[#0a0a0a] text-red-500 shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-110">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white/2 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                  <h3 className="font-bold text-lg text-white/90">ESCA Antanimena - Antananarivo</h3>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/10">
                    2023
                  </span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  Baccalauréat série C, Mention Assez Bien.
                </p>
              </div>
            </div>

          </div>
        </motion.section>

      </div>
    </div>
  );
}