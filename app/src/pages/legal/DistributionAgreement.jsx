import React from 'react';
import { Scale, FileText, CircleCheck, CircleAlert, Mail, Phone, ExternalLink, UserCheck, Info, DollarSign, Gavel, Megaphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DistributionAgreement = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center gap-2 text-sm text-foreground uppercase tracking-widest font-bold">
            <p>INTELLECTUAL PROPERTY AGREEMENT / DISTRIBUTION AGREEMENT /</p>
            <p>MV AGREEMENT</p>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto text-muted-foreground">
            <p>
              This Intellectual Property Agreement (hereinafter referred to as "Agreement") is executed on the signup date of the Firm
            </p>
            <p>
              We are a Firm named "Maheshwari Visuals", based out of Uttar Pradesh and the Industry we cater to is "Sound & Video recordings"
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Parties Section */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <UserCheck className="w-5 h-5 text-blue-500" />
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">BY AND BETWEEN</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
              <div>
                <p>
                  <strong className="text-foreground">Maheshwari Visuals</strong> having the website (
                  <a href="https://maheshwarivisuals.com" target="_blank" className="text-purple-500 hover:underline">maheshwarivisuals.com</a>, 
                  <a href="https://dashboard.maheshwarivisuals.com" target="_blank" className="text-purple-500 hover:underline px-1">dashboard.maheshwarivisuals.com</a>,
                  ) ("Maheshwari Visuals", "Firm", "we", "us" and "our"), a sole Proprietorship Firm having its registered office at "Galla Mandi Road, Near Kachhala Bus Stand, C/O HARSHIT MAHESHWARI, Maheshwari Complex, Galla Mandi Road, Bilsi, Budaun, Uttar Pradesh, 243633, India" (which expression shall, unless repugnant to the meaning or context thereof, be deemed to mean and include its directors, nominees, assigns, employees, contractors, affiliates, agents, representatives and successors.
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">AND</p>
              </div>
              <div>
                <p>
                  This Agreement applies to Users who use the services of the platform (the "Digital Distribution Services, Marketing services, CMS, Merch launch,") and shall be effective as of the date you sign up to the Platform.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Definitions Section */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed pt-6">
              <p>
                In this Agreement, the party granting the right to use the licensed property, User, will be referred to as the "User" and the party who is receiving the right to use the licensed property, Firm, will be referred to as the "Firm." Shall be referred to individually as "Party" and as "Parties" collectively, as the context may require.
              </p>
              <ul className="space-y-4 pt-2">
                <li>1. User owns all proprietary rights in and to the copyright-able and/or copyrighted works described in this Agreement. The copyrighted works will collectively be referred to as "Work."</li>
                <li>2. User owns all rights in and to the Work and retains all rights to the Work, which are not transferred herein, and retains all common law copyrights and all federal copyrights which have been, or which may be, granted by the Library of Congress.</li>
                <li>3. Firm desires to obtain, and Licensor has agreed to grant, a license authorizing the use of the Work by Licensee in accordance with the terms and conditions of this Agreement.</li>
              </ul>
              <p>The parties agree to abide by the terms as follows:</p>
            </CardContent>
          </Card>

          {/* Section 1: GRANT OF LICENSE */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">1. GRANT OF LICENSE.</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                The user owns Property To Be Licensed ("Property"). In accordance with this Agreement, User grants Firm an exclusive license to Use or Sell Highlight The Terms That Apply the Property. The user retains title and Ownership of the Property. Firm will own all rights to materials, products or other works (the Work) created by Firm in connection with this license. This grant of license applies only to the following described geographical area:
              </p>
            </CardContent>
          </Card>

          {/* Section 2: RIGHTS AND OBLIGATIONS */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">2. RIGHTS AND OBLIGATIONS.</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Firm shall be the sole owner of the Work and all proprietary rights in and to the Work; however, such ownership shall not include ownership of the copyright in and to the Property or any other rights to the Property not specifically granted in this Agreement.
              </p>
            </CardContent>
          </Card>

          {/* Section 3: Payment */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader className="flex flex-row items-center gap-4">
              <CardTitle className="text-xl font-bold uppercase tracking-tight">3. PAYMENT.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 text-muted-foreground pl-6">
              <p className="font-bold  p-2 rounded inline-block">3.1 Firm agrees to pay User a royalty which shall be calculated as follows:</p>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="space-y-6">
                  {/* Distribution Services Table */}
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left font-bold text-foreground pb-2">Plan Name</th>
                        <th className="text-right font-bold text-foreground pb-2">Royalty (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      <tr>
                        <td className="py-3">One Song Distribution Service</td>
                        <td className="py-3 text-right">90%</td>
                      </tr>
                      <tr>
                        <td className="py-3">One Album Distribution Service</td>
                        <td className="py-3 text-right">90%</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Artist Plan Table */}
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left font-bold text-foreground pb-2">Artist Plan</th>
                        <th className="text-right font-bold text-foreground pb-2">Royalty (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      <tr>
                        <td className="py-3">1 Month Starter Plan</td>
                        <td className="py-3 text-right">70%</td>
                      </tr>
                      <tr>
                        <td className="py-3">6 Months Advance Plan</td>
                        <td className="py-3 text-right">80%</td>
                      </tr>
                      <tr>
                        <td className="py-3">1 Year Pro Plan</td>
                        <td className="py-3 text-right">90%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="space-y-6">
                  {/* Label Plan Table */}
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left font-bold text-foreground pb-2">Label Plan</th>
                        <th className="text-right font-bold text-foreground pb-2">Royalty (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      <tr>
                        <td className="py-3">1 Months Starter Plan</td>
                        <td className="py-3 text-right">70%</td>
                      </tr>
                      <tr>
                        <td className="py-3">6 Months Advance Plan</td>
                        <td className="py-3 text-right">80%</td>
                      </tr>
                      <tr>
                        <td className="py-3">1 Year Pro Plan</td>
                        <td className="py-3 text-right">90%</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-2 flex justify-between gap-4">
                     <span className="font-bold text-foreground w-1/2">For Aggregators</span>
                     <span className="w-1/2 text-sm text-right">There is a custom agreement with custom terms and conditions. Fill the apply now aggregator form. Our dedicated team will coordinate you.</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <p className=" p-2 rounded text-foreground inline-block">
                  3.2 We will pay you a share of the net revenue received from different distribution platform/s and networks or otherwise, after deduction of content IPR Users payment or any such 3rd party payment if any, that we might have to give by law enforced on us.
                </p>
                <p className=" p-2 rounded text-foreground inline-block">
                  3.3 The User will be liable to pay separately for marketing/promotion/playlist pitching/advertisement services. The consideration towards such services shall be decided upon mutual agreement between the Parties.
                </p>
                <p className=" p-2 rounded text-foreground inline-block">
                  3.4 In the event, the User wants to take down the Property, they shall be liable to pay Rs. 500/- as take-down fees.
                </p>
                <p className=" p-2 rounded text-foreground inline-block">
                  3.5 In the event of any infringement notice or claims, the User shall be liable to pay Rs. 5000/- as take-down fees.
                </p>
                <p className=" p-2 rounded text-foreground inline-block">
                  3.6 In the event, the User wants to release the Property on Metadata or update it or re-release it, they shall be liable to pay Rs. 100/- per release.
                </p>
                <p className=" p-2 rounded text-foreground inline-block">
                  3.7 The User will receive the analytical report post release of the Property, and they shall be given after every 90 days.
                </p>
                <p className=" p-2 rounded text-foreground inline-block">
                  3.8 The User will be liable to pay DSP Fees, taxes, claims and deductions, and the same shall be deducted from the Royalty fees.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: MODIFICATIONS */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">4. MODIFICATIONS.</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Unless the prior written approval of the User is obtained, Firm may not modify or change the Property in any manner. Licensee shall not use Licensed property for any purpose that is unlawful or prohibited by these Terms of the Agreement.
              </p>
            </CardContent>
          </Card>

          {/* Section 5: DEFAULTS ON AGREEMENT */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">5. DEFAULTS ON AGREEMENT.</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                If Firm fails to abide by the obligations of this Agreement, including the obligation to make a royalty payment when due, User shall have the option to cancel this Agreement by providing 30 days written notice to Firm. Firm shall have the option of taking corrective action to cure the default to prevent the termination of this Agreement if said corrective action is enacted prior to the end of the time period stated in the previous sentence. There must be no other defaults during such a time period or the user will have the option to cancel this Agreement, despite previous corrective action.
              </p>
            </CardContent>
          </Card>

          {/* Section 6: WARRANTIES */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">6. WARRANTIES.</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Neither party makes any warranties with respect to the use, sale or other transfer of the Property by the other party or by any third party, and Firm accepts the product "AS IS." In no event will the User be liable for direct, indirect, special, incidental, or consequential damages, that are in any way related to the Property.
              </p>
            </CardContent>
          </Card>

          {/* Section 7: TRANSFER OF RIGHTS */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">7. TRANSFER OF RIGHTS.</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Neither party shall have the right to assign its interests in this Agreement to any other party, unless the prior written consent of the other party is obtained.
              </p>
            </CardContent>
          </Card>

          {/* Section 8: DAMAGES */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader className="flex flex-row items-center gap-4">
              
              <CardTitle className="text-xl font-bold uppercase tracking-tight ">8. DAMAGES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm  leading-relaxed font-semibold">
              <p className=" text-muted-foreground p-1 inline-block rounded">
                In the event of any default on the part of the User of the terms and conditions of this Agreement, the User shall be liable for damages to a minimum amount of Rs. 10,000/-, except for the other damages and claims as applicable upon the User for default. The User shall also not be entitled to the Royalty fees for the term of this Agreement.
              </p>
              <p className='text-muted-foreground'>
                In the event of multiple infringement claims against the Property, the Royalty fees shall be not payable. Firm can also impose penalties for the damages.
              </p>
            </CardContent>
          </Card>

          {/* Section 9: INDEMNIFICATION */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">9. INDEMNIFICATION.</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Each party shall indemnify and hold the other harmless for any losses, claims, damages, awards, penalties, or injuries incurred by any third party, including reasonable attorney's fees, which arise from any alleged breach of such indemnifying party's representations and warranties made under this Agreement, provided that the indemnifying party is promptly notified of any such claims. The indemnifying party shall have the sole right to defend such claims at its own expense. The other party shall provide, at the indemnifying party's expense, such assistance in investigating and defending such claims as the indemnifying party may reasonably request. This indemnity will survive the termination of this Agreement.
              </p>
            </CardContent>
          </Card>

          {/* Section 10: AMENDMENT */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">10. AMENDMENT.</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                This Agreement may be modified or amended, only if the amendment is made in writing and is signed by both parties.
              </p>
            </CardContent>
          </Card>

          {/* Section 11: TERM */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">11. TERM</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p className=" p-2 rounded text-foreground inline-block font-medium">
                This Agreement shall come in force from the signup date date ("Effective Date") for all the purposes of this Agreement.
              </p>
              <p>
                This Agreement shall be in place for a period of 1 Year and the same shall auto-renew unless terminated by either of the Parties, as per the terms and conditions of this Agreement.
              </p>
            </CardContent>
          </Card>

          {/* Section 12: TERMINATION */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">12. TERMINATION.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                This Agreement may be terminated by either party by providing 90 days written notice to the other party. This Agreement shall terminate automatically on Termination Date.
              </p>
              <p>
                i. Upon termination or expiration of this Agreement, Licensee Firm shall cease reproducing, advertising, marketing and distributing the Work as soon as is commercially feasible. Licensee shall have the right to fill existing orders and to sell off existing copies of the Work then in stock. Users will have the right to verify the existence and validity of the existing orders and existing copies of the Work then in stock upon reasonable notice to Licensee.
              </p>
              <p>
                ii. Termination or expiration of this Agreement shall not extinguish any of Licensee's or Copyright User's obligations under this Agreement including, but not limited to, the obligation to pay royalties which by their terms continue after the date of termination or expiration.
              </p>
            </CardContent>
          </Card>

          {/* Section 13: SEVERABILITY */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">13. SEVERABILITY.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                If any provision of this Agreement shall be held to be invalid or unenforceable for any reason, the remaining provisions shall continue to be valid and enforceable. If a court finds that any provision of this Agreement is invalid or unenforceable, but that by limiting such provision it would become valid or enforceable, then such provision shall be deemed to be written, construed, and enforced as so limited.
              </p>
              <p>
                This Agreement contains the entire agreement of the parties and there are no other promises or conditions in any other agreement whether oral or written. This Agreement supersedes any prior written or oral agreements between the parties.
              </p>
            </CardContent>
          </Card>

          {/* Section 14: DISPUTE RESOLUTION */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">14. DISPUTE RESOLUTION</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                The Parties agree to first mediate any disputes or claims between them in good faith and resolve the disputes amicably and share the cost of mediation equally. In the event that mediation fails, any controversy or claim arising out of or relating to this Agreement or breach of any duties hereunder shall be settled by Arbitration in accordance with the Arbitration and Conciliation Act of India, 1996. All hearings shall be held at Uttar Pradesh, India and shall be conducted in English. The parties shall each appoint an arbitrator who shall then appoint a sole arbitrator to preside over the Arbitration proceedings. The Parties shall share the costs of arbitration equally, however, this does not affect the right of the Arbitrator to award costs to any one Party.
              </p>
            </CardContent>
          </Card>

          {/* Section 15: GOVERNING LAW JURISDICTION */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">15. GOVERNING LAW JURISDICTION:</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                This Agreement shall be governed by and construed in accordance with the laws of India only. Each party hereby irrevocably submits to the exclusive jurisdiction of the courts of Uttar Pradesh, for the adjudication of any dispute hereunder or in connection herewith.
              </p>
            </CardContent>
          </Card>

          {/* Section 16: NOTICE */}
          <Card className="border-slate-700 bg-card/50 px-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">16. NOTICE:</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Any notice, direction or instruction given under this Agreement shall be in writing and delivered registered post, cable, facsimile or telex to the addresses as set forth at the start of the said agreement. E-mail communication will also be accepted as a legal notice/claim/ notice of termination served on the Firm.
              </p>
            </CardContent>
          </Card>

          {/* Contact Details & Required Documents Section */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="border-slate-700 bg-slate-900/40 px-2 h-full">
               <CardContent className="pt-6 space-y-4">
                  <h4 className="font-bold text-foreground">Maheshwari Visuals C/O Harshit Maheshwari</h4>
                  <p className="text-sm text-muted-foreground">Address : Maheshwari Complex, Near Gandhi Park, Bilsi, UttarPradesh, India, 243633</p>
                  <p className="text-sm text-muted-foreground">Call : +91 05833796906</p>
                  <p className="text-sm text-muted-foreground">Whatsapp : +91 7599755643</p>
                  <p className="text-sm text-muted-foreground">Email : Contact@maheshwarivisuals.com</p>
               </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/40 px-2 h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold  p-2 text-center rounded">
                  After Sign Up : Required Self Attested Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[ 
                    "1. Certificate of Incorporation (if applicable)",
                    "2. GST Certificate (if applicable)",
                    "3. Cancelled Cheque",
                    "4. PAN Card Copy",
                    "5. Aadhaar Card Copy"
                  ].map((doc, i) => (
                    <div key={i} className=" font-semibold text-muted-foreground p-2 rounded text-sm w-fit">
                      {doc}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground/60 pt-10">
          © 2022-2025 Maheshwari Visuals PVT LTD. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default DistributionAgreement;
