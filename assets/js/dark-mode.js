function toggleDarkMode() {
  const body = document.body;
  const button = document.querySelector('.dark-mode-toggle i');
  
  // Toggle dark mode
  body.classList.toggle('dark-mode');
  
  // Update button icon
  if (body.classList.contains('dark-mode')) {
    button.classList.remove('fa-moon');
    button.classList.add('fa-sun');
    localStorage.setItem('darkMode', 'enabled');
  } else {
    button.classList.remove('fa-sun');
    button.classList.add('fa-moon');
    localStorage.setItem('darkMode', 'disabled');
  }
}

// Check for saved dark mode preference
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    document.querySelector('.dark-mode-toggle i').classList.replace('fa-moon', 'fa-sun');
  }
}); 