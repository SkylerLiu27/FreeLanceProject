export class AppError {
    constructor(public originalError?: any) {
        console.log(originalError);
        console.log('please try later');
    }
}
