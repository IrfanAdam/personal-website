/* ADAM/DS — primitives/field-code.js · Field · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
function fieldCode(s){const err=s.state==='error'?' field--error':'';let c=s.control==='input'?[
  `<input placeholder="`,
  s.placeholder,
  `">`,
].join(''):s.control==='textarea'?[
  `<textarea placeholder="`,
  s.placeholder,
  `"></textarea>`,
].join(''):[
  `<select><option>`,
  s.placeholder,
  `</option></select>`,
].join('');return [
  `<div class="field`,
  err,
  `">\n  <label>`,
  s.label,
  `</label>\n  `,
  c,
  `\n  `,
  s.state==='error'?`<span class="field-error">${s.errorText}</span>`:`<span class="field-hint">${s.hint}</span>`,
  `\n</div>`,
].join('');}
export { fieldCode };
