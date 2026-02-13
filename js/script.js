document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const confirmFeedback = document.getElementById('confirmFeedback');
    const dob = document.getElementById('dob');
    const termsLink = document.getElementById('termsLink');
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const today = new Date().toISOString().split('T')[0];
    dob.setAttribute('max', today);
    const termsModalEl = document.getElementById('termsModal');
    const termsModal = new bootstrap.Modal(termsModalEl);
    const acceptTermsBtn = document.getElementById('acceptTermsBtn');
    const termsDate = document.getElementById('termsDate');
    termsDate.textContent = new Date().toLocaleDateString();
    termsLink.addEventListener('click', function (e) {
        e.preventDefault();
        termsModal.show();
    });

    acceptTermsBtn.addEventListener('click', function () {
        const agree = document.getElementById('agree');
        agree.checked = true;
        termsModal.hide();
    });

    function passwordsMatch() {
        if (password.value === '' && confirmPassword.value === '') return true;
        return password.value === confirmPassword.value;
    }

    function setValidityForConfirm() {
        if (!passwordsMatch()) {
            confirmPassword.setCustomValidity('Passwords do not match');
            confirmFeedback.textContent = 'Passwords do not match.';
        } else {
            confirmPassword.setCustomValidity('');
            confirmFeedback.textContent = 'Passwords must match.';
        }
    }

    password.addEventListener('input', setValidityForConfirm);
    confirmPassword.addEventListener('input', setValidityForConfirm);
    form.addEventListener('submit', function (e) {
        setValidityForConfirm();
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
            form.classList.add('was-validated');
            if (!passwordsMatch()) {
                confirmPassword.focus();
            }
            return;
        }

        e.preventDefault();
        const data = {
            firstName: form.firstName.value.trim(),
            lastName: form.lastName.value.trim(),
            username: form.username.value.trim(),
            email: form.email.value.trim(),
            country: form.country.value,
            dob: form.dob.value,
            agree: document.getElementById('agree').checked
        };

        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-bg-success border-0';
        toast.role = 'status';
        toast.ariaLive = 'polite';
        toast.ariaAtomic = 'true';
        toast.style.position = 'fixed';
        toast.style.right = '20px';
        toast.style.bottom = '20px';
        toast.style.zIndex = '1080';
        toast.innerHTML = '<div class="d-flex"><div class="toast-body">Registration successful. Welcome, ' + (data.firstName || data.username) + '!</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>';
        document.body.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast, { delay: 4000 });
        bsToast.show();
        form.reset();
        form.classList.remove('was-validated');
        setTimeout(function () {
            toast.remove();
        }, 5000);
    });

    function applyTheme(isDark) {
        if (isDark) {
            body.classList.add('dark');
        } else {
            body.classList.remove('dark');
        }
    }

    function loadTheme() {
        const stored = localStorage.getItem('prefersDark');
        if (stored === null) {
            const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefers);
            localStorage.setItem('prefersDark', prefers ? '1' : '0');
        } else {
            applyTheme(stored === '1');
        }
    }

    function toggleTheme() {
        const isDark = body.classList.toggle('dark');
        localStorage.setItem('prefersDark', isDark ? '1' : '0');
        themeToggle.animate([
            { transform: 'rotate(0) scale(1)' },
            { transform: 'rotate(20deg) scale(0.98)' },
            { transform: 'rotate(0) scale(1)' }
        ], { duration: 420, easing: 'cubic-bezier(.2,.9,.3,1)' });
    }
    
    themeToggle.addEventListener('click', function (e) {
        e.preventDefault();
        toggleTheme();
    });
    loadTheme();
});
