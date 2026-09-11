'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { VoiceStatus } from '@/types';

const SUPPORTED = typeof window !== 'undefined' &&
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

type AnySpeechRecognition = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onerror: (event: { error?: string }) => void;
  onend: () => void;
};

function getRecognition(): AnySpeechRecognition | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    (window as unknown as Record<string, any>).SpeechRecognition ||
    (window as unknown as Record<string, any>).webkitSpeechRecognition;
  return Ctor ? (new Ctor() as AnySpeechRecognition) : null;
}

export interface UseVoiceReturn {
  status: VoiceStatus;
  transcript: string;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  cancel: () => void;
  speak: (text: string) => void;
}

/**
 * Voice hook for AI Saathi.
 * Uses the Web Speech API (SpeechRecognition + SpeechSynthesis) with
 * graceful fallback to a simulated "listening" state when unsupported.
 */
export function useVoice(locale = 'hi-IN'): UseVoiceReturn {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const recRef = useRef<AnySpeechRecognition | null>(null);
  const supported = useRef(SUPPORTED).current;

  const stopListening = useCallback(() => {
    recRef.current?.stop();
    setStatus((s) => (s === 'speaking' ? s : 'processing'));
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      recRef.current?.abort();
    };
  }, []);

  const startListening = useCallback(() => {
    setTranscript('');
    const rec = getRecognition();
    if (!rec) {
      // Fallback simulation when unsupported
      setStatus('listening');
      setTimeout(() => {
        setStatus('processing');
        setTimeout(() => {
          setTranscript('मेरी 40 क्विंटल प्याज़ कहां बेचूं?');
          setStatus('speaking');
          setTimeout(() => setStatus('idle'), 1500);
        }, 800);
      }, 1400);
      return;
    }
    recRef.current = rec;
    rec.lang = locale;
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (event) => {
      let final = '';
      for (let i = 0; i < event.results.length; i++) {
        final += event.results[i][0].transcript;
      }
      setTranscript(final);
    };
    rec.onerror = () => setStatus('error');
    rec.onend = () => setStatus((s) => (s === 'processing' ? 'speaking' : 'idle'));
    setStatus('listening');
    try {
      rec.start();
    } catch {
      setStatus('error');
    }
  }, [locale]);

  const cancel = useCallback(() => {
    recRef.current?.abort();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setStatus('idle');
  }, []);

  const speak = useCallback(
    (text: string) => {
      setTranscript(text);
      setStatus('speaking');
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = locale;
        u.rate = 0.95;
        u.onend = () => setStatus('idle');
        u.onerror = () => setStatus('idle');
        window.speechSynthesis.speak(u);
      } else {
        setTimeout(() => setStatus('idle'), 2500);
      }
    },
    [locale],
  );

  return { status, transcript, isSupported: supported, startListening, stopListening, cancel, speak };
}