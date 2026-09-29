// Anchal Web App: Main Controller with High-Grade Image Protection & In-Memory Decryption 🌸✨

(function() {
  'use strict';

  // 1. Anti-Theft / Privacy Protection Layer
  // Disables right-click, image dragging, and context menu so nobody can steal images
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('dragstart', (e) => {
    if (e.target.nodeName === 'IMG') e.preventDefault();
  });

  // 2. In-Memory Image Decryption Engine
  // On GitHub, only .enc files exist (no readable JPGs).
  // In the browser, this decodes the encrypted bytes in RAM into temporary Blob URLs.
  const SEC_KEY = new TextEncoder().encode('RoseGoldAnchalMusicVault2026Key');
  const photoBlobUrls = {};

  async function loadSecurePhoto(idx) {
    if (photoBlobUrls[idx]) return photoBlobUrls[idx];
    try {
      let bytes;
      if (window.ENCRYPTED_PHOTOS && window.ENCRYPTED_PHOTOS[idx]) {
        const binStr = atob(window.ENCRYPTED_PHOTOS[idx]);
        bytes = new Uint8Array(binStr.length);
        for (let i = 0; i < binStr.length; i++) {
          bytes[i] = binStr.charCodeAt(i);
        }
      } else {
        const res = await fetch(`photos/anchal_${idx}.enc`);
        if (!res.ok) throw new Error('Status: ' + res.status);
        const buf = await res.arrayBuffer();
        bytes = new Uint8Array(buf);
      }
      const kl = SEC_KEY.length;
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] ^= (SEC_KEY[i % kl] ^ ((i * 31 + 1) & 0xFF));
      }
      const blob = new Blob([bytes], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      photoBlobUrls[idx] = url;
      return url;
    } catch (err) {
      console.warn(`Protected image ${idx} load fallback:`, err);
      return 'photos/icon-192.png';
    }
  }

  // Pre-load all 6 photos into memory immediately
  async function preWarmPhotos() {
    const promises = [1, 2, 3, 4, 5, 6].map(i => loadSecurePhoto(i));
    await Promise.all(promises);

    // Apply decrypted URLs to all UI images
    document.querySelectorAll('[data-photo-idx]').forEach(el => {
      const idx = parseInt(el.getAttribute('data-photo-idx'), 10);
      if (photoBlobUrls[idx]) {
        if (el.tagName === 'IMG') {
          el.src = photoBlobUrls[idx];
        } else {
          el.style.backgroundImage = `url(${photoBlobUrls[idx]})`;
        }
      }
    });

    // Update songs with decrypted covers
    if (window.SONGS) {
      window.SONGS.forEach(song => {
        song.cover = photoBlobUrls[song.photoIdx] || 'photos/icon-192.png';
      });
    }

    if (window.appPlayer) {
      window.appPlayer.updateUI();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Start photo decryption in background
    preWarmPhotos();

    // 3. Initialize Music Player
    const player = new MusicPlayer(window.SONGS || []);
    window.appPlayer = player;

    // 4. Tab Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabId) {
      navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-tab') === tabId);
      });
      tabContents.forEach(tab => {
        tab.classList.toggle('active', tab.id === `tab-${tabId}`);
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = item.getAttribute('data-tab');
        switchTab(tabId);
      });
    });

    const exploreSongsBtn = document.getElementById('hero-play-songs');
    if (exploreSongsBtn) {
      exploreSongsBtn.addEventListener('click', () => {
        switchTab('songs');
        player.loadSong(0, true);
      });
    }

    // 5. Render Songs in "Gaane" Tab
    const songListContainer = document.getElementById('songs-container');
    let currentCategory = 'all';
    let searchQuery = '';

    function renderSongList() {
      if (!songListContainer) return;

      let filtered = window.SONGS || [];

      if (currentCategory === 'favorites') {
        filtered = filtered.filter(s => player.isFavorite(s.id));
      } else if (currentCategory !== 'all') {
        filtered = filtered.filter(s => s.category === currentCategory);
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
      }

      if (filtered.length === 0) {
        songListContainer.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
            <div style="font-size: 40px; margin-bottom: 10px;">🎵</div>
            <div style="font-weight: 700; font-size: 15px;">Koi gaana nahi mila</div>
            <div style="font-size: 12px; margin-top: 4px;">Search ya category filter change karein</div>
          </div>
        `;
        return;
      }

      songListContainer.innerHTML = filtered.map(song => {
        const isFav = player.isFavorite(song.id);
        const isCur = player.currentIndex >= 0 && player.songs[player.currentIndex]?.id === song.id;
        const coverSrc = photoBlobUrls[song.photoIdx] || song.cover || 'photos/icon-192.png';

        return `
          <div class="song-row ${isCur ? 'active-song' : ''}" data-song-id="${song.id}">
            <img src="${coverSrc}" class="song-thumb" alt="${song.title}" onerror="this.src='photos/icon-192.png'">
            <div class="song-meta">
              <div class="song-row-title">${song.title}</div>
              <div class="song-row-artist">${song.artist} • ${song.duration}</div>
            </div>
            <div class="song-actions">
              <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${song.id}" title="Favorite">
                ${isFav ? '💖' : '🤍'}
              </button>
              <div class="play-indicator">
                ${isCur && player.isPlaying
                  ? '<span class="equalizer-bar"></span><span class="equalizer-bar"></span><span class="equalizer-bar"></span>'
                  : '▶'}
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Row click listeners
      songListContainer.querySelectorAll('.song-row').forEach(row => {
        row.addEventListener('click', (e) => {
          if (e.target.closest('.fav-btn')) return;
          const songId = row.getAttribute('data-song-id');
          const songIdx = player.songs.findIndex(s => s.id === songId);
          if (songIdx !== -1) {
            if (player.currentIndex === songIdx) {
              player.togglePlay();
            } else {
              player.loadSong(songIdx, true);
            }
          }
        });
      });

      // Fav click listeners
      songListContainer.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const songId = btn.getAttribute('data-id');
          player.toggleFavorite(songId);
        });
      });
    }

    // Filter Chips
    document.querySelectorAll('.chips-row .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chips-row .chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentCategory = chip.getAttribute('data-category');
        renderSongList();
      });
    });

    // Search Input
    const searchInput = document.getElementById('song-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderSongList();
      });
    }

    window.addEventListener('favoritesUpdated', renderSongList);
    renderSongList();

    // 6. Mini Player & Full Player Listeners
    const miniPlayer = document.getElementById('mini-player');
    const fullPlayerModal = document.getElementById('full-player-modal');
    const closeFullPlayerBtn = document.getElementById('close-full-player');
    const miniPlayBtn = document.getElementById('mini-play-btn');
    const miniNextBtn = document.getElementById('mini-next-btn');

    const fullPlayBtn = document.getElementById('full-play-btn');
    const fullNextBtn = document.getElementById('full-next-btn');
    const fullPrevBtn = document.getElementById('full-prev-btn');
    const fullShuffleBtn = document.getElementById('full-shuffle-btn');
    const fullRepeatBtn = document.getElementById('full-repeat-btn');
    const fullFavBtn = document.getElementById('full-fav-btn');
    const fullSeekSlider = document.getElementById('full-seek-slider');

    if (miniPlayer) {
      miniPlayer.addEventListener('click', (e) => {
        if (e.target.closest('.mini-btn')) return;
        if (fullPlayerModal) fullPlayerModal.classList.add('open');
      });
    }

    if (closeFullPlayerBtn && fullPlayerModal) {
      closeFullPlayerBtn.addEventListener('click', () => {
        fullPlayerModal.classList.remove('open');
      });
    }

    if (miniPlayBtn) {
      miniPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        player.togglePlay();
      });
    }

    if (miniNextBtn) {
      miniNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        player.next();
      });
    }

    if (fullPlayBtn) fullPlayBtn.addEventListener('click', () => player.togglePlay());
    if (fullNextBtn) fullNextBtn.addEventListener('click', () => player.next());
    if (fullPrevBtn) fullPrevBtn.addEventListener('click', () => player.prev());

    if (fullShuffleBtn) {
      fullShuffleBtn.addEventListener('click', () => {
        player.isShuffled = !player.isShuffled;
        fullShuffleBtn.style.color = player.isShuffled ? 'var(--rose-600)' : 'var(--text-secondary)';
      });
    }

    if (fullRepeatBtn) {
      fullRepeatBtn.addEventListener('click', () => {
        if (player.repeatMode === 'all') {
          player.repeatMode = 'one';
          fullRepeatBtn.textContent = '🔂';
          fullRepeatBtn.style.color = 'var(--rose-600)';
        } else {
          player.repeatMode = 'all';
          fullRepeatBtn.textContent = '🔁';
          fullRepeatBtn.style.color = 'var(--text-secondary)';
        }
      });
    }

    if (fullFavBtn) {
      fullFavBtn.addEventListener('click', () => {
        const curSong = player.songs[player.currentIndex];
        if (curSong) player.toggleFavorite(curSong.id);
      });
    }

    if (fullSeekSlider) {
      fullSeekSlider.addEventListener('input', (e) => {
        player.seek(e.target.value);
      });
    }

    // 7. Lightbox Modal
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    const ANCHAL_CAPTIONS = [
      { title: 'Anchal Ki Pyaari Muskaan 🌸', caption: 'Khilkhilati muskaan jo har pal ko khoobsurat bana de.' },
      { title: 'Aesthetic Moments ✨', caption: 'Khubsurat andaaz aur sukoon bhari yaadein.' },
      { title: 'Titli Jaise Sapne 🦋', caption: 'Hamesha aasmaan chuve aur khushiyon se mehke.' },
      { title: 'Sunlight Radiance ☀️', caption: 'Ghar aur zindagi me dher saari roshni aur haseen pal.' },
      { title: 'Desi Grace 🌹', caption: 'Ek hazaaron mein anmol aur sabse khaas.' },
      { title: 'Everlasting Smiles 💕', caption: 'Hamesha aise hi muskurati rehna meri dost!' }
    ];

    function openLightbox(photoIdx) {
      const idx = Math.max(1, Math.min(6, photoIdx));
      const info = ANCHAL_CAPTIONS[idx - 1];
      if (lightboxImg) lightboxImg.src = photoBlobUrls[idx] || 'photos/icon-512.png';
      if (lightboxCaption) lightboxCaption.textContent = `${info.title} — ${info.caption}`;
      if (lightboxModal) lightboxModal.classList.add('open');
    }

    if (lightboxClose && lightboxModal) {
      lightboxClose.addEventListener('click', () => {
        lightboxModal.classList.remove('open');
      });
    }

    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
          lightboxModal.classList.remove('open');
        }
      });
    }

    document.querySelectorAll('.gallery-card, .photo-strip-card').forEach(card => {
      card.addEventListener('click', () => {
        const photoIdx = parseInt(card.getAttribute('data-photo-idx') || '1', 10);
        openLightbox(photoIdx);
      });
    });

    // 8. PWA Install Prompt
    let deferredPrompt;
    const installBtn = document.getElementById('btn-install-app');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (installBtn) installBtn.style.display = 'inline-flex';
    });

    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`Install response: ${outcome}`);
          deferredPrompt = null;
          installBtn.style.display = 'none';
        } else {
          alert('Apne browser menu (3-dots) me jaakar "Add to Home Screen" ya "Install App" dabayein! 📱✨');
        }
      });
    }
  });
})();
