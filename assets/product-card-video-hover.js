(() => {
  const CARD_SELECTOR = 'product-card .card-gallery';
  const VIDEO_SELECTOR = 'deferred-media.product-card-video';

  function getVideoMedia(gallery) {
    if (!(gallery instanceof Element)) return null;

    const activeSlide = gallery.querySelector('slideshow-slide[aria-hidden="false"]');
    const activeVideo = activeSlide?.querySelector(VIDEO_SELECTOR);
    if (activeVideo) return activeVideo;

    return gallery.querySelector(VIDEO_SELECTOR);
  }

  function playDeferredVideo(videoMedia) {
    if (!videoMedia) return;

    try {
      if (videoMedia.hasAttribute('data-media-loaded')) {
        videoMedia.playMedia?.();
      } else {
        videoMedia.showDeferredMedia?.();
      }
    } catch (error) {
      console.warn('[Looks&Co] Product card video could not play:', error);
    }
  }

  function pauseDeferredVideo(videoMedia, reset = true) {
    if (!videoMedia) return;

    try {
      videoMedia.pauseMedia?.();
      if (reset) {
        const video = videoMedia.querySelector('video');
        if (video) video.currentTime = 0;
      }
    } catch (error) {
      console.warn('[Looks&Co] Product card video could not pause:', error);
    }
  }

  function setupGallery(gallery) {
    if (gallery.dataset.videoHoverReady === 'true') return;
    gallery.dataset.videoHoverReady = 'true';

    gallery.addEventListener('pointerenter', (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      playDeferredVideo(getVideoMedia(gallery));
    });

    gallery.addEventListener('pointerleave', (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      pauseDeferredVideo(getVideoMedia(gallery));
    });
  }

  function setupAll() {
    document.querySelectorAll(CARD_SELECTOR).forEach(setupGallery);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAll, { once: true });
  } else {
    setupAll();
  }

  const observer = new MutationObserver(() => setupAll());
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
