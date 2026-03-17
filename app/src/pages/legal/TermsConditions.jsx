import React from 'react';
import { Gavel, Scale, AlertCircle, TriangleAlert, UserRoundX, FileText, Mail, Phone, ExternalLink, ShieldAlert, BadgeX, Ban, Cookie, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight uppercase">Terms & Conditions</h1>
          <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
            <p>Effective Date: <span className="text-purple-500 font-medium">04/12/2023</span></p>
            <p>Last Updated: <span className="text-purple-500 font-medium">26/06/2025</span></p>
          </div>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground leading-relaxed pt-4">
            Welcome to Maheshwari Visuals! By accessing or using our website (<a href="https://maheshwarivisuals.com" className="text-purple-500 hover:underline">maheshwarivisuals.com</a>, <a href="https://dashboard.maheshwarivisuals.com" className="text-purple-500 hover:underline px-1">dashboard.maheshwarivisuals.com</a>) and services, you agree to comply with the following terms and conditions. Please read them carefully.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Section 1: Introduction */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Maheshwari Visuals provides music distribution and artist services to creators and labels. These terms govern your use of our website and services. By using our platform, you confirm that you are at least 18 years old or have parental/guardian consent.
              </p>
            </CardContent>
          </Card>

          {/* Section 2: Services Overview */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Scale className="w-5 h-5 text-purple-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">2. Services Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>We offer:</p>
              <ul className="space-y-2 ml-2">
                {[
                  "Music distribution to digital platforms (DSPs)",
                  "YouTube CMS",
                  "Merch Launch via Music Merch Company (musicmerchcompany.com)",
                  "Royalty reports and payouts",
                  "Music Marketing, Playlist pitching and promotional tools",
                  "Callertune integration for Indian artists"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Section 3: User Obligations */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <UserRoundX className="w-5 h-5 text-green-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">3. User Obligations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="mb-2">As a user, you agree to:</p>
              <ul className="space-y-3 ml-2">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <p>Provide accurate and complete information during registration and KYC.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <p>Ensure that all uploaded content is original and does not infringe on third-party copyrights.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <p>Comply with all applicable laws and regulations.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 4: Intellectual Property */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Gavel className="w-5 h-5 text-red-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">4. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <ul className="space-y-3 ml-2">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  <p>You retain ownership of your music and associated copyrights.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  <p>By using our services, you grant Maheshwari Visuals an exclusive license to distribute your content to DSPs.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5: Payments and Royalties */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">5. Payments and Royalties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <ul className="space-y-3 ml-2">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                  <p>Royalties are calculated based on DSP reports and paid monthly.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                  <p>Users are responsible for providing accurate bank and tax details.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                  <p>Maheshwari Visuals reserves the right to withhold payments in cases of suspected fraud or policy violations.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 6: Prohibited Activities */}
          <Card className="">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-rose-500/10 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight ">6. Prohibited Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="mb-2">You may not:</p>
              <ul className="space-y-3 ml-2">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <p>Upload content that violates copyright laws or contains offensive material.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <p>Engage in artificial streaming or fraudulent activities.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <p>Attempt to bypass our security measures or disrupt services.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 7: Termination Policy */}
          <Card className="">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Ban className="w-5 h-5 text-red-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight ">7. Termination Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="mb-2 font-semibold">We follow a 3-Strike Policy:</p>
              <ul className="space-y-3 ml-2">
                <li className="flex gap-3">
                  <p><strong className="text-white">1. First Strike:</strong> Warning issued to the user.</p>
                </li>
                <li className="flex gap-3">
                  <p><strong className="text-white">2. Second Strike:</strong> Penalties imposed (e.g., release holds, royalty freezes).</p>
                </li>
                <li className="flex gap-3">
                  <p><strong className="text-white">3. Third Strike:</strong> Permanent ban and removal of all content from our platform.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 8: Limitation of Liability */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <TriangleAlert className="w-5 h-5 text-orange-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="mb-2">Maheshwari Visuals is not liable for:</p>
              <ul className="space-y-3 ml-2">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                  <p>Loss of revenue due to DSP delays or technical issues.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                  <p>Unauthorized access to your account caused by user negligence.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

           {/* Section 9: Privacy and Cookies */}
           <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Cookie className="w-5 h-5 text-cyan-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">9. Privacy and Cookies</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Our Privacy Policy and Cookie Policy explain how we collect, use, and protect your data. By using our services, you consent to these policies.
              </p>
            </CardContent>
          </Card>

          {/* Section 10: Changes to Terms */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <RefreshCw className="w-5 h-5 text-indigo-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">10. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                We may update these terms periodically. Continued use of our services after updates constitutes acceptance of the revised terms.
              </p>
            </CardContent>
          </Card>

          {/* Section 11: Contact Us Section */}
          <Card className="border-slate-700 bg-slate-900/40">
            <CardContent className="p-8">
              <div className="text-center max-w-2xl mx-auto space-y-6">
                <h3 className="text-2xl font-bold text-foreground">11. Contact Us</h3>
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

export default TermsConditions;
