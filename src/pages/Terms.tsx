import { Card } from '@/components/ui/Card';
import { SkullLogo } from '@/components/SkullLogo';
import { FileText } from 'lucide-react';

const SECTIONS = [
  { title: '1. Acceptance of Terms', body: 'By accessing and using the nicotinacat Hub ("the Hub"), you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use the Hub.' },
  { title: '2. Description of Service', body: 'The Hub provides a community platform featuring social features, an arcade system with progression mechanics, card collection, expeditions, and content aggregation from connected platforms. We reserve the right to modify or discontinue any feature at any time.' },
  { title: '3. User Accounts', body: 'You must create an account to access certain features. You are responsible for maintaining the security of your account and password. You agree to provide accurate information during registration and to keep your profile information updated.' },
  { title: '4. User Conduct', body: 'You agree not to: post abusive, defamatory, or hateful content; harass other users; impersonate any person or entity; attempt to access another user\'s account; use automated systems to access the Hub without authorization; or engage in any activity that disrupts the service.' },
  { title: '5. Content', body: 'You retain ownership of content you post. By posting, you grant the Hub a non-exclusive license to display and distribute that content within the platform. We reserve the right to remove content that violates these terms.' },
  { title: '6. Arcade and Virtual Items', body: 'The arcade system includes virtual items, cards, gold, and progression mechanics. These virtual items have no monetary value and cannot be exchanged for real currency. We may adjust the arcade economy, balance, or features at our discretion.' },
  { title: '7. Intellectual Property', body: 'The Hub, including its design, branding, and software, is owned by nicotinacat. All trademarks, logos, and content not created by users are property of their respective owners.' },
  { title: '8. Third-Party Links', body: 'The Hub contains links to third-party websites and services (Twitch, TikTok, Discord, Amazon). We are not responsible for the content or practices of these third-party services.' },
  { title: '9. Limitation of Liability', body: 'The Hub is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Hub.' },
  { title: '10. Changes to Terms', body: 'We may update these terms at any time. Continued use of the Hub after changes constitutes acceptance of the updated terms.' },
  { title: '11. Contact', body: 'For questions about these terms, reach out through the Discord community or social channels.' },
];

export function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <SkullLogo size={48} />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <FileText size={24} className="text-primary" />
          <h1 className="font-display font-700 text-3xl text-text">Terms of Service</h1>
        </div>
        <p className="text-sm text-text-muted">Last updated: September 2026</p>
      </div>

      <Card variant="elevated" padding="lg" className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-display font-600 text-base text-text mb-2">{section.title}</h2>
            <p className="text-sm text-text-muted leading-relaxed">{section.body}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
