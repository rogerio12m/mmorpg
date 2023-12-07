// const mongoose = require("mongoose");
var crypto = require('crypto');

function UsuariosDAO(connection) {

    var Schema = connection.Schema;

    var usuarioSchema = new Schema({

        nome: { type: String, required: true },

        usuario: { type: String, required: true },

        senha: { type: String, required: true },

        casa: { type: String, required: true }

    });

    // Compile model from schema
    var usuarioModels = connection.models.usuarioModel || connection.model("usuarioModel", usuarioSchema);

    this._models = usuarioModels;
};

UsuariosDAO.prototype.inserirUsuario = function (dadosForm) {

    var senha_criptografada = crypto.createHash('md5').update(dadosForm.senha).digest('hex');

    dadosForm.senha = senha_criptografada;

    // Create an instance of model SomeModel
    var inserirUsuario = new this._models({ nome: dadosForm.nome, usuario: dadosForm.usuario, senha: dadosForm.senha, casa: dadosForm.casa });

    // Save the new model instance, passing a callback
    async function inserir() {
        try {
            await inserirUsuario.save();
            console.log(dadosForm);
        } catch (err) {
            next(err);
        }
    };

    inserir();
};

UsuariosDAO.prototype.autenticar = async function (dadosForm, req, res) {

    var senha_criptografada = crypto.createHash('md5').update(dadosForm.senha).digest('hex');

    dadosForm.senha = senha_criptografada;

    var busca = await this._models.find({ usuario: dadosForm.usuario, senha: dadosForm.senha }).exec();
    // console.log(busca);

    if (busca[0] != undefined) {
        
        req.session.autorizado = true;

        req.session.usuario = busca[0].usuario;
        req.session.casa = busca[0].casa;
    }

    if (req.session.autorizado) {
        res.redirect('jogo');
    } else {
        res.render('index', {validacao: {}});
    }

};

module.exports = function () {
    return UsuariosDAO;
};