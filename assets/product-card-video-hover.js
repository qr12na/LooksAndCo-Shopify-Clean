(() => {
  const CARD_SELECTOR = 'product-card';
  const GALLERY_SELECTOR = '.card-gallery';
  const VIDEO_SELECTOR = 'deferred-media.product-card-video';
  const PLAY_SELECTOR = '.deferred-media__poster-button';

  function getVideoMedia(gallery) {
    if (!(gallery instanceof Element)) return null;

    const activeSlide = gallery.querySelector('slideshow-slide:not([hidden])[aria-hidden="false"]');
    return activeSlide?.querySelector(VIDEO_SELECTOR) || gallery.querySelector(VIDEO_SELECTOR);
  }

  function play(videoMedia) {
    if (!videoMedia) return;

    try {
      if (!videoMedia.hasAttribute('data-media-loaded')) {
        videoMedia.showDeferredMedia?.();
      }

      requestAnimationFrame(() => {
        videoMedia.playMedia?.();
        const video = videoMedia.querySelector('video');
        if (video) {
          video.muted = true;
          video.play().catch(() => {});
        }
      });
    } catch (error) {
      console.warn('[Looks&Co] Video play failed:', error);
    }
  }

  function pause(videoMedia) {
    if (!videoMedia) return;

    try {
      videoMedia.pauseMedia?.();
      const video = videoMedia.querySelector('video');
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    } catch (error) {
      console.warn('[Looks&Co] Video pause failed:', error);
    }
  }

  function setupCard(card) {
    const gallery = card.querySelector(GALLERY_SELECTOR);
    if (!(gallery instanceof Element) || gallery.dataset.lookscoVideoReady === 'true') return;

    gallery.dataset.lookscoVideoReady = 'true';

    gallery.removeAttribute('on:pointerenter');
    gallery.removeAttribute('on:pointerleave');

    gallery.addEventListener('mouseenter', () => {
      play(getVideoMedia(gallery));
    });

    gallery.addEventListener('mouseleave', () => {
      pause(getVideoMedia(gallery));
    });
  }

  document.addEventListener(
    'click',
    (event) => {
      if (!(event.target instanceof Element)) return;
      const playButton = event.target.closest(PLAY_SELECTOR);
      if (!playButton || !playButton.closest('product-card')) return;
      event.preventDefault();
    },
    false
  );

  function setupAll() {
    document.querySelectorAll(CARD_SELECTOR).forEach(setupCard);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAll, { once: true });
  } else {
    setupAll();
  }

  const observer = new MutationObserver(setupAll);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
