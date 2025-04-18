document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.project-slide');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const projectNumbers = document.querySelectorAll('.project-number');
    const viewToggle = document.getElementById('viewToggle');
    const projectShowcase = document.querySelector('.project-showcase');
    const allProjectsView = document.querySelector('.all-projects-view');
    const projectsSection = document.querySelector('.projects-section');
    const isMobile = window.innerWidth <= 768;
    
    let currentSlide = 0;
    let isAnimating = false;
    let touchStartX = 0;
    let touchEndX = 0;

    // Initialize the view based on toggle state
    function initializeView() {
        // Default to all-projects view (toggle unchecked)
        if (!viewToggle.checked) {
            projectShowcase.classList.add('hidden');
            allProjectsView.classList.add('active');
            projectsSection.classList.add('all-view');
        } else {
            // If toggle is checked, show showcase view
            projectShowcase.classList.remove('hidden');
            allProjectsView.classList.remove('active');
            projectsSection.classList.remove('all-view');
            projectsSection.style.background = getComputedStyle(slides[currentSlide]).background;
        }
    }

    // Toggle between all-projects and showcase views
    function setupViewToggle() {
        if (viewToggle) {
            // Add change event listener
            viewToggle.addEventListener('change', function() {
                if (this.checked && window.innerWidth <= 768) {
                    // If on mobile and trying to switch to showcase
                    alert('The showcase view is only available on desktop. Please switch to the "All Projects" view.');
                    this.checked = false;
                    return;
                }
                
                if (this.checked) {
                    // Show showcase view
                    projectShowcase.classList.remove('hidden');
                    allProjectsView.classList.remove('active');
                    projectsSection.classList.remove('all-view');
                    
                    // Reset the background of projects section
                    projectsSection.style.background = 
                        getComputedStyle(slides[currentSlide]).background;
                } else {
                    // Show all-projects view
                    projectShowcase.classList.add('hidden');
                    allProjectsView.classList.add('active');
                    projectsSection.classList.add('all-view');
                    
                    // Reset the background of projects section for all-projects view
                    projectsSection.style.background = '';
                }
            });
        }
    }

    function updateSlides(newIndex) {
        if (isAnimating || newIndex === currentSlide) return;
        isAnimating = true;

        // Remove active class from current slide and number
        slides[currentSlide].classList.remove('active');
        projectNumbers[currentSlide].classList.remove('active');
        
        // Update current slide index
        currentSlide = newIndex;
        
        // Add active class to new slide and number
        slides[currentSlide].classList.add('active');
        projectNumbers[currentSlide].classList.add('active');

        // Update the projects section background to match the current slide
        if (viewToggle.checked) {
            projectsSection.style.background = 
                getComputedStyle(slides[currentSlide]).background;
        }
        
        isAnimating = false;
    }

    function nextSlide() {
        if (isAnimating) return;
        const nextIndex = (currentSlide + 1) % slides.length;
        updateSlides(nextIndex);
    }

    function prevSlide() {
        if (isAnimating) return;
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides(prevIndex);
    }

    // Pause auto-advance on hover - only apply on desktop
    if (window.innerWidth > 768) {
        projectsSection.addEventListener('mouseenter', () => {
        });

        // Resume auto-advance when mouse leaves
        projectsSection.addEventListener('mouseleave', () => {
        });
    } else {
        // For mobile devices, pause on touch start and resume on touch end with a delay
        projectsSection.addEventListener('touchstart', () => {
        });
        
        projectsSection.addEventListener('touchend', () => {
        });
    }

    // Event listeners for navigation buttons
    nextButton.addEventListener('click', () => {
        nextSlide();
    });
    
    prevButton.addEventListener('click', () => {
        prevSlide();
    });

    // Event listeners for project numbers
    projectNumbers.forEach((number, index) => {
        number.addEventListener('click', () => {
            updateSlides(index);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!viewToggle.checked) return; // Only enable keyboard navigation in showcase view
        
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // Touch event handlers for mobile swipe
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
    }
    
    function handleTouchMove(e) {
        touchEndX = e.touches[0].clientX;
    }
    
    function handleTouchEnd() {
        if (!viewToggle.checked) return; // Only enable swipe in showcase view
        
        const swipeThreshold = 50; // Minimum distance for a swipe
        const touchDiff = touchStartX - touchEndX;
        
        if (Math.abs(touchDiff) > swipeThreshold) {
            if (touchDiff > 0) {
                // Swipe left, go to next slide
                nextSlide();
            } else {
                // Swipe right, go to previous slide
                prevSlide();
            }
        }
    }
    
    // Add touch event listeners
    projectShowcase.addEventListener('touchstart', handleTouchStart, false);
    projectShowcase.addEventListener('touchmove', handleTouchMove, false);
    projectShowcase.addEventListener('touchend', handleTouchEnd, false);

    // Handle window resize events
    window.addEventListener('resize', () => {
        const wasDesktop = !isMobile;
        const newIsMobile = window.innerWidth <= 768;
        
        // Only take action if we've crossed the mobile/desktop threshold
        if (wasDesktop !== newIsMobile) {
            // Force layout recalculation
            document.body.style.opacity = '0.99';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 10);
            
            // Reset any mobile-specific styles that might be causing issues
            if (!newIsMobile) {
                // Moving from mobile to desktop
                document.querySelectorAll('.project-content').forEach(content => {
                    content.style.transform = '';
                    content.style.opacity = '';
                });
            }
        }
    });

    // Fix for iOS 100vh issue
    function setHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Set the height on page load
    setHeight();
    
    // Update the height on window resize
    window.addEventListener('resize', setHeight);
    
    // Update the height on orientation change
    window.addEventListener('orientationchange', () => {
        // Small delay to ensure the orientation change has completed
        setTimeout(() => {
            setHeight();
        }, 100);
    });

    // Mobile touch improvements for project cards
    if (window.innerWidth <= 768) {
        // Add additional touch event for better mobile performance
        document.querySelectorAll('.project-card').forEach(card => {
            // Use a flag to track if we're in a touch interaction
            let isTouching = false;
            
            card.addEventListener('touchstart', function(e) {
                isTouching = true;
                // Add active state visual feedback
                this.style.transform = 'scale(0.98)';
            }, { passive: true }); // Passive event for better performance
            
            card.addEventListener('touchend', function(e) {
                if (isTouching) {
                    // Reset the transform but keep a small delay for visual feedback
                    setTimeout(() => {
                        this.style.transform = '';
                        isTouching = false;
                    }, 100);
                }
            }, { passive: true });
            
            // Cancel the touch effect if the touch is moved away (scrolling)
            card.addEventListener('touchmove', function(e) {
                isTouching = false;
                this.style.transform = '';
            }, { passive: true });
        });
    }

    // Initialize the view toggle
    setupViewToggle();
    
    // Initialize the view based on toggle state
    initializeView();

    // Make project cards clickable on mobile
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.project-card').forEach(card => {
            const links = card.querySelectorAll('a');
            const primaryLink = links.length > 0 ? links[0].href : null;
            
            if (primaryLink) {
                card.addEventListener('click', function(e) {
                    // Only navigate if the click wasn't on a link or button
                    if (!e.target.closest('a') && !e.target.closest('button')) {
                        window.open(primaryLink, '_blank');
                    }
                });
            }
        });
    }
});