// src/components/account/DownloadsTable.tsx

import type { DownloadableItem } from "@/lib/queries/account";

const CELL = "px-4 py-3 text-left font-mono text-[13px]";

// Same columns WooCommerce shows on the Downloads tab
export default function DownloadsTable({ items }: { items: DownloadableItem[] }) {
  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="border-b border-line bg-hero-surface">
            <th className={`${CELL} font-bold text-ink-dark`}>Product</th>
            <th className={`${CELL} font-bold text-ink-dark`}>Downloads remaining</th>
            <th className={`${CELL} font-bold text-ink-dark`}>Expires</th>
            <th className={`${CELL} font-bold text-ink-dark`}>Download</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.downloadId} className="border-b border-line last:border-b-0">
              <td className={`${CELL} text-ink`}>{item.product?.name ?? item.name}</td>
              <td className={`${CELL} text-ink`}>{item.downloadsRemaining ?? "∞"}</td>
              <td className={`${CELL} text-ink`}>{item.accessExpires ?? "Never"}</td>
              <td className={CELL}>
                {item.url ? (
                  <a href={item.url} className="text-blue hover:underline">
                    {item.name}
                  </a>
                ) : (
                  <span className="text-muted-alt">Unavailable</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
