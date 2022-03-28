import mongoose from 'mongoose';

export const dbConnect = async () => {
    const mongoHost = 'localhost';
    const port = '27017'
    const dbName = 'fundraiseup-analytics';

    try {
        await mongoose.connect(`mongodb://${mongoHost}:${port}/${dbName}`);
    } catch (error) {
        throw new Error(error);
    }

    return mongoose.connection;
};