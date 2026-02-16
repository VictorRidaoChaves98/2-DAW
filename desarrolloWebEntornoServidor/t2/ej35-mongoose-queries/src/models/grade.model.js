import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({}, { 
    strict: false, 
    collection: 'grades' 
});

export const Grade = mongoose.model('Grade', gradeSchema);
