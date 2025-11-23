import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, Calendar, MapPin } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Programs = () => {
  useScrollAnimation();
  
  const projects = [
    { title: "Clean Water Initiative", loc: "Turkana", progress: 75, img: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800" },
    { title: "Digital Hub", loc: "Mombasa", progress: 40, img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800" },
    { title: "Mobile Clinics", loc: "Kajiado", progress: 92, img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-24 font-sans">
      <div className="container mx-auto px-6">
        <SectionHeader subtitle="Our Work" title="Building the Future" />

        {/* ONGOING */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-10 reveal">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Hammer size={20}/></div>
            <h3 className="text-2xl font-bold text-slate-800">Ongoing Projects</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((p, i) => (
              <div key={i} className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 reveal reveal-delay-100">
                <div className="h-56 relative overflow-hidden">
                  <img src={p.img} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" alt={p.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-1 text-xs font-bold bg-black/30 backdrop-blur px-2 py-1 rounded mb-1 w-fit">
                      <MapPin size={12}/> {p.loc}
                    </div>
                    <h4 className="font-bold text-lg">{p.title}</h4>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
                    <span>Progress</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000" style={{width: `${p.progress}%`}}></div>
                  </div>
                  <Link to="/donate" className="block w-full py-3 text-center rounded-xl border-2 border-slate-100 font-bold text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all">
                    Support This Project
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INCOMING */}
        <div className="reveal">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><Calendar size={20}/></div>
            <h3 className="text-2xl font-bold text-slate-800">Pipeline (2025)</h3>
          </div>
          
          <div className="grid gap-6">
            {[1, 2].map((item) => (
              <div key={item} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-purple-200 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-purple-50 rounded-2xl flex flex-col items-center justify-center text-purple-800 font-bold leading-tight">
                    <span className="text-xs uppercase">Jan</span>
                    <span className="text-xl">15</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">Reforestation Phase II</h4>
                    <p className="text-slate-500">Mau Forest Complex • Target: 500k Trees</p>
                  </div>
                </div>
                <button className="px-6 py-2 rounded-full bg-purple-50 text-purple-700 font-bold text-sm hover:bg-purple-100 transition-colors">
                  Get Notified
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Programs;
