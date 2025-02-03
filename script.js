document.addEventListener('DOMContentLoaded', function () {
    fetch('https://mayconpadilha.github.io/Banco-JSON/TCC/dadosDefault.json')
        .then(response => response.json())
        .then(data => {
            // Mapeando os dados das tabelas
            const periodos = {};
            const classrooms = {};
            const classes = {};
            const subjects = {};
            const lessons = {};
            const reservas = [];

            console.log(data.r.dbiAccessorRes.tables);

            // Periods
            data.r.dbiAccessorRes.tables[1].data_rows.forEach(periodo => {
                periodos[periodo.id] = {
                    start: periodo.starttime,
                    end: periodo.endtime
                };
            });

            // Classrooms
            data.r.dbiAccessorRes.tables[11].data_rows.forEach(classroom => {
                classrooms[classroom.id] = classroom.name;
            });

            // Classes
            data.r.dbiAccessorRes.tables[12].data_rows.forEach(classe => {
                classes[classe.id] = {
                    id: classe.id,
                    name: classe.short
                }
            });

            // Subjects
            data.r.dbiAccessorRes.tables[13].data_rows.forEach(subject => {
                subjects[subject.id] = {
                    id: subject.id,
                    name: subject.short
                }
            });
            
            // Lessons
            data.r.dbiAccessorRes.tables[18].data_rows.forEach(lesson => {
                lessons[lesson.id] = {
                    id: lesson.id,
                    subjectid: lesson.subjectid,
                    daysdefid: lesson.daysdefid,
                    classids: lesson.classids[0],
                }
            });

            data.r.dbiAccessorRes.tables[20].data_rows.forEach(cards => {
                let lessonid, classroomids, days, dayName;

                lessonid = {
                    id: cards.lessonid,
                    subjectid: {
                        id: lessons[cards.lessonid].subjectid,
                        name: subjects[lessons[cards.lessonid].subjectid]?.name || 'Nome não disponível',
                        classids: {
                            id: lessons[cards.lessonid].classids,
                            name: classes[lessons[cards.lessonid].classids]?.name || 'Nome não disponível',
                        }
                    },
                }

                classroomids = {
                    id: cards.classroomids[0],
                    name: classrooms[cards.classroomids[0]] || 'Nome não disponível'
                }

                switch (cards.days) {
                    case '10000':
                        dayName = 'Segunda';
                        break;
                    case '01000':
                        dayName = 'Terça';
                        break;
                    case '00100':
                        dayName = 'Quarta';
                        break;
                    case '00010':
                        dayName = 'Quinta';
                        break;
                    case '00001':
                        dayName = 'Sexta';
                        break;
                    default:
                        dayName = 'Dia não disponível';
                }

                days = {
                    id: cards.days,
                    period: cards.period,
                    name: dayName,
                    hora_inicio: periodos[cards.period]?.start || 'Desconhecido',
                    hora_fim: periodos[cards.period]?.end || 'Desconhecido',
                }

                const reserva = {
                    id: cards.id,
                    classroomids: classroomids,
                    days: days,
                    lessonid: lessonid,
                };
                reservas.push(reserva);
            });

            // Função para criar os elementos HTML e mostrar os dados das reservas
            const horariosContainer = document.getElementById('horarios-container');
            reservas.forEach(reserva => {
                const reservaElement = document.createElement('div');
                reservaElement.className = 'reserva';

                const lessonElement = document.createElement('p');
                lessonElement.textContent = `Matéria: ${reserva.lessonid.subjectid.name}`;

                const lessonClassroomElement = document.createElement('p');
                lessonClassroomElement.textContent = `Turma: ${reserva.lessonid.subjectid.classids.name}`;

                const classroomElement = document.createElement('p');
                classroomElement.textContent = `classroom: ${reserva.classroomids.name}`;

                const periodElement = document.createElement('p');
                periodElement.textContent = `Periodo: ${reserva.days.period}`;

                const daysElement = document.createElement('p');
                daysElement.textContent = `Dia: ${reserva.days.name}`;

                const timeElement = document.createElement('p');
                timeElement.textContent = `Horário: ${reserva.days.hora_inicio} - ${reserva.days.hora_fim}`;

                reservaElement.appendChild(lessonElement);
                reservaElement.appendChild(lessonClassroomElement);
                reservaElement.appendChild(classroomElement);
                reservaElement.appendChild(periodElement);
                reservaElement.appendChild(daysElement);
                reservaElement.appendChild(timeElement);

                horariosContainer.appendChild(reservaElement);
            });

            console.log('Reservas:', reservas);
        })
        .catch(error => {
            console.error('Erro ao buscar os dados:', error);
        });
});
