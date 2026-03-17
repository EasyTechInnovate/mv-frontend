import React from 'react';
import { Database, Share2, Cookie, Lock, UserRoundCog, ExternalLink, Mail, Phone, Globe, Info, Shield, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ShippingRefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight uppercase">Shipping & Refund Policy</h1>
          <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
            <p>Effective Date: <span className="text-purple-500 font-medium">04/12/2023</span></p>
            <p>Last Updated: <span className="text-purple-500 font-medium">26/06/2025</span></p>
          </div>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground leading-relaxed pt-4">
            Maheshwari Visuals ("we," "us," or "our") is committed to give you the best industry standard Music Distribution services. This Policy explains how we ship/provide our services and process the refunds when you visit our website (maheshwarivisuals.com, Dashboard.maheshwarivisuals.com) or use our services.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Section 1: Information We Collect */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Database className="w-5 h-5 text-blue-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>We may collect the following types of information:</p>
              <ul className="space-y-4 ml-2">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <p><strong className="text-foreground">Personal Information:</strong> Name, email address, phone number, payment details, and identification documents (e.g., Aadhaar, PAN, Passport).</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <p><strong className="text-foreground">Usage Data:</strong> IP address, browser type, operating system, and browsing behavior on our website.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <p><strong className="text-foreground">Cookies and Tracking Data:</strong> Information collected through cookies to enhance user experience and analyze website performance.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 2: How We Use Your Information */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-purple-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>We use your information to:</p>
              <ul className="space-y-2 gap-4 ml-2">
                {[
                  "Provide and improve our services, including music distribution and royalty management.",
                  "Process payments and comply with legal obligations (e.g., tax reporting).",
                  "Communicate with you regarding updates, promotions, and support.",
                  "Analyze website traffic and user behavior to enhance functionality."
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Section 3: Sharing Your Information */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Share2 className="w-5 h-5 text-green-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">3. Sharing Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>We do not sell your personal information. However, we may share your data with:</p>
              <ul className="space-y-3 ml-2">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <p><strong className="text-foreground">Service Providers:</strong> For payment processing, analytics, and marketing.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <p><strong className="text-foreground">Legal Authorities:</strong> When required by law or to protect our rights.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <p><strong className="text-foreground">DSPs (Digital Service Providers):</strong> To distribute your music and manage royalties.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 4: Cookies and Tracking Technologies */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Cookie className="w-5 h-5 text-yellow-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">4. Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>We use cookies to:</p>
              <ul className="space-y-3 ml-2">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                  <p>Remember your preferences and login details.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                  <p>Analyze website traffic and improve user experience.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                  <p>Deliver personalized ads and promotions.</p>
                </li>
              </ul>
              <p className="mt-4">
                You can manage or disable cookies through your browser settings. For more details, see our <a href="/app/legal/cookies-policy" className="text-purple-500 hover:underline">Cookie Policy</a>.
              </p>
            </CardContent>
          </Card>

          {/* Section 5: Data Security */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Lock className="w-5 h-5 text-red-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">5. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                We implement industry-standard security measures to protect your data. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          {/* Section 6: Your Rights */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <UserRoundCog className="w-5 h-5 text-orange-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">6. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="space-y-3 ml-2">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                  <p>Access, update, or delete your personal information.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                  <p>Withdraw consent for data processing.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                  <p>File a complaint with a data protection authority.</p>
                </li>
              </ul>
              <p className="pt-2">To exercise your rights, contact us at <a href="mailto:contact@maheshwarivisuals.com" className="text-purple-500 hover:underline">contact@maheshwarivisuals.com</a></p>
            </CardContent>
          </Card>

          {/* Section 7: Third-Party Links */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Globe className="w-5 h-5 text-indigo-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">7. Third-Party Links</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Our website may contain links to third-party websites. We are not responsible for their privacy practices.
              </p>
            </CardContent>
          </Card>

          {/* Section 8: Changes to This Policy */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-cyan-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">8. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                We may update this Privacy Policy periodically. Changes will be posted on this page with a revised effective date.
              </p>
            </CardContent>
          </Card>

          {/* Section 9: Contact Us */}
          <Card className="border-slate-700 bg-slate-900/40">
            <CardContent className="p-8">
              <div className="text-center max-w-2xl mx-auto space-y-6">
                <h3 className="text-2xl font-bold text-foreground">9. Contact Us</h3>
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

export default ShippingRefundPolicy;
