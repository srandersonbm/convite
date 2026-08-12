// Conteúdo do convite — edite aqui para atualizar textos do site sem mexer nos componentes.

export const EVENT = {
  guestName: "Alessandra Barbosa",
  age: 50,
  title: "50 anos de Alessandra Barbosa",
  dateISO: "2026-09-09T18:00:00-03:00", // TODO: confirmar horário exato
  dateLabel: "9 de setembro de 2026",
  weekdayLabel: "quarta-feira",
  timeLabel: "18h", // TODO: confirmar horário
  venueName: "Damata Restaurante & Cachaçaria",
  venueCity: "Imperatriz, MA", // TODO: confirmar cidade
  mapsUrl: "https://maps.app.goo.gl/uDgsBQ53sGyh3sNh7",
  mapsEmbedQuery: "Damata Restaurante & Cachaçaria",
  dressCode: "", // TODO: opcional, ex: "Esporte fino"
  rsvpDeadlineLabel: "", // TODO: opcional, ex: "até 30 de agosto"
  message:
    "Meio século de histórias, risadas e muito amor. Nada seria mais especial do que celebrar essa data ao lado de quem faz parte da minha caminhada. Venha brindar comigo!",
  whatsappMessageTemplate: (url: string) =>
    `Oi! 🎉 Você está convidado(a) para celebrar os 50 anos da Alessandra Barbosa!\n\n📅 9 de setembro\n📍 Damata Restaurante & Cachaçaria\n\nConfirme sua presença pelo link: ${url}`,
};
