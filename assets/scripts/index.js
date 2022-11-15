Vue.createApp({
    data() {
        return {
            titulo: 'Home',
            eventos: [],
            fechaActual: '',
            categorias: [],
            eventosFiltrados: [],
            cohorte: "37/38",
            checked: [],
            inputBusqueda: '',
        }
    },
    created() {
        fetch('https://amazing-events.herokuapp.com/api/events')
            .then(respuesta => respuesta.json())
            .then(datos => {
                this.eventos = datos.events;
                this.fechaActual = datos.currentDate;
                this.extraerCategorias();
                this.eventosFiltrados = datos.events;
            })
            .catch(e => null);
    },
    methods: {
        extraerCategorias() {
            let fn = e => e.category;
            this.categorias = [... new Set(this.eventos.filter(fn).map(fn))];
        },
        buscarInput() {
            this.eventosFiltrados = this.eventos.filter(e => e.name.includes(this.inputBusqueda));
        },
        buscarCategoria() {
            this.eventosFiltrados = this.eventos.filter(e => this.checked.includes(e.category) || this.checked.length === 0);
        }
    },
    computed:{
        filtrar(){
           console.log( this.inputBusqueda )
        }
    }
}).mount('#app');