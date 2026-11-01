
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../../../lib/api';
import {
  PROGRAMS,
  BATCHES,
  STATUSES,
  ORGANISATION_STATUSES,
} from '../../../config/constants';

function Message({ children, error }) {
  if (!children) return null;

  return (
    <div
      className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
        error
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
      }`}
      role={error ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
}

function AuthLayout({ title, subtitle, children, register = false }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f3eb] px-4 py-8 sm:px-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#203f35]/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#8c3b30]/[0.05] blur-3xl" />

      <section className="relative z-10 w-full max-w-3xl">
        <div
          className={`rounded-3xl border border-[#dedfd5] bg-[#fdfcf8] p-6 shadow-[0_20px_70px_rgba(32,63,53,0.09)] sm:p-9 md:p-11 ${
            register ? 'max-w-3xl' : 'mx-auto max-w-md'
          }`}
        >
          {/* Heading */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#203f35] text-2xl font-semibold text-white shadow-lg shadow-[#203f35]/15">
              A
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8c3b30]">
              Alumni Connect
            </span>

            <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#203f35] sm:text-4xl">
              {title}
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#687169]">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </section>
    </main>
  );
}

function FormField({ label, children, full = false }) {
  return (
    <label className={`block min-w-0 ${full ? 'sm:col-span-2' : ''}`}>
      <span className="mb-2 block text-[13px] font-semibold text-[#263b32]">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  'h-12 w-full rounded-xl border border-[#dedfd5] bg-white px-4 text-sm text-[#263b32] outline-none transition placeholder:text-[#a0a69f] hover:border-[#b8c1b8] focus:border-[#203f35] focus:ring-4 focus:ring-[#203f35]/[0.08]';

export function RegisterPage() {
  const navigate = useNavigate();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    program: '',
    batch: '',
    workingStatus: '',
    company: '',
    companyWebsite: '',
    linkedinProfile: '',
    password: '',
    confirmPassword: '',
  });

  const set = (key, value) => {
    setForm(old => ({ ...old, [key]: value }));
  };

  const showOrganisation = ORGANISATION_STATUSES.includes(form.workingStatus);

  async function submit(e) {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (
      form.password.length < 8 ||
      !/[A-Z]/.test(form.password) ||
      !/[a-z]/.test(form.password) ||
      !/[0-9]/.test(form.password) ||
      !/[^A-Za-z0-9]/.test(form.password)
    ) {
      return setError(
        'Password must be at least 8 characters and include uppercase, lowercase, number and special character.'
      );
    }

    if (showOrganisation && !form.company.trim()) {
      return setError(form.workingStatus === 'Higher Studies' ? 'Institution / university name is required.' : 'Company / organisation name is required.');
    }

    const { confirmPassword, ...payload } = form;

    try {
      setBusy(true);

      const result = await authApi.register(payload);

      setSuccess(
        result.message || 'Registration successful. Please sign in.'
      );

      setTimeout(() => {
        navigate('/login', {
          state: { message: result.message },
        });
      }, 900);
    } catch (err) {
      setError(err.userMessage || 'Registration failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join our alumni community and stay connected."
      register
    >
      <form
        className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2"
        onSubmit={submit}
      >
        <FormField label="Full name">
          <input
            className={inputClass}
            required
            minLength="3"
            value={form.fullName}
            onChange={e => set('fullName', e.target.value)}
            placeholder="Enter your full name"
            autoComplete="name"
          />
        </FormField>

        <FormField label="Email address">
          <input
            className={inputClass}
            required
            type="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </FormField>

        <FormField label="Mobile number">
          <input
            className={inputClass}
            required
            type="tel"
            inputMode="numeric"
            maxLength="10"
            value={form.mobile}
            onChange={e =>
              set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))
            }
            placeholder="10-digit mobile number"
            autoComplete="tel"
          />
        </FormField>

        <FormField label="Programme">
          <select
            className={inputClass}
            required
            value={form.program}
            onChange={e => set('program', e.target.value)}
          >
            <option value="">Select programme</option>
            {PROGRAMS.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Academic batch">
          <select
            className={inputClass}
            required
            value={form.batch}
            onChange={e => set('batch', e.target.value)}
          >
            <option value="">Select batch</option>
            {BATCHES.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Employment status">
          <select
            className={inputClass}
            required
            value={form.workingStatus}
            onChange={e => set('workingStatus', e.target.value)}
          >
            <option value="">Select status</option>
            {STATUSES.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </FormField>

        {showOrganisation && (
          <>
            <FormField label={form.workingStatus === "Higher Studies" ? "Institution / university name" : "Company / organisation name"} full>
              <input
                className={inputClass}
                required
                value={form.company}
                onChange={e => set('company', e.target.value)}
                placeholder={form.workingStatus === "Higher Studies" ? "Enter institution or university name" : "Enter company name"}
              />
            </FormField>

            <FormField label={form.workingStatus === "Higher Studies" ? "Institution website (optional)" : "Company website (optional)"} full>
              <input
                className={inputClass}
                type="url"
                value={form.companyWebsite}
                onChange={e => set('companyWebsite', e.target.value)}
                placeholder="https://example.com"
              />
            </FormField>
          </>
        )}

        <FormField label="LinkedIn profile (optional)" full>
          <input
            className={inputClass}
            type="url"
            value={form.linkedinProfile}
            onChange={e => set('linkedinProfile', e.target.value)}
            placeholder="https://www.linkedin.com/in/your-profile"
          />
        </FormField>

        <FormField label="Password">
          <input
            className={inputClass}
            required
            type="password"
            value={form.password}
            onChange={e => set('password', e.target.value)}
            autoComplete="new-password"
            placeholder="Create password"
          />
        </FormField>

        <FormField label="Confirm password">
          <input
            className={inputClass}
            required
            type="password"
            value={form.confirmPassword}
            onChange={e => set('confirmPassword', e.target.value)}
            autoComplete="new-password"
            placeholder="Confirm password"
          />
        </FormField>

        <div className="sm:col-span-2">
          <Message error>{error}</Message>
          <Message>{success}</Message>

          <button
            type="submit"
            disabled={busy}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#203f35] px-5 text-sm font-semibold text-white shadow-lg shadow-[#203f35]/10 transition hover:-translate-y-0.5 hover:bg-[#163129] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? 'Creating account...' : 'Create account'}
            {!busy && <span className="text-lg">→</span>}
          </button>
        </div>
      </form>

      <p className="mt-7 text-center text-sm text-[#687169]">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-[#203f35] hover:text-[#8c3b30]"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

function LoginForm({ admin = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function submit(e) {
    e.preventDefault();

    setError('');
    setBusy(true);

    try {
      const result = admin
        ? await authApi.adminLogin({ email: email.trim().toLowerCase(), password })
        : await authApi.login({ email: email.trim().toLowerCase(), password });

      signIn(result);

      navigate(admin ? '/admin' : '/profile', {
        replace: true,
      });
    } catch (err) {
      setError(err.userMessage || 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title={admin ? 'Administrator login' : 'Welcome back'}
      subtitle={
        admin
          ? 'Sign in to manage the alumni community.'
          : 'Sign in to reconnect with your alumni community.'
      }
    >
      <Message>{location.state?.message}</Message>

      <form className="space-y-5" onSubmit={submit}>
        <FormField label="Email address">
          <input
            className={inputClass}
            required
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            autoComplete="email"
          />
        </FormField>

        <FormField label="Password">
          <input
            className={inputClass}
            required
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Enter your password"
          />
        </FormField>

        <Message error>{error}</Message>

        <button
          type="submit"
          disabled={busy}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#203f35] px-5 text-sm font-semibold text-white shadow-lg shadow-[#203f35]/10 transition hover:-translate-y-0.5 hover:bg-[#163129] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? 'Signing in...' : 'Sign in'}
          {!busy && <span className="text-lg">→</span>}
        </button>
      </form>

      {!admin && (
        <p className="mt-7 text-center text-sm text-[#687169]">
          New to our community?{' '}
          <Link
            to="/register"
            className="font-semibold text-[#203f35] hover:text-[#8c3b30]"
          >
            Create an account
          </Link>
        </p>
      )}

      {admin && (
        <p className="mt-7 text-center text-sm text-[#687169]">
          <Link
            to="/login"
            className="font-semibold text-[#203f35] hover:text-[#8c3b30]"
          >
            Alumni login
          </Link>
        </p>
      )}
    </AuthLayout>
  );
}

export function LoginPage() {
  return <LoginForm />;
}

export function AdminLoginPage() {
  return <LoginForm admin />;
}
