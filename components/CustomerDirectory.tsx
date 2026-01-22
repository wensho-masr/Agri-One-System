
import React, { useState, useMemo } from 'react';
import { Search, User, Phone, MapPin, Tag, Edit, ReceiptText, X, Save } from 'lucide-react';
import { Invoice, CustomerCategory } from '../types';
import CenteredSelect from './CenteredSelect';

interface CustomerDirectoryProps {
  invoices: Invoice[];
}

const CustomerDirectory: React.FC<CustomerDirectoryProps> = ({ invoices }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CustomerCategory | 'All'>('All');
  const [selectedCustomerPhone, setSelectedCustomerPhone] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<{name: string, phone: string, address: string, category: CustomerCategory} | null>(null);

  const uniqueCustomers = useMemo(() => {
    const map = new Map();
    invoices.forEach(inv => {
      if (!map.has(inv.customerPhone)) {
        map.set(inv.customerPhone, {
          name: inv.customerName,
          phone: inv.customerPhone,
          address: inv.customerAddress,
          category: inv.customerCategory
        });
      }
    });
    return Array.from(map.values());
  }, [invoices]);

  const filteredCustomers = useMemo(() => {
    return uniqueCustomers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
      const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [uniqueCustomers, search, categoryFilter]);

  const customerInvoices = useMemo(() => {
    if (!selectedCustomerPhone) return [];
    return invoices.filter(inv => inv.customerPhone === selectedCustomerPhone);
  }, [invoices, selectedCustomerPhone]);

  const categoryOptions = [
    { label: 'كل التصنيفات', value: 'All' },
    ...Object.values(CustomerCategory).map(cat => ({ label: cat, value: cat }))
  ];

  const editCategoryOptions = Object.values(CustomerCategory).map(cat => ({ label: cat, value: cat }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">دليل العملاء</h1>
        <div className="text-slate-400 text-sm">إجمالي العملاء المسجلين: {uniqueCustomers.length}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="بحث باسم العميل أو الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <CenteredSelect 
            label="تصفية حسب التصنيف"
            options={categoryOptions}
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val as any)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div 
            key={customer.phone} 
            className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-700 p-3 rounded-xl text-emerald-500">
                <User size={24} />
              </div>
              <div className="flex gap-2">
                <button 
                   onClick={() => setEditingCustomer(customer)}
                   className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => setSelectedCustomerPhone(customer.phone === selectedCustomerPhone ? null : customer.phone)}
                  className={`p-2 rounded-lg transition-colors ${selectedCustomerPhone === customer.phone ? 'bg-emerald-500 text-slate-900' : 'hover:bg-slate-700 text-slate-400'}`}
                >
                  <ReceiptText size={18} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">{customer.name}</h3>
            
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-emerald-500" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-emerald-500" />
                <span className="truncate">{customer.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-emerald-500" />
                <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-xs">
                  {customer.category}
                </span>
              </div>
            </div>

            {selectedCustomerPhone === customer.phone && (
              <div className="mt-6 pt-6 border-t border-slate-700 space-y-3 animate-in slide-in-from-top-4 duration-300">
                <h4 className="text-xs font-bold text-slate-500 uppercase">تاريخ الفواتير</h4>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 text-slate-100">
                  {customerInvoices.map(inv => (
                    <div key={inv.id} className="flex justify-between items-center p-2 bg-slate-900 rounded-lg text-xs">
                      <span className="font-bold text-emerald-500">{inv.id}</span>
                      <span>{new Date(inv.date).toLocaleDateString('ar-EG')}</span>
                      <span className="font-bold">{inv.total.toLocaleString()} ج.م</span>
                    </div>
                  ))}
                  {customerInvoices.length === 0 && (
                    <div className="text-center py-4 text-slate-600 text-xs">لا توجد فواتير سابقة</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingCustomer && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-800 w-full max-w-md rounded-3xl border border-slate-700 shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">تعديل بيانات العميل</h2>
              <button onClick={() => setEditingCustomer(null)} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">الاسم</label>
                <input 
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">رقم الهاتف</label>
                <input 
                  value={editingCustomer.phone}
                  readOnly
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">العنوان</label>
                <input 
                  value={editingCustomer.address}
                  onChange={(e) => setEditingCustomer({...editingCustomer, address: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">التصنيف</label>
                <CenteredSelect 
                  options={editCategoryOptions}
                  value={editingCustomer.category}
                  onChange={(val) => setEditingCustomer({...editingCustomer, category: val as CustomerCategory})}
                />
              </div>
              <button 
                onClick={() => {
                   alert('تم تحديث البيانات بنجاح (معاينة)');
                   setEditingCustomer(null);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-4"
              >
                <Save size={20} /> حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDirectory;
