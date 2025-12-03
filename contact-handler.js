// Web3 Forms Contact Handler
const FORM_ID = 'contactForm';
const ACCESS_KEY = 'YOUR_WEB3_FORMS_ACCESS_KEY'; // Replace with your Web3 Forms access key

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById(FORM_ID);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formMessage = document.getElementById('formMessage');
        const submitBtn = form.querySelector('.submit-btn');
        
        // Get form data
        const formData = new FormData(form);
        
        // Add Web3 Forms access key
        formData.append('access_key', ACCESS_KEY);

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formMessage.className = '';
        formMessage.textContent = '';

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // Success
                formMessage.className = 'form-message success';
                formMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                form.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }, 3000);
            } else {
                // Error from Web3 Forms
                formMessage.className = 'form-message error';
                formMessage.textContent = data.message || 'Failed to send message. Please try again.';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        } catch (error) {
            // Network or other error
            formMessage.className = 'form-message error';
            formMessage.textContent = 'Error sending message. Please check your connection and try again.';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            console.error('Form submission error:', error);
        }
    });
});
