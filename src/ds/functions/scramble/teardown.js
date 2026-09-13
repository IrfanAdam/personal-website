/* ADAM/DS — ds/scramble/teardown · lab unwire · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
// Exports: teardown(T) — unwinds the uiOff returned by mountUi + bind.js's listener list
export function teardown(T){
  return ()=>{
    try { T.uiOff(); } catch {}
    clearTimeout(T.tmr);
    T.offs.forEach((fn)=>{ try { fn(); } catch {} });
    /* shared ctx stays alive — no suspend on unmount */
  };
}
