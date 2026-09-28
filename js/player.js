// Music Player Engine for Anchal 🎵🌹
// HTML5 Audio + MediaSession Lock Screen Controls + Supabase Streaming

class MusicPlayer {
  constructor(songList) {
    this.songs = songList || [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isShuffled = false;
    this.repeatMode = 'all'; // 'off' | 'all' | 'one'
    this.audio = new Audio();
    this.favorites = this.loadFavorites();

    this.initAudioListeners();
    this.initMediaSession();
  }

  initAudioListeners() {
    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.updateUI();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updateUI();
    });

    this.audio.addEventListener('timeupdate', () => {
      this.onTimeUpdate();
    });

    this.audio.addEventListener('ended', () => {
      if (this.repeatMode === 'one') {
        this.audio.currentTime = 0;
        this.audio.play();
      } else {
        this.next();
      }
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio streaming error, playing fallback:', e);
      // Auto move to next song after short delay
      setTimeout(() => this.next(), 1500);
    });
  }

  initMediaSession() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => this.play());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => this.prev());
      navigator.mediaSession.setActionHandler('nexttrack', () => this.next());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime) {
          this.audio.currentTime = details.seekTime;
        }
      });
    }
  }

  loadFavorites() {
    try {
      return JSON.parse(localStorage.getItem('anchal_fav_songs')) || [];
    } catch (_) {
      return [];
    }
  }

  saveFavorites() {
    localStorage.setItem('anchal_fav_songs', JSON.stringify(this.favorites));
  }

  isFavorite(songId) {
    return this.favorites.includes(songId);
  }

  toggleFavorite(songId) {
    if (this.isFavorite(songId)) {
      this.favorites = this.favorites.filter(id => id !== songId);
    } else {
      this.favorites.push(songId);
    }
    this.saveFavorites();
    this.updateUI();
    // Dispatch event so song lists update
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  }

  loadSong(index, autoPlay = true) {
    if (index < 0) index = this.songs.length - 1;
    if (index >= this.songs.length) index = 0;
    this.currentIndex = index;

    const song = this.songs[this.currentIndex];
    this.audio.src = song.url;
    this.audio.load();

    // MediaSession Metadata for Lock Screen & Notification Center
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: `Anchal Special 🌹 (${song.album})`,
        artwork: [
          { src: song.cover, sizes: '512x512', type: 'image/jpeg' }
        ]
      });
    }

    if (autoPlay) {
      this.play();
    }
    this.updateUI();
  }

  play() {
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.updateUI();
    }).catch(err => {
      console.log('Autoplay prevented or network error:', err);
    });
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updateUI();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      if (!this.audio.src) {
        this.loadSong(0, true);
      } else {
        this.play();
      }
    }
  }

  next() {
    let nextIdx;
    if (this.isShuffled) {
      nextIdx = Math.floor(Math.random() * this.songs.length);
    } else {
      nextIdx = (this.currentIndex + 1) % this.songs.length;
    }
    this.loadSong(nextIdx, true);
  }

  prev() {
    if (this.audio.currentTime > 4) {
      this.audio.currentTime = 0;
      return;
    }
    const prevIdx = (this.currentIndex - 1 + this.songs.length) % this.songs.length;
    this.loadSong(prevIdx, true);
  }

  seek(percent) {
    if (this.audio.duration) {
      this.audio.currentTime = (percent / 100) * this.audio.duration;
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  onTimeUpdate() {
    const cur = this.audio.currentTime;
    const dur = this.audio.duration || 0;
    const pct = dur > 0 ? (cur / dur) * 100 : 0;

    // Mini Player Progress
    const miniProgress = document.getElementById('mini-progress-bar');
    if (miniProgress) miniProgress.style.width = `${pct}%`;

    // Full Player Seekers
    const fullSeek = document.getElementById('full-seek-slider');
    const fullProgress = document.getElementById('full-progress-fill');
    if (fullSeek && !fullSeek.matches(':active')) {
      fullSeek.value = pct;
    }
    if (fullProgress) fullProgress.style.width = `${pct}%`;

    const curTimeEl = document.getElementById('full-current-time');
    const durTimeEl = document.getElementById('full-duration-time');
    if (curTimeEl) curTimeEl.textContent = this.formatTime(cur);
    if (durTimeEl && dur > 0) durTimeEl.textContent = this.formatTime(dur);
  }

  updateUI() {
    const song = this.songs[this.currentIndex];
    if (!song) return;

    // Mini Player Elements
    const miniTitle = document.getElementById('mini-title');
    const miniArtist = document.getElementById('mini-artist');
    const miniCover = document.getElementById('mini-cover');
    const miniPlayBtn = document.getElementById('mini-play-btn');

    if (miniTitle) miniTitle.textContent = song.title;
    if (miniArtist) miniArtist.textContent = song.artist;
    if (miniCover) {
      miniCover.src = song.cover;
      miniCover.classList.toggle('rotating', this.isPlaying);
    }
    if (miniPlayBtn) {
      miniPlayBtn.innerHTML = this.isPlaying ? '❚❚' : '▶';
    }

    // Full Player Elements
    const fullTitle = document.getElementById('full-title');
    const fullArtist = document.getElementById('full-artist');
    const fullAlbum = document.getElementById('full-album');
    const fullTagline = document.getElementById('full-tagline');
    const fullCover = document.getElementById('full-cover');
    const fullPlayBtn = document.getElementById('full-play-btn');
    const fullFavBtn = document.getElementById('full-fav-btn');

    if (fullTitle) fullTitle.textContent = song.title;
    if (fullArtist) fullArtist.textContent = song.artist;
    if (fullAlbum) fullAlbum.textContent = song.album;
    if (fullTagline) fullTagline.textContent = song.tagline || 'Pyaari Anchal ke liye Arijit Singh ka madhur geet 🌹';
    if (fullCover) {
      fullCover.src = song.cover;
      fullCover.classList.toggle('playing-glow', this.isPlaying);
    }
    if (fullPlayBtn) {
      fullPlayBtn.innerHTML = this.isPlaying ? '❚❚' : '▶';
    }
    if (fullFavBtn) {
      const isFav = this.isFavorite(song.id);
      fullFavBtn.classList.toggle('active', isFav);
      fullFavBtn.innerHTML = isFav ? '💖' : '🤍';
    }

    // Update active row in song lists
    document.querySelectorAll('.song-row').forEach(row => {
      const rowId = row.getAttribute('data-song-id');
      const isCur = rowId === song.id;
      row.classList.toggle('active-song', isCur);
      const playIcon = row.querySelector('.play-indicator');
      if (playIcon) {
        playIcon.innerHTML = isCur && this.isPlaying
          ? '<span class="equalizer-bar"></span><span class="equalizer-bar"></span><span class="equalizer-bar"></span>'
          : (isCur ? '❚❚' : '▶');
      }
    });
  }
}

window.MusicPlayer = MusicPlayer;
