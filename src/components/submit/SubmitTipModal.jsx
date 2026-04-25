/**
 * @file SubmitTipModal.jsx
 * @description Modal overlay embedding the Jotform anonymous tips form in an iframe.
 * Opens via a trigger button at the bottom of the sidebar.
 * Closes on backdrop click, X button, or ESC key.
 *
 * @param {Object}   props
 * @param {boolean}  props.isOpen   - Whether the modal is visible
 * @param {Function} props.onClose  - Called to close the modal
 */

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { FORM_TYPES } from '../../constants/formConfig.js';

const TIP_FORM_URL = `https://form.jotform.com/${FORM_TYPES.tip.id}`;

export default function SubmitTipModal({ isOpen, onClose }) {
  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-lg h-[85vh] bg-zinc-900 border border-zinc-700 rounded-lg flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0">
          <div>
            <h2 className="font-mono text-sm font-bold text-zinc-100 uppercase tracking-widest">
              Submit Anonymous Tip
            </h2>
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
              Your identity is protected
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-600 hover:text-zinc-300 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Jotform iframe */}
        <iframe
          src={TIP_FORM_URL}
          title="Submit Anonymous Tip"
          className="flex-1 w-full border-0"
          allow="geolocation"
        />
      </div>
    </div>
  );
}
