import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Package, Plus, MapPin, Calendar, Home, Loader2, Truck, User, HelpCircle } from 'lucide-react';

interface Freight {
  id: number;
  cargo_type: string;
  cargo_description: string;
  weight_tons: number;
  pickup_city: string;
  pickup_state: string;
  delivery_city: string;
  delivery_state: string;
  pickup_date: string;
  freight_value: number;
  payment_term_days: number;
  distance_km: number;
  status: string;
  assigned_vehicle_plate?: string;
}

export default function ShipperDashboard() {
  const navigate = useNavigate();
  const [freights, setFreights] = useState<Freight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFreights();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      fetchFreights();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchFreights = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/freights/shipper');
      const data = await res.json();
      setFreights(data.freights || []);
    } catch (error) {
      console.error('Error fetching freights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHome = () => {
    localStorage.removeItem('demo_user_type');
    navigate('/');
  };

  const handleViewProfile = () => {
    navigate('/setup?type=shipper&demo=true');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      available: { bg: 'bg-green-100', text: 'text-green-700', label: 'Disponível' },
      pending_confirmation: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Aceito por Motorista' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Confirmado' },
      in_transit: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Em Trânsito' },
      delivered: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Entregue' },
      completed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Concluído' },
    };

    const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    return (
      <span className={`px-3 py-1 ${badge.bg} ${badge.text} rounded-full text-sm font-medium`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Cargo48
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/help')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <HelpCircle className="w-5 h-5" />
              Ajuda
            </button>
            <button
              onClick={handleViewProfile}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <User className="w-5 h-5" />
              Ver Cadastro
            </button>
            <button
              onClick={handleHome}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Home className="w-5 h-5" />
              Início
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Meus Fretes</h2>
            <p className="text-gray-600 mt-1">{freights.length} fretes cadastrados</p>
          </div>
          <button
            onClick={() => navigate('/shipper/post')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Publicar Frete
          </button>
        </div>

        <div className="space-y-4">
          {freights.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Você ainda não publicou nenhum frete</p>
              <button
                onClick={() => navigate('/shipper/post')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold"
              >
                <Plus className="w-5 h-5" />
                Publicar Primeiro Frete
              </button>
            </div>
          ) : (
            freights.map((freight) => (
              <div key={freight.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold text-lg">
                        {freight.pickup_city}/{freight.pickup_state} → {freight.delivery_city}/{freight.delivery_state}
                      </span>
                      {getStatusBadge(freight.status)}
                    </div>
                    <p className="text-gray-600">{freight.cargo_description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {freight.weight_tons}t • {freight.distance_km}km
                    </p>
                    {freight.assigned_vehicle_plate && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <Truck className="w-4 h-4" />
                        <span>Veículo: {freight.assigned_vehicle_plate}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(freight.freight_value)}
                    </div>
                    <p className="text-sm text-gray-500">{freight.payment_term_days} dias</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Coleta: {formatDate(freight.pickup_date)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate(`/freight/${freight.id}`)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Ver Detalhes
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('Tem certeza que deseja excluir este frete?')) {
                        try {
                          const res = await fetch(`/api/freights/${freight.id}`, {
                            method: 'DELETE',
                          });
                          if (res.ok) {
                            fetchFreights();
                          } else {
                            alert('Erro ao excluir frete');
                          }
                        } catch (error) {
                          console.error('Error deleting freight:', error);
                          alert('Erro ao excluir frete');
                        }
                      }
                    }}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
