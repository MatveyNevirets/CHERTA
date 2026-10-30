"use client";

import { useEffect, useRef } from "react";

type BookingSuccessDialogProps = {
  message: string;
  onClose: () => void;
};

export default function BookingSuccessDialog({ message, onClose }: BookingSuccessDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="booking-success-dialog"
      aria-labelledby="booking-success-title"
      aria-describedby="booking-success-description"
      onClose={onClose}
    >
      <form method="dialog">
        <button className="dialog-close" type="submit" aria-label="Закрыть окно">×</button>
        <span className="dialog-success-mark" aria-hidden="true">✓</span>
        <span className="dialog-eyebrow">ЧЕРТА / ОНЛАЙН-ЗАПИСЬ</span>
        <h2 id="booking-success-title">Заявка отправлена</h2>
        <p id="booking-success-description">{message}</p>
        <button className="button button-copper dialog-confirm" type="submit" autoFocus>Отлично <span aria-hidden="true">↗</span></button>
      </form>
    </dialog>
  );
}
