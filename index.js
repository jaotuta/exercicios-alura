//const fs = require('fs');
import chalk from 'chalk';
import fs, { link } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


function extraiLinksTexto (texto) {
    const regex = /\[([^\]]*)\]\((https?:\/\/[^s#\s].[^\s]*)\)/gm;
    const arrayResultados = [];
    let temp;
    while ((temp = regex.exec(texto)) !== null ) {
        arrayResultados.push({
            [temp[1]]: temp[2]
        })
    }
    return arrayResultados.length === 0 ? "Não há Links" : arrayResultados;
}

function trataErro(err) {

    throw new Error(err.code + " Deu Erro Aqui")

}

async function pegaArquivo(caminhoDoArquivo) {
    const encoding = 'utf-8';
    try {
        const texto = await fs.promises.readFile(caminhoDoArquivo, encoding)
        return extraiLinksTexto(texto)
    } catch(erro) {
        trataErro(erro)
    }
}

async function pegarArquivosPasta(caminho) {
    const caminhoAbsoluto = path.join(__dirname, '..', caminho);
    const encoding = 'utf-8';
    try {
      const arquivos = await fs.promises.readdir(caminhoAbsoluto, { encoding });
      const result = await Promise.all(arquivos.map(async (arquivo) => {
        const localArquivo = `${caminhoAbsoluto}/${arquivo}`;
        const texto = await fs.promises.readFile(localArquivo, encoding);
        return extraiLinks(texto);
      }));
      return result;
    } catch (erro) {
      return trataErro(erro);
    }
   }


export {pegaArquivo, pegarArquivosPasta};