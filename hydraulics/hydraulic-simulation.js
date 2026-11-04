/* Hydraulic Lift & Braking System — standalone preview logic.
   Vanilla JS, no dependencies. Physics (pure) is separate from rendering. */
(function () {
  'use strict';

  /* ---------------- utils ---------------- */
  var G = 9.81;
  function num(v, fb) { v = parseFloat(v); return isFinite(v) ? v : fb; }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function fmtInt(v) { return Math.round(v).toLocaleString('en-US'); }
  function fmtN(v) { return Math.abs(v) >= 1000 ? (v / 1000).toFixed(2) + ' kN' : fmtInt(v) + ' N'; }
  function fmtPa(v) { return Math.abs(v) >= 1000 ? Math.round(v / 1000).toLocaleString('en-US') + ' kPa' : Math.round(v) + ' Pa'; }
  function $(id) { return document.getElementById(id); }
  function setText(id, s) { var el = $(id); if (el) el.textContent = s; }

  /* ---------------- pure physics (no DOM) ---------------- */
  function cm2ToM2(a) { return a / 10000; }
  function calcLift(F1, A1, A2, loadKg) {
    A1 = Math.max(1e-9, A1); A2 = Math.max(1e-9, A2);
    var a1 = cm2ToM2(A1), a2 = cm2ToM2(A2);
    var P = F1 / a1;
    var F2 = P * a2;
    var MA = A2 / A1;
    var need = loadKg * G;
    var d1 = 0.20, d2 = d1 * (A1 / A2);
    var W = F1 * d1;
    return { P: P, F2: F2, MA: MA, need: need, margin: F2 - need,
             ok: F2 >= need, d1: d1, d2: d2, W: W, W2: F2 * d2 };
  }
  function calcBrake(Fp, R, Am, Aw) {
    Am = Math.max(1e-9, Am); Aw = Math.max(1e-9, Aw);
    var Fm = Fp * R;
    var P = Fm / cm2ToM2(Am);
    var Fw = P * cm2ToM2(Aw);
    return { Fm: Fm, P: P, Fw: Fw, Ftot: 2 * Fw, mult: R * (Aw / Am) };
  }

  /* ---------------- state ---------------- */
  var S = {
    tab: 'lift', playing: true, speed: 1,
    lift: { F1: 500, A1: 20, A2: 250, load: 500, press: 0, target: 0 },
    brake: { Fp: 150, R: 4, Am: 5, Aw: 30, press: 0, target: 0,
             omega: 12, angle: 0, flow: 0 }
  };
  var BRAKE_MU = 0.4, BRAKE_R = 0.14, BRAKE_I = 30; // illustrative wheel constants

  /* ---------------- SVG helpers ---------------- */
  var SVGNS = 'http://www.w3.org/2000/svg';
  function sEl(tag, attrs, parent) {
    var el = document.createElementNS(SVGNS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    parent.appendChild(el);
    return el;
  }
  function niceCeil(v) {
    if (!(v > 0) || !isFinite(v)) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(v)));
    var n = v / p;
    var m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
    return m * p;
  }
  function chartFrame(svg, xmax, ymax, xUnit, yUnit) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var L = 46, T = 12, W = 340 - L - 10, H = 190 - T - 30;
    var X = function (v) { return L + (v / xmax) * W; };
    var Y = function (v) { return T + H - (v / ymax) * H; };
    sEl('line', { x1: L, y1: T, x2: L, y2: T + H, stroke: '#94a3b8', 'stroke-width': 1.5 }, svg);
    sEl('line', { x1: L, y1: T + H, x2: L + W, y2: T + H, stroke: '#94a3b8', 'stroke-width': 1.5 }, svg);
    for (var i = 0; i <= 4; i++) {
      var xv = xmax * i / 4, yv = ymax * i / 4;
      sEl('line', { x1: X(xv), y1: T + H, x2: X(xv), y2: T + H + 4, stroke: '#94a3b8' }, svg);
      var tx = sEl('text', { x: X(xv), y: T + H + 16, 'text-anchor': 'middle', 'font-size': 9, fill: '#5b6b7d' }, svg);
      tx.textContent = (xv >= 1000 ? (xv / 1000) + 'k' : Math.round(xv * 100) / 100) + xUnit;
      sEl('line', { x1: L - 4, y1: Y(yv), x2: L, y2: Y(yv), stroke: '#94a3b8' }, svg);
      var ty = sEl('text', { x: L - 6, y: Y(yv) + 3, 'text-anchor': 'end', 'font-size': 9, fill: '#5b6b7d' }, svg);
      ty.textContent = (yv >= 1000 ? (yv / 1000) + 'k' : Math.round(yv * 100) / 100) + yUnit;
    }
    return { X: X, Y: Y };
  }

  /* ---------------- LIFT ---------------- */
  var LCX1 = 145, LCX2 = 468;
  function liftGeom() {
    var A1 = S.lift.A1, A2 = S.lift.A2;
    var w1 = clamp(30 * Math.sqrt(A1 / 20), 18, 80);
    var w2 = clamp(50 * Math.sqrt(A2 / 250), 30, 170);
    return { w1: w1, w2: w2 };
  }
  function liftVals() {
    var L = S.lift;
    return calcLift(L.F1, L.A1, L.A2, L.load);
  }
  function renderLiftStatics() {
    var L = S.lift, V = liftVals(), g = liftGeom();
    // walls + pistons follow area
    $('hs-wall-s1l').setAttribute('x', LCX1 - g.w1 / 2 - 8);
    $('hs-wall-s1r').setAttribute('x', LCX1 + g.w1 / 2);
    $('hs-wall-s2l').setAttribute('x', LCX2 - g.w2 / 2 - 8);
    $('hs-wall-s2r').setAttribute('x', LCX2 + g.w2 / 2);
    var p1 = $('hs-p1');
    p1.setAttribute('x', LCX1 - (g.w1 - 8) / 2); p1.setAttribute('width', g.w1 - 8);
    var p2 = $('hs-p2');
    p2.setAttribute('x', LCX2 - (g.w2 - 8) / 2); p2.setAttribute('width', g.w2 - 8);
    setText('hs-a1-label', 'A1 = ' + L.A1 + ' cm²');
    setText('hs-a2-label', 'A2 = ' + L.A2 + ' cm²');
    setText('hs-load-label', L.load + ' kg');
    // theory readouts
    setText('hs-r-pin', fmtPa(V.P) + ' (at full press)');
    setText('hs-r-pout', fmtPa(V.P) + ' (same fluid)');
    setText('hs-r-f2', fmtN(V.F2));
    setText('hs-r-ma', '×' + (V.MA >= 100 ? Math.round(V.MA) : V.MA.toFixed(1)));
    setText('hs-r-w', fmtN(V.need));
    setText('hs-r-margin', (V.margin >= 0 ? '+' : '−') + fmtN(Math.abs(V.margin)).replace('−', ''));
    setText('hs-r-d1', (V.d1 * 100).toFixed(1) + ' cm');
    setText('hs-r-d2', (V.d2 * 100).toFixed(2) + ' cm');
    // arrows + labels
    var f1len = 30 + 60 * (L.F1 / 1000);
    setText('hs-f1-label', 'F1 = ' + fmtInt(L.F1) + ' N');
    $('hs-f1-arrow').setAttribute('x1', LCX1); $('hs-f1-arrow').setAttribute('x2', LCX1);
    var outLen = 30 + 50 * Math.min(2.5, Math.cbrt(V.MA));
    setText('hs-f2-label', 'F2 = ' + fmtN(V.F2));
    // observation
    $('hs-obs-lift').textContent =
      'A2/A1 = ' + V.MA.toFixed(1) + ' → ' + fmtInt(L.F1) + ' N supports ' + fmtN(V.F2) +
      ' (≈' + fmtInt(V.F2 / G) + ' kg). Per 20 cm press the load rises ' + (V.d2 * 100).toFixed(2) +
      ' cm: force ×' + V.MA.toFixed(1) + ', distance ÷' + V.MA.toFixed(1) +
      ' — work F·d = ' + V.W.toFixed(0) + ' J on both sides. ' +
      (V.ok ? ('The ' + L.load + ' kg load (' + fmtN(V.need) + ') lifts with +' + fmtN(V.margin) + ' to spare.')
            : ('The ' + L.load + ' kg load needs ' + fmtN(V.need) + ' — short by ' + fmtN(-V.margin) + '. Raise F1 or A2/A1, or lighten the load.'));
    // calculation steps
    if ($('hs-show-calc-lift').checked) {
      $('hs-calc-lift').textContent =
        'A1 = ' + L.A1 + ' cm² = ' + (L.A1 / 10000).toFixed(6) + ' m²\n' +
        'A2 = ' + L.A2 + ' cm² = ' + (L.A2 / 10000).toFixed(6) + ' m²\n' +
        'P = F1/A1 = ' + L.F1 + '/' + (L.A1 / 10000).toFixed(6) + ' = ' + Math.round(V.P).toLocaleString('en-US') + ' Pa\n' +
        'F2 = P×A2 = ' + fmtN(V.F2) + '\n' +
        'Need = m·g = ' + L.load + '×9.81 = ' + fmtN(V.need) + (V.ok ? '  ✓ lifts' : '  ✗ will NOT lift') + '\n' +
        'd2 = d1×A1/A2 = 0.20×' + (L.A1 / L.A2).toFixed(4) + ' = ' + V.d2.toFixed(4) + ' m';
      $('hs-calc-lift').hidden = false;
    } else { $('hs-calc-lift').hidden = true; }
    renderForceChart(V);
    return V;
  }
  function renderLiftFrame(V) {
    var g = liftGeom(), press = S.lift.press;
    var y1 = 210 + press * 90;
    var outPx = Math.min(130, Math.max(0.5, 90 * (S.lift.A1 / Math.max(1e-9, S.lift.A2))));
    var dy = press * outPx, y2 = 200 - dy;
    var p1 = $('hs-p1'); p1.setAttribute('y', y1);
    var p2 = $('hs-p2'); p2.setAttribute('y', y2);
    $('hs-plat').setAttribute('y', y2 - 10);
    var crate = $('hs-crate');
    crate.setAttribute('y', y2 - 10 - 64);
    $('hs-crate-x1').setAttribute('y1', y2 - 10 - 64); $('hs-crate-x1').setAttribute('y2', y2 - 10);
    $('hs-crate-x2').setAttribute('y1', y2 - 10 - 64); $('hs-crate-x2').setAttribute('y2', y2 - 10);
    setText('hs-load-label', '');
    var lbl = $('hs-load-label');
    lbl.setAttribute('y', y2 - 10 - 28);
    lbl.textContent = S.lift.load + ' kg';
    // arrows follow pistons
    var f1 = $('hs-f1-arrow');
    var f1len = 30 + 60 * (S.lift.F1 / 1000);
    f1.setAttribute('y2', y1 - 18); f1.setAttribute('y1', y1 - 18 - f1len);
    setText('hs-f1-label', '');
    var fl = $('hs-f1-label');
    fl.setAttribute('y', y1 - 18 - f1len - 8);
    fl.textContent = 'F1 = ' + fmtInt(S.lift.F1) + ' N';
    var outLen = 30 + 50 * Math.min(2.5, Math.cbrt(V.MA));
    var f2 = $('hs-f2-arrow');
    f2.setAttribute('y2', y2 - 12); f2.setAttribute('y1', y2 - 12 - outLen);
    var f2l = $('hs-f2-label');
    f2l.setAttribute('y', y2 - 12 - outLen - 8);
    // pressure + pulses live
    setText('hs-p-label', 'P = ' + fmtPa(V.P * press) + (press < 0.02 ? ' (released)' : ''));
    $('hs-pulse').setAttribute('opacity', press > 0.02 ? Math.min(1, press + 0.25) : 0);
    setText('hs-d2-label', 'd2 = ' + (V.d2 * 100 * press).toFixed(2) + ' cm so far');
    // status
    var st = $('hs-lift-status');
    if (!V.ok) {
      st.className = 'hs-status bad';
      st.textContent = 'Will NOT lift: output ' + fmtN(V.F2) + ' < needed ' + fmtN(V.need) +
        ' (short by ' + fmtN(-V.margin) + '). Increase F1 or the area ratio, or reduce the load.';
    } else if (press > 0.02 && press < 0.999) {
      st.className = 'hs-status ok';
      st.textContent = 'Lifting… pressure ' + fmtPa(V.P * press) + ', load rising ' + (V.d2 * 100 * press).toFixed(2) + ' cm so far.';
    } else if (press >= 0.999) {
      st.className = 'hs-status ok';
      st.textContent = 'Load raised ' + (V.d2 * 100).toFixed(2) + ' cm. Full press delivered ' + fmtN(V.F2) + ' against ' + fmtN(V.need) + ' needed.';
    } else {
      st.className = 'hs-status idle';
      st.textContent = 'Ready: ' + fmtN(V.F2) + ' available vs ' + fmtN(V.need) + ' needed. Press “Apply force”.';
    }
  }
  function renderForceChart(V) {
    var svg = $('hs-chart-force');
    var xmax = 1000, ymax = niceCeil(V.MA * 1000);
    var c = chartFrame(svg, xmax, ymax, ' N', ' N');
    sEl('line', { x1: c.X(0), y1: c.Y(0), x2: c.X(xmax), y2: c.Y(V.MA * xmax),
      stroke: '#0b6bcb', 'stroke-width': 2.5 }, svg);
    var px = c.X(S.lift.F1), py = c.Y(V.MA * S.lift.F1);
    sEl('circle', { cx: px, cy: py, r: 5, fill: '#b45309', stroke: '#fff', 'stroke-width': 1.5 }, svg);
    var t = sEl('text', { x: Math.min(px + 8, 250), y: Math.max(py - 8, 20), 'font-size': 10, fill: '#92400e' }, svg);
    t.textContent = 'F2 = ' + fmtN(V.MA * S.lift.F1);
    var cap = sEl('text', { x: 46, y: 184, 'font-size': 10, fill: '#5b6b7d' }, svg);
    cap.textContent = 'Slope = A2/A1 = ×' + V.MA.toFixed(1) + '  ·  input F1 → output F2';
  }

  /* ---------------- BRAKE ---------------- */
  function brakeVals() {
    var B = S.brake;
    return calcBrake(B.Fp, B.R, B.Am, B.Aw);
  }
  function renderBrakeStatics() {
    var B = S.brake, V = brakeVals();
    setText('hs-pedal-r', B.R);
    setText('hs-master-a', 'Am = ' + B.Am + ' cm²');
    setText('hs-r-fm', fmtN(V.Fm));
    setText('hs-r-bp', fmtPa(V.P) + ' (pedal down)');
    setText('hs-r-fw', fmtN(V.Fw) + ' / wheel');
    setText('hs-r-ftot', fmtN(V.Ftot) + ' total');
    setText('hs-r-bma', '×' + (V.mult >= 100 ? Math.round(V.mult) : V.mult.toFixed(1)));
    $('hs-obs-brake').textContent =
      'Foot ' + B.Fp + ' N × pedal ' + B.R + ' → master ' + fmtN(V.Fm) + ' on ' + B.Am +
      ' cm² gives ' + fmtPa(V.P) + ' everywhere. Each ' + B.Aw + ' cm² wheel piston clamps with ' +
      fmtN(V.Fw) + ' (' + fmtN(V.Ftot) + ' both wheels). Smaller master or bigger wheel pistons raise the force — at the cost of longer pedal travel.';
    if ($('hs-show-calc-brake').checked) {
      $('hs-calc-brake').textContent =
        'Fm = Fp×R = ' + B.Fp + '×' + B.R + ' = ' + fmtInt(V.Fm) + ' N\n' +
        'Am = ' + B.Am + ' cm² = ' + (B.Am / 10000).toFixed(6) + ' m²\n' +
        'P = Fm/Am = ' + Math.round(V.P).toLocaleString('en-US') + ' Pa\n' +
        'Fw = P×Aw = ' + fmtN(V.Fw) + ' per wheel → ' + fmtN(V.Ftot) + ' total (2 wheels share the pressure)';
      $('hs-calc-brake').hidden = false;
    } else { $('hs-calc-brake').hidden = true; }
    renderBrakeChart(V);
  }
  function renderBrakeFrame(V) {
    var B = S.brake, press = B.press;
    $('hs-pedal').setAttribute('transform', 'rotate(' + (-press * 20) + ' 70 200)');
    var mpx = 196 + press * 80;
    $('hs-mp').setAttribute('x', mpx);
    $('hs-rod').setAttribute('x2', mpx);
    // pads close with press
    $('hs-pad-fl').setAttribute('x', 424 + press * 10);
    $('hs-pad-fr').setAttribute('x', 506 - press * 10);
    $('hs-pad-rl').setAttribute('x', 551 + press * 8);
    $('hs-pad-rr').setAttribute('x', 611 - press * 8);
    $('hs-clamp').setAttribute('opacity', press > 0.05 ? 1 : 0);
    $('hs-flow').setAttribute('opacity', press > 0.02 ? 0.9 : 0);
    if (press > 0.02) {
      var path = $('hs-line-f'), len = path.getTotalLength();
      for (var i = 0; i < 5; i++) {
        var pt = path.getPointAtLength(((B.flowT + i / 5) % 1) * len);
        var c = $('hs-fd' + i);
        c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y);
      }
    }
    var deg = (B.angle * 180 / Math.PI) % 360;
    $('hs-spokes-f').setAttribute('transform', 'rotate(' + deg + ' 470 250)');
    $('hs-spokes-r').setAttribute('transform', 'rotate(' + deg + ' 585 318)');
    // intensity = clamp total vs 20 kN reference
    var frac = clamp(V.Ftot * press / 20000, 0, 1);
    var bar = $('hs-intensity');
    bar.setAttribute('width', 300 * frac);
    bar.setAttribute('fill', frac < 0.4 ? '#15803d' : frac < 0.75 ? '#d97706' : '#b91c1c');
    setText('hs-intensity-label', press < 0.02 ? 'released' :
      (frac < 0.4 ? 'Low' : frac < 0.75 ? 'Moderate' : frac < 0.95 ? 'High' : 'Extreme') +
      ' — ' + fmtN(V.Ftot * press) + ' clamp');
    var rpm = B.omega * 60 / (Math.PI * 2);
    setText('hs-r-rpm', rpm < 0.5 ? '0 rpm (stopped)' : rpm.toFixed(0) + ' rpm');
    var st = $('hs-brake-status');
    if (press < 0.02) {
      st.className = 'hs-status idle';
      st.textContent = B.omega < 0.5 ? 'Wheel parked. Press the pedal to clamp the discs.' : 'Coasting at ' + rpm.toFixed(0) + ' rpm — press the pedal to brake.';
    } else if (B.omega < 0.5) {
      st.className = 'hs-status ok';
      st.textContent = 'Wheel stopped. Holding ' + fmtN(V.Ftot * press) + ' of clamp force on the discs.';
    } else {
      st.className = 'hs-status ok';
      st.textContent = 'Braking… ' + fmtN(V.Ftot * press) + ' clamp, wheel at ' + rpm.toFixed(0) + ' rpm and falling.';
    }
  }
  function renderBrakeChart(V) {
    var svg = $('hs-chart-brake');
    var xmax = 400, ymax = niceCeil(V.mult * 400);
    var c = chartFrame(svg, xmax, ymax, ' N', ' N');
    sEl('line', { x1: c.X(0), y1: c.Y(0), x2: c.X(xmax), y2: c.Y(V.mult * xmax),
      stroke: '#b91c1c', 'stroke-width': 2.5 }, svg);
    var px = c.X(S.brake.Fp), py = c.Y(V.mult * S.brake.Fp);
    sEl('circle', { cx: px, cy: py, r: 5, fill: '#b91c1c', stroke: '#fff', 'stroke-width': 1.5 }, svg);
    var t = sEl('text', { x: Math.min(px + 8, 220), y: Math.max(py - 8, 20), 'font-size': 10, fill: '#b91c1c' }, svg);
    t.textContent = 'Fw = ' + fmtN(V.mult * S.brake.Fp);
    var cap = sEl('text', { x: 46, y: 184, 'font-size': 10, fill: '#5b6b7d' }, svg);
    cap.textContent = 'Slope = R·Aw/Am = ×' + V.mult.toFixed(1) + '  ·  pedal Fp → clamp Fw';
  }

  /* ---------------- displacement bars (lift) ---------------- */
  function renderDispBars() {
    // drawn inside force chart card? separate small svg not present — fold into force card caption area is enough.
  }

  /* ---------------- main loop ---------------- */
  var last = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (S.playing) {
      var L = S.lift, Br = S.brake;
      // lift press toward target
      if (L.target > L.press) L.press = Math.min(L.target, L.press + dt * S.speed * 0.9);
      else if (L.target < L.press) L.press = Math.max(L.target, L.press - dt * S.speed * 1.4);
      // brake press toward target
      if (Br.target > Br.press) Br.press = Math.min(Br.target, Br.press + dt * S.speed * 1.6);
      else if (Br.target < Br.press) Br.press = Math.max(Br.target, Br.press - dt * S.speed * 2.2);
      // wheel slowdown while clamped (illustrative constants, labelled in footer)
      if (Br.press > 0.02 && Br.omega > 0) {
        var Vb = brakeVals();
        var alpha = (Vb.Ftot * Br.press * BRAKE_MU * BRAKE_R) / BRAKE_I;
        Br.omega = Math.max(0, Br.omega - alpha * dt * S.speed);
      }
      Br.angle = (Br.angle + Br.omega * dt * S.speed) % (Math.PI * 2);
      Br.flowT = ((Br.flowT || 0) + dt * S.speed * 0.45) % 1;
    }
    if (S.tab === 'lift') renderLiftFrame(liftVals());
    else renderBrakeFrame(brakeVals());
    requestAnimationFrame(frame);
  }

  /* ---------------- inputs ---------------- */
  function bindSlider(id, fn) {
    var el = $(id);
    el.addEventListener('input', function () {
      var v = num(el.value, null);
      if (v === null) return;
      fn(clamp(v, num(el.min, -1e9), num(el.max, 1e9)));
      refreshStatics();
    });
  }
  function refreshStatics() {
    if (S.tab === 'lift') { renderLiftStatics(); renderLiftFrame(liftVals()); }
    else { renderBrakeStatics(); renderBrakeFrame(brakeVals()); }
  }
  function switchTab(tab) {
    S.tab = tab;
    $('hs-tab-lift').setAttribute('aria-selected', tab === 'lift');
    $('hs-tab-brake').setAttribute('aria-selected', tab === 'brake');
    $('hs-panel-lift').hidden = tab !== 'lift';
    $('hs-panel-brake').hidden = tab !== 'brake';
    refreshStatics();
  }

  /* ---------------- init ---------------- */
  function init() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      S.speed = 0.5; $('hs-speed').value = '0.5';
    }
    $('hs-tab-lift').addEventListener('click', function () { switchTab('lift'); });
    $('hs-tab-brake').addEventListener('click', function () { switchTab('brake'); });
    $('hs-play').addEventListener('click', function () {
      S.playing = !S.playing;
      this.textContent = S.playing ? 'Pause' : 'Play';
      this.setAttribute('aria-pressed', S.playing);
    });
    $('hs-speed').addEventListener('change', function () { S.speed = num(this.value, 1); });
    // lift sliders
    bindSlider('hs-in-f1', function (v) { S.lift.F1 = v; setText('hs-out-f1', fmtInt(v) + ' N'); });
    bindSlider('hs-in-a1', function (v) { S.lift.A1 = v; setText('hs-out-a1', v + ' cm²'); });
    bindSlider('hs-in-a2', function (v) { S.lift.A2 = v; setText('hs-out-a2', v + ' cm²'); });
    bindSlider('hs-in-load', function (v) { S.lift.load = v; setText('hs-out-load', fmtInt(v) + ' kg'); });
    $('hs-lift-apply').addEventListener('click', function () {
      var V = liftVals();
      if (!V.ok) { S.lift.target = 0; renderLiftFrame(V); return; }
      S.lift.target = 1;
    });
    $('hs-lift-release').addEventListener('click', function () { S.lift.target = 0; });
    $('hs-lift-reset').addEventListener('click', function () {
      S.lift.press = 0; S.lift.target = 0; renderLiftFrame(liftVals());
    });
    // brake sliders
    bindSlider('hs-in-fp', function (v) { S.brake.Fp = v; setText('hs-out-fp', fmtInt(v) + ' N'); });
    bindSlider('hs-in-pr', function (v) { S.brake.R = v; setText('hs-out-pr', v.toFixed(1) + ' : 1'); });
    bindSlider('hs-in-am', function (v) { S.brake.Am = v; setText('hs-out-am', v + ' cm²'); });
    bindSlider('hs-in-aw', function (v) { S.brake.Aw = v; setText('hs-out-aw', v + ' cm²'); });
    $('hs-brake-press').addEventListener('click', function () { S.brake.target = 1; });
    $('hs-brake-release').addEventListener('click', function () { S.brake.target = 0; });
    $('hs-brake-reset').addEventListener('click', function () {
      var B = S.brake;
      B.press = 0; B.target = 0; B.omega = 12; B.angle = 0;
      renderBrakeFrame(brakeVals());
    });
    // Q&A toggles
    [['hs-q-lift-btn', 'hs-q-lift'], ['hs-q-brake-btn', 'hs-q-brake']].forEach(function (pair) {
      $(pair[0]).addEventListener('click', function () {
        var ans = $(pair[1]), open = ans.hidden;
        ans.hidden = !open;
        this.textContent = open ? 'Hide answer' : 'Show answer';
        this.setAttribute('aria-expanded', open);
      });
    });
    // calc toggles
    $('hs-show-calc-lift').addEventListener('change', refreshStatics);
    $('hs-show-calc-brake').addEventListener('change', refreshStatics);
    // experiment presets
    document.querySelectorAll('[data-exp]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-exp'), L = S.lift, Br = S.brake;
        if (k === 'lift-car') { L.F1 = 500; L.A1 = 20; L.A2 = 250; L.load = 500; }
        if (k === 'lift-fail') { L.F1 = 200; L.A1 = 50; L.A2 = 10; L.load = 2000; }
        if (k === 'lift-equal') { L.F1 = 400; L.A1 = 50; L.A2 = 50; L.load = 30; }
        if (k === 'brake-city') { Br.Fp = 150; Br.R = 4; Br.Am = 5; Br.Aw = 30; }
        if (k === 'brake-panic') { Br.Fp = 400; Br.R = 5; Br.Am = 3; Br.Aw = 45; }
        if (k === 'brake-soft') { Br.Fp = 150; Br.R = 4; Br.Am = 8; Br.Aw = 15; }
        syncInputs(); L.target = 0; L.press = 0; Br.target = 0;
        refreshStatics();
      });
    });
    syncInputs();
    refreshStatics();
    requestAnimationFrame(frame);
  }
  function syncInputs() {
    var L = S.lift, Br = S.brake;
    $('hs-in-f1').value = L.F1; setText('hs-out-f1', fmtInt(L.F1) + ' N');
    $('hs-in-a1').value = L.A1; setText('hs-out-a1', L.A1 + ' cm²');
    $('hs-in-a2').value = L.A2; setText('hs-out-a2', L.A2 + ' cm²');
    $('hs-in-load').value = L.load; setText('hs-out-load', fmtInt(L.load) + ' kg');
    $('hs-in-fp').value = Br.Fp; setText('hs-out-fp', fmtInt(Br.Fp) + ' N');
    $('hs-in-pr').value = Br.R; setText('hs-out-pr', Br.R.toFixed(1) + ' : 1');
    $('hs-in-am').value = Br.Am; setText('hs-out-am', Br.Am + ' cm²');
    $('hs-in-aw').value = Br.Aw; setText('hs-out-aw', Br.Aw + ' cm²');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
