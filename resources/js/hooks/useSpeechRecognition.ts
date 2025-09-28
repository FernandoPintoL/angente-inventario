import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  maxAlternatives?: number;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  alternatives?: string[];
}

interface UseSpeechRecognitionReturn {
  // Estado
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;

  // Acciones
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;

  // Configuración
  setLanguage: (language: string) => void;
}

export function useSpeechRecognition(options: SpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const {
    continuous = true,
    interimResults = true,
    language = 'es-ES',
    maxAlternatives = 1
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Verificar soporte del navegador
  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Inicializar reconocimiento de voz
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = currentLanguage;
    recognition.maxAlternatives = maxAlternatives;

    // Evento: resultado de reconocimiento
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
      }
      setInterimTranscript(interimTranscript);
      setError(null);
    };

    // Evento: inicio de reconocimiento
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    // Evento: fin de reconocimiento
    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    // Evento: error
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      setError(getErrorMessage(event.error));
    };

    // Evento: sin coincidencias
    recognition.onnomatch = () => {
      setError('No se pudo reconocer el audio. Intenta hablar más claro.');
    };

    // Evento: sin resultados
    recognition.onspeechend = () => {
      if (!continuous) {
        recognition.stop();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSupported, continuous, interimResults, currentLanguage, maxAlternatives]);

  // Función para obtener mensaje de error amigable
  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'no-speech':
        return 'No se detectó ningún audio. Asegúrate de que tu micrófono esté funcionando.';
      case 'audio-capture':
        return 'No se pudo acceder al micrófono. Verifica los permisos.';
      case 'not-allowed':
        return 'Permisos de micrófono denegados. Por favor, habilita el acceso al micrófono.';
      case 'network':
        return 'Error de red. Verifica tu conexión a internet.';
      case 'service-not-allowed':
        return 'Servicio de reconocimiento de voz no disponible.';
      case 'bad-grammar':
        return 'Error en la configuración del reconocimiento de voz.';
      case 'language-not-supported':
        return 'Idioma no soportado por el navegador.';
      default:
        return `Error de reconocimiento de voz: ${error}`;
    }
  };

  // Iniciar escucha
  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Tu navegador no soporta reconocimiento de voz.');
      return;
    }

    if (!recognitionRef.current || isListening) return;

    try {
      setError(null);
      recognitionRef.current.start();
    } catch (error) {
      setError('No se pudo iniciar el reconocimiento de voz. Intenta nuevamente.');
    }
  }, [isSupported, isListening]);

  // Detener escucha
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  // Resetear transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  // Cambiar idioma
  const setLanguage = useCallback((newLanguage: string) => {
    setCurrentLanguage(newLanguage);
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    setLanguage
  };
}

// Extender la interfaz Window para TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}