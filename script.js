(function () {
  var S = window.SITE || {};
  var NB = ' ';
  var $ = function (id) { return document.getElementById(id); };

  // ——— Remplissage des informations communes depuis config.js ———
  Array.prototype.forEach.call(document.querySelectorAll('[data-site]'), function (el) {
    var v = S[el.getAttribute('data-site')];
    if (v) el.textContent = v;
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-prix]'), function (el) {
    var v = S.tarifs && S.tarifs[el.getAttribute('data-prix')];
    if (v != null) el.textContent = v + NB + '€';
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-tel-href]'), function (a) {
    if (S.telLien) a.href = 'tel:' + S.telLien;
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-mail-href]'), function (a) {
    if (S.email) { a.href = 'mailto:' + S.email; a.textContent = S.email; }
  });

  // ——— Formulaire de réservation ———
  var form = $('resa');
  if (!form) return;
  var root = form.getAttribute('data-root') || '';
  var recap = $('recap'), laterBoxes = [$('f-date'), $('f-time')], err = $('err');
  var date = $('date'), time = $('time'), dest = $('arrivee'), hint = $('hint');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var ymd = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  var hm = function (d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  var tarifs = S.tarifs || {};

  // Date et heure par défaut : dans 45 minutes, au quart d'heure suivant
  var d0 = new Date(Date.now() + 45 * 60000);
  d0.setMinutes(Math.ceil(d0.getMinutes() / 15) * 15, 0, 0);
  date.min = ymd(new Date());
  date.value = ymd(d0);
  time.value = hm(d0);

  // Destination préremplie sur les pages de campagne
  if (form.getAttribute('data-dest')) dest.value = form.getAttribute('data-dest');

  function mode() { return form.elements['quand'].value; }

  function checkTime() {
    time.setCustomValidity('');
    if (mode() !== 'later' || !date.value || !time.value) return;
    var a = date.value.split('-').map(Number), b = time.value.split(':').map(Number);
    if (new Date(a[0], a[1] - 1, a[2], b[0], b[1]) < new Date()) {
      time.setCustomValidity("Choisissez une heure à venir.");
    }
  }

  function syncMode() {
    var isLater = mode() === 'later';
    laterBoxes.forEach(function (b) { b.hidden = !isLater; });
    date.disabled = !isLater;
    time.disabled = !isLater;
    checkTime();
  }

  Array.prototype.forEach.call(form.querySelectorAll('input[name="quand"]'), function (r) {
    r.addEventListener('change', syncMode);
  });
  date.addEventListener('input', checkTime);
  time.addEventListener('input', checkTime);
  syncMode();

  function eur(k) { return tarifs[k] + NB + '€'; }

  function updateHint() {
    var v = dest.value, t = '';
    if (/roissy|cdg|charles.?de.?gaulle/i.test(v)) {
      t = 'Forfait Roissy-CDG : ' + eur('cdgDroite') + ' depuis la rive droite, ' + eur('cdgGauche') + ' depuis la rive gauche.';
    } else if (/orly/i.test(v)) {
      t = 'Forfait Orly : ' + eur('orlyGauche') + ' depuis la rive gauche, ' + eur('orlyDroite') + ' depuis la rive droite.';
    } else if (v.trim()) {
      t = 'Course au compteur : nous vous donnons une estimation lors de la confirmation.';
    }
    hint.textContent = t;
    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-dest') === v)); });
  }
  dest.addEventListener('input', updateHint);
  chips.forEach(function (c) {
    c.addEventListener('click', function () { dest.value = c.getAttribute('data-dest'); updateHint(); });
  });
  updateHint();

  function selText(id) { var s = $(id); return s.options[s.selectedIndex].text; }

  function whenText() {
    if (mode() !== 'later') return 'Dès que possible';
    var a = date.value.split('-').map(Number);
    return new Date(a[0], a[1] - 1, a[2]).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
      + ' à ' + time.value.replace(':', 'h');
  }

  function collect() {
    var p = {
      quand: whenText(),
      depart: $('depart').value.trim(),
      arrivee: dest.value.trim(),
      passagers: selText('pax'),
      bagages: selText('bag'),
      nom: $('nom').value.trim(),
      telephone: $('tel').value.trim(),
      email: $('mail').value.trim(),
      remarques: $('note').value.trim(),
      page: location.pathname
    };
    // Suivi des campagnes (Google Ads et autres)
    var q = new URLSearchParams(location.search);
    ['gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (k) {
      if (q.get(k)) p[k] = q.get(k);
    });
    return p;
  }

  function showRecap(p) {
    var rows = [['Quand', p.quand], ['Départ', p.depart], ['Arrivée', p.arrivee], ['Passagers', p.passagers],
                ['Bagages', p.bagages], ['Nom', p.nom], ['Téléphone', p.telephone]];
    if (p.email) rows.push(['E-mail', p.email]);
    if (p.remarques) rows.push(['Remarques', p.remarques]);
    var list = $('recap-list');
    list.textContent = '';
    rows.forEach(function (r) {
      var dt = document.createElement('dt'); dt.textContent = r[0];
      var dd = document.createElement('dd'); dd.textContent = r[1];
      list.appendChild(dt); list.appendChild(dd);
    });
    form.hidden = true;
    document.querySelector('.card-sub').hidden = true;
    recap.hidden = false;
    recap.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    checkTime();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    err.hidden = true;

    // Champ piège anti-spam : un robot le remplit, une personne ne le voit pas
    if ($('website').value) { location.href = root + 'merci/'; return; }

    var p = collect();
    if (!S.formEndpoint) { showRecap(p); return; }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Envoi en cours…';
    fetch(S.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(p)
    }).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      location.href = root + 'merci/';
    }).catch(function () {
      btn.disabled = false;
      btn.textContent = 'Demander ma réservation';
      err.textContent = "L'envoi a échoué. Réessayez, ou appelez-nous au " + (S.tel || '') + '.';
      err.hidden = false;
    });
  });

  $('edit').addEventListener('click', function () {
    recap.hidden = true;
    form.hidden = false;
    document.querySelector('.card-sub').hidden = false;
    $('depart').focus();
  });
})();
