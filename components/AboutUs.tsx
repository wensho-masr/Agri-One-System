
import React from 'react';
import { Facebook, Instagram, Send, Phone, MessageCircle } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-white">Agri One</h1>
        <p className="text-xl text-emerald-500 font-medium">شريكك الموثوق في إدارة مبيعاتك الزراعية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl">
          <h3 className="text-2xl font-bold mb-4 text-emerald-400">ماذا نقدم؟</h3>
          <p className="text-slate-300 leading-relaxed">
            Agri One هو نظام متكامل مصمم خصيصاً للمزارع وتجار الجملة والأنشطة الزراعية. نهدف إلى تبسيط عملية تسجيل الفواتير، تتبع حركة التوصيل، وإدارة قاعدة بيانات العملاء بكل سهولة ويسر.
          </p>
        </div>
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl">
          <h3 className="text-2xl font-bold mb-4 text-emerald-400">من المستفيد؟</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center gap-2">• أصحاب المزارع والمنتجين الزراعيين.</li>
            <li className="flex items-center gap-2">• تجار الجملة والموزعين.</li>
            <li className="flex items-center gap-2">• المناديب وشركات التوصيل الزراعي.</li>
            <li className="flex items-center gap-2">• المحاسبين والمديرين الماليين.</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-800 p-10 rounded-3xl border border-slate-700 shadow-2xl text-center space-y-8">
        <h3 className="text-2xl font-bold">تواصل معنا</h3>
        <p className="text-slate-400">نحن هنا للإجابة على استفساراتك ودعمك في نمو عملك.</p>
        
        <div className="flex flex-wrap justify-center gap-6">
          <SocialLink href="https://www.facebook.com/share/17tWibfpg9/" icon={<Facebook />} label="فيسبوك" color="bg-blue-600" />
          <SocialLink href="https://www.instagram.com/blacklliister" icon={<Instagram />} label="انستجرام" color="bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600" />
          <SocialLink href="https://wa.me/201033706353" icon={<MessageCircle />} label="واتساب" color="bg-green-600" />
          <SocialLink href="https://t.me/wenshmaasr" icon={<Send />} label="تليجرام" color="bg-sky-500" />
        </div>

        <div className="pt-6 border-t border-slate-700">
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Phone size={18} />
            <span className="font-mono text-lg">01033706353</span>
          </div>
        </div>
      </div>

      <footer className="text-center text-slate-500 text-sm py-8">
        &copy; {new Date().getFullYear()} Agri One. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
};

const SocialLink = ({ href, icon, label, color }: { href: string, icon: React.ReactNode, label: string, color: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-2 group"
  >
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{label}</span>
  </a>
);

export default AboutUs;
