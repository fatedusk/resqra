import React, { useEffect, useState } from 'react';
import {
  Newspaper,
  TrendingUp,
  Bookmark,
  Share2,
  Clock,
  Sparkles,
  ExternalLink,
  BarChart3,
  Check
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { api } from '../services/api';
import { NewsArticle } from '../types';

export const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [activeTab, setActiveTab] = useState<'Top Stories' | 'Incidents' | 'Trends' | 'Saved'>('Top Stories');
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('resqra_saved_news');
    return saved ? JSON.parse(saved) : ['news-1'];
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.getNews();
        setArticles(res.articles);
      } catch (err) {
        console.warn('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const toggleSave = (id: string) => {
    const next = savedArticleIds.includes(id)
      ? savedArticleIds.filter((item) => item !== id)
      : [...savedArticleIds, id];
    setSavedArticleIds(next);
    localStorage.setItem('resqra_saved_news', JSON.stringify(next));
  };

  const trendData = [
    { month: 'May', incidents: 38, rescues: 35 },
    { month: 'Jun', incidents: 45, rescues: 42 },
    { month: 'Jul', incidents: 52, rescues: 50 },
    { month: 'Aug', incidents: 61, rescues: 58 },
    { month: 'Sep', incidents: 48, rescues: 47 },
    { month: 'Oct', incidents: 34, rescues: 33 }
  ];

  const displayedArticles =
    activeTab === 'Saved'
      ? articles.filter((a) => savedArticleIds.includes(a.id))
      : activeTab === 'Top Stories'
      ? articles
      : articles.filter((a) => a.category === activeTab);

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-emerald-500" />
            Animal News & Insights
          </h2>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> AI Curated
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Verified updates, rabies advisories, municipal wildlife notices, and rescue reports.
        </p>
      </div>

      {/* Navigation Tabs (Screen 9 Reference: Top Stories, Incidents, Trends, Saved) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['Top Stories', 'Incidents', 'Trends', 'Saved'] as const).map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* TRENDS & ANALYTICS TAB */}
      {activeTab === 'Trends' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Monthly Incident vs Rescue Resolution
                </h3>
                <p className="text-[11px] text-slate-400">Delhi NCR District Trends (2026)</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                94% Resolution Rate
              </span>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="rescuesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="incidentsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '0.75rem',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="incidents" stroke="#f43f5e" fillOpacity={1} fill="url(#incidentsGrad)" name="Reported Incidents" />
                  <Area type="monotone" dataKey="rescues" stroke="#10b981" fillOpacity={1} fill="url(#rescuesGrad)" name="Successful Rescues" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ARTICLES LIST (Screen 9 Reference) */}
      <div className="space-y-3.5">
        {displayedArticles.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No saved articles yet. Bookmark articles to read later.
          </div>
        ) : (
          displayedArticles.map((article) => {
            const isSaved = savedArticleIds.includes(article.id);
            return (
              <div
                key={article.id}
                className="p-3.5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3.5 hover:border-emerald-500 transition"
              >
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full sm:w-28 h-32 sm:h-24 rounded-2xl object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-emerald-700 dark:text-emerald-400">
                      {article.sourceName}
                    </span>
                    <span className="text-[11px] text-slate-400">{article.publishedAt}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {article.summary}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                    <button
                      onClick={() => toggleSave(article.id)}
                      className={`flex items-center gap-1 font-semibold transition ${
                        isSaved ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-600' : ''}`} />
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
