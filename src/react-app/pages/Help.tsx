import { BookOpen, HelpCircle, Truck, Package } from 'lucide-react';

export default function Help() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Documentação de Usuário
          </h1>
          <p className="text-gray-600 text-lg">
            Aprenda a usar o Cargo48 de forma simples e eficiente
          </p>
        </div>

        {/* Manual de Usuários */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-orange-500" />
              Manual de Usuários
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Guia rápido para usar as principais funcionalidades do sistema.
            </p>

            {/* Tutorial para Motoristas */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Para Motoristas</h3>
              </div>
              
              <div className="space-y-6 ml-13">
                <div className="border-l-4 border-orange-300 pl-6 py-2">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">1. Buscar Fretes Disponíveis</h4>
                  <p className="text-gray-600 mb-3">
                    Na tela inicial do motorista, você encontrará a aba <strong>"Fretes Disponíveis"</strong> que lista todos os fretes que você pode aceitar.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Veja detalhes como origem, destino, tipo de carga e valor do frete</li>
                    <li>Verifique a distância e os prazos de coleta e entrega</li>
                    <li>Clique em "Ver Detalhes" para informações completas</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-300 pl-6 py-2">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">2. Aceitar um Frete</h4>
                  <p className="text-gray-600 mb-3">
                    Quando encontrar um frete adequado, clique no botão laranja <strong>"Aceitar Frete"</strong>.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>O frete será automaticamente adicionado aos seus fretes</li>
                    <li>O embarcador será notificado da sua aceitação</li>
                    <li>Você poderá ver o frete na aba "Meus Fretes"</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-300 pl-6 py-2">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">3. Gerenciar Seus Fretes</h4>
                  <p className="text-gray-600 mb-3">
                    Acesse a aba <strong>"Meus Fretes"</strong> para ver todos os fretes que você aceitou.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Acompanhe o status de cada frete (pendente, confirmado, em trânsito)</li>
                    <li>Veja informações de contato para coleta e entrega</li>
                    <li>Confirme a coleta e entrega quando concluídas</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tutorial para Embarcadores */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Para Embarcadores</h3>
              </div>
              
              <div className="space-y-6 ml-13">
                <div className="border-l-4 border-blue-300 pl-6 py-2">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">1. Publicar um Novo Frete</h4>
                  <p className="text-gray-600 mb-3">
                    Clique no botão azul <strong>"+ Publicar Frete"</strong> no topo da tela.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Preencha as informações da carga (tipo, peso, descrição)</li>
                    <li>Defina os endereços e datas de coleta e entrega</li>
                    <li>Insira o valor do frete e prazo de pagamento</li>
                    <li>Adicione observações importantes sobre a carga</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-300 pl-6 py-2">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">2. Acompanhar Fretes Publicados</h4>
                  <p className="text-gray-600 mb-3">
                    Todos os seus fretes aparecem na tela <strong>"Meus Fretes"</strong>.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Fretes com status "Disponível" ainda não foram aceitos</li>
                    <li>Quando aceitos, você verá a placa do veículo do motorista</li>
                    <li>Acompanhe o progresso: Aceito → Confirmado → Em Trânsito → Entregue</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-300 pl-6 py-2">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">3. Gerenciar Fretes</h4>
                  <p className="text-gray-600 mb-3">
                    Use os botões de ação para gerenciar seus fretes.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Clique em "Ver Detalhes" para informações completas</li>
                    <li>Use "Excluir" para remover fretes ainda não aceitos</li>
                    <li>Fretes já aceitos não podem ser excluídos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-blue-500" />
              Perguntas Frequentes (FAQ)
            </h2>

            <div className="space-y-6">
              {/* FAQ 1 */}
              <div className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  1. Como aceitar um frete como motorista?
                </h3>
                <p className="text-gray-600">
                  Acesse a aba "Fretes Disponíveis", navegue pelos fretes listados e clique no botão laranja "Aceitar Frete" no frete que deseja transportar. O frete será automaticamente adicionado à sua lista de "Meus Fretes" e o embarcador será notificado.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  2. Como publicar um frete como embarcador?
                </h3>
                <p className="text-gray-600">
                  Clique no botão azul "+ Publicar Frete" no topo da tela. Preencha todos os campos obrigatórios com informações sobre a carga, endereços de coleta e entrega, datas, valor do frete e prazo de pagamento. Após salvar, o frete ficará disponível para os motoristas aceitarem.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  3. Posso cancelar um frete depois de aceito?
                </h3>
                <p className="text-gray-600">
                  Não é possível cancelar um frete após ser aceito por um motorista. Essa medida garante compromisso entre motoristas e embarcadores. Se houver necessidade de alteração ou cancelamento, entre em contato diretamente com a outra parte usando as informações de contato fornecidas no frete.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  4. Quais navegadores são compatíveis com o sistema?
                </h3>
                <p className="text-gray-600 mb-2">
                  O Cargo48 funciona nos principais navegadores modernos:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Google Chrome (versão 90 ou superior) - Recomendado</li>
                  <li>Mozilla Firefox (versão 88 ou superior)</li>
                  <li>Microsoft Edge (versão 90 ou superior)</li>
                  <li>Safari (versão 14 ou superior) para macOS e iOS</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  Para melhor experiência, mantenha seu navegador sempre atualizado.
                </p>
              </div>

              {/* FAQ 5 */}
              <div className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  5. Como alterar meus dados cadastrais?
                </h3>
                <p className="text-gray-600">
                  Clique no botão "Ver Cadastro" no canto superior direito da tela. Na tela de cadastro, você pode visualizar suas informações. Para motoristas, são exibidos dados do veículo, CNH e ANTT. Para embarcadores, são mostrados dados da empresa e endereço. Atualmente, as alterações de dados devem ser solicitadas através do suporte.
                </p>
              </div>

              {/* FAQ 6 */}
              <div className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  6. Como funciona o prazo de pagamento dos fretes?
                </h3>
                <p className="text-gray-600">
                  O prazo de pagamento é definido pelo embarcador ao publicar o frete, em dias (por exemplo, 30 ou 45 dias). Este prazo indica quando o pagamento será efetuado após a entrega da carga. O prazo padrão mais comum é de 30 dias, mas pode variar conforme acordado. Verifique sempre o prazo antes de aceitar um frete.
                </p>
              </div>

              {/* FAQ 7 */}
              <div className="pb-6 last:border-b-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  7. O que significa cada status do frete?
                </h3>
                <div className="text-gray-600 space-y-2">
                  <p className="mb-2">Os fretes podem ter os seguintes status:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Disponível:</strong> Frete publicado e aguardando aceitação de um motorista</li>
                    <li><strong>Pendente de Confirmação:</strong> Frete aceito por motorista, aguardando confirmação do embarcador</li>
                    <li><strong>Confirmado:</strong> Embarcador confirmou o motorista, aguardando início do transporte</li>
                    <li><strong>Em Trânsito:</strong> Carga foi coletada e está sendo transportada</li>
                    <li><strong>Entregue:</strong> Carga foi entregue no destino e confirmada</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Precisa de mais ajuda? Entre em contato com nosso suporte.
          </p>
        </div>
      </div>
    </div>
  );
}
