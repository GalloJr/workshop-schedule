import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, ClockIcon, UserIcon, PhoneIcon, PawPrintIcon } from "lucide-react"

export function AppointmentModal({ onSubmit }) {
  const [formData, setFormData] = useState({
    owner: '',
    vehicle: '',
    phone: '',
    service: '',
    date: '',
    time: '',
  });

  const [isOpen, setIsOpen] = useState(false); // Estado para controlar o diálogo

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Chama a função de callback para criar o agendamento
    setIsOpen(false); // Fecha o modal após a submissão
  };

  const openModal = () => {
    setIsOpen(true); // Abre o modal
  };

  const closeModal = () => {
    setIsOpen(false); // Fecha o modal manualmente, se necessário
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          NOVO AGENDAMENTO
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Agende um serviço</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-gray-400 mb-4">
          Preencha os dados do cliente para realizar o agendamento:
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="owner">Nome do proprietário</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input id="owner" value={formData.owner} onChange={handleChange} placeholder="Renato Gallo" className="pl-10 bg-gray-700 border-gray-600" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle">Modelo do Veículo</Label>
            <div className="relative">
              <PawPrintIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input id="vehicle" value={formData.vehicle} onChange={handleChange} placeholder="ASX" className="pl-10 bg-gray-700 border-gray-600" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input id="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 00000-0000" className="pl-10 bg-gray-700 border-gray-600" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="service">Descrição do serviço</Label>
            <Textarea id="service" value={formData.service} onChange={handleChange} placeholder="Revisão Geral" className="bg-gray-700 border-gray-600" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="date" type="date" value={formData.date} onChange={handleChange} className="pl-10 bg-gray-700 border-gray-600" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="time" type="time" value={formData.time} onChange={handleChange} className="pl-10 bg-gray-700 border-gray-600" />
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            AGENDAR
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
