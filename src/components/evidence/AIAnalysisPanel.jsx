/**
 * @file AIAnalysisPanel.jsx
 * @description Collapsible AI analysis panel that sends the 10 most recent
 * evidence items to OpenAI gpt-4o-mini and displays a noir detective report.
 *
 * @param {Object}         props
 * @param {EvidenceItem[]} props.allEvidence - Full evidence pool (sorted newest-first)
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export default function AIAnalysisPanel({ allEvidence }) {
  const [isOpen, setIsOpen]         = useState(true);
  const [report, setReport]         = useState('');
  const [isLoading, setIsLoading]   = useState(false);
  const [isError, setIsError]       = useState(false);
  const [generatedAt, setGeneratedAt] = useState(null);

  async function handleGenerate() {
    if (isLoading) return;
    setIsLoading(true);
    setIsError(false);
    setReport('');

    const recent = allEvidence.slice(0, 10).map((item) => ({
      type:        item.type,
      location:    item.location ?? null,
      content:     item.content  ?? null,
      submittedAt: item.submittedAt,
    }));

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                "You are a noir detective analyzing sightings of Podo, Jotform's missing mascot in Izmir Turkey. Be dramatic but concise.",
            },
            {
              role: 'user',
              content:
                `Analyze these evidence items and give me 3 bullet points max on where Podo likely is and why:\n\n${JSON.stringify(recent, null, 2)}`,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!res.ok) throw new Error(`OpenAI ${res.status}`);
      const data = await res.json();
      setReport(data.choices[0].message.content.trim());
      setGeneratedAt(new Date());
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="shrink-0 border-b border-zinc-800">
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-800/30 transition-colors duration-150"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          🔍 AI Analysis
        </span>
        {isOpen
          ? <ChevronUp   className="h-3.5 w-3.5 text-zinc-600" />
          : <ChevronDown className="h-3.5 w-3.5 text-zinc-600" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          {/* Generate button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full mb-3 flex items-center justify-center gap-2 bg-amber-400/10 hover:bg-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed border border-amber-400/30 hover:border-amber-400/60 text-amber-400 font-mono text-[10px] uppercase tracking-widest rounded py-2 transition-all duration-150"
          >
            {isLoading ? 'Analyzing evidence…' : 'Generate Investigator Report'}
          </button>

          {/* Animated loading dots */}
          {isLoading && (
            <div className="flex justify-center gap-1 py-2">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          )}

          {/* Error */}
          {isError && !isLoading && (
            <p className="font-mono text-[10px] text-red-400 text-center py-2">
              Signal interference. Try again.
            </p>
          )}

          {/* Report */}
          {report && !isLoading && (
            <div className="bg-zinc-800/80 backdrop-blur border-l-2 border-amber-400 rounded-r p-3">
              <p className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {report}
              </p>
              <p className="font-mono text-[9px] text-zinc-600 mt-2 pt-2 border-t border-zinc-700 uppercase tracking-widest">
                Classified · Generated {generatedAt?.toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
