// rolagem de página
function pageScrolling(element) {
    document.querySelector(element).scrollIntoView({behavior: "smooth"});
}

document.querySelector("#home").addEventListener("click", function(event) {
    event.preventDefault();
    pageScrolling("#inicio");
});

document.querySelector("#serv").addEventListener("click", function(event) {
    event.preventDefault();
    pageScrolling("#services");
});

document.querySelector("#loc").addEventListener("click", function(event) {
    event.preventDefault();
    pageScrolling("#localizacao");
});

document.querySelector("#galery").addEventListener("click", function(event) {
    event.preventDefault();
    pageScrolling("#galeria");
});

// modal
function openModal() {
    document.getElementById("imageModal").style.display = "block";
}

// fechar modal
function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

let slideIndex = 1;
showLides(slideIndex);

// botões
function plusSlides(n) {
    showLides(slideIndex += n);
}

// slides 
function showLides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    if(n > slides.length) {
        slideIndex = 1;
    }
    if(n < 1) {
        slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
}

// exibir home
function showHome() {
    document.getElementById("main-content").style.display = "block";
    document.getElementById("sheduling-content").style.display = "none";
}

// exibir área de agendamento
function showSheduling() {
    document.getElementById("main-content").style.display = "none";
    document.getElementById("sheduling-content").style.display = "block";
}

// ocultar agendamento ao clicar em serviços
function showServices() {
    document.getElementById("main-content").style.display = "block";
    document.getElementById("sheduling-content").style.display = "none";
}

// ocultar agendamento ao clicar em galeria
function showGalery() {
    document.getElementById("main-content").style.display = "block";
    document.getElementById("sheduling-content").style.display = "none";
}

// ocultar agendamento ao clicar em localização
function showLoc() {
    document.getElementById("main-content").style.display = "block";
    document.getElementById("sheduling-content").style.display = "none";
}

// barra de navegação
document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById("header");
    const menuButton = document.getElementById("menu-btn");
    const collapsibleNavbar = document.getElementById("collapsibleNavbar");

    menuButton.addEventListener("click", function() {
        header.classList.toggle('expand');
    })
})

// tempo
// const serviceTime = {
//     'Cabelo': 35,
//     'Cabelo e Barba': 60,
//     'Barba': 35,
//     'Personalizado': 120
// };

// validar nome
function validarNomeCompleto(nome) {
    const nomeArray = nome.trim().split(/\s+/);
    return nomeArray.length >= 2;
}

// validar data
function validarDataDayjs(dateStr) {
    const isValid = dayjs(dateStr, "DD/MM/YYYY", true).isValid();
    if(!isValid) {
        return false;
    }

    const date = dayjs(dateStr, "DD/MM/YYYY");
    const today = dayjs();
    if(date.isBefore(today, "day")) {
        return false;
    }

    return true;
}

// Verificar conflito de horário e profissional
function verificarConflito(bookingData) {
    const storedData = JSON.parse(localStorage.getItem("bookingDataList")) || [];
    const hasConflict = storedData.some(data =>
        data.professional === bookingData.professional &&
        data.date === bookingData.date &&
        data.time === bookingData.time
    );

    if (hasConflict) {
        mostrarMensagem("Horário indisponível para esse profissional!", "warning");
        sugerirAlternativa(bookingData);
        return true;
    }

    return false;
}

// Sugerir alternativa de profissional ou horário
function sugerirAlternativa(bookingData) {
    const storedData = JSON.parse(localStorage.getItem("bookingDataList")) || [];
    const profissionais = ["Profissional 1", "Profissional 2", "Profissional 3", "Profissional 4"];
    
    // Sugere outro profissional disponível no mesmo horário e data
    const outroProfissional = profissionais.find(prof => 
        prof !== bookingData.professional &&
        !storedData.some(data => 
            data.professional === prof &&
            data.date === bookingData.date &&
            data.time === bookingData.time
        )
    );

    // Sugere outro horário para o mesmo profissional
    const proximoHorario = sugerirProximoHorario(bookingData.date, bookingData.time, bookingData.professional);

    let mensagem = "Sugestões disponíveis: ";
    if (outroProfissional) {
        mensagem += `Outro profissional disponível: ${outroProfissional}. `;
    }
    if (proximoHorario) {
        mensagem += `Outro horário com o mesmo profissional: ${proximoHorario}.`;
    }

    mostrarMensagem(mensagem, "info");
}

// Função para sugerir o próximo horário disponível
function sugerirProximoHorario(date, time, professional) {
    const storedData = JSON.parse(localStorage.getItem("bookingDataList")) || [];
    const [hour, minute] = time.split(":").map(Number);
    let proximoHorario = null;

    for (let i = hour + 1; i < 20; i++) { // Horários após o horário atual até as 20h
        const horarioSugerido = `${i.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        
        const horarioLivre = !storedData.some(data =>
            data.professional === professional &&
            data.date === date &&
            data.time === horarioSugerido
        );

        if (horarioLivre) {
            proximoHorario = horarioSugerido;
            break;
        }
    }

    return proximoHorario;
}

// função para validar horário
function validarHorario(time) {
    const [ hour, minute ] = time.split(":").map(Number);
    return hour >= 8 && hour < 20;
}

function validation() {
    const nome = document.getElementById("name").value;
    const data = document.getElementById("date").value;
    const horario = document.getElementById("time").value;

    // valida o nome
    if(!validarNomeCompleto(nome)) {
        mostrarMensagem("Por favor, insira o nome completo.", "warning");
        return false;
    }

    // valida data
    if(!validarDataDayjs(data)) {
        mostrarMensagem("Data inválida ou anterior ao dia atual", "warning");
        return false;
    }

    // valida horário
    if(!validarHorario(horario)) {
        mostrarMensagem("O horário deve ser entre às 08:00 e 20:00", "warning");
        return false;
    }

    return true;
}

// function enviar(event) {
//     event.preventDefault();

//     // Chama a função de validação
//     if (validation()) {
//         const name = document.getElementById("name").value;
//         const service = document.getElementById("service").value;
//         const professional = document.getElementById("professional").value;
//         const date = document.getElementById("date").value;
//         const time = document.getElementById("time").value;

//         const bookingData = { name, service, professional, date, time };

//         // Verifica conflito de agendamento
//         if (verificarConflito(bookingData)) {
//             mostrarMensagem("Agendamento já existente!", "warning");
//             return;
//         }

//         // Salva no localStorage
//         salvarAgendamento(bookingData);

//         // Envia agendamento para WhatsApp
//         enviarParaWhatsapp(bookingData);

//         // Reseta o formulário após o envio
//         resetForm();
//     }
// }


// salvar no localstorage
// function salvarAgendamento(bookingData) {
//     const bookingList = JSON.parse(localStorage.getItem("bookingDataList")) || [];
//     bookingList.push(bookingData);
//     localStorage.setItem("bookingDataList", JSON.stringify(bookingList));
// }

// exibir mensagem
function mostrarMensagem(mensagem, tipo) {
    const mensageDiv = document.getElementById("message");
    mensageDiv.textContent = mensagem;
    mensageDiv.classList = `alert alert-${tipo}`;
}

// enviar mensagem no zap
// function enviarParaWhatsapp(bookingData) {
//     const { name, service, professional, date, time } = bookingData;
//     const message = `Olá! Gostaria de agendar um horário. Nome: ${name}, Serviço: ${service}, Profissional: ${professional}, Data: ${date} e horário: ${time}`;
//     const numberWhatsapp = "5561998701721";
//     const whatsappUrl = `https://wa.me/${numberWhatsapp}?text=${message}`;
//     window.open(whatsappUrl, "_blank");

// }

// filtrar agendamento
// function filtrarAgendamento(event) {
//     event.preventDefault();

//     const filterProfessional = document.getElementById("filter-professional").value;
//     const filterPeriod = document.getElementById("filter-period").value;
//     const bookingList = JSON.parse(localStorage.getItem("bookingDataList")) || [];

//     const filteredBookings = bookingList.filter(agendamento => {
//         const matchesProfessional = filterProfessional ? agendamento.professional === filterProfessional : true;
//         const matchesPeriod = checkPeriod(agendamento.date, filterPeriod);

//         return matchesProfessional && matchesPeriod;
//     });

//     mostrarResultadosFiltrados(filteredBookings);
// }

function checkPeriod(dateStr, period) {
    const today = dayjs();
    const date = dayjs(dateStr, "YYYY-MM-DD");

    switch (period) {
        case "day":
            return date.isSame(today, "day");
        case "month": 
            return date.isSame(today, "month");
        case "nextTwoMonths":
            return date.isAfter(today) && date.isBefore(today.add(2, "month"));
        default:
            return true;
    }
}

// function mostrarResultadosFiltrados(filteredBookings) {
//     const resultsDiv = document.getElementById("filter-results");
//     resultsDiv.innerHTML = "";

//     if(filteredBookings.length === 0) {
//         resultsDiv.textContent = "Nenhum agendamento encontrato!";
//     } else {
//         filteredBookings.forEach(booking => {
//             const item = document.createElement("div");
//             item.textContent = `${booking.name} - ${booking.professional} - ${booking.date} - ${booking.time}`;
//             resultsDiv.appendChild(item);
//         });
//     }
// }

// cancelar agendamento
// function cancelarAgendamento() {
//     const cancelName = document.getElementById("cancel-name").value;
//     const cancelProfessional = document.getElementById("cancel-professional").value;
//     const cancelDate = document.getElementById("cancel-date").value;
//     let bookingList = JSON.parse(localStorage.getItem("bookingDataList")) || [];

//     const index = bookingList.findIndex(booking =>
//         booking.name === cancelName &&
//         booking.professional === cancelProfessional &&
//         booking.date === cancelDate
//     );

//     if (index !== -1) {
//         bookingList.splice(index, 1);
//         localStorage.setItem("bookingDataList", JSON.stringify(bookingList));
//         mostrarMensagem("Agendamento cancelado com sucesso", "success");
//     } else {
//         mostrarMensagem("Agendamento não encontrado", "warning");
//     }
// }

// resetar formulário
function resetForm() {
    document.getElementById('name').value = "";
    document.getElementById('service').value = "";
    document.getElementById('professional').value = "";
    document.getElementById('date').value = "";
    document.getElementById('time').value = "";
}

// Função para limpar o formulário
// function resetForm() {
//     document.getElementById("name").value = "";
//     document.getElementById("service").value = "";
//     document.getElementById("professional").value = "";
//     document.getElementById("date").value = "";
//     document.getElementById("time").value = "";
// }


// Validação
// function validation() {
//     const name = document.getElementById('name').value.trim();
//     const service = document.getElementById('service').value;
//     const professional = document.getElementById('professional').value;
//     const date = document.getElementById('date').value;
//     const time = document.getElementById('time').value;
//     const messageDiv = document.getElementById("message");

//     if(!validarNomeCompleto(name)) {
//         messageDiv.textContent = "Por favor, insira nome e sobrenome";
//         messageDiv.classList = "alert alert-warning";
//         return false;
//     }

//     if (!service || !professional || !date || !time) {
//         messageDiv.textContent = "Por favor, preencha os campos corretamente!";
//         messageDiv.classList = "alert alert-warning";
//         return false;
//     }

//     if(!validarDataDayjs(date)) {
//         messageDiv.textContent = "Por favor, insira uma data válida no futoro (DD/MM/YYYY)!";
//         messageDiv.classList = "alert alert-warning";
//         return false;
//     }

//     const selectedDate = new Date(`${date}T${time}`);
//     const currentTime = new Date();
//     const serviceDuration = serviceTime[service] || 0;
//     const endTime = new Date(selectedDate.getTime() + serviceDuration * 60000);

//     if (selectedDate < currentTime) {
//         messageDiv.textContent = "Por favor, selecione uma data e hora futura!";
//         messageDiv.classList = "alert alert-warning";
//         return false;
//     }

//     const selectedDateTime = dayjs(`${date} ${time}`, "DD/MM/YYYY HH:mm");
//     const hour = selectedDate.getHours();
//     if(hour < 8 || hour >= 20) {
//         messageDiv.textContent = "O horário deve ser entre 08:00 e 20:00!";
//         messageDiv.classList = "alert alert-warning";
//         return false;
//     }

//     if (endTime > new Date(selectedDate.getTime() + (8 * 60 * 60000))) {
//         messageDiv.textContent = "O tempo selecionado não é suficiente para completar o serviço!";
//         messageDiv.classList = "alert alert-warning";
//         return false;
//     }

//     messageDiv.textContent = "";
//     messageDiv.classList = "";
//     return true;
// }


// Função para enviar formulário
async function enviar(event) {

    event.preventDefault();

    if (validation()) {
        const name = document.getElementById('name').value;
        const service = document.getElementById('service').value;
        const professional = document.getElementById('professional').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        try { 
                const response = await fetch('http://localhost:3000/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, service, professional, date, time })
                });
                const data = await response.json();
                const messageDiv = document.getElementById("message");
                messageDiv.className = "";

                if (data.success) {
                    const formattedDateTime = formatarDateTime(data.booking.date, data.booking.time);
                    messageDiv.textContent = `Agendamento realizado com sucesso!\n${formattedDateTime}`;
                    messageDiv.classList.add("alert", "alert-success");
    
                    // chamando a função para limpar o formulário
                    resetForm();
                    // enviar agendamento para o whatsapp
                    // await enviarParaWhatsapp(data.booking);

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
                }, 3000);

            } catch(error) {
            const messageDiv = document.getElementById("message");
            messageDiv.textContent = "Erro ao realizar o agendamento.";
            messageDiv.classList.add("alert", "alert-danger");
            console.error("Erro:", error);
            };
    }
}

// async function enviarParaWhatsapp(booking) {
//     const name = document.getElementById('name').value;
//     const service = document.getElementById('service').value;
//     const professional = document.getElementById('professional').value;
//     const date = document.getElementById('date').value;
//     const time = document.getElementById('time').value;

//     const numberZap = "5561998701721";
//     let messageZap = `Olá! Me chamo ${name}! Meu agendamento ficou para o dia ${date} às ${time} com o profissional ${professional} e o serviço é ${service}!`;

//     const linkZap = `https://wa.me/${numberZap}?text=${messageZap}`;
// }

// Função para formatar data e hora
function formatarDateTime(dateStr, timeStr) {
    const utcDate = new Date(`${dateStr}T${timeStr}Z`);
    const localDate = new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000));

    const day = localDate.getDate().toString().padStart(2, '0');
    const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
    const year = localDate.getFullYear();
    const hour = localDate.getHours().toString().padStart(2, '0');
    const minute = localDate.getMinutes().toString().padStart(2, '0');

    return `Data: ${day}/${month}/${year}\nàs ${hour}:${minute}h`;
}

// Função para filtrar agendamentos
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
                    appointmentDiv.textContent = `Nome: ${appointment.name}, Serviço: ${appointment.service}, ${formattedDateTime}`;
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

// função para cancelar os agendamentos
function cancelar(event) {
    event.preventDefault();

    const name = document.getElementById('cancel-name').value;
    const professional = document.getElementById('cancel-professional').value;
    const date = document.getElementById('cancel-date').value;

    fetch('http://localhost:3000/cancel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, professional, date })
    })
    .then(response => response.json())
    .then(data => {
        const cancelResults = document.getElementById('cancel-results');
        cancelResults.className = '';
        if (data.success) {
            cancelResults.textContent = 'Agendamento cancelado com sucesso!';
            cancelResults.classList.add('alert', 'alert-success');
        } else {
            cancelResults.textContent = 'Erro ao cancelar o agendamento. Tente novamente.';
            cancelResults.classList.add('alert', 'alert-danger');
        }

        setTimeout(() => {
            cancelResults.textContent = '';
            cancelResults.classList.remove('alert', 'alert-success', 'alert-danger');
        }, 3000);
    })
    .catch(error => {
        const cancelResults = document.getElementById('cancel-results');
        cancelResults.textContent = 'Erro ao cancelar o agendamento.';
        cancelResults.classList.add('alert', 'alert-danger');
        console.error('Erro:', error);
    });
}