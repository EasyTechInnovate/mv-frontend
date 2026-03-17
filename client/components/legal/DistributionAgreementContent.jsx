'use client'
import React from 'react'

const DistributionAgreementContent = () => {
  return (
    <div className="max-w-6xl w-full mx-auto px-4 mt-8 space-y-8 text-gray-300 pb-20">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
          INTELLECTUAL PROPERTY AGREEMENT / DISTRIBUTION AGREEMENT /
          <br />
          MV AGREEMENT
        </h2>
        <div className="space-y-4 max-w-4xl mx-auto text-sm text-gray-400">
          <p>This Intellectual Property Agreement (hereinafter referred to as "Agreement") is executed on the signup date of the Firm</p>
          <p>We are a Firm named "Maheshwari Visuals", based out of Uttar Pradesh and the Industry we cater to is "Sound & Video recordings"</p>
        </div>
      </div>

      {/* Parties Section */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg mt-8">
        <h3 className="text-xl font-semibold text-white mb-6 text-center tracking-widest uppercase">BY AND BETWEEN</h3>
        <div className="space-y-6">
          <div>
            <p className="leading-relaxed">
              <strong className="text-white">Maheshwari Visuals</strong> having the website (<a href="https://maheshwarivisuals.com" target="_blank" className="text-blue-400 hover:text-blue-300">maheshwarivisuals.com</a>, <a href="https://dashboard.maheshwarivisuals.com" target="_blank" className="text-blue-400 hover:text-blue-300">dashboard.maheshwarivisuals.com</a>) ("Maheshwari Visuals", "Firm", "we", "us" and "our"), a sole Proprietorship Firm having its registered office at "Galla Mandi Road, Near Kachhala Bus Stand, C/O HARSHIT MAHESHWARI, Maheshwari Complex, Galla Mandi Road, Bilsi, Budaun, Uttar Pradesh, 243633, India" (which expression shall, unless repugnant to the meaning or context thereof, be deemed to mean and include its directors, nominees, assigns, employees, contractors, affiliates, agents, representatives and successors).
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white tracking-widest">AND</p>
          </div>
          <div>
            <p className="leading-relaxed">
              This Agreement applies to Users who use the services of the platform (the "Digital Distribution Services, Marketing services, CMS, Merch launch,") and shall be effective as of the date you sign up to the Platform.
            </p>
          </div>
        </div>
      </div>

      {/* Definitions Section */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg">
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            In this Agreement, the party granting the right to use the licensed property, User, will be referred to as the "User" and the party who is receiving the right to use the licensed property, Firm, will be referred to as the "Firm." Shall be referred to individually as "Party" and as "Parties" collectively, as the context may require.
          </p>
          <ul className="space-y-3 pl-2">
            <li>1. User owns all proprietary rights in and to the copyright-able and/or copyrighted works described in this Agreement. The copyrighted works will collectively be referred to as "Work."</li>
            <li>2. User owns all rights in and to the Work and retains all rights to the Work, which are not transferred herein, and retains all common law copyrights and all federal copyrights which have been, or which may be, granted by the Library of Congress.</li>
            <li>3. Firm desires to obtain, and Licensor has agreed to grant, a license authorizing the use of the Work by Licensee in accordance with the terms and conditions of this Agreement.</li>
          </ul>
          <p>The parties agree to abide by the terms as follows:</p>
        </div>
      </div>

      {/* Section 1: GRANT OF LICENSE */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">1. GRANT OF LICENSE.</h3>
        <p className="leading-relaxed">
          The user owns Property To Be Licensed ("Property"). In accordance with this Agreement, User grants Firm an exclusive license to Use or Sell Highlight The Terms That Apply the Property. The user retains title and Ownership of the Property. Firm will own all rights to materials, products or other works (the Work) created by Firm in connection with this license. This grant of license applies only to the following described geographical area:
        </p>
      </div>

      {/* Section 2: RIGHTS AND OBLIGATIONS */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">2. RIGHTS AND OBLIGATIONS.</h3>
        <p className="leading-relaxed">
          Firm shall be the sole owner of the Work and all proprietary rights in and to the Work; however, such ownership shall not include ownership of the copyright in and to the Property or any other rights to the Property not specifically granted in this Agreement.
        </p>
      </div>

      {/* Section 3: PAYMENT */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-6">3. PAYMENT.</h3>
        
        <div className="space-y-8">
          <p className="font-bold text-white  p-2 inline-block rounded">
            3.1 Firm agrees to pay User a royalty which shall be calculated as follows:
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Distribution and Artist Plans */}
            <div className="space-y-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left font-bold text-white pb-2">Plan Name</th>
                    <th className="text-right font-bold text-white pb-2">Royalty (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
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

              <table className="w-full text-sm mt-8">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left font-bold text-white pb-2">Artist Plan</th>
                    <th className="text-right font-bold text-white pb-2">Royalty (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
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

            {/* Label Plans and Aggregators */}
            <div className="space-y-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left font-bold text-white pb-2">Label Plan</th>
                    <th className="text-right font-bold text-white pb-2">Royalty (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
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

              <div className="pt-4 flex justify-between gap-4">
                <span className="font-bold text-white w-1/2">For Aggregators</span>
                <span className="w-1/2 text-sm text-right leading-relaxed">
                  There is a custom agreement with custom terms and conditions. Fill the apply now aggregator form. Our dedicated team will coordinate you.
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <p className=" text-white p-2 rounded inline-block leading-relaxed">
              3.2 We will pay you a share of the net revenue received from different distribution platform/s and networks or otherwise, after deduction of content IPR Users payment or any such 3rd party payment if any, that we might have to give by law enforced on us.
            </p>
            <p className=" text-white p-2 rounded inline-block leading-relaxed">
              3.3 The User will be liable to pay separately for marketing/promotion/playlist pitching/advertisement services. The consideration towards such services shall be decided upon mutual agreement between the Parties.
            </p>
            <p className=" text-white p-2 rounded inline-block leading-relaxed">
              3.4 In the event, the User wants to take down the Property, they shall be liable to pay Rs. 500/- as take-down fees.
            </p>
            <p className=" text-white p-2 rounded inline-block leading-relaxed">
              3.5 In the event of any infringement notice or claims, the User shall be liable to pay Rs. 5000/- as take-down fees.
            </p>
            <p className=" text-white p-2 rounded inline-block leading-relaxed">
              3.6 In the event, the User wants to release the Property on Metadata or update it or re-release it, they shall be liable to pay Rs. 100/- per release.
            </p>
            <p className=" text-white p-2 rounded inline-block leading-relaxed">
              3.7 The User will receive the analytical report post release of the Property, and they shall be given after every 90 days.
            </p>
            <p className=" text-white p-2 rounded inline-block leading-relaxed">
              3.8 The User will be liable to pay DSP Fees, taxes, claims and deductions, and the same shall be deducted from the Royalty fees.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: MODIFICATIONS */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">4. MODIFICATIONS.</h3>
        <p className="leading-relaxed">
          Unless the prior written approval of the User is obtained, Firm may not modify or change the Property in any manner. Licensee shall not use Licensed property for any purpose that is unlawful or prohibited by these Terms of the Agreement.
        </p>
      </div>

      {/* Section 5: DEFAULTS ON AGREEMENT */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">5. DEFAULTS ON AGREEMENT.</h3>
        <p className="leading-relaxed">
          If Firm fails to abide by the obligations of this Agreement, including the obligation to make a royalty payment when due, User shall have the option to cancel this Agreement by providing 30 days written notice to Firm. Firm shall have the option of taking corrective action to cure the default to prevent the termination of this Agreement if said corrective action is enacted prior to the end of the time period stated in the previous sentence. There must be no other defaults during such a time period or the user will have the option to cancel this Agreement, despite previous corrective action.
        </p>
      </div>

      {/* Section 6: WARRANTIES */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">6. WARRANTIES.</h3>
        <p className="leading-relaxed">
          Neither party makes any warranties with respect to the use, sale or other transfer of the Property by the other party or by any third party, and Firm accepts the product "AS IS." In no event will the User be liable for direct, indirect, special, incidental, or consequential damages, that are in any way related to the Property.
        </p>
      </div>

      {/* Section 7: TRANSFER OF RIGHTS */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">7. TRANSFER OF RIGHTS.</h3>
        <p className="leading-relaxed">
          Neither party shall have the right to assign its interests in this Agreement to any other party, unless the prior written consent of the other party is obtained.
        </p>
      </div>

      {/* Section 8: DAMAGES */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg ">
        <h3 className="text-xl font-semibold text-white mb-4">8. DAMAGES</h3>
        <div className="space-y-4">
          <p className=" text-white p-2 rounded inline-block font-semibold">
            In the event of any default on the part of the User of the terms and conditions of this Agreement, the User shall be liable for damages to a minimum amount of Rs. 10,000/-, except for the other damages and claims as applicable upon the User for default. The User shall also not be entitled to the Royalty fees for the term of this Agreement.
          </p>
          <p className="leading-relaxed">
            In the event of multiple infringement claims against the Property, the Royalty fees shall be not payable. Firm can also impose penalties for the damages.
          </p>
        </div>
      </div>

      {/* Section 9: INDEMNIFICATION */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">9. INDEMNIFICATION.</h3>
        <p className="leading-relaxed">
          Each party shall indemnify and hold the other harmless for any losses, claims, damages, awards, penalties, or injuries incurred by any third party, including reasonable attorney's fees, which arise from any alleged breach of such indemnifying party's representations and warranties made under this Agreement, provided that the indemnifying party is promptly notified of any such claims. The indemnifying party shall have the sole right to defend such claims at its own expense. The other party shall provide, at the indemnifying party's expense, such assistance in investigating and defending such claims as the indemnifying party may reasonably request. This indemnity will survive the termination of this Agreement.
        </p>
      </div>

      {/* Section 10: AMENDMENT */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">10. AMENDMENT.</h3>
        <p className="leading-relaxed">
          This Agreement may be modified or amended, only if the amendment is made in writing and is signed by both parties.
        </p>
      </div>

      {/* Section 11: TERM */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">11. TERM</h3>
        <div className="space-y-4">
          <p className=" text-white p-2 rounded inline-block font-medium">
            This Agreement shall come in force from the signup date date ("Effective Date") for all the purposes of this Agreement.
          </p>
          <p className="leading-relaxed">
            This Agreement shall be in place for a period of 1 Year and the same shall auto-renew unless terminated by either of the Parties, as per the terms and conditions of this Agreement.
          </p>
        </div>
      </div>

      {/* Section 12: TERMINATION */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">12. TERMINATION.</h3>
        <p className="mb-4 leading-relaxed">
          This Agreement may be terminated by either party by providing 90 days written notice to the other party. This Agreement shall terminate automatically on Termination Date.
        </p>
        <div className="space-y-4 leading-relaxed">
          <p>
            i. Upon termination or expiration of this Agreement, Licensee Firm shall cease reproducing, advertising, marketing and distributing the Work as soon as is commercially feasible. Licensee shall have the right to fill existing orders and to sell off existing copies of the Work then in stock. Users will have the right to verify the existence and validity of the existing orders and existing copies of the Work then in stock upon reasonable notice to Licensee.
          </p>
          <p>
            ii. Termination or expiration of this Agreement shall not extinguish any of Licensee's or Copyright User's obligations under this Agreement including, but not limited to, the obligation to pay royalties which by their terms continue after the date of termination or expiration.
          </p>
        </div>
      </div>

      {/* Section 13: SEVERABILITY */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">13. SEVERABILITY.</h3>
        <p className="mb-4 leading-relaxed">
          If any provision of this Agreement shall be held to be invalid or unenforceable for any reason, the remaining provisions shall continue to be valid and enforceable. If a court finds that any provision of this Agreement is invalid or unenforceable, but that by limiting such provision it would become valid or enforceable, then such provision shall be deemed to be written, construed, and enforced as so limited.
        </p>
        <p className="leading-relaxed">
          This Agreement contains the entire agreement of the parties and there are no other promises or conditions in any other agreement whether oral or written. This Agreement supersedes any prior written or oral agreements between the parties.
        </p>
      </div>

      {/* Section 14: DISPUTE RESOLUTION */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">14. DISPUTE RESOLUTION</h3>
        <p className="leading-relaxed mb-4">
          The Parties agree to first mediate any disputes or claims between them in good faith and resolve the disputes amicably and share the cost of mediation equally. In the event that mediation fails, any controversy or claim arising out of or relating to this Agreement or breach of any duties hereunder shall be settled by Arbitration in accordance with the Arbitration and Conciliation Act of India, 1996.
        </p>
        <p className="leading-relaxed bg-black/20 p-4 rounded border-l-2 border-gray-600">
          All hearings shall be held at Uttar Pradesh, India and shall be conducted in English. The parties shall each appoint an arbitrator who shall then appoint a sole arbitrator to preside over the Arbitration proceedings. The Parties shall share the costs of arbitration equally, however, this does not affect the right of the Arbitrator to award costs to any one Party.
        </p>
      </div>

      {/* Section 15: GOVERNING LAW JURISDICTION */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">15. GOVERNING LAW JURISDICTION:</h3>
        <p className="leading-relaxed">
          This Agreement shall be governed by and construed in accordance with the laws of India only. Each party hereby irrevocably submits to the exclusive jurisdiction of the courts of Uttar Pradesh, for the adjudication of any dispute hereunder or in connection herewith.
        </p>
      </div>

      {/* Section 16: NOTICE */}
      <div className="bg-[#1A1F2E] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">16. NOTICE:</h3>
        <p className="leading-relaxed">
          Any notice, direction or instruction given under this Agreement shall be in writing and delivered registered post, cable, facsimile or telex to the addresses as set forth at the start of the said agreement. E-mail communication will also be accepted as a legal notice/claim/ notice of termination served on the Firm.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-[#1A1F2E] p-6 rounded-lg">
          <h4 className="font-bold text-white mb-4 uppercase">Maheshwari Visuals C/O Harshit Maheshwari</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <p><span className="text-gray-500">Address :</span> Maheshwari Complex, Near Gandhi Park, Bilsi, UttarPradesh, India, 243633</p>
            <p><span className="text-gray-500">Call :</span> +91 05833796906</p>
            <p><span className="text-gray-500">Whatsapp :</span> +91 7599755643</p>
            <p><span className="text-gray-500">Email :</span> Contact@maheshwarivisuals.com</p>
          </div>
        </div>

        <div className="bg-[#1A1F2E] p-6 rounded-lg">
          <h4 className="text-lg font-bold text-white  p-2 text-center rounded mb-4">
            After Sign Up : Required Self Attested Documents
          </h4>
          <div className="space-y-3">
            {[ 
              "1. Certificate of Incorporation (if applicable)",
              "2. GST Certificate (if applicable)",
              "3. Cancelled Cheque",
              "4. PAN Card Copy",
              "5. Aadhaar Card Copy"
            ].map((doc, i) => (
              <div key={i} className=" font-semibold text-white p-2 rounded text-sm w-fit">
                {doc}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DistributionAgreementContent
