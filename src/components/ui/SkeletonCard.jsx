/**
 * @file SkeletonCard.jsx
 * @description Shimmer placeholder matching EvidenceCard dimensions.
 * Shown during initial data load instead of the radar spinner.
 */

export default function SkeletonCard() {
  return (
    <div className="px-4 py-3 border-b border-white/5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="skeleton h-4 w-16 rounded" />
        <div className="skeleton h-3 w-12 rounded" />
      </div>
      <div className="skeleton h-3 w-3/4 rounded mb-2" />
      <div className="skeleton h-3 w-full rounded mb-1.5" />
      <div className="skeleton h-3 w-2/3 rounded" />
    </div>
  );
}
