document.addEventListener('DOMContentLoaded', () => {
    
    // --- EFECTO MOUSE: BRILLOS DORADOS (Con la flecha visible por CSS) ---
    document.addEventListener('mousemove', (e) => {
        // Reducimos frecuencia para no saturar
        if(Math.random() > 0.15) return;

        const sparkle = document.createElement('div');
        sparkle.classList.add('golden-sparkle');
        
        // Posición mouse con ligera variación
        const x = e.pageX + (Math.random() * 10 - 5);
        const y = e.pageY + (Math.random() * 10 - 5);

        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        
        document.body.appendChild(sparkle);

        // Eliminar después de 0.8 segundo
        setTimeout(() => {
            sparkle.remove();
        }, 800);
    });

    // --- ELEMENTOS PRINCIPALES ---
    const enterScreen = document.getElementById('enter-screen');
    const enterClickArea = document.getElementById('enter-click-area'); 
    const mainLayout = document.getElementById('main-layout');
    const typingText = document.getElementById('typing-text');
    const audio = document.getElementById('audio');
    const vinyl = document.getElementById('vinyl');
    const playIcon = document.getElementById('play-icon');
    const progressBar = document.getElementById('progress-bar');

    // --- ENTRADA (CLICK EN TODA LA PANTALLA) ---
    if(enterScreen) {
        enterScreen.addEventListener('click', () => {
            // Intentar reproducir video si el navegador lo pausó por políticas de energía
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
                setTimeout(() => {
                    updateGallery3D();
                }, 50);
            }
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) modal.classList.remove('active');
        mainLayout.style.filter = "none";
        mainLayout.style.transform = "scale(1)";
    };
    
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) closeModal(e.target.id);
    };

    // --- GALERÍA 3D ---
    const galleryImages = [
        "https://xatimg.com/image/ZhKqFHHHSZvX.jpg",
        "https://xatimg.com/image/enjUD4tT7hwe.jpg",
        "https://xatimg.com/image/aRrMvT3eIk1j.jpg",
        "https://xatimg.com/image/4vuiKo6CG31w.jpg",
        "https://xatimg.com/image/zNlc8oUR9wLX.jpg",
        "https://xatimg.com/image/cBcJfqs0drrk.jpg",
        "https://xatimg.com/image/cWaLaagMsdpF.jpg",
        "https://xatimg.com/image/kRYKRhMIqiVJ.jpg",
        "https://xatimg.com/image/uh4kKgAQQqjS.jpg",
        "https://xatimg.com/image/0KJBMc2iOElL.jpg",
        "https://xatimg.com/image/SLDI4rfNgPGu.jpg",
        "https://xatimg.com/image/wRod02fG2CBK.jpg",
        "https://xatimg.com/image/GcP7ZTvWZo1e.jpg",
    ];
    
    const carouselTrack = document.getElementById('carousel-3d-track');
    let galleryIndex = 0; 

    if(carouselTrack) {
        carouselTrack.innerHTML = "";
        galleryImages.forEach((src, i) => {
            const card = document.createElement('div');
            card.className = 'card-3d-gold';
            // CAMBIO: object-fit: contain para que la imagen se vea completa
            card.innerHTML = `<img src="${src}" alt="Img ${i}" style="width:100%;height:100%;object-fit:contain;background:#000;">`;
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
        
        // Reset transform visual (para que no se quede chueca tras el efecto mouse)
        if(cards[galleryIndex]) {
             cards[galleryIndex].style.transform = "scale(1.1) rotateY(0deg) translateZ(30px)";
        }
    };

    // --- NUEVO: EFECTO MOVIMIENTO DE FOTO CON EL MOUSE ---
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    if(galleryWrapper) {
        galleryWrapper.addEventListener('mousemove', (e) => {
            const activeCard = document.querySelector('.card-3d-gold.active');
            if(!activeCard) return;

            // Obtener coordenadas relativas al contenedor
            const rect = galleryWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calcular porcentaje (-0.5 a 0.5)
            const xPct = (x / rect.width) - 0.5;
            const yPct = (y / rect.height) - 0.5;

            // Aplicar rotación suave (Tilt)
            // Multiplicamos por 20 para dar un ángulo max de 10 grados aprox
            activeCard.style.transform = `scale(1.1) rotateY(${xPct * 30}deg) rotateX(${-yPct * 30}deg) translateZ(30px)`;
        });

        // Resetear cuando el mouse sale
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
        if(galleryIndex < 0) galleryIndex = galleryImages.length - 1;
        if(galleryIndex >= galleryImages.length) galleryIndex = 0;
        updateGallery3D();
    };

    // --- MÚSICA ---
    const playlist = [
        { title: "Girls Just Want To Have Fun", artist: "Cyndi Lauper", src: "audio/Cyndi Lauper - Girls Just Want To Have Fun.mp3" },
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
    
    window.nextSong = () => { sIdx=(sIdx+1)%playlist.length; loadMusic(sIdx); playMusic(); };
    window.prevSong = () => { sIdx=(sIdx-1+playlist.length)%playlist.length; loadMusic(sIdx); playMusic(); };
    
    if(audio) loadMusic(0);

    window.addEventListener('resize', () => {
        updateGallery3D();
    });

    // --- PROTECCIÓN ---
    document.addEventListener('contextmenu', (e) => { e.preventDefault(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || e.keyCode === 123) { e.preventDefault(); return false; }
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'i' || e.key === 'j' || e.key === 'c')) { e.preventDefault(); return false; }
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) { e.preventDefault(); return false; }
    });

});