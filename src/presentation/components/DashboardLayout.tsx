import { useState, useEffect } from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import { getSettings } from '../../data/services/shopService';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [systemMessage, setSystemMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<string | null>(null);
  const [appVersion, setAppVersion] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        if (isMounted && data) {
          setSystemMessage(data.dashboard_message);
          setMessageType(data.dashboard_message_type);
          setAppVersion(data.dashboard_version);
        }
      } catch (error) {
      }
    };

    fetchSettings();

    return () => { isMounted = false; };
  }, []);

  const renderSystemMessage = () => {
    if (!systemMessage) return null;

    let styles = 'bg-blue-50 border-blue-200 text-blue-800';
    let icon = <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />;

    switch (messageType) {
      case 'success':
        styles = 'bg-emerald-50 border-emerald-200 text-emerald-800';
        icon = <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={20} />;
        break;
      case 'warning':
        styles = 'bg-amber-50 border-amber-200 text-amber-800';
        icon = <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />;
        break;
      case 'error':
        styles = 'bg-red-50 border-red-200 text-red-800';
        icon = <XCircle className="text-red-500 shrink-0 mt-0.5" size={20} />;
        break;
    }

    return (
      <div className={`mx-4 md:mx-8 mt-4 md:mt-6 p-4 rounded-2xl border flex items-start gap-3 shadow-sm animate-in slide-in-from-top-2 ${styles}`}>
        {icon}
        <p className="text-sm font-bold leading-relaxed">{systemMessage}</p>
      </div>
    );
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans selection:bg-blue-100 overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        appVersion={appVersion} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        {renderSystemMessage()}

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}