const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    organisation: { type: String, required: true },
    position: { type: String, required: true },
    role: { type: String, enum: ['Участник', 'Руководитель секции', 'Админ', 'Оргкомитет'], default: 'Участник' },
    section: {type: String, default: NaN},
    consentGiven: { type: Boolean, required: true, default: false }

});

mongoose.model('User', UserSchema);

const User = mongoose.model('User', UserSchema);

module.exports = User;
