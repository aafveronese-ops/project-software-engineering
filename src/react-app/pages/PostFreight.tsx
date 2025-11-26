import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Loader2, Package } from 'lucide-react';

export default function PostFreight() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cargoType: '',
    cargoDescription: '',
    weightTons: '',
    requiredVehicleType: 'truck' as const,
    pickupAddress: '',
    pickupCity: '',
    pickupState: '',
    pickupDate: '',
    pickupContactName: '',
    pickupContactPhone: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryDate: '',
    deliveryContactName: '',
    deliveryContactPhone: '',
    freightValue: '',
    paymentTermDays: 30 as const,
    distanceKm: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/freights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          weightTons: parseFloat(formData.weightTons),
          freightValue: parseFloat(formData.freightValue),
          distanceKm: formData.distanceKm ? parseFloat(formData.distanceKm) : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Frete publicado com sucesso:', data);
        setTimeout(() => {
          navigate('/shipper');
        }, 100);
      } else {
        const errorData = await res.json();
        console.error('Erro ao publicar frete:', errorData);
        alert('Erro ao publicar frete. Tente novamente.');
      }
    } catch (error) {
      console.error('Error posting freight:', error);
      alert('Erro ao publicar frete. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/shipper')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-8 h-8 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">Publicar Frete</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Informações da Carga</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Carga</label>
                <input
                  type="text"
                  required
                  value={formData.cargoType}
                  onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                  placeholder="Ex: Grãos, Alimentos, Materiais"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  required
                  value={formData.cargoDescription}
                  onChange={(e) => setFormData({ ...formData, cargoDescription: e.target.value })}
                  placeholder="Descreva a carga com detalhes"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (toneladas)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.weightTons}
                    onChange={(e) => setFormData({ ...formData, weightTons: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Veículo</label>
                  <select
                    required
                    value={formData.requiredVehicleType}
                    onChange={(e) => setFormData({ ...formData, requiredVehicleType: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="truck">Caminhão</option>
                    <option value="semi_truck">Carreta</option>
                    <option value="box_truck">Truck</option>
                    <option value="flatbed">Toco</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Local de Coleta</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  required
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    required
                    value={formData.pickupCity}
                    onChange={(e) => setFormData({ ...formData, pickupCity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={formData.pickupState}
                    onChange={(e) => setFormData({ ...formData, pickupState: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora da Coleta</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.pickupDate}
                  onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contato no Local</label>
                  <input
                    type="text"
                    required
                    value={formData.pickupContactName}
                    onChange={(e) => setFormData({ ...formData, pickupContactName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    required
                    value={formData.pickupContactPhone}
                    onChange={(e) => setFormData({ ...formData, pickupContactPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Local de Entrega</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  required
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    required
                    value={formData.deliveryCity}
                    onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={formData.deliveryState}
                    onChange={(e) => setFormData({ ...formData, deliveryState: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora da Entrega</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contato no Local</label>
                  <input
                    type="text"
                    required
                    value={formData.deliveryContactName}
                    onChange={(e) => setFormData({ ...formData, deliveryContactName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    required
                    value={formData.deliveryContactPhone}
                    onChange={(e) => setFormData({ ...formData, deliveryContactPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Informações Financeiras</h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Frete (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.freightValue}
                    onChange={(e) => setFormData({ ...formData, freightValue: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prazo de Pagamento</label>
                  <select
                    required
                    value={formData.paymentTermDays}
                    onChange={(e) => setFormData({ ...formData, paymentTermDays: parseInt(e.target.value) as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={30}>30 dias</option>
                    <option value={45}>45 dias</option>
                    <option value={60}>60 dias</option>
                    <option value={90}>90 dias</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distância (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.distanceKm}
                    onChange={(e) => setFormData({ ...formData, distanceKm: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações (opcional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publicando...
                </>
              ) : (
                'Publicar Frete'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
