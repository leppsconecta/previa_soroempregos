import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, CheckCircle, MapPin, ArrowRight } from 'lucide-react';
import { InputMask } from '@react-input/mask';
import { supabaseCaptura } from '../../../lib/supabase';

interface GroupAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupLink: string;
  groupCity: string;
  groupName: string;
  groupId: string;
}

type Step = 'info' | 'region' | 'success';

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

export const GroupAccessModal: React.FC<GroupAccessModalProps> = ({
  isOpen,
  onClose,
  groupLink,
  groupCity,
  groupName,
  groupId,
}) => {
  const cityName = groupCity || 'sua cidade';
  const [step, setStep] = useState<Step>('info');
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
  const [isPhoneChecked, setIsPhoneChecked] = useState(false);
  const [checkedPhoneValue, setCheckedPhoneValue] = useState('');
  const [isExistingLead, setIsExistingLead] = useState(false);

  // Busca silenciosa pelo telefone
  useEffect(() => {
    const { clean, formatted } = sanitizeAndFormatPhone(formData.telefone);
    
    // Se mudou o telefone em relação ao último verificado, reseta as flags
    if (formatted !== checkedPhoneValue) {
      setIsPhoneChecked(false);
      setIsExistingLead(false);
    }

    if ((clean.length === 10 || clean.length === 11) && step !== 'success') {
      if (formatted === checkedPhoneValue) return;

      const checkExistingLead = async () => {
        setCheckingPhone(true);
        setError('');
        try {
          const { data, error: fetchError } = await supabaseCaptura
            .schema('soroempregos')
            .from('usuarios_grupos')
            .select('grupos')
            .eq('whatsapp', formatted)
            .maybeSingle();

          if (fetchError) {
            console.error('Erro na busca silenciosa do lead:', fetchError);
            setError(`Erro de conexão com o banco de dados: ${fetchError.message || 'Por favor, tente novamente.'}`);
            setCheckingPhone(false);
            return;
          }

          if (data) {
            let groupList: string[] = Array.isArray(data.grupos) ? (data.grupos as string[]) : [];
            if (groupId && !groupList.includes(groupId)) {
              groupList.push(groupId);
              const { error: updateError } = await supabaseCaptura
                .schema('soroempregos')
                .from('usuarios_grupos')
                .update({ grupos: groupList })
                .eq('whatsapp', formatted);
                
              if (updateError) {
                console.error('Erro ao atualizar grupos do lead:', updateError);
                setError(`Erro ao atualizar cadastro: ${updateError.message || 'Verifique sua conexão.'}`);
                setCheckingPhone(false);
                return;
              }
            }
            setIsExistingLead(true);
          } else {
            setIsPhoneChecked(true);
            setIsExistingLead(false);
            setCheckedPhoneValue(formatted);
          }
        } catch (err: any) {
          console.error('Erro ao realizar busca silenciosa:', err);
          setError(`Erro inesperado: ${err.message || 'Verifique sua conexão.'}`);
        } finally {
          setCheckingPhone(false);
        }
      };

      checkExistingLead();
    } else if (clean.length < 10) {
      setIsPhoneChecked(false);
      setIsExistingLead(false);
      setCheckedPhoneValue('');
    }
  }, [formData.telefone, groupId, step, checkedPhoneValue]);

  if (!isOpen) return null;

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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    // Validate phone length
    const { clean } = sanitizeAndFormatPhone(formData.telefone);
    if (clean.length < 10 || clean.length > 11) {
      setError('Por favor, insira um telefone válido com DDD.');
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

  const handleRegionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bairro) {
      setError('Por favor, informe um CEP válido para continuar.');
      return;
    }

    setLoadingCep(true);
    setError('');

    try {
      const { clean, formatted } = sanitizeAndFormatPhone(formData.telefone);
      const cleanCep = formData.cep.replace(/\D/g, '');

      // Fetch existing lead to avoid losing other group references
      const { data: existingUser, error: fetchError } = await supabaseCaptura
        .schema('soroempregos')
        .from('usuarios_grupos')
        .select('grupos')
        .eq('whatsapp', formatted)
        .maybeSingle();

      if (fetchError) {
        console.error('Erro ao buscar lead existente:', fetchError);
        throw new Error(`Erro ao conectar ao banco de dados: ${fetchError.message || 'Verifique sua conexão.'}`);
      }

      let groupList: string[] = [];
      if (existingUser && Array.isArray(existingUser.grupos)) {
        groupList = existingUser.grupos as string[];
      }

      if (groupId && !groupList.includes(groupId)) {
        groupList.push(groupId);
      }

      // Upsert lead data
      const currentCity = formData.cidade || groupCity || 'Sorocaba';
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
          zona: '',
          grupos: groupList,
        }, {
          onConflict: 'whatsapp'
        });

      if (upsertError) {
        console.error('Erro no upsert do lead:', upsertError);
        throw new Error(`Erro ao salvar dados no banco: ${upsertError.message || 'Erro de conexão.'}`);
      }

      setStep('success');
    } catch (err: any) {
      console.error('Erro ao salvar lead:', err);
      setError('Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.');
    } finally {
      setLoadingCep(false);
    }
  };

  const handleAccessGroup = () => {
    window.open(groupLink, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-6 md:p-8 flex flex-col font-sans animate-scaleUp max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        {step === 'info' && (
          <form onSubmit={isExistingLead ? (e) => { e.preventDefault(); handleAccessGroup(); } : handleInfoSubmit} className="space-y-5">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-blue-950">Acesso ao grupo</h3>
              <p className="text-slate-500 text-sm mt-1">
                {isExistingLead 
                  ? <>Seu cadastro foi localizado. Clique abaixo para entrar no grupo <strong className="font-bold">{groupName}</strong>.</>
                  : <>Preencha os dados abaixo para liberar o acesso ao grupo <strong className="font-bold">{groupName}</strong>.</>
                }
              </p>
            </div>

            {!isExistingLead && (
              <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Primeiro nome</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Seu primeiro nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">Sexo</label>
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
                <label className="text-xs font-bold text-slate-500 ml-1">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <InputMask
                    mask="(__) _____-____"
                    replacement={{ _: /\d/ }}
                    type="text"
                    required
                    placeholder="(15) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

            {error && (
              <p className="text-red-500 text-xs font-bold text-center mt-2">{error}</p>
            )}

            <button
              type={isExistingLead ? "button" : "submit"}
              onClick={isExistingLead ? handleAccessGroup : undefined}
              disabled={!isExistingLead && (checkingPhone || (sanitizeAndFormatPhone(formData.telefone).clean.length >= 10 && !isPhoneChecked))}
              className={`w-full py-3.5 text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none ${
                isExistingLead 
                  ? 'bg-[#25D366] hover:bg-green-600 shadow-green-500/10' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10'
              }`}
            >
              <span>
                {checkingPhone 
                  ? 'Verificando telefone...' 
                  : isExistingLead 
                    ? 'Entrar no grupo'
                    : (sanitizeAndFormatPhone(formData.telefone).clean.length >= 10 && !isPhoneChecked)
                      ? 'Aguarde verificação...'
                      : 'Entrar no grupo'}
              </span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {step === 'region' && (
          <form onSubmit={handleRegionSubmit} className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-blue-950">Estamos melhorando nossos serviços em <strong className="font-bold">{cityName}</strong></h3>
              <p className="text-slate-500 text-sm mt-2">
                Informe seu CEP para identificarmos qual a sua região e exibir as vagas mais próximas a você.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">Insira seu CEP</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <InputMask
                  mask="_____-___"
                  replacement={{ _: /\d/ }}
                  type="text"
                  required
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={handleCepChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
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
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center animate-fadeIn">
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold block mb-1">Bairro identificado</span>
                <span className="text-sm text-slate-800 font-bold">{bairro}</span>
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
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-colors text-center"
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
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-blue-950">Acesso liberado!</h3>
              <p className="text-slate-500 text-sm">
                Tudo pronto. Clique no botão abaixo para entrar no grupo <strong className="font-bold">{groupName}</strong> no WhatsApp.
              </p>
            </div>

            <button
              onClick={handleAccessGroup}
              className="w-full py-4 bg-[#25D366] hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-500/10 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Acessar grupo no WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
