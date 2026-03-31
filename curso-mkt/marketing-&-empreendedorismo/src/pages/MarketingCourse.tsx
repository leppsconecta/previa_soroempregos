import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Briefcase, Rocket, Target, Users, CheckCircle2 } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "A realidade do mercado",
    text: "Sabemos da luta que é conquistar um emprego e entendemos os sonhos de cada um que passa por aqui.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1000",
    icon: <Briefcase className="w-6 h-6 text-orange-500" />,
  },
  {
    id: 2,
    title: "Além das vagas",
    text: "Não nos limitamos a apenas mostrar vagas. Estamos empenhados em fazer você crescer e conquistar sua independência!",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000",
    icon: <Target className="w-6 h-6 text-orange-500" />,
  },
  {
    id: 3,
    title: "O Próximo Passo",
    text: "Temos um curso onde ensinamos você a dar os primeiros passos como empreendedor, não importa o seu nicho.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000",
    icon: <Rocket className="w-6 h-6 text-orange-500" />,
  },
  {
    id: 4,
    title: "Seu Sonho, Sua Regra",
    text: "Seja vendendo bolo de pote, roupas, abrindo uma hamburgueria ou uma mecânica: nós te ajudamos a se posicionar no mercado.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1000",
    icon: <CheckCircle2 className="w-6 h-6 text-orange-500" />,
  },
  {
    id: 5,
    title: "Domine a Venda",
    text: "Independentemente do seu sonho, ensinamos você a vender seja um produto ou um serviço.",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1000",
    icon: <Users className="w-6 h-6 text-orange-500" />,
  },
  {
    id: 6,
    title: "A Decisão é Sua",
    text: "Escolha entre alimentar o sonho do seu patrão ou dar o primeiro passo para ser dono do seu próprio negócio.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000",
    icon: <Target className="w-6 h-6 text-orange-500" />,
  },
];

export default function MarketingCourse() {
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setShowModal(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Boas-vindas!</h2>
          <p className="text-gray-600 mb-8 text-center">Para começarmos essa jornada, como podemos te chamar?</p>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 focus:outline-none text-lg transition-all"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-orange-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-lg shadow-orange-100"
            >
              Começar agora
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-gray-900">
      {/* Header Image Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentStep}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            src={steps[currentStep].image}
            alt="Sucesso"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#fafafa]" />
      </div>

      {/* Content Section */}
      <main className="max-w-2xl mx-auto px-6 -mt-20 relative z-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100"
        >
          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-50 rounded-2xl">
                    {steps[currentStep].icon}
                  </div>
                </div>

                <div className="space-y-4">
                  {currentStep === 0 && (
                    <h1 className="text-2xl md:text-3xl font-light text-gray-500 italic">
                      Oi <span className="text-orange-500 font-bold not-italic">{name}</span>, tudo bem?
                    </h1>
                  )}
                  <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
                    {steps[currentStep].text}
                  </p>
                </div>

                <button
                  onClick={nextStep}
                  className="group w-full md:w-auto flex items-center justify-center gap-3 bg-orange-500 hover:bg-blue-600 active:bg-blue-700 text-white px-8 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-orange-100"
                >
                  Continuar lendo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-10"
              >
                <div className="space-y-4">
                  <div className="inline-flex p-4 bg-green-50 rounded-full mb-4">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                  <h2 className="text-4xl font-black leading-tight">
                    A decisão final é sua.
                  </h2>
                  <p className="text-xl text-gray-600 max-w-md mx-auto">
                    Você está a um passo de transformar sua realidade. Qual caminho você escolhe hoje?
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <button className="w-full bg-orange-500 hover:bg-blue-600 active:bg-blue-700 text-white font-black py-6 rounded-2xl text-xl transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3">
                    <Rocket className="w-6 h-6" />
                    CONHECER CURSO
                  </button>
                  <button className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-6 rounded-2xl text-xl transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3">
                    <Users className="w-6 h-6" />
                    Entrar no grupo
                  </button>
                </div>

                <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">
                  Seja dono do seu próprio destino
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Progress Bar */}
      {!showModal && !isFinished && (
        <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-100 z-50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            className="h-full bg-orange-500"
          />
        </div>
      )}
    </div>
  );
}
