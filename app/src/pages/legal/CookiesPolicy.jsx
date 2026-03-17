import React from 'react';
import { Cookie, ShieldCheck, Info, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CookiesPolicy = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight uppercase">Cookie Policy</h1>
          <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
            <p>Effective Date: <span className="text-purple-500 font-medium">04/12/2023</span></p>
            <p>Last Updated: <span className="text-purple-500 font-medium">26/06/2025</span></p>
          </div>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground leading-relaxed pt-4">
            Maheshwari Visuals ("we," "us," or "our") uses cookies and similar tracking technologies to enhance your experience on our website (maheshwarivisuals.com, dashboard.maheshwarivisuals.com). This policy explains what cookies are, how we use them, and your choices regarding their usage.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Section 1: What Are Cookies? */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Cookie className="w-5 h-5 text-blue-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">1. What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Cookies are small text files stored on your device when you visit a website. They help improve functionality, analyze site performance, and personalize user experience.
              </p>
            </CardContent>
          </Card>

          {/* Section 2: How We Use Cookies */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-purple-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">2. How We Use Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="mb-2">We use cookies for the following purposes:</p>
              <ul className="space-y-3 ml-2">
                {[
                  { title: "Essential Cookies", desc: "Required for website functionality (e.g., login, security)." },
                  { title: "Performance Cookies", desc: "Help us analyze traffic and optimize user experience." },
                  { title: "Marketing Cookies", desc: "Used for personalized ads and promotions." },
                  { title: "Third-Party Cookies", desc: "Set by external services like Google Analytics, Facebook Pixel, and Spotify integrations." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                    <p><strong className="text-foreground">{item.title}:</strong> {item.desc}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Section 3: Managing Cookies */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Info className="w-5 h-5 text-green-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">3. Managing Cookies</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                You can control or disable cookies through your browser settings. However, restricting cookies may impact certain website features.
              </p>
            </CardContent>
          </Card>

          {/* Section 4: Third-Party Services */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-yellow-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">4. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Some cookies are placed by third-party providers for analytics and advertising. We encourage users to review their respective privacy policies.
              </p>
            </CardContent>
          </Card>

          {/* Section 5: Updates to This Policy */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Info className="w-5 h-5 text-orange-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">5. Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                We may update this policy periodically. Changes will be posted on this page with a revised effective date.
              </p>
            </CardContent>
          </Card>

          {/* Section 6: Contact Us */}
          <Card className="border-slate-700 bg-slate-900/40">
            <CardContent className="p-8">
              <div className="text-center max-w-2xl mx-auto space-y-6">
                <h3 className="text-2xl font-bold text-foreground">6. Contact Us</h3>
                <p className="text-muted-foreground px-4">For questions or concerns, contact us at:</p>
                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-4 p-4 bg-background rounded-xl border border-slate-700/50">
                    <Mail className="w-5 h-5 text-purple-500" />
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email</p>
                      <a href="mailto:contact@maheshwarivisuals.com" className="text-sm text-foreground font-medium truncate hover:text-purple-500 transition-colors">
                        contact@maheshwarivisuals.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-background rounded-xl border border-slate-700/50">
                    <Phone className="w-5 h-5 text-purple-500" />
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Call</p>
                      <a href="tel:+9105833796906" className="text-sm text-foreground font-medium hover:text-purple-500 transition-colors">
                        +91 05833796906
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center text-xs text-muted-foreground/60 pt-10">
          © 2022-2025 Maheshwari Visuals PVT LTD. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicy;
