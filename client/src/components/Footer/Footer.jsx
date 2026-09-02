// Test eden kullanicilarin kolayca geri bildirim gonderebilmesi icin
// tum sayfalarin altinda goze batmayan bir link - Hafta 5-6 (gercek
// kullanici geri bildirimi) calismasinin bir parcasi.
const FEEDBACK_MAILTO =
  "mailto:proskampingxe@gmail.com?subject=SmartStudy%20AI%20-%20Geri%20Bildirim&body=Merhaba%20Cem%2C%0A%0ASmartStudy%20AI%27i%20denedim%2C%20notlarim%20asagida%3A%0A%0ABegendigim%3A%20%0A%0AKafami%20karistiran%20/%20calismayan%3A%20%0A%0AOnerim%3A%20%0A";

function Footer() {
  return (
    <footer className="app-footer">
      <a href={FEEDBACK_MAILTO} className="feedback-link">
        💬 Görüş ve önerini gönder
      </a>
    </footer>
  );
}

export default Footer;
