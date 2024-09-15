'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, CarIcon, SunIcon, CloudIcon, MoonIcon } from "lucide-react"; // Ícones diferentes para cada período
import { AppointmentModal } from "./AppointmentModal";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Importando o local pt-BR para formatar a data corretamente

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    owner: '',
    vehicle: '',
    phone: '',
    service: '',
    date: '',
    time: '',
  });

  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Formato yyyy-mm-dd
    const response = await fetch(`/api/appointments?date=${formattedDate}`);
    const data = await response.json();
    setAppointments(data);
  };

  const handleRemove = async (id) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id }),
      });
      if (response.ok) {
        console.log('Agendamento removido com sucesso');
        fetchAppointments();
      } else {
        console.error('Erro ao remover agendamento:', await response.json());
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const handleCreateAppointment = async (formData) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log('Agendamento criado com sucesso');
        fetchAppointments();
      } else {
        console.error('Erro ao criar agendamento:', await response.json());
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR }); // Formato dd/MM/yyyy com local pt-BR
  };

  const groupAppointmentsByPeriod = (appointments) => {
    const periods = {
      manha: [],
      tarde: [],
      noite: []
    };

    appointments.forEach((appointment) => {
      const hour = parseInt(appointment.time.split(':')[0], 10);
      if (hour >= 9 && hour <= 12) {
        periods.manha.push(appointment);
      } else if (hour >= 13 && hour <= 18) {
        periods.tarde.push(appointment);
      } else if (hour >= 19 && hour <= 21) {
        periods.noite.push(appointment);
      }
    });

    return periods;
  };

  const groupedAppointments = groupAppointmentsByPeriod(appointments);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <header className="flex items-center mb-8">
        <CarIcon className='mr-4 text-blue-400'/>
        <h1 className="text-2xl font-bold text-blue-400">SPS MECH</h1>
      </header>

      <main>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Sua agenda</h2>
            <p className="text-gray-400">Aqui você pode ver todos os clientes e serviços agendados para hoje.</p>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="text-blue-400" />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="bg-gray-800 text-white p-2 rounded"
              dateFormat="dd/MM/yyyy" // Formato de data no DatePicker
              locale={ptBR} // Local para português do Brasil
            />
          </div>
        </div>

        {/* Seção de períodos */}
        {Object.keys(groupedAppointments).map((periodKey) => (
          <section key={periodKey} className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                {periodKey === 'manha' && <SunIcon className="mr-2 h-5 w-5 text-yellow-500" />}
                {periodKey === 'tarde' && <CloudIcon className="mr-2 h-5 w-5 text-blue-500" />}
                {periodKey === 'noite' && <MoonIcon className="mr-2 h-5 w-5 text-purple-500" />}
                <h3 className="text-2xl font-bold">
                  {periodKey.charAt(0).toUpperCase() + periodKey.slice(1)}
                </h3>
              </div>
              <span className="text-gray-400">
                {periodKey === 'manha' && <b>09h-12h</b>}
                {periodKey === 'tarde' && <b>13h-18h</b>}
                {periodKey === 'noite' && <b>19h-21h</b>}
              </span>
            </div>

            {/* Único card com todos os agendamentos do período */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent>
                {groupedAppointments[periodKey].length > 0 ? (
                  groupedAppointments[periodKey].map((appointment) => (
                    <div key={appointment.id} className="flex justify-between items-center pt-4 border-b border-gray-700 last:border-b-0">
                      <div>
                        <p className="font-bold text-gray-400">
                          {appointment.time}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-400">
                          <b>{appointment.vehicle}</b> / {appointment.owner}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{appointment.service}</p>
                      </div>
                      <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => handleRemove(appointment.id)}>
                        Remover agendamento
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="pt-4 text-gray-400">Nenhum agendamento para este período.</p>
                )}
              </CardContent>
            </Card>
          </section>
        ))}

      </main>
      <div class="fixed-div">
        <AppointmentModal onSubmit={handleCreateAppointment} />
      </div>
    </div>
  );
}
