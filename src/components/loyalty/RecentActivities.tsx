// src/components/loyalty/RecentActivities.tsx

import type { LoyaltyActivity } from "@/types/loyalty";

interface Props {
  items: LoyaltyActivity[];
}

// Column headings are copied from the live widget, lower-case last two included
const HEAD = "p-[10px] font-sans text-[14px] font-medium leading-4 text-ink-dark";
const CELL = "border-b border-line p-[10px] font-sans text-[16px] leading-[18px] text-ink";

export default function RecentActivities({ items }: Props) {
  if (items.length === 0) {
    return <p className="font-sans text-[16px] text-muted">No activity yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] table-fixed border-collapse text-left">
        <colgroup>
          <col className="w-[11.1%]" />
          <col className="w-[22.2%]" />
          <col className="w-[44.5%]" />
          <col className="w-[11.1%]" />
          <col className="w-[11.1%]" />
        </colgroup>
        <thead>
          <tr className="rounded-[4px] bg-table-head">
            <th className={HEAD}>Order No.</th>
            <th className={HEAD}>Action Type</th>
            <th className={HEAD}>Message</th>
            <th className={`${HEAD} text-right`}>points</th>
            <th className={`${HEAD} text-right`}>rewards</th>
          </tr>
        </thead>
        <tbody>
          {items.map((activity) => (
            <tr key={activity.id}>
              {/* Show order ID only when it's a purchase action, otherwise dash */}
              <td className={`${CELL} text-muted-alt`}>
                {activity.orderId ? `#${activity.orderId}` : "-"}
              </td>
              <td className={CELL}>{activity.actionName || activity.actionType}</td>
              {/* message is the same note WPLoyalty shows on its own page */}
              <td className={CELL}>{activity.message || "-"}</td>
              <td className={`${CELL} text-right`}>
                {activity.points === 0 ? "-" : activity.points}
              </td>
              <td className={`${CELL} text-right`}>{activity.rewardName || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
