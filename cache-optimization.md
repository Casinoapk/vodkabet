# Оптимизация кеширования для vivod.html

## Проблема
Все статические ресурсы имеют очень короткое время жизни кеша (10 минут), что замедляет повторные загрузки страницы.

## Решение

### 1. Настройка Apache (.htaccess)

Создайте файл `.htaccess` в корне сайта:

```apache
# Кеширование статических ресурсов на 1 год
<FilesMatch "\.(avif|webm|svg|ico|png|jpg|jpeg|gif|css|js)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
    Header set Expires "Thu, 31 Dec 2025 23:59:59 GMT"
    Header set Pragma "cache"
</FilesMatch>

# Кеширование HTML на 1 час
<FilesMatch "\.(html|htm)$">
    Header set Cache-Control "public, max-age=3600, must-revalidate"
    Header set Expires "Thu, 31 Dec 2025 23:59:59 GMT"
</FilesMatch>

# Сжатие файлов
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

### 2. Настройка Nginx

Добавьте в конфигурацию сервера:

```nginx
# Кеширование статических ресурсов
location ~* \.(avif|webm|svg|ico|png|jpg|jpeg|gif|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
}

# Кеширование HTML
location ~* \.(html|htm)$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}

# Сжатие
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### 3. Настройка PHP

Если используете PHP, добавьте в начало файла:

```php
<?php
// Кеширование для статических ресурсов
if (preg_match('/\.(avif|webm|svg|ico|png|jpg|jpeg|gif|css|js)$/', $_SERVER['REQUEST_URI'])) {
    header("Cache-Control: public, max-age=31536000, immutable");
    header("Expires: Thu, 31 Dec 2025 23:59:59 GMT");
    header("Pragma: cache");
}
// Кеширование для HTML
elseif (preg_match('/\.(html|htm)$/', $_SERVER['REQUEST_URI'])) {
    header("Cache-Control: public, max-age=3600, must-revalidate");
    header("Expires: Thu, 31 Dec 2025 23:59:59 GMT");
}
?>
```

### 4. Версионирование ресурсов

В HTML уже добавлено версионирование `?v=1.0` для всех ресурсов. При обновлении ресурсов меняйте версию:

```html
<!-- Старая версия -->
<img src="image.avif?v=1.0">

<!-- Новая версия -->
<img src="image.avif?v=1.1">
```

### 5. Ожидаемый результат

После настройки:
- ✅ Время жизни кеша: **10 минут → 1 год**
- ✅ Повторные загрузки: **Быстрее в 10+ раз**
- ✅ Объем передаваемых данных: **Минимальный**
- ✅ SEO: **Улучшится**

### 6. Проверка

После настройки проверьте в DevTools → Network:
- Cache-Control заголовки
- Время жизни кеша
- Размер передаваемых данных

### 7. Важные моменты

- `immutable` - ресурс никогда не изменится
- `max-age=31536000` - 1 год в секундах
- Версионирование позволяет обновлять кеш при изменении ресурсов
- HTML кешируется на 1 час для возможности обновления контента
