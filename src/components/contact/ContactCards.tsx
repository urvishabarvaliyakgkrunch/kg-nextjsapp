// src/components/contact/ContactCards.tsx

import ContactCard from "./ContactCard";
import type { ContactCardData } from "@/types/contact";

export default function ContactCards({ cards }: { cards: ContactCardData[] }) {
  return (
    <section aria-label="Contact details" className="bg-white px-5 min-[768px]:px-10 min-[1025px]:px-[60px]">
      <div className="mx-auto w-full max-w-[1200px] py-5 min-[768px]:py-10 min-[1025px]:py-[60px]">
        <ul className="grid grid-cols-1 gap-5 min-[768px]:grid-cols-3 min-[768px]:p-[10px]">
          {cards.map((card) => (
            <ContactCard key={card.label} {...card} />
          ))}
        </ul>
      </div>
    </section>
  );
}
