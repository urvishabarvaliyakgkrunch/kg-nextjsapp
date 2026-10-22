// src/components/layout/HeaderIcons.tsx

export function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="20" x="0" y="0" viewBox="0 0 612.01 612.01" ><g><path d="M606.209 578.714 448.198 423.228C489.576 378.272 515 318.817 515 253.393 514.98 113.439 399.704 0 257.493 0S.006 113.439.006 253.393s115.276 253.393 257.487 253.393c61.445 0 117.801-21.253 162.068-56.586l158.624 156.099c7.729 7.614 20.277 7.614 28.006 0a19.29 19.29 0 0 0 .018-27.585M257.493 467.8c-120.326 0-217.869-95.993-217.869-214.407S137.167 38.986 257.493 38.986c120.327 0 217.869 95.993 217.869 214.407S377.82 467.8 257.493 467.8" fill="#0a0a0a" opacity="1" data-original="#000000"></path></g></svg>
  );
}

export function AccountIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="20" x="0" y="0" viewBox="0 0 512 512" ><g><path d="M256 0c-74.439 0-135 60.561-135 135s60.561 135 135 135 135-60.561 135-135S330.439 0 256 0m0 240c-57.897 0-105-47.103-105-105S198.103 30 256 30s105 47.103 105 105-47.103 105-105 105M423.966 358.195C387.006 320.667 338.009 300 286 300h-60c-52.008 0-101.006 20.667-137.966 58.195C51.255 395.539 31 444.833 31 497c0 8.284 6.716 15 15 15h420c8.284 0 15-6.716 15-15 0-52.167-20.255-101.461-57.034-138.805M61.66 482c7.515-85.086 78.351-152 164.34-152h60c85.989 0 156.825 66.914 164.34 152z" fill="#0a0a0a" opacity="1" data-original="#000000"></path></g></svg>
  );
}

export function HamburgerIcon() {
  return (
    <svg className="size-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg className="size-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
