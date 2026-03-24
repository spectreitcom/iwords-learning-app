import { useSyncExternalStore, useState } from "react";

type PronunciationLang = "en-US";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function getServerSnapshot() {
  return false;
}

export const usePronunciation = (lang: PronunciationLang) => {
  const isAvailable = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
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

  return {
    isAvailable,
    speak,
    isSpeaking,
  };
};
