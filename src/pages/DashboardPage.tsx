/**
 * PAGE 2: FAQ + AI ASSISTANT
 * Primary dashboard for microservice interaction.
 *
 * Service integrations:
 * - border_info_admin → FAQ section (left)
 * - ai_for_chatbot → AI chat (right)
 * - release-orchestrator-idp → Status indicator (nav)
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import FAQAccordion from '../components/faq/Accordion';
import ChatWidget from '../components/chat/ChatWidget';
import ReleaseStatusCard from '../components/release/StatusCard';
import { authService } from '../services/authService';

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          
          <div className="flex items-center gap-4">
            {/* Backend service: release-orchestrator-idp */}
            <ReleaseStatusCard />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* LEFT: FAQ SECTION (border_info_admin) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7"
          >
            <header className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
              <p className="mt-2 text-muted-foreground">
                Frequently asked questions about the ecosystem.
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Data source: border_info_admin via frontier_consult gateway
              </p>
            </header>
            <FAQAccordion />
          </motion.section>

          {/* RIGHT: AI CHAT (ai_for_chatbot) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="sticky top-28">
              <div className="rounded-xl bg-surface p-6 shadow-layered">
                <h2 className="text-lg font-semibold">AI Assistant</h2>
                <p className="mt-1 mb-6 text-sm text-muted-foreground">
                  Didn't find your answer? Ask the AI assistant.
                </p>
                <ChatWidget />
                <p className="mt-4 text-xs text-muted-foreground/60">
                  Powered by ai_for_chatbot via frontier_consult gateway
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
