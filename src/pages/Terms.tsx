import { Card } from '@/components/ui/Card';
import { SkullLogo } from '@/components/SkullLogo';
import { FileText } from 'lucide-react';

const SECTIONS = [
  { title: '1. Aceitação dos Termos', body: 'Ao acessar e usar a nicotinacat, você aceita e concorda em ficar vinculado a estes Termos de Serviço. Se não concordar, por favor não utilize a nicotinacat.' },
  { title: '2. Descrição do Serviço', body: 'A nicotinacat oferece uma plataforma de comunidade com recursos sociais, sistema de progressão estilo arcade, coleção de cards, expedições e agregação de conteúdo de plataformas conectadas. Reservamo-nos o direito de modificar ou descontinuar qualquer funcionalidade a qualquer momento.' },
  { title: '3. Contas de Usuário', body: 'Você deve criar uma conta para acessar certos recursos. Você é responsável por manter a segurança da sua conta e senha. Você concorda em fornecer informações precisas durante o registro e manter suas informações de perfil atualizadas.' },
  { title: '4. Conduta do Usuário', body: 'Você concorda em não: postar conteúdo abusivo, difamatório ou odioso; assediar outros usuários; se passar por outra pessoa ou entidade; tentar acessar a conta de outro usuário; usar sistemas automatizados para acessar a nicotinacat sem autorização; ou envolver-se em qualquer atividade que interrompa o serviço.' },
  { title: '5. Conteúdo', body: 'Você mantém a propriedade do conteúdo que posta. Ao postar, você concede à nicotinacat uma licença não exclusiva para exibir e distribuir esse conteúdo dentro da plataforma. Reservamo-nos o direito de remover conteúdo que viole estes termos.' },
  { title: '6. Itens Virtuais e Arcade', body: 'O sistema arcade inclui itens virtuais, cards, ouro e mecânicas de progressão. Estes itens virtuais não têm valor monetário e não podem ser trocados por moeda real. Podemos ajustar a economia do arcade, balanceamento ou funcionalidades a nosso critério.' },
  { title: '7. Propriedade Intelectual', body: 'A nicotinacat, incluindo seu design, marca e software, é propriedade da nicotinacat. Todas as marcas registradas, logos e conteúdo não criados por usuários são propriedade de seus respectivos donos.' },
  { title: '8. Links de Terceiros', body: 'A nicotinacat contém links para sites e serviços de terceiros (Twitch, TikTok, Discord, Amazon). Não somos responsáveis pelo conteúdo ou práticas destes serviços de terceiros.' },
  { title: '9. Limitação de Responsabilidade', body: 'A nicotinacat é fornecida "como está" sem garantias de qualquer tipo. Não somos responsáveis por danos indiretos, incidentais ou consequenciais decorrentes do seu uso da nicotinacat.' },
  { title: '10. Alterações nos Termos', body: 'Podemos atualizar estes termos a qualquer momento. O uso contínuo da nicotinacat após alterações constitui aceitação dos termos atualizados.' },
  { title: '11. Contato', body: 'Para dúvidas sobre estes termos, entre em contato através da comunidade no Discord ou canais sociais.' },
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
          <h1 className="font-display font-700 text-3xl text-text">Termos de Serviço</h1>
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