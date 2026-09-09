import { Card } from '@/components/ui/Card';
import { SkullLogo } from '@/components/SkullLogo';
import { Shield } from 'lucide-react';

const SECTIONS = [
  { title: '1. Information We Collect', body: 'When you create an account, we collect your email address, display name, and username. We also collect information you provide in your profile bio, posts, comments, and other content you create on the Hub.' },
  { title: '2. How We Use Your Information', body: 'We use your information to: create and manage your account; display your profile and content to the community; provide arcade features and progression; send notifications about activity; and improve the Hub.' },
  { title: '3. Data Storage', body: 'Your data is stored securely using Supabase infrastructure. Authentication data, profile information, posts, and arcade state are stored in a PostgreSQL database with row-level security policies.' },
  { title: '4. Authentication Data', body: 'We use Supabase Auth for account management. Your password is hashed and never stored in plain text. We do not use social login providers unless explicitly requested.' },
  { title: '5. Cookies and Sessions', body: 'The Hub uses session tokens to keep you logged in. These are stored in your browser and are used solely for authentication purposes.' },
  { title: '6. Third-Party Services', body: 'The Hub links to and may integrate with third-party services including Twitch, TikTok, Discord, and Amazon. These services have their own privacy policies that govern how they handle your data.' },
  { title: '7. Data Sharing', body: 'We do not sell or rent your personal information. Your profile information and posts are visible to other authenticated users of the Hub as part of the community features.' },
  { title: '8. Data Retention', body: 'Your data is retained for as long as your account is active. You may request deletion of your account, which will remove your profile and associated content.' },
  { title: '9. Your Rights', body: 'You have the right to: access your personal data; correct inaccurate information; delete your account and associated data; and object to certain processing of your data.' },
  { title: '10. Security', body: 'We implement reasonable security measures including encrypted connections, row-level database security, and access controls. However, no method of transmission over the internet is 100% secure.' },
  { title: '11. Children\'s Privacy', body: 'The Hub is not directed to children under 13. We do not knowingly collect information from children under 13.' },
  { title: '12. Changes to This Policy', body: 'We may update this privacy policy at any time. We will notify you of significant changes through the Hub or community channels.' },
];

export function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <SkullLogo size={48} />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield size={24} className="text-primary" />
          <h1 className="font-display font-700 text-3xl text-text">Privacy Policy</h1>
        </div>
        <p className="text-sm text-text-muted">Last updated: September 2026</p>
      </div>

      <Card elevated className="p-6 md:p-8 space-y-6">
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
