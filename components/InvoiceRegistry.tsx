
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Printer, Edit, Trash2, X, Calendar } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Invoice, InvoiceStatus } from '../types';
import CenteredSelect from './CenteredSelect';

interface InvoiceRegistryProps {
  invoices: Invoice[];
  onDelete: (id: string) => void;
  onUpdate: (updated: Invoice) => void;
}

const InvoiceRegistry: React.FC<InvoiceRegistryProps> = ({ invoices, onDelete, onUpdate }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'All'>('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = inv.customerName.toLowerCase().includes(search.toLowerCase()) || inv.id.includes(search);
      const matchesProduct = !productSearch || inv.items.some(item => item.name.toLowerCase().includes(productSearch.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
      
      let matchesDate = true;
      if (dateRange.start || dateRange.end) {
        const invDate = new Date(inv.date);
        const start = dateRange.start ? new Date(dateRange.start) : new Date(0);
        const end = dateRange.end ? new Date(dateRange.end) : new Date(8640000000000000);
        matchesDate = invDate >= start && invDate <= end;
      }

      return matchesSearch && matchesProduct && matchesStatus && matchesDate;
    });
  }, [invoices, search, productSearch, statusFilter, dateRange]);

  const handleStatusChange = (invoice: Invoice, newStatus: InvoiceStatus) => {
    onUpdate({ ...invoice, status: newStatus });
  };

  const handlePrint = (invoice: Invoice) => {
    window.print();
  };

  const statusOptions = [
    { label: 'كل الحالات', value: 'All' },
    ...Object.values(InvoiceStatus).map(s => ({ label: s, value: s }))
  ];

  const statusUpdateOptions = Object.values(InvoiceStatus).map(s => ({ label: s, value: s }));

  const getPublicLink = (id: string) => {
    return `${window.location.origin}${window.location.pathname}#/invoice/view/${id}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">سجل الفواتير</h1>
        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <span className="px-3 py-1 text-sm text-slate-400">الإجمالي: {filteredInvoices.length} فاتورة</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg no-print">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="بحث باسم العميل أو رقم الفاتورة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="بحث باسم المنتج..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />
        </div>
        <div>
          <CenteredSelect 
            label="تصفية حسب الحالة"
            options={statusOptions}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as any)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Calendar size={18} className="text-slate-500" />
          <input 
            type="date"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs"
            onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
          />
          <span className="text-slate-600">-</span>
          <input 
            type="date"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs"
            onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))}
          />
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-700/50 text-slate-300 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">رقم الفاتورة</th>
                <th className="px-6 py-4">العميل</th>
                <th className="px-6 py-4">التصنيف</th>
                <th className="px-6 py-4">التاريخ</th>
                <th className="px-6 py-4">الإجمالي</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4 text-left no-print">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-emerald-500 cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                    {inv.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{inv.customerName}</div>
                    <div className="text-xs text-slate-500">{inv.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-900 border border-slate-600 rounded text-xs">
                      {inv.customerCategory}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {new Date(inv.date).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="px-6 py-4 font-bold">
                    {inv.total.toLocaleString()} ج.م
                  </td>
                  <td className="px-6 py-4">
                    <CenteredSelect 
                      variant="table"
                      options={statusUpdateOptions}
                      value={inv.status}
                      onChange={(newVal) => handleStatusChange(inv, newVal as InvoiceStatus)}
                      className={
                        inv.status === InvoiceStatus.Collected ? 'bg-blue-500/10 text-blue-500' :
                        inv.status === InvoiceStatus.Delivered ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-amber-500/10 text-amber-500'
                      }
                    />
                  </td>
                  <td className="px-6 py-4 text-left no-print">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/edit/${inv.id}`)} className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white transition-colors" title="تعديل">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handlePrint(inv)} className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white transition-colors" title="طباعة">
                        <Printer size={18} />
                      </button>
                      <button onClick={() => setDeleteConfirmId(inv.id)} className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-500 transition-colors" title="حذف">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    لا توجد فواتير تطابق شروط البحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-800 w-full max-w-3xl rounded-3xl border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-slate-800 z-10">
              <div>
                <h2 className="text-2xl font-bold">تفاصيل الفاتورة <span className="text-emerald-500">{selectedInvoice.id}</span></h2>
                <p className="text-sm text-slate-400">{new Date(selectedInvoice.date).toLocaleString('ar-EG')}</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">بيانات العميل</h4>
                  <p className="text-xl font-bold">{selectedInvoice.customerName}</p>
                  <p className="text-slate-400">{selectedInvoice.customerPhone}</p>
                  <p className="text-slate-400">{selectedInvoice.customerAddress}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-slate-700 rounded-lg text-xs">{selectedInvoice.customerCategory}</span>
                </div>
                
                <div className="flex flex-col items-center md:items-end gap-4">
                  <div className="text-center md:text-left">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">رابط العرض (QR)</h4>
                    <div className="p-3 bg-white rounded-2xl shadow-lg inline-block">
                      <QRCodeSVG 
                        value={getPublicLink(selectedInvoice.id)} 
                        size={100} 
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                  </div>
                  <div className="md:text-left">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">الحالة</h4>
                    <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
                      selectedInvoice.status === InvoiceStatus.Collected ? 'bg-blue-500/20 text-blue-500' :
                      selectedInvoice.status === InvoiceStatus.Delivered ? 'bg-emerald-500/20 text-emerald-500' :
                      'bg-amber-500/20 text-amber-500'
                    }`}>
                      {selectedInvoice.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">المنتجات</h4>
                <div className="bg-slate-900/50 rounded-2xl border border-slate-700 overflow-hidden">
                  <table className="w-full text-right">
                    <thead className="bg-slate-700/50 text-xs">
                      <tr>
                        <th className="px-4 py-3">الصنف</th>
                        <th className="px-4 py-3">السعر</th>
                        <th className="px-4 py-3">الكمية</th>
                        <th className="px-4 py-3">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700 text-sm">
                      {selectedInvoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">{item.name}</td>
                          <td className="px-4 py-3">{item.price.toLocaleString()}</td>
                          <td className="px-4 py-3">{item.quantity}</td>
                          <td className="px-4 py-3 font-bold">{ (item.price * item.quantity).toLocaleString() }</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-700/30">
                        <td colSpan={3} className="px-4 py-4 font-bold">الإجمالي الكلي</td>
                        <td className="px-4 py-4 font-bold text-xl text-emerald-500">{selectedInvoice.total.toLocaleString()} ج.م</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">ملاحظات</h4>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 text-sm italic">
                    {selectedInvoice.notes}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4 no-print">
                <button 
                  onClick={() => handlePrint(selectedInvoice)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Printer size={20} /> طباعة الفاتورة
                </button>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-900 py-3 rounded-xl font-bold"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/90 animate-in zoom-in-95 duration-200">
          <div className="bg-slate-800 p-8 rounded-3xl border border-rose-500/30 shadow-2xl max-w-sm w-full text-center">
            <div className="bg-rose-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">تأكيد الحذف؟</h3>
            <p className="text-slate-400 mb-8">هل أنت متأكد من رغبتك في حذف هذه الفاتورة؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => { onDelete(deleteConfirmId); setDeleteConfirmId(null); }}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-bold transition-all"
              >
                نعم، احذف
              </button>
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl font-bold transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceRegistry;
