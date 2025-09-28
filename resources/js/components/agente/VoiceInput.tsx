import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import {
  MicIcon,
  MicOffIcon,
  Square,
  Volume2Icon,
  AlertCircleIcon,
  SendIcon,
  CheckIcon
} from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceInput({ onTranscript, disabled = false, className }: VoiceInputProps) {
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [pendingTranscript, setPendingTranscript] = useState('');

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    language: 'es-ES'
  });

  // Verificar permisos al montar
  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  // Actualizar transcript pendiente en tiempo real
  useEffect(() => {
    if (transcript || interimTranscript) {
      setPendingTranscript(transcript + interimTranscript);
    }
  }, [transcript, interimTranscript]);

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setHasPermission(false);
    }
  };

  const initializeAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const microphone = audioContextRef.current.createMediaStreamSource(stream);

      analyserRef.current.fftSize = 256;
      microphone.connect(analyserRef.current);

      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

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
      setPendingTranscript('');
      await initializeAudioVisualization();
      startListening();
    }
  };

  const handleSendTranscript = () => {
    if (pendingTranscript.trim()) {
      onTranscript(pendingTranscript.trim());
      resetTranscript();
      setPendingTranscript('');
      stopListening();
      cleanupAudioResources();
    }
  };

  const handleStopWithoutSending = () => {
    stopListening();
    cleanupAudioResources();
    resetTranscript();
    setPendingTranscript('');
  };

  if (!isSupported) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled
        className={cn("h-10 w-10", className)}
        title="Reconocimiento de voz no soportado"
      >
        <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
      </Button>
    );
  }

  if (hasPermission === false) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled
        className={cn("h-10 w-10", className)}
        title="Permisos de micrófono requeridos"
      >
        <MicOffIcon className="h-4 w-4 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <div className="relative flex items-center gap-2">
      <Button
        type="button"
        variant={isListening ? "destructive" : "ghost"}
        size="icon"
        onClick={handleToggleRecording}
        disabled={disabled}
        className={cn(
          "h-10 w-10 relative transition-all duration-200",
          isListening && "animate-pulse shadow-md",
          className
        )}
        title={isListening ? "Detener grabación" : "Iniciar grabación de voz"}
      >
        {isListening ? (
          <Square className="h-4 w-4" />
        ) : (
          <MicIcon className="h-4 w-4" />
        )}

        {/* Indicador de nivel de audio */}
        {isListening && (
          <div
            className="absolute inset-0 rounded-lg border-2 border-white/30 pointer-events-none"
            style={{
              transform: `scale(${1 + audioLevel * 0.3})`,
              opacity: audioLevel * 0.7
            }}
          />
        )}
      </Button>

      {/* Botones de envío cuando hay transcript */}
      {pendingTranscript.trim() && isListening && (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="default"
            size="icon"
            onClick={handleSendTranscript}
            className="h-10 w-10 bg-green-600 hover:bg-green-700 text-white"
            title="Enviar mensaje de voz"
          >
            <SendIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleStopWithoutSending}
            className="h-10 w-10"
            title="Cancelar y borrar"
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Indicador de transcript en tiempo real */}
      {pendingTranscript && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap max-w-xs truncate shadow-lg">
          <div className="flex items-center gap-2">
            <Volume2Icon className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{pendingTranscript}</span>
            {isListening && (
              <div className="flex items-center gap-1 text-green-400 ml-2">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Escuchando...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error tooltip */}
      {error && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-red-600 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap max-w-xs shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="h-3 w-3" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}