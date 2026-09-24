/* ADAM/DS — primitives/field-code.js · Field code · [plan:2026-09-24_160000-primitives-complete.md#phase-1] */
// Exports: fieldCode — Field code generator
// — Code —

export function fieldCode(s) {
  const err = s.state === 'error' ? ' field--error' : '';
  let control = '';
  if (s.control === 'input') control = `<input placeholder="${s.placeholder}">`;
  else if (s.control === 'textarea') control = `<textarea placeholder="${s.placeholder}"></textarea>`;
  else control = `<select><option>${s.placeholder}</option></select>`;
  const hint = s.state === 'error'
    ? `<span class="field-error">${s.errorText}</span>`
    : `<span class="field-hint">${s.hint}</span>`;
  return `<div class="field${err}">\n  <label>${s.label}</label>\n  ${control}\n  ${hint}\n</div>`;
}
