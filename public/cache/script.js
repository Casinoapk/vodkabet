(function(){
  'use strict';
  document.addEventListener('DOMContentLoaded', function(){
    var onCachePage = window.location.pathname.indexOf('/public/cache/') !== -1;

    var toIndex = function(anchor){
      return window.location.origin + '../index.html' + anchor;
    };

    if (onCachePage) {
      var links = document.querySelectorAll('a[href]');
      links.forEach(function(link){
        var href = link.getAttribute('href') || '';

        if (href === 'index.html/index.html' || href === '../index.html' || href === 'vodka-deposit' || href === '../../index.html') {
          link.setAttribute('href', toIndex('#vodka-deposit'));
        }
        if (href === 'index.html/index.html' || href === '../index.html' || href === 'vodka-withdrawal'|| href === '../../index.html') {
          link.setAttribute('href', toIndex('#vodka-withdrawal'));
        }
      });
    }
  });
})();
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  if ((currentPath === "../vivod.html" || currentPath === "../deposit.html") 
      && performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    window.location.href = currentPath;
  }
  try {
    var CANONICAL_ORIGIN = 'https://vodka-casino.ru';
    var toCanonicalAbsoluteUrl = function(url){
      try {
        if (!url) return CANONICAL_ORIGIN;
        if (/^https?:\/\//i.test(url)) return url;
        return new URL(url, CANONICAL_ORIGIN).href;
      } catch(e) { return CANONICAL_ORIGIN; }
    };
    var addShareUiIfSupported = function(container){
      if (!container || container.querySelector('.share-button')) return;
      if (!container.style.position || container.style.position === 'static') {
        container.style.position = 'relative';
      }
      var btn = document.createElement('button');
      btn.className = 'share-button';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Поделиться');
      btn.textContent = 'Поделиться';
      btn.style.position = 'absolute';
      btn.style.top = '10px';
      btn.style.right = '10px';
      btn.style.background = 'rgba(25, 33, 54, 0.9)';
      btn.style.border = '2px solid #2900ff';
      btn.style.color = '#fff';
      btn.style.borderRadius = '12px';
      btn.style.padding = '6px 10px';
      btn.style.fontSize = '14px';
      btn.style.cursor = 'pointer';
      btn.style.zIndex = '10';

      var getMediaForContainer = function(){
        var video = container.querySelector('video');
        if (video) {
          var sources = Array.prototype.slice.call(video.querySelectorAll('source'));
          var preferred = sources.find(function(s){ return (s.getAttribute('type')||'').toLowerCase().indexOf('video/webm') === 0; });
          var anyVideo = preferred || sources.find(function(s){ return (s.getAttribute('type')||'').toLowerCase().indexOf('video/') === 0; });
          var videoSrc = anyVideo ? anyVideo.getAttribute('src') : null;
          if (videoSrc) return { url: videoSrc, typeHint: (anyVideo.getAttribute('type')||'video/webm') };
          // fallback to poster only if no video source
          var poster = video.getAttribute('poster');
          if (poster) return { url: poster, typeHint: guessMimeFromUrl(poster, 'image/avif') };
        }
        var images = container.querySelectorAll('img');
        if (images && images.length) {
          // pick last non-min image; else de-min the last one
          for (var i = images.length - 1; i >= 0; i--) {
            var candidate = images[i].getAttribute('src') || '';
            if (candidate.indexOf('.min.avif') === -1) {
              return { url: candidate, typeHint: guessMimeFromUrl(candidate, 'image/avif') };
            }
          }
          var lastSrc = images[images.length - 1].getAttribute('src') || '';
          var deMin = lastSrc.replace('.min.avif', '.avif');
          return { url: deMin, typeHint: 'image/avif' };
        }
        return { url: window.location.href, typeHint: 'text/uri-list' };
      };

      var guessFileName = function(url){
        try {
          var u = new URL(url, window.location.href);
          var path = u.pathname;
          var base = path.substring(path.lastIndexOf('/') + 1) || 'share';
          return base;
        } catch(e) {
          return 'share';
        }
      };

      var guessMimeFromUrl = function(url, fallback){
        if (!url) return fallback || 'application/octet-stream';
        var lower = url.toLowerCase();
        if (lower.endsWith('.webm')) return 'video/webm';
        if (lower.endsWith('.mp4')) return 'video/mp4';
        if (lower.endsWith('.avif')) return 'image/avif';
        if (lower.endsWith('.webp')) return 'image/webp';
        if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
        if (lower.endsWith('.png')) return 'image/png';
        return fallback || 'application/octet-stream';
      };

      btn.addEventListener('click', function(){
        var media = getMediaForContainer();
        var shareTitle = document.title || 'Vodka Casino';
        var shareText = 'Смотри это на Vodka Casino';
        if (!media.url) {
          var pageUrl = toCanonicalAbsoluteUrl(window.location.href);
          window.open(pageUrl, '_blank');
          return;
        }

        var absoluteUrl = toCanonicalAbsoluteUrl(media.url);
        // Always open media in a new tab as requested
        try { window.open(absoluteUrl, '_blank'); } catch(e) {}

        // Optionally also copy the link to clipboard for convenience
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(absoluteUrl).catch(function(){});
        }
      });

      container.appendChild(btn);
    };

    var containers = document.querySelectorAll('.vodka-casino-image');
    containers.forEach(addShareUiIfSupported);
  } catch(e) { /* no-op */ }
});