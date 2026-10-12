/* =========================================================================
   フォースター不動産 共通スクリプト（main.js）
   -------------------------------------------------------------------------
   今のところ「スマホのメニュー開閉」だけを担当しています。
   触らなくても大丈夫です。
   ========================================================================= */
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  var header = document.querySelector('.header-inner') || document.querySelector('.site-header');
  if (toggle && nav && header) {
    // ハンバーガーで開くドロップダウンを、既存メニューから自動生成（リンクの二重管理を防ぐ）
    var drawer = document.createElement('div');
    drawer.className = 'nav-drawer';
    drawer.innerHTML = '<ul>' + nav.querySelector('ul').innerHTML + '</ul>';
    header.appendChild(drawer);

    function closeMenu() {
      drawer.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = drawer.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // メニュー内のリンクを押したら閉じる
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    // メニューの外側をクリック／Escで閉じる
    document.addEventListener('click', function (e) {
      if (!drawer.contains(e.target) && e.target !== toggle) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* --- ヒーローの写真スライダー（写真が2枚以上のとき自動でフェード切り替え）---
     ※写真が1枚のときは何も起きません。触らなくて大丈夫です。*/
  var slider = document.querySelector('.hero-slider');
  if (slider) {
    var slides = slider.querySelectorAll('.hero-slide');
    if (slides.length > 1) {
      var current = 0;
      // 切り替え用のドットを作成
      var dots = document.createElement('div');
      dots.className = 'hero-dots';
      dots.style.display = 'flex';
      slides.forEach(function (s, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', (i + 1) + '枚目の写真');
        if (i === 0) b.classList.add('is-active');
        b.addEventListener('click', function () { show(i); reset(); });
        dots.appendChild(b);
      });
      slider.appendChild(dots);
      var dotBtns = dots.querySelectorAll('button');

      function show(i) {
        slides[current].classList.remove('is-active');
        dotBtns[current].classList.remove('is-active');
        current = i;
        slides[current].classList.add('is-active');
        dotBtns[current].classList.add('is-active');
      }
      function next() { show((current + 1) % slides.length); }

      var timer = setInterval(next, 5000);
      function reset() { clearInterval(timer); timer = setInterval(next, 5000); }
    }
  }

  /* --- スクロールで各ブロックがふわっと浮き上がる演出 ---
     ※対応していないブラウザでは何も起きず、普通に表示されます（触らなくてOK）*/
  var targets = document.querySelectorAll(
    '.section-head, .concept, .service-list, .service-cards, .reason, .reason-row-body, .flow, .message-box, .area-tags, .stats .cols, .prop-grid'
  );
  // 中の文字（見出し・本文）を1行ずつ順番に出したいブロック
  var staggerSel = '.section-head, .concept, .reason-row-body, .message-box';
  if ('IntersectionObserver' in window && targets.length) {
    document.documentElement.classList.add('reveal-on');
    targets.forEach(function (el) {
      el.classList.add('reveal');
      if (el.matches(staggerSel)) el.classList.add('stagger');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }
});
