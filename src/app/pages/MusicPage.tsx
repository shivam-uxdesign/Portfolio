import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  mood: string;
  color: string;
  audioUrl: string;
}

const tracks: Track[] = [
  // FOCUS
  { id: 1, title: 'Lo-fi Study Beats', artist: 'Sample Artist', album: 'Focus Collection', mood: 'FOCUS', color: '#A89070', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Morning Haze', artist: 'Sample Artist', album: 'Focus Collection', mood: 'FOCUS', color: '#6B8FA8', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 3, title: 'Quiet Hours', artist: 'Sample Artist', album: 'Focus Collection', mood: 'FOCUS', color: '#1A1A1A', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  // HYPE
  { id: 4, title: 'Energy Rush', artist: 'Sample Artist', album: 'Hype Collection', mood: 'HYPE', color: '#A89070', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 5, title: 'Momentum', artist: 'Sample Artist', album: 'Hype Collection', mood: 'HYPE', color: '#6B8FA8', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 6, title: 'Push Through', artist: 'Sample Artist', album: 'Hype Collection', mood: 'HYPE', color: '#1A1A1A', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  // LATE NIGHT
  { id: 7, title: '2AM Drive', artist: 'Sample Artist', album: 'Late Night Collection', mood: 'LATE NIGHT', color: '#A89070', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 8, title: 'Neon Rain', artist: 'Sample Artist', album: 'Late Night Collection', mood: 'LATE NIGHT', color: '#6B8FA8', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 9, title: 'Slow Burn', artist: 'Sample Artist', album: 'Late Night Collection', mood: 'LATE NIGHT', color: '#1A1A1A', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
];

const moods = ['FOCUS', 'HYPE', 'LATE NIGHT'];

export function MusicPage() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(true); // Start as playing
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0); // Start muted
  const [savedVolume, setSavedVolume] = useState(0.8); // Default unmuted volume
  const [isMuted, setIsMuted] = useState(true); // Start muted
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showMuteOverlay, setShowMuteOverlay] = useState(true);

  // Autoplay on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Start playing muted on load
    audio.volume = 0;
    audio.play().catch(() => {
      // Autoplay blocked, user will need to interact
      setIsPlaying(false);
    });
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = isShuffle
      ? Math.floor(Math.random() * tracks.length)
      : (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
  };

  const handlePrevious = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIndex]);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    audio.currentTime = percent * duration;
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleUnmuteOverlayClick = () => {
    setShowMuteOverlay(false);
    setVolume(savedVolume);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = savedVolume;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      // Unmute
      setVolume(savedVolume);
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.volume = savedVolume;
      }
    } else {
      // Mute
      setSavedVolume(volume);
      setVolume(0);
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#EDE8E0' }}>
      {/* Hidden audio element */}
      <audio ref={audioRef} />

      {/* Pink-coral gradient strip on right edge */}
      <div
        className="fixed top-0 right-0 w-1 h-full z-50"
        style={{
          background: 'linear-gradient(to bottom, #FFB6C1, #FF7F7F)',
        }}
      />

      {/* SECTION 1 - Page header */}
      <section className="w-full px-8 md:px-16 lg:px-24 pt-20 pb-12">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="mb-3">
            <p className="text-[11px] tracking-[0.12em] text-muted-foreground">
              FUN & EXPLORATION
            </p>
          </div>
          <motion.h1
            className="text-[56px] md:text-[72px] leading-[1.05] mb-6 relative inline-block text-foreground"
            style={{ fontWeight: 800, letterSpacing: '-0.02em' }}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 80 }}
          >
            Music I'm Listening To
            {/* Underline accent */}
            <motion.div
              className="absolute -bottom-2 left-0 h-1 rounded-full"
              style={{ backgroundColor: '#FFD700', width: '140px' }}
              initial={{ width: 0 }}
              animate={{ width: '140px' }}
              transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
            />
          </motion.h1>
          <p className="text-[18px] leading-[1.6] max-w-2xl mt-6 text-muted-foreground">
            What's on while the Figma tabs are open
          </p>
        </motion.div>
      </section>

      {/* SECTION 2 - NOW PLAYING / Media Player */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-12">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div
            className="rounded-3xl p-8 md:p-10 relative"
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            {/* Mute overlay */}
            <AnimatePresence>
              {showMuteOverlay && (
                <motion.div
                  className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center cursor-pointer z-10"
                  style={{ backgroundColor: 'rgba(26, 26, 26, 0.7)' }}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleUnmuteOverlayClick}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <VolumeX className="w-12 h-12 mb-4" style={{ color: '#FFFFFF' }} />
                  </motion.div>
                  <p className="text-[14px] font-light" style={{ color: '#FFFFFF' }}>
                    Click to unmute
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Two column layout */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* Left - Album art */}
              <div className="w-full md:w-2/5">
                <div className="relative">
                  {/* Vinyl glow effect */}
                  <div
                    className="absolute inset-0 rounded-2xl blur-2xl opacity-30"
                    style={{ backgroundColor: currentTrack.color, transform: 'scale(1.1)' }}
                  />
                  {/* Album art */}
                  <div
                    className="relative aspect-square rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: currentTrack.color }}
                  >
                    <div
                      className="text-[14px] tracking-wide opacity-30"
                      style={{ color: currentTrack.color === '#1A1A1A' ? '#FFFFFF' : '#1A1A1A' }}
                    >
                      Album art
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Track info */}
              <div className="flex-1 flex flex-col justify-center">
                {/* Now playing indicator */}
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#10B981' }}
                  />
                  <span
                    className="text-[10px] tracking-[0.12em] font-semibold"
                    style={{ color: '#10B981' }}
                  >
                    NOW PLAYING
                  </span>
                </div>

                {/* Track name */}
                <h2
                  className="text-[36px] font-bold leading-tight mb-2 text-foreground"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  {currentTrack.title}
                </h2>

                {/* Artist */}
                <p className="text-[18px] mb-2 text-muted-foreground">
                  {currentTrack.artist}
                </p>

                {/* Album */}
                <p className="text-[14px] text-muted-foreground">
                  {currentTrack.album}
                </p>
              </div>
            </div>

            {/* Player controls */}
            <div className="space-y-6">
              {/* Progress bar */}
              <div>
                <div
                  className="h-1.5 rounded-full cursor-pointer relative"
                  style={{ backgroundColor: '#EDE8E0' }}
                  onClick={handleSeek}
                >
                  <div
                    className="h-full rounded-full relative"
                    style={{
                      backgroundColor: '#1A1A1A',
                      width: `${(currentTime / duration) * 100 || 0}%`,
                    }}
                  >
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                      style={{ backgroundColor: '#1A1A1A' }}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-[12px] text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-center gap-4">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-all"
                  style={{
                    backgroundColor: isShuffle ? 'rgba(26, 26, 26, 0.1)' : 'transparent',
                    color: '#6B6860',
                  }}
                  onClick={() => setIsShuffle(!isShuffle)}
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-[rgba(26,26,26,0.05)] text-muted-foreground"
                  onClick={handlePrevious}
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <motion.button
                  className="w-14 h-14 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: '#1A1A1A' }}
                  onClick={togglePlay}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" style={{ color: '#FFFFFF' }} fill="#FFFFFF" />
                  ) : (
                    <Play className="w-6 h-6" style={{ color: '#FFFFFF' }} fill="#FFFFFF" />
                  )}
                </motion.button>

                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-[rgba(26,26,26,0.05)] text-muted-foreground"
                  onClick={handleNext}
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-all"
                  style={{
                    backgroundColor: isRepeat ? 'rgba(26, 26, 26, 0.1)' : 'transparent',
                    color: '#6B6860',
                  }}
                  onClick={() => setIsRepeat(!isRepeat)}
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Volume control */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={toggleMute}
                  className="flex items-center justify-center transition-colors"
                  style={{ color: isMuted ? '#D1D5DB' : '#8A8780' }}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    if (newVolume > 0) {
                      setIsMuted(false);
                      setSavedVolume(newVolume);
                    } else {
                      setIsMuted(true);
                    }
                  }}
                  className="w-24 h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    backgroundColor: '#EDE8E0',
                    background: isMuted
                      ? '#D1D5DB'
                      : `linear-gradient(to right, #1A1A1A ${volume * 100}%, #EDE8E0 ${volume * 100}%)`,
                    opacity: isMuted ? 0.5 : 1,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3 - Mood shelves */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-20">
        <div className="max-w-7xl mx-auto space-y-12">
          {moods.map((mood, moodIdx) => {
            const moodTracks = tracks.filter((t) => t.mood === mood);

            return (
              <div key={mood}>
                <h3
                  className="text-[13px] tracking-[0.12em] font-semibold mb-4 text-foreground"
                >
                  {mood}
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {moodTracks.map((track, idx) => {
                    const isActive = currentTrack.id === track.id;

                    return (
                      <motion.div
                        key={track.id}
                        className="flex-shrink-0 cursor-pointer"
                        style={{ width: '160px' }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: moodIdx * 0.1 + idx * 0.05 }}
                        whileHover={{ y: -4 }}
                        onClick={() => handleTrackSelect(track)}
                      >
                        <div
                          className="rounded-2xl mb-3 relative overflow-hidden"
                          style={{
                            border: isActive ? '2px solid #1A1A1A' : '2px solid transparent',
                            boxShadow: isActive
                              ? '0 4px 16px rgba(0, 0, 0, 0.15)'
                              : '0 2px 8px rgba(0, 0, 0, 0.06)',
                          }}
                        >
                          {/* Album art */}
                          <div
                            className="aspect-square flex items-center justify-center"
                            style={{ backgroundColor: track.color }}
                          >
                            <div
                              className="text-[12px] tracking-wide opacity-30"
                              style={{ color: track.color === '#1A1A1A' ? '#FFFFFF' : '#1A1A1A' }}
                            >
                              Album
                            </div>
                          </div>

                          {/* Animated equalizer bars */}
                          {isActive && isPlaying && (
                            <div className="absolute top-3 right-3 flex gap-0.5">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  className="w-0.5 rounded-full"
                                  style={{ backgroundColor: '#1A1A1A' }}
                                  animate={{
                                    height: ['8px', '16px', '8px'],
                                  }}
                                  transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Track info */}
                        <h4
                          className="text-[13px] font-bold mb-1 leading-tight text-foreground"
                        >
                          {track.title}
                        </h4>
                        <p className="text-[11px] mb-2 text-muted-foreground">
                          {track.artist}
                        </p>
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wide"
                          style={{
                            backgroundColor: 'rgba(26, 26, 26, 0.06)',
                            color: '#6B6860',
                          }}
                        >
                          {track.mood}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4 - Back navigation */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[13px] font-medium group text-muted-foreground"
            whileHover={{ x: -3 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:text-foreground transition-colors" />
            <span className="group-hover:text-foreground transition-colors">
              Back to Shivam's World
            </span>
          </motion.button>
        </div>
      </section>
    </div>
  );
}
