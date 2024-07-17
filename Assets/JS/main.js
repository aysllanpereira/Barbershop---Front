const serviceTime = {
    'Cabelo': 40,
    'Cabelo e Barba': 80,
    'Barba': 30,
    'Personalizado': 120
};

// Validação
function validation() {
    const name = document.getElementById('name').value;
    const service = document.getElementById('service').value;
    const professional = document.getElementById('professional').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const messageDiv = document.getElementById("message");

    if (!name || !service || !professional || !date || !time) {
        messageDiv.textContent = "Por favor, preencha os campos corretamente!";
        messageDiv.classList = "alert alert-warning";
        return false;
    }

    const selectedDate = new Date(`${date}T${time}`);
    const currentTime = new Date();
    const serviceDuration = serviceTime[service] || 0;
    const endTime = new Date(selectedDate.getTime() + serviceDuration * 60000);

    if (selectedDate < currentTime) {
        messageDiv.textContent = "Por favor, selecione uma data e hora futura!";
        messageDiv.classList = "alert alert-warning";
        return false;
    }

    if (endTime > new Date(selectedDate.getTime() + (8 * 60 * 60000))) {
        messageDiv.textContent = "O tempo selecionado não é suficiente para completar o serviço!";
        messageDiv.classList = "alert alert-warning";
        return false;
    }

    messageDiv.textContent = "";
    messageDiv.classList = "";
    return true;
}

// Função para enviar formulário
function enviar(event) {
    event.preventDefault();

    if (validation()) {
        const name = document.getElementById('name').value;
        const service = document.getElementById('service').value;
        const professional = document.getElementById('professional').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        fetch('http://localhost:3000/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, service, professional, date, time })
        })
        .then(response => response.json())
        .then(data => {
            const messageDiv = document.getElementById("message");
            messageDiv.className = "";
            if (data.success) {
                const formattedDateTime = formatarDateTime(date, time);
                messageDiv.textContent = `Agendamento realizado com sucesso! ${formattedDateTime}`;
                messageDiv.classList.add("alert", "alert-success");
            } else if (data.alternative) {
                messageDiv.textContent = `Profissional indisponível. Tente com outro profissional!`;
                messageDiv.classList.add("alert", "alert-warning");
            } else {
                messageDiv.textContent = "Erro ao realizar o agendamento. Tente novamente.";
                messageDiv.classList.add("alert", "alert-danger");
            }

            messageDiv.disabled = true;

            setTimeout(() => {
                messageDiv.textContent = "";
                messageDiv.classList.remove("alert", "alert-success", "alert-warning", "alert-danger");
                messageDiv.disabled = false;
            }, 15000);
        })
        .catch(error => {
            const messageDiv = document.getElementById("message");
            messageDiv.textContent = "Erro ao realizar o agendamento. Tente novamente.";
            messageDiv.classList.add("alert", "alert-danger");
            console.error("Erro:", error);

            messageDiv.disabled = true;

            setTimeout(() => {
                messageDiv.textContent = "";
                messageDiv.classList.remove("alert", "alert-success", "alert-warning", "alert-danger");
                messageDiv.disabled = false;
            }, 15000);
        });
    }
}

// Formatando a data e hora no padrão brasileiro
function formatarDateTime(dateStr, timeStr) {
    const dateTimeStr = `${dateStr}T${timeStr}`;
    const dateTime = new Date(dateTimeStr);

    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

    return dateTime.toLocaleDateString('pt-BR', options) + ' ' + dateTime.toLocaleTimeString('pt-BR', options);
}

function filtrar(event) {
    event.preventDefault();

    const professional = document.getElementById('filter-professional').value;
    const period = document.getElementById('filter-period').value;

    fetch(`http://localhost:3000/filter?period=${period}&professional=${professional}`)
    .then(response => response.json())
    .then(data => {
        const filterResults = document.getElementById('filter-results');
        filterResults.innerHTML = '';

        if (data.success) {
            const appointments = data.appointments;
            if (appointments.length > 0) {
                appointments.forEach(appointment => {
                    const appointmentDiv = document.createElement('div');
                    appointmentDiv.classList.add('appointment');
                    const formattedDateTime = formatarDateTime(appointment.date, appointment.time);
                    appointmentDiv.textContent = `Nome: ${appointment.name}, Serviço: ${appointment.service}, Data e Hora: ${formattedDateTime}`;
                    filterResults.appendChild(appointmentDiv);
                });
            } else {
                filterResults.textContent = 'Nenhum agendamento encontrado para o período selecionado.';
                filterResults.classList.add('alert', 'alert-warning');
            }
        } else {
            filterResults.textContent = 'Erro ao filtrar os agendamentos.';
            filterResults.classList.add('alert', 'alert-danger');
        }
    })
    .catch(error => {
        const filterResults = document.getElementById('filter-results');
        filterResults.textContent = 'Erro ao filtrar os agendamentos.';
        filterResults.classList.add('alert', 'alert-danger');
        console.error("Erro:", error);
    });
}

// Listar horários disponíveis
// document.getElementById('date').addEventListener('change', function () {
//     const professional = document.getElementById('professional').value;
//     const date = this.value;

//     if (professional && date) {
//         fetch(`http://localhost:3000/availability?professional=${professional}&date=${date}`)
//             .then(response => response.json())
//             .then(data => {
//                 const availableTimesDiv = document.getElementById('available-times');
//                 const unavailableTimesDiv = document.getElementById('unavailable-times');
//                 availableTimesDiv.innerHTML = '';
//                 unavailableTimesDiv.innerHTML = '';

//                 if (data.success) {
//                     const bookedTimes = data.bookedTimes;
//                     const { availableTimes, unavailableTimes } = generateAvailableAndUnavailableTimes(bookedTimes);

//                     // Exibir horários disponíveis
//                     availableTimes.forEach(time => {
//                         const timeDiv = document.createElement('div');
//                         timeDiv.textContent = time;
//                         availableTimesDiv.appendChild(timeDiv);
//                     });

//                     // Exibir horários indisponíveis
//                     unavailableTimes.forEach(time => {
//                         const timeDiv = document.createElement('div');
//                         timeDiv.textContent = time;
//                         unavailableTimesDiv.appendChild(timeDiv);
//                     });
//                 } else {
//                     console.error('Erro ao obter horários disponíveis:', data.message);
//                 }
//             })
//             .catch(error => {
//                 console.error('Erro ao buscar horários disponíveis:', error);
//             });
//     }
// });

// function generateAvailableAndUnavailableTimes(bookedTimes) {
//     const startTime = 8;
//     const endTime = 18;
//     const timeInterval = 30;

//     const availableTimes = [];
//     const unavailableTimes = [];

//     for (let hour = startTime; hour < endTime; hour++) {
//         for (let minute = 0; minute < 60; minute += timeInterval) {
//             const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
//             const timeSlot = new Date(`1970-01-01T${timeString}:00Z`).toISOString();

//             const isBooked = bookedTimes.some(booked => {
//                 const bookedStart = new Date(booked.startTime).toISOString();
//                 const bookedEnd = new Date(booked.endTime).toISOString();
//                 return timeSlot >= bookedStart && timeSlot < bookedEnd;
//             });

//             if (isBooked) {
//                 unavailableTimes.push(timeString);
//             } else {
//                 availableTimes.push(timeString);
//             }
//         }
//     }

//     return { availableTimes, unavailableTimes };
// }
