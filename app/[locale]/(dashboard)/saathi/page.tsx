'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Mic, Send, Volume2 } from 'lucide-react';
import { useFarmerStore } from '@/lib/stores/farmer';
import { aiService } from '@/lib/services';
import { useVoice } from '@/lib/hooks/useVoice';
import { VoiceStateBanner } from '@/components/ai/VoiceStateBanner';
import { cls } from '@/lib/utils';
import type { ChatMessage } from '@/types';

const EXAMPLE_QS = [
  'आज प्याज़ का भाव क्या है?',
  'कहां बेचूं?',
  'अभी बेचूं या रुकूं?',
  'मेरे पास 40 क्विंटल है, कितना मिलेगा?',
];

/**
 * Screen 7: AI Saathi — conversational heart of Farmo.
 * Voice-first. Readable text transcript always present.
 */
export default function SaathiPage() {
  const t = useTranslations('saathi');
  const locale = useLocale();
  const { mainCrop, quantity } = useFarmerStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'm0', role: 'assistant', text: t('subtitle'), time: '08:30' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const voice = useVoice(locale === 'en' ? 'en-IN' : 'hi-IN');

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || busy) return;
    setMessages((m) => [
      ...m,
      { id: `u${Date.now()}`, role: 'user', text: clean, time: now() },
    ]);
    setInput('');
    setBusy(true);
    const reply = await aiService.chat(clean, { crop: mainCrop, quantity });
    setMessages((m) => [
      ...m,
      { id: `a${Date.now()}`, role: 'assistant', text: reply, time: now() },
    ]);
    setBusy(false);
    voice.speak(reply);
  }

  function handleVoiceDone() {
    if (voice.transcript.trim()) {
      void send(voice.transcript);
    }
  }

  return (
    <div className="h-[calc(100dvh-64px)] md:h-[calc(100dvh-80px)] flex flex-col">
      {/* Header */}
      <div className="border-b border-outline-variant bg-surface-container-lowest px-margin md:px-margin-tablet py-3">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">{t('title')}</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant">{t('subtitle')}</p>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-margin md:px-margin-tablet py-space-md space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cls(
              'flex w-full',
              m.role === 'user' ? 'justify-end' : 'justify-start',
            )}
          >
            <div
              className={cls(
                'max-w-[85%] rounded-lg p-3',
                m.role === 'user'
                  ? 'bg-primary text-on-primary rounded-br-sm'
                  : 'bg-surface-container-lowest border border-outline-variant shadow-card rounded-bl-sm',
              )}
            >
              <p className="font-body-md text-body-md">{m.text}</p>
              <span
                className={cls(
                  'block mt-1 font-label-sm text-label-sm',
                  m.role === 'user' ? 'text-on-primary/60' : 'text-on-surface-variant',
                )}
              >
                {m.time}
              </span>
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center">
              <Volume2 className="w-4 h-4 animate-pulse" />
            </span>
            <span className="font-body-sm text-body-sm">{t('processing')}…</span>
          </div>
        )}
      </div>

      {/* Suggestion chips (empty-ish state) */}
      {messages.length <= 1 && (
        <div className="px-margin md:px-margin-tablet pb-2 flex flex-col gap-2">
          {EXAMPLE_QS.map((q) => (
            <button
              key={q}
              onClick={() => void send(q)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-surface-container text-on-surface text-left font-body-sm text-body-sm hover:bg-surface-container-high transition-colors tap-highlight"
            >
              <span className="text-secondary">🎙️</span>
              <span>{q}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="px-margin md:px-margin-tablet py-3 border-t border-outline-variant bg-surface-container-lowest">
        <VoiceStateBanner status={voice.status} />
        {voice.transcript && voice.status !== 'idle' && (
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
              “{voice.transcript}”
            </p>
            <button
              onClick={handleVoiceDone}
              className="h-12 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold shrink-0"
            >
              {t('send')}
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() =>
              voice.status === 'listening' ? voice.stopListening() : voice.startListening()
            }
            aria-label={t('tapToSpeak')}
            className={cls(
              'relative w-14 h-14 shrink-0 rounded-full flex items-center justify-center transition-all tap-highlight',
              voice.status === 'listening'
                ? 'bg-secondary text-on-secondary'
                : 'bg-primary text-on-primary',
            )}
          >
            {voice.status === 'listening' && (
              <span className="absolute inset-0 rounded-full bg-secondary-container/40 animate-mic-pulse" />
            )}
            <Mic className="w-7 h-7" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void send(input)}
            placeholder={t('typeMessage')}
            className="flex-1 h-14 px-4 font-body-md text-body-md border-2 border-outline-variant rounded-lg bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-secondary-fixed-dim"
          />
          <button
            onClick={() => void send(input)}
            disabled={!input.trim() || busy}
            aria-label="Send"
            className="w-14 h-14 shrink-0 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );

  function now() {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }
}