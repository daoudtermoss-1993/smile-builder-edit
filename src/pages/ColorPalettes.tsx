import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
import { Link } from "react-router-dom";

const palettes = [
  {
    name: "Teal + Or",
    description: "Clinique haut de gamme, élégance classique",
    primary: "#0D9488",
    accent: "#E5A623",
    accentLight: "#F5C842",
  },
  {
    name: "Teal + Corail",
    description: "Moderne, accueillant, dynamique",
    primary: "#0D9488",
    accent: "#FF6B6B",
    accentLight: "#FF8A8A",
  },
  {
    name: "Teal + Lavande",
    description: "Spa, bien-être, relaxation",
    primary: "#0D9488",
    accent: "#A78BFA",
    accentLight: "#C4B5FD",
  },
  {
    name: "Teal + Cuivre",
    description: "Vintage luxe, authentique",
    primary: "#0D9488",
    accent: "#B87333",
    accentLight: "#D4956A",
  },
  {
    name: "Teal + Blanc Cassé",
    description: "Minimaliste, épuré, médical moderne",
    primary: "#0D9488",
    accent: "#F5F5DC",
    accentLight: "#FFFFF0",
  },
  {
    name: "Teal + Rose Poudré",
    description: "Moderne, accueillant, jeune",
    primary: "#0D9488",
    accent: "#F8B4C4",
    accentLight: "#FBCCD7",
  },
];

const PaletteCard = ({ palette, index }: { palette: typeof palettes[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white"
    >
      {/* Header with gradient */}
      <div 
        className="h-24 relative"
        style={{ 
          background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.accent} 100%)` 
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">{palette.name}</h3>
        </div>
      </div>

      {/* Color swatches */}
      <div className="flex">
        <div 
          className="flex-1 h-16 flex items-center justify-center"
          style={{ backgroundColor: palette.primary }}
        >
          <span className="text-white text-xs font-mono">{palette.primary}</span>
        </div>
        <div 
          className="flex-1 h-16 flex items-center justify-center"
          style={{ backgroundColor: palette.accent }}
        >
          <span className="text-white text-xs font-mono mix-blend-difference">{palette.accent}</span>
        </div>
      </div>

      {/* Preview content */}
      <div className="p-6 space-y-4">
        <p className="text-gray-600 text-sm">{palette.description}</p>

        {/* Sample card */}
        <div 
          className="p-4 rounded-xl border-2"
          style={{ borderColor: `${palette.accent}30` }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: palette.primary }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Service Premium</h4>
              <p className="text-sm text-gray-500">Exemple de carte service</p>
            </div>
          </div>
        </div>

        {/* Sample buttons */}
        <div className="flex gap-3">
          <button 
            className="flex-1 py-2.5 rounded-full text-white font-medium text-sm"
            style={{ backgroundColor: palette.primary }}
          >
            Primary
          </button>
          <button 
            className="flex-1 py-2.5 rounded-full text-white font-medium text-sm"
            style={{ backgroundColor: palette.accent }}
          >
            Accent
          </button>
        </div>

        {/* Gradient button */}
        <button 
          className="w-full py-3 rounded-full text-white font-semibold flex items-center justify-center gap-2"
          style={{ 
            background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.accent} 100%)` 
          }}
        >
          <Sparkles className="w-4 h-4" />
          Réserver Maintenant
        </button>

        {/* Features list */}
        <div className="space-y-2">
          {["Navigation", "Cartes", "Boutons"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${palette.accent}20` }}
              >
                <Check className="w-3 h-3" style={{ color: palette.accent }} />
              </div>
              <span className="text-sm text-gray-600">{item}</span>
            </div>
          ))}
        </div>

        {/* Text gradient example */}
        <p 
          className="text-xl font-bold bg-clip-text text-transparent"
          style={{ 
            backgroundImage: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.accent} 100%)` 
          }}
        >
          Texte en Gradient
        </p>
      </div>
    </motion.div>
  );
};

export default function ColorPalettes() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au site
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Palettes de Couleurs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Voici comment chaque combinaison de couleurs apparaît ensemble. 
            Choisissez celle qui correspond le mieux à votre vision.
          </p>
        </motion.div>

        {/* Palettes grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {palettes.map((palette, index) => (
            <PaletteCard key={palette.name} palette={palette} index={index} />
          ))}
        </div>

        {/* Footer note */}
        <motion.p 
          className="text-center text-gray-500 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Dites-moi quelle palette vous préférez et je l'appliquerai à tout le site !
        </motion.p>
      </div>
    </div>
  );
}