import { createContext } from "react";

// Context nesnesinin kendisi, "sadece component export eden" dosyalarda
// olmasi gereken Fast Refresh kurali yuzunden (react-refresh/only-export-components)
// AuthContext.jsx'ten (Provider component'inin oldugu dosya) ayri tutuluyor.
export const AuthContext = createContext(null);
