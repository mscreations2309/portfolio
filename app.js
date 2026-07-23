// --- Interactive Logic for Sheshmani's Premium Resume ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
    });

    function updateThemeButton(theme) {
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
            text.textContent = 'Light Mode';
        } else {
            icon.className = 'fa-solid fa-moon';
            text.textContent = 'Dark Mode';
        }
    }

    // Apply default active state for AI highlights
    document.body.classList.add('ai-highlight-active');

    // 3. Print Button Handler
    const printBtn = document.getElementById('printBtn');
    printBtn.addEventListener('click', () => {
        window.print();
    });

    // 4. Project Filtering
    const tabButtons = document.querySelectorAll('.tab-btn');
    const projectCards = document.querySelectorAll('.project-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked tab
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Trigger fade-in transition
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transition = 'opacity 0.3s ease';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 5. GitHub Stats Loader
    const GH_USERNAME = 'mscreations2309';

    // Language to CSS class & color map
    const langColors = {
        'Kotlin':     { cls: 'lang-kotlin',     hex: 'hsl(280, 75%, 65%)' },
        'Java':       { cls: 'lang-java',        hex: 'hsl(20, 80%, 55%)' },
        'TypeScript': { cls: 'lang-typescript',  hex: 'hsl(210, 80%, 55%)' },
        'JavaScript': { cls: 'lang-javascript',  hex: 'hsl(48, 95%, 55%)' },
        'Python':     { cls: 'lang-python',      hex: 'hsl(220, 75%, 60%)' },
        'CSS':        { cls: 'lang-css',         hex: 'hsl(195, 75%, 50%)' },
    };

    function getLangColor(lang) {
        return langColors[lang] || { cls: 'lang-default', hex: 'var(--primary)' };
    }

    // Animated count-up
    function animateCount(el, target, suffix = '') {
        const duration = 1200;
        const start = performance.now();
        el.classList.add('count-up');
        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else {
                el.textContent = target + suffix;
                el.classList.remove('count-up');
            }
        }
        requestAnimationFrame(step);
    }

    // Fetch user profile stats
    async function loadGitHubStats() {
        try {
            const res = await fetch(`https://api.github.com/users/${GH_USERNAME}`);
            if (!res.ok) throw new Error('GitHub API error');
            const data = await res.json();

            const joinYear = new Date(data.created_at).getFullYear();

            // Animate stat cards
            animateCount(document.getElementById('gh-repos'), data.public_repos);
            document.getElementById('gh-joined').textContent = joinYear;
        } catch (e) {
            // Fallback static values
            document.getElementById('gh-repos').textContent = '8+';
            document.getElementById('gh-joined').textContent = '2019';
        }
    }

    // Trigger GitHub loads
    loadGitHubStats();
});
