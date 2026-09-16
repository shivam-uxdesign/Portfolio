import { motion } from 'motion/react';
import { ArrowUpRight, Linkedin, Check } from 'lucide-react';
import { useState } from 'react';
import { trackEvent } from '../../lib/analytics';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined;

export function CTACard() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const openMailto = () => {
    const subject = name.trim() ? `Hello from ${name.trim()}` : 'Hello from Portfolio';
    const body = message.trim() || `Hi Shivam,\n\n`;
    window.location.href = `mailto:shvmshgl@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSayHello = async () => {
    if (status === 'sending') return;

    // No form backend configured yet — fall back to opening the visitor's own mail client
    if (!FORMSPREE_ENDPOINT) {
      trackEvent('contact_form_submit', { method: 'mailto' });
      openMailto();
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Anonymous',
          message: message.trim() || '(no message)',
        }),
      });
      if (res.ok) {
        trackEvent('contact_form_submit', { method: 'formspree' });
        setStatus('sent');
        setName('');
        setMessage('');
        setTimeout(() => setStatus('idle'), 3500);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-foreground to-foreground/90 rounded-2xl p-3.5 md:p-6 border border-foreground/80 flex flex-col relative overflow-hidden max-w-[480px] mx-auto w-full h-full"
      style={{ boxShadow: '0 40px 80px -30px rgba(20,20,18,0.4), 0 12px 28px -12px rgba(20,20,18,0.25)' }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0"
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex flex-col h-full justify-center">
        <p className="text-[12px] text-background/70 mb-1.5 uppercase tracking-[0.07em]">Let's Connect</p>
        <p className="text-[15px] text-background/90 mb-1.5 leading-snug">
          I read every message myself — usually within a day, chai in hand.
        </p>
        <p className="text-[12px] text-background/55 mb-2 leading-snug">
          Always happy to talk design, systems, or motorcycles.
        </p>

        {/* Optional name + message — folded into the mailto if filled in */}
        <div className="flex flex-col gap-1.5 mb-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            aria-label="Your name (optional)"
            className="w-full bg-background/10 border border-background/20 rounded-lg px-3 py-1.5 text-[13px] text-background placeholder:text-background/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 transition-colors"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message (optional)"
            aria-label="Your message (optional)"
            rows={1}
            className="w-full resize-none bg-background/10 border border-background/20 rounded-lg px-3 py-1.5 text-[13px] text-background placeholder:text-background/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 transition-colors"
          />
        </div>

        {/* Primary CTA Row with LinkedIn */}
        <div className="flex gap-2.5">
          <motion.button
            onClick={handleSayHello}
            onMouseEnter={() => setHoveredButton('main')}
            onMouseLeave={() => setHoveredButton(null)}
            disabled={status === 'sending'}
            className="flex-1 bg-background text-foreground rounded-xl px-3 md:px-5 py-3 flex items-center justify-center gap-2 group relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 whitespace-nowrap disabled:opacity-70"
            whileHover={status === 'idle' ? { scale: 1.02 } : undefined}
            whileTap={status === 'idle' ? { scale: 0.98 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <span className="text-[14px] font-medium" aria-live="polite">
              {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Message sent' : status === 'error' ? 'Try again' : 'Say Hello'}
            </span>
            {status === 'sent' ? (
              <Check className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <motion.div
                animate={{ x: hoveredButton === 'main' ? 4 : 0, y: hoveredButton === 'main' ? -4 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
              </motion.div>
            )}

            <motion.div
              className="absolute inset-0 bg-primary/10 rounded-xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: hoveredButton === 'main' ? 1 : 0,
                opacity: hoveredButton === 'main' ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <motion.button
            className="bg-background/10 backdrop-blur-sm text-background hover:bg-background/20 rounded-xl px-4 py-3 flex items-center justify-center border border-background/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => window.open('https://www.linkedin.com/in/shivamsehgal26/', '_blank')}
            title="LinkedIn"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}