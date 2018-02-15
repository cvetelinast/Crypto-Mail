class Email {
    from: string = '';
    description: string = '';
    message: string = '';

    constructor(from: string, description: string, message: string) {
        this.from = from;
        this.description = description;
        this.message = message
    }

}
export = Email;