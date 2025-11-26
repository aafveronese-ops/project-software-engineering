import { useNavigate } from 'react-router';
import { Truck, Package } from 'lucide-react';

export default function DemoHome() {
  const navigate = useNavigate();

  const handleDriverDemo = () => {
    localStorage.setItem('demo_user_type', 'driver');
    navigate('/driver');
  };

  const handleShipperDemo = () => {
    localStorage.setItem('demo_user_type', 'shipper');
    navigate('/shipper');
  };

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

        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Escolha como deseja acessar a demonstração:
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={handleDriverDemo}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-orange-500 text-left group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sou Motorista</h3>
              <p className="text-gray-600">Ver fretes disponíveis e simular aceitação</p>
            </button>

            <button
              onClick={handleShipperDemo}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 text-left group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sou Embarcador</h3>
              <p className="text-gray-600">Publicar fretes e gerenciar entregas</p>
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Esta é uma demonstração do sistema Cargo48</p>
          <p className="mt-1">Os dados mostrados são fictícios para fins de apresentação</p>
        </div>
      </div>
    </div>
  );
}
