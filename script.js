document.addEventListener('DOMContentLoaded', () => {
    // Apply theme from localStorage
    applySavedTheme();

    // Theme toggle button
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌓';
    document.body.appendChild(themeToggle);

    themeToggle.addEventListener('click', toggleTheme);

    // Enhanced image loading
    const featuredFlavor = document.getElementById('featuredFlavor');
    if (featuredFlavor) {
        featuredFlavor.addEventListener('load', function () {
            this.classList.add('loaded');
        });

        // If image is cached and already loaded
        if (featuredFlavor.complete) {
            featuredFlavor.classList.add('loaded');
        }
    }

    // Add favorite hearts to flavor gallery
    const flavorImages = document.querySelectorAll('.flavor-gallery img');
    flavorImages.forEach(img => {
        const heart = document.createElement('div');
        heart.className = 'favorite-heart';
        heart.innerHTML = '❤️';
        img.parentNode.insertBefore(heart, img);

        // Check if this flavor is favorited
        const flavorName = img.alt;
        if (isFlavorFavorited(flavorName)) {
            heart.classList.add('active');
        }

        heart.addEventListener('click', function (e) {
            e.stopPropagation();
            this.classList.toggle('active');
            toggleFavoriteFlavor(flavorName, this.classList.contains('active'));
        });
    });

    // 1. Event Handling
    document.getElementById('flavorButton').addEventListener('click', function () {
        alert('Let us help you find your perfect dream flavor! Visit our flavors section to explore.');
    });

    const secretButton = document.getElementById('secretButton');
    const secretMessage = document.getElementById('secretMessage');
    let pressTimer;

    secretButton.addEventListener('dblclick', showSecret);
    document.getElementById('secretNav').addEventListener('click', showSecret);

    secretButton.addEventListener('mousedown', function () {
        pressTimer = setTimeout(showSecret, 1000); // 1 second long press
    });

    secretButton.addEventListener('mouseup', function () {
        clearTimeout(pressTimer);
    });

    secretButton.addEventListener('mouseleave', function () {
        clearTimeout(pressTimer);
    });

    secretButton.addEventListener('click', () => {
        if (secretMessage) {
            secretMessage.style.display = 'block'; // Show the secret menu
        }
    });

    function showSecret() {
        if (secretMessage) {
            secretMessage.style.display = 'block';
            createConfetti();
        }
    }

    function hideSecret() {
        if (secretMessage) {
            secretMessage.style.display = 'none'; // Hide the secret menu
        }
    }

    const keepItSecretButton = secretMessage.querySelector('button');
    if (keepItSecretButton) {
        keepItSecretButton.addEventListener('click', hideSecret);
    }

    // 2. Interactive Elements
    const colors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];
    let colorIndex = 0;

    document.getElementById('colorChanger').addEventListener('click', function () {
        colorIndex = (colorIndex + 1) % colors.length;
        this.style.backgroundColor = colors[colorIndex];
        this.style.borderColor = colors[(colorIndex + 2) % colors.length];

        this.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 300);
    });

    // Image gallery
    function changeFlavor(img) {
        const featuredFlavor = document.getElementById('featuredFlavor');
        if (featuredFlavor) {
            featuredFlavor.src = img.src;
            featuredFlavor.alt = img.alt;

            img.style.transform = 'scale(0.9) rotate(-5deg)';
            setTimeout(() => {
                img.style.transform = 'scale(1.1) rotate(0deg)';
            }, 100);
        }
    }

    // Tabs
    function openTab(event, tabName) {
        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));

        // Remove active class from all tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => button.classList.remove('active'));

        // Show the selected tab content
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        // Add active class to the clicked tab button
        event.currentTarget.classList.add('active');
    }

    // Attach the `openTab` function to the global scope so it can be called from the HTML
    window.openTab = openTab;

    // Accordion
    function toggleAccordion(header) {
        // Get the content element next to the clicked header
        const content = header.nextElementSibling;
        const icon = header.querySelector('i');

        // Check if the content is already open
        const isOpen = content.style.maxHeight;

        // Close all other accordion items
        const allContents = document.querySelectorAll('.faq-content');
        const allIcons = document.querySelectorAll('.faq-header i');
        allContents.forEach(item => {
            item.style.maxHeight = null; // Collapse all contents
        });
        allIcons.forEach(i => {
            i.classList.remove('fa-chevron-up');
            i.classList.add('fa-chevron-down'); // Reset all icons
        });

        // Toggle the clicked accordion item
        if (!isOpen) {
            content.style.maxHeight = content.scrollHeight + 'px'; // Expand the content
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up'); // Change the icon to "up"
        }
    }
    

    // Attach the toggleAccordion function to the global scope
    window.toggleAccordion = toggleAccordion;

    // Form Validation
    function validateName(input) {
        const errorElement = document.getElementById('nameError');
        if (input.value.trim() === '') {
            input.classList.add('invalid');
            input.classList.remove('valid');
            errorElement.style.display = 'block';
            return false;
        } else {
            input.classList.add('valid');
            input.classList.remove('invalid');
            errorElement.style.display = 'none';
            return true;
        }
    }

    function validateEmail(input) {
        const errorElement = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (input.value.trim() === '' || emailRegex.test(input.value)) {
            input.classList.add('valid');
            input.classList.remove('invalid');
            errorElement.style.display = 'none';
            return true;
        } else {
            input.classList.add('invalid');
            input.classList.remove('valid');
            errorElement.style.display = 'block';
            return false;
        }
    }

    document.getElementById('contactForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const isNameValid = validateName(document.getElementById('name'));
        const isEmailValid = validateEmail(document.getElementById('email'));

        if (isNameValid && isEmailValid) {
            // Save form data to localStorage
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                flavor: document.getElementById('flavor').value,
                message: document.getElementById('message').value,
                newsletter: document.getElementById('newsletter').checked,
                timestamp: new Date().toISOString()
            };

            let submissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
            submissions.push(formData);
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

            // Show success animation
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '✓ Sent!';

            setTimeout(() => {
                submitButton.innerHTML = 'Send Message';
                submitButton.disabled = false;
                this.reset();
            }, 2000);
        } else {
            alert('Please fix the highlighted errors before submitting.');
        }
    });

    // Load saved form data if available
    window.addEventListener('load', function () {
        const savedName = localStorage.getItem('savedName');
        const savedEmail = localStorage.getItem('savedEmail');

        if (savedName) document.getElementById('name').value = savedName;
        if (savedEmail) document.getElementById('email').value = savedEmail;
    });

    // Save form data as user types
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    if (nameInput) {
        nameInput.addEventListener('input', function () {
            localStorage.setItem('savedName', this.value);
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', function () {
            localStorage.setItem('savedEmail', this.value);
        });
    }

    // Bonus: Confetti animation
    function createConfetti() {
        const flavors = ['🍦', '🍨', '🍧', '🥄', '🌟', '✨'];
        const colors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = flavors[Math.floor(Math.random() * flavors.length)];
            confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.fontSize = (20 + Math.random() * 20) + 'px';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = -30 + 'px';
            document.body.appendChild(confetti);

            const angle = Math.random() * Math.PI * 2;
            const velocity = 3 + Math.random() * 5;
            const rotationSpeed = Math.random() * 10;
            let rotation = 0;

            let posX = parseFloat(confetti.style.left);
            let posY = parseFloat(confetti.style.top);
            let opacity = 1;

            const fall = setInterval(() => {
                posX += Math.cos(angle) * 2;
                posY += velocity;
                rotation += rotationSpeed;
                opacity -= 0.01;

                confetti.style.left = posX + 'px';
                confetti.style.top = posY + 'px';
                confetti.style.opacity = opacity;
                confetti.style.transform = `rotate(${rotation}deg)`;

                if (posY > window.innerHeight || opacity <= 0) {
                    clearInterval(fall);
                    confetti.remove();
                }
            }, 30);
        }
    }

    // New functions for theme and favorites
    function applySavedTheme() {
        document.body.classList.add('theme-transition');
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('theme-transition');
        });

        const savedTheme = localStorage.getItem('dreamyCreamTheme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }

        setTimeout(() => {
            document.body.classList.remove('theme-transition');
            document.querySelectorAll('section').forEach(section => {
                section.classList.remove('theme-transition');
            });
        }, 500);
    }

    function toggleTheme() {
        document.body.classList.add('theme-transition');
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('theme-transition');
        });

        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('dreamyCreamTheme', isDark ? 'dark' : 'light');

        setTimeout(() => {
            document.body.classList.remove('theme-transition');
            document.querySelectorAll('section').forEach(section => {
                section.classList.remove('theme-transition');
            });
        }, 500);
    }

    function isFlavorFavorited(flavorName) {
        const favorites = JSON.parse(localStorage.getItem('favoriteFlavors')) || [];
        return favorites.includes(flavorName);
    }

    function toggleFavoriteFlavor(flavorName, isFavorite) {
        let favorites = JSON.parse(localStorage.getItem('favoriteFlavors')) || [];

        if (isFavorite) {
            if (!favorites.includes(flavorName)) {
                favorites.push(flavorName);
            }
        } else {
            favorites = favorites.filter(name => name !== flavorName);
        }

        localStorage.setItem('favoriteFlavors', JSON.stringify(favorites));

        // Animation for adding/removing favorites
        if (isFavorite) {
            const heart = event.target;
            heart.style.animation = 'none';
            void heart.offsetWidth; // Trigger reflow
            heart.style.animation = 'heartBeat 0.5s';
        }
    }

    // Function to store and retrieve user preferences
    function manageUserPreferences() {
        const preferencesKey = 'userPreferences';

        // Retrieve preferences from localStorage
        const savedPreferences = JSON.parse(localStorage.getItem(preferencesKey)) || {
            theme: 'light',
            favoriteFlavor: null
        };

        // Apply saved preferences
        if (savedPreferences.theme === 'dark') {
            document.body.classList.add('dark-theme');
        }

        if (savedPreferences.favoriteFlavor) {
            alert(`Welcome back! Your favorite flavor is ${savedPreferences.favoriteFlavor}.`);
        }

        // Save preferences when user selects a favorite flavor
        const flavorSelect = document.getElementById('flavor');
        if (flavorSelect) {
            flavorSelect.addEventListener('change', function () {
                savedPreferences.favoriteFlavor = this.value;
                localStorage.setItem(preferencesKey, JSON.stringify(savedPreferences));
            });
        }

        // Save preferences when user toggles theme
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function () {
                savedPreferences.theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
                localStorage.setItem(preferencesKey, JSON.stringify(savedPreferences));
            });
        }
    }

    // Function to trigger an animation on user action
    function triggerUserActionAnimation() {
        const actionButton = document.getElementById('actionButton'); // Add a button with this ID in your HTML
        if (actionButton) {
            actionButton.addEventListener('click', function () {
                // Create a simple bounce animation
                this.style.transform = 'scale(1.2)';
                this.style.transition = 'transform 0.3s ease';

                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 300);

                // Trigger confetti animation
                createConfetti();
            });
        }
    }

    // Initialize functions
    manageUserPreferences();
    triggerUserActionAnimation();

    // New functionality for button animations and click tracking
    const flavorButton = document.getElementById('flavorButton');
    const colorChanger = document.getElementById('colorChanger');

    // Function to trigger the shake animation
    function triggerShakeAnimation(button) {
        button.classList.add('shake');
        setTimeout(() => {
            button.classList.remove('shake');
        }, 500); // Match the duration of the animation
    }

    // Store button click data in localStorage
    function storeButtonClick(buttonId) {
        const clicks = JSON.parse(localStorage.getItem('buttonClicks')) || {};
        clicks[buttonId] = (clicks[buttonId] || 0) + 1;
        localStorage.setItem('buttonClicks', JSON.stringify(clicks));
    }

    // Add event listeners to buttons
    flavorButton.addEventListener('click', () => {
        triggerShakeAnimation(flavorButton);
        storeButtonClick('flavorButton');
    });

    secretButton.addEventListener('click', () => {
        triggerShakeAnimation(secretButton);
        storeButtonClick('secretButton');
    });

    colorChanger.addEventListener('click', () => {
        triggerShakeAnimation(colorChanger);
        storeButtonClick('colorChanger');
    });

    // Log button click data from localStorage
    console.log('Button Click Data:', JSON.parse(localStorage.getItem('buttonClicks')));
});