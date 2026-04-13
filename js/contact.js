/* ============================================
   CONTACT FORM (SMTP via backend)
   ============================================ */

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const status = document.getElementById('contact-status');
    const submit = document.getElementById('contact-submit');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        if (!name || !email || !message) {
            status.textContent = 'Prosím vyplňte všetky polia.';
            status.className = 'contact__status contact__status--error';
            return;
        }

        submit.disabled = true;
        submit.textContent = '...';

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            if (response.ok) {
                status.textContent = window.i18n?.t('kontakt.successMsg') || 'Správa bola úspešne odoslaná!';
                status.className = 'contact__status contact__status--success';
                form.reset();
            } else {
                throw new Error('Server error');
            }
        } catch (err) {
            status.textContent = window.i18n?.t('kontakt.errorMsg') || 'Nastala chyba. Skúste to prosím znova.';
            status.className = 'contact__status contact__status--error';
        } finally {
            submit.disabled = false;
            submit.textContent = window.i18n?.t('kontakt.submit') || 'Poslať';
        }
    });
}

document.addEventListener('DOMContentLoaded', initContactForm);

export { initContactForm };
