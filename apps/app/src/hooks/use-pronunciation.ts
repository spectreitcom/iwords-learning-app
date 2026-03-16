import { useEffect, useMemo, useState } from "react";

type PronunciationLang = "en-US";

export const usePronunciation = (lang: PronunciationLang) => {
  const [isAvailable, setIsAvailable] = useState(false);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    console.log("loading", window);

    if ("speechSynthesis" in window) {
      setIsAvailable(true);
      console.log("available", speechSynthesis.getVoices());
    }
  }, []);

  return {
    isAvailable,
    speak,
  };
};
