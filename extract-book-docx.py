const applyLanguage = (lang) => {
  const selected = lang === 'ENG' ? 'ENG' : 'GEO';
  localStorage.setItem('team4Lang', selected);
  document.documentElement.lang = selected === 'ENG' ? 'en' : 'ka';

  document.querySelectorAll('.geo-copy').forEach((element) => {
    element.classList.toggle('hidden', selected !== 'GEO');
  });

  document.querySelectorAll('.eng-copy').forEach((element) => {
    element.classList.toggle('hidden', selected !== 'ENG');
  });

  document.querySelectorAll('[data-lang-button]').forEach((button) => {
    const isActive = button.dataset.langButton === selected;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', isActive);
  });

  const backButton = document.querySelector('.back');
  if (backButton) {
    backButton.innerText =
      selected === 'GEO'
        ? backButton.dataset.backGeo || 'საიტზე დაბრუნება'
        : backButton.dataset.backEng || 'Back to Website';
  }
};

document.querySelectorAll('[data-lang-button]').forEach((button) => {
  button.addEventListener('click', () => applyLanguage(button.dataset.langButton));
});

applyLanguage(localStorage.getItem('team4Lang') || 'GEO');
