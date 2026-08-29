import { useState, useEffect } from "react";
import { subscribeWakeUp } from "../services/wakeUpStore";

// Herhangi bir API istegi 2.5 saniyeden uzun surerse true doner -
// bunu "sunucu uyaniyor olabilir" bandini gostermek icin kullaniyoruz.
export function useWakeUp() {
  const [isWaking, setIsWaking] = useState(false);

  useEffect(() => subscribeWakeUp(setIsWaking), []);

  return isWaking;
}
