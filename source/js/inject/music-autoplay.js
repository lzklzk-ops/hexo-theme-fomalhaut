/* ============================================================================
 * music-autoplay.js —— 八音盒进入页面后自动播放
 * ----------------------------------------------------------------------------
 * APlayer/Meting 已通过 data-autoplay=true 请求自动播放；浏览器若拦截有声
 * 自动播放，本文件会在访客第一次点击、触摸或按键后再次尝试，不影响其他页面。
 * 同时监听 pjax:complete，确保从站内其他页面进入八音盒时也能启动。
 * ========================================================================== */
(function () {
  'use strict';

  var selector = '#aplayer-tao-playlist';
  var retryTimers = [];
  var gestureBound = false;
  var observedAudio = null;

  function getPlayer() {
    var el = document.querySelector(selector);
    if (!el) return null;
    if (el.aplayer && typeof el.aplayer.play === 'function') return el.aplayer;

    var list = window.aplayers || [];
    for (var i = 0; i < list.length; i++) {
      var ap = list[i];
      if (ap && ap.options && ap.options.container === el && typeof ap.play === 'function') return ap;
    }
    return null;
  }

  function tryPlay() {
    var ap = getPlayer();
    if (!ap) return false;
    var audio = ap.audio;
    if (!audio) return false;
    observeAudio(audio);
    if (!audio.paused) {
      clearRetries();
      unbindGesture();
      return true;
    }
    try {
      var result = ap.play();
      if (result && typeof result.then === 'function') {
        result.then(function () {
          clearRetries();
          unbindGesture();
        }).catch(function () {});
      }
    } catch (e) {}
    return !audio.paused;
  }

  function observeAudio(audio) {
    if (observedAudio === audio) return;
    observedAudio = audio;
    audio.addEventListener('canplay', tryPlay, { once: true });
    audio.addEventListener('loadeddata', tryPlay, { once: true });
  }

  function unbindGesture() {
    if (!gestureBound) return;
    gestureBound = false;
    document.removeEventListener('pointerdown', onGesture, true);
    document.removeEventListener('touchstart', onGesture, true);
    document.removeEventListener('keydown', onGesture, true);
  }

  function onGesture() {
    if (tryPlay()) unbindGesture();
  }

  function bindGesture() {
    if (gestureBound || !document.querySelector(selector)) return;
    gestureBound = true;
    document.addEventListener('pointerdown', onGesture, true);
    document.addEventListener('touchstart', onGesture, true);
    document.addEventListener('keydown', onGesture, true);
  }

  function clearRetries() {
    for (var i = 0; i < retryTimers.length; i++) clearTimeout(retryTimers[i]);
    retryTimers = [];
  }

  function arm() {
    clearRetries();
    observedAudio = null;
    if (!document.querySelector(selector)) {
      unbindGesture();
      return;
    }
    if (typeof window.loadMeting === 'function') {
      try { window.loadMeting(); } catch (e) {}
    }
    bindGesture();
    [0, 250, 800, 1600, 3000, 6000, 10000, 15000].forEach(function (delay) {
      retryTimers.push(setTimeout(function () {
        if (tryPlay()) unbindGesture();
      }, delay));
    });
  }

  document.addEventListener('pjax:complete', arm);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arm, { once: true });
  else arm();
})();
