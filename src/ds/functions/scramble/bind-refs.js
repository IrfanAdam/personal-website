/* ADAM/DS — scramble/bind-refs · lab DOM refs · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: getRefs(lab, root) — all queries in one place, null-safe

// — Refs —
export function getRefs(lab, root) {
  const q = (s) => lab.querySelector(s);
  return {
    lab,
    preview: q('[data-scramble-preview]'),
    inp: q('[data-scramble="text"]'),
    charsSel: q('[data-scramble="chars"]'),
    customRow: q('[data-scramble-custom-row]'),
    customInp: q('[data-scramble="custom"]'),
    dur: q('[data-scramble="dur"]'),
    outDur: q('[data-scramble-dur]'),
    speed: q('[data-scramble="speed"]'),
    outSpeed: q('[data-scramble-speed]'),
    delay: q('[data-scramble="delay"]'),
    outDelay: q('[data-scramble-delay]'),
    delim: q('[data-scramble="delim"]'),
    rtlBtn: q('[data-scramble="rtl"]'),
    tweenBtn: q('[data-scramble="tween"]'),
    fontSel: q('[data-scramble="font"]'),
    soundBtn: q('[data-scramble="sound"]'),
    voiceSel: q('[data-scramble="voice"]'),
    kindSel: q('[data-scramble="kind"]'),
    fileSel: q('[data-scramble="file"]'),
    replayBtn: q('[data-scramble="replay"]'),
    hoverBtn: q('[data-scramble="hover"]'),
    playLoadBtn: q('[data-scramble="play-load"]'),
    outChars: q('[data-scramble-chars-v]'),
    outFont: q('[data-scramble-font-v]'),
    status: q('[data-scramble-status]'),
    stage: q('[data-scramble-stage]'),
    alignBtns: lab.querySelectorAll('[data-scramble-align]'),
    alignGroup: lab.querySelector('[data-scramble-align-group]'),
    tabBar: root.querySelector('[data-scramble-tabs]'),
  };
}
