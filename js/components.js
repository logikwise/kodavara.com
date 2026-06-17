/**
 * KODAVARA — Shared Components
 * Injects nav and footer into every page
 */

(function() {
  const NAV_HTML = `
<nav class="nav" role="navigation" aria-label="Main navigation">
  <div class="container">
    <div class="nav__inner">
      <a href="index.html" class="nav__logo" aria-label="Kodavara home">
        <span class="nav__logo-name">Kodavara</span>
        <span class="nav__logo-tag">Systems · People · AI</span>
      </a>
      <ul class="nav__links" role="list">
        <li><a href="index.html">Home</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="frameworks.html">Frameworks</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html" class="nav__cta">Schedule a Session</a></li>
      </ul>
      <button class="nav__hamburger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>
<div class="nav__mobile" role="dialog" aria-label="Mobile navigation">
  <button class="nav__mobile-close" aria-label="Close menu">✕</button>
  <a href="index.html">Home</a>
  <a href="services.html">Services</a>
  <a href="frameworks.html">Frameworks</a>
  <a href="about.html">About</a>
  <a href="contact.html">Contact</a>
</div>`;

  const FOOTER_HTML = `
<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer__grid">
      <div>
        <div class="footer__brand-name">Kodavara</div>
        <div class="footer__brand-tag">Systems · People · AI</div>
        <p class="footer__tagline">AI Strategy. Engineered for Advantage.</p>
        <p class="footer__tagline" style="margin-top:6px;font-size:0.8rem;opacity:0.7;">Design the System. Empower the People. Amplify with AI.</p>
      </div>
      <div>
        <div class="footer__col-title">Services</div>
        <ul class="footer__links">
          <li><a href="services.html">Strategy &amp; Advisory</a></li>
          <li><a href="services.html">Systems &amp; Operations</a></li>
          <li><a href="services.html">Automation</a></li>
          <li><a href="services.html">AI &amp; Agents</a></li>
          <li><a href="services.html">Training</a></li>
        </ul>
      </div>
      <div>
        <div class="footer__col-title">Company</div>
        <ul class="footer__links">
          <li><a href="about.html">About</a></li>
          <li><a href="frameworks.html">Frameworks</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <div class="footer__col-title">Get Started</div>
        <ul class="footer__links">
          <li><a href="contact.html">Schedule a Session</a></li>
          <li><a href="contact.html">Strategic Assessment</a></li>
          <li><a href="contact.html">Workshop Request</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <p class="footer__copy">&copy; ${new Date().getFullYear()} Kodavara. All rights reserved.</p>
      <div class="footer__bottom-links">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
      </div>
    </div>
  </div>
</footer>`;

  function inject() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (navPlaceholder) navPlaceholder.outerHTML = NAV_HTML;
    if (footerPlaceholder) footerPlaceholder.outerHTML = FOOTER_HTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
