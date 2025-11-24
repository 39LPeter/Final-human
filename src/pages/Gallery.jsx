import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const Gallery = () => {
  const [activeCat, setActiveCat] = useState('All');
  const images = [
    { id: 1, cat: 'Events', src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800' },
    { id: 2, cat: 'Education', src: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800' },
    { id: 3, cat: 'Environment', src: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800' },
    { id: 4, cat: 'Events', src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <SectionHeader subtitle="Moments" title="Gallery of Impact" />
        
        <div className="flex justify-center gap-2 mb-12">
          {['All', 'Events', 'Education', 'Environment'].map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeCat === cat ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="columns-1 md:columns-3 gap-6 space-y-6 animate-fadeIn">
          {images.filter(img => activeCat === 'All' || img.cat === activeCat).map((img) => (
            <div key={img.id} className="break-inside-avoid group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-zoom-in">
              <img src={img.src} className="w-full transition-transform duration-700 group-hover:scale-110" alt="Gallery Item" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur p-3 rounded-full text-white">
                  <Plus size={24}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
