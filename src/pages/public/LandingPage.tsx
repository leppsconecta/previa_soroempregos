import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Megaphone,
  Clock,
  Briefcase,
  FolderIcon,
  Users,
  LifeBuoy,
  Zap,
  Smartphone,
  CheckCircle2,
  Lock,
  Mail,
  Building,
  ArrowRight,
  X,
  MapPin,
  Send,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  LogIn,
  Search
} from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { CandidateLanding } from '../../components/public/CandidateLanding';
import { GroupFunnelModal } from '../../components/public/modals/GroupFunnelModal';
import { LeadCaptureModal } from '../../components/public/modals/LeadCaptureModal';

// Removed Supabase/Auth imports as they are no longer needed for public landing

interface Grupo {
  id: string;
  nome_grupo: string;
  descricao_grupo: string | null;
  vinculo: string | null;
  categoria: string | null;
  cidade: string | null;
  total_participantes: number | null;
  link_convite: string | null;
}

interface LandingPageProps {
  autoOpenLogin?: boolean;
}

const WhatsAppIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const MOCK_GRUPOS: Grupo[] = [
  { id: 'm1', nome_grupo: 'Vagas CLT, Estágio, PJ - Itu', descricao_grupo: 'Vagas fixas e estágios na região de Itu', vinculo: 'CLT', categoria: 'Geral', cidade: 'Itu', total_participantes: 245, link_convite: 'https://chat.whatsapp.com/H4rn9lidzcuGaTcnptSpQ7' },
  { id: 'm2', nome_grupo: 'Vagas CLT, Estágio, PJ - Votorantim', descricao_grupo: 'Vagas fixas e estágios em Votorantim', vinculo: 'CLT', categoria: 'Geral', cidade: 'Votorantim', total_participantes: 180, link_convite: 'https://chat.whatsapp.com/GiZa4i3hPeOBvWuQfsdHoN' },
  { id: 'm3', nome_grupo: 'Vagas CLT, Estágio, PJ - Sorocaba', descricao_grupo: 'Vagas fixas e estágios em Sorocaba', vinculo: 'CLT', categoria: 'Geral', cidade: 'Sorocaba', total_participantes: 250, link_convite: 'https://chat.whatsapp.com/B7GoXsfaWGLJQaqxmYDfON?mode=gi_t' },
  { id: 'm4', nome_grupo: 'Vagas CLT, Estágio, PJ - Araçoiaba', descricao_grupo: 'Vagas fixas e estágios em Araçoiaba', vinculo: 'CLT', categoria: 'Geral', cidade: 'Araçoiaba da Serra', total_participantes: 120, link_convite: 'https://chat.whatsapp.com/CZvybKFy9cI0PkqkkdcCLX' },
  { id: 'm5', nome_grupo: 'Vagas Freelancer - Geral', descricao_grupo: 'Trabalhos rápidos, bicos e diárias', vinculo: 'FREELANCE', categoria: 'Geral', cidade: 'Região', total_participantes: 200, link_convite: 'https://chat.whatsapp.com/BF5ttx54CX45SQxr61wmbH' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ autoOpenLogin = false }) => {
  const navigate = useNavigate();
  const [landingMode, setLandingMode] = useState<'EMP' | 'CAND'>('CAND');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Floating WhatsApp Group Button States
  const [showFloatingWa, setShowFloatingWa] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [whatsappTabAction, setWhatsappTabAction] = useState<'VER' | 'ANUNCIAR'>('VER');

  // Employer Group Guide States
  const [isEmpGroupGuideOpen, setIsEmpGroupGuideOpen] = useState(false);
  const [empGroupGuideStep, setEmpGroupGuideStep] = useState(1);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupSearch, setGroupSearch] = useState('');

  // Waitlist States
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistWhatsapp, setWaitlistWhatsapp] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // New Group Funnel States
  const [isFunnelModalOpen, setIsFunnelModalOpen] = useState(false);
  const [funnelGroupLink, setFunnelGroupLink] = useState('');
  const [funnelGroupCity, setFunnelGroupCity] = useState('');
  const [funnelGroupName, setFunnelGroupName] = useState('');

  // Floating WhatsApp Group Button States
  React.useEffect(() => {
    if (landingMode === 'EMP') {
      const timer = setTimeout(() => setShowFloatingWa(true), 6000);
      return () => clearTimeout(timer);
    } else {
      setShowFloatingWa(false);
    }
  }, [landingMode]);



  const [selectedGroupVinculo, setSelectedGroupVinculo] = useState<'CLT' | 'FREELANCE' | null>('CLT'); // Default to CLT
  const [selectedGroup, setSelectedGroup] = useState<Grupo | null>(null);

  // Fetch Groups
  React.useEffect(() => {
    const fetchGroups = async () => {
      try {
        setGroupsLoading(true);
        const { data, error } = await supabase
          .from('grupos')
          .select('*')
          .eq('vinculo', selectedGroupVinculo)
          .order('nome_grupo', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setGrupos(data);
        } else {
          // Fallback to MOCK_GRUPOS if database is empty
          setGrupos(MOCK_GRUPOS.filter(g => g.vinculo === selectedGroupVinculo));
        }
      } catch (err) {
        console.error("Error fetching groups:", err);
        // Fallback on error
        setGrupos(MOCK_GRUPOS.filter(g => g.vinculo === selectedGroupVinculo));
      } finally {
        setGroupsLoading(false);
      }
    };

    fetchGroups();
  }, [selectedGroupVinculo]);

  const filteredGroups = grupos.filter(g => {
    if (groupSearch.trim() === '') return true;
    const q = groupSearch.toLowerCase();
    return (
      g.nome_grupo?.toLowerCase().includes(q) ||
      g.cidade?.toLowerCase().includes(q) ||
      g.descricao_grupo?.toLowerCase().includes(q)
    );
  });


  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleContactPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, '');
    let charCode = numbers.length;
    if (numbers.length > 11) charCode = 11;
    const numeric = numbers.slice(0, charCode);
    let formatted = numeric;
    if (numeric.length > 2) formatted = `(${numeric.slice(0, 2)}) ${numeric.slice(2)}`;
    if (numeric.length > 7) formatted = `(${numeric.slice(0, 2)}) ${numeric.slice(2, 7)}-${numeric.slice(7)}`;
    setContactPhone(formatted);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage || !contactPhone) {
      alert("Preencha todos os campos.");
      return;
    }
    setContactLoading(true);
    try {
      await supabase.rpc('registrar_lead', {
        p_name: contactName,
        p_email: contactEmail,
        p_phone: contactPhone,
        p_message: contactMessage,
        p_type: 'Contact Form'
      });

      setContactSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setContactLoading(false);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistName || !waitlistWhatsapp || !waitlistEmail) {
      alert("por favor, preencha todos os campos.");
      return;
    }
    setWaitlistLoading(true);
    try {
      const { error } = await supabase
        .schema('captura')
        .from('leads')
        .insert([{
          nome: waitlistName.toLowerCase(),
          whatsapp: waitlistWhatsapp,
          telefone: waitlistWhatsapp,
          email: waitlistEmail.toLowerCase(),
          fonte: 'empresa',
          tipo: 'comum'
        }]);

      if (error) throw error;

      setWaitlistSuccess(true);
      setWaitlistName('');
      setWaitlistWhatsapp('');
      setWaitlistEmail('');
    } catch (error) {
      console.error(error);
      alert("erro ao entrar na lista. tente novamente.");
    } finally {
      setWaitlistLoading(false);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const benefits = [
    { title: 'Envios em massa', desc: 'Dispare suas vagas para centenas de grupos simultaneamente.', icon: <Megaphone className="text-yellow-400" size={24} /> },
    { title: 'Programar envios', desc: 'Agende o dia e horário que suas vagas devem ser postadas.', icon: <Clock className="text-yellow-400" size={24} /> },
    { title: 'Gestão de vagas', desc: 'Interface intuitiva para criar e organizar seus anúncios.', icon: <Briefcase className="text-yellow-400" size={24} /> },
    { title: 'Pastas por empresa', desc: 'Organize tudo por clientes ou setores de forma profissional.', icon: <FolderIcon className="text-yellow-400" size={24} /> },
    { title: 'Gestão dos grupos', desc: 'Controle total sobre as comunidades do seu WhatsApp.', icon: <Users className="text-yellow-400" size={24} /> },
    { title: 'Suporte rápido', desc: 'Time especializado pronto para te ajudar a qualquer momento.', icon: <LifeBuoy className="text-yellow-400" size={24} /> },
  ];

  return (
    <div id="home" className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden pt-20">
      {/* Header - Fixed on top */}
      <header className="h-20 bg-blue-950 fixed top-0 left-0 w-full z-50 px-6 md:px-12 flex items-center justify-between shadow-xl">
        <div className="flex-1"></div>

        <div className="flex bg-blue-900/50 p-1 rounded-xl backdrop-blur-sm border border-blue-800/50">
          <button
            onClick={() => setLandingMode('CAND')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${landingMode === 'CAND' ? 'bg-yellow-400 text-blue-950 shadow-lg' : 'text-blue-300 hover:text-white'}`}
          >
            Modo Candidato
          </button>
          <button
            onClick={() => setLandingMode('EMP')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${landingMode === 'EMP' ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-300 hover:text-white'}`}
          >
            Modo Empresa
          </button>
        </div>

        <div className="flex-1 flex justify-end">
        </div>
      </header>

      {/* Hero Section */}
      {
        landingMode === 'EMP' ? (
          <>
            <section className="flex flex-col lg:flex-row items-center justify-center px-6 md:px-12 lg:px-24 py-12 lg:py-20 gap-16 max-w-7xl mx-auto w-full relative">
              <div className="flex-1 space-y-8 text-center lg:text-left animate-fadeIn">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[11px] font-bold uppercase tracking-widest border border-blue-200">
                  <Zap size={14} className="animate-pulse" /> novidade a caminho
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-blue-950 leading-[1.05] tracking-tight">
                  o futuro do <span className="text-blue-600">recrutamento</span> está chegando.
                </h2>
                <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  estamos construindo a plataforma mais inteligente para gestão de vagas e automação de grupos do brasil.
                  <span className="block mt-4 text-blue-950 font-bold">inscrições abertas para o acesso antecipado.</span>
                </p>
                <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start pt-4">
                  <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <WhatsAppIcon size={24} className="text-green-500" />
                    <span className="text-sm font-bold text-slate-700">fichas automatizadas</span>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <CheckCircle2 size={24} className="text-blue-600" />
                    <span className="text-sm font-bold text-slate-700">disparos em massa</span>
                  </div>
                </div>
              </div>

              {/* Waitlist Form Card */}
              <div className="w-full max-w-md animate-scaleUp">
                <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-3xl shadow-blue-900/10 border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>

                  <div className="relative z-10">
                    {waitlistSuccess ? (
                      <div className="text-center py-8 space-y-6">
                        <div className="w-20 h-20 bg-green-500 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-green-500/20 rotate-3 animate-bounce">
                          <CheckCircle2 size={40} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black text-blue-950">você está na lista!</h3>
                          <p className="text-slate-500 font-medium">você será o primeiro a saber quando liberarmos as novas funcionalidades.</p>
                        </div>
                        <button
                          onClick={() => setWaitlistSuccess(false)}
                          className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all font-sans"
                        >
                          voltar
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-center lg:text-left mb-8">
                          <h3 className="text-2xl font-black text-blue-950 mb-2">lista de espera</h3>
                          <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            entre para o grupo exclusivo e receba acesso antecipado às ferramentas de automação.
                          </p>
                        </div>

                        <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">nome completo</label>
                            <div className="relative">
                              <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                              <input
                                required
                                type="text"
                                value={waitlistName}
                                onChange={e => setWaitlistName(e.target.value)}
                                placeholder="nome da sua empresa ou seu nome"
                                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:ring-4 ring-blue-500/10 transition-all text-slate-800 placeholder:font-normal"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">whatsapp</label>
                            <div className="relative">
                              <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                              <input
                                required
                                type="text"
                                value={waitlistWhatsapp}
                                onChange={e => {
                                  const raw = e.target.value.replace(/\D/g, '');
                                  let formatted = raw;
                                  if (raw.length > 2) formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
                                  if (raw.length > 7) formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7, 11)}`;
                                  setWaitlistWhatsapp(formatted);
                                }}
                                placeholder="(00) 00000-0000"
                                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:ring-4 ring-blue-500/10 transition-all text-slate-800 placeholder:font-normal"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">e-mail corporativo</label>
                            <div className="relative">
                              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                              <input
                                required
                                type="email"
                                value={waitlistEmail}
                                onChange={e => setWaitlistEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:ring-4 ring-blue-500/10 transition-all text-slate-800 placeholder:font-normal"
                              />
                            </div>
                          </div>

                          <button
                            disabled={waitlistLoading}
                            type="submit"
                            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-70 font-sans"
                          >
                            {waitlistLoading ? 'processando...' : (<>garantir acesso antecipado <ArrowRight size={18} /></>)}
                          </button>

                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section id="beneficios" className="bg-white py-12 px-6 md:px-12 lg:px-24">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-bold text-blue-950 mb-2">Potencialize sua Gestão</h3>
                  <p className="text-slate-500 font-medium text-base">Tudo o que você precisa para dominar o recrutamento digital.</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                  {benefits.map((b, i) => (
                    <div key={i} className="p-4 md:p-8 bg-blue-950 rounded-[2rem] md:rounded-[2.5rem] border border-blue-900 hover:scale-[1.02] transition-all group flex flex-col items-center text-center shadow-2xl shadow-blue-950/20">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-900 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-sm group-hover:bg-blue-800 transition-colors">
                        {React.cloneElement(b.icon as React.ReactElement, { className: "w-5 h-5 md:w-6 md:h-6" })}
                      </div>
                      <h4 className="text-sm md:text-lg font-bold text-white mb-1 md:mb-2 leading-tight">{b.title}</h4>
                      <p className="text-blue-300/70 text-[10px] md:text-sm leading-relaxed font-medium line-clamp-3">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          <CandidateLanding />
        )
      }

      {/* Unified WhatsApp CTA Section (CAND & EMP) */}
      <section id="grupos-whatsapp" className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-[#25D366] border-t border-slate-100">

        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
            <WhatsAppIcon size={40} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl text-white mb-4 font-bold tracking-tight">
            Centenas de vagas diariamente te esperando
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto font-medium">
            Acesse nossos grupos oficiais e confira as melhores oportunidades.
          </p>

          <button
            onClick={() => {
              setWhatsappTabAction('VER');
              setIsGroupModalOpen(true);
            }}
            className="inline-flex items-center gap-3 bg-white text-[#25D366] text-sm px-8 py-3.5 rounded-2xl hover:scale-105 transition-all font-bold shadow-xl shadow-green-900/20 active:scale-95"
          >
            <WhatsAppIcon size={20} />
            Entrar Nos Grupos
          </button>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="bg-blue-950 text-white py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex justify-center">
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="text-blue-300 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
          >
            Fale com a SoroEmpregos
          </button>
        </div>
      </footer>

      {isFunnelModalOpen && (
        <GroupFunnelModal 
          isOpen={isFunnelModalOpen}
          onClose={() => setIsFunnelModalOpen(false)}
          groupLink={funnelGroupLink}
          groupCity={funnelGroupCity}
          groupName={funnelGroupName}
        />
      )}


      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-md" onClick={() => setIsContactModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 md:p-10 animate-scaleUp border border-slate-100">
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>

            <h4 className="text-2xl font-bold text-blue-950 mb-6 text-center">Solicitar contato</h4>

            {contactSuccess ? (
              <div className="text-center py-10 animate-scaleUp">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 size={32} />
                </div>
                <h5 className="text-xl font-bold text-blue-950 mb-2">Mensagem enviada!</h5>
                <p className="text-slate-500 text-sm">Em breve nossa equipe entrará em contato.</p>
                <button
                  onClick={() => { setContactSuccess(false); setContactName(''); setContactEmail(''); setContactPhone(''); setContactMessage(''); }}
                  className="mt-6 text-sm font-bold text-blue-600 hover:text-blue-800"
                >
                  Enviar nova mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 ml-1">Nome</label>
                  <input
                    required
                    type="text"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-3.5 text-sm font-medium outline-none focus:ring-2 ring-blue-500 transition-all text-slate-800 placeholder:font-normal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 ml-1">WhatsApp</label>
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    value={contactPhone}
                    onChange={handleContactPhoneChange}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-3.5 text-sm font-medium outline-none focus:ring-2 ring-blue-500 transition-all text-slate-800 placeholder:font-normal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 ml-1">E-mail</label>
                  <input
                    required
                    type="email"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-3.5 text-sm font-medium outline-none focus:ring-2 ring-blue-500 transition-all text-slate-800 placeholder:font-normal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 ml-1">Mensagem</label>
                  <textarea
                    required
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                    rows={3}
                    placeholder="Como podemos te ajudar?"
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-3.5 text-sm font-semibold outline-none focus:ring-2 ring-blue-500 transition-all resize-none text-slate-800"
                  ></textarea>
                </div>
                <button
                  disabled={contactLoading}
                  type="submit"
                  className="w-full py-4 bg-blue-950 text-white rounded-2xl font-bold text-sm hover:bg-blue-900 shadow-xl shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {contactLoading ? 'Enviando...' : (<>Enviar <Send size={18} /></>)}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Floating WhatsApp Group Button */}
      {showFloatingWa && (
        <div className="fixed bottom-8 right-8 z-[90] flex items-center gap-2 animate-scaleUp">
          <button
            onClick={() => {
              setWhatsappTabAction('ANUNCIAR');
              setIsGroupModalOpen(true);
            }}
            className="bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 animate-pulse-subtle group border border-blue-400/20"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <WhatsAppIcon size={24} />
            </div>
            <span className="font-bold text-sm">Anuncie nos grupos</span>
          </button>

          <button
            onClick={() => setShowFloatingWa(false)}
            className="w-8 h-8 rounded-full bg-slate-900/50 backdrop-blur-md text-white/70 flex items-center justify-center hover:bg-slate-900 transition-colors shadow-lg"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Employer Group Guide Modal */}
      {isEmpGroupGuideOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm" onClick={() => setIsEmpGroupGuideOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-6 md:p-8 flex flex-col font-sans max-h-[90vh] overflow-y-auto animate-scaleUp">
            <button
              onClick={() => {
                setIsEmpGroupGuideOpen(false);
                setTimeout(() => setEmpGroupGuideStep(1), 300);
              }}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
            >
              <X size={24} />
            </button>

            {empGroupGuideStep === 1 && (
              <div className="flex flex-col animate-fadeIn">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 shadow-sm mx-auto">
                  <Megaphone size={32} />
                </div>
                <h4 className="text-2xl font-bold text-blue-950 text-center mb-6 leading-tight">
                  Aviso para empresas
                </h4>
                <div className="text-slate-500 text-sm space-y-4 mb-8">
                  <p>
                    Para garantir a qualidade, <strong>todas as vagas são analisadas</strong>. Elas precisam ter no mínimo a cidade informada, com isso conseguimos filtrar e ajudar você a divulgar a vaga para as pessoas certas.
                  </p>
                  <p className="font-bold text-blue-600 animate-pulse">
                    Não esqueça de adicionar a CIDADE na sua vaga.
                  </p>
                </div>
                <button
                  onClick={() => setEmpGroupGuideStep(2)}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg active:scale-95"
                >
                  Continuar
                </button>
              </div>
            )}

            {empGroupGuideStep === 2 && (
              <div className="flex flex-col animate-fadeIn">
                <button
                  onClick={() => setEmpGroupGuideStep(1)}
                  className="inline-flex items-center gap-1 text-[10px] text-slate-400 mb-4 hover:text-blue-950 transition-colors w-fit"
                >
                  <ChevronLeft size={14} /> Voltar
                </button>
                <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mb-4 text-yellow-600 shadow-sm mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-2xl font-bold text-blue-950 text-center mb-6">
                  Estrutura dos anúncios
                </h4>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-600 space-y-3 mb-8">
                  <div className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /><div><strong>Título:</strong> Nome claro da vaga.</div></div>
                  <div className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /><div><strong>Vínculo:</strong> Se é CLT, PJ ou Freelance.</div></div>
                  <div className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /><div><strong>Cidade:</strong> Onde fica o trabalho.</div></div>
                  <div className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /><div><strong>Requisitos:</strong> O que o candidato precisa ter.</div></div>
                  <div className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /><div><strong>Benefícios:</strong> O que você oferece.</div></div>
                  <div className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /><div><strong>Descrição:</strong> Atividades da rotina.</div></div>
                  <div className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /><div><strong>Saiba mais:</strong> Como e onde enviar o currículo.</div></div>
                </div>

                <button
                  onClick={() => {
                    const url = selectedGroupVinculo === 'CLT' 
                      ? "https://chat.whatsapp.com/Edff6QoH5jtKFfUOUTLgk3?mode=gi_t"
                      : "https://chat.whatsapp.com/BF5ttx54CX45SQxr61wmbH?mode=gi_t";
                    window.open(url, '_blank');
                    setIsEmpGroupGuideOpen(false);
                    setTimeout(() => setEmpGroupGuideStep(1), 300);
                  }}
                  className="w-full py-4 bg-[#25D366] text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors shadow-lg active:scale-95"
                >
                  Entrar no grupo
                </button>
              </div>
            )}


          </div>
        </div>
      )}

      {isGroupModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-950/40" onClick={() => setIsGroupModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-6 md:p-8 flex flex-col font-sans max-h-[90vh]">


            <div className="flex flex-col h-full animate-fadeIn">
                <div className="flex w-full mb-6 gap-2">
                   <button onClick={() => setWhatsappTabAction('VER')} className={`flex-1 py-3 border-b-2 font-bold text-sm transition-colors ${whatsappTabAction === 'VER' ? 'text-yellow-500 border-yellow-500' : 'text-slate-400 border-slate-200 hover:text-slate-600'}`}>Ver Vagas</button>
                   <button onClick={() => setWhatsappTabAction('ANUNCIAR')} className={`flex-1 py-3 border-b-2 font-bold text-sm transition-colors ${whatsappTabAction === 'ANUNCIAR' ? 'text-blue-500 border-blue-500' : 'text-slate-400 border-slate-200 hover:text-slate-600'}`}>Anunciar Vagas</button>
                </div>

                <div className="flex gap-2 mb-6 px-1">
                    <button onClick={() => setSelectedGroupVinculo('CLT')} className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${selectedGroupVinculo === 'CLT' ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}>Vagas CLT</button>
                    <button onClick={() => setSelectedGroupVinculo('FREELANCE')} className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${selectedGroupVinculo === 'FREELANCE' ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}>Freelance</button>
                </div>

                {whatsappTabAction === 'VER' ? (
                   <div className="flex flex-col flex-1 overflow-hidden">
                       <div className="relative mb-4 px-1 shrink-0">
                         <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input
                           type="text"
                           value={groupSearch}
                           onChange={e => setGroupSearch(e.target.value)}
                           placeholder="Pesquisar Cidade..."
                           className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 ring-yellow-500/20 focus:border-yellow-500 transition-all text-slate-800 font-medium"
                         />
                       </div>

                       <div className="flex-1 overflow-y-auto space-y-2 px-1 pb-2">
                         {groupsLoading && filteredGroups.length === 0 ? (
                           <div className="text-center py-10 text-slate-400 text-xs font-medium">Carregando...</div>
                         ) : filteredGroups.length === 0 ? (
                           <div className="text-center py-10 text-slate-400 text-xs font-medium">Nenhum Grupo Encontrado.</div>
                         ) : (
                           <div className={`space-y-2 transition-opacity ${groupsLoading ? 'opacity-50' : 'opacity-100'}`}>
                             {filteredGroups.map(g => (
                               <div key={g.id} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between border border-transparent hover:border-yellow-200 hover:bg-yellow-50/30 transition-colors">
                                 <div className="min-w-0 pr-2">
                                   <p className="text-slate-800 text-sm truncate tracking-tight font-bold">{g.cidade || 'Geral'}</p>
                                 </div>
                                 <button
                                   onClick={() => {
                                     if (g.link_convite) {
                                       setSelectedGroup(g);
                                       setFunnelGroupLink(g.link_convite);
                                       setFunnelGroupCity(g.cidade || '');
                                       setFunnelGroupName(g.nome_grupo || '');
                                       setIsFunnelModalOpen(true);
                                     }
                                   }}
                                   className="shrink-0 px-4 py-2 bg-[#25D366] text-white text-xs rounded-lg hover:bg-green-600 transition-colors shadow-sm active:scale-95 font-bold"
                                 >
                                   Entrar
                                 </button>
                               </div>
                             ))}
                           </div>
                         )}
                       </div>
                   </div>
                ) : (
                   <div className="flex flex-col flex-1 overflow-hidden space-y-3 px-1">
                      {selectedGroupVinculo === 'CLT' ? (
                          <button
                            onClick={() => {
                              setIsGroupModalOpen(false);
                              setEmpGroupGuideStep(1);
                              setIsEmpGroupGuideOpen(true);
                            }}
                            className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/50 transition-all flex items-center justify-between group w-full text-left"
                          >
                            <div>
                               <p className="text-slate-800 font-bold text-sm">Grupo Anúncios CLT</p>
                               <p className="text-slate-500 font-medium text-xs mt-1">Para vagas formais, estágio e PJ.</p>
                            </div>
                            <div
                               className="shrink-0 px-4 py-2 bg-[#25D366] text-white text-xs rounded-lg hover:bg-green-600 transition-colors shadow-sm active:scale-95 font-bold uppercase"
                            >
                               Entrar
                            </div>
                          </button>
                      ) : (
                          <button
                            onClick={() => {
                              setIsGroupModalOpen(false);
                              setEmpGroupGuideStep(1);
                              setIsEmpGroupGuideOpen(true);
                            }}
                            className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/50 transition-all flex items-center justify-between group w-full text-left"
                          >
                            <div>
                               <p className="text-slate-800 font-bold text-sm">Grupo Anúncios Freelance</p>
                               <p className="text-slate-500 font-medium text-xs mt-1">Para oportunidades rápidas e bicos.</p>
                            </div>
                            <div
                               className="shrink-0 px-4 py-2 bg-[#25D366] text-white text-xs rounded-lg hover:bg-green-600 transition-colors shadow-sm active:scale-95 font-bold uppercase"
                            >
                               Entrar
                            </div>
                          </button>
                      )}
                   </div>
                )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
