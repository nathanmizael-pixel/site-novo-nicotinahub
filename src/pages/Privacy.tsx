import { Card } from '@/components/ui/Card';
import { SkullLogo } from '@/components/SkullLogo';
import { Shield } from 'lucide-react';

const SECTIONS = [
  { title: '1. Informações que Coletamos', body: 'Quando você cria uma conta, coletamos seu endereço de e-mail, nome de exibição e nome de usuário. Também coletamos informações que você fornece na bio do perfil, posts, comentários e outro conteúdo que criar na nicotinacat.' },
  { title: '2. Como Usamos Suas Informações', body: 'Usamos suas informações para: criar e gerenciar sua conta; exibir seu perfil e conteúdo para a comunidade; fornecer recursos de progressão; enviar notificações sobre atividade; e melhorar a nicotinacat.' },
  { title: '3. Armazenamento de Dados', body: 'Seus dados são armazenados com segurança usando a infraestrutura da Supabase. Dados de autenticação, informações de perfil, posts e estado de progressão são armazenados em um banco de dados PostgreSQL com políticas de segurança em nível de linha.' },
  { title: '4. Dados de Autenticação', body: 'Usamos Supabase Auth para gerenciamento de contas. Sua senha é armazenada apenas como hash e nunca em texto plano. Não usamos provedores de login social a menos que solicitado explicitamente.' },
  { title: '5. Cookies e Sessões', body: 'A nicotinacat usa tokens de sessão para manter você logado. Eles são armazenados no seu navegador e usados apenas para fins de autenticação.' },
  { title: '6. Serviços de Terceiros', body: 'A nicotinacat se conecta e pode integrar com serviços de terceiros, incluindo Twitch, TikTok, Discord e Amazon. Esses serviços têm suas próprias políticas de privacidade, que regem como lidam com seus dados.' },
  { title: '7. Compartilhamento de Dados', body: 'Não vendemos ou alugamos suas informações pessoais. Suas informações de perfil e posts são visíveis para outros usuários autenticados da nicotinacat como parte dos recursos da comunidade.' },
  { title: '8. Retenção de Dados', body: 'Seus dados são retidos enquanto sua conta estiver ativa. Você pode solicitar a exclusão da sua conta, o que removerá seu perfil e conteúdo associado.' },
  { title: '9. Seus Direitos', body: 'Você tem o direito de: acessar seus dados pessoais; corrigir informações imprecisas; excluir sua conta e dados associados; e se opor a certo processamento dos seus dados.' },
  { title: '10. Segurança', body: 'Implementamos medidas de segurança razoáveis incluindo conexões criptografadas, segurança de banco de dados em nível de linha e controles de acesso. No entanto, nenhum método de transmissão pela internet é 100% seguro.' },
  { title: '11. Privacidade de Crianças', body: 'A nicotinacat não é direcionada a crianças menores de 13 anos. Não coletamos intencionalmente informações de crianças menores de 13 anos.' },
  { title: '12. Alterações nesta Política', body: 'Podemos atualizar esta política de privacidade a qualquer momento. Notificaremos você sobre mudanças significativas através da nicotinacat ou canais da comunidade.' },
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
          <h1 className="font-display font-700 text-3xl text-text">Política de Privacidade</h1>
        </div>
        <p className="text-sm text-text-muted">Última atualização: Setembro 2026</p>
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