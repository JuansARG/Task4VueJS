Vue.createApp({
    data() {
        return {
            titulos: ['Home', 'Upcoming Events', 'Past Events', 'Contact', 'Stats'],
            logo: 'assets/img/Logo-Amazing-EventsGRANDE.png',
            eventos: [],
            eventosProximos: [],
            fechaActual: undefined,
            categorias: [],
            eventosFiltrados: [],
            cohorte: "Cohorte 37/38",
            checked: [],
            inputBusqueda: '',
        }
    },
    created() {
        this.cargarDatos();
    },
    methods: {
        cargarDatos(){
            fetch('https://amazing-events.herokuapp.com/api/events')
            .then(respuesta => respuesta.json())
            .then(datos => {
                this.eventos = datos.events;
                this.extraerCategorias();
                this.fechaActual = new Date(datos.currentDate);
                this.filtrarPorFecha();
                this.eventosFiltrados = this.eventosProximos;
            })
            .catch(e => console.log(e));
        },
        extraerCategorias() {
            let fn = e => e.category;
            this.categorias = [... new Set(this.eventos.filter(fn).map(fn))];
        },
        buscarPorInput() {
            this.eventosFiltrados = this.eventosProximos.filter(e => e.name.toLowerCase().trim().includes(this.inputBusqueda.toLowerCase().trim()));
        },
        buscarPorCategoria() {
            this.eventosFiltrados = this.eventosProximos.filter(e => this.checked.includes(e.category) || this.checked.length === 0);
        },
        filtrarPorFecha(){
            this.eventosProximos = this.eventos.filter(evento => {
                let fechaEvento = new Date(evento.date);
                return fechaEvento > this.fechaActual;
            })
        }
    },
    computed:{
        filtrar(){
            let eventosFiltradosPorCategoria = this.eventosProximos.filter(e => this.checked.includes(e.category) || this.checked.length === 0);
            this.eventosFiltrados = eventosFiltradosPorCategoria.filter(e => e.name.toLowerCase().trim().includes(this.inputBusqueda.toLowerCase().trim()));
        }
    }
}).mount('#upcomingEvents');