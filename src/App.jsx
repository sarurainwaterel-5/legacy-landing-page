import { useState } from "react";
import { ShieldCheck, Users, HeartHandshake, Phone, CalendarDays } from "lucide-react";

export default function LegacyPartnersLandingPage() {const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  phone: "",
  coverageInterest: "",
  ageRange: "",
});

const [status, setStatus] = useState("");

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus("Submitting...");

  try {
    const response = await fetch("http://localhost:5000/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        leadSource: "Legacy Partners Website",
      }),
    });

    const result = await response.json();

    if (result.success) {
      setStatus("success");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        coverageInterest: "",
        ageRange: "",
      });
    } else {
      setStatus("Something went wrong. Please try again.");
    }
  } catch (error) {
    setStatus("Unable to submit right now. Please try again.");
  }
};
  return (
    <div className="min-h-screen bg-[#120304] text-white overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#2b0007] via-[#120304] to-[#24060d] opacity-95 -z-10" />

      {/* Navbar */}
      <header className="w-full border-b border-yellow-700/20 backdrop-blur-md bg-black/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="Legacy Partners"
              className="w-20 h-20 object-contain"
            />

            <div>
              <h1 className="text-2xl font-bold tracking-wide text-white">
                LEGACY
              </h1>
              <p className="text-yellow-400 tracking-[0.3em] text-sm">
                PARTNERS
              </p>
            </div>
          </div>

          <nav className="hidden md:flex gap-10 text-sm font-medium text-gray-200">
            <a href="#" className="hover:text-yellow-400 transition-all">
              Home
            </a>
            <a href="#" className="hover:text-yellow-400 transition-all">
              About
            </a>
            <a href="#" className="hover:text-yellow-400 transition-all">
              Coverage
            </a>
            <a href="#" className="hover:text-yellow-400 transition-all">
              Why Us
            </a>
            <a href="#" className="hover:text-yellow-400 transition-all">
              Contact
            </a>
          </nav>

  <a
  href="https://calendly.com/legacy-partners-agency/30min"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-semibold px-6 py-3 rounded-xl shadow-xl hover:scale-105 transition-all duration-300 inline-block"
>
  Get Free Quote
</a>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div>
          <div className="inline-flex items-center gap-2 border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 rounded-full text-yellow-300 text-sm mb-8">
            Protect What Matters Most
          </div>

          <h1 className="text-6xl lg:text-7xl font-black leading-tight mb-8 tracking-tight">
            Life Insurance
            <span className="block text-yellow-400">
              For Peace Of Mind
            </span>
            And A Stronger Legacy
          </h1>

          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mb-10">
            Legacy Partners helps families protect their income, secure their
            future, and build generational stability through personalized life
            insurance solutions.
          </p>

          <div className="space-y-5 mb-10">
            <div className="flex items-center gap-4 text-lg">
              <ShieldCheck className="text-yellow-400 w-7 h-7" />
              Financial protection for your loved ones
            </div>

            <div className="flex items-center gap-4 text-lg">
              <HeartHandshake className="text-yellow-400 w-7 h-7" />
              Affordable plans tailored to your needs
            </div>

            <div className="flex items-center gap-4 text-lg">
              <Users className="text-yellow-400 w-7 h-7" />
              Legacy-focused family planning support
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <button className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-bold px-8 py-5 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
              <CalendarDays className="w-5 h-5" />
              Book Free Consultation
            </button>

            <button className="border border-yellow-500/40 hover:bg-yellow-500/10 px-8 py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3">
              <Phone className="w-5 h-5 text-yellow-400" />
              Speak To An Advisor
            </button>
          </div>
        </div>

        {/* Right Lead Form */}
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-full" />

          <div className="relative bg-gradient-to-b from-[#3a0810] to-[#1a0407] border border-yellow-500/30 rounded-[2rem] p-10 shadow-[0_0_80px_rgba(255,215,0,0.12)] backdrop-blur-xl">
            <div className="flex justify-center mb-6">
              <img
                src="/logo.png"
                alt="Legacy Partners"
                className="w-28 h-28 object-contain"
              />
            </div>

            <h2 className="text-4xl font-bold text-center mb-3">
              Get Your Free Quote
            </h2>

            <p className="text-gray-300 text-center mb-8 leading-relaxed">
              Explore life insurance options designed around your goals,
              protection needs, and family future.
            </p>

           <form onSubmit={handleSubmit} className="space-y-5">
  <input
    type="text"
    name="fullName"
    value={formData.fullName}
    onChange={handleChange}
    placeholder="Full Name"
    required
    className="w-full bg-black/40 border border-zinc-700 focus:border-yellow-500 px-5 py-4 rounded-xl outline-none transition-all"
  />

  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder="Email Address"
    required
    className="w-full bg-black/40 border border-zinc-700 focus:border-yellow-500 px-5 py-4 rounded-xl outline-none transition-all"
  />

  <input
    type="tel"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    placeholder="Phone Number"
    required
    className="w-full bg-black/40 border border-zinc-700 focus:border-yellow-500 px-5 py-4 rounded-xl outline-none transition-all"
  />

  <select
    name="coverageInterest"
    value={formData.coverageInterest}
    onChange={handleChange}
    required
    className="w-full bg-black/40 border border-zinc-700 focus:border-yellow-500 px-5 py-4 rounded-xl outline-none transition-all text-gray-300"
  >
    <option value="">Coverage Interest</option>
    <option value="Term Life">Term Life</option>
    <option value="Whole Life">Whole Life</option>
    <option value="Mortgage Protection">Mortgage Protection</option>
    <option value="Burial Insurance">Burial Insurance</option>
    <option value="Not Sure Yet">Not Sure Yet</option>
  </select>

  <select
    name="ageRange"
    value={formData.ageRange}
    onChange={handleChange}
    required
    className="w-full bg-black/40 border border-zinc-700 focus:border-yellow-500 px-5 py-4 rounded-xl outline-none transition-all text-gray-300"
  >
    <option value="">Age Range</option>
    <option value="18-30">18–30</option>
    <option value="31-45">31–45</option>
    <option value="46-60">46–60</option>
    <option value="60+">60+</option>
  </select>

  <button
    type="submit"
    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-bold py-5 rounded-2xl hover:scale-[1.02] transition-all duration-300 shadow-2xl text-lg"
  >
    Start My Free Review
  </button>

  {status === "success" && (
  <div className="bg-green-900/40 border border-green-500 rounded-2xl p-6 text-center space-y-4">
    <h3 className="text-2xl font-bold text-green-300">
      Thank You!
    </h3>

    <p className="text-gray-200">
      Your information was received successfully.
      Schedule your free consultation below.
    </p>

<a
  href="https://calendly.com/legacy-partners-agency/30min"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-bold px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all"
>
  Schedule Consultation
</a>
  </div>
)}
</form>               

            <p className="text-xs text-center text-gray-500 mt-5 leading-relaxed">
              Your information is secure and only used to provide insurance
              consultation and coverage information.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#f5eadf] text-[#2b0007] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6">
              Why Choose Legacy Partners?
            </h2>

            <p className="max-w-3xl mx-auto text-lg text-[#5b3138]">
              We focus on helping families build protection strategies rooted in
              financial stability, legacy planning, and long-term peace of mind.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-yellow-200 text-center">
              <div className="text-5xl mb-5">🛡️</div>
              <h3 className="text-2xl font-bold mb-3">Financial Protection</h3>
              <p className="text-[#5b3138] leading-relaxed">
                Help protect loved ones from financial uncertainty.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-yellow-200 text-center">
              <div className="text-5xl mb-5">👨‍👩‍👧‍👦</div>
              <h3 className="text-2xl font-bold mb-3">Family Focused</h3>
              <p className="text-[#5b3138] leading-relaxed">
                Solutions designed around your family goals.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-yellow-200 text-center">
              <div className="text-5xl mb-5">💰</div>
              <h3 className="text-2xl font-bold mb-3">Affordable Plans</h3>
              <p className="text-[#5b3138] leading-relaxed">
                Flexible coverage options tailored to your needs.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-yellow-200 text-center">
              <div className="text-5xl mb-5">🤝</div>
              <h3 className="text-2xl font-bold mb-3">Trusted Guidance</h3>
              <p className="text-[#5b3138] leading-relaxed">
                Professional support every step of the process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/logo.png"
            alt="watermark"
            className="absolute right-10 top-10 w-[500px] opacity-20"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <img
              src="/family.jpg"
              alt="Family"
              className="rounded-[2rem] shadow-2xl border border-yellow-500/20"
            />
          </div>

          <div>
            <h2 className="text-6xl font-black leading-tight mb-8 text-yellow-400">
              Building Legacies.
              <span className="block text-white">
                Securing Tomorrows.
              </span>
            </h2>

            <p className="text-xl text-gray-300 leading-relaxed mb-10">
              Life insurance is more than a policy — it’s a strategy to help
              protect your family’s future, preserve stability, and create peace
              of mind for generations to come.
            </p>

            <button className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-bold px-10 py-5 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300">
              Learn More About Legacy Partners
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-yellow-700/20 py-12 text-center text-gray-500 text-sm bg-black/40 backdrop-blur-md">
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png"
            alt="Legacy Partners"
            className="w-20 h-20 object-contain"
          />
        </div>

        <p>© 2026 Legacy Partners. All rights reserved.</p>

        <p className="mt-3 max-w-2xl mx-auto leading-relaxed">
          Insurance products and services are subject to underwriting and policy
          approval. Coverage options vary by carrier and state.
        </p>
      </footer>
    </div>
  );
}

/*
=====================================================
ASSET SETUP
=====================================================

Place these inside:
/public

Files:
- logo.png
- family.jpg

=====================================================
DOCKERFILE
=====================================================

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

=====================================================
DOCKER COMPOSE
=====================================================

version: '3.9'

services:
  legacy-landing-page:
    build: .
    container_name: legacy-landing-page
    ports:
      - "8080:80"
    restart: unless-stopped

=====================================================
RUN COMMANDS
=====================================================

Build:

docker compose build

Start:

docker compose up -d

Open browser:

http://localhost:8080
*/
