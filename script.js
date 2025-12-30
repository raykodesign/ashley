document.addEventListener('DOMContentLoaded', () => {
    
    // --- EFECTO MOUSE ---
    document.addEventListener('mousemove', (e) => {
        if(Math.random() > 0.15) return;
        const sparkle = document.createElement('div');
        sparkle.classList.add('golden-sparkle');
        const x = e.pageX + (Math.random() * 10 - 5);
        const y = e.pageY + (Math.random() * 10 - 5);
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        document.body.appendChild(sparkle);
        setTimeout(() => { sparkle.remove(); }, 800);
    });

    // --- ELEMENTOS PRINCIPALES ---
    const enterScreen = document.getElementById('enter-screen');
    const mainLayout = document.getElementById('main-layout');
    const typingText = document.getElementById('typing-text');
    const audio = document.getElementById('audio');
    const vinyl = document.getElementById('vinyl');
    const playIcon = document.getElementById('play-icon');
    const progressBar = document.getElementById('progress-bar');

    // --- ENTRADA ---
    if(enterScreen) {
        enterScreen.addEventListener('click', () => {
            const bgVideo = document.getElementById('bg-video');
            if(bgVideo) bgVideo.play().catch(() => {});
            enterScreen.style.opacity = '0';
            setTimeout(() => {
                enterScreen.style.display = 'none';
                mainLayout.classList.remove('hidden-layout');
                setTimeout(() => {
                    const navMenu = document.querySelector('.nav-menu');
                    if(navMenu) navMenu.classList.add('animate-buttons');
                }, 300);
                initTypewriter();
                playMusic();
            }, 800);
        });
    }

    // --- MAQUINA DE ESCRIBIR ---
    const welcomeMsg = "Coqueta, dulce, encantadora, soñadora, detallista, alegre, apasionada, leal a la vez toxica caprichosa enojona so odiame o amame..";
    function initTypewriter() {
        if(!typingText) return;
        let i = 0;
        typingText.innerHTML = "";
        function type() {
            if (i < welcomeMsg.length) {
                typingText.innerHTML += welcomeMsg.charAt(i);
                i++;
                setTimeout(type, 50); 
            }
        }
        type();
    }

    // --- GESTIÓN DE MODALES ---
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) {
            modal.classList.add('active');
            mainLayout.style.filter = "blur(10px) grayscale(50%)";
            mainLayout.style.transform = "scale(0.98)";
            if(modalId === 'modal-gallery') {
                setTimeout(() => { updateGallery3D(); }, 50);
            }
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) modal.classList.remove('active');
        mainLayout.style.filter = "none";
        mainLayout.style.transform = "scale(1)";
        
        // Pausar video de la galería al cerrar
        const galVids = document.querySelectorAll('.gallery-card-video');
        galVids.forEach(v => v.pause());
    };
    
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) closeModal(e.target.id);
    };

    // --- GALERÍA 3D (MEZCLA DE VIDEO Y FOTOS) ---
    const galleryItems = [
        // CAMBIO AQUÍ: Tipo 'special-gif' y la ruta al archivo .gif
        { 
            type: 'special-gif', 
            src: 'video/video2.gif',  // Asegúrate de que este archivo exista
            title: 'Mi amor', 
            quote: '"Love is so powerful that it can enter through a closed door and steal all of the contents of a precious heart within a moment."' 
        },
        // Las demás fotos siguen igual...
        { type: 'image', src: "https://xatimg.com/image/ZhKqFHHHSZvX.jpg" },
        { type: 'image', src: "https://xatimg.com/image/enjUD4tT7hwe.jpg" },
        { type: 'image', src: "https://xatimg.com/image/aRrMvT3eIk1j.jpg" },
        { type: 'image', src: "https://xatimg.com/image/4vuiKo6CG31w.jpg" },
        { type: 'image', src: "https://xatimg.com/image/zNlc8oUR9wLX.jpg" },
        { type: 'image', src: "https://xatimg.com/image/cBcJfqs0drrk.jpg" },
        { type: 'image', src: "https://xatimg.com/image/cWaLaagMsdpF.jpg" },
        { type: 'image', src: "https://xatimg.com/image/kRYKRhMIqiVJ.jpg" },
        { type: 'image', src: "https://xatimg.com/image/uh4kKgAQQqjS.jpg" },
        { type: 'image', src: "https://xatimg.com/image/0KJBMc2iOElL.jpg" },
        { type: 'image', src: "https://xatimg.com/image/SLDI4rfNgPGu.jpg" },
        { type: 'image', src: "https://xatimg.com/image/wRod02fG2CBK.jpg" },
        { type: 'image', src: "https://xatimg.com/image/GcP7ZTvWZo1e.jpg" },
    ];
    
    const carouselTrack = document.getElementById('carousel-3d-track');
    let galleryIndex = 0; 

    if(carouselTrack) {
        carouselTrack.innerHTML = "";
        galleryItems.forEach((item, i) => {
            const card = document.createElement('div');
            card.className = 'card-3d-gold';
            
            // CAMBIO AQUÍ: Lógica para el GIF especial
            if(item.type === 'special-gif') {
                card.innerHTML = `
                    <div class="gif-card-inner">
                        <img src="${item.src}" alt="${item.title}" class="gallery-card-gif">
                        <div class="gif-text-content">
                            <h2 class="card-gif-title">${item.title}</h2>
                            <p class="card-gif-quote">${item.quote}</p>
                        </div>
                    </div>
                `;
            } 
            // Si es IMAGEN normal (El resto)
            else {
                // Usamos object-fit: cover para las fotos normales para que llenen la tarjeta
                card.innerHTML = `<img src="${item.src}" alt="Img ${i}" style="width:100%;height:100%;object-fit:cover;">`;
            }

            card.onclick = () => { galleryIndex = i; updateGallery3D(); };
            carouselTrack.appendChild(card);
        });
    }

    window.updateGallery3D = () => {
        const cards = document.querySelectorAll('#carousel-3d-track .card-3d-gold');
        if(!cards.length) return;
        
        cards.forEach(c => c.classList.remove('active'));
        if(cards[galleryIndex]) cards[galleryIndex].classList.add('active');

        const container = document.querySelector('.gallery-container-3d');
        if(!container) return;
        
        const containerWidth = container.offsetWidth;
        const cardWidth = cards[0].offsetWidth; 
        const cardMargin = 40; 
        const fullCardSpace = cardWidth + cardMargin;

        const centerPosition = (containerWidth / 2) - (galleryIndex * fullCardSpace) - (cardWidth / 2) - 20;

        if(carouselTrack) carouselTrack.style.transform = `translateX(${centerPosition}px)`;
        
        if(cards[galleryIndex]) {
             cards[galleryIndex].style.transform = "scale(1.1) rotateY(0deg) translateZ(30px)";
        }
    };

    const galleryWrapper = document.querySelector('.gallery-wrapper');
    if(galleryWrapper) {
        galleryWrapper.addEventListener('mousemove', (e) => {
            const activeCard = document.querySelector('.card-3d-gold.active');
            if(!activeCard) return;
            // Solo rotar si NO estamos sobre los controles del video para facilitar el click
            if(e.target.tagName === 'VIDEO') return; 

            const rect = galleryWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xPct = (x / rect.width) - 0.5;
            const yPct = (y / rect.height) - 0.5;
            activeCard.style.transform = `scale(1.1) rotateY(${xPct * 30}deg) rotateX(${-yPct * 30}deg) translateZ(30px)`;
        });
        galleryWrapper.addEventListener('mouseleave', () => {
             const activeCard = document.querySelector('.card-3d-gold.active');
             if(activeCard) {
                 activeCard.style.transform = "scale(1.1) rotateY(0deg) translateZ(30px)";
                 activeCard.style.transition = "transform 0.5s ease";
             }
        });
    }

    window.moveGallery = (dir) => {
        galleryIndex += dir;
        if(galleryIndex < 0) galleryIndex = galleryItems.length - 1;
        if(galleryIndex >= galleryItems.length) galleryIndex = 0;
        updateGallery3D();
    };

    // --- MÚSICA Y PLAYLIST ---
    const playlist = [
        { title: "Canción 1", artist: "Miley Cyrus", src: "audio/Miley Cyrus - Flowers.mp3" },
        { title: "Canción 2", artist: "Belinda & Neton Vega", src: "audio/Belinda & Neton Vega - Perra Bitch.mp3" },
        { title: "Canción 3", artist: "Cyndi Lauper", src: "audio/Cyndi Lauper - Girls Just Want To Have Fun.mp3" },
        { title: "Canción 4", artist: "Belinda", src: "audio/Belinda - La mala.mp3" },
        { title: "Canción 5", artist: "Kany García", src: "audio/Kany García - La Malquerida .mp3" },
        { title: "Canción 6", artist: "KAROL G", src: "audio/KAROL G, Marco Antonio Solís - Coleccionando Heridas.mp3" },
        { title: "Canción 7", artist: "P!nk", src: "audio/P!nk - Fkin' Perfect.mp3" },
    ];
    
    let sIdx = 0; let isPlaying = false; let pInt;

    function loadMusic(i) {
        audio.src = playlist[i].src;
        const titleEl = document.getElementById('song-title');
        const artistEl = document.getElementById('song-artist');
        if(titleEl) titleEl.innerText = playlist[i].title;
        if(artistEl) artistEl.innerText = playlist[i].artist;
    }
    
    window.playMusic = () => {
        audio.play().then(() => {
            isPlaying = true;
            if(vinyl) vinyl.classList.add('vinyl-spin');
            if(playIcon) playIcon.className = "fas fa-pause";
            if(pInt) clearInterval(pInt);
            pInt = setInterval(() => {
                if(progressBar && audio.duration) {
                    progressBar.style.width = (audio.currentTime/audio.duration)*100 + "%";
                }
            }, 100);
        }).catch(() => {});
    };
    
    window.togglePlay = () => {
        if(isPlaying) {
            audio.pause(); isPlaying = false;
            if(vinyl) vinyl.classList.remove('vinyl-spin');
            if(playIcon) playIcon.className = "fas fa-play";
            clearInterval(pInt);
        } else {
            playMusic();
        }
    };
    
    window.nextSong = () => { 
        sIdx = (sIdx + 1) % playlist.length; 
        loadMusic(sIdx); 
        playMusic(); 
    };

    window.prevSong = () => { 
        sIdx = (sIdx - 1 + playlist.length) % playlist.length; 
        loadMusic(sIdx); 
        playMusic(); 
    };
    
    audio.addEventListener('ended', () => {
        nextSong();
    });
    
    if(audio) loadMusic(0);

    window.addEventListener('resize', () => {
        updateGallery3D();
    });

    document.addEventListener('contextmenu', (e) => { e.preventDefault(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || e.keyCode === 123) { e.preventDefault(); return false; }
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'i' || e.key === 'j' || e.key === 'c')) { e.preventDefault(); return false; }
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) { e.preventDefault(); return false; }
    });
});
