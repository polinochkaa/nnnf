const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const docladSchema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    section: { type: String, required: true },
    docladname: { type: String, required: true },
    date: {type: String, default: new Date().getFullYear() },
    type: {type: String, enum: ['Устный', 'Стендовый', 'Пленарный']},
    status: {
        type: String,
        enum: ['На рассмотрении', 'Отклонен', 'Отправлен на доработку', 'Принят'],
        default: 'На рассмотрении'
    }
});


const Doclad = mongoose.model('Doclad', docladSchema);

module.exports = Doclad;
