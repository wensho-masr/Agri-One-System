
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Wallet, TrendingUp, Truck, CheckCircle2, Calendar, PlusCircle, ArrowLeft, ArrowUpRight, ArrowDownRight, Users } from 'lucide-react';
import { Invoice, InvoiceStatus, CustomerCategory } from '../types';

interface HomeProps {
  invoices: Invoice[];
}

const Home: React.FC<HomeProps> = ({ invoices }) => {
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  const filteredInvoices = useMemo(() => {
    if (!dateFilter.start && !dateFilter.end) return invoices;
    return invoices.filter(inv => {
      const date = new Date(inv.date);
      const start = dateFilter.start ? new Date(dateFilter.start) : new Date(0);
      const end = dateFilter.end ? new Date(dateFilter.end) : new Date(8640000000000000);
      return date >= start && date <= end;
    });
  }, [invoices, dateFilter]);

  const analytics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const prevMonth = prevMonthDate.getMonth();
    const prevMonthYear = prevMonthDate.getFullYear();

    let currentMonthTotal = 0;
    let prevMonthTotal = 0;

    invoices.forEach(inv => {
      const d = new Date(inv.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        currentMonthTotal += inv.total;
      } else if (d.getMonth() === prevMonth && d.getFullYear() === prevMonthYear) {
        prevMonthTotal += inv.total;
      }
    });

    const momGrowth = prevMonthTotal === 0 
      ? (currentMonthTotal > 0 ? 100 : 0) 
      : ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100;

    // Sales by Category
    const categoryMap: Record<string, number> = {
      [CustomerCategory.New]: 0,
      [CustomerCategory.Regular]: 0,
      [CustomerCategory.Wholesaler]: 0,
      [CustomerCategory.Farm]: 0,
    };

    filteredInvoices.forEach(inv => {
      categoryMap[inv.customerCategory] = (categoryMap[inv.customerCategory] || 0) + inv.total;
    });

    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    const totalSales = filteredInvoices.reduce((acc, inv) => acc + inv.total, 0);
    const pending = filteredInvoices.filter(i => i.status === InvoiceStatus.Pending).length;
    const delivered = filteredInvoices.filter(i => i.status === InvoiceStatus.Delivered).length;
    const collected = filteredInvoices.filter(i => i.status === InvoiceStatus.Collected).length;

    return { totalSales, pending, delivered, collected, momGrowth, currentMonthTotal, categoryData };
  }, [invoices, filteredInvoices]);

  const chartData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredInvoices.forEach(inv => {
      const dateStr = new Date(inv.date).toLocaleDateString('ar-EG');
      map[dateStr] = (map[dateStr] || 0) + inv.total;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).reverse().slice(0, 7);
  }, [filteredInvoices]);

  const STATUS_COLORS = ['#f59e0b', '#10b981', '#3b82f6'];
  const CAT_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden bg-slate-800 border border-slate-700 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              أهلاً بك في <span className="text-emerald-500">Agri One</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              نظامك المتكامل لإدارة المبيعات الزراعية بكل سهولة. ابدأ بتسجيل مبيعاتك اليوم وراقب نمو عملك لحظة بلحظة.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
              <Link 
                to="/create" 
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-8 py-4 rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
              >
                <PlusCircle size={24} />
                إنشاء فاتورة جديدة
              </Link>
              <Link 
                to="/registry" 
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-2 transition-all"
              >
                عرض سجل الفواتير
                <ArrowLeft size={20} />
              </Link>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-700 backdrop-blur-sm rotate-3 shadow-xl">
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500">
                    <TrendingUp size={24} />
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">نمو المبيعات</p>
                    <p className="text-xl font-bold text-white">{analytics.momGrowth > 0 ? '+' : ''}{analytics.momGrowth.toFixed(1)}%</p>
                 </div>
               </div>
               <div className="flex gap-1">
                  {[40, 70, 45, 90, 65, 80].map((h, i) => (
                    <div key={i} style={{height: `${h}px`}} className="w-4 bg-emerald-500 rounded-t-sm"></div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">لوحة الإحصائيات</h2>
          <p className="text-slate-400 mt-1">نظرة عامة على الأداء المالي والعمليات.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-slate-800 p-2 rounded-xl border border-slate-700">
          <Calendar size={18} className="text-slate-400 ml-2" />
          <input 
            type="date" 
            className="bg-transparent border-none focus:ring-0 text-sm cursor-pointer"
            onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
          />
          <span className="text-slate-600">إلى</span>
          <input 
            type="date" 
            className="bg-transparent border-none focus:ring-0 text-sm cursor-pointer"
            onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="إجمالي المبيعات" 
          value={`${analytics.totalSales.toLocaleString()} ج.م`} 
          icon={<Wallet />} 
          color="emerald" 
          trend={analytics.momGrowth}
          trendLabel="مقارنة بالشهر السابق"
        />
        <StatCard title="جاري التوصيل" value={analytics.pending.toString()} icon={<Truck />} color="amber" />
        <StatCard title="تم التوصيل" value={analytics.delivered.toString()} icon={<CheckCircle2 />} color="blue" />
        <StatCard title="تم التحصيل" value={analytics.collected.toString()} icon={<TrendingUp />} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">المبيعات الأخيرة (باليوم)</h3>
            <div className="text-xs text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700">آخر 7 أيام نشطة</div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-6">توزيع المبيعات حسب الفئة</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CAT_COLORS[index % CAT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {analytics.categoryData.map((cat, idx) => (
              <div key={cat.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: CAT_COLORS[idx % CAT_COLORS.length]}}></div>
                  <span className="text-slate-300">{cat.name}</span>
                </div>
                <span className="font-bold text-white">{cat.value.toLocaleString()} ج.م</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-6">حالة الطلبات الحالية</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-[200px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'جاري', value: analytics.pending },
                      { name: 'تم التوصيل', value: analytics.delivered },
                      { name: 'تم التحصيل', value: analytics.collected }
                    ]}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[0, 1, 2].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
               <div className="p-4 bg-slate-900/50 rounded-xl border border-amber-500/20 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm font-medium">جاري التوصيل</span>
                  </div>
                  <span className="text-lg font-bold">{analytics.pending}</span>
               </div>
               <div className="p-4 bg-slate-900/50 rounded-xl border border-emerald-500/20 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-medium">تم التوصيل</span>
                  </div>
                  <span className="text-lg font-bold">{analytics.delivered}</span>
               </div>
               <div className="p-4 bg-slate-900/50 rounded-xl border border-blue-500/20 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">تم التحصيل</span>
                  </div>
                  <span className="text-lg font-bold">{analytics.collected}</span>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col justify-center items-center text-center space-y-6">
           <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
              <Users size={40} />
           </div>
           <div>
              <h3 className="text-xl font-bold mb-2">توسيع قاعدة العملاء</h3>
              <p className="text-slate-400 max-w-xs mx-auto">لديك الآن مجموعة متنوعة من العملاء. يمكنك إدارة تفاصيلهم وفواتيرهم من دليل العملاء.</p>
           </div>
           <Link to="/customers" className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-xl transition-all font-bold">عرض دليل العملاء</Link>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend, trendLabel }: { title: string, value: string, icon: React.ReactNode, color: string, trend?: number, trendLabel?: string }) => {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-500',
    amber: 'bg-amber-500/10 text-amber-500',
    blue: 'bg-blue-500/10 text-blue-500',
    indigo: 'bg-indigo-500/10 text-indigo-500',
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all cursor-default group shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <h4 className="text-2xl font-bold mb-2">{value}</h4>
      {trendLabel && <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{trendLabel}</p>}
    </div>
  );
};

export default Home;
