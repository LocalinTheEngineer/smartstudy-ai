// Render'daki ucretsiz backend uykudaysa ilk istek ~1 dakika surebilir.
// Bu kucuk "store", bir istek 2.5 saniyeden uzun surerse bunu React
// tarafina haber veriyor, boylece kullaniciya "sunucu uyaniyor" gibi
// aciklayici bir mesaj gosterebiliyoruz (sessiz/kafa karistirici bir
// bekleme yerine).
let activeCount = 0;
let wakingTimer = null;
let isWaking = false;
const listeners = new Set();

const WAKE_THRESHOLD_MS = 2500;

function notify() {
  listeners.forEach((fn) => fn(isWaking));
}

export function requestStarted() {
  activeCount += 1;
  if (!wakingTimer) {
    wakingTimer = setTimeout(() => {
      if (activeCount > 0) {
        isWaking = true;
        notify();
      }
    }, WAKE_THRESHOLD_MS);
  }
}

export function requestFinished() {
  activeCount = Math.max(0, activeCount - 1);
  if (activeCount === 0) {
    if (wakingTimer) {
      clearTimeout(wakingTimer);
      wakingTimer = null;
    }
    if (isWaking) {
      isWaking = false;
      notify();
    }
  }
}

export function subscribeWakeUp(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
