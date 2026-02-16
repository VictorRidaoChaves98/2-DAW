import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema({}, { 
    strict: false, 
    collection: 'data' 
});

export const Weather = mongoose.model('Weather', weatherSchema);
