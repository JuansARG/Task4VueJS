Vue.createApp({
    data(){
        return{
            titulos: ['Home', 'Upcoming Events', 'Past Events', 'Contact', 'Stats'],
            logo: 'assets/img/Logo-Amazing-EventsGRANDE.png',
            cohorte: "Cohorte 37/38",
            id: "",
            eventos: [],
            eventoEspecifico: undefined,
            img: undefined,
            nombre: undefined,
            descripcion: undefined,
            date: undefined,
            lugar: undefined,
            categoria: undefined,
            capacidad: undefined,
            asistencia: undefined,
            estimado: undefined,
            precio: undefined
        }
    },
    created(){
        this.cargarDatos();
        
        
        
    },
    methods:{
        cargarDatos(){
            fetch('https://amazing-events.herokuapp.com/api/events')
                .then(respuesta => respuesta.json())
                .then(datos => {
                    this.eventos = datos.events;
                    this.buscarEvento();
                    this.cargarValoresEventoEspecifico();
                    console.table(this.eventos)
                    
                    
                })
                .catch(e => console.log(e));
        },
        buscarEvento(){
            this.id = new URLSearchParams(document.location.search).get('id');
            this.eventoEspecifico = this.eventos.find(e => e._id === this.id);
        }
        ,
        cargarValoresEventoEspecifico(){
            this.nombre = this.eventoEspecifico.name;
            this.img = this.eventoEspecifico.image;
            this.descripcion = this.eventoEspecifico.description;
            this.date = this.eventoEspecifico.date;
            this.lugar = this.eventoEspecifico.place;
            this.categoria = this.eventoEspecifico.category;
            this.capacidad = this.eventoEspecifico.capacity;
            this.asistencia = this.eventoEspecifico.assistance;
            this.estimado = this.eventoEspecifico.estimate;
            this.precio = this.eventoEspecifico.price;
        }
    },
    
}).mount("#details")