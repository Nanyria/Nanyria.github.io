document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.site-nav');
    const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
    const revealItems = document.querySelectorAll('.reveal');
    const cursorGlow = document.querySelector('.cursor-glow');

    const setHeaderState = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 12);
    };

    menuToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, {
        rootMargin: '-35% 0px -55% 0px',
        threshold: 0
    });

    navLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean)
        .forEach(section => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.12
    });

    revealItems.forEach(item => revealObserver.observe(item));

    window.addEventListener('scroll', setHeaderState, { passive: true });
    setHeaderState();

    window.addEventListener('pointermove', event => {
        cursorGlow.style.setProperty('--x', `${event.clientX}px`);
        cursorGlow.style.setProperty('--y', `${event.clientY}px`);
    }, { passive: true });
});
