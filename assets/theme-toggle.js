// Keeps the theme toggle logic out of inline scripts so it works with CSP.
(function () {
  const STORAGE_KEY = 'preferred-theme';

  const storedTheme = () => {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  };

  const systemTheme = (mediaQuery) => (mediaQuery.matches ? 'light' : 'dark');

  const setActiveButton = (buttons, theme) => {
    buttons.forEach((button) => {
      const isActive = button.dataset.themeTarget === theme;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive);
    });
  };

  const applyTheme = (root, buttons, theme, remember = true) => {
    if (theme === 'light' || theme === 'dark') {
      root.setAttribute('data-theme', theme);
      if (remember) {
        localStorage.setItem(STORAGE_KEY, theme);
      }
    } else {
      root.removeAttribute('data-theme');
      if (remember) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setActiveButton(buttons, theme);
  };

  const init = () => {
    const root = document.documentElement;
    const themeButtons = document.querySelectorAll('[data-theme-target]');
    if (!themeButtons.length) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

    const saved = storedTheme();
    if (saved) {
      applyTheme(root, themeButtons, saved, false);
    } else {
      root.removeAttribute('data-theme');
      setActiveButton(themeButtons, systemTheme(mediaQuery));
    }

    themeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const targetTheme = button.dataset.themeTarget;
        if (targetTheme === 'light' || targetTheme === 'dark') {
          applyTheme(root, themeButtons, targetTheme);
        }
      });
    });

    const handleSystemChange = (event) => {
      if (!storedTheme()) {
        setActiveButton(themeButtons, event.matches ? 'light' : 'dark');
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleSystemChange);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
