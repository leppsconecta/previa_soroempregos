/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  TrendingUp, 
  Rocket,
  MessageCircle,
  Sparkles,
  X,
  Send
} from 'lucide-react';

type ModalStep = 'intro' | 'exclusive' | 'final';

export default function App() {
  const [step, setStep] = useState<ModalStep>('intro');

  return (
    <div className="fixed inset-0 bg-[#EA580C] flex items-center justify-center p-4 font-sans overflow-hidden">
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-64 -left-64 w-[800px] h-[800px] bg-purple-900/40 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -45, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-64 -right-64 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px]" 
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md bg-white/10 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl border border-white/20 min-h-[520px] flex flex-col"
          >
            <div className="p-8 flex flex-col items-center text-center flex-1 justify-center">
              <div className="w-full aspect-video rounded-[24px] overflow-hidden mb-6 shadow-xl ring-1 ring-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop" 
                  alt="Pessoa estressada no trabalho"
                  className="w-full h-full object-cover grayscale brightness-75 contrast-110"
                  referrerPolicy="no-referrer"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-black text-white mb-3 leading-none tracking-tighter uppercase">
                  Seja dono do seu <br/>
                  <span className="text-purple-950">próprio negócio</span>
                </h2>
                <p className="text-white/90 text-lg font-bold italic tracking-tight">
                  "Alimente seu sonho, e não do seu patrão"
                </p>
              </motion.div>

              <div className="mt-6 flex flex-col items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('exclusive')}
                  className="px-8 py-2.5 bg-white/10 border border-white/20 rounded-full text-white text-sm font-bold tracking-tight transition-colors flex items-center gap-2"
                >
                  Enviar Currículo
                  <Send size={14} />
                </motion.button>

                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-[8px] font-black uppercase tracking-[0.4em]">Analisando perfil...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'exclusive' && (
          <motion.div
            key="exclusive"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md bg-purple-950 rounded-[40px] overflow-hidden shadow-2xl border border-white/10 min-h-[520px] flex flex-col"
          >
            <div className="p-8 flex flex-col items-center text-center flex-1 justify-center">
              <div className="w-full aspect-video rounded-[24px] overflow-hidden mb-6 shadow-xl ring-1 ring-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1000&auto=format&fit=crop" 
                  alt="Empresário de sucesso comemorando"
                  className="w-full h-full object-cover brightness-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-black text-white leading-[1.1] tracking-tighter uppercase">
                  Nós desenvolmemos um <span className="text-orange-500">curso pra voce!</span>
                </h2>
                <p className="text-white/80 text-sm font-medium leading-relaxed">
                  Nosso curso é exclusivo, não é caro, e sem duvidas você vai sair da condição de funcionário para ser dono do seu prorprio negpocio
                </p>
              </motion.div>

              <div className="mt-8 flex flex-col items-center gap-6 w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('final')}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-900/20"
                >
                  Ver Oportunidade
                </motion.button>

                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }} 
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="w-1.5 h-1.5 bg-orange-500 rounded-full" 
                  />
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-md bg-white rounded-[40px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.4)]"
          >
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-100">
                  <Briefcase className="text-white" size={18} />
                </div>
                <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Instruções da Vaga</h2>
              </div>
              <button 
                onClick={() => setStep('intro')}
                className="p-2 hover:bg-zinc-200 rounded-full text-zinc-400 transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10 flex flex-col items-center text-center flex-1 justify-center min-h-[440px]">
              <div className="w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center mb-6 shadow-inner relative">
                <Briefcase className="text-blue-600" size={36} />
                <div className="absolute -bottom-1.5 -right-1.5 bg-green-500 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-zinc-900 mb-6 tracking-tight">
                Candidatar-se a esta vaga
              </h3>

              <div className="w-full space-y-2.5 mb-6">
                <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-left">
                  <p className="text-zinc-500 text-xs font-medium">Enviar currículo via WhatsApp</p>
                </div>
                <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-left flex items-center gap-3">
                  <div className="p-1.5 bg-white rounded-lg shadow-sm">
                    <MessageCircle size={18} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">WhatsApp:</p>
                    <p className="text-zinc-900 font-bold text-sm">15981880232</p>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col gap-2.5">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-100 text-sm"
                >
                  <TrendingUp size={16} />
                  Quero mudar de vida agora
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-green-100 text-sm"
                >
                  <Send size={16} />
                  Enviar Currículo
                </motion.button>
              </div>

              <p className="mt-8 text-zinc-400 text-[10px] font-medium">
                Esta vaga foi anunciada por <span className="text-zinc-500">5515981880232</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
