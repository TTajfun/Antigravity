import './src/css/style.css'

// Initialize Lucide icons
// @ts-ignore
lucide.createIcons();

// Mobile Menu Toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Optional: Change icon from menu to x
    });
}

console.log('Mýval website loaded!');
