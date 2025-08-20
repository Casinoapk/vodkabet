// Скрипт для добавления версионирования ко всем изображениям в vivod.html
// Запустите этот скрипт в браузере на странице vivod.html

(function() {
    'use strict';
    
    // Добавляем версионирование ко всем изображениям
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.includes('?v=')) {
            img.setAttribute('src', src + '?v=1.0');
        }
        
        const srcset = img.getAttribute('srcset');
        if (srcset && !srcset.includes('?v=')) {
            const newSrcset = srcset.replace(/\.(avif|webm|svg|ico|png|jpg|jpeg|gif)/g, '.$1?v=1.0');
            img.setAttribute('srcset', newSrcset);
        }
    });
    
    // Добавляем версионирование к видео
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        const poster = video.getAttribute('poster');
        if (poster && !poster.includes('?v=')) {
            video.setAttribute('poster', poster + '?v=1.0');
        }
        
        const sources = video.querySelectorAll('source');
        sources.forEach(source => {
            const src = source.getAttribute('src');
            if (src && !src.includes('?v=')) {
                source.setAttribute('src', src + '?v=1.0');
            }
        });
    });
    
    // Добавляем версионирование к track элементам
    const tracks = document.querySelectorAll('track');
    tracks.forEach(track => {
        const src = track.getAttribute('src');
        if (src && !src.includes('?v=')) {
            track.setAttribute('src', src + '?v=1.0');
        }
    });
    
    console.log('✅ Версионирование добавлено ко всем ресурсам');
    console.log('📝 Теперь обновите HTML файл с этими изменениями');
})();
