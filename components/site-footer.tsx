import Link from "next/link";
import { locations } from "@/lib/locations";
import styles from "./site-footer.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer} aria-label="ЧЕРТА — контакты и адреса">
      <div className={styles.overline}>
        <span>[ 04 — ДО ВСТРЕЧИ ]</span>
        <span className={styles.hours}><i aria-hidden="true" /> ЕЖЕДНЕВНО · 10:00 — 22:00</span>
      </div>

      <div className={styles.invitation}>
        <h2>Хороший вид.<br /><em>Твоя черта.</em><span className={styles.headingStar} aria-hidden="true">✳</span></h2>
        <Link className={styles.bookingLink} href="/#booking">
          <span>ТВОЁ ВРЕМЯ.<br />ТВОЁ КРЕСЛО.</span>
          <span className={styles.bookingArrow} aria-hidden="true">↗</span>
          <span className={styles.bookingCaption}>ЗАПИСАТЬСЯ НА ВИЗИТ</span>
        </Link>
      </div>

      <div className={styles.details}>
        <nav className={styles.navigation} aria-label="Навигация в подвале">
          <h3>БЛИЖЕ К ДЕЛУ</h3>
          <Link href="/#concept">Философия <span aria-hidden="true">↗</span></Link>
          <Link href="/#services">Услуги и цены <span aria-hidden="true">↗</span></Link>
          <Link href="/#booking">Онлайн-запись <span aria-hidden="true">↗</span></Link>
        </nav>
        <div className={styles.locations}>
          <h3>ТРИ АДРЕСА. ОДИН ХАРАКТЕР.</h3>
          <ul>
            {locations.map((location) => (
              <li key={location.id}>
                <span className={styles.locationNumber}>{location.mark}</span>
                <span>{location.address}<small>{location.metro}</small></span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.contact}>
          <h3>ЕСТЬ ВОПРОС? НАБИРАЙ.</h3>
          <a className={styles.phone} href="tel:+79999999999">+7 (999) 999-99-99 <span aria-hidden="true">↗</span></a>
          <p>Хорошая стрижка начинается<br />с хорошего разговора.</p>
          <span className={styles.signature}><span aria-hidden="true">✳</span> ДЛЯ СВОИХ. С 2014.</span>
        </div>
      </div>

      <Link className={styles.brand} href="/#top" aria-label="ЧЕРТА — вернуться наверх">
        <span>ЧЕРТА</span><sup>®</sup>
      </Link>
      <div className={styles.bottom}>
        <span>© ЧЕРТА · {new Date().getFullYear()}</span>
        <span className={styles.craft}>ВНИМАНИЕ К КАЖДОЙ ДЕТАЛИ <i aria-hidden="true" /></span>
        <Link href="/#top">НАВЕРХ <span aria-hidden="true">↑</span></Link>
      </div>
    </footer>
  );
}
