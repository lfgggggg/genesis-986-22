import { Card } from "@/components/ui/card";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Cookie <span className="bg-gradient-primary bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: January 15, 2024
          </p>
        </div>

        <Card className="glass-card max-w-4xl mx-auto">
          <div className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">What Are Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. ULTRASOLX uses cookies to enhance your browsing experience and improve our platform's functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                ULTRASOLX uses cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Authentication:</strong> To keep you logged in and maintain your session security</li>
                <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                <li><strong>Security:</strong> To protect against fraud and unauthorized access</li>
                <li><strong>Analytics:</strong> To understand how our platform is used and improve performance</li>
                <li><strong>Functionality:</strong> To enable core platform features like your wallet and transaction history</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">Essential Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take, such as logging in or filling in forms. You can set your browser to block these cookies, but some parts of the site may not work properly.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">Functional Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we use on our pages. If you do not allow these cookies, some or all of these services may not function properly.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">Performance Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies allow us to count visits and traffic sources to measure and improve the performance of our site. They help us know which pages are most popular and see how visitors move around the site. All information these cookies collect is aggregated and anonymous.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">Security Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies help protect your account and transactions. They enable us to detect suspicious activity and protect against fraud, ensuring your UC wallet and personal information remain secure.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may use third-party services that set cookies on our behalf:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Paystack:</strong> For secure payment processing and fraud prevention</li>
                <li><strong>Supabase:</strong> For authentication and secure data storage</li>
                <li><strong>Analytics providers:</strong> To understand platform usage and improve user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Managing Your Cookie Preferences</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have several options for managing cookies:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Browser Settings:</strong> Most browsers allow you to control cookies through their settings preferences</li>
                <li><strong>Delete Cookies:</strong> You can delete all cookies that are already on your device</li>
                <li><strong>Block Cookies:</strong> You can block all cookies from being set</li>
                <li><strong>Selective Blocking:</strong> You can block cookies from specific websites only</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Please note that blocking or deleting cookies may impact your experience on ULTRASOLX and prevent some features from working properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Cookie Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                Different cookies have different retention periods:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Authentication Cookies:</strong> Remain until you log out or expire after 30 days</li>
                <li><strong>Preference Cookies:</strong> Stored for up to 1 year</li>
                <li><strong>Analytics Cookies:</strong> Typically stored for 2 years</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal and regulatory reasons. When we make changes, we will update the "Last updated" date at the top of this policy. We encourage you to review this policy periodically to stay informed about our use of cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our use of cookies or this Cookie Policy, please contact our support team via Telegram: @Ultrabase1, @Ultrabase2, @Ultrabase3, or @Ultrabase4. We're available 24/7 to assist you.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CookiePolicy;