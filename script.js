(function () {
  'use strict';

  /* Jede Seite startet ganz oben (ausser ein Link zeigt gezielt auf einen Abschnitt, z. B. #abhol) */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  function toTop() { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
  if (!window.location.hash) {
    toTop();
    window.addEventListener('load', toTop);
  }
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && !window.location.hash) toTop();
  });

  /* Klick auf den Menüpunkt der aktuellen Seite: sanft nach oben */
  [].slice.call(document.querySelectorAll('.nav a[href$=".html"], .brand')).forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = a.getAttribute('href');
      var here = window.location.pathname.split('/').pop() || 'index.html';
      if (target === here || (a.classList.contains('brand') && here === 'index.html')) {
        e.preventDefault();
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    });
  });

  /* Jahr im Footer */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* Mobile-Menü */
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  function closeMenu() {
    if (!btn || !nav) return;
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Menü öffnen');
  }
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
    });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* Kontaktformular: prüft die Eingaben und öffnet das E-Mail-Programm */
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name, email = form.elements.email, msg = form.elements.message;
      var ok = true;
      [name, email, msg].forEach(function (f) { f.classList.remove('invalid'); });
      if (!name.value.trim()) { name.classList.add('invalid'); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.classList.add('invalid'); ok = false; }
      if (!msg.value.trim()) { msg.classList.add('invalid'); ok = false; }
      if (!ok) {
        note.style.color = '#b81f21';
        note.textContent = 'Bitte füll alle Felder korrekt aus.';
        return;
      }
      var subject = 'Anfrage über garage59.ch von ' + name.value.trim();
      var body = msg.value.trim() + '\n\n— ' + name.value.trim() + '\n' + email.value.trim();
      note.style.color = '#1f7a3a';
      note.textContent = 'Danke! Dein E-Mail-Programm öffnet sich – schick die Nachricht dort einfach ab.';
      window.location.href = 'mailto:info@garage59.ch?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
