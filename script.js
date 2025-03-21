document.addEventListener('DOMContentLoaded', function() {
  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });

  // Header visibility on scroll
  const header = document.getElementById('main-header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
      header.classList.add('visible');
    } else {
      header.classList.remove('visible');
    }
    
    lastScrollTop = scrollTop;
  });

  // Mouse-following Glowing Effect for Feature Cards
  const featuresContainer = document.getElementById('features-container');
  const featureCards = document.querySelectorAll('.feature-card-wrapper');
  
  // Track mouse position
  let mouseX = 0;
  let mouseY = 0;
  
  // Animation frame request ID
  let animationFrameId = null;
  
  // Function to handle mouse movement
  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    
    animationFrameId = requestAnimationFrame(updateGlowingEffects);
  }
  
  // Function to update glowing effects based on mouse position
  function updateGlowingEffects() {
    featureCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const glowingEffect = card.querySelector('.glowing-effect');
      
      // Calculate center of the card
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from mouse to center
      const distanceFromCenter = Math.hypot(mouseX - centerX, mouseY - centerY);
      const inactiveRadius = 0.5 * Math.min(rect.width, rect.height) * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--inactiveZone'));
      
      // Check if mouse is within inactive zone
      if (distanceFromCenter < inactiveRadius) {
        card.classList.remove('active');
        return;
      }
      
      // Check if mouse is within proximity
      const proximity = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--proximity'));
      const isActive = 
        mouseX > rect.left - proximity &&
        mouseX < rect.left + rect.width + proximity &&
        mouseY > rect.top - proximity &&
        mouseY < rect.top + rect.height + proximity;
      
      if (isActive) {
        card.classList.add('active');
        
        // Calculate angle from center to mouse
        const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI) + 90;
        
        // Set the start angle for the mask
        glowingEffect.style.setProperty('--start', angle.toString());
      } else {
        card.classList.remove('active');
      }
    });
  }
  
  // Add mouse move event listener to the features container
  document.addEventListener('mousemove', handleMouseMove);
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    document.removeEventListener('mousemove', handleMouseMove);
  });
});
