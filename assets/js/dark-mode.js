function toggleDarkMode() {
  const body = document.body;
  const icon = document.querySelector('.fa-moon, .fa-sun');
  
  body.classList.toggle('dark-mode');
  
  if (icon) {
    if (body.classList.contains('dark-mode')) {
      icon.classList.replace('fa-moon', 'fa-sun');
    } else {
      icon.classList.replace('fa-sun', 'fa-moon');
    }
  }
  
  localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
}

document.addEventListener('DOMContentLoaded', () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('darkMode');
  
  if (storedTheme !== null ? storedTheme === 'true' : prefersDark) {
    document.body.classList.add('dark-mode');
    const icon = document.querySelector('.fa-moon');
    if (icon) {
      icon.classList.replace('fa-moon', 'fa-sun');
    }
  }
}); 