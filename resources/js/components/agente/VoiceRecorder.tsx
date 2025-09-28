import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import {
  MicIcon,
  MicOffIcon,
  Square,
  Volume2Icon,
  AlertCircleIcon,
  LanguagesIcon,
  CheckCircle2Icon,
  XCircleIcon
} from 'lucide-react';

interface VoiceRecorderProps {
  onTranscriptChange?: (transcript: string) => void;
  onFinalTranscript?: (transcript: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
];

export function VoiceRecorder({
  onTranscriptChange,
  onFinalTranscript,
  disabled = false,
  className,
  placeholder = "Presiona el micrófono y habla..."
}: VoiceRecorderProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('es-ES');
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    setLanguage
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    language: selectedLanguage
  });

  // Verificar permisos de micrófono al montar
  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  // Actualizar idioma cuando cambie
  useEffect(() => {
    setLanguage(selectedLanguage);
  }, [selectedLanguage, setLanguage]);

  // Notificar cambios en el transcript
  useEffect(() => {
    const fullTranscript = transcript + interimTranscript;
    onTranscriptChange?.(fullTranscript);
  }, [transcript, interimTranscript, onTranscriptChange]);

  // Notificar transcript final
  useEffect(() => {
    if (transcript && !isListening) {
      onFinalTranscript?.(transcript);
    }
  }, [transcript, isListening, onFinalTranscript]);

  // Verificar permisos de micrófono
  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setHasPermission(false);
    }
  };

  // Inicializar visualización de audio
  const initializeAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);

      analyserRef.current.fftSize = 256;
      microphoneRef.current.connect(analyserRef.current);

      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Actualizar nivel de audio
  const updateAudioLevel = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const update = () => {
      if (!isListening) return;

      analyserRef.current!.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      setAudioLevel(average / 255);

      requestAnimationFrame(update);
    };

    update();
  };

  // Limpiar recursos de audio
  const cleanupAudioResources = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  // Manejar inicio/parada de grabación
  const handleToggleRecording = async () => {
    if (isListening) {
      stopListening();
      cleanupAudioResources();
    } else {
      if (hasPermission === false) {
        await checkMicrophonePermission();
        if (hasPermission === false) return;
      }

      resetTranscript();
      await initializeAudioVisualization();
      startListening();
    }
  };

  // Manejar cambio de idioma
  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setShowLanguageSelect(false);
  };

  if (!isSupported) {
    return (
      <div className={cn("flex items-center gap-2 p-3 bg-muted/50 rounded-lg", className)}>
        <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Tu navegador no soporta reconocimiento de voz
        </span>
      </div>
    );
  }

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage);
  const fullTranscript = transcript + interimTranscript;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Controles principales */}
      <div className="flex items-center gap-3">
        {/* Botón de grabación */}
        <Button
          type="button"
          variant={isListening ? "destructive" : "secondary"}
          size="icon"
          onClick={handleToggleRecording}
          disabled={disabled || hasPermission === false}
          className={cn(
            "relative h-10 w-10 rounded-full transition-all duration-200",
            isListening && "animate-pulse shadow-lg"
          )}
        >
          {isListening ? (
            <Square className="h-4 w-4" />
          ) : (
            <MicIcon className="h-4 w-4" />
          )}

          {/* Indicador de nivel de audio */}
          {isListening && (
            <div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              style={{
                transform: `scale(${1 + audioLevel * 0.5})`,
                opacity: audioLevel
              }}
            />
          )}
        </Button>

        {/* Selector de idioma */}
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowLanguageSelect(!showLanguageSelect)}
            disabled={disabled || isListening}
            className="flex items-center gap-2"
          >
            <LanguagesIcon className="h-3 w-3" />
            <span className="text-xs">{currentLanguage?.flag}</span>
            <span className="hidden sm:inline text-xs">{currentLanguage?.name}</span>
          </Button>

          {/* Dropdown de idiomas */}
          {showLanguageSelect && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-900 border rounded-lg shadow-lg z-50 min-w-[150px]">
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={cn(
                    "w-full text-left px-3 py-2 hover:bg-muted/50 text-sm flex items-center gap-2",
                    selectedLanguage === language.code && "bg-muted font-medium"
                  )}
                >
                  <span>{language.flag}</span>
                  <span>{language.name}</span>
                  {selectedLanguage === language.code && (
                    <CheckCircle2Icon className="h-3 w-3 ml-auto text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Estado */}
        <div className="flex items-center gap-2">
          {isListening && (
            <Badge variant="default" className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs">Escuchando</span>
            </Badge>
          )}

          {hasPermission === false && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <MicOffIcon className="h-3 w-3" />
              <span className="text-xs">Sin permisos</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Visualización del transcript */}
      {(fullTranscript || isListening) && (
        <div className="p-3 bg-muted/30 rounded-lg border-l-4 border-l-primary">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Volume2Icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Transcripción</span>
            </div>
            {fullTranscript && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetTranscript}
                className="h-6 px-2 text-xs"
              >
                Limpiar
              </Button>
            )}
          </div>

          <div className="text-sm space-y-1">
            {transcript && (
              <div className="text-foreground">{transcript}</div>
            )}
            {interimTranscript && (
              <div className="text-muted-foreground italic">
                {interimTranscript}
              </div>
            )}
            {isListening && !fullTranscript && (
              <div className="text-muted-foreground italic">
                {placeholder}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <XCircleIcon className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
          <div className="text-sm text-destructive">{error}</div>
        </div>
      )}

      {/* Ayuda */}
      {!isListening && !fullTranscript && hasPermission && (
        <div className="text-xs text-muted-foreground">
          💡 Tip: Mantén presionado el botón del micrófono y habla claramente.
          El reconocimiento funciona mejor en entornos silenciosos.
        </div>
      )}
    </div>
  );
}

// Extender la interfaz Window para AudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}