Vue.createApp({
    data() {
        return {
            titulos: ['Home', 'Upcoming Events', 'Past Events', 'Contact', 'Stats'],
            logo: 'assets/img/Logo-Amazing-EventsGRANDE.png',
            cohorte: "Cohorte 37/38",
            titulosTablas: ['Event statistics', 'Events with the hightest percentage of attendance', 'Events with the lowest percentage of attendance', 'Event with larger capacity', 'Upcoming events statistics by category', 'Past Events statistics by category'],
            subtitulosTablas: ['Categories', 'Revenues', 'Percentage of attendance'],
            eventos: [],
            categorias: [],
            categoriasEventosPasados: [],
            categoriasEventosProximos: [],
            fechaActual: undefined,
            eventosProximos: [],
            eventosPasados: [],
            eventosR: [],
            eventosProximosR: [],
            eventosPasadosR: [],
            eventoMayorAsistencia: undefined,
            eventoMenorAsistencia: undefined,
            eventoMayorCapacidad: undefined,
            estadisticasProximosPorCategoria: [],
            estadisticasPasadasPorCategoria: []
        }
    },
    created() {
        fetch('https://amazing-events.herokuapp.com/api/events')
            .then(respuesta => respuesta.json())
            .then(datos => {
                this.eventos = datos.events;
                this.fechaActual = new Date(datos.currentDate);
                this.filtrarEventosPorFecha();
                this.categorias = this.extraerCategorias(this.eventos);
                this.eventosR = this.resumirEventos(this.eventos);
                this.eventosProximosR = this.resumirEventos(this.eventosProximos);
                this.eventosPasadosR = this.resumirEventos(this.eventosPasados);
                this.categoriasEventosProximos = this.extraerCategorias(this.eventosProximosR);
                this.categoriasEventosPasados = this.extraerCategorias(this.eventosPasadosR);
                this.ordenarPor(this.eventosPasadosR, "percentageOfAttendance");
                console.table(this.eventosPasadosR);
                this.eventoMayorAsistencia = this.eventosPasadosR[0].name;
                this.eventoMenorAsistencia = this.eventosPasadosR[this.eventosPasadosR.length - 1].name;
                console.log(this.eventoMayorAsistencia);
                console.log(this.eventoMenorAsistencia);
                this.ordenarPor(this.eventosPasadosR, "capacity");
                this.eventoMayorCapacidad = this.eventosPasadosR[0].name;
                console.log(this.eventoMayorCapacidad);

                

                
            })
            .catch(e => console.log(e));
    },
    methods:{
        extraerCategorias(eventos) {
            let fn = e => e.category;
            let categorias = [... new Set(eventos.filter(fn).map(fn))];
            return categorias;
        },
        filtrarEventosPorFecha() {
            this.eventosProximos = this.eventos.filter(evento => {
            let fechaEvento = new Date(evento.date);
            return fechaEvento > this.fechaActual;
            });
           
            this.eventosPasados = this.eventos.filter(evento => {
                let fechaEvento = new Date(evento.date);
                return fechaEvento < this.fechaActual;
            });
        },
        resumirEventos(eventosParaIterar){
            let r = eventosParaIterar.map( evento => {
                return e = {
                    name: evento.name,
                    category: evento.category,
                    assistance: this.castearDato(evento.assistance),
                    capacity: this.castearDato(evento.capacity),
                    estimate: this.castearDato(evento.estimate),
                    price: evento.price,
                    percentageOfAttendance: this.extraerPorcentaje(evento)
                };
            })
            return r;
        },
        castearDato(dato) {
            if (dato === undefined) {
                return dato;
            } else {
                return Number(dato);
            };
        },
        extraerPorcentaje(evento) {
            if (evento.assistance !== undefined) {
                return Number(((evento.assistance * 100) / evento.capacity).toFixed(1));
            } else {
                return Number(((evento.estimate * 100) / evento.capacity).toFixed(1));
            };
        },
        ordenarPor(eventos, propiedad) {
            eventos.sort((a, b) => b[propiedad] - a[propiedad]);
        },
        

    }
}).mount('#stats');