/**
 * @file Badge.jsx
 * @description Small pill badge used for evidence type labels, status stamps,
 * and recency indicators throughout the app.
 *
 * @param {Object}  props
 * @param {string}  props.label   - Text to display
 * @param {string}  [props.color] - Tailwind color name without shade, e.g. "blue", "green"
 * @param {string}  [props.variant] - "type" | "status" | "new" (controls sizing/style)
 */

const COLOR_CLASSES = {
  blue:   'text-blue-400   bg-blue-400/10   border-blue-400/20',
  green:  'text-green-400  bg-green-400/10  border-green-400/20',
  purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  yellow: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  red:    'text-red-400    bg-red-400/10    border-red-400/20',
  amber:  'text-amber-400  bg-amber-400/10  border-amber-400/20',
  zinc:   'text-zinc-400   bg-zinc-800      border-zinc-700',
};

export default function Badge({ label, color = 'zinc', variant = 'type' }) {
  const colorClass = COLOR_CLASSES[color] ?? COLOR_CLASSES.zinc;

  return (
    <span
      className={`inline-flex items-center font-mono text-[10px] uppercase tracking-widest border rounded px-1.5 py-0.5 ${colorClass} ${
        variant === 'new' ? 'animate-pulse' : ''
      }`}
    >
      {label}
    </span>
  );
}
