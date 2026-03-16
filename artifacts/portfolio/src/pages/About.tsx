import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, User, MapPin } from "lucide-react";

export default function About() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <motion.div 
            className="md:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="aspect-square rounded-3xl overflow-hidden glass-card mb-6 p-1 bg-gradient-to-br from-primary/30 to-accent/30">
              <img 
                src={`${import.meta.env.BASE_URL}images/avatar-placeholder.png`} 
                alt="Ranja Andriamiadana" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="flex items-center gap-3"><User className="w-5 h-5 text-primary" /> Ranja Herimandimby Lioka</p>
              <p className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary" /> Antananarivo, Madagascar</p>
              <p className="flex items-center gap-3"><GraduationCap className="w-5 h-5 text-primary" /> ENI Fianarantsoa</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Développeur passionné par la <span className="gradient-text">création d'expériences</span> interactives.
            </h1>
            <div className="prose prose-invert text-muted-foreground text-lg leading-relaxed">
              <p>
                Actuellement étudiant en Licence en Génie Logiciel à l'École Nationale d'Informatique (ENI) de Fianarantsoa, 
                j'ai développé une forte appétence pour la résolution de problèmes par le code.
              </p>
              <p>
                Mon parcours m'a permis de toucher à une grande variété de technologies, de la programmation système en C/C++ 
                au développement d'applications web modernes avec ReactJS. Je suis particulièrement attiré par le frontend où 
                je peux exprimer ma créativité tout en assurant une architecture logicielle solide.
              </p>
              <p>
                Toujours à l'affût de nouveaux défis, je participe régulièrement à des hackathons pour tester mes limites et 
                apprendre de nouvelles technologies sous pression.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Skills Section */}
        <motion.section 
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-display font-bold mb-10 flex items-center gap-3">
            <BookOpen className="text-primary" /> Compétences Techniques
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Langages</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>JavaScript / TypeScript</li>
                <li>C, C++, C#</li>
                <li>Java</li>
                <li>PHP, Python (bases)</li>
              </ul>
            </div>
            
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Web & Frameworks</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>ReactJS</li>
                <li>Next.js / Express</li>
                <li>HTML5 / CSS3</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
            
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Bases de données</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>PostgreSQL</li>
                <li>MySQL</li>
                <li>SQLite</li>
              </ul>
            </div>
            
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Outils & Soft Skills</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>Git / GitHub</li>
                <li>VS Code</li>
                <li>Travail en équipe</li>
                <li>Adaptabilité</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Timeline Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-display font-bold mb-10 flex items-center gap-3">
            <Award className="text-accent" /> Parcours & Réalisations
          </h2>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            
            {/* Timeline Item 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-primary">
                <Award className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 rounded-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                  <h3 className="font-bold text-lg text-white">Devhunt 5.0 - 1ère Place</h3>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-primary/20 text-primary">2025</span>
                </div>
                <p className="text-muted-foreground text-sm">Vainqueur du hackathon avec une application d'initiation technologique pour enfants.</p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-accent">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 rounded-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                  <h3 className="font-bold text-lg text-white">Licence en Génie Logiciel</h3>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-white/10 text-white/70">En cours</span>
                </div>
                <p className="text-muted-foreground text-sm">École Nationale d'Informatique (ENI) - Fianarantsoa.</p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-white/50">
                <Award className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 rounded-2xl opacity-70 hover:opacity-100 transition-opacity">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                  <h3 className="font-bold text-lg text-white">Compétition ENI - 2ème Place</h3>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-white/10 text-white/70">2024</span>
                </div>
                <p className="text-muted-foreground text-sm">Compétition front-end HTML/CSS organisée par l'université.</p>
              </div>
            </div>

          </div>
        </motion.section>

      </div>
    </div>
  );
}
