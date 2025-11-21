
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { HistoricAnalysisResult, UserProfile, CalendarReminder } from '../types';
import Card from '../components/Card';
import { TrendingUpIcon } from '../components/icons/TrendingUpIcon';
import { PieChartIcon } from '../components/icons/PieChartIcon';
import { TargetIcon } from '../components/icons/TargetIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';

interface ProgressPageProps {
  history: HistoricAnalysisResult[];
}

// --- SVG COMPONENTS ---

const ImprovedVelocityChart: React.FC<{ data: HistoricAnalysisResult[] }> = ({ data }) => {
    const chartData = [...data].sort((a,b) => a.timestamp - b.timestamp).slice(-10);
    
    if (chartData.length < 2) return (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <TrendingUpIcon className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-sm font-medium">Complete at least 2 audits to see your trend line.</span>
        </div>
    );

    // Dimensions matching container aspect ratio strictly 2:1 to REMOVE WHITESPACE
    const height = 400; 
    const width = 800; 
    const paddingX = 40;
    const paddingY = 20; 
    
    const maxScore = 100;
    const graphHeight = height - (paddingY * 2);
    const graphWidth = width - (paddingX * 2);

    const points = chartData.map((item, index) => {
        const x = paddingX + (index / (chartData.length - 1)) * graphWidth;
        const y = (height - paddingY) - (item.overall.score / maxScore) * graphHeight;
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${points} ${paddingX + graphWidth},${height - paddingY} ${paddingX},${height - paddingY}`;

    return (
        <div className="w-full h-auto aspect-[2/1] min-h-[200px]">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25"/>
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                    </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 50, 100].map((tick) => {
                    const y = (height - paddingY) - (tick / 100) * graphHeight;
                    return (
                        <g key={tick}>
                            <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" className="dark:stroke-gray-700 opacity-50" />
                            <text x={paddingX - 10} y={y + 4} textAnchor="end" className="text-[10px] fill-gray-400 font-medium">{tick}</text>
                        </g>
                    );
                })}

                {/* Dates */}
                {chartData.map((item, index) => {
                    const x = paddingX + (index / (chartData.length - 1)) * graphWidth;
                    const date = new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    if (chartData.length > 5 && index % 2 !== 0 && index !== chartData.length -1) return null;
                    return (
                        <text key={item.id} x={x} y={height - 5} textAnchor="middle" className="text-[10px] fill-gray-500 dark:fill-gray-400 font-medium">
                            {date}
                        </text>
                    )
                })}

                <polygon points={areaPoints} fill="url(#chartGradient)" />
                <polyline points={points} fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {chartData.map((item, index) => {
                    const x = paddingX + (index / (chartData.length - 1)) * graphWidth;
                    const y = (height - paddingY) - (item.overall.score / maxScore) * graphHeight;
                    return (
                        <g key={item.id} className="group cursor-pointer">
                            <circle cx={x} cy={y} r="12" fill="transparent" />
                            <circle cx={x} cy={y} r="4" className="fill-white stroke-primary dark:stroke-primary-dark hover:r-6 transition-all" strokeWidth="2.5" />
                            <title>{item.overall.score} - {new Date(item.timestamp).toLocaleDateString()}</title>
                        </g>
                    )
                })}
            </svg>
        </div>
    );
};

const ContentMixPie: React.FC<{ articles: number, videos: number }> = ({ articles, videos }) => {
    const total = articles + videos;
    if (total === 0) return <div className="h-40 flex items-center justify-center text-gray-400 italic text-sm">No data available.</div>;
    const articlePct = articles / total;
    const videoPct = videos / total;
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const articleDash = articlePct * circumference;

    return (
        <div className="flex flex-col items-center justify-center h-full py-4">
            <div className="relative w-48 h-48">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="16" fill="transparent" stroke="#EC4899" strokeWidth="5" />
                    <circle cx="18" cy="18" r="16" fill="transparent" stroke="#3B82F6" strokeWidth="5" strokeDasharray={`${articleDash} ${circumference}`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-display text-light-text dark:text-dark-text">{total}</span>
                    <span className="text-[10px] text-gray-500 uppercase">Audits</span>
                </div>
            </div>
            <div className="flex gap-4 mt-6 text-sm">
                <div className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>Article ({Math.round(articlePct*100)}%)</div>
                <div className="flex items-center"><span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>Video ({Math.round(videoPct*100)}%)</div>
            </div>
        </div>
    );
};

const SmartCalendar: React.FC<{ history: HistoricAnalysisResult[], reminders: CalendarReminder[], onAddReminder: (date: Date, text: string) => void }> = ({ history, reminders, onAddReminder }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [newReminderText, setNewReminderText] = useState("");
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const toDateString = (d: Date) => d.toDateString();

    const handleSaveReminder = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDate && newReminderText.trim()) {
            onAddReminder(selectedDate, newReminderText);
            setNewReminderText("");
            setSelectedDate(null);
        }
    };

    const handleDayClick = (dateObj: Date) => {
        setSelectedDate(dateObj);
    };

    return (
        <div className="h-full flex flex-col min-h-[500px]"> 
            <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><ChevronLeftIcon className="w-5 h-5 text-gray-500" /></button>
                <span className="font-display font-bold text-xl text-gray-900 dark:text-white">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><ChevronRightIcon className="w-5 h-5 text-gray-500" /></button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-sm font-bold text-gray-400 uppercase">{d}</span>)}
            </div>
            
            <div className="grid grid-cols-7 gap-2 flex-1 content-start">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dateObj = new Date(year, month, i + 1);
                    const isToday = toDateString(new Date()) === toDateString(dateObj);
                    const isSelected = selectedDate && toDateString(selectedDate) === toDateString(dateObj);
                    const hasAudit = history.some(h => toDateString(new Date(h.timestamp)) === toDateString(dateObj));
                    const dayReminders = reminders.filter(r => toDateString(new Date(r.date)) === toDateString(dateObj));
                    const hasReminder = dayReminders.length > 0;
                    const reminderTitle = hasReminder ? dayReminders[0].title : "";

                    return (
                        <button 
                            key={i} 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleDayClick(dateObj); }}
                            title={reminderTitle}
                            className={`
                                relative w-full aspect-square flex flex-col items-center justify-center rounded-xl transition-all duration-200
                                ${isSelected 
                                    ? 'bg-primary text-white shadow-md scale-105 z-10 ring-2 ring-primary ring-offset-2' 
                                    : isToday 
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 font-bold border border-blue-200' 
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800/50 border border-transparent'}
                            `}
                        >
                            <span className="text-base sm:text-lg font-semibold">{i + 1}</span>
                            <div className="flex space-x-1 mt-1.5 min-h-[8px]">
                                {hasAudit && <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-green-500'}`}></div>}
                                {hasReminder && <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-purple-500'}`}></div>}
                            </div>
                        </button>
                    );
                })}
            </div>
            
            {selectedDate ? (
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-slideUp shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Set Goal for {selectedDate.toLocaleDateString()}</span>
                        <button onClick={() => setSelectedDate(null)} className="text-gray-400 hover:text-gray-600 text-xs font-bold">CLOSE</button>
                    </div>
                    <form onSubmit={handleSaveReminder} className="flex gap-2">
                        <input 
                            type="text" 
                            value={newReminderText}
                            onChange={(e) => setNewReminderText(e.target.value)}
                            placeholder="e.g. Audit video..."
                            className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
                            autoFocus
                        />
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors shadow-md">
                            Save
                        </button>
                    </form>
                </div>
            ) : (
                 <div className="mt-2 flex justify-center gap-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>Done</div>
                    <div className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-1.5"></span>Planned</div>
                    <div className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></span>Today</div>
                </div>
            )}
        </div>
    );
}

const WeaknessAnalyzer: React.FC<{ history: HistoricAnalysisResult[] }> = ({ history }) => {
    const dimensionTotals: Record<string, { sum: number, count: number }> = {};
    history.forEach(h => {
        const process = (key: string, scoreObj: any) => {
            if (scoreObj && scoreObj.score > -1) {
                if (!dimensionTotals[key]) dimensionTotals[key] = { sum: 0, count: 0 };
                dimensionTotals[key].sum += scoreObj.score;
                dimensionTotals[key].count += 1;
            }
        };
        ['seo', 'humanization', 'linking', 'hook', 'visuals'].forEach(k => process(k, (h as any)[k]));
    });

    const averages = Object.entries(dimensionTotals)
        .map(([key, val]) => ({ key, avg: Math.round(val.sum / val.count) }))
        .sort((a, b) => a.avg - b.avg);

    if (averages.length === 0) return <p className="text-gray-500 italic text-xs">No data yet.</p>;

    return (
        <div className="space-y-3">
            {averages.slice(0, 3).map((item) => (
                <div key={item.key} className="group">
                    <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300 uppercase">
                        <span>{item.key}</span>
                        <span className={item.avg < 50 ? 'text-error' : 'text-warning'}>{item.avg}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                        <div className={`h-full rounded-full ${item.avg < 50 ? 'bg-error' : 'bg-warning'}`} style={{ width: `${item.avg}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

const ProgressPage: React.FC<ProgressPageProps> = ({ history }) => {
  const [reminders, setReminders] = useState<CalendarReminder[]>([]);
  const [targetScore, setTargetScore] = useState(85);
  const [monthlyGoal, setMonthlyGoal] = useState(10);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
        if(auth.currentUser) {
            const docRef = doc(db, 'users', auth.currentUser.uid);
            const snap = await getDoc(docRef);
            if(snap.exists()) {
                const data = snap.data() as UserProfile;
                if(data.goals) {
                    setTargetScore(data.goals.targetScore);
                    setMonthlyGoal(data.goals.monthlyAuditGoal);
                }
                if(data.reminders) {
                    setReminders(data.reminders);
                }
            }
        }
    }
    loadData();
  }, []);

  const saveGoals = async () => {
      if(!auth.currentUser) return;
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
          goals: { targetScore, monthlyAuditGoal: monthlyGoal }
      }, { merge: true });
      setIsEditingGoals(false);
  };

  const handleAddReminder = async (date: Date, title: string) => {
      if (!auth.currentUser) return;
      const newReminder: CalendarReminder = { date: date.toISOString(), title, completed: false };
      const updatedReminders = [...reminders, newReminder];
      setReminders(updatedReminders);
      await setDoc(doc(db, 'users', auth.currentUser.uid), { reminders: arrayUnion(newReminder) }, { merge: true });
  };

  const currentMonthAudits = history.filter(h => {
      const d = new Date(h.timestamp);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const avgScore = history.length > 0 ? Math.round(history.reduce((a,b) => a + b.overall.score, 0) / history.length) : 0;

  return (
    // FIX: Increased top padding to pt-40 (160px) to clear header.
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-12 pt-40">
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-light-text dark:text-dark-text flex items-center mb-6">
            <TrendingUpIcon className="w-7 h-7 mr-2 text-primary" />
            Progress & Analytics
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Charts */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
              <Card className="p-6">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white mb-4">Score Velocity</h3>
                  <ImprovedVelocityChart data={history} />
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                     <div className="flex items-center space-x-2 mb-6">
                        <CalendarIcon className="w-5 h-5 text-green-500" />
                        <h3 className="font-bold text-base">Audit Schedule</h3>
                     </div>
                     <SmartCalendar history={history} reminders={reminders} onAddReminder={handleAddReminder} />
                  </Card>
                  <Card className="p-6">
                      <h3 className="font-bold text-sm mb-3 flex items-center">
                          <PieChartIcon className="w-4 h-4 mr-2 text-purple-500" />
                          Content Mix
                      </h3>
                      <ContentMixPie articles={history.filter(h => h.contentType !== 'video').length} videos={history.filter(h => h.contentType === 'video').length} />
                  </Card>
              </div>
          </div>

          {/* Right Column: Goals */}
          <div className="space-y-6 min-w-0">
              <Card className="bg-gradient-to-br from-primary to-blue-700 text-white border-none p-6 shadow-lg">
                <div className="flex justify-between items-start mb-8">
                    <h3 className="font-bold text-lg flex items-center"><TargetIcon className="w-5 h-5 mr-2 text-blue-200" /> Goals</h3>
                    <button onClick={() => isEditingGoals ? saveGoals() : setIsEditingGoals(true)} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors font-bold">
                        {isEditingGoals ? 'SAVE' : 'EDIT'}
                    </button>
                </div>
                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between text-sm text-blue-100 mb-2">
                            <span>Target Score</span>
                            {isEditingGoals ? <input type="number" value={targetScore} onChange={e => setTargetScore(Number(e.target.value))} className="w-16 text-right text-black rounded px-2 py-1 text-sm font-bold" /> : <span className="font-bold text-xl">{targetScore}</span>}
                        </div>
                        <div className="w-full bg-blue-900/40 rounded-full h-3"><div className={`h-full rounded-full transition-all duration-1000 ease-out ${avgScore >= targetScore ? 'bg-green-400' : 'bg-yellow-400'}`} style={{width: `${Math.min((avgScore/targetScore)*100, 100)}%`}}></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm text-blue-100 mb-2">
                            <span>Audits / Month</span>
                            {isEditingGoals ? <input type="number" value={monthlyGoal} onChange={e => setMonthlyGoal(Number(e.target.value))} className="w-16 text-right text-black rounded px-2 py-1 text-sm font-bold" /> : <span className="font-bold text-xl">{monthlyGoal}</span>}
                        </div>
                        <div className="w-full bg-blue-900/40 rounded-full h-3"><div className="bg-white h-full rounded-full transition-all duration-1000 ease-out" style={{width: `${Math.min((currentMonthAudits/monthlyGoal)*100, 100)}%`}}></div></div>
                    </div>
                </div>
              </Card>

              <Card className="p-6">
                  <h3 className="font-bold text-sm mb-6 flex items-center"><TrendingUpIcon className="w-4 h-4 mr-2 text-red-500 transform rotate-180" /> Lowest Metrics</h3>
                  <WeaknessAnalyzer history={history} />
              </Card>
          </div>
      </div>
    </div>
  );
};

export default ProgressPage;
