const navToggle = document.querySelector('.nav-toggle');
const navigation = document.getElementById('site-navigation');

if (navToggle && navigation) {
    function setNavigationOpen(open) {
        if (!open && navigation.contains(document.activeElement)) {
            navToggle.focus({ preventScroll: true });
        }
        navigation.toggleAttribute('inert', !open);
        navToggle.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('nav-open', open);
    }

    navToggle.addEventListener('click', () => {
        setNavigationOpen(navigation.hasAttribute('inert'));
    });

    navigation.addEventListener('click', event => {
        const link = event.target.closest('.nav__link');
        if (!link) return;

        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            document.getElementById(href.slice(1))?.focus({ preventScroll: true });
        }
        setNavigationOpen(false);
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !navigation.hasAttribute('inert')) setNavigationOpen(false);
    });

    document.addEventListener('focusin', event => {
        if (!navigation.hasAttribute('inert') && event.target !== navToggle && !navigation.contains(event.target)) {
            setNavigationOpen(false);
        }
    });
}

const form = document.getElementById('my-form');
if (form) {
    const status = document.getElementById('my-form-status');
    const submitButton = document.getElementById('my-form-button');
    const failureMessage = 'Could not send your message. Please try again.';

    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (submitButton.disabled) return;

        submitButton.disabled = true;
        status.textContent = 'Sending your message…';

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (response.ok) {
                form.reset();
                status.textContent = 'Thanks for your message!';
            } else {
                const data = await response.json();
                const messages = Array.isArray(data?.errors)
                    ? data.errors.map(error => error?.message).filter(message => typeof message === 'string' && message.trim())
                    : [];
                status.textContent = messages.join(', ') || failureMessage;
            }
        } catch {
            status.textContent = failureMessage;
        } finally {
            submitButton.disabled = false;
        }
    });
}
