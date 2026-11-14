/* Reports a GoatCounter event for each click on a link that leaves the page.
   Event path: "click: <host><path>" of the destination, read at click time
   (org.js can change a release link after load). In-page anchors are ignored. */
(function () {
  'use strict';

  function report(e) {
    if (e.type === 'auxclick' && e.button !== 1) return; // middle button only
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.getAttribute('href').charAt(0) === '#') return;
    const gc = window.goatcounter;
    if (!gc || !gc.count) return; // count.js blocked or not loaded yet
    const dest = a.host + a.pathname.replace(/\/$/, '');
    gc.count({ path: 'click: ' + dest, title: a.href, event: true });
  }

  document.addEventListener('click', report);
  document.addEventListener('auxclick', report);
})();
