(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- scroll-triggered reveal ---- */
  var targets = document.querySelectorAll('.reveal, .mask, .reveal-group');
  if(!('IntersectionObserver' in window) || reduced){
    targets.forEach(function(el){ el.classList.add('in-view'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function(el){ io.observe(el); });
  }

  /* ---- scroll progress bar + nav solidify on scroll ---- */
  var progressBar = document.getElementById('scrollProgress');
  var navEl = document.querySelector('nav');
  function updateProgress(){
    var h = document.documentElement;
    var scrolled = h.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (scrolled / max) * 100 : 0;
    if(progressBar) progressBar.style.width = pct + '%';
    if(navEl){
      if(scrolled > 40) navEl.classList.add('scrolled');
      else navEl.classList.remove('scrolled');
    }
  }

  /* ---- hero parallax fade (skipped if reduced-motion, or no .hero on page) ---- */
  var heroInner = document.querySelector('.hero-inner');
  var heroEl = document.querySelector('.hero');
  function updateParallax(){
    if(reduced || !heroEl || !heroInner) return;
    var heroH = heroEl.offsetHeight;
    var p = Math.min(window.scrollY / heroH, 1);
    heroInner.style.opacity = String(1 - p * 1.15);
    heroInner.style.transform = 'translateY(' + (p * 46) + 'px) scale(' + (1 - p * 0.06) + ')';
  }

  var ticking = false;
  function onScroll(){
    if(!ticking){
      window.requestAnimationFrame(function(){
        updateProgress();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  updateProgress();
  updateParallax();

  /* ---- scrollspy: highlight current in-page section in nav (home page only) ---- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('nav a[href^="#"]'));
  var sections = navLinks
    .map(function(a){ return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if('IntersectionObserver' in window && sections.length){
    var spyIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var link = document.querySelector('nav a[href="#' + entry.target.id + '"]');
        if(!link) return;
        if(entry.isIntersecting){
          navLinks.forEach(function(a){ a.classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }, { threshold: 0, rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function(s){ spyIO.observe(s); });
  }

  /* ---- cursor spotlight glow on cards ---- */
  if(!reduced){
    var glowEls = document.querySelectorAll('.tech-card, .stack-cell, .project-card');
    glowEls.forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var rect = el.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--mx', x + '%');
        el.style.setProperty('--my', y + '%');
      });
    });
  }

  /* ---- 3D tilt on tech-cards only ---- */
  if(!reduced){
    var tiltEls = document.querySelectorAll('.tech-card');
    tiltEls.forEach(function(el){
      el.addEventListener('mouseenter', function(){
        el.classList.add('tilting');
      });
      el.addEventListener('mousemove', function(e){
        var rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var maxTilt = 7;
        var rotateY = (px - 0.5) * maxTilt;
        var rotateX = (0.5 - py) * maxTilt;
        el.style.transform = 'perspective(700px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px) scale(1.015)';
      });
      el.addEventListener('mouseleave', function(){
        el.classList.remove('tilting');
        el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
      });
    });
  }

  /* ---- number count-up on scroll into view ---- */
  var countEls = document.querySelectorAll('.count-up');
  if(countEls.length){
    function animateCount(el){
      var text = el.textContent.trim();
      var match = text.match(/^([\d.]+)(.*)$/);
      if(!match) return;
      var target = parseFloat(match[1]);
      var suffix = match[2];
      var decimals = (match[1].split('.')[1] || '').length;
      if(reduced || isNaN(target)){ return; }
      var duration = 1200;
      var startTime = null;
      function step(ts){
        if(startTime === null) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = target * eased;
        el.textContent = current.toFixed(decimals) + suffix;
        if(progress < 1) window.requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      window.requestAnimationFrame(step);
    }
    if('IntersectionObserver' in window && !reduced){
      var countIO = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            animateCount(entry.target);
            countIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      countEls.forEach(function(el){ countIO.observe(el); });
    }
  }
})();
