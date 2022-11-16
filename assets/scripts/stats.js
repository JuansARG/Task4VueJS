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
            eventoMayorAsistencia: undefined,
            eventoMenorAsistencia: undefined,
            eventoMayorCapacidad: undefined,
            estadisticasPorCategoriaEventosProximos: [],
            estadisticasPorCategoriaEventosPasados: []
        }
    },
    created() {
        this.cargarDatos();
    },
    methods:{
        cargarDatos(){
            fetch('https://amazing-events.herokuapp.com/api/events')
                .then(respuesta => respuesta.json())
                .then(datos => {
                    this.eventos = datos.events;
                    this.fechaActual = new Date(datos.currentDate);
                    this.eventosR = this.resumirEventos(this.eventos);
                    this.filtrarEventosPorFecha();

                    this.categorias = this.extraerCategorias(this.eventos);
                    this.categoriasEventosProximos = this.extraerCategorias(this.eventosProximos);
                    this.categoriasEventosPasados = this.extraerCategorias(this.eventosPasados);

                    this.ordenarPor(this.eventosPasados, "percentageOfAttendance");
                    this.eventoMayorAsistencia = this.eventosPasados[0].name;
                    this.eventoMenorAsistencia = this.eventosPasados[this.eventosPasados.length - 1].name;

                    this.ordenarPor(this.eventos, "capacity");
                    this.eventoMayorCapacidad = this.eventos[0].name;

                    this.estadisticasPorCategoriaEventosProximos = this.categoriasEventosProximos.map(c => this.crearEstadisticasPorCategoria(this.eventosProximos, c));
                    this.estadisticasPorCategoriaEventosPasados = this.categoriasEventosPasados.map(c => this.crearEstadisticasPorCategoria(this.eventosPasados, c));
                    this.ordenarPor(this.estadisticasPorCategoriaEventosProximos, 'revenues');
                    this.ordenarPor(this.estadisticasPorCategoriaEventosPasados, 'revenues');

                    console.table(this.eventosProximos);
                    console.table(this.eventosPasados);
                })
                .catch(e => console.log(e));
        },
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
            this.eventosProximos = this.resumirEventos(this.eventosProximos);
           
            this.eventosPasados = this.eventos.filter(evento => {
                let fechaEvento = new Date(evento.date);
                return fechaEvento < this.fechaActual;
            });
            this.eventosPasados = this.resumirEventos(this.eventosPasados);
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
        crearEstadisticasPorCategoria(eventos, categoria) {
            let eventosFiltrados = eventos.filter(e => categoria.includes(e.category));
            let c = {
                category: categoria,
                revenues: eventosFiltrados.reduce((acc, e) => acc + this.ganancias(e), 0),
                percentageOfAttendance: ((eventosFiltrados.reduce((acc, e) => acc + e.percentageOfAttendance, 0)) / eventosFiltrados.length).toFixed(1)
            }
            return c;
        },
        ganancias(evento) {
            if (evento.assistance === undefined) {
                return (evento.price * evento.estimate);
            } else {
                return (evento.price * evento.assistance);
            }
        }
    }
}).mount('#stats');