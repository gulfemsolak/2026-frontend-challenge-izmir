/**
 * @file MapLegend.jsx
 * @description Fixed overlay on the map showing color → evidence type mapping.
 * Positioned bottom-right so it doesn't obscure the map controls.
 */

import { FORM_TYPES } from '../../constants/formConfig.js';

export default function MapLegend() {
  return (
    <div className="absolute bottom-6 right-2 z-[1000] bg-zinc-900/90 border border-zinc-700 rounded p-3 backdrop-blur-sm">
      <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
        Evidence Type
      </p>
      <ul className="flex flex-col gap-1.5">
        {Object.values(FORM_TYPES).map((formType) => (
          <li key={formType.type} className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: formType.mapColor }}
            />
            <span className="font-mono text-[10px] text-zinc-300 uppercase tracking-wide">
              {formType.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
