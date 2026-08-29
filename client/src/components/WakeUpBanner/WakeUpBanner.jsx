import { useWakeUp } from "../../hooks/useWakeUp";

// Backend Render'in ucretsiz katmaninda uyuyorsa uyanmasi ~1 dakika
// surebilir. Bu banner o sirada kullaniciya ne oldugunu aciklar,
// boylece "site bozuk" izlenimi vermez.
function WakeUpBanner() {
  const isWaking = useWakeUp();

  if (!isWaking) return null;

  return (
    <div className="wakeup-banner">
      ⏳ Sunucu uyanıyor olabilir (ücretsiz sunucu, ~1 dk sürebilir), lütfen bekle...
    </div>
  );
}

export default WakeUpBanner;
