import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Shield, Cookie, Gavel, Scale, ChevronRight, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LegalTab = () => {
  const navigate = useNavigate();

  const legalDocuments = [
    {
      title: "Content Policy",
      description: "Rules regarding music and video distribution exclusivity and obligations.",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      path: "/app/legal/content-policy"
    },
    {
      title: "Privacy Policy",
      description: "How we collect, use, and protect your personal information.",
      icon: Shield,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      path: "/app/legal/privacy-policy"
    },
    {
      title: "Cookies Policy",
      description: "Information about how we use cookies and tracking technologies.",
      icon: Cookie,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      path: "/app/legal/cookies-policy"
    },
    {
      title: "Terms & Conditions",
      description: "The overall legal agreement between you and Maheshwari Visuals.",
      icon: Gavel,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      path: "/app/legal/terms-conditions"
    },
    {
      title: "Distribution Agreement",
      description: "Specific terms for digital music distribution and royalty management.",
      icon: Scale,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      path: "/app/legal/distribution-agreement"
    },
    {
      title: "Shipping & Refund Policy",
      description: "How we deliver our digital services and handle refunds.",
      icon: Truck, 
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      path: "/app/legal/shipping-refund-policy"
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="border-slate-700 shadow-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Legal Documents & Policies</CardTitle>
          <p className="text-sm text-muted-foreground">Review our legal terms, privacy practices, and distribution agreements.</p>
        </CardHeader>
        <CardContent className="grid gap-4">
          {legalDocuments.map((doc, index) => {
            const Icon = doc.icon;
            return (
              <div 
                key={index}
                onClick={() => navigate(doc.path)}
                className="group flex items-center justify-between p-4 rounded-xl border border-border hover:border-purple-500/50 hover:bg-accent/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${doc.bgColor}`}>
                    <Icon className={`w-6 h-6 ${doc.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-purple-500 transition-colors uppercase text-sm tracking-wider">
                      {doc.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {doc.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="bg-purple-600/10 border border-purple-500/20 p-6 rounded-2xl">
        <h4 className="text-purple-500 font-semibold mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Need clarification?
        </h4>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          If you have any questions regarding these documents or how they apply to your account, please reach out to our legal team.
        </p>
        <Button 
          variant="outline" 
          size="sm"
          className="border-purple-500/50 text-purple-500 hover:bg-purple-600 hover:text-white"
          onClick={() => navigate('/app/help')}
        >
          Contact Support
        </Button>
      </div>
    </div>
  );
};

export default LegalTab;
