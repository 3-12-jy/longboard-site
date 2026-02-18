// script.js - 首页轮播图控制
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const slidesContainer = document.getElementById('carouselSlides');
        if (!slidesContainer) return;

        const dots = document.querySelectorAll('.dot');
        const slides = slidesContainer.children;
        const totalSlides = slides.length;
        let currentIndex = 0;
        let autoPlayInterval;

        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            currentIndex = index;
            slidesContainer.style.transform = 'translateX(' + (-currentIndex * 100) + '%)';
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function startAutoPlay(interval = 3000) {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, interval);
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                stopAutoPlay();
                startAutoPlay();
            });
        });

        slidesContainer.addEventListener('mouseenter', stopAutoPlay);
        slidesContainer.addEventListener('mouseleave', () => startAutoPlay());

        goToSlide(0);
        startAutoPlay(3000);
    });
})();