'use client';

import { useState, type ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';
import { VoiceDrawer } from '@/components/ai/VoiceDrawer';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { localePath } from '@/lib/utils';
import { useUiStore } from '@/lib/stores/ui';

/**
 * Dashboard shell: fixed header, scrollable content, bottom thumb-zone nav,
 * and a floating voice drawer. Same simple hierarchy on all breakpoints.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const voiceOpen = useUiStore((s) => s.voiceOpen);
  const setVoiceOpen = useUiStore((s) => s.setVoiceOpen);
  const router = useRouter();
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        onOpenVoice={() => setVoiceOpen(true)}
        onOpenNotifications={() => router.push(localePath(locale, '/notifications'))}
      />

      <main className="pt-16 md:pt-20 pb-24 md:pb-0">{children}</main>

      <BottomNav />

      <VoiceDrawer open={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
}