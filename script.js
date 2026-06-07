document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // DOM Elements
  const header = document.getElementById('main-header');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileOverlayMenu = document.getElementById('mobile-overlay-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.nav-link');
  const typedRoleElement = document.getElementById('typed-role');
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
  const skillBarFills = document.querySelectorAll('.skill-bar-fill');
  const scrollToTopBtn = document.getElementById('scroll-to-top');

  // Quote Generator Elements & Data
  const quoteDisplay = document.getElementById('quote-display');
  const quoteAuthor = document.getElementById('quote-author');
  const newQuoteBtn = document.getElementById('new-quote-btn');
  const quotesList = [
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Without data, you're just another person with an opinion.", author: "W. Edwards Deming" },
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Data is the new oil. It's valuable, but if unrefined it cannot really be used.", author: "Clive Humby" },
    { text: "Clean code always looks like it was written by someone who cares.", author: "Michael Feathers" },
    { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
    { text: "In God we trust, all others must bring data.", author: "W. Edwards Deming" },
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay" }
  ];

  // Contact Form Elements
  const contactForm = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');
  const closeSuccessModal = document.getElementById('close-success-modal');
  const submitBtn = document.getElementById('submit-btn');

  /* -------------------------------------------------------------
   * 1. Navigation & Scroll Interactions
   * ------------------------------------------------------------- */
  // Header scroll effects
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll to Top button visibility
    if (window.scrollY > 500) {
      scrollToTopBtn.style.opacity = '1';
      scrollToTopBtn.style.visibility = 'visible';
    } else {
      scrollToTopBtn.style.opacity = '0';
      scrollToTopBtn.style.visibility = 'hidden';
    }
  });

  // Scroll to Top click event
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Mobile navigation overlay toggle
  function toggleMobileMenu() {
    mobileMenuToggle.classList.toggle('active');
    mobileOverlayMenu.classList.toggle('active');
    document.body.classList.toggle('overflow-hidden'); // Prevent background scrolling
  }

  mobileMenuToggle.addEventListener('click', toggleMobileMenu);

  // Close mobile menu on clicking any navigation link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      mobileOverlayMenu.classList.remove('active');
      document.body.classList.remove('overflow-hidden');
    });
  });

  // Active Link Tracking using Scroll Spy
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section is in main middle focus
    threshold: 0
  };

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeSectionId = entry.target.getAttribute('id');
        updateActiveNavLinks(activeSectionId);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    scrollSpyObserver.observe(section);
  });

  function updateActiveNavLinks(sectionId) {
    // Update desktop nav
    desktopNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update mobile nav
    mobileNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* -------------------------------------------------------------
   * 2. Typing Animation (Hero Section)
   * ------------------------------------------------------------- */
  const roles = [
    "Full Stack Developer",
    "Data Analytics Enthusiast",
    "IT Undergraduate"
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;
  
  function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Remove character
      typedRoleElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 50; // faster deleting
    } else {
      // Add character
      typedRoleElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 100; // normal typing speed
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // End of role, pause before deleting
      isDeleting = true;
      typingDelay = 2000; 
    } else if (isDeleting && charIndex === 0) {
      // Done deleting, switch to next role
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingDelay = 500; // pause before starting to type next word
    }

    setTimeout(typeRole, typingDelay);
  }

  // Initiate typing animation loop
  if (typedRoleElement) {
    setTimeout(typeRole, 1000);
  }

  /* -------------------------------------------------------------
   * 3. Scroll Reveal Animation & Skill Bars Loading
   * ------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        
        // If the section is the skills section, animate skill bars
        if (entry.target.id === 'skills') {
          animateSkillBars();
        }
      }
    });
  }, { threshold: 0.15 });

  scrollRevealElements.forEach(element => {
    revealObserver.observe(element);
  });

  function animateSkillBars() {
    skillBarFills.forEach(bar => {
      const targetWidth = bar.getAttribute('data-width');
      bar.style.width = targetWidth;
    });
  }

  /* -------------------------------------------------------------
   * 4. Interactive Quote Generator Widget
   * ------------------------------------------------------------- */
  let currentQuoteIndex = 0;

  function getRandomQuote() {
    // Select index different from the current one to ensure it changes
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * quotesList.length);
    } while (newIndex === currentQuoteIndex);

    currentQuoteIndex = newIndex;
    const selectedQuote = quotesList[currentQuoteIndex];

    // Fade out effect
    quoteDisplay.style.opacity = '0';
    quoteAuthor.style.opacity = '0';

    setTimeout(() => {
      quoteDisplay.textContent = `"${selectedQuote.text}"`;
      quoteAuthor.textContent = `— ${selectedQuote.author}`;
      // Fade in effect
      quoteDisplay.style.opacity = '1';
      quoteAuthor.style.opacity = '1';
    }, 300);
  }

  if (newQuoteBtn) {
    // Add transition style to elements
    quoteDisplay.style.transition = 'opacity 0.3s ease';
    quoteAuthor.style.transition = 'opacity 0.3s ease';
    
    newQuoteBtn.addEventListener('click', getRandomQuote);
  }

  /* -------------------------------------------------------------
   * 5. Contact Form Validation & Submission
   * ------------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');
      
      let isValid = true;

      // 1. Name Validation
      if (nameInput.value.trim() === '') {
        showError(nameInput, 'name-error');
        isValid = false;
      } else {
        clearError(nameInput, 'name-error');
      }

      // 2. Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'email-error');
        isValid = false;
      } else {
        clearError(emailInput, 'email-error');
      }

      // 3. Subject Validation
      if (subjectInput.value.trim() === '') {
        showError(subjectInput, 'subject-error');
        isValid = false;
      } else {
        clearError(subjectInput, 'subject-error');
      }

      // 4. Message Validation
      if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'message-error');
        isValid = false;
      } else {
        clearError(messageInput, 'message-error');
      }

      // If valid, simulate sending process
      if (isValid) {
        simulateFormSubmission();
      }
    });

    // Helper functions for showing/hiding validation errors
    function showError(input, errorId) {
      const group = input.closest('.form-group');
      group.classList.add('has-error');
    }

    function clearError(input, errorId) {
      const group = input.closest('.form-group');
      group.classList.remove('has-error');
    }

    // Dynamic error clearing on user typing
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group.classList.contains('has-error')) {
          group.classList.remove('has-error');
        }
      });
    });

    function simulateFormSubmission() {
      // Disable inputs & update submit button state to loading
      submitBtn.disabled = true;
      const btnSpan = submitBtn.querySelector('span');
      const btnIcon = submitBtn.querySelector('#submit-btn-icon');
      
      const originalText = btnSpan.textContent;
      btnSpan.textContent = 'Sending message...';
      if (btnIcon) btnIcon.style.display = 'none';

      // Simulate network request delay
      setTimeout(() => {
        // Reset button
        submitBtn.disabled = false;
        btnSpan.textContent = originalText;
        if (btnIcon) btnIcon.style.display = 'inline-block';
        
        // Reset Form Fields
        contactForm.reset();
        
        // Show Success Dialog Modal
        successModal.classList.add('active');
      }, 1500);
    }
  }

  // Success Modal Dismiss Events
  if (closeSuccessModal) {
    closeSuccessModal.addEventListener('click', () => {
      successModal.classList.remove('active');
    });

    // Close on clicking overlay background
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }
});
