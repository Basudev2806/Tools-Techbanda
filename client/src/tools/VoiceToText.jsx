import { useEffect, useRef, useState } from "react";

export default function VoiceToText() {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalText += event.results[i][0].transcript;
      }
      if (finalText) setTranscript((t) => (t ? `${t} ${finalText}`.trim() : finalText.trim()));
    };

    recognition.onerror = (event) => setError(event.error);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  function toggle() {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setError(null);
      recognitionRef.current.start();
      setListening(true);
    }
  }

  if (!supported) {
    return (
      <div className="tool">
        <p className="tool__hint">
          Voice to text runs entirely in your browser via the Web Speech API. Your browser doesn't
          support it — try Chrome or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="tool">
      <p className="tool__hint">
        Speech-to-text runs locally in your browser (Web Speech API) — nothing is sent to the server.
      </p>

      <div className="tool__actions">
        <button className={"btn " + (listening ? "btn--primary" : "")} onClick={toggle}>
          {listening ? "● Listening — click to stop" : "Start listening"}
        </button>
        {transcript && (
          <button className="btn" onClick={() => setTranscript("")}>
            Clear
          </button>
        )}
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="v2t-out">
        transcript
      </label>
      <pre id="v2t-out" className="tool__output mono">
        {transcript || " "}
      </pre>
    </div>
  );
}
