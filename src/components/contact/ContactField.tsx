// src/components/contact/ContactField.tsx

type ContactFieldProps = {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  // Name + Email sit side by side from tablet up, like the live form
  half?: boolean;
};

const CONTROL_CLASS =
  "w-full rounded-[8px] border border-muted-2 bg-white font-sans text-[14px] font-medium leading-[22px] text-muted-2 outline-none transition-[border-color] duration-300 placeholder:text-muted-2 focus:border-blue";

export default function ContactField({
  id,
  name,
  label,
  type = "text",
  required = false,
  placeholder,
  autoComplete,
  half = false,
}: ContactFieldProps) {
  return (
    <div className={`mb-[27px] w-full px-[5px] ${half ? "min-[768px]:w-1/2" : ""}`}>
      <label htmlFor={id} className="block font-mono text-[16px] font-medium leading-6 text-muted-2">
        {label}
        {required ? (
          <span className="pl-[3.2px] text-required" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          required={required}
          placeholder={placeholder}
          className={`${CONTROL_CLASS} block h-[100px] resize-y px-[14px] py-[5px]`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`${CONTROL_CLASS} h-10 px-4 py-2`}
        />
      )}
    </div>
  );
}
