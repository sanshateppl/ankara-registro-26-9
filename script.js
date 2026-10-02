/**
 * ANKARA - REGISTRO 26-9
 * Minimalist Interactive Landing Page JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initSliders();
    initDriveLinks();
    initLightbox();
    initNavScrollSpy();
});

/* ==========================================================================
   SLIDER SYSTEM (WITH NUMERIC COUNTER "1 / 4")
   ========================================================================== */
function initSliders() {
    const artistCards = document.querySelectorAll('.artist-card');

    artistCards.forEach(card => {
        const track = card.querySelector('.slider-track');
        const slides = card.querySelectorAll('.slide');
        const prevBtn = card.querySelector('.slider-btn.prev');
        const nextBtn = card.querySelector('.slider-btn.next');
        const counterEl = card.querySelector('.counter-text');
        
        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        const totalSlides = slides.length;

        function updateSlide(index) {
            currentIndex = (index + totalSlides) % totalSlides;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            if (counterEl) {
                counterEl.textContent = `${currentIndex + 1} / ${totalSlides}`;
            }
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateSlide(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateSlide(currentIndex + 1);
            });
        }

        // Touch Swipe Support
        let startX = 0;
        let isSwiping = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            if (Math.abs(diffX) > 40) {
                if (diffX > 0) {
                    updateSlide(currentIndex + 1);
                } else {
                    updateSlide(currentIndex - 1);
                }
            }
            isSwiping = false;
        }, { passive: true });
    });
}

/* ==========================================================================
   DRIVE LINKS & MODAL CONFIGURATION
   ========================================================================== */
function initDriveLinks() {
    const editButtons = document.querySelectorAll('.edit-link-btn');
    const modal = document.getElementById('drive-modal');
    const input = document.getElementById('drive-url-input');
    const btnSave = document.getElementById('save-drive-url');
    const btnCancel = document.getElementById('cancel-drive-url');
    
    let currentArtistId = null;

    // Load saved links from localStorage
    document.querySelectorAll('.btn-download-drive').forEach(btn => {
        const artistId = btn.dataset.artist;
        const savedUrl = localStorage.getItem(`ankara_drive_${artistId}`);
        const previewEl = document.getElementById(`preview-drive-${artistId}`);

        if (savedUrl) {
            btn.href = savedUrl;
            if (previewEl) previewEl.textContent = savedUrl;
        }
    });

    editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentArtistId = btn.dataset.artist;
            const currentUrl = localStorage.getItem(`ankara_drive_${currentArtistId}`) || '';
            input.value = currentUrl;
            modal.classList.add('active');
            input.focus();
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        currentArtistId = null;
    }

    if (btnCancel) btnCancel.addEventListener('click', closeModal);

    if (btnSave) {
        btnSave.addEventListener('click', () => {
            if (!currentArtistId) return;
            const url = input.value.trim();
            if (url) {
                localStorage.setItem(`ankara_drive_${currentArtistId}`, url);
                const btnLink = document.querySelector(`.btn-download-drive[data-artist="${currentArtistId}"]`);
                const previewEl = document.getElementById(`preview-drive-${currentArtistId}`);
                if (btnLink) btnLink.href = url;
                if (previewEl) previewEl.textContent = url;
            } else {
                localStorage.removeItem(`ankara_drive_${currentArtistId}`);
                const btnLink = document.querySelector(`.btn-download-drive[data-artist="${currentArtistId}"]`);
                const previewEl = document.getElementById(`preview-drive-${currentArtistId}`);
                if (btnLink) btnLink.href = '#';
                if (previewEl) previewEl.textContent = 'Enlace no configurado';
            }
            closeModal();
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
}

/* ==========================================================================
   LIGHTBOX FULL-SCREEN IMAGE MODAL
   ========================================================================== */
function initLightbox() {
    const slides = document.querySelectorAll('.slide img');
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');

    if (!modal || !modalImg) return;

    slides.forEach(img => {
        img.addEventListener('click', () => {
            modalImg.src = img.src;
            modalImg.alt = img.alt || 'Retrato Artista';
            modal.classList.add('active');
        });
    });

    function closeModal() {
        modal.classList.remove('active');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === modalImg) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

/* ==========================================================================
   STICKY NAV SCROLLSPY
   ========================================================================== */
function initNavScrollSpy() {
    const sections = document.querySelectorAll('.artist-section');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -60% 0px'
    });

    sections.forEach(section => observer.observe(section));
}
