/**
 * Backend service: border_info_admin
 * Data managed through Django Admin
 * API exposed via frontier_consult gateway
 * TODO: GET /api/faq
 * EVENT: FAQ_VIEWED (Triggered on expansion)
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqService } from '../../services/faqService';
import type { FAQItem } from '../../types';

export default function FAQAccordion() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    faqService.getFAQs().then((data) => {
      setFaqs(data);
      setLoading(false);
    });
  }, []);

  const toggle = (id: number) => {
    // EVENT: FAQ_VIEWED
    // Backend publishes event to message broker (RabbitMQ/Kafka)
    setOpenId(openId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className="group rounded-xl bg-surface shadow-layered transition-all"
          >
            <button
              onClick={() => toggle(faq.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="pr-4 text-sm font-medium text-foreground" style={{ textWrap: 'balance' } as React.CSSProperties}>
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
