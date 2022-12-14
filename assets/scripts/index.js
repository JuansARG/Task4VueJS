Vue.createApp({
    data() {
        return {
            titulos: ['Home', 'Upcoming Events', 'Past Events', 'Contact', 'Stats'],
            logo: 'assets/img/Logo-Amazing-EventsGRANDE.png',
            eventos: [],
            categorias: [],
            eventosFiltrados: [],
            cohorte: "Cohorte 37/38",
            checked: [],
            inputBusqueda: '',
        }
    },
    created() {
        fetch('https://amazing-events.herokuapp.com/api/events')
            .then(respuesta => respuesta.json())
            .then(datos => {
                this.eventosFiltrados = datos.events;
                this.eventos = datos.events;
                this.fechaActual = datos.currentDate;
                this.extraerCategorias(); 
            })
            .catch(e => null);
    },
    methods: {
        extraerCategorias() {
            let fn = e => e.category;
            this.categorias = [... new Set(this.eventos.filter(fn).map(fn))];
        },
        buscarPorInput() {
            this.eventosFiltrados = this.eventos.filter(e => e.name.toLowerCase().trim().includes(this.inputBusqueda.toLowerCase().trim()));
        },
        buscarPorCategoria() {
            this.eventosFiltrados = this.eventos.filter(e => this.checked.includes(e.category) || this.checked.length === 0);
        }
    },
    computed:{
        filtrar(){
            let eventosFiltradosPorCategoria = this.eventos.filter(e => this.checked.includes(e.category) || this.checked.length === 0);
            this.eventosFiltrados = eventosFiltradosPorCategoria.filter(e => e.name.toLowerCase().trim().includes(this.inputBusqueda.toLowerCase().trim()));
        }
    }
}).mount('#index');