import React from 'react';
import { Lock, Mail, Phone, Shield, Truck, Info } from 'lucide-react';
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
          {/* Section 1: No Refund Policy */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-blue-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">1. No Refund Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <ul className="space-y-4 ml-2">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <p>All transactions processed through Maheshwari Visuals are <strong className="text-foreground">final and non-refundable</strong>.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <p>Once payment has been successfully completed, no cancellations, refunds, credits, or exchanges will be permitted under any circumstances.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <p>Clients are advised to carefully review all service details, product specifications, and distribution requirements prior to purchase.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <p>By engaging with Maheshwari Visuals, you acknowledge and consent to this strict no-refund policy.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 2: Shipping & Delivery Policy */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Truck className="w-5 h-5 text-purple-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">2. Shipping & Delivery Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
              <div className="space-y-3">
                <h4 className="text-foreground font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  Digital Services:
                </h4>
                <ul className="space-y-2 ml-6">
                  <li className="flex gap-3">
                    <div className="w-1 h-1 rounded-full bg-purple-500/50 mt-2 shrink-0" />
                    <p>Music distribution services, licenses, and digital deliverables will be provided electronically via email or through designated online platforms.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1 h-1 rounded-full bg-purple-500/50 mt-2 shrink-0" />
                    <p>Delivery timelines may vary depending on processing requirements, platform approvals, and technical factors.</p>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-foreground font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  Physical Products (if applicable):
                </h4>
                <ul className="space-y-2 ml-6">
                  <li className="flex gap-3">
                    <div className="w-1 h-1 rounded-full bg-purple-500/50 mt-2 shrink-0" />
                    <p>Any physical items such as promotional materials, merchandise, or hard copies will be shipped using recognized courier or postal services.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1 h-1 rounded-full bg-purple-500/50 mt-2 shrink-0" />
                    <p>Customers are responsible for providing accurate and complete shipping information. Maheshwari Visuals shall not be held liable for delays, losses, or misdeliveries caused by incorrect addresses or third-party courier errors.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1 h-1 rounded-full bg-purple-500/50 mt-2 shrink-0" />
                    <p>Estimated delivery times will be communicated at the point of sale; however, these are subject to change based on courier availability and destination.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1 h-1 rounded-full bg-purple-500/50 mt-2 shrink-0" />
                    <p>For international shipments, all customs duties, taxes, and additional fees are the sole responsibility of the customer.</p>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Limitation of Liability */}
          <Card className="border-slate-700 bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Lock className="w-5 h-5 text-green-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">3. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <ul className="space-y-3 ml-2">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <p>Maheshwari Visuals shall not be liable for delays or failures in delivery arising from circumstances beyond its reasonable control, including but not limited to courier delays, technical issues, or force majeure events.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <p>Responsibility for verifying the accuracy of order details rests with the customer.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 4: Contact Us */}
          <Card className="border-slate-700 bg-slate-900/40">
            <CardContent className="p-8">
              <div className="text-center max-w-2xl mx-auto space-y-6">
                <h3 className="text-2xl font-bold text-foreground">4. Contact Us</h3>
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

export default ShippingRefundPolicy;
