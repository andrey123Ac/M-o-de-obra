document.addEventListener('DOMContentLoaded', function () {
  carregarDados();
});

function carregarDados() {
  const dados = obterDadosLocalStorage();
  const corpoTabela = document.getElementById('corpo-tabela');
  corpoTabela.innerHTML = '';

  dados.forEach(function (linha, index) {
    const tr = criarElemento('tr');

    const maoDeObraDireta = calcularMaoDeObraDireta(linha.diasTrabalho, linha.horasPorDia);

    const novoDado = {
      nome: linha.nome,
      estoque: linha.estoque,
      custoTotal: formatarMoeda(linha.custoMateriais + maoDeObraDireta),
      custoPorUnidade: formatarMoeda((linha.custoMateriais + maoDeObraDireta) / linha.estoque),
      precoVenda: formatarMoeda((linha.custoMateriais + maoDeObraDireta) * (1 + linha.margemLucro / 100)),
      precoVendaPorUnidade: formatarMoeda(((linha.custoMateriais + maoDeObraDireta) * (1 + linha.margemLucro / 100)) / linha.estoque),
      maoDeObraDireta: formatarMoeda(maoDeObraDireta.toFixed(2)), // Limitando para duas casas decimais
    };

    Object.values(novoDado).forEach(function (valor) {
      const td = criarElemento('td', valor);
      tr.appendChild(td);
    });

    const tdBotoes = criarElemento('td');
    const btnVendido = criarElemento('button', 'Vendido');
    
    
    btnVendido.addEventListener('click', function () {
      const quantidadeVendida = prompt('Informe a quantidade vendida:', '1');
      if (quantidadeVendida !== null) {
        venderProduto(index, parseInt(quantidadeVendida, 10));
      }
    });

    const btnExcluir = criarElemento('button', 'Excluir');
    btnExcluir.addEventListener('click', function () {
      excluirProduto(index);
    });

    tdBotoes.appendChild(btnVendido);
    tdBotoes.appendChild(btnExcluir);
    tr.appendChild(tdBotoes);

    corpoTabela.appendChild(tr);
  });
}


function formatarMoeda(valor) {
  return 'R$ ' + valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


function venderProduto(index, quantidadeVendida) {
  const dados = obterDadosLocalStorage();
  if (quantidadeVendida > dados[index].estoque) {
    alert('Quantidade vendida maior que o estoque disponível.');
    return;
  }
  dados[index].estoque -= quantidadeVendida;

  
  if (dados[index].estoque === 0) {
    dados[index].nome = '';
    dados[index].estoque = 0;
    dados[index].custoTotal = 0;
    dados[index].custoPorUnidade = 0;
    dados[index].precoVenda = 0;
    dados[index].precoVendaPorUnidade = 0;
    dados[index].maoDeObraDireta = 0;
  }

  localStorage.setItem('dados', JSON.stringify(dados));
  carregarDados();
}

function excluirProduto(index) {
  const dados = obterDadosLocalStorage();
  dados.splice(index, 1);
  localStorage.setItem('dados', JSON.stringify(dados));
  carregarDados();
}




function calcularMaoDeObraDireta(diasTrabalho, horasPorDia) {
  const custoHoraMaoDeObra = 10; // Substitua pelo valor desejado
  return diasTrabalho * horasPorDia * custoHoraMaoDeObra;
}

function criarElemento(tag, texto) {
  const elemento = document.createElement(tag);
  if (texto) {
    elemento.textContent = texto;
  }
  return elemento;
}

function obterDadosLocalStorage() {
  return JSON.parse(localStorage.getItem('dados')) || [];
}

function salvarDadosLocalStorage(novoDado) {
  const dadosAntigos = obterDadosLocalStorage();
  const novosDados = [...dadosAntigos, novoDado];
  localStorage.setItem('dados', JSON.stringify(novosDados));
}

function calcularCusto() {
  const nome = document.getElementById('nome').value;
  const diasTrabalho = parseInt(document.getElementById('dias').value, 10) || 0;
  const horasPorDia = parseInt(document.getElementById('horas').value, 10) || 0;
  const estoque = parseInt(document.getElementById('estoque').value, 10) || 0;
  const custoMateriais = parseFloat(document.getElementById('custoMateriais').value) || 0;
  const margemLucro = parseFloat(document.getElementById('margemLucro').value) || 0;

  const novoDado = {
    nome: nome,
    diasTrabalho: diasTrabalho,
    horasPorDia: horasPorDia,
    estoque: estoque,
    custoMateriais: custoMateriais,
    margemLucro: margemLucro,
  };

  salvarDadosLocalStorage(novoDado);
  carregarDados();
}

