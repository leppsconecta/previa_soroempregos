import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  Copy,
  Check,
  X,
  Mail,
  MapPin,
  Rocket,
  ChevronDown,
  User,
  Phone,
  ArrowRight,
  CheckCircle,
  MessageCircle
} from 'lucide-react';
import { InputMask } from '@react-input/mask';
import { OfficialWhatsAppIcon } from '../../ui/OfficialWhatsAppIcon';
import { supabaseCaptura } from '../../../lib/supabase';

interface MarketingFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobCode?: string;
  ctaContato?: string;
  ctaEmail?: string;
  ctaLink?: string;
  ctaEndereco?: string;
  ctaObservationsWhatsapp?: string;
  ctaObservationsEmail?: string;
  ctaObservationsLink?: string;
  ctaObservationsEndereco?: string;
  jobLocation?: string;
  jobPostedAt?: string;
  advertiserName?: string;
}

type Step = 'loading' | 'phone_check' | 'info' | 'region' | 'success';

const inferZona = (bairro: string, cidade: string): string => {
  const cityLower = cidade.toLowerCase();
  if (!cityLower.includes('sorocaba')) return '';

  const bairroLower = bairro.toLowerCase();
  if (bairroLower.includes('norte') || bairroLower.includes('itavuvu') || bairroLower.includes('ipanema') || bairroLower.includes('laranjeiras') || bairroLower.includes('herbert') || bairroLower.includes('são guilherme')) {
    return 'Zona Norte';
  }
  if (bairroLower.includes('sul') || bairroLower.includes('campolim') || bairroLower.includes('vergueiro') || bairroLower.includes('santa rosalia') || bairroLower.includes('mangueiral') || bairroLower.includes('cerrado')) {
    return 'Zona Sul';
  }
  if (bairroLower.includes('oeste') || bairroLower.includes('wanel') || bairroLower.includes('júlio de mesquita') || bairroLower.includes('general carneiro')) {
    return 'Zona Oeste';
  }
  if (bairroLower.includes('leste') || bairroLower.includes('brigadeiro') || bairroLower.includes('nogueira') || bairroLower.includes('industrial') || bairroLower.includes('haras') || bairroLower.includes('árvores')) {
    return 'Zona Leste';
  }
  if (bairroLower.includes('centro')) {
    return 'Centro';
  }
  return '';
};

const sanitizeAndFormatPhone = (phone: string): { clean: string; formatted: string } => {
  let clean = phone.replace(/\D/g, '');
  
  if (clean.startsWith('55') && clean.length > 11) {
    clean = clean.slice(2);
  }
  
  if (clean.startsWith('0')) {
    clean = clean.replace(/^0+/, '');
  }
  
  return {
    clean,
    formatted: clean ? `55${clean}` : '',
  };
};

const ensureAbsoluteUrl = (url?: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^(https?:)?\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export const MarketingFunnelModal: React.FC<MarketingFunnelModalProps> = ({
  isOpen,
  onClose,
  jobTitle,
  jobCode,
  ctaContato,
  ctaEmail,
  ctaLink,
  ctaEndereco,
  ctaObservationsWhatsapp,
  ctaObservationsEmail,
  ctaObservationsLink,
  ctaObservationsEndereco,
  jobLocation,
  jobPostedAt,
  advertiserName
}) => {
  const [step, setStep] = useState<Step>('loading');
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    sexo: '',
    cep: '',
    regiao: '',
    cidade: '',
  });
  const [bairro, setBairro] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
  const [error, setError] = useState('');
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [isExistingLead, setIsExistingLead] = useState(false);

  const [copied, setCopied] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  // Controle de rate limit local
  const [lastPhoneRequestTime, setLastPhoneRequestTime] = useState(0);
  const [lastCepRequestTime, setLastCepRequestTime] = useState(0);

  // Carrega telefone do cache ou inicia fluxo de verificação
  useEffect(() => {
    if (!isOpen) return;

    setError('');
    setIsExistingLead(false);
    setBairro('');
    setLastPhoneRequestTime(0);
    setLastCepRequestTime(0);

    const cachedPhone = localStorage.getItem('soroempregos_cached_phone') || '';
    if (cachedPhone) {
      setStep('loading');
      setFormData({
        nome: '',
        telefone: cachedPhone,
        email: '',
        sexo: '',
        cep: '',
        regiao: '',
        cidade: '',
      });

      const verifyCachedPhone = async () => {
        setCheckingPhone(true);
        const { formatted } = sanitizeAndFormatPhone(cachedPhone);
        try {
          const { data, error: fetchError } = await supabaseCaptura
            .schema('soroempregos')
            .from('usuarios_grupos')
            .select('id')
            .eq('whatsapp', formatted)
            .maybeSingle();

          if (!fetchError && data) {
            setIsExistingLead(true);
            setStep('success');
          } else {
            setStep('phone_check');
          }
        } catch (e) {
          setStep('phone_check');
        } finally {
          setCheckingPhone(false);
        }
      };

      verifyCachedPhone();
    } else {
      setStep('phone_check');
      setFormData({
        nome: '',
        telefone: '',
        email: '',
        sexo: '',
        cep: '',
        regiao: '',
        cidade: '',
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const checkVisible = (val?: string) => {
    if (!val) return false;
    const lower = val.toLowerCase().trim();
    return !['não mencionado', 'nao mencionado'].includes(lower);
  };

  const hasPhone = checkVisible(ctaContato);
  const hasEmail = checkVisible(ctaEmail);
  const hasLink = checkVisible(ctaLink);
  const hasEndereco = checkVisible(ctaEndereco);

  const getCtaInstructions = () => {
    const active = [];
    if (hasPhone) active.push('whatsapp');
    if (hasEmail) active.push('email');
    if (hasLink) active.push('link');
    if (hasEndereco) active.push('address');

    if (active.length > 1) {
      return {
        title: 'Como deseja se candidatar?',
        subtitle: 'Escolha uma das opções abaixo para enviar seu currículo.'
      };
    }

    if (active[0] === 'whatsapp') {
      return {
        title: 'Envie seu currículo via WhatsApp',
        subtitle: 'Clique no botão abaixo para iniciar a conversa.'
      };
    }

    if (active[0] === 'email') {
      return {
        title: 'Envie seu currículo por e-mail',
        subtitle: 'Copie o e-mail ou envie diretamente o seu currículo.'
      };
    }

    if (active[0] === 'link') {
      return {
        title: 'Candidate-se pelo site oficial',
        subtitle: 'Clique no botão abaixo para acessar a página de candidatura.'
      };
    }

    if (active[0] === 'address') {
      return {
        title: 'Compareça ao local de seleção',
        subtitle: 'Veja o endereço abaixo para entrega de currículo ou entrevista.'
      };
    }

    return {
      title: 'Como se candidatar?',
      subtitle: 'Escolha um dos canais disponíveis abaixo.'
    };
  };

  const { title: ctaTitle, subtitle: ctaSubtitle } = getCtaInstructions();

  // CTA Priority Logic
  const allAvailable = [
    { type: 'whatsapp', exists: hasPhone },
    { type: 'email', exists: hasEmail },
    { type: 'address', exists: hasEndereco },
    { type: 'link', exists: hasLink },
  ].filter(c => c.exists);

  const primaryCTA = allAvailable[0]?.type || null;
  const secondaryCTAs = allAvailable.slice(1);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanPhone = (phone?: string): string => {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('55') && (cleaned.length === 12 || cleaned.length === 13)) {
      cleaned = cleaned.substring(2);
    }
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    return cleaned;
  };

  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return '';
    const cleaned = cleanPhone(phone);
    if (cleaned.length === 11) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
    }
    return phone;
  };

  const normalizeWhatsAppNumber = (num: string) => {
    const cleaned = cleanPhone(num);
    if (cleaned.length > 0) {
      return '55' + cleaned;
    }
    return '';
  };

  const cleanAdvertiserName = advertiserName?.replace('@s.whatsapp.net', '') || '';

  // Primeiro passo: verificação do telefone ao submeter o formulário (com Rate Limit)
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Rate limiting: mínimo de 2 segundos entre envios
    const now = Date.now();
    if (now - lastPhoneRequestTime < 2000) {
      setError('Por favor, aguarde um momento antes de realizar outra verificação.');
      return;
    }
    setLastPhoneRequestTime(now);

    const { clean, formatted } = sanitizeAndFormatPhone(formData.telefone);
    if (clean.length < 10 || clean.length > 11) {
      setError('Por favor, insira um telefone válido com DDD.');
      return;
    }

    setCheckingPhone(true);
    try {
      const { data, error: fetchError } = await supabaseCaptura
        .schema('soroempregos')
        .from('usuarios_grupos')
        .select('id')
        .eq('whatsapp', formatted)
        .maybeSingle();

      if (fetchError) {
        console.error('Erro ao verificar telefone:', fetchError);
        setError(`Erro de conexão com o banco de dados: ${fetchError.message || 'Por favor, tente novamente.'}`);
        return;
      }

      if (data) {
        localStorage.setItem('soroempregos_cached_phone', formatted);
        setIsExistingLead(true);
        setStep('success');
      } else {
        setIsExistingLead(false);
        setStep('info');
      }
    } catch (err: any) {
      console.error('Erro ao realizar busca silenciosa:', err);
      setError(`Erro inesperado: ${err.message || 'Verifique sua conexão.'}`);
    } finally {
      setCheckingPhone(false);
    }
  };

  // Segundo passo: validação dos dados de cadastro (nome, sexo, e-mail)
  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const firstName = formData.nome.trim();
    if (!firstName) {
      setError('Por favor, digite seu nome.');
      return;
    }

    if (!formData.sexo) {
      setError('Por favor, selecione seu sexo.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    setStep('region');
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, cep: value }));
    setError('');
    
    const cleanCep = value.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      // Rate limit CEP: mínimo de 2 segundos entre pesquisas de CEP
      const now = Date.now();
      if (now - lastCepRequestTime < 2000) {
        setError('Por favor, aguarde um momento antes de buscar outro CEP.');
        return;
      }
      setLastCepRequestTime(now);

      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (data.erro) {
          setError('CEP não encontrado.');
          setBairro('');
        } else {
          setBairro(data.bairro || 'Centro / Geral');
          setFormData((prev) => ({
            ...prev,
            regiao: `${data.bairro || 'Centro'} - ${data.localidade || ''}`,
            cidade: data.localidade || '',
          }));
        }
      } catch (err) {
        setError('Erro ao buscar o CEP. Verifique sua conexão.');
        setBairro('');
      } finally {
        setLoadingCep(false);
      }
    } else {
      setBairro('');
    }
  };

  // Terceiro passo: confirmação da região e envio dos dados ao banco
  const handleRegionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bairro) {
      setError('Por favor, informe um CEP válido para continuar.');
      return;
    }

    setLoadingCep(true);
    setError('');

    try {
      const { formatted } = sanitizeAndFormatPhone(formData.telefone);
      const cleanCep = formData.cep.replace(/\D/g, '');

      // Salva o cadastro completo no banco de dados
      const currentCity = formData.cidade || jobLocation || 'Sorocaba';
      const zonaCalculada = inferZona(bairro, currentCity);

      const { error: upsertError } = await supabaseCaptura
        .schema('soroempregos')
        .from('usuarios_grupos')
        .upsert({
          nome: formData.nome,
          whatsapp: formatted,
          email: formData.email,
          sexo: formData.sexo,
          cep: cleanCep,
          cidade: currentCity,
          bairro: bairro,
          zona: zonaCalculada,
          grupos: [], // Vagas não dependem de grupo específico
        }, {
          onConflict: 'whatsapp'
        });

      if (upsertError) {
        console.error('Erro no salvamento final do usuário:', upsertError);
        throw new Error(`Erro ao salvar dados no banco: ${upsertError.message || 'Erro de conexão.'}`);
      }

      localStorage.setItem('soroempregos_cached_phone', formatted);
      setStep('success');
    } catch (err: any) {
      console.error('Erro ao salvar lead:', err);
      setError('Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.');
    } finally {
      setLoadingCep(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans overflow-hidden">
      {/* Immersive Background Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <AnimatePresence>
        <motion.div
          key="cta-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.4)] max-h-[90vh] flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <div className="flex items-center gap-2 pl-2">
              {step !== 'success' ? (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                    Autenticação
                  </span>
                </>
              ) : null}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-200 rounded-full text-zinc-400 transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          <div ref={modalScrollRef} className="overflow-y-auto w-full p-6 md:p-8 flex flex-col items-center">
            {step === 'loading' && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-500 text-sm font-bold animate-pulse">Carregando...</p>
              </div>
            )}

            {step === 'phone_check' && (
              <form onSubmit={handlePhoneSubmit} className="w-full space-y-5">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-zinc-950">Visualizar contatos</h3>
                  <p className="text-zinc-500 text-sm mt-1">
                    Digite seu número de WhatsApp para ter acesso aos canais de candidatura da vaga <strong className="font-extrabold">{jobTitle}</strong>.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-zinc-500 ml-1">WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                      <InputMask
                        mask="(__) _____-____"
                        replacement={{ _: /\d/ }}
                        type="text"
                        required
                        placeholder="(15) 99999-9999"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-800 font-medium"
                      />
                    </div>
                    <p className="text-[11px] text-zinc-400 ml-1 mt-1">
                      Verifique se o número possui o 9º dígito
                    </p>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-bold text-center mt-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={checkingPhone}
                  className="w-full py-3.5 text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-blue-500/10 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span>{checkingPhone ? 'Verificando...' : 'Visualizar contatos'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {step === 'info' && (
              <form onSubmit={handleInfoSubmit} className="w-full space-y-5">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-zinc-950">Quase lá!</h3>
                  <p className="text-zinc-500 text-sm mt-1">
                    Preencha seus dados de candidato para liberar o contato da vaga.
                  </p>
                </div>

                <div className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Primeiro nome</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                      <input
                        type="text"
                        required
                        placeholder="Seu primeiro nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Sexo</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all select-none ${
                        formData.sexo === 'Masculino' 
                          ? 'border-blue-500 bg-blue-50/30' 
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
                      }`}>
                        <span className="text-sm font-medium text-slate-800">Masculino</span>
                        <input
                          type="checkbox"
                          name="sexo"
                          checked={formData.sexo === 'Masculino'}
                          onChange={() => setFormData({ ...formData, sexo: formData.sexo === 'Masculino' ? '' : 'Masculino' })}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </label>
                      <label className={`flex-1 flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all select-none ${
                        formData.sexo === 'Feminino' 
                          ? 'border-blue-500 bg-blue-50/30' 
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
                      }`}>
                        <span className="text-sm font-medium text-slate-800">Feminino</span>
                        <input
                          type="checkbox"
                          name="sexo"
                          checked={formData.sexo === 'Feminino'}
                          onChange={() => setFormData({ ...formData, sexo: formData.sexo === 'Feminino' ? '' : 'Feminino' })}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 ml-1">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                      <input
                        type="email"
                        required
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-bold text-center mt-2">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-blue-500/10"
                >
                  <span>Continuar</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {step === 'region' && (
              <form onSubmit={handleRegionSubmit} className="w-full space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-zinc-950">Estamos quase lá!</h3>
                  <p className="text-slate-500 text-sm mt-2">
                    Informe seu CEP para localizarmos sua região.
                  </p>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-zinc-500 ml-1">Insira seu CEP</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                    <InputMask
                      mask="_____-___"
                      replacement={{ _: /\d/ }}
                      type="text"
                      required
                      placeholder="00000-000"
                      value={formData.cep}
                      onChange={handleCepChange}
                      className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                    />
                  </div>
                </div>

                {loadingCep && (
                  <div className="text-center py-2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Buscando endereço...</p>
                  </div>
                )}

                {bairro && (
                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 text-center animate-fadeIn">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold block mb-1">Bairro identificado</span>
                    <span className="text-sm text-zinc-800 font-bold">{bairro}</span>
                  </div>
                )}

                {error && (
                  <p className="text-red-500 text-xs font-bold text-center">{error}</p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('info');
                      setError('');
                    }}
                    className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl font-bold text-xs transition-colors text-center"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={!bairro || loadingCep}
                    className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-center"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            )}

            {step === 'success' && (
              <div className="w-full text-center flex flex-col items-center">
                <div className="mb-6 w-full">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                    <Briefcase size={12} />
                    Informações da vaga
                  </div>

                  <h3 className="text-2xl font-black text-zinc-950 mb-2 leading-tight tracking-tight px-2">
                    {jobTitle}
                  </h3>

                  <div className="flex items-center justify-center gap-3 text-zinc-500 text-xs font-medium">
                    <span className="capitalize">{jobLocation}</span>
                    {jobPostedAt && (
                      <>
                        <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                        <span>{jobPostedAt}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="w-full space-y-6 pt-6 border-t border-zinc-100">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-zinc-950">{ctaTitle}</h4>
                    <p className="text-xs text-zinc-400">{ctaSubtitle}</p>
                  </div>

                  <div className="w-full space-y-4">
                    {hasPhone && (
                      <div className="w-full space-y-3">
                        <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex flex-col gap-3 transition-all hover:border-blue-200">
                          {ctaObservationsWhatsapp && (
                            <p className="text-[11px] text-zinc-600 whitespace-pre-line leading-relaxed lowercase first-letter:uppercase pb-2 border-b border-zinc-200/50">
                              {ctaObservationsWhatsapp}
                            </p>
                          )}
                          <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-zinc-100 shrink-0">
                              <OfficialWhatsAppIcon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">WhatsApp</p>
                              <p className="text-zinc-900 font-black text-xl select-text tracking-tight truncate leading-none">
                                {formatPhoneNumber(ctaContato)}
                              </p>
                            </div>
                            <button
                              onClick={() => handleCopy(ctaContato || '')}
                              className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-400 transition-all active:scale-90 shrink-0"
                            >
                              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            </button>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setShowWhatsappModal(true);
                            }}
                            className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-black px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-100 text-sm mt-2"
                          >
                            <OfficialWhatsAppIcon size={20} />
                            <span>Enviar currículo agora</span>
                          </motion.button>
                          <p className="text-[11px] text-zinc-400 text-center mt-1 font-semibold">
                            Verifique se o contato possui o 9º dígito
                          </p>
                        </div>
                      </div>
                    )}

                    {hasEmail && (
                      <div className="w-full space-y-3">
                        <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex flex-col gap-3 transition-all hover:border-blue-200">
                          {ctaObservationsEmail && (
                            <p className="text-[11px] text-zinc-600 whitespace-pre-line leading-relaxed lowercase first-letter:uppercase pb-2 border-b border-zinc-200/50">
                              {ctaObservationsEmail}
                            </p>
                          )}
                          <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-zinc-100 shrink-0">
                              <Mail className="text-blue-500" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">E-mail</p>
                              <p className="text-zinc-800 font-bold text-sm select-text truncate">
                                {ctaEmail}
                              </p>
                            </div>
                            <button onClick={() => handleCopy(ctaEmail || '')} className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-400 shrink-0">
                              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              if (isTransitioning) return;
                              setIsTransitioning(true);
                              handleCopy(ctaEmail || '');
                              setTimeout(() => setIsTransitioning(false), 2000);
                            }}
                            disabled={isTransitioning}
                            className="w-full h-14 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/10 disabled:opacity-50 mt-2"
                          >
                            {copied ? 'Copiado!' : 'Copiar e-mail'}
                            <Copy size={18} className="group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </div>
                    )}

                    {hasEndereco && (
                      <div className="w-full space-y-3">
                        <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex flex-col gap-3 transition-all hover:border-blue-200">
                          {ctaObservationsEndereco && (
                            <p className="text-[11px] text-zinc-600 whitespace-pre-line leading-relaxed lowercase first-letter:uppercase pb-2 border-b border-zinc-200/50">
                              {ctaObservationsEndereco}
                            </p>
                          )}
                          <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-zinc-100 shrink-0">
                              <MapPin className="text-red-500" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">Endereço</p>
                              <p className="text-zinc-800 font-bold text-[11px] select-text leading-tight line-clamp-2">
                                {ctaEndereco}
                              </p>
                            </div>
                            <button onClick={() => handleCopy(ctaEndereco || '')} className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-400 shrink-0">
                              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              if (isTransitioning) return;
                              setIsTransitioning(true);
                              window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ctaEndereco || '')}`, '_blank');
                              setTimeout(() => setIsTransitioning(false), 2000);
                            }}
                            disabled={isTransitioning}
                            className="w-full h-14 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/10 disabled:opacity-50 mt-2"
                          >
                            <MapPin size={20} className="group-hover:scale-110 transition-transform" />
                            <span>Abrir mapa</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {hasLink && (
                      <div className="w-full space-y-3">
                        <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex flex-col gap-3 hover:border-blue-200">
                          {ctaObservationsLink && (
                            <p className="text-[11px] text-zinc-600 whitespace-pre-line leading-relaxed lowercase first-letter:uppercase pb-2 border-b border-zinc-200/50">
                              {ctaObservationsLink}
                            </p>
                          )}
                          <button
                            onClick={() => {
                              if (isTransitioning) return;
                              setIsTransitioning(true);
                              window.open(ensureAbsoluteUrl(ctaLink), '_blank');
                              setTimeout(() => setIsTransitioning(false), 2000);
                            }}
                            disabled={isTransitioning}
                            className="w-full h-14 bg-zinc-900 text-white font-black px-8 rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl text-sm disabled:opacity-50"
                          >
                            <Rocket size={20} />
                            <span>Abrir link de candidatura</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {advertiserName && (
                  <p className="text-zinc-400 text-[10px] font-semibold tracking-widest pt-8">
                    Vaga anunciada por {cleanAdvertiserName}
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* WhatsApp Options Modal Overlay */}
      <AnimatePresence>
        {showWhatsappModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowWhatsappModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 flex flex-col items-center text-center gap-5"
            >
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                <OfficialWhatsAppIcon size={24} />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-zinc-900">Contato por WhatsApp</h4>
                <p className="text-xs text-zinc-400">Escolha como deseja prosseguir com o número {formatPhoneNumber(ctaContato)}:</p>
              </div>

              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={() => {
                    const msg = `Olá, tudo bem ?\nvi esta vaga na soroempregos.com.br\n—————————————\nFunção: *${jobTitle}*\nCódigo: *${jobCode || '---'}*\n--------------------------\n\nPosso enviar o currículo aqui mesmo ou tem outro canal para envio ?`;
                    const encodedMsg = encodeURIComponent(msg);
                    const phone = normalizeWhatsAppNumber(ctaContato || '');
                    window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
                    setShowWhatsappModal(false);
                  }}
                  className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-xs"
                >
                  <MessageCircle size={16} />
                  <span>Enviar mensagem no WhatsApp</span>
                </button>
                <p className="text-[11px] text-zinc-400 text-center font-semibold">
                  Verifique se o contato possui o 9º dígito
                </p>

                <button
                  onClick={() => {
                    handleCopy(ctaContato || '');
                    setShowWhatsappModal(false);
                  }}
                  className="w-full h-12 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-xs"
                >
                  <Copy size={16} />
                  <span>Copiar número de telefone</span>
                </button>

                <button
                  onClick={() => setShowWhatsappModal(false)}
                  className="w-full h-10 text-zinc-400 hover:text-zinc-600 font-bold transition-all text-[11px] uppercase tracking-wider mt-1"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
