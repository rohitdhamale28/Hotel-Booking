// this means our ExpressError class will also posses the featuers of default express Error class
class ExpressError extends Error{
    constructor(status,message){
       super();
       this.status=status;
       this.message= message;
    }
}

module.exports= ExpressError;