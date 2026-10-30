type FormFieldErrorProps = {
  id: string;
  message?: string;
};

export default function FormFieldError({ id, message }: FormFieldErrorProps) {
  if (!message) return null;

  return (
    <span className="field-error" id={id}>
      <span className="field-error-mark" aria-hidden="true">!</span>
      {message}
    </span>
  );
}
