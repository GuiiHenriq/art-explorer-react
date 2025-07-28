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
    animate: { opacity: 1, y: 0 }
  }
} as const;

export const InfoSection = ({ 
  icon: Icon, 
  label, 
  value, 
  description, 
  gradient, 
  delay 
}: InfoSectionProps) => (
  <motion.div
    variants={ANIMATION_VARIANTS.fadeInUp}
    initial="initial"
    animate="animate"
    transition={{ delay }}
    className="flex items-center gap-3"
  >
    <div className={`w-12 h-12 ${gradient} rounded-full flex items-center justify-center`}>
      <Icon size={24} className="text-white" />
    </div>
    <div className="flex-1">
      <p className="text-gray-500 text-sm uppercase tracking-wider">{label}</p>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
      {description && (
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      )}
    </div>
  </motion.div>
); 