// src/components/account/FormField.tsx

interface Props {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  hint?: string;
}

// One input + label + error line. Every account form is built from this.
export default function FormField({
  name,
  label,
  type = "text",
  defaultValue,
  placeholder,
  required,
  autoComplete,
  error,
  hint,
}: Props) {
  const errorId = `${name}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-mono text-[14px] text-ink">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`h-[46px] w-full border bg-white px-4 font-mono text-[14px] text-ink-dark outline-none transition-colors placeholder:text-muted focus:border-blue ${
          error ? "border-danger" : "border-line"
        }`}
      />

      {hint ? (
        <p className="font-mono text-[12px] italic text-muted-alt">{hint}</p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="font-mono text-[12px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
