export const russianPhonePattern = String.raw`\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}`;
const fullPhonePattern = new RegExp(`^(?:${russianPhonePattern})$`);

export type BookingField = "services" | "date" | "time" | "name" | "phone" | "personalDataConsent";
export type BookingErrors = Partial<Record<BookingField, string>>;

type BookingValues = {
  services: string[];
  date: string;
  time: string;
  name: string;
  phone: string;
  personalDataConsent: boolean;
};

export function validateBooking(values: BookingValues, today: string): BookingErrors {
  const errors: BookingErrors = {};

  if (!values.services.length) errors.services = "Выбери хотя бы одну услугу.";

  const parsedDate = new Date(`${values.date}T00:00:00Z`);
  if (!values.date) {
    errors.date = "Выбери дату визита.";
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== values.date) {
    errors.date = "Укажи корректную дату визита.";
  } else if (values.date < today) {
    errors.date = "Выбери сегодняшнюю или будущую дату.";
  }

  if (!values.time) errors.time = "Выбери удобное время.";
  if (!values.name.trim()) errors.name = "Напиши, как к тебе обращаться.";
  if (!values.phone) {
    errors.phone = "Оставь телефон — подтвердим запись.";
  } else if (!fullPhonePattern.test(values.phone)) {
    errors.phone = "Введи номер полностью: +7 (999) 123-45-67.";
  }
  if (!values.personalDataConsent) errors.personalDataConsent = "Для записи нужно твоё согласие на обработку данных.";

  return errors;
}
