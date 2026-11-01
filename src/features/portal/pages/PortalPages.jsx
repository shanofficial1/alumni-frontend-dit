
import { useEffect, useMemo, useState } from 'react';
import { alumniApi } from '../../../lib/api';
import { useAuth } from '../../auth/context/AuthContext';
import { EXPORT_FIELDS, PROGRAMS, BATCHES, STATUSES } from '../../../config/constants';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function dateLabel(value) {
  return value ? new Date(value).toLocaleDateString('en-IN') : '—';
}

const inputClass =
  'w-full rounded-lg border border-[#dedfd5] bg-[#fdfcf8] px-3.5 py-3 text-sm text-[#263b32] outline-none transition placeholder:text-[#92988f] focus:border-[#203f35] focus:ring-2 focus:ring-[#203f35]/10';

const buttonPrimary =
  'inline-flex items-center justify-center rounded-lg bg-[#203f35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#163129] disabled:cursor-not-allowed disabled:opacity-50';

const buttonSecondary =
  'inline-flex items-center justify-center rounded-lg border border-[#dedfd5] bg-[#fdfcf8] px-4 py-2.5 text-sm font-semibold text-[#203f35] transition hover:border-[#203f35] hover:bg-[#f5f3eb] disabled:cursor-not-allowed disabled:opacity-50';

function PageMessage({ children, type = 'error' }) {
  const styles =
    type === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-[#dedfd5] bg-[#f5f3eb] text-[#687169]';

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}

function LoadingMessage({ children }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-sm text-[#687169]">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#dedfd5] border-t-[#203f35]" />
      {children}
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8c3b30]">
        {eyebrow}
      </p>
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#203f35] sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-sm leading-6 text-[#687169]">
          {description}
        </p>
      )}
    </div>
  );
}

export function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    alumniApi.myProfile()
      .then((result) => {
        if (!active) return;
        const profile = result.user;
        setUser(profile);
        setForm({
          fullName: profile.fullName || '',
          mobile: profile.mobile || '',
          program: profile.program || '',
          batch: profile.batch || '',
          workingStatus: profile.workingStatus || '',
          company: profile.company || '',
          companyWebsite: profile.companyWebsite || '',
          linkedinProfile: profile.linkedinProfile || '',
        });
      })
      .catch((err) => setError(err.userMessage || 'Could not load profile.'))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const showOrganisation = ['Employed', 'Self-employed', 'Entrepreneur', 'Higher Studies'].includes(form?.workingStatus);

  async function saveProfile(event) {
    event.preventDefault();
    setError('');
    setNotice('');

    if (showOrganisation && !form.company.trim()) {
      setError(form.workingStatus === 'Higher Studies'
        ? 'Institution / university name is required.'
        : 'Company / organisation name is required.');
      return;
    }

    try {
      setSaving(true);
      const result = await alumniApi.updateMyProfile(form);
      setUser(result.user);
      setForm({
        fullName: result.user.fullName || '',
        mobile: result.user.mobile || '',
        program: result.user.program || '',
        batch: result.user.batch || '',
        workingStatus: result.user.workingStatus || '',
        company: result.user.company || '',
        companyWebsite: result.user.companyWebsite || '',
        linkedinProfile: result.user.linkedinProfile || '',
      });
      setEditing(false);
      setNotice(result.message || 'Profile updated successfully.');
    } catch (err) {
      setError(err.userMessage || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="min-h-screen bg-[#f5f3eb] px-4 py-10"><LoadingMessage>Loading profile…</LoadingMessage></main>;
  }

  if (error && !user) {
    return <main className="min-h-screen bg-[#f5f3eb] px-4 py-10 sm:px-6"><div className="mx-auto max-w-5xl"><PageMessage>{error}</PageMessage></div></main>;
  }

  if (!user || !form) return null;

  const rows = [
    ['Full name', user.fullName],
    ['Email address', user.email],
    ['Mobile number', user.mobile],
    ['Programme', user.program],
    ['Academic batch', user.batch],
    ['Employment status', user.workingStatus],
    [user.workingStatus === 'Higher Studies' ? 'Institution / university' : 'Company / organisation', user.company || '—'],
    [user.workingStatus === 'Higher Studies' ? 'Institution website' : 'Company website', user.companyWebsite || '—'],
    ['LinkedIn profile', user.linkedinProfile || '—'],
    ['Registered on', dateLabel(user.createdAt)],
  ];

  const fieldClass = 'w-full rounded-lg border border-[#dedfd5] bg-white px-3.5 py-3 text-sm text-[#263b32] outline-none focus:border-[#203f35] focus:ring-2 focus:ring-[#203f35]/10';

  return (
    <main className="min-h-screen bg-[#f5f3eb] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Alumni profile"
            title={`Welcome, ${user.fullName}`}
            description="View and update your alumni information whenever it changes."
          />
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#b9c9bd] bg-[#e9efe9] px-4 py-2 text-xs font-semibold text-[#203f35]">
              <span className="h-2 w-2 rounded-full bg-[#52765d]" /> Alumni member
            </span>
            {!editing && <button type="button" className={buttonPrimary} onClick={() => { setError(''); setNotice(''); setEditing(true); }}>Edit profile</button>}
          </div>
        </div>

        {error && <div className="mb-5"><PageMessage>{error}</PageMessage></div>}
        {notice && <div className="mb-5"><PageMessage type="success">{notice}</PageMessage></div>}

        {editing ? (
          <form onSubmit={saveProfile} className="rounded-2xl border border-[#dedfd5] bg-[#fdfcf8] p-5 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-semibold text-[#203f35]">Edit your profile</h2>
              <p className="mt-1 text-sm text-[#687169]">Your email address and account role cannot be changed here.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="block"><span className="mb-2 block text-sm font-semibold text-[#263b32]">Full name</span><input className={fieldClass} required minLength={3} maxLength={80} value={form.fullName} onChange={e => setField('fullName', e.target.value)} /></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-[#263b32]">Email address</span><input className={`${fieldClass} bg-[#f3f2ed]`} value={user.email} disabled /></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-[#263b32]">Mobile number</span><input className={fieldClass} required inputMode="numeric" maxLength={10} value={form.mobile} onChange={e => setField('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} /></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-[#263b32]">Programme</span><select className={fieldClass} required value={form.program} onChange={e => setField('program', e.target.value)}>{PROGRAMS.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-[#263b32]">Academic batch</span><select className={fieldClass} required value={form.batch} onChange={e => setField('batch', e.target.value)}>{BATCHES.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-[#263b32]">Working status</span><select className={fieldClass} required value={form.workingStatus} onChange={e => { setField('workingStatus', e.target.value); if (!['Employed', 'Self-employed', 'Entrepreneur', 'Higher Studies'].includes(e.target.value)) { setField('company', ''); setField('companyWebsite', ''); } }}><option value="">Select status</option>{STATUSES.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
              {showOrganisation && <>
                <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-semibold text-[#263b32]">{form.workingStatus === 'Higher Studies' ? 'Institution / university name' : 'Company / organisation name'}</span><input className={fieldClass} required value={form.company} onChange={e => setField('company', e.target.value)} placeholder={form.workingStatus === 'Higher Studies' ? 'Enter institution or university name' : 'Enter company name'} /></label>
                <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-semibold text-[#263b32]">{form.workingStatus === 'Higher Studies' ? 'Institution website (optional)' : 'Company website (optional)'}</span><input className={fieldClass} type="url" value={form.companyWebsite} onChange={e => setField('companyWebsite', e.target.value)} placeholder="https://example.com" /></label>
              </>}
              <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-semibold text-[#263b32]">LinkedIn profile (optional)</span><input className={fieldClass} type="url" value={form.linkedinProfile} onChange={e => setField('linkedinProfile', e.target.value)} placeholder="https://www.linkedin.com/in/your-profile" /></label>
            </div>
            <div className="mt-7 flex flex-wrap justify-end gap-3">
              <button type="button" className={buttonSecondary} disabled={saving} onClick={() => { setForm({ fullName: user.fullName || '', mobile: user.mobile || '', program: user.program || '', batch: user.batch || '', workingStatus: user.workingStatus || '', company: user.company || '', companyWebsite: user.companyWebsite || '', linkedinProfile: user.linkedinProfile || '' }); setEditing(false); setError(''); }}>Cancel</button>
              <button type="submit" className={buttonPrimary} disabled={saving}>{saving ? 'Saving changes…' : 'Save changes'}</button>
            </div>
          </form>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-[#dedfd5] bg-[#fdfcf8] shadow-sm">
            <div className="border-b border-[#dedfd5] bg-[#203f35] px-5 py-5 sm:px-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d8dfd6]">Personal information</p>
              <h2 className="mt-1 font-serif text-xl font-semibold text-white">Registered details</h2>
            </div>
            <div className="grid grid-cols-1 divide-y divide-[#dedfd5] sm:grid-cols-2 sm:divide-y-0 sm:px-7 sm:py-3">
              {rows.map(([label, value], index) => (
                <div key={label} className={`min-w-0 px-5 py-4 sm:px-3 ${index >= 2 ? 'sm:border-t sm:border-[#dedfd5]' : ''} ${index % 2 === 0 ? 'sm:pr-7' : 'sm:pl-7'}`}>
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-[#687169]">{label}</p>
                  <p className="break-words text-sm font-semibold text-[#263b32]">{value || '—'}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export function AdminDashboard() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [program, setProgram] = useState('');
  const [batch, setBatch] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState([]);
  const [fields, setFields] = useState([
    'fullName',
    'email',
    'mobile',
    'program',
    'batch',
    'workingStatus',
  ]);

  async function load() {
    setLoading(true);
    setError('');

    try {
      const result = await alumniApi.list({
        search,
        program,
        batch,
        workingStatus: status,
      });

      setRows(result.alumni || []);
      setTotal(result.total || 0);
      setSelected([]);
    } catch (e) {
      setError(e.userMessage || 'Unable to load alumni records.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = setTimeout(load, 250);
    return () => clearTimeout(id);
  }, [search, program, batch, status]);

  const visible = useMemo(
    () =>
      rows.map((r) => ({
        ...r,
        createdAt: dateLabel(r.createdAt),
      })),
    [rows]
  );

  function toggle(id) {
    setSelected((old) =>
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id]
    );
  }

  function toggleAll() {
    setSelected(
      selected.length === rows.length ? [] : rows.map((r) => r._id)
    );
  }

  const chosen = rows.filter((r) => selected.includes(r._id));
  const selectedFields = EXPORT_FIELDS.filter(([key]) =>
    fields.includes(key)
  );

  function exportRows(data) {
    return data.map((r) =>
      Object.fromEntries(
        selectedFields.map(([key, label]) => [
          label,
          key === 'createdAt' ? dateLabel(r[key]) : (r[key] ?? ''),
        ])
      )
    );
  }

  function exportExcel() {
    if (!selectedFields.length) {
      setError('Select at least one export field.');
      return;
    }

    const data = exportRows(chosen.length ? chosen : rows);
    const sheet = XLSX.utils.json_to_sheet(data);
    const book = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(book, sheet, 'Alumni');
    XLSX.writeFile(book, 'alumni-v1-records.xlsx');
  }

  function exportPdf() {
    if (!selectedFields.length) {
      setError('Select at least one export field.');
      return;
    }

    const data = exportRows(chosen.length ? chosen : rows);
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.text('Alumni Connect — Alumni Records', 14, 14);

    autoTable(doc, {
      startY: 20,
      head: [selectedFields.map(([, label]) => label)],
      body: data.map((r) =>
        selectedFields.map(([, label]) => String(r[label] ?? ''))
      ),
      styles: {
        fontSize: 7,
        cellPadding: 2,
      },
    });

    doc.save('alumni-v1-records.pdf');
  }

  function clearFilters() {
    setSearch('');
    setProgram('');
    setBatch('');
    setStatus('');
  }

  const allSelected = rows.length > 0 && selected.length === rows.length;

  return (
    <main className="min-h-screen bg-[#f5f3eb] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Page heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Administration"
            title="Alumni dashboard"
            description="View, filter and export registered alumni."
          />

          <div className="flex w-full items-center justify-between rounded-xl border border-[#dedfd5] bg-[#fdfcf8] px-5 py-4 shadow-sm sm:w-auto sm:min-w-52">
            <div>
              <p className="text-xs font-medium text-[#687169]">
                Total matching alumni
              </p>
              <p className="mt-1 font-serif text-3xl font-semibold text-[#203f35]">
                {total}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9efe9] text-[#203f35]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filters */}
        <section className="mb-6 rounded-2xl border border-[#dedfd5] bg-[#fdfcf8] p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-serif text-lg font-semibold text-[#203f35]">
              Search and filters
            </h2>
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-[#8c3b30] transition hover:text-[#692a22]"
            >
              Clear filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              aria-label="Search alumni"
              placeholder="Search name, email or mobile…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={inputClass}
            />

            <select
              aria-label="Filter by programme"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className={inputClass}
            >
              <option value="">All programmes</option>
              {PROGRAMS.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className={inputClass}
            >
              <option value="">All batches</option>
              {BATCHES.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by employment status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              <option value="">All statuses</option>
              {STATUSES.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Export options */}
        <section className="mb-6 rounded-2xl border border-[#dedfd5] bg-[#fdfcf8] p-4 shadow-sm sm:p-5">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#203f35]">
                Export records
              </h2>
              <p className="mt-1 text-xs text-[#687169]">
                {selected.length
                  ? `${selected.length} selected — otherwise exports all filtered results.`
                  : 'No rows selected — exports all filtered results.'}
              </p>
            </div>

            <span className="w-fit rounded-full bg-[#e9efe9] px-3 py-1.5 text-xs font-semibold text-[#203f35]">
              {selectedFields.length} fields selected
            </span>
          </div>

          <div className="my-5 grid grid-cols-2 gap-3 border-y border-[#dedfd5] py-4 sm:grid-cols-3 lg:grid-cols-4">
            {EXPORT_FIELDS.map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2 text-sm text-[#263b32]"
              >
                <input
                  type="checkbox"
                  checked={fields.includes(key)}
                  onChange={(e) =>
                    setFields((old) =>
                      e.target.checked
                        ? [...old, key]
                        : old.filter((x) => x !== key)
                    )
                  }
                  className="h-4 w-4 accent-[#203f35]"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={exportExcel}
              className={buttonSecondary}
            >
              Export Excel
            </button>
            <button
              type="button"
              onClick={exportPdf}
              className={buttonPrimary}
            >
              Export PDF
            </button>
          </div>
        </section>

        {error && (
          <div className="mb-5">
            <PageMessage>{error}</PageMessage>
          </div>
        )}

        {/* Alumni table */}
        <section className="overflow-hidden rounded-2xl border border-[#dedfd5] bg-[#fdfcf8] shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-[#dedfd5] px-5 py-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#203f35]">
                Registered alumni
              </h2>
              <p className="mt-1 text-xs text-[#687169]">
                {rows.length} records displayed
              </p>
            </div>
            {rows.length > 0 && (
              <span className="text-xs font-medium text-[#687169]">
                {selected.length} selected
              </span>
            )}
          </div>

          {loading ? (
            <LoadingMessage>Loading alumni records…</LoadingMessage>
          ) : rows.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f3eb] text-[#687169]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#203f35]">
                No alumni found
              </h3>
              <p className="mt-1 text-sm text-[#687169]">
                No alumni records match these filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#f5f3eb] text-xs uppercase tracking-wider text-[#687169]">
                    <th className="px-4 py-4">
                      <input
                        type="checkbox"
                        aria-label="Select all"
                        checked={allSelected}
                        onChange={toggleAll}
                        className="h-4 w-4 accent-[#203f35]"
                      />
                    </th>
                    <th className="px-4 py-4 font-semibold">Name</th>
                    <th className="px-4 py-4 font-semibold">Email</th>
                    <th className="px-4 py-4 font-semibold">Mobile</th>
                    <th className="px-4 py-4 font-semibold">Programme</th>
                    <th className="px-4 py-4 font-semibold">Batch</th>
                    <th className="px-4 py-4 font-semibold">Working status</th>
                    <th className="px-4 py-4 font-semibold">Company / institution</th>
                    <th className="px-4 py-4 font-semibold">Registered</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#ecece5]">
                  {visible.map((r) => (
                    <tr
                      key={r._id}
                      className="transition hover:bg-[#f5f3eb]/70"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selected.includes(r._id)}
                          onChange={() => toggle(r._id)}
                          aria-label={`Select ${r.fullName}`}
                          className="h-4 w-4 accent-[#203f35]"
                        />
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-[#203f35]">
                        {r.fullName}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#687169]">
                        {r.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#687169]">
                        {r.mobile}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#263b32]">
                        {r.program}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#263b32]">
                        {r.batch}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-[#e9efe9] px-2.5 py-1 text-xs font-medium text-[#203f35]">
                          {r.workingStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#687169]">
                        {r.company || '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#687169]">
                        {r.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && rows.length > 0 && (
            <div className="border-t border-[#dedfd5] bg-[#f5f3eb] px-5 py-3">
              <p className="text-xs text-[#687169]">
                Select individual records or use the checkbox in the table
                header to select all displayed records.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
