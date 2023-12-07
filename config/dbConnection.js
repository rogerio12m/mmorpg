/* importar o mongodb */
const mongoose = require('mongoose');

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/got')
        console.log('conected');
    } catch (error) {
        console.log(`Erro: ${error}`);
    }
}

module.exports = main();
module.exports = mongoose;