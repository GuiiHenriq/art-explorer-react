import { motion } from 'framer-motion';
import { Calendar, Palette, Building2 } from 'lucide-react';

interface InfoSectionProps {
  icon: typeof Calendar | typeof Palette | typeof Building2;
  label: string;
  value: string;
  description?: string;
  gradient: string;
  delay: number;
}

const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
} as const;

export const InfoSection = ({ icon: Icon, label, value, description, delay }: InfoSectionProps) => (
  <motion.div
    variants={ANIMATION_VARIANTS.fadeInUp}
    initial="initial"
    animate="animate"
    transition={{ delay }}
    className="group border-l-3 border-amber-400/60 pl-4 py-2 hover:border-amber-500 hover:bg-slate-50/50 transition-all duration-300"
  >
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center border border-amber-300/30 group-hover:border-amber-400/60 transition-all duration-300 mt-1">
        <Icon size={18} className="text-amber-200" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-500 text-xs font-serif uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-lg font-serif font-medium text-slate-800 leading-snug mb-1 break-words">
          {value}
        </p>
        {description && (
          <p className="text-slate-600 text-sm leading-relaxed font-light italic break-words">
            {description}
          </p>
        )}
      </div>
    </div>
  </motion.div>
);
