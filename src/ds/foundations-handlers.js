/* ADAM/DS — ds/foundations-handlers · demo event handlers ·
   [plan:2026-09-13_235413-over-limit-splits.md#phase-2] */
// Exports: makeHandlers — copy/type/ease/fx handlers over demo elements
export function makeHandlers(els) {
  const { sw, typeSample, stage, dot, shimmer, rise } = els;
  const onCopyVar = (e) => { const b = e.target.closest('[data-mix-copy]'); if (!b



                    || !sw) return;
                    const k = b
                      .dataset
                      .mixCopy === 'hex' ? sw
                      .dataset
                      .hex : sw
                      .dataset
                      .var;
                    if (k) navigator
                      .clipboard
                      .writeText(k)
                      .catch(() => {});
                    };
  const onType = (e) => { const s = e.target; if (!s.dataset.type



                    || !typeSample) return;
                    if (s.dataset.type === 'size') typeSample
                      .style
                      .fontSize = s
                      .value;
                    if (s.dataset.type === 'leading') typeSample
                      .style
                      .lineHeight = s
                      .value;
                    if (s.dataset.type === 'tracking') typeSample
                      .style
                      .letterSpacing = s
                      .value;
                    };
  const onEase = (e) => {
    if (e.target.closest('[data-ease-replay]')) { if (!stage) return;
      stage
        .classList
        .remove('go');
      void stage
        .offsetWidth;
      stage
        .classList
        .add('go');
      return;
    }
    const s = e.target.closest('[data-ease]'); if (!s || !dot) return;
    if (s.dataset.ease === 'd') dot.style.setProperty('--fd-d', s.value);
    if (s.dataset.ease === 'e') dot.style.setProperty('--fd-e', s.value);
  };
  const onFx = (e) => {
    if (e.target.closest('[data-shimmer-toggle]') && shimmer) shimmer.classList.toggle('off');
    if (e.target.closest('[data-rise-replay]')





                    && rise) { rise.classList.add('rest');
                      void rise
                        .offsetWidth;
                      requestAnimationFrame(() => rise.classList.remove('rest'));
                    }
  };
  return { onCopyVar, onType, onEase, onFx };
}
