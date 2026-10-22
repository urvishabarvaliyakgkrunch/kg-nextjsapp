// src/components/layout/AnnouncementBar.tsx

function Diamond() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 512 512" fill="none"><path d="M487.79 279.63C491.819 277.172 495.147 273.719 497.457 269.604C499.767 265.489 500.98 260.849 500.98 256.13C500.98 251.411 499.767 246.771 497.457 242.656C495.147 238.541 491.819 235.088 487.79 232.63C445.322 206.888 406.109 176.123 371 141C335.912 105.897 305.181 66.6942 279.47 24.2399C277.02 20.2069 273.574 16.8716 269.463 14.554C265.352 12.2364 260.715 11.0145 255.996 11.0054C251.277 10.9964 246.634 12.2006 242.515 14.5024C238.395 16.8042 234.936 20.1264 232.47 24.1499C206.599 66.488 175.8 105.611 140.72 140.7C105.626 175.788 66.4965 206.593 24.1503 232.47C20.1273 234.937 16.8058 238.396 14.5049 242.516C12.204 246.636 11.0008 251.279 11.0108 255.998C11.0208 260.717 12.2438 265.354 14.5622 269.465C16.8807 273.575 20.2168 277.02 24.2503 279.47C66.5889 305.103 105.693 335.733 140.72 370.7C175.947 405.875 206.791 445.18 232.58 487.76C235.039 491.788 238.491 495.117 242.606 497.427C246.721 499.736 251.361 500.949 256.08 500.949C260.799 500.949 265.439 499.736 269.555 497.427C273.67 495.117 277.122 491.788 279.58 487.76C331.3 402.699 402.709 331.317 487.79 279.63Z" fill="white"></path></svg>
  );
}

export default function AnnouncementBar({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  // Duplicate so the seamless 50%-translate loop works
  const doubled = [...items, ...items];

  return (
    <div
      className="w-full overflow-hidden bg-blue"
      style={{ height: "var(--bar-height)" }}
    >
      <div className="marquee-track h-full items-center">
        {doubled.map((item, idx) => (
          <span
            key={idx}
            className="flex items-center text-white whitespace-nowrap uppercase font-mono text-[12px] font-[900] leading-[18px] tracking-[0.08em]"
          >
            <div className="mx-[24px]">
            <Diamond />
            </div>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
