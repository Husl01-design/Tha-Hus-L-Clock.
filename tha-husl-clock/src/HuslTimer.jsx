import { useEffect, useRef, useState } from 'react'

const TRACKS = Array.from({ length: 8 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')

  return {
    title: `Track ${number}`,
    src: `${import.meta.env.BASE_URL}music/track-${number}.mp3`,
  }
})

export default function HuslTimer() {
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [countingDown, setCountingDown] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [playbackError, setPlaybackError] = useState('')
  const audioRef = useRef(null)
  const shouldAutoplayRef = useRef(false)

  useEffect(() => {
    if (!running) return undefined

    const intervalId = window.setInterval(() => {
      setTime((currentTime) => {
        if (countingDown) {
          if (currentTime <= 10) {
            setRunning(false)
            return 0
          }
          return currentTime - 10
        }

        return currentTime + 10
      })
    }, 10)

    return () => window.clearInterval(intervalId)
  }, [countingDown, running])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.load()
    if (shouldAutoplayRef.current) {
      shouldAutoplayRef.current = false
      audio.play().catch((error) => {
        setIsPlaying(false)
        setPlaybackError('Unable to play this track. Try another track.')
        console.error('Audio playback failed:', error)
      })
    }
  }, [currentTrackIndex])

  const hours = Math.floor(time / 3_600_000).toString().padStart(2, '0')
  const minutes = Math.floor((time % 3_600_000) / 60_000).toString().padStart(2, '0')
  const seconds = Math.floor((time % 60_000) / 1_000).toString().padStart(2, '0')
  const milliseconds = Math.floor((time % 1_000) / 10).toString().padStart(2, '0')
  const currentTrack = TRACKS[currentTrackIndex]

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    setPlaybackError('')
    if (audio.paused) {
      audio.play().catch((error) => {
        setIsPlaying(false)
        setPlaybackError('Unable to play this track. Try another track.')
        console.error('Audio playback failed:', error)
      })
    } else {
      audio.pause()
    }
  }

  const changeTrack = (direction) => {
    shouldAutoplayRef.current = true
    setPlaybackError('')
    setCurrentTime(0)
    setDuration(0)
    setCurrentTrackIndex((index) => (index + direction + TRACKS.length) % TRACKS.length)
  }

  const formatTime = (value) => {
    if (!Number.isFinite(value)) return '00:00'
    const trackMinutes = String(Math.floor(value / 60)).padStart(2, '0')
    const trackSeconds = String(Math.floor(value % 60)).padStart(2, '0')
    return `${trackMinutes}:${trackSeconds}`
  }

  return (
    <>
      <div
        className="digits-group"
        role="timer"
        aria-label={`${hours} hours ${minutes} minutes ${seconds} seconds`}
      >
        <span className="digit">{hours}</span>
        <span className="separator">:</span>
        <span className="digit">{minutes}</span>
        <span className="separator">:</span>
        <span className="seconds-block">
          <span className="seconds-digits">
            <span className="digit">{seconds}</span>
          </span>
          <span className="ms-block">
            <span className="ms-label">ms</span>
            <span className="ms-digit">{milliseconds}</span>
          </span>
        </span>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={() => changeTrack(1)}
        onError={() => {
          setIsPlaying(false)
          setPlaybackError('This track could not be loaded.')
        }}
      />

      <div className="husl-music-container">
        <div className="music-header">
          <span className="material-symbols-outlined music-icon" aria-hidden="true">music_note</span>
          <div className="track-info">
            <span className="track-label">TRACK {currentTrackIndex + 1} OF {TRACKS.length}:</span>
            <span className="track-title">{currentTrack.title}</span>
            {playbackError && <span className="track-error" role="alert">{playbackError}</span>}
          </div>
        </div>

        <div className="music-controls-row">
          <button
            className="player-btn"
            type="button"
            onClick={() => changeTrack(-1)}
            aria-label="Previous track"
          >
            <span className="material-symbols-outlined" aria-hidden="true">skip_previous</span>
          </button>
          <button
            className="player-btn play-pause-btn"
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <button
            className="player-btn"
            type="button"
            onClick={() => changeTrack(1)}
            aria-label="Next track"
          >
            <span className="material-symbols-outlined" aria-hidden="true">skip_next</span>
          </button>
          <div className="volume-group">
            <span className="material-symbols-outlined volume-icon" aria-hidden="true">
              {volume === 0 ? 'volume_off' : 'volume_up'}
            </span>
            <input
              className="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              aria-label="Volume"
            />
          </div>
        </div>

        <div className="progress-bar-container">
          <span className="time-current">{formatTime(currentTime)}</span>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Track progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={duration ? Math.round((currentTime / duration) * 100) : 0}
          >
            <div
              className="progress-fill"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <span className="time-total">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="controls-pill">
        <div className="edge-btn-wrapper">
          <button
            className="edge-hud-btn"
            aria-label="Subtract minute"
            type="button"
            onClick={() => setTime((currentTime) => Math.max(0, currentTime - 60_000))}
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
          <span className="pill-badge pill-badge--left">1</span>
        </div>

        <div className="control-stack">
          <button
            className="icon-hud-btn"
            aria-label="Count up mode"
            aria-pressed={!countingDown}
            type="button"
            onClick={() => setCountingDown(false)}
          >
            <span className="material-symbols-outlined white-icon">arrow_upward</span>
          </button>
          <span className="control-label">count up</span>
        </div>

        <span className="control-separator">|</span>

        <div className="actions-group">
          <button
            className="action-hud-btn"
            aria-label="Start timer"
            type="button"
            onClick={() => setRunning(true)}
          >
            <span className="material-symbols-outlined">play_arrow</span>
            <span className="btn-text">START</span>
          </button>
          <button
            className="action-hud-btn"
            aria-label="Pause timer"
            type="button"
            onClick={() => setRunning(false)}
          >
            <span className="material-symbols-outlined">pause</span>
            <span className="btn-text">PAUSE</span>
          </button>
          <button
            className="action-hud-btn"
            aria-label="Stop timer"
            type="button"
            onClick={() => {
              setRunning(false)
              setTime(0)
            }}
          >
            <span className="material-symbols-outlined">stop</span>
            <span className="btn-text">STOP</span>
          </button>
        </div>

        <span className="control-separator">|</span>

        <div className="control-stack">
          <button
            className="icon-hud-btn"
            aria-label="Count down mode"
            aria-pressed={countingDown}
            type="button"
            onClick={() => setCountingDown(true)}
          >
            <span className="material-symbols-outlined white-icon">arrow_downward</span>
          </button>
          <span className="control-label">count down</span>
        </div>

        <div className="edge-btn-wrapper">
          <button
            className="edge-hud-btn"
            aria-label="Add minute"
            type="button"
            onClick={() => setTime((currentTime) => currentTime + 60_000)}
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          <span className="pill-badge">1</span>
        </div>
      </div>
    </>
  )
}
