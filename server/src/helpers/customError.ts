
export class CustomError extends Error {
    public status; 

    constructor(status: number, message: string) {
        super();
        this.message = message;
        this.status = status;
    }
}
