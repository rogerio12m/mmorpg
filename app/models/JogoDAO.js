var ObjectID = require('mongodb').ObjectId;

function JogoDAO(connection) {

    var Schema = connection.Schema;

    var jogoSchema = new Schema({

        usuario: { type: String, required: true },

        moeda: { type: Number, required: true },

        suditos: { type: Number, required: true },

        temor: { type: Number, required: true },

        sabedoria: { type: Number, required: true },

        comercio: { type: Number, required: true },

        magia: { type: Number, required: true }

    });

    var jogoModels = connection.models.jogoModel || connection.model("jogoModel", jogoSchema);

    this._jogomodels = jogoModels;

    var acaoSchema = new Schema({

        acao: { type: Number, required: true },

        quantidade: { type: Number, required: true },

        usuario: { type: String, required: true },

        acao_termina_em: { type: Number, required: true }

    });

    var acaoModels = connection.models.acaoModel || connection.model("acaoModel", acaoSchema);

    this._acaoModels = acaoModels;

}

JogoDAO.prototype.gerarParametros = function (usuario) {

    // Create an instance of model SomeModel
    var gerarParametros = new this._jogomodels({
        usuario: usuario,
        moeda: 15,
        suditos: 10,
        temor: Math.floor(Math.random() * 1000),
        sabedoria: Math.floor(Math.random() * 1000),
        comercio: Math.floor(Math.random() * 1000),
        magia: Math.floor(Math.random() * 1000)
    });

    async function salvar() {
        try {
            await gerarParametros.save();
            // console.log(gerarParametros);
        } catch (err) {
            next(err);
        }
    };

    salvar();
}

JogoDAO.prototype.iniciaJogo = async function (res, usuario, casa, msg) {

    var busca = await this._jogomodels.find({ usuario: usuario }).exec();
    // console.log(busca[0]);

    res.render('jogo', { img_casa: casa, jogo: busca[0], msg: msg });
}

JogoDAO.prototype.acao = async function (acao) {

    var date = new Date();

    var tempo = null;

    switch (parseInt(acao.acao)) {
        case 1: tempo = 1 * 60 * 60000; break;
        case 2: tempo = 2 * 60 * 60000; break;
        case 3: tempo = 5 * 60 * 60000; break;
        case 4: tempo = 5 * 60 * 60000; break;
    }

    acao.acao_termina_em = date.getTime() + tempo;

    // Create an instance of model SomeModel

    var gerarAcao = new this._acaoModels(acao);

    async function salvar() {
        try {
            await gerarAcao.save();
            console.log(acao);

        } catch (err) {
            console.log(err);
        }
    };

    salvar();

    //atualizar moedas

    var moedas = null;

    switch(parseInt(acao.acao)){
        case 1: moedas = -2 * acao.quantidade; break
        case 2: moedas = -3 * acao.quantidade; break
        case 3: moedas = -1 * acao.quantidade; break
        case 4: moedas = -1 * acao.quantidade; break
    }

    var atualizarAcao = await this._jogomodels.updateOne({usuario: acao.usuario}, {$inc: {moeda: moedas}});

    console.log(atualizarAcao);

}

JogoDAO.prototype.getAcoes = async function(usuario, res){
    var date = new Date();
    var momento_atual = date.getTime();

    var busca = await this._acaoModels.find({ usuario: usuario, acao_termina_em: {$gt: momento_atual} }).exec();

    res.render('pergaminhos', {acoes: busca});

    //console.log(busca);
}

JogoDAO.prototype.revogarAcao = async function(_id, res){
    await this._acaoModels.deleteOne({_id: _id});

    function redirect(err, result){
        res.redirect('jogo?msg=D')
    }

    redirect();
}

module.exports = function () {
    return JogoDAO;
};