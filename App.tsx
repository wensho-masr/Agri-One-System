
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutGrid, PlusCircle, ReceiptText, Users, Info, Menu, X } from 'lucide-react';
import Home from './components/Home';
import CreateInvoice from './components/CreateInvoice';
import InvoiceRegistry from './components/InvoiceRegistry';
import CustomerDirectory from './components/CustomerDirectory';
import AboutUs from './components/AboutUs';
import PublicInvoiceView from './components/PublicInvoiceView';
import { Invoice, Customer } from './types';

const App: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    const saved = localStorage.getItem('agri_one_invoices');
    if (saved) {
      setInvoices(JSON.parse(saved));
    }
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem('agri_one_invoices', JSON.stringify(invoices));
  }, [invoices]);

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
  };

  const updateInvoice = (updated: Invoice) => {
    setInvoices(prev => prev.map(inv => inv.id === updated.id ? updated : inv));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500/30">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-slate-800/80 backdrop-blur-md border-b border-slate-700 no-print">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
                  <LayoutGrid className="text-slate-900" size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">Agri One</span>
              </div>

              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Desktop menu */}
              <div className="hidden md:flex items-center gap-1">
                <NavLink to="/" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive ? 'bg-emerald-500 text-slate-900' : 'hover:bg-slate-700 text-slate-300'}`}>
                  <LayoutGrid size={18} /> الصفحة الرئيسية
                </NavLink>
                <NavLink to="/create" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive ? 'bg-emerald-500 text-slate-900' : 'hover:bg-slate-700 text-slate-300'}`}>
                  <PlusCircle size={18} /> إنشاء فاتورة
                </NavLink>
                <NavLink to="/registry" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive ? 'bg-emerald-500 text-slate-900' : 'hover:bg-slate-700 text-slate-300'}`}>
                  <ReceiptText size={18} /> سجل الفواتير
                </NavLink>
                <NavLink to="/customers" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive ? 'bg-emerald-500 text-slate-900' : 'hover:bg-slate-700 text-slate-300'}`}>
                  <Users size={18} /> دليل العملاء
                </NavLink>
                <NavLink to="/about" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive ? 'bg-emerald-500 text-slate-900' : 'hover:bg-slate-700 text-slate-300'}`}>
                  <Info size={18} /> من نحن
                </NavLink>
              </div>
            </div>
          </div>

          {/* Mobile menu panel */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-slate-800 border-b border-slate-700 pb-4 px-4`}>
            <div className="flex flex-col gap-2">
              <NavLink onClick={() => setIsMenuOpen(false)} to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 text-slate-300">
                <LayoutGrid size={20} /> الصفحة الرئيسية
              </NavLink>
              <NavLink onClick={() => setIsMenuOpen(false)} to="/create" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 text-slate-300">
                <PlusCircle size={20} /> إنشاء فاتورة
              </NavLink>
              <NavLink onClick={() => setIsMenuOpen(false)} to="/registry" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 text-slate-300">
                <ReceiptText size={20} /> سجل الفواتير
              </NavLink>
              <NavLink onClick={() => setIsMenuOpen(false)} to="/customers" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 text-slate-300">
                <Users size={20} /> دليل العملاء
              </NavLink>
              <NavLink onClick={() => setIsMenuOpen(false)} to="/about" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 text-slate-300">
                <Info size={20} /> من نحن
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home invoices={invoices} />} />
            <Route path="/create" element={<CreateInvoice onAdd={addInvoice} onUpdate={updateInvoice} invoices={invoices} />} />
            <Route path="/edit/:id" element={<CreateInvoice onAdd={addInvoice} onUpdate={updateInvoice} invoices={invoices} />} />
            <Route path="/registry" element={<InvoiceRegistry invoices={invoices} onDelete={deleteInvoice} onUpdate={updateInvoice} />} />
            <Route path="/customers" element={<CustomerDirectory invoices={invoices} />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/invoice/view/:id" element={<PublicInvoiceView invoices={invoices} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
