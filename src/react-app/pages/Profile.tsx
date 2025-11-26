import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { User, Truck, Package, ArrowLeft, Loader2, Phone, Mail, MapPin, FileText } from 'lucide-react';

interface ProfileData {
  user_type: string;
  full_name: string;
  phone: string;
  email: string;
  driver?: {
    cpf: string;
    birth_date: string;
    vehicle_type: string;
    vehicle_brand: string;
    vehicle_model: string;
    vehicle_plate: string;
    cargo_capacity: number;
    cnh_number: string;
    cnh_category: string;
    cnh_expiry: string;
    antt_number: string;
    pix_key?: string;
    total_completed_freights: number;
  };
  shipper?: {
    company_name: string;
    trade_name?: string;
    cnpj: string;
    address_street: string;
    address_number: string;
    address_complement?: string;
    address_city: string;
    address_state: string;
    address_zip: string;
    credit_rating: string;
    total_posted_freights: number;
  };
}

export default function Profile() {
  const { user, isPending } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/');
      return;
    }
    if (user) {
      fetchProfile();
    }
  }, [user, isPending, navigate]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users/profile');
      const data = await res.json();
      setProfile(data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const vehicleTypeNames: Record<string, string> = {
    truck: 'Caminhão',
    semi_truck: 'Carreta',
    box_truck: 'Truck',
    flatbed: 'Toco',
  };

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Perfil não encontrado</p>
      </div>
    );
  }

  const isDriver = profile.user_type === 'driver';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(isDriver ? '/driver' : '/shipper')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <div className="flex items-center gap-3">
            {isDriver ? (
              <Truck className="w-8 h-8 text-orange-500" />
            ) : (
              <Package className="w-8 h-8 text-blue-500" />
            )}
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Cargo48
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className={`p-8 ${isDriver ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}>
            <div className="flex items-center gap-4 text-white">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <User className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{profile.full_name}</h2>
                <p className="text-white/90 text-lg">
                  {isDriver ? 'Motorista' : 'Embarcador'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="text-gray-900 font-medium">{profile.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {isDriver && profile.driver && (
              <>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documentação
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">CPF</p>
                      <p className="text-gray-900 font-medium">{profile.driver.cpf}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Data de Nascimento</p>
                      <p className="text-gray-900 font-medium">{formatDate(profile.driver.birth_date)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">CNH</p>
                      <p className="text-gray-900 font-medium">
                        {profile.driver.cnh_number} - Cat. {profile.driver.cnh_category}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Validade CNH</p>
                      <p className="text-gray-900 font-medium">{formatDate(profile.driver.cnh_expiry)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">ANTT</p>
                      <p className="text-gray-900 font-medium">{profile.driver.antt_number}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Veículo
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Tipo</p>
                      <p className="text-gray-900 font-medium">{vehicleTypeNames[profile.driver.vehicle_type]}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Placa</p>
                      <p className="text-gray-900 font-medium">{profile.driver.vehicle_plate}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Marca/Modelo</p>
                      <p className="text-gray-900 font-medium">
                        {profile.driver.vehicle_brand} {profile.driver.vehicle_model}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Capacidade</p>
                      <p className="text-gray-900 font-medium">{profile.driver.cargo_capacity} toneladas</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Fretes Concluídos</p>
                  <p className="text-3xl font-bold text-orange-600">{profile.driver.total_completed_freights}</p>
                </div>
              </>
            )}

            {!isDriver && profile.shipper && (
              <>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Informações da Empresa
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Razão Social</p>
                      <p className="text-gray-900 font-medium">{profile.shipper.company_name}</p>
                    </div>
                    {profile.shipper.trade_name && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Nome Fantasia</p>
                        <p className="text-gray-900 font-medium">{profile.shipper.trade_name}</p>
                      </div>
                    )}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">CNPJ</p>
                      <p className="text-gray-900 font-medium">{profile.shipper.cnpj}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Classificação de Crédito</p>
                      <p className="text-gray-900 font-medium">{profile.shipper.credit_rating}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Endereço
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">
                      {profile.shipper.address_street}, {profile.shipper.address_number}
                      {profile.shipper.address_complement && ` - ${profile.shipper.address_complement}`}
                    </p>
                    <p className="text-gray-900 mt-1">
                      {profile.shipper.address_city}/{profile.shipper.address_state} - CEP {profile.shipper.address_zip}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Fretes Publicados</p>
                  <p className="text-3xl font-bold text-blue-600">{profile.shipper.total_posted_freights}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
