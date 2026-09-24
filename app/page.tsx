"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";

const locations = [
  { id: "center", name: "На Ленина", address: "ул. Ленина, 14", metro: "м. Площадь Ленина", mark: "01" },
  { id: "embankment", name: "На Набережной", address: "Набережная, 8", metro: "м. Горьковская", mark: "02" },
  { id: "loft", name: "Лофт на Мира", address: "ул. Мира, 27", metro: "м. Стрелка", mark: "03" },
];

const services = [
  { id: "hair", name: "Мужская стрижка", detail: "Консультация · мытьё · укладка", duration: "60 мин", price: 2200, icon: "✳" },
  { id: "beard", name: "Моделирование бороды", detail: "Форма · горячее полотенце", duration: "45 мин", price: 1600, icon: "⌁" },
  { id: "combo", name: "Стрижка + борода", detail: "Полный образ за одно посещение", duration: "90 мин", price: 3400, icon: "✂" },
  { id: "buzz", name: "Стрижка машинкой", detail: "Одна длина или fade", duration: "30 мин", price: 1200, icon: "▤" },
  { id: "shave", name: "Королевское бритьё", detail: "Распаривание · уход после бритья", duration: "45 мин", price: 1800, icon: "◒" },
  { id: "junior", name: "Детская стрижка", detail: "Для гостей до 12 лет", duration: "45 мин", price: 1500, icon: "✦" },
];

const featuredServices = [
  { id: "hair", title: "Стрижка", eyebrow: "ФОРМА И ХАРАКТЕР", description: "От классики до текстурного fade — подберём форму под тебя.", price: 2200, image: "/service-haircut.png", alt: "Барбер создаёт форму мужской стрижки ножницами" },
  { id: "beard", title: "Борода", eyebrow: "ЧЁТКАЯ ЛИНИЯ", description: "Архитектура бороды, горячее полотенце и точная работа бритвой.", price: 1600, image: "/service-beard.png", alt: "Мастер оформляет контур бороды опасной бритвой" },
  { id: "shave", title: "Бритьё", eyebrow: "ВРЕМЯ ВЫДОХНУТЬ", description: "Тёплый компресс, пена и классический ритуал без спешки.", price: 1800, image: "/service-shave.png", alt: "Классическое бритьё с горячим полотенцем" },
];

const timeSlots = ["10:00", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00"];
const rubles = new Intl.NumberFormat("ru-RU");

function getToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function formatRussianPhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (!digits) return "";

  let formatted = `+7 (${digits.slice(0, 3)}`;
  if (digits.length >= 3) formatted += ")";
  if (digits.length > 3) formatted += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) formatted += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) formatted += `-${digits.slice(8, 10)}`;
  return formatted;
}

export default function Home() {
  const [location, setLocation] = useState("center");
  const [selected, setSelected] = useState<string[]>(["hair"]);
  const [date, setDate] = useState(getToday);
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [notice, setNotice] = useState("");
  const total = useMemo(() => services.filter((service) => selected.includes(service.id)).reduce((sum, service) => sum + service.price, 0), [selected]);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".motion-reveal");
    const galleryCards = document.querySelectorAll<HTMLElement>(".gallery-card");
    document.body.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -5% 0px" });
    elements.forEach((element) => observer.observe(element));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    function updateParallax() {
      if (reducedMotion || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        galleryCards.forEach((card) => {
          const bounds = card.getBoundingClientRect();
          const distance = bounds.top + bounds.height / 2 - window.innerHeight / 2;
          const offset = Math.max(-22, Math.min(22, distance * -0.035));
          card.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
        });
      });
    }
    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
      if (frame) window.cancelAnimationFrame(frame);
      document.body.classList.remove("motion-ready");
    };
  }, []);

  function toggleService(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((serviceId) => serviceId !== id) : [...current, id]);
    setNotice("");
  }

  function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected.length) {
      setNotice("Выберите хотя бы одну услугу — и мы подберём свободное время.");
      return;
    }
    if (!time) {
      setNotice("Остался последний шаг: выберите удобное время.");
      return;
    }
    const locationName = locations.find((item) => item.id === location)?.name ?? "";
    setNotice(`Готово! Позвоним вам, чтобы подтвердить визит ${date.split("-").reverse().join(".")} в ${time} — ${locationName}.`);
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="ЧЕРТА — на главную">ЧЕРТА<span>®</span></a>
        <nav className="main-nav" aria-label="Главная навигация"><a href="#concept">Философия</a><a href="#services">Услуги</a><a href="#locations">Адреса</a></nav>
        <a className="header-book" href="#booking">Записаться <span>↗</span></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-photo" />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="eyebrow"><span className="eyebrow-line" /> БАРБЕРШОП ДЛЯ СВОИХ · С 2014</div>
          <h1>Хороший<br />вид — это<br /><em>характер.</em></h1>
          <p>Место, где знают, что тебе идёт.<br />Стрижём, бреем, наливаем кофе.</p>
          <a className="button button-copper" href="#booking">Выбрать время <span>↗</span></a>
        </div>
        <div className="hero-aside"><span>46°20&apos;N 44°00&apos;E</span><span>ТВОЙ ГОРОД. ТВОИ ПРАВИЛА.</span></div>
        <div className="hero-footer"><span>ЧЕРТА — БАРБЕРШОП</span><span>ЛИСТАЙТЕ ВНИЗ ↓</span><span>01 — 03</span></div>
        <div className="hero-seal"><span>THE ART OF</span><strong>GOOD<br />GROOMING</strong><span>EST. 2014</span></div>
      </section>

      <section className="ticker" aria-label="Наш подход"><div>ТОЧНОСТЬ В ДЕТАЛЯХ <span>✳</span> БЕЗ ЛИШНИХ СЛОВ <span>✳</span> СВОИ МАСТЕРА <span>✳</span> ТВОЙ СТИЛЬ <span>✳</span> ТОЧНОСТЬ В ДЕТАЛЯХ <span>✳</span> БЕЗ ЛИШНИХ СЛОВ <span>✳</span></div></section>

      <section className="manifesto" id="concept">
        <div className="section-index">[ 01 — НАШ ПОДХОД ]</div>
        <div className="manifesto-main"><h2>Не просто<br />короче.<br /><em>Точнее.</em></h2><div className="manifesto-copy"><span className="asterisk">✳</span><p>Мы не гонимся за трендами. Мы ищем форму, которая подходит именно тебе. Чтобы утром достаточно было просто провести рукой по волосам — и выйти за дверь.</p><a className="text-link" href="#booking">НАЙТИ СВОЕГО МАСТЕРА <span>↗</span></a></div></div>
        <div className="manifesto-bottom"><span>ТРИ ПРОСТЫХ ВЕЩИ</span><span>ВНИМАНИЕ · МАСТЕРСТВО · ХАРАКТЕР</span></div>
      </section>

      <section className="services-section" id="services">
        <div className="section-top"><div><div className="section-index">[ 02 — МЕНЮ ]</div><h2>Время для <em>себя.</em></h2></div><p>Каждая услуга — ритуал без суеты.<br />Выбирай свою или доверься мастеру.</p></div>
        <div className="service-gallery" aria-label="Популярные услуги барбершопа">
          {featuredServices.map((service, index) => <a className={`gallery-card motion-reveal gallery-card-${index + 1}`} href="#booking" key={service.id} onClick={() => setSelected((current) => current.includes(service.id) ? current : [...current, service.id])}>
            <Image className="gallery-image" src={service.image} alt={service.alt} fill sizes="(max-width: 680px) 88vw, (max-width: 1000px) 48vw, 30vw" />
            <span className="gallery-shade" />
            <span className="gallery-topline"><span>ЧЕРТА / {String(index + 1).padStart(2, "0")}</span><span className="gallery-plus">↗</span></span>
            <span className="gallery-copy"><span className="gallery-eyebrow">{service.eyebrow}</span><strong>{service.title}</strong><span className="gallery-description">{service.description}</span><span className="gallery-price">от {rubles.format(service.price)} ₽ <i>·</i> выбрать услугу</span></span>
            <span className="gallery-ring" aria-hidden="true">✳</span>
          </a>)}
        </div>
        <div className="service-menu">{services.map((service, index) => <a href="#booking" className="menu-item" key={service.id} onClick={() => setSelected((current) => current.includes(service.id) ? current : [...current, service.id])}><span className="menu-number">0{index + 1}</span><span className="menu-icon">{service.icon}</span><span className="menu-copy"><strong>{service.name}</strong><small>{service.detail}</small></span><span className="menu-duration">{service.duration}</span><span className="menu-price">{rubles.format(service.price)} ₽</span><span className="menu-arrow">↗</span></a>)}</div>
        <div className="service-footnote"><span>*</span> Напитки и хорошая музыка — за наш счёт. Всегда.</div>
      </section>

      <section className="booking-section" id="booking">
        <div className="booking-intro"><div className="section-index">[ 03 — ТВОЙ ВИЗИТ ]</div><h2>Забронируй<br />своё <em>кресло.</em></h2><p>Пара минут — и время для себя уже в календаре.</p><div className="booking-quote"><span>“</span><p>Приходи на пять минут раньше. Успеешь выдохнуть и выбрать напиток.</p></div><div className="booking-hours"><span>ЕЖЕДНЕВНО</span><strong>10:00 — 22:00</strong></div></div>
        <form className="booking-form" onSubmit={handleBooking}>
          <div className="booking-form-head"><div><span>ОНЛАЙН-ЗАПИСЬ</span><h3>Займи своё кресло.</h3></div><span className="booking-estimate">≈ 2 МИНУТЫ</span></div>
          <fieldset className="booking-group" id="locations"><legend><span>01</span> ВЫБЕРИ БАРБЕРШОП</legend><div className="location-grid">{locations.map((item) => <button type="button" key={item.id} className={`location-option${location === item.id ? " selected" : ""}`} onClick={() => setLocation(item.id)} aria-pressed={location === item.id}><span className="location-mark">{item.mark}</span><strong>{item.name}</strong><small>{item.address}</small><small>{item.metro}</small><span className="location-check">{location === item.id ? "✓" : "+"}</span></button>)}</div></fieldset>
          <fieldset className="booking-group"><legend><span>02</span> ВЫБЕРИ УСЛУГУ</legend><div className="booking-services">{services.map((service) => <button type="button" key={service.id} onClick={() => toggleService(service.id)} className={`booking-service${selected.includes(service.id) ? " selected" : ""}`} aria-pressed={selected.includes(service.id)}><span className="service-check">{selected.includes(service.id) ? "✓" : "+"}</span><span className="booking-service-name">{service.name}<small>{service.duration}</small></span><span className="booking-service-price">{rubles.format(service.price)} ₽</span></button>)}</div></fieldset>
          <div className="date-time-row"><label className="booking-group date-group"><span className="group-title"><span>03</span> ДАТА ВИЗИТА</span><input type="date" value={date} min={getToday()} onChange={(event) => setDate(event.target.value)} required /></label><fieldset className="booking-group time-group"><legend><span>04</span> СВОБОДНОЕ ВРЕМЯ</legend><div className="time-options">{timeSlots.map((slot) => <button type="button" key={slot} className={time === slot ? "selected" : ""} onClick={() => { setTime(slot); setNotice(""); }}>{slot}</button>)}</div></fieldset></div>
          <div className="guest-fields"><label>ТВОЁ ИМЯ<input name="name" type="text" placeholder="Как к тебе обращаться" autoComplete="name" required /></label><label>ТЕЛЕФОН<input name="phone" type="tel" inputMode="tel" placeholder="+7 (___) ___-__-__" autoComplete="tel" value={phone} onChange={(event) => setPhone(formatRussianPhone(event.target.value))} pattern="\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}" maxLength={18} required /></label></div>
          <div className="form-bottom"><div className="booking-total"><span>ИТОГО ЗА УСЛУГИ</span><strong>{rubles.format(total)} <small>₽</small></strong></div><button className="button button-copper submit-booking" type="submit">Записаться <span>↗</span></button></div>
          {notice && <p className="booking-notice" role="status">{notice}</p>}
          <p className="form-privacy">Нажимая «Записаться», ты соглашаешься на обработку персональных данных.</p>
        </form>
      </section>

      <section className="closing"><span className="section-index">ХОРОШО ВЫГЛЯДИШЬ — ХОРОШО СЕБЯ ЧУВСТВУЕШЬ.</span><p>До встречи в кресле.</p><a href="#booking">ЗАПИСАТЬСЯ ↗</a></section>
      <footer className="site-footer"><a className="wordmark" href="#top">ЧЕРТА<span>®</span></a><span>БАРБЕРШОП ДЛЯ СВОИХ · 2026</span><div><a href="tel:+78005553535">+7 800 555-35-35</a><span>СДЕЛАНО С ХАРАКТЕРОМ</span></div></footer>
    </main>
  );
}
