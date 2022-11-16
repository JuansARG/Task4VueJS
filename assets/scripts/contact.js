Vue.createApp({
    data() {
        return {
            titulos: ['Home', 'Upcoming Events', 'Past Events', 'Contact', 'Stats'],
            logo: 'assets/img/Logo-Amazing-EventsGRANDE.png',
            cohorte: "Cohorte 37/38",
            formulario: ""
        }
    },
    created() {
        this.formulario = ` <form class="d-flex flex-column">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Name:</label>
                                    <input type="text" class="form-control bg-secondary" id="name">
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email:</label>
                                    <input type="email" class="form-control bg-secondary" id="email">
                                </div>
                                <div class="mb-3">
                                    <label for="message" class="form-label">Message:</label>
                                    <textarea class="form-control bg-secondary" id="message" rows="4"></textarea>
                                </div>
                                <button type="submit" class="btn btn-secondary align-self-end w-40 boton-carta">Submit</button>
                                </form>`;
    }
}).mount('#contact');