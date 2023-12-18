import "regenerator-runtime";
import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const SpeechRecognitionComponent: React.FC = () => {
  const [status, setStatus] = useState<string>("");
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setStatus("ブラウザが音声認識未対応です");
    }
  }, [browserSupportsSpeechRecognition]);

  const startListening = () => {
    setStatus("認識中");
    SpeechRecognition.startListening({ continuous: true, language: 'ja' });
  };

  const stopListening = () => {
    setStatus("停止中");
    SpeechRecognition.stopListening();
  };

  const reset = () => {
    resetTranscript();
  };

  return (
    <div>
      <textarea
        id="result_text"
        cols={100}
        rows={10}
        value={transcript}
        readOnly
      />
      <br />
      <textarea id="status" cols={100} rows={1} value={status} readOnly />
      <br />
      <input type="button" onClick={startListening} value="音認開始" />
      <input type="button" onClick={stopListening} value="音認停止" />
      <input type="button" onClick={reset} value="リセット" />
    </div>
  );
};

export default SpeechRecognitionComponent;