'use client';

import { useState } from 'react';
import { MessageSquare, Search, Phone, Video, Send, AttachFile, X, CheckCircle, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Message {
  id: string; sender: string; role: string; preview: string; timestamp: string; unread: boolean; full?: string;
}

interface Conversation {
  id: string; name: string; role: string; lastMsg: string; time: string; unread: number; messages: Message[];
}

const conversations: Conversation[] = [
  {
    id: 'c1', name: 'Dr. Sarah Evans', role: 'Cardiologist', lastMsg: 'Your blood work looks good. Let\'s discuss the next steps.', time: '10:32', unread: 2,
    messages: [
      { id: 'm1', sender: 'Dr. Sarah Evans', role: 'Cardiologist', preview: '', timestamp: '09:15', unread: false, full: 'Good morning, I\'ve reviewed your latest results.' },
      { id: 'm2', sender: 'You', role: 'patient', preview: '', timestamp: '09:45', unread: false, full: 'Good morning, Doctor. How are my results?' },
      { id: 'm3', sender: 'Dr. Sarah Evans', role: 'Cardiologist', preview: '', timestamp: '10:32', unread: true, full: 'Your blood work looks good. Let\'s discuss the next steps during your appointment.' },
    ],
  },
  {
    id: 'c2', name: 'CureMed Pharmacy', role: 'Pharmacy', lastMsg: 'Your prescription is ready for pickup.', time: 'Yesterday', unread: 0,
    messages: [
      { id: 'm4', sender: 'CureMed Pharmacy', role: 'Pharmacy', preview: '', timestamp: 'Yesterday', unread: false, full: 'Your prescription is ready for pickup.' },
    ],
  },
  {
    id: 'c3', name: 'Dr. Michael Chen', role: 'General Practitioner', lastMsg: 'Please bring your previous test results.', time: 'Yesterday', unread: 1,
    messages: [
      { id: 'm5', sender: 'Dr. Michael Chen', role: 'General Practitioner', preview: '', timestamp: 'Yesterday', unread: true, full: 'Please bring your previous test results to our next appointment.' },
    ],
  },
  {
    id: 'c4', name: 'Cape Town Medical Centre', role: 'Facility', lastMsg: 'Your check-in has been confirmed for June 20.', time: '2 days ago', unread: 0,
    messages: [
      { id: 'm6', sender: 'Cape Town Medical Centre', role: 'Facility', preview: '', timestamp: '2 days ago', unread: false, full: 'Your check-in has been confirmed for June 20 at 09:00.' },
    ],
  },
];

export default function MessagesPage() {
  const [search, setSearch] = useState('');
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  const filtered = conversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const active = conversations.find(c => c.id === activeConv);

  return (
    <DashboardLayout title="Messages">
      <div className="flex h-[calc(100vh-8rem)] gap-4">
        <div className="w-80 shrink-0 card overflow-hidden flex flex-col">
          <div className="p-3" style={{ borderBottom: '1px solid var(--card-border)' }}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..." className="w-full px-3 py-2 pl-9 rounded-lg text-xs border outline-none" style={{ background: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(c => (
              <div key={c.id} onClick={() => setActiveConv(c.id)} className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all" style={{ background: activeConv === c.id ? 'var(--accent-light)' : 'transparent', borderBottom: '1px solid var(--card-border)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--accent)', color: '#fff' }}>
                  {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{c.time}</p>
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{c.lastMsg}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: 'var(--accent)', color: '#fff' }}>
                    {c.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 card overflow-hidden flex flex-col">
          {active ? (
            <>
              <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid var(--card-border)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>
                  {active.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{active.name}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{active.role}</p>
                </div>
                <button className="btn-ghost p-2"><Phone size={16} /></button>
                <button className="btn-ghost p-2"><Video size={16} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {active.messages.map(m => (
                  <div key={m.id} className={`flex ${m.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-xl text-sm ${
                      m.sender === 'You'
                        ? 'rounded-br-md'
                        : 'rounded-bl-md'
                    }`} style={{
                      background: m.sender === 'You' ? 'var(--accent)' : 'var(--bg-secondary)',
                      color: m.sender === 'You' ? '#fff' : 'var(--text-primary)',
                    }}>
                      <p>{m.full || m.preview}</p>
                      <p className="text-[10px] mt-1" style={{ opacity: 0.7 }}>{m.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3" style={{ borderTop: '1px solid var(--card-border)' }}>
                <div className="flex items-center gap-2">
                  <button className="btn-ghost p-2"><AttachFile size={16} /></button>
                  <input type="text" value={messageText} onChange={e => setMessageText(e.target.value)} placeholder="Type a message..." className="flex-1 px-3 py-2 rounded-lg text-sm border outline-none" style={{ background: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }} />
                  <button className="btn-primary p-2" style={{ borderRadius: '50%', width: 36, height: 36 }}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Select a conversation</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-disabled)' }}>Choose a conversation from the left panel</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
