import { useState } from 'react';

const WORKSHOPS = ['React Basics', 'State & Events', 'Forms & Validation', 'Accessibility'];
const EMPTY = { name: '', email: '', phone: '', date: '', age: '', portfolio: '', workshop: '' };
const today = () => new Date().toISOString().split('T')[0];

const FIELDS = [
  { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name', required: true },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', required: true,
    pattern: '[0-9+()\\-\\s]{7,15}', hint: '7–15 digits; + ( ) - and spaces allowed' },
  { name: 'date', label: 'Workshop date', type: 'date', required: true, min: today() },
  { name: 'age', label: 'Age', type: 'number', required: true, min: 16, max: 100, hint: 'Between 16 and 100' },
  { name: 'portfolio', label: 'Portfolio URL', type: 'url', placeholder: 'https://example.com', hint: 'Optional' },
];

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Name cannot be empty.';
  else if (v.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';

  if (!v.email.trim()) e.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Enter a valid email like name@example.com.';

  if (!v.phone.trim()) e.phone = 'Phone number is required.';
  else if (!/^[0-9+()\-\s]{7,15}$/.test(v.phone.trim())) e.phone = 'Use 7–15 digits (+, brackets, dashes and spaces allowed).';

  if (!v.date) e.date = 'Choose a workshop date.';
  else if (v.date < today()) e.date = 'Date cannot be in the past.';

  const age = Number(v.age);
  if (v.age === '') e.age = 'Age is required.';
  else if (!Number.isInteger(age)) e.age = 'Age must be a whole number.';
  else if (age < 16 || age > 100) e.age = 'Age must be between 16 and 100.';

  if (v.portfolio.trim()) {
    try {
      const u = new URL(v.portfolio.trim());
      if (!['http:', 'https:'].includes(u.protocol)) throw new Error();
    } catch {
      e.portfolio = 'Enter a full URL starting with http:// or https://.';
    }
  }
  if (!v.workshop) e.workshop = 'Select a workshop.';
  return e;
}

export default function App() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [items, setItems] = useState([]);
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('All'); // extension: filter by workshop

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined }); // clear error as user fixes it
    setSuccess('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      setSuccess('');
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    setItems([...items, { ...form, name: form.name.trim(), id: crypto.randomUUID() }]);
    setSuccess(`${form.name.trim()} is registered for ${form.workshop}.`);
    setForm(EMPTY);
  }

  const remove = (id) => setItems(items.filter((x) => x.id !== id));
  const visible = filter === 'All' ? items : items.filter((x) => x.workshop === filter);

  const err = (n) => errors[n] && <p className="error" id={`${n}-err`} role="alert">{errors[n]}</p>;
  const aria = (n) => ({ 'aria-invalid': !!errors[n], 'aria-describedby': errors[n] ? `${n}-err` : undefined });

  return (
    <main>
      <h1>Workshop Registration</h1>
      <p className="lead">Reserve your place. All fields marked * are required.</p>

      <form onSubmit={handleSubmit} noValidate>
        {FIELDS.map((f) => (
          <div className="field" key={f.name}>
            <label htmlFor={f.name}>{f.label}{f.required && ' *'}</label>
            <input id={f.name} {...f} value={form[f.name]} onChange={handleChange} {...aria(f.name)} />
            {f.hint && !errors[f.name] && <p className="hint">{f.hint}</p>}
            {err(f.name)}
          </div>
        ))}

        <div className="field">
          <label htmlFor="workshop">Workshop *</label>
          <select id="workshop" name="workshop" value={form.workshop} onChange={handleChange} {...aria('workshop')}>
            <option value="">Select a workshop…</option>
            {WORKSHOPS.map((w) => <option key={w}>{w}</option>)}
          </select>
          {err('workshop')}
        </div>

        <button type="submit">Register</button>
        <p className="success" role="status" aria-live="polite">{success}</p>
      </form>

      <section aria-labelledby="reg-title">
        <div className="list-head">
          <h2 id="reg-title">Registrations ({items.length})</h2>
          <label className="filter">Show
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              {WORKSHOPS.map((w) => <option key={w}>{w}</option>)}
            </select>
          </label>
        </div>
        {visible.length === 0 && <p className="hint">No registrations to show yet.</p>}
        <div className="grid">
          {visible.map((i) => (
            <article className="card" key={i.id}>
              <h3>{i.name}</h3>
              <p><strong>{i.workshop}</strong> · {i.date}</p>
              <p>{i.email}<br />{i.phone} · Age {i.age}</p>
              {i.portfolio && <p><a href={i.portfolio} target="_blank" rel="noreferrer">Portfolio</a></p>}
              <button className="danger" onClick={() => remove(i.id)} aria-label={`Remove ${i.name}`}>Remove</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
