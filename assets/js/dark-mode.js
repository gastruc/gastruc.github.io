function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const icon = document.querySelector('.fa-moon');
  if (icon) {
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
  }
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    const icon = document.querySelector('.fa-moon');
    if (icon) {
      icon.classList.replace('fa-moon', 'fa-sun');
    }
  }
}); 