import React from 'react';

const SectionHeader = ({ subtitle, title, align = "center" }) => (
  <div className={`mb-16 reveal ${align === "center" ? "text-center mx-auto" : ""} max-w-3xl`}>
    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4">
      {subtitle}
    </span>
    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
      {title}
    </h2>
    <div className={`h-1.5 w-24 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full ${align === "center" ? "mx-auto" : ""}`}></div>
  </div>
);

export default SectionHeader;
