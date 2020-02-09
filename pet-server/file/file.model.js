const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    date: { type: Date, default: Date.now },
    owner: { type: String, required: true },
    elements: { type: Schema.Types.Mixed, default: {} },
    signers: { type: Schema.Types.Mixed, default: {} }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('File', schema);