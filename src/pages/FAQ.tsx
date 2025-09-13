import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      category: "General",
      questions: [
        {
          question: "What is ULTRASOLX?",
          answer: "ULTRASOLX is a premium marketplace for verified social media accounts across Instagram, Twitter, TikTok, YouTube, and Facebook. We provide secure transactions using our Universal Currency (UC) system."
        },
        {
          question: "How does the UC currency system work?",
          answer: "Universal Currency (UC) is our secure digital currency. The conversion rate is ₦100 = 10 UC. You deposit Nigerian Naira via Paystack and receive UC to purchase accounts."
        },
        {
          question: "Are the accounts genuine and verified?",
          answer: "Yes, all accounts on our marketplace are thoroughly verified and tested before listing. We ensure authenticity and provide account credentials immediately after purchase."
        }
      ]
    },
    {
      category: "Payments & Deposits",
      questions: [
        {
          question: "How do I deposit UC into my wallet?",
          answer: "Go to your Wallet → Click 'Add UC' → Enter the amount in Naira → Complete payment via Paystack. Your UC will be credited instantly at a rate of ₦100 = 10 UC."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major debit/credit cards, bank transfers, and mobile money through our Paystack integration. All payments are processed securely."
        },
        {
          question: "Can I get a refund for my UC deposit?",
          answer: "UC deposits are non-refundable once processed. However, if you encounter issues with purchased accounts, our support team will assist you promptly."
        },
        {
          question: "Is there a minimum deposit amount?",
          answer: "Yes, the minimum deposit is ₦100 (10 UC). There's no maximum limit for deposits."
        }
      ]
    },
    {
      category: "Purchasing Accounts",
      questions: [
        {
          question: "How do I purchase a social media account?",
          answer: "Browse our marketplace → Select the account you want → Click 'Purchase' → Confirm payment with UC → Receive credentials instantly in your Messages tab and via Telegram."
        },
        {
          question: "How are account credentials delivered?",
          answer: "Credentials are delivered instantly through two methods: 1) In your account Messages tab, 2) Via Telegram notification to ensure you never miss important information."
        },
        {
          question: "What if the account doesn't work after purchase?",
          answer: "If you encounter any issues with a purchased account, contact our support team immediately via Telegram. We provide 24/7 support and will resolve issues promptly."
        },
        {
          question: "Can I sell my own accounts on the platform?",
          answer: "Currently, only admin-approved sellers can list accounts. Contact our support team if you're interested in becoming a verified seller."
        }
      ]
    },
    {
      category: "Account & Security",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click 'Register' → Enter your email and password → Verify your email → Start using ULTRASOLX. Account creation is free and takes less than 2 minutes."
        },
        {
          question: "How secure is my personal information?",
          answer: "We use industry-standard encryption and security measures. We don't store payment information - all transactions are processed securely through Paystack."
        },
        {
          question: "Can I change my account password?",
          answer: "Yes, go to your Profile → Account Settings → Change Password. We recommend using strong, unique passwords for security."
        }
      ]
    },
    {
      category: "Support",
      questions: [
        {
          question: "How can I contact customer support?",
          answer: "Our primary support channel is Telegram. Contact any of our agents: @Ultrabase1, @Ultrabase2, @Ultrabase3, or @Ultrabase4. We're available 24/7 with ~5 minute response time."
        },
        {
          question: "What are your support hours?",
          answer: "Our support team is available 24/7 via Telegram. We typically respond within 5 minutes during all hours."
        },
        {
          question: "Do you provide support in other languages?",
          answer: "Currently, we provide support in English. Our team is working on expanding language support."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked <span className="bg-gradient-primary bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find quick answers to common questions about ULTRASOLX
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqs.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="glass-card">
              <div className="p-6 border-b border-border/30">
                <h2 className="text-xl font-semibold flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-primary" />
                  {section.category}
                </h2>
              </div>
              <div className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`${sectionIndex}-${faqIndex}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="p-8 glass-card text-center mt-12">
          <MessageCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is ready to help you 24/7.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Ultrabase1', 'Ultrabase2', 'Ultrabase3', 'Ultrabase4'].map((handle) => (
              <Button
                key={handle}
                variant="hero"
                onClick={() => window.open(`https://t.me/${handle}`, '_blank')}
              >
                Contact @{handle}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;