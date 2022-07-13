
export function offline_options(){
    let options = {};

    if (process.env.IS_OFFLINE){
        options = {
            region: 'localhost',
            endpoint: 'http://dynamodb.local:8000',
            accessKeyId: 'chickens',
            secretAccessKey: 'chickens'
        };
    }

    return options;
}
