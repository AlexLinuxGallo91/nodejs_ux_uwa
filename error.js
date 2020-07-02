class ErrorUxOwa extends Error{
    constructor(mensajeError, dateStart, dateEnd) {
        super(mensajeError);
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
    }
}

module.exports = {
    ErrorUxOwa : ErrorUxOwa
}