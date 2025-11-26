import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Truck, Package, MapPin, Calendar, Home, Loader2, User, HelpCircle } from 'lucide-react';

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
  company_name: string;
  status: string;
  assignment_status?: string;
  pickup_confirmed_at?: string;
  delivery_confirmed_at?: string;
}

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'available' | 'my-freights'>('available');
  const [availableFreights, setAvailableFreights] = useState<Freight[]>([]);
  const [myFreights, setMyFreights] = useState<Freight[]>([]);
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
      const [availableRes, myRes] = await Promise.all([
        fetch('/api/freights/available'),
        fetch('/api/freights/driver'),
      ]);

      const availableData = await availableRes.json();
      const myData = await myRes.json();

      setAvailableFreights(availableData.freights || []);
      setMyFreights(myData.freights || []);
    } catch (error) {
      console.error('Error fetching freights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptFreight = async (freightId: number) => {
    try {
      const res = await fetch(`/api/freights/${freightId}/accept`, {
        method: 'POST',
      });

      if (res.ok) {
        await fetchFreights();
        setActiveTab('my-freights');
      } else {
        alert('Erro ao aceitar frete');
      }
    } catch (error) {
      console.error('Error accepting freight:', error);
      alert('Erro ao aceitar frete');
    }
  };

  const handleHome = () => {
    localStorage.removeItem('demo_user_type');
    navigate('/');
  };

  const handleViewProfile = () => {
    navigate('/setup?type=driver&demo=true');
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

  const getStatusBadge = (freight: Freight) => {
    if (freight.delivery_confirmed_at) {
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Entregue</span>;
    }
    if (freight.pickup_confirmed_at) {
      return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Em Trânsito</span>;
    }
    if (freight.assignment_status === 'confirmed') {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">Confirmado</span>;
    }
    if (freight.assignment_status === 'pending_confirmation') {
      return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">Aguardando Confirmação</span>;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-orange-500" />
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
        <div className="mb-6">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'available'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Fretes Disponíveis ({availableFreights.length})
            </button>
            <button
              onClick={() => setActiveTab('my-freights')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'my-freights'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Meus Fretes ({myFreights.length})
            </button>
          </div>
        </div>

        {activeTab === 'available' && (
          <div className="space-y-4">
            {availableFreights.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum frete disponível no momento</p>
              </div>
            ) : (
              availableFreights.map((freight) => (
                <div key={freight.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        <span className="font-semibold text-lg">
                          {freight.pickup_city}/{freight.pickup_state} → {freight.delivery_city}/{freight.delivery_state}
                        </span>
                      </div>
                      <p className="text-gray-600">{freight.cargo_description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {freight.weight_tons}t • {freight.distance_km}km
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
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
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      <span>{freight.company_name}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/freight/${freight.id}`)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Ver Detalhes
                    </button>
                    <button
                      onClick={() => handleAcceptFreight(freight.id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700"
                    >
                      Aceitar Frete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'my-freights' && (
          <div className="space-y-4">
            {myFreights.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Você ainda não aceitou nenhum frete</p>
              </div>
            ) : (
              myFreights.map((freight) => (
                <div key={freight.id} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        <span className="font-semibold text-lg">
                          {freight.pickup_city}/{freight.pickup_state} → {freight.delivery_city}/{freight.delivery_state}
                        </span>
                        {getStatusBadge(freight)}
                      </div>
                      <p className="text-gray-600">{freight.cargo_description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(freight.freight_value)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/freight/${freight.id}`)}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Ver Detalhes
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
