import React from 'react';
import { FileText, Handshake, UserCheck, Megaphone, DollarSign, XCircle, Gavel, Mail, Phone, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ContentPolicy = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight uppercase">Content Policy</h1>
          <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
            <p>Effective Date: <span className="text-purple-500 font-medium">04/12/2023</span></p>
            <p>Last Updated: <span className="text-purple-500 font-medium">26/06/2025</span></p>
          </div>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground leading-relaxed pt-4">
            Maheshwari Visuals ("we," "us," or "our") is committed to providing artists and labels with a transparent and fair platform for exclusive content distribution. This policy outlines the terms and conditions for content designated as "exclusive" on our platform/website (<a href="https://maheshwarivisuals.com" className="text-purple-500 hover:underline">maheshwarivisuals.com</a>, <a href="https://dashboard.maheshwarivisuals.com" className="text-purple-500 hover:underline px-1">dashboard.maheshwarivisuals.com</a>).
          </p>
        </div>

        <div className="grid gap-6">
          {/* Section 1: Definition of Exclusive Content */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">1. Definition of Exclusive Content</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Exclusive content refers to music, videos, or other creative works that are distributed solely through Maheshwari Visuals for a specified period or indefinitely, as agreed upon by the artist/label/aggregators and Maheshwari Visuals.
              </p>
            </CardContent>
          </Card>

          {/* Section 2: Terms of Exclusivity */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Handshake className="w-5 h-5 text-purple-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">2. Terms of Exclusivity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <ul className="space-y-3 ml-2">
                {[
                  { title: "Duration", desc: "The exclusivity period will be defined in the distribution agreement (e.g., 6 months, 1 year, or indefinite)." },
                  { title: "Territory", desc: "Exclusivity may apply globally or to specific regions, as specified in the agreement." },
                  { title: "Platforms", desc: "Exclusive content will not be distributed to other platforms or services outside of Maheshwari Visuals during the exclusivity period." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                    <p><strong className="text-foreground">{item.title}:</strong> {item.desc}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Section 3: Artist/Label/Aggregators Obligations */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">3. Artist/Label/Aggregators Obligations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="mb-2">By designating content as exclusive, the artist/label agrees to:</p>
              <ul className="space-y-3 ml-2">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <p>Not distribute the same content through any other distributor, platform, or service during the exclusivity period.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <p>Ensure that the content is original and does not infringe on third-party rights.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 4: Maheshwari Visuals Obligations */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Megaphone className="w-5 h-5 text-yellow-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">4. Maheshwari Visuals Obligations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="mb-2">We commit to:</p>
              <ul className="space-y-3 ml-2">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                  <p>Prioritize the promotion and distribution of exclusive content.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                  <p>Provide detailed analytics and insights for exclusive releases.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5: Revenue and Royalties */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-pink-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-pink-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">5. Revenue and Royalties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
              <ul className="space-y-3 ml-2">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0" />
                  <p>The Royalties will be paid to Artists/labels/Aggregators generated from exclusive content as per their plan/agreement.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0" />
                  <p>Maheshwari Visuals will provide Monthly royalty reports and ensure timely payouts.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 6: Termination of Exclusivity */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <XCircle className="w-5 h-5 text-orange-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">6. Termination of Exclusivity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
              <ul className="space-y-3 ml-2">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                  <p>Artists/labels may request to terminate exclusivity after the agreed period by providing [Insert Notice Period] days' written notice.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                  <p>Early termination may result in penalties, as outlined in the distribution agreement.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 7: Dispute Resolution */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Gavel className="w-5 h-5 text-cyan-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">7. Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Any disputes regarding exclusive content will be resolved in accordance with the terms outlined in the distribution agreement.
              </p>
            </CardContent>
          </Card>

          {/* Contact Us Section */}
          <Card className="border-slate-700 bg-slate-900/40">
            <CardContent className="p-8">
              <div className="text-center max-w-2xl mx-auto space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Contact Us</h3>
                <p className="text-muted-foreground px-4">For questions or concerns, contact us at:</p>
                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-4 p-4 bg-background rounded-xl border border-slate-700/50">
                    <Mail className="w-5 h-5 text-purple-500" />
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email</p>
                      <a href="mailto:Contact@maheshwarivisuals.com" className="text-sm text-foreground font-medium truncate hover:text-purple-500 transition-colors">
                        Contact@maheshwarivisuals.com
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

export default ContentPolicy;
