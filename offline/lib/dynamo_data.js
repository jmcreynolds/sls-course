
export function offline_options(){
    let options = {};

    if (process.env.IS_OFFLINE){
        options = {
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        };
    }

    return options;
}
