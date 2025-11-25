import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface VisualizerProps {
  htmlContent: string;
  title: string;
}

export const Visualizer: React.FC<VisualizerProps> = ({ htmlContent, title }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full bg-slate-900 overflow-hidden relative"
    >
      <iframe
        ref={iframeRef}
        title={`Visualization of ${title}`}
        srcDoc={htmlContent}
        className="w-full h-full border-none block"
        sandbox="allow-scripts allow-popups allow-modals"
        loading="lazy"
      />
    </motion.div>
  );
};