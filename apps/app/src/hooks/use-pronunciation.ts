import { useEffect, useState } from "react";

type PronunciationLang = "en-US";

export const usePronunciation = (lang: PronunciationLang) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const abortController = new AbortController();

    utterance.addEventListener(
      "start",
      () => {
        setIsSpeaking(true);
      },
      { signal: abortController.signal },
    );

    utterance.addEventListener(
      "end",
      () => {
        setIsSpeaking(false);
        abortController.abort();
      },
      { signal: abortController.signal },
    );

    utterance.addEventListener(
      "error",
      () => {
        setIsSpeaking(false);
        abortController.abort();
      },
      { signal: abortController.signal },
    );

    utterance.lang = lang;
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if ("speechSynthesis" in window) {
      setIsAvailable(true);
    }
  }, []);

  return {
    isAvailable,
    speak,
    isSpeaking,
  };
};
