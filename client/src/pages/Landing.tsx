import { Link } from "react-router-dom";
import {
  Zap,
  ArrowRight,
  BarChart3,
  Shield,
  Globe,
  Link2,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  CreditCard,
  Globe2,
  Layers,
  Video,
} from "lucide-react";
import { Button } from "../components/ui/Button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg-page selection:bg-primary-light selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-light p-1.5 rounded-lg text-primary">
              <Zap className="h-5 w-5 fill-primary/20" />
            </div>
            <span className="text-xl font-bold text-text-primary tracking-tight">
              Shortify
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors hidden md:block"
            >
              Sign in
            </Link>
            <Link to="/register">
              <Button size="sm" className="shadow-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-4 overflow-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-light/40 rounded-full blur-3xl -z-10" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light/50 border border-primary-border mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">
              Shortify is live
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary tracking-tight mb-6 animate-fade-in-up animation-delay-100">
            Make every link <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">
              work harder for you
            </span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200 leading-relaxed">
            Shortify is the ultimate link management platform. Create short
            links, track clicks in real-time, and boost your brand's engagement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up animation-delay-300">
            <Link to="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto shadow-lg shadow-primary/20 group"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto bg-white/50 backdrop-blur-sm"
              >
                View Demo
              </Button>
            </Link>
          </div>

          {/* Floating UI Mockup */}
          <div className="relative mx-auto max-w-4xl animate-fade-in-up animation-delay-400">
            <div className="rounded-2xl border border-border bg-white shadow-xl p-2 md:p-4 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src="/src/assets/hero.png"
                alt="Dashboard Preview"
                className="w-full h-auto rounded-xl border border-border shadow-sm"
              />
              {/* Glassmorphism floaters */}
              <div className="absolute -left-6 top-1/4 bg-white/80 backdrop-blur-md p-4 rounded-xl border border-border shadow-xl hidden lg:flex items-center gap-4 animate-bounce-slow">
                <div className="bg-success-bg p-2 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">+12,490</p>
                  <p className="text-xs text-text-secondary">Clicks today</p>
                </div>
              </div>
              <div className="absolute -right-6 bottom-1/4 bg-white/80 backdrop-blur-md p-4 rounded-xl border border-border shadow-xl hidden lg:flex items-center gap-4 animate-bounce-slow animation-delay-500">
                <div className="bg-primary-light p-2 rounded-lg">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">
                    84 countries
                  </p>
                  <p className="text-xs text-text-secondary">Global reach</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 border-y border-border bg-white/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-text-muted uppercase tracking-widest mb-6">
            Trusted by innovative teams worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {["Acme Corp", "GlobalTech", "Nexus", "Starlight", "Quantum"].map(
              (company) => (
                <div
                  key={company}
                  className="text-xl md:text-2xl font-bold text-text-secondary"
                >
                  {company}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Everything you need to manage links
            </h2>
            <p className="text-text-secondary text-lg">
              Powerful tools that help you track, optimize, and scale your
              marketing efforts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Link2,
                title: "Custom Short Links",
                desc: "Create memorable, branded links that drive higher click-through rates.",
                color: "text-primary",
                bg: "bg-primary-light",
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                desc: "Track every click with detailed insights into locations, devices, and referrers.",
                color: "text-success",
                bg: "bg-success-bg",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                desc: "Enterprise-grade security with password protection and expiry dates.",
                color: "text-warning",
                bg: "bg-warning-bg",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-border bg-bg-page hover:-translate-y-2 hover:shadow-xl hover:border-primary-border transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${feature.bg}`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-24 px-4 bg-bg-page relative overflow-hidden"
      >
        {/* Background glows — light-friendly */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-violet-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4 tracking-tight">
              Pick a pricing that
              <br />
              fits your needs
            </h2>
            <p className="text-text-secondary text-base md:text-lg">
              Every plan includes a free tier. Choose the one that fits your
              needs.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-5 items-stretch">
            {/* Free */}
            <div className="relative bg-white border border-border rounded-2xl p-7 flex flex-col hover:border-primary-border hover:shadow-lg transition-all duration-300 group">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-text-primary mb-1">
                  Free
                </h3>
                <p className="text-text-secondary text-sm leading-snug">
                  For individuals just getting started with link management.
                </p>
              </div>
              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-extrabold text-text-primary">
                    $0
                  </span>
                  <span className="text-text-muted text-sm mb-2">/ Month</span>
                </div>
              </div>
              <Link to="/register">
                <button className="w-full py-3 rounded-xl bg-bg-muted hover:bg-border text-text-primary font-semibold text-sm transition-colors border border-border hover:border-primary-border">
                  Get started free
                </button>
              </Link>
              <div className="mt-7 pt-6 border-t border-border flex-1">
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-4">
                  Free plan includes
                </p>
                <ul className="space-y-3">
                  {[
                    {
                      text: "25 short links / month",
                      color: "text-text-secondary",
                    },
                    { text: "Basic analytics", color: "text-text-secondary" },
                    { text: "Custom slugs", color: "text-text-secondary" },
                    { text: "Link expiration", color: "text-text-secondary" },
                    { text: "1 member seat", color: "text-text-secondary" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-text-muted" />
                      <span className={`text-sm ${item.color}`}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pro — Elevated */}
            <div className="relative bg-white rounded-2xl p-7 flex flex-col shadow-2xl shadow-primary/20 ring-2 ring-primary scale-[1.03] z-10">
              {/* Popular badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-white text-xs font-bold tracking-wide shadow-lg shadow-primary/30 whitespace-nowrap">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-text-primary mb-1">
                  Pro
                </h3>
                <p className="text-text-secondary text-sm leading-snug">
                  For teams that need more power and flexibility.
                </p>
              </div>
              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-extrabold text-text-primary">
                    $29
                  </span>
                  <span className="text-text-muted text-sm mb-2">/ Month</span>
                </div>
              </div>
              <Link to="/register">
                <button className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5">
                  Get started
                </button>
              </Link>
              <div className="mt-7 pt-6 border-t border-border flex-1">
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-4">
                  Pro plan includes
                </p>
                <ul className="space-y-3">
                  {[
                    { text: "Unlimited short links", color: "text-primary" },
                    { text: "Full analytics dashboard", color: "text-primary" },
                    { text: "Custom slugs & domains", color: "text-primary" },
                    { text: "Password protection", color: "text-primary" },
                    { text: "Priority email support", color: "text-primary" },
                    { text: "10 member seats", color: "text-primary" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${item.color}`}
                      />
                      <span className="text-sm text-text-secondary font-medium">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Enterprise */}
            <div className="relative bg-white border border-border rounded-2xl p-7 flex flex-col hover:border-primary-border hover:shadow-lg transition-all duration-300 group">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-text-primary mb-1">
                  Enterprise
                </h3>
                <p className="text-text-secondary text-sm leading-snug">
                  For large organizations with custom needs.
                </p>
              </div>
              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-extrabold text-text-primary">
                    Custom
                  </span>
                </div>
                <p className="text-text-muted text-xs mt-1">Billed annually</p>
              </div>
              <a href="mailto:sales@shortify.io">
                <button className="w-full py-3 rounded-xl bg-bg-muted hover:bg-border text-text-primary font-semibold text-sm transition-colors border border-border hover:border-primary-border">
                  Contact sales
                </button>
              </a>
              <div className="mt-7 pt-6 border-t border-border flex-1">
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-4">
                  Enterprise plan includes
                </p>
                <ul className="space-y-3">
                  {[
                    { text: "Everything in Pro", color: "text-violet-600" },
                    { text: "Custom integrations", color: "text-violet-600" },
                    {
                      text: "Dedicated account manager",
                      color: "text-violet-600",
                    },
                    { text: "SSO & SAML", color: "text-violet-600" },
                    { text: "24/7 phone support", color: "text-violet-600" },
                    {
                      text: "Unlimited member seats",
                      color: "text-violet-600",
                    },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${item.color}`}
                      />
                      <span className="text-sm text-text-secondary">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom note */}
          <p className="text-center text-text-muted text-sm mt-10">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-text-secondary text-lg">
                Quick answers to questions you may have. Can't find what you're
                looking for?
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              {
                icon: HelpCircle,
                question: "Is there a free trial available?",
                answer:
                  "Yes, you can try our Pro features for free for 14 days. No credit card required to start your trial and see the power of advanced analytics.",
              },
              {
                icon: Layers,
                question: "Can I change my plan later?",
                answer:
                  "Of course you can! Our pricing scales with your needs. You can upgrade or downgrade your plan at any time from your dashboard settings.",
              },
              {
                icon: MessageCircle,
                question: "What is your cancellation policy?",
                answer:
                  "We understand that things change. You can cancel your subscription at any time, and you'll continue to have access until the end of your billing cycle.",
              },
              {
                icon: Globe2,
                question: "Can I use my own custom domain?",
                answer:
                  "Yes! Pro and Enterprise users can connect their own branded domains to create custom short links that build brand trust and recognition.",
              },
              {
                icon: CreditCard,
                question: "How does billing work?",
                answer:
                  "Billing is simple and transparent. Plans are per account, and you can choose between monthly or annual billing for extra savings.",
              },
              {
                icon: Video,
                question: "Do you provide tutorials?",
                answer:
                  "We have an extensive library of video tutorials and step-by-step guides in our documentation to help you get the most out of Shortify.",
              },
            ].map((faq, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-xl border border-border bg-bg-page flex items-center justify-center text-text-secondary group-hover:border-primary-border group-hover:text-primary transition-colors">
                    <faq.icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}

      <section className="py-24 px-4 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to supercharge your links?
          </h2>
          <p className="text-primary-light text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of marketers and creators who use Shortify to
            understand their audience and drive growth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <button className="h-14 px-8 rounded-xl bg-white text-primary font-bold text-lg hover:bg-bg-page transition-colors shadow-lg shadow-black/10">
                Get Started for Free
              </button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-primary-light text-sm font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-white" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-white" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-white" />
              14-day free trial on Pro
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-bold text-text-primary">Shortify</span>
          </div>
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} Shortify Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-text-secondary">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
