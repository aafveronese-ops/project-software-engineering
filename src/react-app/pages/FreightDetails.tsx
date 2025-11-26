import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { ArrowLeft, MapPin, Package, Loader2, CheckCircle } from 'lucide-react';

interface FreightDetails {
  id: number;
  shipper_id: number;
  status: string;
  cargo_type: string;
  cargo_description: string;
  weight_tons: number;
  required_vehicle_type: string;
  pickup_address: string;
  pickup_city: string;
  pickup_state: string;
  pickup_date: string;
  pickup_contact_name: string;
  pickup_contact_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_date: string;
  delivery_contact_name: string;
  delivery_contact_phone: string;
  freight_value: number;
  payment_term_days: number;
  distance_km: number;
  notes: string;
  company_name: string;
  trade_name: string;
}

export default function FreightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {} = useAuth();
  const [freight, setFreight] = useState<FreightDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showSignature, setShowSignature] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    fetchFreight();
    fetchProfile();
  }, [id]);

  const fetchFreight = async () => {
    try {
      const res = await fetch(`/api/freights/${id}`);
      const data = await res.json();
      setFreight(data.freight);
    } catch (error) {
      console.error('Error fetching freight:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/users/me');
      const data = await res.json();
      setUserProfile(data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleConfirmPickup = async () => {
    try {
      const res = await fetch(`/api/freights/${id}/confirm-pickup`, {
        method: 'POST',
      });

      if (res.ok) {
        await fetchFreight();
        alert('Coleta confirmada com sucesso!');
      }
    } catch (error) {
      console.error('Error confirming pickup:', error);
      alert('Erro ao confirmar coleta');
    }
  };

  const handleConfirmAssignment = async (action: 'confirm' | 'reject') => {
    try {
      const res = await fetch(`/api/freight-assignments/${id}/${action}`, {
        method: 'POST',
      });

      if (res.ok) {
        await fetchFreight();
        alert(action === 'confirm' ? 'Motorista confirmado!' : 'Motorista rejeitado');
      }
    } catch (error) {
      console.error('Error confirming assignment:', error);
      alert('Erro ao processar confirmação');
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleConfirmDelivery = async () => {
    if (!recipientName.trim()) {
      alert('Por favor, insira o nome do destinatário');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL();

    try {
      const res = await fetch(`/api/freights/${id}/confirm-delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName,
          signatureData,
        }),
      });

      if (res.ok) {
        setShowSignature(false);
        await fetchFreight();
        alert('Entrega confirmada com sucesso!');
      }
    } catch (error) {
      console.error('Error confirming delivery:', error);
      alert('Erro ao confirmar entrega');
    }
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

  const isDriver = userProfile?.user_type === 'driver';
  const isShipper = userProfile?.user_type === 'shipper';

  if (loading || !freight) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(isDriver ? '/driver' : '/shipper')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Frete #{freight.id}</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <Package className="w-5 h-5" />
                <span>{freight.company_name}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(freight.freight_value)}
              </div>
              <p className="text-sm text-gray-500">{freight.payment_term_days} dias</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Rota</h3>
              <div className="flex items-center gap-4 text-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <span className="font-medium">{freight.pickup_city}/{freight.pickup_state}</span>
                </div>
                <span className="text-gray-400">→</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span className="font-medium">{freight.delivery_city}/{freight.delivery_state}</span>
                </div>
                {freight.distance_km && (
                  <span className="text-gray-500">({freight.distance_km}km)</span>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Coleta</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Endereço:</strong> {freight.pickup_address}</p>
                  <p><strong>Data:</strong> {formatDate(freight.pickup_date)}</p>
                  <p><strong>Contato:</strong> {freight.pickup_contact_name}</p>
                  <p><strong>Telefone:</strong> {freight.pickup_contact_phone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Entrega</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Endereço:</strong> {freight.delivery_address}</p>
                  <p><strong>Data:</strong> {formatDate(freight.delivery_date)}</p>
                  <p><strong>Contato:</strong> {freight.delivery_contact_name}</p>
                  <p><strong>Telefone:</strong> {freight.delivery_contact_phone}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Carga</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Tipo:</strong> {freight.cargo_type}</p>
                <p><strong>Descrição:</strong> {freight.cargo_description}</p>
                <p><strong>Peso:</strong> {freight.weight_tons} toneladas</p>
                <p><strong>Veículo necessário:</strong> {freight.required_vehicle_type}</p>
              </div>
            </div>

            {freight.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Observações</h3>
                <p className="text-sm text-gray-600">{freight.notes}</p>
              </div>
            )}

            {isDriver && freight.status === 'confirmed' && (
              <button
                onClick={handleConfirmPickup}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Confirmar Coleta
              </button>
            )}

            {isDriver && freight.status === 'in_transit' && (
              <button
                onClick={() => setShowSignature(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Confirmar Entrega
              </button>
            )}

            {isShipper && freight.status === 'pending_confirmation' && (
              <div className="flex gap-4">
                <button
                  onClick={() => handleConfirmAssignment('confirm')}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-semibold"
                >
                  Confirmar Motorista
                </button>
                <button
                  onClick={() => handleConfirmAssignment('reject')}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg font-semibold"
                >
                  Rejeitar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSignature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Entrega</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Destinatário</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assinatura do Destinatário</label>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="border-2 border-gray-300 rounded-lg w-full cursor-crosshair"
                  style={{ touchAction: 'none' }}
                />
                <button
                  onClick={clearSignature}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  Limpar Assinatura
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowSignature(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelivery}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-lg font-semibold"
                >
                  Confirmar Entrega
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
