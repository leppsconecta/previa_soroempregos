import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Job, FilterType } from '../../types'; // Ensure FilterType is imported
import CompactJobCard from '../../components/public/CompactJobCard';
import JobDetailModal from '../../components/public/modals/JobDetailModal';
import ApplicationModal from '../../components/public/modals/ApplicationModal';
import ReportModal from '../../components/public/modals/ReportModal';
import InactiveJobModal from '../../components/public/modals/InactiveJobModal';
import { Search, Loader2, ArrowLeft, Briefcase, Zap, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PublicJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<FilterType | 'Todos'>('Todos');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const JOBS_PER_PAGE = 20;

    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isInactiveJobModalOpen, setIsInactiveJobModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchJobs(true);
    }, [filterType, searchTerm]); // Refund when filter/search changes

    // Realtime Subscription
    useEffect(() => {
        const channel = supabase.channel('public_jobs_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => {
                // Whenever there is a change, refetch the jobs to keep UI synced
                fetchJobs(true);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchJobs = async (reset = false) => {
        try {
            setLoading(true);
            const currentPage = reset ? 0 : page;
            const from = currentPage * JOBS_PER_PAGE;
            const to = from + JOBS_PER_PAGE - 1;

            const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

            let query = supabase
                .from('jobs')
                .select('*')
                .eq('status', 'active')
                .gte('created_at', fortyEightHoursAgo)
                .order('created_at', { ascending: false })
                .range(from, to);

            if (filterType !== 'Todos') {
                query = query.eq('employment_type', filterType);
            }

            if (searchTerm) {
                const safeTerm = searchTerm.replace(/[%_(),]/g, '').trim();
                if (safeTerm) {
                    query = query.or(`title.ilike.%${safeTerm}%,code.ilike.%${safeTerm}%,city.ilike.%${safeTerm}%,region.ilike.%${safeTerm}%,employment_type.ilike.%${safeTerm}%,salary.ilike.%${safeTerm}%`);
                }
            }

            const { data: jobsData, error: jobsError } = await query;

            if (jobsError) throw jobsError;

            // Fetch companies manually to avoid joining auth.users (which is restricted)
            let companiesMap = new Map();
            if (jobsData && jobsData.length > 0) {
                const userIds = [...new Set(jobsData.map((j: any) => j.user_id).filter(Boolean))];

                const { data: companiesData } = await supabase
                    .from('companies')
                    .select('*')
                    .in('owner_id', userIds);

                if (companiesData) {
                    companiesData.forEach((c: any) => companiesMap.set(c.owner_id, c));
                }
            }

            const mappedJobs: Job[] = (jobsData || []).map((j: any) => {
                const company = companiesMap.get(j.user_id);
                return {
                    id: j.id,
                    code: j.code || j.id.slice(0, 8).toUpperCase(),
                    title: j.title || j.role,
                    company: company?.name || 'Confidencial',
                    location: j.city || 'Local não informado',
                    city: j.city,
                    region: j.state || 'SP',
                    schedule: j.work_schedule || 'Horário a combinar',
                    type: j.employment_type || null,
                    salary: j.salary ? `R$ ${j.salary}` : undefined,
                    postedAt: new Date(j.created_at).toLocaleDateString('pt-BR') + ' às ' + new Date(j.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    description: j.description || j.observation || '',
                    requirements: parseList(j.requirements),
                    benefits: parseList(j.benefits),
                    activities: parseList(j.activities),
                    isFeatured: j.is_featured,
                    companyId: company?.id,
                    ownerId: j.user_id,
                    companyData: company,
                    anunciante: j.anunciante,
                    status_anunciante: j.status_anunciante,
                    cta_public_contato: j.cta_public_contato,
                    cta_public_email: j.cta_public_email,
                    cta_public_link: j.cta_public_link,
                    cta_public_endereco: j.cta_public_endereco,
                    cta_public_observations_whatsapp: j.cta_public_observations_whatsapp,
                    cta_public_observations_email: j.cta_public_observations_email,
                    cta_public_observations_link: j.cta_public_observations_link,
                    cta_public_observations_endereco: j.cta_public_observations_endereco
                };
            });

            const checkVisible = (val?: string) => {
                if (!val) return false;
                const lower = val.toLowerCase().trim();
                return !['não mencionado', 'nao mencionado'].includes(lower);
            };

            const validMappedJobs = mappedJobs.filter((job: any) => 
                checkVisible(job.cta_public_contato) ||
                checkVisible(job.cta_public_email) ||
                checkVisible(job.cta_public_link) ||
                checkVisible(job.cta_public_endereco) ||
                job.status_anunciante === true
            );

            if (reset) {
                setJobs(validMappedJobs);
                setPage(1);
            } else {
                setJobs(prev => [...prev, ...validMappedJobs]);
                setPage(prev => prev + 1);
            }

            setHasMore(jobsData.length === JOBS_PER_PAGE);

        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const parseList = (field: any) => {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        if (typeof field === 'string') {
            try {
                const parsed = JSON.parse(field);
                if (Array.isArray(parsed)) return parsed;
                return [parsed];
            } catch (e) {
                if (field.includes('\n')) return field.split('\n').filter((s: string) => s.trim().length > 0);
                if (field.includes(',')) return field.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
                return [field];
            }
        }
        return [];
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pt-20">
            {/* Header */}
            <header className="h-20 bg-blue-950 fixed top-0 left-0 w-full z-50 px-6 md:px-12 flex items-center shadow-xl">
                <Link to="/" className="text-white hover:text-yellow-400 transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                    <ArrowLeft size={16} /> Voltar
                </Link>
                <div className="flex-1 flex justify-center">
                    {/* Logo here if needed */}
                </div>
                <div className="w-16"></div> {/* Spacer */}
            </header>

            {/* Hero */}
            <section className="bg-blue-950 text-white pb-16 pt-8 px-6 md:px-12 lg:px-24 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-800/50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-3xl md:text-5xl font-black mb-4">
                        Conectando talentos ao <span className="text-yellow-400">futuro</span>
                    </h1>
                    <p className="text-blue-200/80 font-medium text-sm uppercase tracking-widest mb-8">
                        Vagas dos últimos 2 dias
                    </p>

                    {/* Search & Filter Bar */}
                    <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2 max-w-2xl mx-auto">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar vaga (cargo, código...)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 text-slate-800 font-bold placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <div className="flex p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar md:overflow-visible">
                            {['Todos', 'CLT', 'PJ', 'Freelance', 'Estágio'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type as any)}
                                    className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${filterType === type ? 'bg-blue-950 text-white shadow-lg' : 'text-slate-500 hover:text-blue-950'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Jobs Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading && page === 0 ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-blue-950" size={40} />
                    </div>
                ) : jobs.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job) => (
                                <CompactJobCard
                                    key={job.id}
                                    job={job}
                                    onViewDetails={() => {
                                        setSelectedJob(job);
                                        if ((job as any).status !== 'Active' && (job as any).status !== 'active') { // Check status if field available
                                            // Ideally filtered by query, but double check
                                        }
                                        setIsDetailModalOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                        {hasMore && (
                            <div className="text-center mt-12">
                                <button
                                    onClick={() => fetchJobs()}
                                    disabled={loading}
                                    className="px-8 py-3 bg-white border border-slate-200 text-blue-950 font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-slate-50 shadow-sm transition-all"
                                >
                                    {loading ? 'Carregando...' : 'Carregar Mais Vagas'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 text-slate-400">
                        <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Nenhuma vaga encontrada com esses filtros.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            {selectedJob && (
                <>
                    <JobDetailModal
                        isOpen={isDetailModalOpen}
                        onClose={() => setIsDetailModalOpen(false)}
                        job={selectedJob}
                        onApply={() => { setIsDetailModalOpen(false); setIsApplicationModalOpen(true); }}
                        onReport={() => { setIsDetailModalOpen(false); setIsReportModalOpen(true); }}
                        brandColor={(selectedJob as any).companyData?.profile_header_color || '#1e293b'}
                    />
                    <ApplicationModal
                        isOpen={isApplicationModalOpen}
                        onClose={() => setIsApplicationModalOpen(false)}
                        jobTitle={selectedJob.title}
                        jobOwnerId={(selectedJob as any).ownerId}
                        jobId={selectedJob.id}
                        companyId={(selectedJob as any).companyId}
                        isAdvertiser={!!(selectedJob as any).status_anunciante}
                        advertiserName={(selectedJob as any).anunciante}
                        ctaContato={(selectedJob as any).cta_public_contato}
                        ctaEmail={(selectedJob as any).cta_public_email}
                        ctaLink={(selectedJob as any).cta_public_link}
                        ctaEndereco={(selectedJob as any).cta_public_endereco}
                        ctaObservationsWhatsapp={(selectedJob as any).cta_public_observations_whatsapp}
                        ctaObservationsEmail={(selectedJob as any).cta_public_observations_email}
                        ctaObservationsLink={(selectedJob as any).cta_public_observations_link}
                        ctaObservationsEndereco={(selectedJob as any).cta_public_observations_endereco}
                    />
                    <ReportModal
                        isOpen={isReportModalOpen}
                        onClose={() => setIsReportModalOpen(false)}
                        jobTitle={selectedJob.title}
                        userId={(selectedJob as any).ownerId}
                        jobCode={(selectedJob as any).code}
                        jobId={selectedJob.id}
                    />
                </>
            )}

            <InactiveJobModal
                isOpen={isInactiveJobModalOpen}
                onClose={() => setIsInactiveJobModalOpen(false)}
            />
        </div>
    );
};
