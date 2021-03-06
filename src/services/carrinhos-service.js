'use strict'

const Nedb = require('nedb')
const { join } = require('path')

const authService = require('../services/auth-service')
const usuariosService = require('../services/usuarios-service')

const datastore = new Nedb({ filename: join(__dirname, '../data/carrinhos.db'), autoload: true })

exports.getAll = queryString => {
  return new Promise((resolve, reject) => {
    datastore.find(queryString, (err, resultado) => {
      /* istanbul ignore if */
      if (err) reject(err)
      resolve(resultado)
    })
  })
}

exports.existeCarrinho = pesquisa => {
  return new Promise((resolve, reject) => {
    datastore.count(pesquisa, (err, count) => {
      /* istanbul ignore if */
      if (err) reject(err)
      resolve(count !== 0)
    })
  })
}

exports.criarCarrinho = async body => {
  return new Promise((resolve, reject) => {
    datastore.insert(body, (err, novoProduto) => {
      /* istanbul ignore if */
      if (err) reject(err)
      resolve(novoProduto)
    })
  })
}

exports.extrairProdutosDuplicados = arrayProdutos => {
  var sortedArr = arrayProdutos.slice().sort()
  var produtosDuplicados = []
  for (var i = 0; i < sortedArr.length - 1; i++) {
    if (sortedArr[i + 1].idProduto === sortedArr[i].idProduto) {
      produtosDuplicados.push(sortedArr[i].idProduto)
    }
  }
  return produtosDuplicados
}

exports.deleteById = async id => {
  return new Promise((resolve, reject) => {
    datastore.remove({ _id: id }, {}, (err, quantidadeRegistrosExcluidos) => {
      /* istanbul ignore if */
      if (err) reject(err)
      resolve(quantidadeRegistrosExcluidos)
    })
  })
}

exports.getCarrinhoDoUsuario = async (authorization) => {
  const { email, password } = authService.verifyToken(authorization)
  const { _id: idUsuario } = await usuariosService.getDadosDoUsuario({ email, password })
  return this.getAll({ idUsuario })
}
