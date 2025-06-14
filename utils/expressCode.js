class expressError extends Error{
    constructor(statuscCode,message){
        super();
        this.statuscCode=statuscCode;
        this.message=message;
    }
};
export default expressError;