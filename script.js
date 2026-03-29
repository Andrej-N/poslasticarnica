/* ============================================
   IŠLER POSLASTIČARNICA — Main Script
   Advanced scroll animations, no libraries
   ============================================ */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initNav();
        initSplitHeadings();
        initRevealAnimations();
        initGalleryReveal();
        initScrollAnimations();
        initCountUp();
        initLightbox();
        initParticles();
        initMagneticHover();
    }

    // ============================================
    // NAVIGATION
    // ============================================
    function initNav() {
        var nav = document.getElementById('nav');
        var toggle = document.getElementById('navToggle');
        var links = document.getElementById('navLinks');

        window.addEventListener('scroll', function () {
            if (window.scrollY > 60) {
                nav.classList.add('nav--scrolled');
            } else {
                nav.classList.remove('nav--scrolled');
            }
        }, { passive: true });

        toggle.addEventListener('click', function () {
            var isOpen = links.classList.toggle('nav__links--open');
            toggle.classList.toggle('nav__toggle--open');
            toggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        links.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                links.classList.remove('nav__links--open');
                toggle.classList.remove('nav__toggle--open');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ============================================
    // SPLIT HEADINGS — wrap each word for animation
    // ============================================
    function initSplitHeadings() {
        document.querySelectorAll('.split-heading').forEach(function (el) {
            var text = el.textContent.trim();
            var words = text.split(/\s+/);
            el.innerHTML = words.map(function (word) {
                return '<span class="word"><span class="word-inner">' + word + '</span></span>';
            }).join('');
        });
    }

    // ============================================
    // REVEAL ANIMATIONS (Intersection Observer)
    // ============================================
    function initRevealAnimations() {
        var elements = document.querySelectorAll('.reveal-text, .split-heading');

        if (!('IntersectionObserver' in window)) {
            elements.forEach(function (el) { el.classList.add('revealed'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        elements.forEach(function (el) { observer.observe(el); });
    }

    // ============================================
    // GALLERY — Staggered reveal
    // ============================================
    function initGalleryReveal() {
        var items = document.querySelectorAll('.gallery__item');
        if (!items.length) return;

        items.forEach(function (item, i) {
            item.setAttribute('data-delay', (i % 8) + 1);
        });

        if (!('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('revealed'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

        items.forEach(function (el) { observer.observe(el); });
    }

    // ============================================
    // SCROLL ANIMATIONS — the big one
    // Parallax, scale, rotation, all scroll-driven
    // ============================================
    function initScrollAnimations() {
        var hero = document.querySelector('.hero');
        var heroContent = document.querySelector('.hero__content');
        var heroLogo = document.querySelector('.hero__logo');
        var storySection = document.querySelector('.story');
        var storyBlocks = document.querySelectorAll('.story__text-block');
        var storyStats = document.querySelector('.story__stats');
        var galleryItems = document.querySelectorAll('.gallery__item');
        var scaleHeading = document.querySelector('.scale-heading');
        var ctaSection = document.querySelector('.cta');
        var ctaText = document.querySelector('.cta__text');
        var ctaButton = document.querySelector('.cta__button');

        // Pre-calculate random parallax speeds for gallery items
        var gallerySpeeds = [];
        galleryItems.forEach(function () {
            gallerySpeeds.push((Math.random() * 0.08) + 0.02); // 0.02 to 0.10
        });
        // Random subtle rotation per gallery item
        var galleryRotations = [];
        galleryItems.forEach(function () {
            galleryRotations.push((Math.random() - 0.5) * 3); // -1.5 to 1.5 degrees
        });

        var ticking = false;

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        }

        function updateAnimations() {
            ticking = false;
            var scrollY = window.scrollY;
            var vh = window.innerHeight;

            // ── HERO parallax & zoom out ──
            if (hero) {
                var heroH = hero.offsetHeight;
                if (scrollY < heroH) {
                    var p = scrollY / heroH; // 0 → 1
                    if (heroContent) {
                        heroContent.style.transform =
                            'translateY(' + (scrollY * 0.3) + 'px) scale(' + (1 - p * 0.15) + ')';
                        heroContent.style.opacity = 1 - p * 1.8;
                    }
                }
            }

            // ── STORY section text blocks — slide in from sides ──
            if (storyBlocks.length) {
                storyBlocks.forEach(function (block, i) {
                    var rect = block.getBoundingClientRect();
                    var progress = 1 - (rect.top / (vh * 0.8));
                    progress = Math.max(0, Math.min(1, progress));

                    // Ease
                    var eased = 1 - Math.pow(1 - progress, 3);

                    var direction = i % 2 === 0 ? -1 : 1;
                    var translateX = (1 - eased) * 60 * direction;
                    var translateY = (1 - eased) * 30;

                    block.style.transform =
                        'translateX(' + translateX + 'px) translateY(' + translateY + 'px)';
                    block.style.opacity = eased;
                });
            }

            // ── STORY stats — scale up ──
            if (storyStats) {
                var statsRect = storyStats.getBoundingClientRect();
                var statsProgress = 1 - (statsRect.top / (vh * 0.85));
                statsProgress = Math.max(0, Math.min(1, statsProgress));
                var statsEased = 1 - Math.pow(1 - statsProgress, 3);
                storyStats.style.transform = 'scale(' + (0.85 + statsEased * 0.15) + ')';
            }


            // ── CTA SCALE HEADING — scale from 0.6 to 1 ──
            if (scaleHeading && ctaSection) {
                var ctaRect = ctaSection.getBoundingClientRect();
                var ctaProgress = 1 - (ctaRect.top / (vh * 0.75));
                ctaProgress = Math.max(0, Math.min(1, ctaProgress));
                var ctaEased = 1 - Math.pow(1 - ctaProgress, 4);

                scaleHeading.style.transform = 'scale(' + (0.6 + ctaEased * 0.4) + ')';
                scaleHeading.style.opacity = ctaEased;

                // CTA text and button — slide up
                if (ctaText) {
                    var textDelay = Math.max(0, Math.min(1, (ctaProgress - 0.3) / 0.7));
                    var textEased = 1 - Math.pow(1 - textDelay, 3);
                    ctaText.style.transform = 'translateY(' + ((1 - textEased) * 40) + 'px)';
                    ctaText.style.opacity = textEased;
                }
                if (ctaButton) {
                    var btnDelay = Math.max(0, Math.min(1, (ctaProgress - 0.5) / 0.5));
                    var btnEased = 1 - Math.pow(1 - btnDelay, 3);
                    ctaButton.style.transform = 'translateY(' + ((1 - btnEased) * 30) + 'px)';
                    ctaButton.style.opacity = btnEased;
                }
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Initial call
    }

    // ============================================
    // COUNT-UP ANIMATION
    // ============================================
    function initCountUp() {
        var numbers = document.querySelectorAll('.stat__number');
        if (!numbers.length) return;
        var hasRun = false;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !hasRun) {
                    hasRun = true;
                    numbers.forEach(function (el) {
                        animateNumber(el, parseInt(el.getAttribute('data-target'), 10));
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(document.querySelector('.story__stats'));
    }

    function animateNumber(el, target) {
        var duration = 2000;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = formatNumber(Math.floor(eased * target));
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = formatNumber(target);
            }
        }
        requestAnimationFrame(step);
    }

    function formatNumber(n) {
        return n >= 1000 ? n.toLocaleString('sr-RS') : n.toString();
    }

    // ============================================
    // LIGHTBOX
    // ============================================
    function initLightbox() {
        var lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML =
            '<button class="lightbox__close" aria-label="Zatvori"></button>' +
            '<button class="lightbox__nav lightbox__nav--prev" aria-label="Prethodna">&#8249;</button>' +
            '<button class="lightbox__nav lightbox__nav--next" aria-label="Sledeća">&#8250;</button>' +
            '<img class="lightbox__img" src="" alt="">' +
            '<div class="lightbox__caption"></div>';
        document.body.appendChild(lightbox);

        var lbImg = lightbox.querySelector('.lightbox__img');
        var lbCaption = lightbox.querySelector('.lightbox__caption');
        var items = document.querySelectorAll('.gallery__item');
        var currentIndex = 0;

        function updateLightbox() {
            var item = items[currentIndex];
            var img = item.querySelector('img');
            var title = item.querySelector('h3');
            lbImg.src = img.src;
            lbImg.alt = img.alt;
            lbCaption.textContent = title ? title.textContent : '';
        }

        function openLightbox(index) {
            currentIndex = index;
            updateLightbox();
            lightbox.classList.add('lightbox--open');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('lightbox--open');
            document.body.style.overflow = '';
        }

        function navigate(dir) {
            currentIndex = (currentIndex + dir + items.length) % items.length;
            updateLightbox();
        }

        items.forEach(function (item, i) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                openLightbox(i);
            });
        });

        lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', function (e) {
            e.stopPropagation(); navigate(-1);
        });
        lightbox.querySelector('.lightbox__nav--next').addEventListener('click', function (e) {
            e.stopPropagation(); navigate(1);
        });
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('lightbox--open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });
    }

    // ============================================
    // MAGNETIC HOVER — gallery items follow cursor
    // ============================================
    function initMagneticHover() {
        var items = document.querySelectorAll('.gallery__item');
        if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on touch

        items.forEach(function (item) {
            var img = item.querySelector('img');

            item.addEventListener('mousemove', function (e) {
                var rect = item.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;

                var rotateX = ((y - centerY) / centerY) * -8;
                var rotateY = ((x - centerX) / centerX) * 8;

                img.style.transform =
                    'scale(1.08) perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
            });

            item.addEventListener('mouseleave', function () {
                img.style.transform = 'scale(1) perspective(600px) rotateX(0) rotateY(0)';
            });
        });
    }

    // ============================================
    // DECORATIVE PARTICLES
    // ============================================
    function initParticles() {
        var hero = document.querySelector('.hero');
        if (!hero) return;

        var colors = ['#c8854a', '#f4c6d7', '#c9a96e', '#f5f0eb'];
        var maxParticles = 20;

        function spawnParticle() {
            if (document.hidden) return;
            if (hero.querySelectorAll('.particle').length >= maxParticles) return;

            var p = document.createElement('div');
            p.className = 'particle';
            var size = Math.random() * 6 + 3;
            var x = Math.random() * 100;
            var dur = Math.random() * 4 + 3;
            var color = colors[Math.floor(Math.random() * colors.length)];

            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = x + '%';
            p.style.bottom = '10%';
            p.style.background = color;
            p.style.animationDuration = dur + 's';

            hero.appendChild(p);
            setTimeout(function () {
                if (p.parentNode) p.parentNode.removeChild(p);
            }, dur * 1000);
        }

        setInterval(spawnParticle, 600);
    }

})();
