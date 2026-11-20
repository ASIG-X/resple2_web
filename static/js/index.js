window.HELP_IMPROVE_VIDEOJS = false;

document.addEventListener('DOMContentLoaded', function () {
  try {
    if (typeof bulmaSlider !== 'undefined') {
      bulmaSlider.attach();
    }
  } catch (error) {
    console.log('Slider library not loaded, skipping slider initialization');
  }

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('#mobile-navigation');
  if (!header || !toggle || !drawer) return;

  const desktop = window.matchMedia('(min-width: 960px)');
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const sectionIds = Array.from(new Set(links.map(link => link.hash.slice(1))));
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  let currentSection = null;
  let updatePending = false;

  function closeMenu() {
    if (drawer.open) drawer.close();
  }

  toggle.addEventListener('click', function () {
    if (desktop.matches) return;
    drawer.showModal();
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  });

  drawer.querySelector('.nav-close').addEventListener('click', closeMenu);
  drawer.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Native dialogs handle Escape and keep keyboard focus inside the open menu.
  drawer.addEventListener('close', function () {
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  });

  drawer.addEventListener('click', function (event) {
    if (event.target !== drawer) return;
    const bounds = drawer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) {
      closeMenu();
    }
  });

  desktop.addEventListener('change', function () {
    if (desktop.matches) closeMenu();
    requestUpdate();
  });

  function updateCurrentSection() {
    updatePending = false;
    const progress = Math.min(Math.max(window.scrollY, 0) / 120, 1);
    const easedProgress = progress * progress * (3 - 2 * progress);
    header.style.setProperty('--shrink-progress', easedProgress.toFixed(4));
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    // Match the fixed anchor clearance even while the header is compact.
    const anchorOffset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const marker = Math.max(header.getBoundingClientRect().height + 24, anchorOffset + 4);
    let active = null;

    sections.forEach(section => {
      const bounds = section.getBoundingClientRect();
      if (bounds.top <= marker && bounds.bottom > marker) active = section;
    });

    if (window.scrollY > 0 &&
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      active = sections[sections.length - 1];
    }

    const nextSection = active ? active.id : null;
    if (nextSection === currentSection) return;
    currentSection = nextSection;
    links.forEach(link => {
      const isActive = link.hash.slice(1) === currentSection;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function requestUpdate() {
    if (updatePending) return;
    updatePending = true;
    window.requestAnimationFrame(updateCurrentSection);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('hashchange', requestUpdate);
  window.addEventListener('load', requestUpdate);
  document.addEventListener('loadedmetadata', requestUpdate, true);
  if (document.fonts) document.fonts.ready.then(requestUpdate);
  requestUpdate();
});
