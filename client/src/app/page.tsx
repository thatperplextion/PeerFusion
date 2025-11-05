import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10 -z-10" />
        
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-block mb-6 px-4 py-2 bg-primary/10 rounded-full">
            <span className="text-sm font-medium text-primary">Welcome to the Future of Collaboration</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Connect. Collaborate. <br />
            <span className="text-primary">Create Together.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students and educators on PeerFusion—the ultimate platform for 
            collaborative research, skill-sharing, and building meaningful academic connections.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25 min-w-[200px]"
            >
              <span className="relative z-10">Get Started Free</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-foreground bg-card border-2 border-border rounded-xl transition-all duration-300 hover:border-primary hover:shadow-lg min-w-[200px]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Why Choose PeerFusion?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to collaborate, learn, and grow in one place
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Collaborative Research
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with peers and mentors to work on groundbreaking research projects together.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Skill Exchange
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Teach what you know, learn what you don't. Share expertise and explore new skills.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Mentorship Network
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Get guidance from experienced professionals who can accelerate your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Create Your Profile</h3>
              <p className="text-muted-foreground leading-relaxed">
                Set up your academic profile, highlight your skills, and showcase your research interests
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Connect & Collaborate</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find like-minded individuals, join research groups, and start collaborative projects
              </p>
            </div>
            
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Share & Grow</h3>
              <p className="text-muted-foreground leading-relaxed">
                Share your knowledge, learn from others, and advance your academic career
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Showcase Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Beautiful in Every Theme
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience PeerFusion in light, dark, or system theme - all with smooth transitions
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-8 transition-smooth hover:shadow-xl hover:border-primary/50 hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3 text-center">Light Theme</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Clean, bright interface perfect for daytime use
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-8 transition-smooth hover:shadow-xl hover:border-primary/50 hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3 text-center">Dark Theme</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Easy on the eyes for late-night study sessions
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-8 transition-smooth hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3 text-center">System Theme</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Automatically matches your device preference
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary -z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20 -z-10" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Transform Your <br className="hidden sm:block" />Academic Journey?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students and educators already collaborating on PeerFusion
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-primary bg-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Start Collaborating Today
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="mt-6 text-sm text-white/80">
            No credit card required • Free forever • 2 minute setup
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border text-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold mb-4 text-foreground">PeerFusion</h3>
              <p className="text-muted-foreground leading-relaxed">
                Empowering academic collaboration and skill sharing for students and teachers worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4 text-foreground">Platform</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-primary transition-smooth">Dashboard</Link></li>
                <li><Link href="/search" className="hover:text-primary transition-smooth">Search</Link></li>
                <li><Link href="/projects" className="hover:text-primary transition-smooth">Projects</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4 text-foreground">Support</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link href="/help" className="hover:text-primary transition-smooth">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-smooth">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-smooth">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary transition-smooth">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-smooth">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 PeerFusion. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
