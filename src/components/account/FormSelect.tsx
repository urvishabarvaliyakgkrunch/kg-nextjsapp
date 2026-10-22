// src/components/account/FormSelect.tsx

interface Props {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

// Same look as FormField, for lists that come from WooCommerce settings
export default function FormSelect({
  name,
  label,
  options,
  defaultValue,
  required,
  error,
  placeholder,
}: Props) {
  const errorId = `${name}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-mono text-[14px] text-ink">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </label>

      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`h-[46px] w-full border bg-white px-4 font-mono text-[14px] text-ink-dark outline-none transition-colors focus:border-blue ${
          error ? "border-danger" : "border-line"
        }`}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <p id={errorId} role="alert" className="font-mono text-[12px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
