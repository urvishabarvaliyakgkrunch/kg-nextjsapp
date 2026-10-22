// src/components/account/FormBanner.tsx

interface Props {
  error?: string;
  success?: string;
}

// Green or red strip above a form. Renders nothing when there is no message.
export default function FormBanner({ error, success }: Props) {
  const message = error ?? success;
  if (!message) return null;

  const isError = Boolean(error);

  return (
    <p
      role={isError ? "alert" : "status"}
      className={`rounded-btn border px-4 py-3 font-sans text-[13px] ${
        isError
          ? "border-danger/40 bg-danger/5 text-danger"
          : "border-chip-ok-line bg-chip-ok-bg text-chip-ok"
      }`}
    >
      {message}
    </p>
  );
}
