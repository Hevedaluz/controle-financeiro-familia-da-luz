import { useState, useEffect } from 'react';
import { BookOpen, Shield, ChevronRight, Star } from 'lucide-react';
import { getVersiculoAleatorio } from '../data/versiculos';

interface SplashScreenProps {
  onClose: () => void;
}

export default function SplashScreen({ onClose }: SplashScreenProps) {
  const [versiculo] = useState(() => getVersiculoAleatorio());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-950 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-950/20 via-surface-950 to-surface-950 pointer-events-none" />

      {/* Stars decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-yellow-500/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${8 + Math.random() * 12}px`,
              height: `${8 + Math.random() * 12}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 flex flex-col items-center px-6 max-w-sm w-full transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-glow-green">
              <Shield className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center">
              <span className="text-xs font-bold text-yellow-950">✦</span>
            </div>
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl text-white leading-tight">Controle Financeiro</h1>
            <p className="text-brand-400 font-medium text-sm tracking-wider uppercase mt-0.5">Família da Luz</p>
          </div>
        </div>

        {/* Versículo */}
        <div className="w-full bg-surface-900/80 backdrop-blur border border-surface-700/50 rounded-2xl p-6 mb-8 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">Palavra do Dia</span>
          </div>
          <blockquote className="text-slate-200 text-base leading-relaxed font-light italic mb-4">
            "{versiculo.texto}"
          </blockquote>
          <p className="text-right text-brand-400 font-semibold text-sm">— {versiculo.referencia}</p>
        </div>

        {/* Button */}
        <button
          onClick={handleClose}
          className="w-full btn-primary flex items-center justify-center gap-2 text-base py-4"
        >
          Entrar no App
          <ChevronRight className="w-5 h-5" />
        </button>

        <p className="mt-4 text-surface-500 text-xs text-center">
          Gerencie suas finanças com sabedoria
        </p>
      </div>
    </div>
  );
}
