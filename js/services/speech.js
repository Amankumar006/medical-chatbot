/**
 * Web Speech API Service for Vernacular Voice-First Interaction
 * Supports speech-to-text (STT) and text-to-speech (TTS) in Hindi, English, and regional Indian languages.
 */

class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  }

  isSupported() {
    return {
      stt: !!this.recognition,
      tts: !!this.synth
    };
  }

  startListening(lang = 'hi-IN', onResult, onError, onEnd) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition not supported in this browser.');
      return;
    }

    this.recognition.lang = lang;

    this.recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (onResult) onResult(transcript, event.results[0].isFinal);
    };

    this.recognition.onerror = (event) => {
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      // Already started or blocked
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  }

  speak(text, lang = 'hi-IN', onEnd) {
    if (!this.synth) return;

    // Stop any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for clarity

    if (onEnd) {
      utterance.onend = onEnd;
    }

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechService = new SpeechService();
