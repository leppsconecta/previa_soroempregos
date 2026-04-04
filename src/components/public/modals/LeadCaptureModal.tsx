import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, CheckCircle2, Rocket, ArrowRight, AlertCircle } from 'lucide-react';
import { InputMask } from '@react-input/mask';
import { supabase } from '../../../lib/supabase';
import { OfficialWhatsAppIcon } from '../../ui/OfficialWhatsAppIcon';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', whatsapp: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (isSuccess) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onSuccess();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSuccess, onSuccess]);

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', whatsapp: '', email: '' });
      setIsSuccess(false);
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.whatsapp || !formData.email) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Digite um e-mail válido.');
      return;
    }

    const cleanPhone = formData.whatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Telefone inválido.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedWhatsApp = `55${cleanPhone}`;
      
      const { error: dbError } = await supabase
        .schema('captura')
        .from('leads')
        .insert([
          {
            name: formData.name,
            whatsapp: formattedWhatsApp,
            email: formData.email,
            type: 'curso_marketing',
            metadata: { source: 'marketing_funnel_modal' }
          }
        ]);

      if (dbError) throw dbError;

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Error saving lead:', err);
      setError('Ocorreu um erro ao salvar seus dados. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-purple-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-purple-950 rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-y-auto max-h-[90vh] md:max-h-[85vh] border border-white/10"
      >
        {/* Header */}
        <div className="p-6 pb-2 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-xl text-white shadow-lg shadow-orange-500/20">
              <Rocket size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-none uppercase">Último passo!</h2>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Garantir acesso ao curso</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-white/40 transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-white/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Tudo pronto!</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6 px-4">
                  Em breve você receberá todas as informações sobre o curso em seu WhatsApp e e-mail. <br/>
                  <span className="font-bold text-white">Parabéns, você acaba de fazer a melhor escolha da sua vida!</span>
                </p>
                
                <div className="flex flex-col items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full border-4 border-orange-500 flex items-center justify-center text-white font-bold text-xl animate-pulse">
                      {countdown}
                    </div>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Retornando em instantes...</p>
                  </div>

                  <button
                    onClick={onSuccess}
                    className="w-full h-16 bg-white text-purple-950 font-bold rounded-2xl hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 group shadow-xl"
                  >
                    Voltar para a vaga
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-8 ">
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">Preencha seus dados para continuar</h3>
                  <p className="text-sm text-white/50">Enviaremos os detalhes exclusivos para você.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Seu nome</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input
                        type="text"
                        placeholder="Como deseja ser chamado?"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-orange-500 focus:outline-none transition-all text-sm font-medium text-white placeholder:text-white/20"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">WhatsApp</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 scale-90 opacity-40 grayscale brightness-200">
                        <OfficialWhatsAppIcon size={18} />
                      </div>
                      <InputMask
                        mask="(__) _ ____-____"
                        replacement={{ _: /\d/ }}
                        placeholder="(15) 9 1234-1234"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-orange-500 focus:outline-none transition-all text-sm font-medium text-white placeholder:text-white/20"
                        value={formData.whatsapp}
                        onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-orange-500 focus:outline-none transition-all text-sm font-medium text-white placeholder:text-white/20"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-500/20"
                    >
                      <AlertCircle size={16} />
                      {error}
                    </motion.div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-16 bg-orange-500 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/10 hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Salvando...</span>
                        </>
                      ) : (
                        <>
                          <span>Quero mudar de vida agora</span>
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-center text-[10px] text-white/20 pt-2 tracking-wide uppercase font-bold">
                    Segurança Soroempregos 🔒
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
