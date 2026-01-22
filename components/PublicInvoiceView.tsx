
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Added missing 'X' icon to imports
import { Printer, ArrowRight, Download, Share2, Phone, MapPin, Globe, Mail, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Invoice, InvoiceStatus } from '../types';

interface PublicInvoiceViewProps {
  invoices: Invoice[];
}

const PublicInvoiceView: React.FC<PublicInvoiceViewProps> = ({ invoices }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const invoice = invoices.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <div className="bg-rose-500/10 p-6 rounded-full text-rose-500 animate-bounce">
          <X size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-white">عذراً، الفاتورة غير موجودة</h2>
          <p className="text-slate-400">يبدو أن الرابط الذي تطلبه غير متاح حالياً أو تم حذفه.</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-2xl transition-all border border-slate-700"
        >
          <ArrowRight size={18} /> العودة للرئيسية
        </button>
      </div>
    );
  }

  const getPublicLink = () => {
    return window.location.href;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Action Bar - Hidden during print */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/50 backdrop-blur-md p-4 rounded-3xl border border-slate-700 shadow-xl no-print">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowRight size={20} />
          <span>رجوع</span>
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `فاتورة Agri One - ${invoice.id}`,
                  url: getPublicLink()
                });
              } else {
                navigator.clipboard.writeText(getPublicLink());
                alert('تم نسخ الرابط!');
              }
            }}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            <Share2 size={18} /> مشاركة
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            <Printer size={18} /> طباعة
          </button>
        </div>
      </div>

      {/* Main Invoice Document */}
      <div className="bg-white text-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-slate-200">
        {/* Modern Accent Bar */}
        <div className="h-4 bg-gradient-to-l from-emerald-600 via-emerald-500 to-emerald-400"></div>
        
        <div className="p-8 md:p-12 space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 p-2.5 rounded-2xl">
                   <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-emerald-500 text-xl">A</div>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-slate-900">Agri One</h1>
              </div>
              <div className="text-slate-500 space-y-1 text-sm font-medium">
                <p className="flex items-center gap-2"><Phone size={14} /> 01033706353</p>
                <p className="flex items-center gap-2"><Globe size={14} /> www.agri-one.com</p>
                <p className="flex items-center gap-2"><MapPin size={14} /> جمهورية مصر العربية</p>
              </div>
            </div>

            <div className="text-right md:text-left md:ml-auto">
              <h2 className="text-5xl font-black text-slate-200 uppercase leading-none mb-4 select-none">INVOICE</h2>
              <div className="space-y-1">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">رقم الفاتورة</p>
                <p className="text-2xl font-black text-emerald-600 font-mono">{invoice.id}</p>
                <div className="flex items-center gap-4 justify-end md:justify-start mt-2">
                   <div>
                     <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">تاريخ الإصدار</p>
                     <p className="text-sm font-bold">{new Date(invoice.date).toLocaleDateString('ar-EG')}</p>
                   </div>
                   <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      invoice.status === InvoiceStatus.Collected ? 'bg-emerald-100 text-emerald-700' :
                      invoice.status === InvoiceStatus.Delivered ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {invoice.status}
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To & QR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-3">مُوجه إلى:</h3>
                <p className="text-2xl font-black text-slate-900">{invoice.customerName}</p>
                <p className="text-lg font-bold text-slate-600 mt-1">{invoice.customerPhone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 flex items-start gap-2">
                  <MapPin size={16} className="mt-1 flex-shrink-0 text-slate-400" />
                  <span className="font-medium">{invoice.customerAddress}</span>
                </p>
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-500 mt-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  {invoice.customerCategory}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end justify-center">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 inline-block">
                <QRCodeSVG 
                  value={getPublicLink()} 
                  size={120} 
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-3 text-center md:text-left">امسح الكود للتحقق من صحة الفاتورة رقمياً</p>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-xs uppercase font-black tracking-widest">
                  <th className="px-6 py-5">الوصف / الصنف</th>
                  <th className="px-6 py-5 text-center">السعر</th>
                  <th className="px-6 py-5 text-center">الكمية</th>
                  <th className="px-6 py-5 text-left">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-900">{item.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">صنف زراعي عالي الجودة</p>
                    </td>
                    <td className="px-6 py-5 text-center text-sm font-medium text-slate-600">{item.price.toLocaleString()} ج.م</td>
                    <td className="px-6 py-5 text-center text-sm font-bold text-slate-900">{item.quantity}</td>
                    <td className="px-6 py-5 text-left text-sm font-black text-slate-900">{(item.price * item.quantity).toLocaleString()} ج.م</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer & Totals */}
          <div className="flex flex-col md:flex-row justify-between gap-12">
            <div className="flex-1 space-y-6">
              {invoice.notes && (
                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                  <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">ملاحظات إضافية</h4>
                  <p className="text-sm text-amber-800 font-medium italic leading-relaxed">"{invoice.notes}"</p>
                </div>
              )}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الشروط والأحكام</h4>
                <ul className="text-[10px] text-slate-500 space-y-1 font-medium list-disc list-inside">
                  <li>يرجى الاحتفاظ بهذه الفاتورة لضمان حقوق الاستبدال والتحصيل.</li>
                  <li>جميع المنتجات خاضعة لمعايير الجودة العالمية Agri One.</li>
                  <li>يتم التحصيل خلال الفترة المتفق عليها مع العميل.</li>
                </ul>
              </div>
            </div>

            <div className="md:w-72 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-bold">الإجمالي الفرعي</span>
                  <span className="text-slate-900 font-bold">{invoice.total.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-bold">الضريبة (0%)</span>
                  <span className="text-slate-900 font-bold">0.00 ج.م</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-bold">الخصم</span>
                  <span className="text-rose-500 font-bold">0.00 ج.م</span>
                </div>
              </div>
              <div className="pt-4 border-t-2 border-slate-900">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black text-slate-900">المبلغ الإجمالي</span>
                  <div className="text-right">
                    <p className="text-3xl font-black text-emerald-600">{invoice.total.toLocaleString()}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">جنيه مصري</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Branding Footer */}
          <div className="pt-12 border-t border-slate-100 text-center space-y-4">
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">شكراً لثقتكم في منتجاتنا</p>
             <div className="flex items-center justify-center gap-6">
                <div className="w-10 h-1 bg-slate-100"></div>
                <div className="text-xl font-black italic text-slate-300">Agri One Signature</div>
                <div className="w-10 h-1 bg-slate-100"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Public Footer */}
      <footer className="text-center pb-8 no-print">
         <p className="text-slate-500 text-xs font-bold">تم إنشاء هذه الفاتورة بواسطة نظام Agri One لإدارة المبيعات الزراعية</p>
      </footer>
    </div>
  );
};

export default PublicInvoiceView;
