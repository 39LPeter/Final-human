import React from 'react';
import { Lock } from 'lucide-react';

const SecureViewer = ({ children }) => (
  <div onContextMenu={(e) => e.preventDefault()} className="relative select-none print:hidden group">
    <div className="absolute inset-0 z-10 bg-transparent" /> 
    {children}
    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Lock size={10}/> Protected View
    </div>
  </div>
);

export default SecureViewer;
