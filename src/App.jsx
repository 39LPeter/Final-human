import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, MapPin, Phone, Mail, Lock, 
  BookOpen, FileText, Users, Settings, 
  LogOut, Plus, Edit, Trash2, ArrowRight,
  Heart, Globe, Droplet, GraduationCap, TrendingUp, Sprout,
  Calendar, Hammer, Clock, CheckCircle, Play, ChevronDown, 
  ArrowUpRight, ShieldCheck, UserPlus, KeyRound, ArrowLeft,
  MessageCircle, Sparkles, Send, Loader2, Copy
} from 'lucide-react';

// --- UTILITIES ---

const callGemini = async (prompt, systemContext = "") => {
  const apiKey = ""; // Provided by environment at runtime
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const fullPrompt = `${systemContext}\n\nUser Query: ${prompt}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }]
      })
    });

    if (!response.ok) throw new Error('AI Service Busy');
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Our AI service is currently experiencing high traffic. Please try again later.";
  }
};

// --- HOOKS ---

const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

// --- STYLES ---

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;800&display=swap');

    :root {
      --primary: #0f172a;
      --accent: #0ea5e9;
      --gold: #d97706;
    }

    body {
      font-family: 'Inter', sans-serif;
      background-color: #f8fafc;
      overflow-x: hidden;
    }

    h1, h2, h3, h4 {
      font-family: 'Playfair Display', serif;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f1f1; 
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1; 
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8; 
    }

    /* Reveal Animations */
    .reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
    }
    .reveal.animate-active {
      opacity: 1;
      transform: translateY(0);
    }

    .reveal-delay-100 { transition-delay: 0.1s; }
    .reveal-delay-200 { transition-delay: 0.2s; }
    .reveal-delay-300 { transition-delay: 0.3s; }

    /* Gradient Animation */
    @keyframes gradient-xy {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradient {
      background-size: 200% 200%;
      animation: gradient-xy 6s ease infinite;
    }

    /* Floating Animation */
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    .animate-float {
      animation: float 4s ease-in-out infinite;
    }

    /* Blob Animation */
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 { animation-delay: 2s; }
    .animation-delay-4000 { animation-delay: 4s; }
  `}</style>
);

// --- SHARED COMPONENTS ---

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

const SecureViewer = ({ children }) => (
  <div onContextMenu={(e) => e.preventDefault()} className="relative select-none print:hidden group">
    <div className="absolute inset-0 z-10 bg-transparent" /> 
    {children}
    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Lock size={10}/> Protected View
    </div>
  </div>
);

// --- NEW COMPONENT: SPOTLIGHT CARD ---
const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(255, 255, 255, 0.25)' }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = e => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border border-neutral-800 bg-neutral-900 overflow-hidden p-8 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
        }}
      />
      {children}
    </div>
  );
};

// --- AI CHAT WIDGET ---
const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm the NGO's AI Assistant. Ask me about our mission, projects, or how to donate!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const context = "You are a helpful AI assistant for a Non-Governmental Organization (NGO) in Kenya. Your goal is to explain the NGO's mission (Education, Health, Water), encourage donations via M-Pesa, and explain programs politely and professionally. Keep answers concise.";
    
    const reply = await callGemini(userMsg, context);
    
    setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    setIsLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform animate-float"
      >
        {isOpen ? <X size={24}/> : <MessageCircle size={28}/>}
        {!isOpen && <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col h-[500px] animate-fadeIn">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><Sparkles size={20} className="text-yellow-300"/></div>
            <div>
              <h4 className="font-bold text-sm">AI Impact Assistant</h4>
              <p className="text-xs text-blue-200 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online Now</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white border border-gray-100 shadow-sm text-slate-700 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-blue-600"/>
                  <span className="text-xs text-gray-400">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our projects..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
            <button disabled={isLoading} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
              <Send size={18}/>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

// --- NAVIGATION & FOOTER ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Who We Are", path: "/team" },
    { name: "Programs", path: "/programs" },
    { name: "Gallery", path: "/gallery" },
    { name: "Resources", path: "/resources" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:rotate-12 transition-transform duration-300">N</div>
            <span className={`font-bold text-xl tracking-tight ${scrolled ? 'text-slate-900' : 'text-white mix-blend-difference'}`}>NGO NAME</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive(link.path) 
                    ? 'bg-blue-50 text-blue-600 shadow-sm' 
                    : scrolled ? 'text-slate-600 hover:bg-slate-50' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/donate" className="ml-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
              Donate <Heart size={14} className="fill-current"/>
            </Link>
            <Link to="/admin" className={`ml-2 p-2 rounded-full transition-colors ${scrolled ? 'text-slate-400 hover:text-slate-900' : 'text-white/70 hover:text-white'}`}>
              <Settings size={20} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className={`md:hidden ${scrolled ? 'text-slate-900' : 'text-white'}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-2xl animate-fadeIn">
          <div className="p-4 space-y-2">
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 font-medium"
              >
                {link.name}
              </Link>
            ))}
            <Link to="/donate" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg bg-blue-600 text-white font-bold text-center">
              Donate Now
            </Link>
            <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-center text-sm text-slate-400">
              Admin Access
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 relative overflow-hidden pt-24 pb-12">
    {/* Decorative Waves */}
    <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
      <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
      </svg>
    </div>

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-3xl font-serif text-white font-bold mb-6">NGO Name</h3>
          <p className="text-slate-400 max-w-sm leading-relaxed mb-8">
            Forging a path towards a sustainable, equitable future through education, healthcare, and community empowerment.
          </p>
          <div className="flex gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                <Globe size={18}/>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/team" className="hover:text-blue-400 transition-colors">Our Leadership</Link></li>
            <li><Link to="/programs" className="hover:text-blue-400 transition-colors">Impact Programs</Link></li>
            <li><Link to="/gallery" className="hover:text-blue-400 transition-colors">Media Gallery</Link></li>
            <li><Link to="/donate" className="hover:text-blue-400 transition-colors">Support Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-blue-500 mt-1 flex-shrink-0"/>
              <span>NGO House, Westlands,<br/>Nairobi, Kenya</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-green-500 flex-shrink-0"/>
              <span>+254 700 000 000</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-yellow-500 flex-shrink-0"/>
              <span>info@ngoname.org</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
        <p>© 2025 NGO Name. Registered Non-Profit.</p>
        <p className="mt-2 md:mt-0">Powered by Afriregister & Firebase</p>
      </div>
    </div>
  </footer>
);

// --- PAGES ---

const Home = () => {
  useScrollAnimation();

  const stats = [
    { label: "Lives Impacted", value: "15K+", icon: <Users className="text-blue-400"/> },
    { label: "Counties", value: "47", icon: <MapPin className="text-green-400"/> },
    { label: "Projects", value: "120+", icon: <Hammer className="text-yellow-400"/> },
    { label: "Volunteers", value: "500+", icon: <Heart className="text-red-400"/> },
  ];

  return (
    <div className="font-sans">
      {/* HERO SECTION */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 pt-20">
        {/* Dynamic Background */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=2000&q=80" className="w-full h-full object-cover opacity-20" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-blue-300 text-sm font-bold uppercase tracking-widest mb-8 animate-float">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span> Transforming Communities
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
            Hope in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Action</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            We bridge the gap between resources and need. Join us in building a future where every child is educated, and every family is secure.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/donate" className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-600/40 flex items-center justify-center gap-3">
              Start Donating <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
            </Link>
            <Link to="/programs" className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur border border-white/20 text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3">
              <Play size={20} className="fill-current"/> Watch Our Story
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <ChevronDown size={32}/>
        </div>
      </div>

      {/* IMPACT STRIP */}
      <div className="relative z-20 -mt-20 container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 divide-x divide-gray-100">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-4 group">
              <div className="w-12 h-12 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* STRATEGIC MOVES */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <SectionHeader subtitle="Our Blueprint" title="Six Pillars of Change" />
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Digital Literacy", icon: <Globe/>, color: "blue", desc: "Bridging the digital divide." },
              { title: "Health Access", icon: <Heart/>, color: "red", desc: "Healthcare for the remote." },
              { title: "Clean Water", icon: <Droplet/>, color: "cyan", desc: "Life-sustaining infrastructure." },
              { title: "Education", icon: <GraduationCap/>, color: "purple", desc: "Empowering the next generation." },
              { title: "Economic Growth", icon: <TrendingUp/>, color: "green", desc: "Micro-finance for families." },
              { title: "Climate Action", icon: <Sprout/>, color: "emerald", desc: "Restoring our environment." }
            ].map((item, i) => (
              <div key={i} className="group relative bg-white border border-gray-100 p-8 rounded-3xl hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 hover:-translate-y-2 overflow-hidden reveal reveal-delay-100">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${item.color}-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700`}></div>
                <div className={`relative w-14 h-14 bg-${item.color}-100 rounded-2xl flex items-center justify-center text-${item.color}-600 mb-6 group-hover:rotate-6 transition-transform`}>
                  {React.cloneElement(item.icon, { size: 28 })}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 mb-6">{item.desc}</p>
                <Link to="/programs" className={`flex items-center gap-2 text-${item.color}-600 font-bold text-sm uppercase tracking-wide group-hover:gap-4 transition-all`}>
                  Learn More <ArrowRight size={16}/>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 md:p-20 text-center shadow-2xl transform hover:scale-[1.01] transition-transform duration-500">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 font-serif">Be the Change.</h2>
            <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">Your contribution, no matter the size, creates ripples of hope across communities.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donate" className="px-10 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-xl">
                Donate Now
              </Link>
              <Link to="/team" className="px-10 py-4 bg-blue-800 text-white border border-blue-400 rounded-full font-bold text-lg hover:bg-blue-700 transition-colors">
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Team = () => {
  useScrollAnimation();
  
  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-6">
        <SectionHeader subtitle="Leadership" title="The People Behind the Mission" />
        
        {/* WHO WE ARE */}
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 mb-20 reveal relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">Who We Are</h3>
              <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                <p>Founded in 2010, we began with a singular vision: to dismantle the barriers of poverty through sustainable, community-led action.</p>
                <p>We are not just an organization; we are a movement of thinkers, doers, and believers who understand that true change comes from empowering the individual to uplift the community.</p>
              </div>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg group">
              <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Team meeting"/>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* TEAM GRID */}
        {['Board of Directors', 'Executive Team'].map((section, idx) => (
          <div key={idx} className="mb-20 reveal">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 border-l-4 border-blue-500 pl-4">{section}</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-50 group text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 mb-6 overflow-hidden border-4 border-white shadow-md group-hover:border-blue-100 transition-colors">
                    <img src={`https://i.pravatar.cc/150?img=${idx * 3 + i + 10}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Team Member"/>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Dr. Name Surname</h4>
                  <p className="text-blue-600 font-medium text-sm mb-4">{idx === 0 ? 'Board Member' : 'Head of Operations'}</p>
                  <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600"><Mail size={16}/></button>
                    <button className="p-2 rounded-full bg-slate-50 hover:bg-green-50 text-slate-400 hover:text-green-600"><Phone size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Programs = () => {
  useScrollAnimation();
  
  const projects = [
    { id: 1, title: "Clean Water Initiative", loc: "Turkana", progress: 75, img: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800" },
    { id: 2, title: "Digital Hub", loc: "Mombasa", progress: 40, img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800" },
    { id: 3, title: "Mobile Clinics", loc: "Kajiado", progress: 92, img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800" }
  ];

  const incomingProjects = [
    { id: 4, title: "Reforestation 2025", date: "Jan 15, 2025", desc: "Planting 500,000 trees in Mau.", status: "Planning" },
    { id: 5, title: "Girls in STEM", date: "Mar 1, 2025", desc: "Scholarships for 100 girls.", status: "Fundraising" },
    { id: 6, title: "Urban Farming", date: "Jun 2025", desc: "Vertical gardens in settlements.", status: "Sourcing" }
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
            {projects.map((p) => (
              /* Using the new SpotlightCard with Orange-Red color */
              <SpotlightCard 
                key={p.id} 
                className="shadow-xl hover:shadow-2xl transition-all duration-300 reveal reveal-delay-100 p-0" // p-0 to reset padding for image
                spotlightColor="rgba(255, 69, 0, 0.25)" // Orange Red Spotlight
              >
                {/* Card Content adapted for Dark Mode */}
                <div className="h-56 relative overflow-hidden rounded-t-3xl -mx-8 -mt-8"> {/* Negative margin to offset card padding */}
                  <img src={p.img} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700" alt={p.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-1 text-xs font-bold bg-black/50 backdrop-blur px-2 py-1 rounded mb-1 w-fit">
                      <MapPin size={12}/> {p.loc}
                    </div>
                    <h4 className="font-bold text-lg">{p.title}</h4>
                  </div>
                </div>
                
                <div className="pt-6">
                  <div className="flex justify-between text-sm font-bold text-neutral-400 mb-2">
                    <span>Progress</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full mb-6 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000" style={{width: `${p.progress}%`}}></div>
                  </div>
                  <Link to="/donate" className="block w-full py-3 text-center rounded-xl border border-neutral-700 font-bold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all">
                    Support This Project
                  </Link>
                </div>
              </SpotlightCard>
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
            {incomingProjects.map((item) => (
              <div key={item.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-purple-200 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase rounded-full">{item.status}</span>
                  </div>
                  <p className="text-slate-500">{item.desc}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-gray-400 uppercase font-bold">Launch Date</p>
                    <p className="text-purple-700 font-bold flex items-center gap-2 justify-end"><Clock size={16}/> {item.date}</p>
                  </div>
                  <button className="px-6 py-2 rounded-full bg-purple-50 text-purple-700 font-bold text-sm hover:bg-purple-100 transition-colors">
                    Get Notified
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Donate = () => {
  const [activeAmt, setActiveAmt] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-24 px-4">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        <div className="bg-blue-900 p-12 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-serif font-bold mb-6">Your Impact Starts Here.</h2>
            <ul className="space-y-4 text-blue-100">
              <li className="flex items-center gap-3"><CheckCircle size={20} className="text-green-400"/> Secure M-Pesa Transaction</li>
              <li className="flex items-center gap-3"><CheckCircle size={20} className="text-green-400"/> Instant Tax Receipt</li>
              <li className="flex items-center gap-3"><CheckCircle size={20} className="text-green-400"/> 100% Transparency</li>
            </ul>
          </div>
          <div className="relative z-10 mt-12">
            <div className="text-sm font-bold uppercase tracking-widest text-blue-300 mb-2">Trusted Payment Partner</div>
            <div className="text-2xl font-black tracking-tighter">M-PESA</div>
          </div>
        </div>

        <div className="p-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">Make a Donation</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[500, 1000, 5000].map(amt => (
              <button 
                key={amt}
                onClick={() => setActiveAmt(amt)}
                className={`py-3 rounded-xl border-2 font-bold transition-all ${activeAmt === amt ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}
              >
                KES {amt}
              </button>
            ))}
          </div>

          <form className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 text-slate-400" size={20}/>
                <input type="text" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900" placeholder="07XX XXX XXX"/>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Custom Amount</label>
              <input 
                type="number" 
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900" 
                placeholder="Enter amount"
                value={activeAmt || ''}
                onChange={e => setActiveAmt(e.target.value)}
              />
            </div>
            <button className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 transition-all transform hover:-translate-y-1">
              Donate Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

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

const Resources = () => (
  <div className="min-h-screen pt-24 pb-24 container mx-auto px-6">
    <SectionHeader subtitle="Knowledge" title="Library & Reports" />
    <div className="grid md:grid-cols-2 gap-8">
      {[1,2,3,4].map(i => (
        <SecureViewer key={i}>
          <div className="flex bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer">
            <div className="w-24 h-32 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden">
              <img src={`https://source.unsplash.com/random/200x300?book&sig=${i}`} className="w-full h-full object-cover" alt="Resource Cover"/>
            </div>
            <div className="ml-6 flex flex-col justify-center">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Magazine</span>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Impact Report Q{i}</h4>
              <p className="text-sm text-slate-500 mb-3">Comprehensive analysis of our field work and financial breakdown.</p>
              <span className="text-xs font-bold text-green-600 flex items-center gap-1"><Lock size={10}/> Read Only Access</span>
            </div>
          </div>
        </SecureViewer>
      ))}
    </div>
  </div>
);

const Admin = () => {
  const [authMode, setAuthMode] = useState('login'); 
  const [isAuth, setIsAuth] = useState(false);
  const [activeSection, setActiveSection] = useState('ai');
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('Professional');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    setIsAuth(true); // Mock login
  };

  const handleGenerate = async () => {
    if(!aiTopic) return;
    setIsGenerating(true);
    const prompt = `Write a ${aiTone} piece about: ${aiTopic}. Format nicely with headers if needed.`;
    const result = await callGemini(prompt, "You are an expert NGO copywriter. Create compelling content.");
    setGeneratedContent(result);
    setIsGenerating(false);
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl border border-white/50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-xl shadow-blue-900/20">N</div>
            <h2 className="text-2xl font-bold text-slate-800">
              {authMode === 'login' ? 'Staff Portal' : authMode === 'signup' ? 'Join Team' : 'Recovery'}
            </h2>
          </div>
          <form className="space-y-4" onSubmit={handleAuth}>
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
                <input className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 transition-all"/>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email</label>
              <div className="relative"><Mail className="absolute left-3 top-3 text-slate-400" size={18}/><input className="w-full pl-10 pr-3 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 transition-all"/></div>
            </div>
            {authMode !== 'forgot' && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
                <div className="relative"><KeyRound className="absolute left-3 top-3 text-slate-400" size={18}/><input type="password" className="w-full pl-10 pr-3 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 transition-all"/></div>
              </div>
            )}
            <button className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg">
              {authMode === 'login' ? 'Secure Login' : authMode === 'signup' ? 'Request Access' : 'Send Link'}
            </button>
          </form>
          <div className="mt-6 flex justify-between text-xs font-bold text-slate-500">
            {authMode === 'login' ? (
              <>
                <button onClick={()=>setAuthMode('forgot')} className="hover:text-blue-600">Forgot Password?</button>
                <button onClick={()=>setAuthMode('signup')} className="text-blue-600 hover:underline">Create Account</button>
              </>
            ) : (
              <button onClick={()=>setAuthMode('login')} className="flex items-center gap-1 hover:text-blue-600"><ArrowLeft size={12}/> Back to Login</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="w-64 bg-blue-900 text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2"><Settings/> Admin</h2>
        <nav className="space-y-2">
          <button onClick={()=>setActiveSection('ai')} className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${activeSection==='ai' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-800'}`}>
            <Sparkles size={18}/> AI Content Studio
          </button>
          <button onClick={()=>setActiveSection('team')} className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${activeSection==='team' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-800'}`}>
            <Users size={18}/> Team
          </button>
          <button onClick={()=>setIsAuth(false)} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-600 mt-8 text-red-200">
            <LogOut size={18}/> Logout
          </button>
        </nav>
      </div>

      <div className="flex-1 p-8">
        {activeSection === 'ai' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Sparkles size={24}/>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">AI Content Generator</h2>
                  <p className="text-slate-500">Draft proposals, emails, and reports in seconds.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Topic / Details</label>
                    <textarea 
                      className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                      placeholder="e.g., Grant proposal for new water well in Turkana..."
                      value={aiTopic}
                      onChange={(e)=>setAiTopic(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Tone</label>
                    <select 
                      className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200"
                      value={aiTone}
                      onChange={(e)=>setAiTone(e.target.value)}
                    >
                      <option>Professional</option>
                      <option>Urgent & Emotional</option>
                      <option>Gratitude</option>
                      <option>Social Media Post</option>
                    </select>
                  </div>
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? <Loader2 className="animate-spin"/> : <Sparkles size={18}/>}
                    Generate
                  </button>
                </div>

                <div className="md:col-span-2 bg-slate-50 rounded-xl border border-slate-200 p-6 relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-white shadow-sm rounded-lg hover:bg-blue-50 text-slate-500" onClick={() => navigator.clipboard.writeText(generatedContent)}>
                      <Copy size={16}/>
                    </button>
                  </div>
                  {generatedContent ? (
                    <div className="prose prose-sm text-slate-700 whitespace-pre-wrap">{generatedContent}</div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <Sparkles size={48} className="mb-4 opacity-20"/>
                      <p>AI output will appear here...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeSection === 'team' && (
          <div className="text-center py-20 text-slate-400">
            <Users size={64} className="mx-auto mb-4 opacity-20"/>
            <h3 className="text-xl font-bold text-slate-600">Team Management</h3>
            <p>Connect Firebase to enable CRUD operations.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  return (
    <Router>
      <GlobalStyles />
      <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
        <AIChatWidget />
      </div>
    </Router>
  );
};

export default App;
