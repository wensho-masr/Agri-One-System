
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Plus, Trash2, AlertCircle, MapPin } from 'lucide-react';
import { Invoice, InvoiceItem, CustomerCategory, InvoiceStatus } from '../types';
import CenteredSelect from './CenteredSelect';

interface CreateInvoiceProps {
  onAdd: (invoice: Invoice) => void;
  onUpdate: (invoice: Invoice) => void;
  invoices: Invoice[];
}

const egyptGovernorates = [
  'القاهرة', 'الإسكندرية', 'الإسماعيلية', 'أسوان', 'أسيوط', 'الأقصر', 'البحر الأحمر', 
  'البحيرة', 'بني سويف', 'بورسعيد', 'جنوب سيناء', 'الجيزة', 'الدقهلية', 'دمياط', 
  'سوهاج', 'السويس', 'الشرقية', 'شمال سيناء', 'الغربية', 'الفيوم', 'القليوبية', 
  'قنا', 'كفر الشيخ', 'مطروح', 'المنوفية', 'المنيا', 'الوادي الجديد'
];

const CreateInvoice: React.FC<CreateInvoiceProps> = ({ onAdd, onUpdate, invoices }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isDirty, setIsDirty] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerCategory: CustomerCategory.New,
    notes: '',
    status: InvoiceStatus.Pending,
    date: new Date().toISOString()
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', name: '', price: 0, quantity: 1 }
  ]);

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (id) {
      const existingInvoice = invoices.find(inv => inv.id === id);
      if (existingInvoice) {
        setFormData({
          customerName: existingInvoice.customerName,
          customerPhone: existingInvoice.customerPhone,
          customerAddress: existingInvoice.customerAddress,
          customerCategory: existingInvoice.customerCategory,
          notes: existingInvoice.notes,
          status: existingInvoice.status,
          date: existingInvoice.date
        });
        setItems(existingInvoice.items);
      }
    }
  }, [id, invoices]);

  // Extract unique product names for autocomplete
  const existingProductNames = useMemo(() => {
    const names = new Set<string>();
    invoices.forEach(inv => {
      inv.items.forEach(item => {
        if (item.name) names.add(item.name);
      });
    });
    return Array.from(names);
  }, [invoices]);

  // Extract unique customers for autocomplete
  const existingCustomers = useMemo(() => {
    const map = new Map<string, { phone: string, address: string, category: CustomerCategory }>();
    invoices.forEach(inv => {
      if (!map.has(inv.customerName)) {
        map.set(inv.customerName, {
          phone: inv.customerPhone,
          address: inv.customerAddress,
          category: inv.customerCategory
        });
      }
    });
    return Array.from(map.entries());
  }, [invoices]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setIsDirty(true);
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-fill logic if name matches an existing customer exactly
    if (name === 'customerName') {
      const existing = existingCustomers.find(([customerName]) => customerName === value);
      if (existing) {
        const [_, data] = existing;
        setFormData(prev => ({
          ...prev,
          customerPhone: data.phone,
          customerAddress: data.address,
          customerCategory: data.category
        }));
      }
    }
  };

  const addItem = () => {
    setIsDirty(true);
    setItems(prev => [...prev, { id: Date.now().toString(), name: '', price: 0, quantity: 1 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setIsDirty(true);
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setIsDirty(true);
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone) {
      alert('يرجى إكمال بيانات العميل الأساسية');
      return;
    }

    const invoiceData: Invoice = {
      id: id || `INV-${Date.now().toString().slice(-6)}`,
      ...formData,
      items,
      total: calculateTotal()
    };

    if (isEditMode) {
      onUpdate(invoiceData);
    } else {
      onAdd(invoiceData);
    }
    
    setIsDirty(false);
    navigate('/registry');
  };

  const categoryOptions = Object.values(CustomerCategory).map(cat => ({ label: cat, value: cat }));
  const govOptions = egyptGovernorates.map(gov => ({ label: gov, value: gov }));

  const handleGovSelect = (gov: string) => {
    setIsDirty(true);
    setFormData(prev => {
      // If address already has a value, check if we should prepend or append
      const currentAddress = prev.customerAddress.trim();
      if (!currentAddress) return { ...prev, customerAddress: gov };
      if (currentAddress.includes(gov)) return prev;
      return { ...prev, customerAddress: `${gov} - ${currentAddress}` };
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{isEditMode ? 'تعديل الفاتورة' : 'إنشاء فاتورة جديدة'}</h1>
        {isDirty && (
          <div className="flex items-center gap-2 text-amber-500 text-sm bg-amber-500/10 px-3 py-1 rounded-full">
            <AlertCircle size={14} /> لديك تغييرات غير محفوظة
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
          <h3 className="text-xl font-semibold border-b border-slate-700 pb-3">بيانات العميل</h3>
          
          <datalist id="customer-suggestions">
            {existingCustomers.map(([name]) => (
              <option key={name} value={name} />
            ))}
          </datalist>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-slate-400">اسم العميل</label>
              <input 
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                list="customer-suggestions"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="أدخل اسم العميل (أو اختر من المسجلين)"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-400">رقم الهاتف</label>
              <input 
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="01xxxxxxxxx"
              />
            </div>
            
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm text-slate-400">العنوان</label>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="w-full md:w-1/3">
                  <CenteredSelect 
                    label="اختر المحافظة"
                    options={govOptions}
                    value=""
                    onChange={handleGovSelect}
                  />
                </div>
                <input 
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleInputChange}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="أدخل العنوان بالتفصيل"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-400">تصنيف العميل</label>
              <CenteredSelect 
                label="اختر تصنيف العميل"
                options={categoryOptions}
                value={formData.customerCategory}
                onChange={(val) => {
                  setIsDirty(true);
                  setFormData(prev => ({ ...prev, customerCategory: val as CustomerCategory }));
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h3 className="text-xl font-semibold">المنتجات</h3>
            <button 
              type="button" 
              onClick={addItem}
              className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-500/20 transition-all text-sm font-semibold"
            >
              <Plus size={18} /> إضافة منتج
            </button>
          </div>

          <div className="overflow-x-auto">
            <datalist id="product-suggestions">
              {existingProductNames.map(name => (
                <option key={name} value={name} />
              ))}
            </datalist>

            <table className="w-full border-collapse">
              <thead>
                <tr className="text-right text-slate-400 text-sm">
                  <th className="py-2 pr-2">المنتج</th>
                  <th className="py-2 px-2 w-32">السعر</th>
                  <th className="py-2 px-2 w-24">الكمية</th>
                  <th className="py-2 px-2 w-32">الإجمالي</th>
                  <th className="py-2 pl-2 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-700/50">
                    <td className="py-3 pr-2">
                      <input 
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 placeholder-slate-600"
                        placeholder="اسم الصنف"
                        list="product-suggestions"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input 
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-center"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input 
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-center"
                      />
                    </td>
                    <td className="py-3 px-2 text-emerald-500 font-bold text-center">
                      {(item.price * item.quantity).toLocaleString()}
                    </td>
                    <td className="py-3 pl-2 text-center">
                      <button 
                        type="button" 
                        onClick={() => removeItem(item.id)}
                        className="text-rose-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 w-full md:w-64">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">إجمالي الفاتورة:</span>
                <span className="text-2xl font-bold text-emerald-500">{calculateTotal().toLocaleString()} <span className="text-sm font-normal">ج.م</span></span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
          <h3 className="text-xl font-semibold border-b border-slate-700 pb-3">ملاحظات إضافية</h3>
          <textarea 
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            placeholder="أدخل أي ملاحظات هنا..."
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            type="submit" 
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} /> {isEditMode ? 'تحديث الفاتورة' : 'حفظ الفاتورة'}
          </button>
          <button 
            type="button"
            onClick={() => {
              if (!isDirty || confirm('هل تريد العودة؟ سيتم فقدان البيانات غير المحفوظة.')) {
                navigate(-1);
              }
            }}
            className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
