import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Truck, Package, ArrowLeft } from 'lucide-react';
import DriverSetupForm from '@/react-app/components/DriverSetupForm';
import ShipperSetupForm from '@/react-app/components/ShipperSetupForm';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';
  const typeParam = searchParams.get('type') as 'driver' | 'shipper' | null;
  const [profileType, setProfileType] = useState<'driver' | 'shipper' | null>(typeParam);

  useEffect(() => {
    if (typeParam) {
      setProfileType(typeParam);
    }
  }, [typeParam]);

  if (!profileType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastro de Usuário</h1>
            <p className="text-gray-600">Escolha o tipo de cadastro:</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setProfileType('driver')}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-orange-500 text-left"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sou Motorista</h3>
              <p className="text-gray-600">Cadastro de motorista autônomo</p>
            </button>

            <button
              onClick={() => setProfileType('shipper')}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 text-left"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sou Embarcador</h3>
              <p className="text-gray-600">Cadastro de empresa embarcadora</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => isDemo ? navigate(profileType === 'driver' ? '/driver' : '/shipper') : setProfileType(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        {isDemo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Modo Demonstração:</strong> Este é um exemplo de como seria o formulário de cadastro. 
              Em produção, estes dados seriam salvos no sistema.
            </p>
          </div>
        )}

        {profileType === 'driver' ? (
          <DriverSetupForm />
        ) : (
          <ShipperSetupForm />
        )}
      </div>
    </div>
  );
}
