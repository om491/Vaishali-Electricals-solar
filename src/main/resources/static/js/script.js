document.addEventListener('DOMContentLoaded', () => {

    const reducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const header =
        document.getElementById('siteHeader');

    const reveals =
        document.querySelectorAll('.reveal');

    if (reducedMotion) {
        reveals.forEach((element) => {
            element.classList.add('visible');
        });
    } else {
        const revealObserver =
            new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                });
            }, { threshold: 0.12 });

        reveals.forEach((element) => {
            revealObserver.observe(element);
        });
    }

    const updateHeader = () => {
        header?.classList.toggle(
            'scrolled',
            window.scrollY > 30
        );
    };

    updateHeader();

    window.addEventListener(
        'scroll',
        updateHeader,
        { passive: true }
    );

    document
        .querySelectorAll('#mainNav .nav-link, #mainNav .nav-cta')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const navigation =
                    document.getElementById('mainNav');

                if (
                    navigation &&
                    navigation.classList.contains('show') &&
                    window.bootstrap
                ) {
                    bootstrap.Collapse
                        .getOrCreateInstance(navigation)
                        .hide();
                }
            });
        });

    const calculateButton =
        document.getElementById('calculateBtn');

    calculateButton?.addEventListener('click', () => {
        const area =
            Number(
                document.getElementById('roofArea')?.value
            );

        const result =
            document.getElementById('calcResult');

        if (!result) return;

        if (!area || area < 1) {
            result.textContent =
                'Please enter a roof area greater than zero.';
            return;
        }

        const capacity =
            Math.max(
                1,
                Number((area / 100).toFixed(1))
            );

        result.textContent =
            `Estimated system capacity: approximately ${capacity} kW. A site assessment is required for final sizing.`;
    });

    const filterButtons =
        document.querySelectorAll('.filter-btn');

    const galleryItems =
        [...document.querySelectorAll('.gallery-item')];

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {

            filterButtons.forEach((item) => {
                item.classList.remove('active');
            });

            button.classList.add('active');

            const filter =
                button.dataset.filter;

            galleryItems.forEach((item) => {
                item.classList.toggle(
                    'is-hidden',
                    filter !== 'all' &&
                    item.dataset.category !== filter
                );
            });
        });
    });

    const lightbox =
        document.getElementById('lightbox');

    const lightboxImage =
        document.getElementById('lightboxImage');

    let activeImage = 0;

    const visibleItems = () => {
        return galleryItems.filter(
            (item) =>
                !item.classList.contains('is-hidden')
        );
    };

    const showImage = (index) => {
        const items = visibleItems();

        if (!items.length || !lightboxImage) {
            return;
        }

        activeImage =
            (index + items.length) % items.length;

        const item =
            items[activeImage];

        lightboxImage.src =
            item.dataset.full;

        lightboxImage.alt =
            item.querySelector('img')?.alt || '';
    };

    const closeLightbox = () => {
        if (!lightbox) return;

        lightbox.classList.remove('open');

        lightbox.setAttribute(
            'aria-hidden',
            'true'
        );
    };

    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {

            const items =
                visibleItems();

            showImage(
                items.indexOf(item)
            );

            lightbox?.classList.add('open');

            lightbox?.setAttribute(
                'aria-hidden',
                'false'
            );
        });
    });

    document
        .getElementById('lightboxClose')
        ?.addEventListener(
            'click',
            closeLightbox
        );

    document
        .getElementById('lightboxPrev')
        ?.addEventListener(
            'click',
            () => {
                showImage(activeImage - 1);
            }
        );

    document
        .getElementById('lightboxNext')
        ?.addEventListener(
            'click',
            () => {
                showImage(activeImage + 1);
            }
        );

    lightbox?.addEventListener(
        'click',
        (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        }
    );

    document.addEventListener(
        'keydown',
        (event) => {

            if (
                !lightbox?.classList.contains('open')
            ) {
                return;
            }

            if (event.key === 'Escape') {
                closeLightbox();
            }

            if (event.key === 'ArrowLeft') {
                showImage(activeImage - 1);
            }

            if (event.key === 'ArrowRight') {
                showImage(activeImage + 1);
            }
        }
    );

    const hero =
        document.querySelector('[data-hero-slider]');

    if (hero) {

        const track =
            hero.querySelector('[data-hero-track]');

        if (track) {

            const slides =
                [...track.querySelectorAll('.hero-slide')];

            const dots =
                [...document.querySelectorAll('[data-hero-dot]')];

            const totalSlides = 6;

            let slideIndex = 1;
            let autoplayTimer;
            let isResetting = false;

            const updateDots = () => {
                dots.forEach((dot, index) => {

                    const active =
                        index === slideIndex - 1;

                    dot.classList.toggle(
                        'is-active',
                        active
                    );

                    dot.setAttribute(
                        'aria-selected',
                        String(active)
                    );
                });
            };

            const moveTo = (
                index,
                animate = true
            ) => {

                slideIndex = index;

                track.style.transition =
                    animate && !reducedMotion
                        ? 'transform .8s ease-in-out'
                        : 'none';

                track.style.transform =
                    `translate3d(-${slideIndex * 12.5}%, 0, 0)`;

                updateDots();
            };

            const finishLoopReset = () => {

                if (
                    slideIndex !== totalSlides + 1 &&
                    slideIndex !== 0
                ) {
                    return;
                }

                isResetting = true;

                window.setTimeout(() => {

                    moveTo(
                        slideIndex === totalSlides + 1
                            ? 1
                            : totalSlides,
                        false
                    );

                    window.requestAnimationFrame(() => {
                        isResetting = false;
                    });

                }, 820);
            };

            const next = () => {

                if (isResetting) return;

                moveTo(slideIndex + 1);

                finishLoopReset();
            };

            const previous = () => {

                if (isResetting) return;

                moveTo(slideIndex - 1);

                finishLoopReset();
            };

            const stopAutoplay = () => {
                window.clearInterval(autoplayTimer);
            };

            const startAutoplay = () => {

                stopAutoplay();

                if (!reducedMotion) {
                    autoplayTimer =
                        window.setInterval(
                            next,
                            4000
                        );
                }
            };

            slides.forEach((slide) => {
                slide
                    .querySelector('img')
                    ?.decode?.()
                    .catch(() => {});
            });

            moveTo(1, false);

            hero
                .querySelector('[data-hero-next]')
                ?.addEventListener('click', () => {
                    next();
                    startAutoplay();
                });

            hero
                .querySelector('[data-hero-prev]')
                ?.addEventListener('click', () => {
                    previous();
                    startAutoplay();
                });

            dots.forEach((dot) => {
                dot.addEventListener('click', () => {

                    moveTo(
                        Number(dot.dataset.heroDot) + 1
                    );

                    startAutoplay();
                });
            });

            hero.addEventListener(
                'mouseenter',
                stopAutoplay
            );

            hero.addEventListener(
                'mouseleave',
                startAutoplay
            );

            hero.addEventListener(
                'touchstart',
                stopAutoplay,
                { passive: true }
            );

            hero.addEventListener(
                'touchend',
                startAutoplay,
                { passive: true }
            );

            if (!reducedMotion) {
                startAutoplay();
            }
        }
    }

    // ===============================
    // EMAILJS CONFIGURATION
    // ===============================

    const EMAILJS_PUBLIC_KEY = "_4Ua0xX9OCDBSafav";
    const EMAILJS_SERVICE_ID = "service_fnkk6w2";
    const EMAILJS_TEMPLATE_ID = "template_9gph3we";

    emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
    });


    // ===============================
    // CONTACT FORM
    // ===============================

    const contactForm =
        document.getElementById("contactForm");

    const formStatus =
        document.getElementById("formStatus");

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();

                // Get all form values
                const name =
                    document.querySelector('[name="name"]').value.trim();

                const phone =
                    document.querySelector('[name="phone"]').value.trim();

                const email =
                    document.querySelector('[name="email"]').value.trim();

                const service =
                    document.querySelector('[name="service"]').value;

                const project =
                    document.querySelector('[name="project"]').value;

                const userMessage =
                    document.querySelector('[name="message"]').value.trim();


                // Basic validation
                if (
                    !name ||
                    !phone ||
                    !email ||
                    !service ||
                    !project ||
                    !userMessage
                ) {

                    formStatus.textContent =
                        "Please fill all required fields.";

                    formStatus.style.color =
                        "red";

                    return;
                }


                // Show sending message
                formStatus.textContent =
                    "Sending your enquiry...";

                formStatus.style.color =
                    "#6a1b9a";


                // Create complete message
                const fullMessage = `
NEW WEBSITE ENQUIRY
==============================

Customer Name:
${name}

Phone Number:
${phone}

Email Address:
${email}

Service Required:
${service}

Project Type:
${project}

Requirement Details:
${userMessage}

==============================
Sent from Vaishali Electricals website
                `.trim();


                // EmailJS parameters
                const templateParams = {

                    name: name,

                    phone: phone,

                    email: email,

                    service: service,

                    project: project,

                    // Complete enquiry
                    message: fullMessage,

                    // Original requirement separately
                    requirement: userMessage,

                    // Reply-to email
                    reply_to: email
                };


                try {

                    await emailjs.send(
                        EMAILJS_SERVICE_ID,
                        EMAILJS_TEMPLATE_ID,
                        templateParams
                    );


                    // Success
                    formStatus.textContent =
                        "Thank you! Your enquiry has been sent successfully.";

                    formStatus.style.color =
                        "green";


                    // Clear form
                    contactForm.reset();


                } catch (error) {

                    console.error(
                        "EmailJS Error:",
                        error
                    );

                    formStatus.textContent =
                        "Sorry, something went wrong. Please try again.";

                    formStatus.style.color =
                        "red";
                }

            }
        );
    }

});