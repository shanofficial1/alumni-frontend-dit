
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import {
  ArrowUpRight,
  ArrowRight,
  Users,
  Globe2,
  Sparkles,
  GraduationCap,
  Network,
  BriefcaseBusiness,
  BookOpen,
  Lightbulb,
  Microscope,
} from "lucide-react";

const features = [
  {
    icon: Users,
    number: "01",
    title: "Reconnect",
    description:
      "Find familiar faces, reconnect with old friends, and bring meaningful relationships back into your life.",
  },
  {
    icon: Network,
    number: "02",
    title: "Grow Together",
    description:
      "Build valuable relationships with alumni from different batches, industries, and experiences.",
  },
  {
    icon: BriefcaseBusiness,
    number: "03",
    title: "Move Forward",
    description:
      "Discover opportunities, exchange knowledge, and support each other's professional journeys.",
  },
];

const highlights = [
  "Meaningful connections",
  "Shared experiences",
  "Endless possibilities",
];

const activities = [
  "Reconnect",
  "Share knowledge",
  "Celebrate success",
  "Create opportunities",
  "Grow together",
];

const researchAreas = [
  "Speech and Signal Processing",
  "Medical and Astronomical Image Processing",
  "Data Mining",
  "Natural Language Processing",
  "Algorithm Design",
  "Algorithms on Big Data",
  "Active Noise Cancellation",
  "Artificial Intelligence",
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const dashboardPath = user?.role === "admin" ? "/admin" : "/profile";
  const primaryPath = loading ? "/" : user ? dashboardPath : "/register";
  const primaryLabel = loading ? "Loading..." : user ? "Go to dashboard" : "Join the community";

  return (
    <main className="overflow-hidden bg-white text-[#252525]">

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-white">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full bg-[#f5f5f3] blur-[120px]" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#f8f8f6] blur-[120px]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(#d8d8d8 1px, transparent 1px), linear-gradient(90deg, #d8d8d8 1px, transparent 1px)",
              backgroundSize: "65px 65px",
            }}
          />
        </div>

        <div className="relative mx-auto grid min-h-[700px] max-w-7xl items-center gap-12 px-6 py-20 sm:px-10 lg:min-h-[760px] lg:grid-cols-2 lg:gap-8 lg:px-12">

          {/* Hero content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e9e9e9] bg-white px-4 py-2 text-xs font-medium tracking-wide text-[#666666] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#315f45]" />
              Department of Information Technology
            </div>

            <h1 className="mt-8 max-w-3xl text-5xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#252525] sm:text-6xl lg:text-[72px]">
              Your past built
              <br />
              <span className="text-[#777777]">
                the foundation.
              </span>
              <br />
              Your future
              <br />
              starts together.
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-[#777777] sm:text-lg">
              Every connection has a story. Every graduate has something
              valuable to share. Come together, inspire one another, and
              create opportunities that move everyone forward.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to={primaryPath}
                className="group inline-flex items-center gap-3 rounded-full bg-[#315f45] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:bg-[#254c37]"
              >
                {primaryLabel}
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>

              {!user && !loading && <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-[#dedede] bg-white px-7 py-4 text-sm font-semibold text-[#333333] transition duration-300 hover:border-[#aaaaaa] hover:bg-[#fafafa]"
              >
                Member login
                <ArrowRight size={17} />
              </Link>}
            </div>

            <div className="mt-14 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#eeeeee] pt-6">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-xs text-[#777777]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#999999]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto flex min-h-[430px] w-full max-w-[550px] items-center justify-center sm:min-h-[520px]">

            <div className="absolute h-[330px] w-[330px] rounded-full bg-[#eeeeec] blur-[90px] sm:h-[430px] sm:w-[430px]" />

            <div className="absolute h-[390px] w-[390px] rounded-full border border-dashed border-[#d7d7d7] sm:h-[500px] sm:w-[500px]" />

            {/* Floating icons */}
            <div className="absolute left-[4%] top-[18%] flex h-16 w-16 items-center justify-center rounded-2xl border border-white bg-white/90 text-[#555555] shadow-xl sm:left-[8%] sm:h-20 sm:w-20">
              <GraduationCap size={34} strokeWidth={1.3} />
            </div>

            <div className="absolute right-[4%] top-[20%] flex h-14 w-14 items-center justify-center rounded-full border border-white bg-white/90 text-[#555555] shadow-xl sm:right-[7%] sm:h-[72px] sm:w-[72px]">
              <Users size={28} strokeWidth={1.4} />
            </div>

            <div className="absolute bottom-[14%] left-[10%] flex h-14 w-14 items-center justify-center rounded-full border border-white bg-white/90 text-[#666666] shadow-xl sm:bottom-[13%] sm:left-[14%] sm:h-[70px] sm:w-[70px]">
              <Globe2 size={27} strokeWidth={1.4} />
            </div>

            <div className="absolute bottom-[15%] right-[8%] flex h-16 w-16 items-center justify-center rounded-2xl border border-white bg-white/90 text-[#666666] shadow-xl sm:bottom-[14%] sm:right-[10%] sm:h-[76px] sm:w-[76px]">
              <Sparkles size={30} strokeWidth={1.4} />
            </div>

            {/* Center visual */}
            <div className="relative flex h-[270px] w-[270px] items-center justify-center sm:h-[350px] sm:w-[350px]">
              <div className="absolute inset-0 rotate-45 rounded-[4rem] border border-white bg-white/80 shadow-[0_0_100px_rgba(0,0,0,.06)]" />

              <div className="absolute inset-8 -rotate-12 rounded-[3.5rem] border border-white bg-white/60 shadow-inner" />

              <div className="relative z-10 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#eeeeee] bg-white text-[#555555] shadow-lg sm:h-24 sm:w-24">
                  <Network size={43} strokeWidth={1.2} />
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#999999]">
                  One community
                </p>

                <p className="mt-2 font-serif text-3xl text-[#292929] sm:text-4xl">
                  Infinite paths.
                </p>
              </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#eeeeee] bg-white px-5 py-3 text-xs text-[#777777] shadow-lg">
              Connected by experience. Inspired by possibility.
            </div>
          </div>
        </div>
      </section>

      {/* ================= MESSAGE STRIP ================= */}
      <section className="overflow-hidden border-y border-[#eeeeee] bg-[#fafafa] py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4">
          {activities.map((word) => (
            <div key={word} className="flex items-center gap-8">
              <span className="text-sm font-medium tracking-wide text-[#666666]">
                {word}
              </span>
              <span className="h-2 w-2 rounded-full bg-[#c5c5c5]" />
            </div>
          ))}
        </div>
      </section>

      {/* ================= ABOUT THE DEPARTMENT ================= */}
      <section
        id="about"
        className="bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-12"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Department image */}
          <div className="group relative overflow-hidden rounded-3xl border border-[#eeeeee] bg-[#fafafa] shadow-sm">
            <img
              src="/images/image.jpg"
              alt="Department of Information Technology building"
              className="h-[300px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[420px] lg:h-[480px]"
            />

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-lg backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#777777]">
                Established in 2000
              </p>

              <p className="mt-1 font-serif text-xl font-semibold text-[#252525]">
                Department of Information Technology
              </p>
            </div>
          </div>

          {/* Department information */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#999999]">
              About the Department
            </p>

            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-[#252525] sm:text-4xl lg:text-5xl">
              A foundation for learning, research and innovation.
            </h2>

            <div className="mt-7 space-y-5 text-sm leading-8 text-[#777777] sm:text-base">
              <p>
                The Department of Information Technology was established in
                the year 2000 with the aim to integrate quality education in
                the field of Information Technology. The Department has
                advanced facilities for teaching, learning, and research.
                It offers multidisciplinary research opportunities and
                programmes of study at the postgraduate level.
              </p>

              <p>
                The Department started its two-year Master of Computer
                Science programme in the year 2000, which was among the first
                such programmes under the Open Source platform. The
                Department offers MCA, M.Sc. Computer Science, M.Phil. and
                Ph.D. programmes in Computational Science.
              </p>

              <p>
                The key areas of research include Speech and Signal
                Processing, Medical and Astronomical Image Processing, Data
                Mining, Natural Language Processing, Algorithm Design,
                Algorithms on Big Data, Active Noise Cancellation Techniques
                and General Artificial Intelligence.
              </p>

              <p>
                In 2020, the Department started a Postgraduate Diploma course
                in Data Science and Analytics. With rapidly developing
                technology and the need for innovation, the Department has
                produced excellent professionals holding significant
                positions in the IT industry in India and abroad.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {["Teaching & Learning", "Research", "Innovation"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#eaeaea] bg-[#fafafa] px-4 py-2 text-xs font-semibold text-[#666666]"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= RESEARCH AREAS ================= */}
      <section className="bg-[#fafafa] px-6 py-20 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#999999]">
              Academic Excellence
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#252525] sm:text-5xl">
              Research and innovation.
            </h2>

            <p className="mt-5 text-base leading-8 text-[#777777]">
              The Department encourages multidisciplinary research across
              several important areas of Information Technology and
              Computational Science.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {researchAreas.map((area, index) => (
              <div
                key={area}
                className="flex min-h-[120px] items-start gap-4 rounded-2xl border border-[#eaeaea] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f5f5] text-[#555555]">
                  <span className="text-sm font-semibold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="pt-1 text-sm font-medium leading-6 text-[#555555]">
                  {area}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ALUMNI INTRODUCTION ================= */}
      <section className="bg-white px-6 py-24 sm:px-10 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#999999]">
              Our Alumni Community
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Great journeys are never travelled alone.
            </h2>
          </div>

          <div>
            <p className="max-w-2xl text-base leading-8 text-[#777777] sm:text-lg">
              The people you meet, the lessons you learn, and the experiences
              you share become part of your story. Alumni Connect brings
              together graduates of the Department of Information Technology
              and gives those connections room to continue. Stay connected
              with your department, reconnect with classmates, share
              experiences, and create new opportunities together.
            </p>

            <Link
              to={primaryPath}
              className="mt-7 inline-flex items-center gap-2 border-b border-[#cccccc] pb-2 text-sm font-bold text-[#444444] transition hover:gap-4"
            >
              {user ? "Open your dashboard" : "Be part of the community"}
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-[#fafafa] px-6 py-24 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#999999]">
                What makes us stronger
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Connections with purpose.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-[#777777]">
              A community built on shared beginnings and future possibilities.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.number}
                  className="rounded-3xl border border-[#eaeaea] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-widest text-[#aaaaaa]">
                      {feature.number}
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#eeeeee] bg-[#fafafa] text-[#555555]">
                      <Icon size={23} strokeWidth={1.6} />
                    </div>
                  </div>

                  <h3 className="mt-9 text-2xl font-semibold tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-[#777777]">
                    {feature.description}
                  </p>

                  <div className="mt-7 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#777777]">
                    Explore the possibilities
                    <ArrowUpRight size={15} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative overflow-hidden border-t border-[#eeeeee] bg-white px-6 py-24 text-center sm:px-10 lg:px-12">

        <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#f7f7f5] blur-[100px]" />

        <div className="pointer-events-none absolute -bottom-48 -right-24 h-96 w-96 rounded-full bg-[#f8f8f7] blur-[100px]" />

        <div className="relative mx-auto max-w-3xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#eeeeee] bg-white text-[#555555] shadow-sm">
            <GraduationCap size={28} />
          </div>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.24em] text-[#999999]">
            Your next chapter
          </p>

          <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Together, we can
            <span className="block text-[#777777]">
              go further.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#777777] sm:text-base">
            Join the Department of Information Technology alumni community.
            Celebrate your journey, support fellow graduates, and stay
            connected with the department.
          </p>

          <Link
            to={primaryPath}
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#315f45] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:bg-[#254c37]"
          >
            {user ? "Go to your dashboard" : "Join Alumni Connect"}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

    </main>
  );
}
