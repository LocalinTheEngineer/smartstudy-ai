import ReactMarkdown from "react-markdown";

// AI'dan gelen (ozet, calisma plani, ogrenme analizi gibi) markdown formatli
// metinleri okunakli basliklar/listeler/kalin yazilarla gostermek icin kucuk
// bir sarmalayici bileşen.
function MarkdownText({ children }) {
  if (!children) return null;
  return <ReactMarkdown>{children}</ReactMarkdown>;
}

export default MarkdownText;
