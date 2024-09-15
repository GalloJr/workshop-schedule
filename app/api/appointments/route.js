import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma.js';

// GET - obter lista de agendamentos
export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany();
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.error();
  }
}

// POST - criar um novo agendamento
export async function POST(req) {
    const { owner, vehicle, phone, service, date, time } = await req.json();
  
    const dateTime = new Date(`${date}T${time}:00Z`);
  
    try {
      const appointment = await prisma.appointment.create({
        data: {
          owner,
          vehicle,
          phone,
          service,
          date: dateTime, // Date field stores the date with time
          time, // Time field stores just the time part
        },
      });
      return new Response(JSON.stringify(appointment), { status: 201 });
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      return new Response(JSON.stringify({ error: 'Erro ao criar agendamento' }), { status: 500 });
    }
}

// DELETE - remover um agendamento
export async function DELETE(req) {
    const { id } = await req.json();
  
    try {
      await prisma.appointment.delete({
        where: { id: Number(id) },
      });
      return new Response(null, { status: 204 }); // No content
    } catch (error) {
      console.error('Erro ao remover agendamento:', error);
      return new Response(JSON.stringify({ error: 'Erro ao remover agendamento' }), { status: 500 });
    }
  }