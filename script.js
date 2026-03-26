/**
 * NutrifyMi — Interactive Website
 * GSAP + Lenis + Custom Cursor + Feature Tabs + Hero Rotator
 */
(function () {
    'use strict';

    // ============================================
    // LENIS SMOOTH SCROLLING
    // ============================================
    var lenis = new Lenis({
        duration: 1.2,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // ============================================
    // CUSTOM CURSOR
    // ============================================
    var cursor = document.getElementById('cursor');
    var cursorRing = document.getElementById('cursor-ring');
    var mouseX = 0, mouseY = 0;
    var cursorX = 0, cursorY = 0;
    var ringX = 0, ringY = 0;

    if (window.innerWidth > 1024 && cursor && cursorRing) {
        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateCursor() {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            ringX += (mouseX - ringX) * 0.08;
            ringY += (mouseY - ringY) * 0.08;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        document.querySelectorAll('a, button, input, [data-magnetic]').forEach(function (el) {
            el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
            el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
        });
    }

    // ============================================
    // MAGNETIC BUTTONS
    // ============================================
    if (window.innerWidth > 1024) {
        document.querySelectorAll('[data-magnetic]').forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var rect = el.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                gsap.to(el, { x: x * 0.2, y: y * 0.15, duration: 0.3, ease: 'power2.out' });
            });
            el.addEventListener('mouseleave', function () {
                gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }

    // ============================================
    // NAVBAR
    // ============================================
    var nav = document.getElementById('nav');
    var menuToggle = document.getElementById('menu-toggle');
    var mobileMenu = document.getElementById('mobile-menu');
    var menuOpen = false;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 80) { nav.classList.add('scrolled'); }
        else { nav.classList.remove('scrolled'); }
    }, { passive: true });

    function closeMenu() {
        menuOpen = false;
        menuToggle.classList.remove('menu-open');
        mobileMenu.style.display = 'none';
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', function () {
        menuOpen = !menuOpen;
        menuToggle.classList.toggle('menu-open');
        if (menuOpen) {
            mobileMenu.style.display = 'block';
            document.body.style.overflow = 'hidden';
        } else {
            closeMenu();
        }
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () { if (menuOpen) closeMenu(); });
    });

    // ============================================
    // HERO WORD ROTATOR
    // ============================================
    var rotatorEl = document.getElementById('hero-rotator');
    if (rotatorEl) {
        var words = ['meal.', 'thali.', 'sushi.', 'pasta.', 'salad.', 'curry.', 'bowl.'];
        var wordIndex = 0;

        setInterval(function () {
            rotatorEl.classList.add('out');
            setTimeout(function () {
                wordIndex = (wordIndex + 1) % words.length;
                rotatorEl.textContent = words[wordIndex];
                rotatorEl.classList.remove('out');
                rotatorEl.classList.add('in');
            }, 300);
        }, 2500);
    }

    // ============================================
    // FEATURE TABS
    // ============================================
    var featureTabs = document.querySelectorAll('.feature-tab');
    var featurePanels = document.querySelectorAll('.feature-tab-panel');
    var featurePanelsContainer = document.querySelector('.feature-panels');
    var featureAutoInterval = null;
    var currentFeatureIndex = 0;

    // Lock panel container height to prevent layout shift
    function lockPanelHeight() {
        if (featurePanelsContainer) {
            featurePanelsContainer.style.minHeight = featurePanelsContainer.offsetHeight + 'px';
        }
    }

    function activateFeatureTab(index, isManualClick) {
        currentFeatureIndex = index % featureTabs.length;
        var tab = featureTabs[currentFeatureIndex];
        var targetTab = tab.getAttribute('data-tab');

        featureTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        // Only scroll tab into view on manual click, not auto-rotation
        if (isManualClick) {
            var tabContainer = document.querySelector('.feature-tabs-scroll');
            if (tabContainer && window.innerWidth < 1024) {
                tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }

        lockPanelHeight();

        featurePanels.forEach(function (panel) {
            if (panel.getAttribute('data-panel') === targetTab) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Update min-height after new panel is visible
        if (featurePanelsContainer) {
            requestAnimationFrame(function () {
                featurePanelsContainer.style.minHeight = featurePanelsContainer.offsetHeight + 'px';
            });
        }
    }

    function startFeatureAutoRotation() {
        stopFeatureAutoRotation();
        featureAutoInterval = setInterval(function () {
            activateFeatureTab(currentFeatureIndex + 1, false);
        }, 7000);
    }

    function stopFeatureAutoRotation() {
        if (featureAutoInterval) {
            clearInterval(featureAutoInterval);
            featureAutoInterval = null;
        }
    }

    featureTabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () {
            activateFeatureTab(index, true);
            startFeatureAutoRotation();
        });
    });

    // Start auto-rotation
    if (featureTabs.length > 0) {
        startFeatureAutoRotation();
    }

    // ============================================
    // BILLING TOGGLE
    // ============================================
    var billingToggles = document.querySelectorAll('.billing-toggle');
    var pricingAmount = document.querySelector('.pricing-amount');
    var pricingPeriod = document.querySelector('.pricing-period');
    var pricingNote = document.querySelector('.pricing-note');
    var pricingBadge = document.querySelector('.pricing-badge');
    var pricingAnnualPerk = document.querySelector('.pricing-annual-perk');

    billingToggles.forEach(function (toggle) {
        toggle.addEventListener('click', function () {
            var billing = this.getAttribute('data-billing');

            billingToggles.forEach(function (t) { t.classList.remove('active'); });
            this.classList.add('active');

            if (pricingAmount) {
                if (billing === 'annual') {
                    pricingAmount.innerHTML = '&#8377;' + pricingAmount.getAttribute('data-annual');
                    if (pricingPeriod) pricingPeriod.textContent = '/year';
                    if (pricingNote) pricingNote.innerHTML = pricingNote.getAttribute('data-annual');
                    if (pricingBadge) pricingBadge.classList.remove('hidden');
                    if (pricingAnnualPerk) pricingAnnualPerk.classList.remove('hidden');
                } else {
                    pricingAmount.innerHTML = '&#8377;' + pricingAmount.getAttribute('data-monthly');
                    if (pricingPeriod) pricingPeriod.textContent = '/month';
                    if (pricingNote) pricingNote.innerHTML = pricingNote.getAttribute('data-monthly');
                    if (pricingBadge) pricingBadge.classList.add('hidden');
                    if (pricingAnnualPerk) pricingAnnualPerk.classList.add('hidden');
                }
            }
        });
    });

    // ============================================
    // GSAP ANIMATIONS
    // ============================================
    gsap.registerPlugin(ScrollTrigger);

    // Hero
    var heroTL = gsap.timeline({ delay: 0.3 });
    heroTL.to('.hero-reveal', { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' })
    .to('.hero-visual', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6')
    .to('.hero-img-1', { opacity: 1, y: 0, rotate: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
    .to('.hero-img-2', { opacity: 1, y: 0, rotate: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
    .to('.hero-float-card', { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .to('.hero-float-card-2', { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');

    // Parallax
    gsap.to('.hero-img-1', { yPercent: -8, scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });
    gsap.to('.hero-img-2', { yPercent: -15, scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });
    gsap.to('.hero-float-card', { yPercent: -25, scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2 } });
    gsap.to('.hero-float-card-2', { yPercent: -20, scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2 } });

    // Reveal Groups
    gsap.utils.toArray('.reveal-group').forEach(function (group) {
        gsap.to(group.children, {
            opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: group, start: 'top 85%', toggleActions: 'play none none none' }
        });
    });

    // Reveal Items
    gsap.utils.toArray('.reveal-item').forEach(function (item) {
        gsap.to(item, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' }
        });
    });

    // Step Cards
    gsap.utils.toArray('.step-card').forEach(function (card, i) {
        gsap.to(card, {
            opacity: 1, y: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' }
        });
    });

    // Reward Cards
    gsap.utils.toArray('.reward-card').forEach(function (card, i) {
        gsap.to(card, {
            opacity: 1, y: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }
        });
    });

    // Pricing Cards
    gsap.utils.toArray('.pricing-card').forEach(function (card, i) {
        gsap.to(card, {
            opacity: 1, y: 0, duration: 0.8, delay: i * 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }
        });
    });

    // Social Proof Bar
    var socialProof = document.getElementById('social-proof');
    if (socialProof) {
        gsap.from(socialProof, {
            opacity: 0, y: 20, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: socialProof, start: 'top 90%', toggleActions: 'play none none none' }
        });
    }

    // Testimonial Cards
    gsap.utils.toArray('.testimonial-card').forEach(function (card, i) {
        gsap.from(card, {
            opacity: 0, y: 40, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }
        });
    });

    // Founder Section
    var founderSection = document.getElementById('founder');
    if (founderSection) {
        gsap.from(founderSection.children[0], {
            opacity: 0, scale: 0.95, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: founderSection, start: 'top 85%', toggleActions: 'play none none none' }
        });
    }

    // ============================================
    // SMOOTH ANCHOR SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: -80, duration: 1.2 });
            }
        });
    });

    // ============================================
    // LEGAL ACCORDIONS
    // ============================================
    document.querySelectorAll('.accordion-group > .accordion-trigger').forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            var content = this.nextElementSibling;
            var group = this.closest('.accordion-group');
            var isOpen = this.getAttribute('aria-expanded') === 'true';
            if (isOpen) {
                this.setAttribute('aria-expanded', 'false');
                content.classList.remove('open');
                group.classList.remove('active');
            } else {
                this.setAttribute('aria-expanded', 'true');
                content.classList.add('open');
                group.classList.add('active');
            }
        });
    });

    document.querySelectorAll('.accordion-sub-trigger').forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            var content = this.nextElementSibling;
            var isOpen = this.getAttribute('aria-expanded') === 'true';
            if (isOpen) {
                this.setAttribute('aria-expanded', 'false');
                content.classList.remove('open');
            } else {
                this.setAttribute('aria-expanded', 'true');
                content.classList.add('open');
            }
        });
    });

    window.openAccordion = function (accordionId) {
        var group = document.getElementById(accordionId);
        if (!group) return;
        var trigger = group.querySelector('.accordion-trigger');
        var content = group.querySelector('.accordion-content');
        if (trigger && content) {
            trigger.setAttribute('aria-expanded', 'true');
            content.classList.add('open');
            group.classList.add('active');
        }
    };

    // ============================================
    // FAQ ACCORDIONS
    // ============================================
    document.querySelectorAll('.faq-group .accordion-trigger').forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            var content = this.nextElementSibling;
            var isOpen = this.getAttribute('aria-expanded') === 'true';
            if (isOpen) {
                this.setAttribute('aria-expanded', 'false');
                content.classList.remove('open');
            } else {
                this.setAttribute('aria-expanded', 'true');
                content.classList.add('open');
            }
        });
    });

    // ============================================
    // BACK TO TOP
    // ============================================
    var backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 600) { backToTop.classList.add('visible'); }
            else { backToTop.classList.remove('visible'); }
        }, { passive: true });

        backToTop.addEventListener('click', function () {
            lenis.scrollTo(0, { duration: 1.5 });
        });
    }

    // ============================================
    // SUPABASE CLIENT
    // ============================================
    var SUPABASE_URL = 'https://vyrlnpcnuftcyfizfabb.supabase.co';
    var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5cmxucGNudWZ0Y3lmaXpmYWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MTgxOTAsImV4cCI6MjA5MDA5NDE5MH0.htnZ-Acr9yvAzEb88s6k2qH8B0shjwMggMZU1S2vOn8';
    var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // ============================================
    // WAITLIST COUNTER (Supabase) — Global scope
    // ============================================
    window.waitlistCount = null;

    window.getWaitlistCount = function () {
        if (window.waitlistCount !== null) return Promise.resolve(window.waitlistCount);
        return supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true })
            .then(function (result) {
                if (result.error) throw result.error;
                window.waitlistCount = result.count || 0;
                return window.waitlistCount;
            })
            .catch(function (e) {
                console.warn('Could not fetch waitlist count:', e);
                return null;
            });
    };

    window.incrementWaitlistDisplay = function () {
        window.waitlistCount = (window.waitlistCount || 0) + 1;
        document.querySelectorAll('[data-waitlist-count]').forEach(function (el) {
            el.textContent = window.waitlistCount;
        });
    };

    // Fetch count and animate counters on load
    window.getWaitlistCount().then(function (count) {
        if (count !== null && count > 0) {
            document.querySelectorAll('[data-waitlist-count]').forEach(function (el) {
                var wrapper = el.closest('[data-waitlist-wrapper]');
                if (wrapper) wrapper.classList.remove('hidden');
                // Use an object target for reliable GSAP animation
                var target = { val: 0 };
                gsap.to(target, {
                    val: count,
                    duration: 1.5,
                    ease: 'power2.out',
                    onUpdate: function () {
                        el.textContent = Math.round(target.val);
                    }
                });
            });
        }
    });

    // ============================================
    // CONFETTI ANIMATION (for waitlist success)
    // ============================================
    function playConfetti() {
        var container = document.getElementById('confetti-container');
        if (!container) return;
        var colors = ['#059669', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];
        for (var i = 0; i < 20; i++) {
            (function (index) {
                var dot = document.createElement('div');
                dot.style.cssText = 'position:absolute;width:6px;height:6px;border-radius:50%;bottom:0;left:' + (Math.random() * 100) + '%;background:' + colors[Math.floor(Math.random() * colors.length)];
                container.appendChild(dot);
                gsap.to(dot, {
                    y: -(Math.random() * 80 + 40),
                    x: (Math.random() - 0.5) * 60,
                    opacity: 0,
                    duration: 1 + Math.random() * 0.5,
                    delay: Math.random() * 0.3,
                    ease: 'power2.out',
                    onComplete: function () { if (dot.parentNode) dot.parentNode.removeChild(dot); }
                });
            })(i);
        }
    }

    // ============================================
    // WAITLIST FORM
    // ============================================
    var form = document.getElementById('waitlist-form');
    var emailInput = document.getElementById('waitlist-email');
    var formMessage = document.getElementById('form-message');

    if (form && emailInput) {
        // Clear error on input
        emailInput.addEventListener('input', function () {
            if (formMessage) formMessage.classList.add('hidden');
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            // Reset error state
            if (formMessage) formMessage.classList.add('hidden');

            var email = emailInput.value.trim().toLowerCase();
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.className = 'text-[13px] mt-2 text-red-400';
                formMessage.classList.remove('hidden');
                emailInput.focus();
                return;
            }
            var btn = form.querySelector('button');
            btn.textContent = 'Joining...';
            btn.disabled = true;

            supabase.from('waitlist').insert({ email: email }).then(function (result) {
                if (result.error) {
                    if (result.error.code === '23505') {
                        formMessage.textContent = "You're already on the waitlist! We'll be in touch soon.";
                        formMessage.className = 'text-[13px] mt-2 text-amber-400';
                    } else {
                        formMessage.textContent = 'Something went wrong. Please try again.';
                        formMessage.className = 'text-[13px] mt-2 text-red-400';
                    }
                    formMessage.classList.remove('hidden');
                    setTimeout(function () {
                        btn.textContent = 'Get Early Access \u2014 It\u2019s Free';
                        btn.disabled = false;
                    }, 3000);
                } else {
                    // Success: show success state
                    window.incrementWaitlistDisplay();
                    var formWrapper = document.getElementById('waitlist-form-wrapper');
                    var successEl = document.getElementById('waitlist-success');
                    if (formWrapper) formWrapper.classList.add('hidden');
                    if (successEl) {
                        successEl.classList.remove('hidden');
                        playConfetti();
                    }
                }
            });
        });
    }

    // ============================================
    // IMAGE TILT ON HOVER
    // ============================================
    if (window.innerWidth > 1024) {
        document.querySelectorAll('.step-card img, .feature-tab-panel img').forEach(function (el) {
            var parent = el.closest('.step-card') || el.parentElement;
            if (!parent) return;
            parent.addEventListener('mousemove', function (e) {
                var rect = this.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width - 0.5;
                var y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(el, { rotateY: x * 6, rotateX: -y * 6, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
            });
            parent.addEventListener('mouseleave', function () {
                gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }

})();
