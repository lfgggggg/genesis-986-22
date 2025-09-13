import { Card } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Terms of <span className="bg-gradient-primary bg-clip-text text-transparent">Service</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: January 15, 2024
          </p>
        </div>

        <Card className="glass-card max-w-4xl mx-auto">
          <div className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using ULTRASOLX ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of ULTRASOLX materials for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Universal Currency (UC) System</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                ULTRASOLX operates using Universal Currency (UC) with the following terms:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Conversion rate: ₦100 Nigerian Naira = 10 Universal Currency (UC)</li>
                <li>UC deposits are non-refundable once processed</li>
                <li>UC can only be used for purchases within the ULTRASOLX platform</li>
                <li>UC has no cash value and cannot be exchanged for real currency</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Account Purchases</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When purchasing social media accounts through ULTRASOLX:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>All sales are final once credentials are delivered</li>
                <li>Accounts are sold "as-is" with no warranty beyond initial verification</li>
                <li>Users are responsible for securing purchased accounts</li>
                <li>ULTRASOLX is not responsible for account suspensions after transfer</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Prohibited Uses</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You may not use ULTRASOLX for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>Violating any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>Infringing upon or violating our intellectual property rights or the intellectual property rights of others</li>
                <li>Harassment, abuse, insulting, harming, defaming, slandering, disparaging, intimidating, or discriminating</li>
                <li>Submitting false or misleading information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your privacy is important to us. We collect minimal personal information necessary for platform operation. We do not store payment information - all transactions are processed securely through Paystack. For detailed information about data handling, please refer to our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials on ULTRASOLX are provided on an 'as is' basis. ULTRASOLX makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Limitations</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall ULTRASOLX or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ULTRASOLX, even if ULTRASOLX or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Support and Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For support and inquiries, contact our team via Telegram: @Ultrabase1, @Ultrabase2, @Ultrabase3, or @Ultrabase4. We provide 24/7 support with typical response times of ~5 minutes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Modifications</h2>
              <p className="text-muted-foreground leading-relaxed">
                ULTRASOLX may revise these terms of service at any time without notice. By using this platform, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of Nigeria and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;