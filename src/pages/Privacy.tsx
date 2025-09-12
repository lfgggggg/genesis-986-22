import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <p className="text-muted-foreground">
                  We collect information you provide directly to us, such as when you create an account, 
                  make a purchase, or contact us for support. This includes your email address, username, 
                  and payment information.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Usage Information</h4>
                <p className="text-muted-foreground">
                  We automatically collect certain information about your device and how you use our service, 
                  including your IP address, browser type, operating system, and pages viewed.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Provide, maintain, and improve our services
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Process transactions and send related information
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Send technical notices, updates, and support messages
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Respond to your comments and questions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Monitor and analyze trends and usage
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy. We may share your information 
                with trusted service providers who assist us in operating our website and conducting our business.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
                over the internet or electronic storage is 100% secure.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">You have the right to:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Access and update your personal information
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Request deletion of your data
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Opt out of marketing communications
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Request a copy of your data
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@ultrasolx.com" className="text-primary hover:text-primary/80">
                  privacy@ultrasolx.com
                </a>
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}