import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Briefcase, Rocket, Target, Users, CheckCircle2, Phone, X } from "lucide-react";
import { OfficialWhatsAppIcon } from "../../components/ui/OfficialWhatsAppIcon";

const steps = [
  {
    id: 1,
    title: "a realidade do mercado",
    text: "sabemos da luta que é conquistar um emprego e entendemos os sonhos de cada um que passa por aqui.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1000",
    icon: <Briefcase className="w-6 h-6 text-orange-500" />,
  },
  {
    id: 2,
    title: "além das vagas",
    text: "não nos limitamos a apenas mostrar vagas. estamos empenhados em fazer você crescer e conquistar sua independência!",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000",
    icon: <Target className="w-6 h-6 text-orange-500" />,
  },
  {
    id: 3,
    title: "o próximo passo",
    text: "temos um curso onde ensinamos você a dar os primeiros passos como empreendedor, não importa o seu nicho.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000",
    icon: <Rocket className="w-6 h-6 text-orange-500" />,
  },
  {
    id: 4,
    title: "seu sonho, sua regra",
    text: "seja vendendo bolo de pote, roupas, abrindo uma hamburgueria ou uma mecânica: nós te ajudamos a se posicionar no mercado.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1000",
    icon: <CheckCircle2 className="w-6 h-6 text-orange-500" />,
  },
  {
    id: 5,
    title: "domine a venda",
    text: "independentemente do seu sonho, ensinamos você a vender seja um produto ou um serviço.",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1000",
    icon: <Users className="w-6 h-6 text-orange-500" />,
  },
  {
    id: 6,
    title: "a decisão é sua",
    text: "escolha entre alimentar o sonho do seu patrão ou dar o primeiro passo para ser dono do seu próprio negócio.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000",
    icon: <Target className="w-6 h-6 text-orange-500" />,
  },
];

export const MarketingCourse: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigateTo = useNavigate();
  const redirectUrl = searchParams.get("redirect") || "";
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isCourseClicked, setIsCourseClicked] = useState(false);
  const [isGroupClicked, setIsGroupClicked] = useState(false);

  // Guard: only allow access when coming from a group click (with valid redirect)
  useEffect(() => {
    if (!redirectUrl) {
      navigateTo("/", { replace: true });
    }
  }, [redirectUrl, navigateTo]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isFinished && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isFinished, countdown]);

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
          className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl"
        >
          <h2 className="text-3xl text-gray-900 dark:text-slate-100 mb-6 text-center tracking-tight">boas-vindas!</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-8 text-center font-light">para começarmos essa jornada, como podemos te chamar?</p>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => {
                const raw = e.target.value;
                const formatted = raw.length > 0 ? raw.charAt(0).toUpperCase() + raw.slice(1) : "";
                setName(formatted);
              }}
              placeholder="Digite seu nome completo"
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-orange-500 focus:outline-none text-lg transition-all dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-orange-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-2xl text-lg transition-all shadow-lg shadow-orange-100 dark:shadow-none"
            >
              começar agora
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 font-sans text-gray-900 dark:text-slate-100">
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
            alt="sucesso inspirador"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#fafafa] dark:to-slate-950" />
      </div>

      {/* Content Section */}
      <main className="max-w-2xl mx-auto px-6 -mt-20 relative z-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800"
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
                  <div className="p-3 bg-orange-50 dark:bg-orange-500/10 rounded-2xl">
                    {steps[currentStep].icon}
                  </div>
                </div>

                <div className="space-y-4">
                  {currentStep === 0 && (
                    <h1 className="text-2xl md:text-3xl font-light text-gray-500 dark:text-slate-400 italic">
                      oi <span className="text-orange-500 not-italic">{name}</span>, tudo bem?
                    </h1>
                  )}
                  <h2 className="text-3xl md:text-4xl leading-tight tracking-tight">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-slate-300 leading-relaxed font-light">
                    {steps[currentStep].text}
                  </p>
                </div>

                <button
                  onClick={nextStep}
                  className="group w-full md:w-auto flex items-center justify-center gap-3 bg-orange-500 hover:bg-blue-600 active:bg-blue-700 text-white px-8 py-5 rounded-2xl text-lg transition-all duration-300 shadow-xl shadow-orange-100 dark:shadow-none"
                >
                  continuar lendo
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
                  <div className="inline-flex p-4 bg-green-50 dark:bg-green-500/10 rounded-full mb-4">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                  <h2 className="text-4xl leading-tight">
                    a decisão final é sua.
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-slate-300 max-w-md mx-auto font-light">
                    você está a um passo de transformar sua realidade. qual caminho você escolhe hoje?
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    disabled={isCourseClicked}
                  onClick={() => {
                    window.open('https://curso.soroempregos.com.br/', '_blank');
                  }}
                  className="w-full bg-orange-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 text-white py-6 rounded-2xl text-xl transition-all shadow-xl shadow-orange-100 dark:shadow-none flex items-center justify-center gap-3"
                >
                  <Rocket className="w-6 h-6" />
                  quero ser patrão
                </button>

                  <button 
                    disabled={countdown > 0 || isGroupClicked}
                    onClick={() => {
                      if (countdown === 0) {
                        setIsGroupClicked(true);
                        window.open(redirectUrl, "_blank");
                      }
                    }}
                    className={`w-full py-6 rounded-2xl text-xl transition-all flex items-center justify-center gap-3 shadow-xl ${
                      countdown > 0 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" 
                      : "bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-green-100"
                    }`}
                  >
                    <OfficialWhatsAppIcon size={24} />
                    {countdown > 0 ? `carregando link do grupo (${countdown}s)` : "acessar grupo"}
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-400 tracking-widest">
                    seja dono do seu próprio negócio
                  </p>
                  <Link 
                    to="/" 
                    className="inline-block text-xs text-gray-400 dark:text-slate-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors tracking-widest underline-offset-4 hover:underline"
                  >
                    voltar a SoroEmpregos
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>



      {/* Progress Bar */}
      {!showModal && !isFinished && (
        <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-100 dark:bg-slate-900 z-50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            className="h-full bg-orange-500"
          />
        </div>
      )}
    </div>
  );
};
