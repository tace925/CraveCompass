// ===== js/main.js =====
// COMPLETE UPDATED JAVASCRIPT - Food Curator Website
// WITH WORKING FILTERS & PHOTO INTERACTIONS

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== 1. INITIALIZE ALL FEATURES =====
    initMobileMenu();
    initActiveNavigation();
    initCategoryTabs();           // WORKING FILTERS FOR FOOD DIRECTORY
    initSuggestionForm();
    initRatingSystem();
    initSearchFilter();
    initYearlyCopyright();
    initSmoothScrolling();
    initMealTimeFilter();
    initVideoPlayButtons();
    initManCitsEffects();
    initContactForm();
    initPortfolioLightbox();
    initPhotoInteractions();       // NEW: Her photo & your photo interactions
    initDeveloperHearts();         // MOVED: Your heart effect (organized)
    
    // ===== 2. MOBILE MENU TOGGLE =====
    function initMobileMenu() {
        const header = document.querySelector('.header-container');
        const nav = document.querySelector('nav');
        
        if (!header || !nav) return;
        
        // Create mobile menu button if needed
        if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-btn')) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'mobile-menu-btn';
            menuBtn.innerHTML = '☰';
            menuBtn.setAttribute('aria-label', 'Toggle menu');
            menuBtn.style.cssText = 'background:none; border:2px solid white; color:white; font-size:1.5rem; padding:0.5rem 1rem; border-radius:8px; cursor:pointer;';
            
            header.insertBefore(menuBtn, nav);
            nav.style.display = 'none';
            
            menuBtn.addEventListener('click', () => {
                if (nav.style.display === 'none') {
                    nav.style.display = 'block';
                    menuBtn.innerHTML = '✕';
                } else {
                    nav.style.display = 'none';
                    menuBtn.innerHTML = '☰';
                }
            });
        }
        
        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                if (nav) nav.style.display = 'block';
                const menuBtn = document.querySelector('.mobile-menu-btn');
                if (menuBtn) menuBtn.innerHTML = '☰';
            } else {
                if (nav) nav.style.display = 'none';
            }
        });
    }
    
    // ===== 3. ACTIVE NAVIGATION HIGHLIGHT =====
    function initActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // ===== 4. CATEGORY TABS (FIXED - WORKING FILTERS for Places Page) =====
    function initCategoryTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const items = document.querySelectorAll('.category-item');
        
        if (tabBtns.length > 0 && items.length > 0) {
            console.log('🎯 Filter tabs initialized with', items.length, 'items');
            
            tabBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all buttons
                    tabBtns.forEach(b => b.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Get category to filter
                    const category = this.getAttribute('data-category');
                    console.log('Filtering by:', category);
                    
                    // Count visible items
                    let visibleCount = 0;
                    
                    // Filter items
                    items.forEach(item => {
                        if (category === 'all' || item.getAttribute('data-category') === category) {
                            item.style.display = 'block';
                            item.style.animation = 'fadeIn 0.5s ease';
                            visibleCount++;
                        } else {
                            item.style.display = 'none';
                        }
                    });
                    
                    // Update results count if element exists
                    const resultsCount = document.getElementById('searchResultsCount');
                    if (resultsCount) {
                        resultsCount.textContent = `🍽️ ${visibleCount} places found`;
                        resultsCount.style.animation = 'fadeIn 0.5s ease';
                    }
                    
                    // Save active tab to localStorage
                    localStorage.setItem('activeCategoryTab', category);
                });
            });
            
            // Restore last active tab
            const savedTab = localStorage.getItem('activeCategoryTab');
            if (savedTab) {
                const tabToActivate = document.querySelector(`.tab-btn[data-category="${savedTab}"]`);
                if (tabToActivate) {
                    tabToActivate.click();
                }
            } else {
                // Default to "all" if no saved tab
                const allButton = document.querySelector('.tab-btn[data-category="all"]');
                if (allButton) allButton.click();
            }
        }
    }
    
    // ===== 5. SUGGESTION FORM HANDLER (UPDATED for real submissions) =====
    function initSuggestionForm() {
        const suggestionForm = document.getElementById('suggestionForm');
        
        if (suggestionForm) {
            // Check if it's a Formspree form (has action pointing to formspree)
            const isFormspree = suggestionForm.getAttribute('action')?.includes('formspree');
            
            if (!isFormspree) {
                // Only prevent default and handle locally if NOT Formspree
                suggestionForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Get form data
                    const name = document.getElementById('placeName')?.value || 'Not provided';
                    const location = document.getElementById('placeLocation')?.value || 'Not provided';
                    const category = document.getElementById('placeCategory')?.value || 'Not provided';
                    const reason = document.getElementById('placeReason')?.value || 'Not provided';
                    const submitter = document.getElementById('submitterName')?.value || 'Anonymous';
                    
                    // Create message (simulates sending email)
                    const message = `
                        🍽️ NEW PLACE SUGGESTION for [HerName]!
                        
                        Place: ${name}
                        Location: ${location}
                        Category: ${category}
                        Reason: ${reason}
                        Suggested by: ${submitter}
                    `;
                    
                    console.log('Suggestion received:', message);
                    
                    // Show success message with animation
                    showNotification('✨ Thank you! Your suggestion has been sent to [HerName]. She will review it soon! ✨', 'success');
                    
                    // Reset form
                    suggestionForm.reset();
                });
            } else {
                console.log('📧 Formspree form detected - submissions will be emailed');
            }
        }
    }
    
    // ===== 6. RATING SYSTEM =====
    function initRatingSystem() {
        const ratingElements = document.querySelectorAll('.rating');
        
        ratingElements.forEach(el => {
            const rating = parseFloat(el.getAttribute('data-rating') || '0');
            const maxRating = 5;
            
            let stars = '';
            for (let i = 1; i <= maxRating; i++) {
                if (i <= rating) {
                    stars += '★'; // Full star
                } else if (i - 0.5 <= rating) {
                    stars += '½'; // Half star
                } else {
                    stars += '☆'; // Empty star
                }
            }
            
            el.textContent = stars;
            
            // Add rating number if exists
            const ratingNumber = el.getAttribute('data-rating');
            if (ratingNumber) {
                const span = document.createElement('span');
                span.className = 'rating-number';
                span.textContent = `(${ratingNumber})`;
                el.appendChild(span);
            }
        });
    }
    
    // ===== 7. SEARCH FILTER =====
    function initSearchFilter() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput) {
            const performSearch = () => {
                const searchTerm = searchInput.value.toLowerCase().trim();
                const items = document.querySelectorAll('.searchable-item');
                
                if (items.length > 0) {
                    let resultsFound = 0;
                    
                    items.forEach(item => {
                        const text = item.textContent.toLowerCase();
                        if (text.includes(searchTerm) || searchTerm === '') {
                            item.style.display = 'block';
                            resultsFound++;
                        } else {
                            item.style.display = 'none';
                        }
                    });
                    
                    // Show results count
                    const resultsCount = document.getElementById('searchResultsCount');
                    if (resultsCount) {
                        resultsCount.textContent = `${resultsFound} results found`;
                    }
                }
            };
            
            searchInput.addEventListener('keyup', performSearch);
            
            if (searchBtn) {
                searchBtn.addEventListener('click', performSearch);
            }
        }
    }
    
    // ===== 8. UPDATE COPYRIGHT YEAR =====
    function initYearlyCopyright() {
        const yearElements = document.querySelectorAll('.current-year');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }
    
    // ===== 9. SMOOTH SCROLLING =====
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                
                if (href !== '#') {
                    e.preventDefault();
                    
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
    
    // ===== 10. MEAL TIME FILTER =====
    function initMealTimeFilter() {
        const mealFilterBtns = document.querySelectorAll('.meal-filter-btn');
        
        if (mealFilterBtns.length > 0) {
            mealFilterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const mealTime = btn.getAttribute('data-meal');
                    const mealSections = document.querySelectorAll('.meal-section');
                    
                    mealSections.forEach(section => {
                        if (mealTime === 'all' || section.getAttribute('data-meal') === mealTime) {
                            section.style.display = 'block';
                        } else {
                            section.style.display = 'none';
                        }
                    });
                    
                    // Update active button
                    mealFilterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
            
            // Trigger "all" by default
            const allBtn = document.querySelector('.meal-filter-btn[data-meal="all"]');
            if (allBtn) allBtn.click();
        }
    }
    
    // ===== 11. VIDEO PLAY BUTTONS =====
    function initVideoPlayButtons() {
        const playButtons = document.querySelectorAll('.play-button');
        
        playButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const videoUrl = this.getAttribute('data-video-url');
                
                if (videoUrl) {
                    showNotification('🔗 Opening video...', 'info');
                    window.open(videoUrl, '_blank');
                }
            });
        });
    }
    
    // ===== 12. MAN CITS SPECIAL EFFECTS =====
    function initManCitsEffects() {
        const manCitsElements = document.querySelectorAll('.man-cits-logo, .man-cits-small');
        
        manCitsElements.forEach(el => {
            el.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Scale animation
                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
                
                // Show fun messages
                const messages = [
                    '✨ MAN CITS - Making tech simple! ✨',
                    '💙 Powered by love and MAN CITS 💙',
                    '🍽️ Your food guide, supported by MAN CITS',
                    '👨‍💻 Built with MAN CITS technology'
                ];
                
                const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                showNotification(randomMsg, 'info');
            });
        });
    }
    
    // ===== 13. CONTACT FORM =====
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            // Check if it's Formspree
            const isFormspree = contactForm.getAttribute('action')?.includes('formspree');
            
            if (!isFormspree) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Validate form
                    let isValid = true;
                    const requiredFields = contactForm.querySelectorAll('[required]');
                    
                    requiredFields.forEach(field => {
                        if (!field.value.trim()) {
                            field.style.borderColor = 'red';
                            isValid = false;
                        } else {
                            field.style.borderColor = '';
                        }
                    });
                    
                    if (isValid) {
                        showNotification('✅ Message sent successfully! [HerName] will get back to you soon.', 'success');
                        contactForm.reset();
                    } else {
                        showNotification('❌ Please fill in all required fields.', 'error');
                    }
                });
            }
        }
    }
    
    // ===== 14. PORTFOLIO LIGHTBOX =====
    function initPortfolioLightbox() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img')?.src;
                const title = this.querySelector('h4')?.textContent;
                const description = this.querySelector('p')?.textContent;
                
                if (imgSrc) {
                    // Create lightbox
                    const lightbox = document.createElement('div');
                    lightbox.className = 'lightbox';
                    lightbox.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0,0,0,0.95);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 2000;
                        cursor: pointer;
                    `;
                    
                    lightbox.innerHTML = `
                        <div style="max-width: 90%; max-height: 90%; text-align: center;">
                            <img src="${imgSrc}" style="max-width: 100%; max-height: 80vh; border-radius: 10px; border: 3px solid white;">
                            ${title ? `<h3 style="color: white; margin-top: 1rem;">${title}</h3>` : ''}
                            ${description ? `<p style="color: #ccc;">${description}</p>` : ''}
                            <p style="color: white; margin-top: 1rem; opacity: 0.7;">Click anywhere to close</p>
                        </div>
                    `;
                    
                    document.body.appendChild(lightbox);
                    
                    lightbox.addEventListener('click', () => {
                        document.body.removeChild(lightbox);
                    });
                }
            });
        });
    }
    
    // ===== 15. PHOTO INTERACTIONS (NEW) =====
    function initPhotoInteractions() {
        // Her photo interaction
        const herPhotos = document.querySelectorAll('.profile-photo');
        herPhotos.forEach(photo => {
            photo.addEventListener('click', function() {
                showNotification('👩‍🍳 [HerName] - Food Production Professional!', 'info');
                // Create hearts
                for (let i = 0; i < 3; i++) {
                    createFloatingHeart(this);
                }
            });
        });
        
        // Your photo interaction (developer)
        const devPhotos = document.querySelectorAll('.dev-photo');
        devPhotos.forEach(photo => {
            photo.addEventListener('click', function() {
                showNotification('💻 Built with love by [Your Name]', 'success');
                // Create hearts
                for (let i = 0; i < 5; i++) {
                    createFloatingHeart(this);
                }
            });
        });
    }
    
    // ===== 16. DEVELOPER HEARTS (Organized) =====
    function initDeveloperHearts() {
        const developerName = document.querySelector('.developer-credit strong');
        if (developerName) {
            developerName.addEventListener('click', function() {
                // Create floating hearts
                for (let i = 0; i < 8; i++) {
                    createFloatingHeart(this);
                }
                
                // Show message
                showNotification('💙 Love you! - [Your Name]', 'success');
            });
        }
    }
    
    // ===== 17. FLOATING HEART HELPER =====
    function createFloatingHeart(element) {
        const heart = document.createElement('span');
        heart.innerHTML = '💙';
        heart.style.position = 'absolute';
        heart.style.left = (element.offsetLeft + Math.random() * 100) + 'px';
        heart.style.top = element.offsetTop + 'px';
        heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.animation = `floatUp ${1 + Math.random()}s ease-out forwards`;
        document.body.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) heart.remove();
        }, 2000);
    }
    
    // ===== 18. NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotif = document.querySelector('.notification');
        if (existingNotif) {
            existingNotif.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        // Set colors based on type
        let bgColor, textColor;
        switch(type) {
            case 'success':
                bgColor = '#10b981';
                textColor = 'white';
                break;
            case 'error':
                bgColor = '#ef4444';
                textColor = 'white';
                break;
            default:
                bgColor = 'var(--medium-blue)';
                textColor = 'white';
        }
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: ${textColor};
            padding: 1rem 2rem;
            border-radius: 50px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease;
            font-weight: 500;
            font-size: 1rem;
            max-width: 350px;
            text-align: center;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => {
                    if (notification.parentNode) notification.remove();
                }, 300);
            }
        }, 3000);
    }
    
    // ===== 19. LOAD MORE BUTTON =====
    const loadMoreBtns = document.querySelectorAll('.load-more-btn');
    loadMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const container = document.querySelector(this.getAttribute('data-container'));
            if (container) {
                showNotification('📦 Loading more items...', 'info');
                
                this.disabled = true;
                this.textContent = 'Loading...';
                
                setTimeout(() => {
                    this.disabled = false;
                    this.textContent = 'Load More';
                    showNotification('✅ More items loaded!', 'success');
                }, 1500);
            }
        });
    });
    
    // ===== 20. BACK TO TOP BUTTON =====
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 55px;
        height: 55px;
        border-radius: 50%;
        background: var(--medium-blue);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.8rem;
        box-shadow: 0 5px 20px rgba(59, 130, 246, 0.4);
        transition: all 0.3s ease;
        z-index: 99;
        display: none;
        font-weight: bold;
    `;
    
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', () => {
        backToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.transform = 'scale(1.1)';
        backToTopBtn.style.background = 'var(--deep-blue)';
    });
    
    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.transform = 'scale(1)';
        backToTopBtn.style.background = 'var(--medium-blue)';
    });
    
    // ===== 21. ADD ANIMATION STYLES =====
    function addAnimationStyles() {
        if (!document.querySelector('#animation-styles')) {
            const style = document.createElement('style');
            style.id = 'animation-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes floatUp {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
                }
                
                .tab-btn.active {
                    background: var(--medium-blue) !important;
                    color: white !important;
                    border-color: var(--medium-blue) !important;
                }
                
                .profile-photo, .dev-photo {
                    cursor: pointer;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .profile-photo:hover, .dev-photo:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
                }
            `;
            document.head.appendChild(style);
        }
    }
    addAnimationStyles();
    
    // ===== 22. WELCOME MESSAGE =====
    console.log('%c❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️', 'font-size: 16px; color: #3b82f6;');
    console.log('%c🚀 The Food Curator website loaded successfully!', 'font-size: 18px; color: #1e3a8a; font-weight: bold;');
    console.log('%c👩‍🍳 Curated by Trizah Njeri - Food Production Professional', 'font-size: 16px; color: #0a2472;');
    console.log('%c💻 Developed with love by [Your Name]', 'font-size: 14px; color: #93c5fd;');
    console.log('%c🍽️ Powered by MAN CITS', 'font-size: 14px; color: #60a5fa; font-style: italic;');
    console.log('%c❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️', 'font-size: 16px; color: #3b82f6;');
});

// ===== GLOBAL FUNCTIONS =====
window.showNotification = showNotification;
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
};