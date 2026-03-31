import React from 'react';
import { Job } from '../../../types';
import { X, ExternalLink, MessageCircle, MapPin, Copy, CheckCircle2 } from 'lucide-react';
import { OfficialWhatsAppIcon } from '../../ui/OfficialWhatsAppIcon';

interface AdvertiserOrientationModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
}

export const AdvertiserOrientationModal: React.FC<AdvertiserOrientationModalProps> = ({ isOpen, onClose, job }) => {
    const [copiedAddress, setCopiedAddress] = React.useState(false);

    if (!isOpen) return null;

    const handleCopyAddress = () => {
        if (job.cta_public_endereco) {
            navigator.clipboard.writeText(job.cta_public_endereco);
            setCopiedAddress(true);
            setTimeout(() => setCopiedAddress(false), 2000);
        }
    };

    const handleWhatsAppClick = () => {
        if (job.cta_public_contato) {
            const phone = job.cta_public_contato.replace(/\D/g, '');
            const req = Array.isArray(job.requirements) ? job.requirements.join(', ') : (job.requirements || 'Não informado');
            const ben = Array.isArray(job.benefits) ? job.benefits.join(', ') : (job.benefits || 'Não informado');
            const act = Array.isArray(job.activities) ? job.activities.join(', ') : (job.activities || 'Não informado');
            const typeLine = job.type && job.type.trim() !== '' && !['Não informado', 'Nao informado', 'Não mencionado', 'Nao mencionado'].includes(job.type) ? `*Vínculo:* ${job.type}\n` : '';
            const message = encodeURIComponent(
                `Olá, vi esta vaga na soroempregos.com e tenho interesse.
----------------------
Função: ${job.title}
Cód. *Vaga: ${job.code || '---'}*
-----------------------------
${typeLine}*Empresa:* ${job.company || 'Não informado'}
*Cidade/Bairro:* ${job.city || ''} - ${job.region || ''}
*Requisitos:* ${req}
*Benefícios:* ${ben}
*Atividades:* ${act}
*Salario:* ${job.salary || 'A combinar'}
`
            );
            window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
        }
    };


    const checkVisible = (val?: string) => {
        if (!val) return false;
        const lower = val.toLowerCase().trim();
        return !['não mencionado', 'nao mencionado'].includes(lower);
    };

    const hasLink = checkVisible(job.cta_public_link);
    const hasPhone = checkVisible(job.cta_public_contato);
    const hasAddress = checkVisible(job.cta_public_endereco);
    const hasEmail = checkVisible(job.cta_public_email);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scaleUp">

                {/* Header */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Como se candidatar</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Siga as instruções abaixo</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh] custom-scrollbar">

                    {/* Link Section */}
                    {hasLink && (
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg shrink-0">
                                    <ExternalLink size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        O interessado deve clicar no link abaixo para enviar currículo
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => window.open(job.cta_public_link, '_blank')}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
                            >
                                <ExternalLink size={18} />
                                Acessar Link de Inscrição
                            </button>
                        </div>
                    )}

                    {/* Divider if multiple items */}
                    {hasLink && (hasPhone || hasAddress) && (
                        <div className="h-px bg-slate-100 dark:bg-slate-800" />
                    )}

                    {/* Phone Section */}
                    {hasPhone && (
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg shrink-0">
                                    <OfficialWhatsAppIcon size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        O interessado deve entrar em contato pelo WhatsApp abaixo
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleWhatsAppClick}
                                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
                            >
                                <MessageCircle size={18} />
                                Chamar no WhatsApp
                            </button>
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center border border-slate-100 dark:border-slate-700">
                                <p className="text-xs text-slate-500 mb-1">Número de contato</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">{job.cta_public_contato}</p>
                            </div>
                        </div>
                    )}

                    {/* Divider if multiple items */}
                    {(hasLink || hasPhone) && hasEmail && (
                        <div className="h-px bg-slate-100 dark:bg-slate-800" />
                    )}

                    {/* Email Section */}
                    {hasEmail && (
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg shrink-0">
                                    <MessageCircle size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        O interessado deve enviar o currículo para o E-mail abaixo
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (job.cta_public_email) {
                                        navigator.clipboard.writeText(job.cta_public_email);
                                        // A simple visual feedback could be done, but keeping it simple for now
                                        alert('E-mail copiado para a área de transferência!');
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
                            >
                                <Copy size={18} />
                                Copiar E-mail
                            </button>
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center border border-slate-100 dark:border-slate-700">
                                <p className="text-xs text-slate-500 mb-1">E-mail de contato</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white font-mono break-all">{job.cta_public_email}</p>
                            </div>
                        </div>
                    )}

                    {/* Divider if multiple items */}
                    {(hasLink || hasPhone) && hasAddress && (
                        <div className="h-px bg-slate-100 dark:bg-slate-800" />
                    )}

                    {/* Address Section */}
                    {hasAddress && (
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        O interessado deve comparecer no endereço
                                    </p>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 relative group">
                                <p className="text-sm text-slate-700 dark:text-slate-300 pr-8 leading-relaxed">
                                    {job.address}
                                </p>
                                <button
                                    onClick={handleCopyAddress}
                                    className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                                    title="Copiar endereço"
                                >
                                    {copiedAddress ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Advertiser credit */}
                    {job.anunciante && (
                        <p className="text-center text-xs text-slate-400 dark:text-slate-600 pt-2">
                            Anunciante da vaga: <span className="font-medium">{job.anunciante.split('@')[0]}</span>
                        </p>
                    )}

                </div>
            </div>
        </div>
    );
};
