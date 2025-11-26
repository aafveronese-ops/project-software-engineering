import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { Truck, Package, Loader2 } from 'lucide-react';

export default function Home() {
  const { user, isPending, redirectToLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      
      try {
        const res = await fetch('/api/users/me');
        const data = await res.json();
        
        if (data.profile) {
          if (data.profile.user_type === 'driver') {
            navigate('/driver');
          } else {
            navigate('/shipper');
          }
        } else {
          navigate('/setup');
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };

    checkProfile();
  }, [user, navigate]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Truck className="w-12 h-12 text-orange-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Cargo48
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Antecipação de recebíveis de frete em até 48 horas. Liquidez para motoristas, prazo para embarcadores.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-orange-100">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Para Motoristas</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">✓</span>
                <span>Receba antecipação do frete em até 48h</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">✓</span>
                <span>Encontre fretes disponíveis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">✓</span>
                <span>Gerencie suas entregas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">✓</span>
                <span>Saque via PIX gratuito</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Para Embarcadores</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Publique fretes rapidamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Mantenha seu prazo de pagamento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Acompanhe entregas em tempo real</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Motoristas verificados</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={redirectToLogin}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Entrar com Google
          </button>
        </div>
      </div>
    </div>
  );
}
