import React, { useState, useRef } from 'react';
import { Play, Pause, Film, Clock, Maximize2 } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import projectsDb from '../data/projects_db.json';

export default function VideoShowcase({ lang }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const isEn = lang === 'EN';

  const videosList = (projectsDb && projectsDb.videos && projectsDb.videos.length > 0)
    ? projectsDb.videos
    : [];

  const currentVideo = videosList[activeIdx] || videosList[0] || {};

  const handlePlayToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSelectVideo = (idx) => {
    setActiveIdx(idx);
    setIsPlaying(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 100);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (!videosList || videosList.length === 0) return null;

  return (
    <section id="video-showcase" className="videos-section">
      <div className="container">
        {/* Section Header */}
        <div className="videos-header">
          <h2 className="videos-main-title">
            {isEn ? 'Architectural Video Series' : 'Mimari Video Serisi'}
          </h2>
          <p className="videos-subtitle">
            {isEn 
              ? 'Real site highlights demonstrating bricklaying, klinker wall cladding, and craftsmanship.'
              : 'Canlı şantiye ortamından tuğla örme, klinker kaplama ve usta el işçiliği videolarımız.'}
          </p>
        </div>

        <div className="video-player-grid">
          {/* Main Active HTML5 Video Player */}
          <div className="main-video-screen">
            <video
              ref={videoRef}
              src={currentVideo.videoUrl}
              poster={currentVideo.poster}
              className="active-html5-video"
              loop
              playsInline
              onEnded={() => setIsPlaying(false)}
              onClick={handlePlayToggle}
            />

            {!isPlaying && (
              <div className="video-overlay-big-play" onClick={handlePlayToggle}>
                <button className="play-big-btn" aria-label="Oynat">
                  <Play size={36} style={{ marginLeft: '4px' }} />
                </button>
              </div>
            )}

            <div className="video-screen-controls">
              <div className="ctrl-left">
                <button className="ctrl-btn" onClick={handlePlayToggle}>
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
                {currentVideo.category && <span className="video-cat-badge">{currentVideo.category}</span>}
                <span className="video-title-display">{isEn ? currentVideo.titleEn : currentVideo.title}</span>
              </div>

              <div className="ctrl-right">
                <span className="video-time-badge">
                  <Clock size={12} /> {currentVideo.duration || '0:18'}
                </span>
                <button className="ctrl-btn" onClick={handleFullscreen} title="Tam Ekran">
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Playlist Side Bar */}
          <div className="video-playlist">
            <h4 className="playlist-heading">
              <Film size={16} /> {isEn ? 'Project Videos' : 'Şantiye & Proje Videoları'} ({videosList.length})
            </h4>

            <div className="playlist-items">
              {videosList.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className={`playlist-item ${activeIdx === idx ? 'active' : ''}`}
                  onClick={() => handleSelectVideo(idx)}
                >
                  <div className="item-thumb-box">
                    <video src={item.videoUrl} className="item-thumb-video" preload="metadata" muted />
                    <span className="item-play-icon">
                      {activeIdx === idx && isPlaying ? <Pause size={12} /> : <Play size={12} />}
                    </span>
                  </div>
                  <div className="item-info">
                    <div className="item-top-row">
                      {item.category && <span className="item-cat-text">{isEn ? (item.categoryEn || item.category) : item.category}</span>}
                      <span className="item-time">{item.duration || '0:18'}</span>
                    </div>
                    <h5 className="item-title">{isEn ? (item.titleEn || item.title) : item.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .videos-section {
          padding: 70px 0;
          background-color: var(--bg-dark);
          color: #FFFFFF;
          border-top: 1px solid var(--border-dark);
        }
        .videos-header {
          margin-bottom: 28px;
        }
        .videos-main-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 6px;
        }
        .videos-subtitle {
          font-size: 1rem;
          color: var(--text-light-muted);
        }
        .video-player-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 28px;
          align-items: stretch;
        }
        .main-video-screen {
          position: relative;
          width: 100%;
          height: 480px;
          background-color: #121110;
          overflow: hidden;
          border: 1px solid var(--border-dark);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .active-html5-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          cursor: pointer;
        }
        .video-overlay-big-play {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .video-overlay-big-play:hover {
          background: rgba(0, 0, 0, 0.25);
        }
        .play-big-btn {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
          border: 3px solid rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 28px rgba(226, 114, 91, 0.6);
          transition: transform 0.3s ease, background-color 0.3s ease;
        }
        .video-overlay-big-play:hover .play-big-btn {
          transform: scale(1.1);
          background-color: #D65A3B;
        }
        .video-screen-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 20px;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 4;
        }
        .ctrl-left, .ctrl-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ctrl-btn {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          width: 34px;
          height: 34px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .ctrl-btn:hover {
          background-color: var(--accent-terracotta);
          border-color: var(--accent-terracotta);
        }
        .video-cat-badge {
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 3px 8px;
          border-radius: 3px;
          text-transform: uppercase;
        }
        .video-title-display {
          font-size: 0.95rem;
          font-weight: 600;
          color: #FFFFFF;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 320px;
        }
        .video-time-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.8);
          background: rgba(0, 0, 0, 0.5);
          padding: 4px 10px;
          border-radius: 4px;
        }

        .video-playlist {
          background-color: #1A1817;
          border: 1px solid var(--border-dark);
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          max-height: 480px;
        }
        .playlist-heading {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--accent-clay);
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-dark);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .playlist-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .playlist-item {
          display: flex;
          gap: 12px;
          padding: 8px;
          border-radius: 6px;
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .playlist-item:hover, .playlist-item.active {
          background-color: rgba(226, 114, 91, 0.12);
          border-color: rgba(226, 114, 91, 0.35);
        }
        .item-thumb-box {
          position: relative;
          width: 80px;
          height: 56px;
          border-radius: 4px;
          overflow: hidden;
          background: #000;
          flex-shrink: 0;
        }
        .item-thumb-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .item-play-icon {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFF;
        }
        .item-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          min-width: 0;
        }
        .item-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .item-cat-text {
          font-size: 0.68rem;
          color: var(--accent-terracotta);
          font-weight: 700;
          text-transform: uppercase;
        }
        .item-time {
          font-size: 0.7rem;
          color: var(--text-light-muted);
        }
        .item-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #FFFFFF;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
        }

        @media (max-width: 992px) {
          .video-player-grid { grid-template-columns: 1fr; }
          .main-video-screen { height: 320px; }
          .video-playlist { max-height: 360px; }
          .item-title { white-space: normal; }
        }
        @media (max-width: 576px) {
          .main-video-screen { height: 230px; }
          .video-section-title { font-size: 1.8rem; }
          .video-playlist { max-height: 280px; }
        }
      `}</style>
    </section>
  );
}
