/* ADAM/DS — primitives/field-meta.js · Field docs · [plan:2026-09-24_160000-primitives-complete.md#phase-1] */
// Exports: fieldKnobs, fieldAnat, fieldBehav — Field knobs + doc strings
// — Knobs · Docs —

const fieldKnobs = [
  {
    key: 'control',
    label: 'control',
    type: 'select',
    default: 'input',
    options: [
      { value: 'input', label: 'input' },
      { value: 'textarea', label: 'textarea' },
      { value: 'select', label: 'select' },
    ],
  },
  {
    key: 'state',
    label: 'state',
    type: 'select',
    default: 'default',
    options: [
      { value: 'default', label: 'default' },
      { value: 'error', label: 'error' },
      { value: 'disabled', label: 'disabled' },
    ],
  },
  {
    key: 'label',
    label: 'label',
    type: 'select',
    default: 'Email',
    options: [
      { value: 'Email', label: 'Email' },
      { value: 'Message', label: 'Message' },
      { value: 'Role', label: 'Role' },
    ],
  },
  {
    key: 'placeholder',
    label: 'placeholder',
    type: 'select',
    default: 'you@example.com',
    options: [
      { value: 'you@example.com', label: 'you@example.com' },
      { value: 'Tell us…', label: 'Tell us…' },
      { value: 'Select…', label: 'Select…' },
    ],
  },
  {
    key: 'value',
    label: 'value',
    type: 'select',
    default: '',
    options: [
      { value: '', label: '(empty)' },
      { value: 'hello@adam.dev', label: 'hello@adam.dev' },
      { value: 'Filled text', label: 'Filled text' },
    ],
  },
  {
    key: 'hint',
    label: 'hint',
    type: 'select',
    default: 'We’ll never share your email.',
    options: [
      { value: 'We’ll never share your email.', label: 'hint' },
      { value: 'Required field', label: 'Required field' },
    ],
  },
  {
    key: 'errorText',
    label: 'error',
    type: 'select',
    default: 'Enter a valid email.',
    options: [
      { value: 'Enter a valid email.', label: 'Enter a valid email.' },
      { value: 'Required.', label: 'Required.' },
    ],
  },
  { key: 'onDark', label: 'on dark', type: 'boolean', default: false },
];

const fieldAnat = '<span class="tok">.field</span> label (mono uppercase '
  + '<span class="tok">--tracking-label</span>) + control (hairline '
  + '<span class="tok">--color-input-line</span>, paper <span class="tok">--color-input-bg</span>) + '
  + '<span class="tok">.field-hint</span>/<span class="tok">.field-error</span> (accent).';
const fieldBehav = 'Focus: <span class="tok">3px</span> ink ring offset '
  + '<span class="tok">2px</span> (<span class="tok">--size-frame</span>); error swaps to '
  + '<span class="tok">--color-accent</span>; disabled via <span class="tok">disabled</span>; '
  + 'dark proof via <span class="tok">[data-theme]</span>. Tab to test.';

export { fieldKnobs, fieldAnat, fieldBehav };
