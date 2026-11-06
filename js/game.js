let p = {};
let generoAtual = "Masculino";
let cidadeAtual = "Porto";
let estiloCabelo = "👨‍💼 Clássico";

const cidadesLista = ["Porto", "Lisboa", "Braga", "Coimbra", "Faro"];
const cabelosLista = ["👨‍💼 Clássico", "🧑‍🦱 Encaracolado", "👨‍🦲 Careca", "👱‍♂️ Loiro", "👩‍🦰 Ruivo"];

function alternarGenero() {
    generoAtual = generoAtual === "Masculino" ? "Feminino" : "Masculino";
    document.getElementById('btn-genero').innerText = generoAtual === "Masculino" ? "♂️ Masculino" : "♀️ Feminino";
}

function alternarCabelo() {
    let idx = cabelosLista.indexOf(estiloCabelo);
    estiloCabelo = cabelosLista[(idx + 1) % cabelosLista.length];
    document.getElementById('btn-cabelo').innerText = estiloCabelo;
}

function alternarCidade() {
    let idx = cidadesLista.indexOf(cidadeAtual);
    cidadeAtual = cidadesLista[(idx + 1) % cidadesLista.length];
    document.getElementById('btn-cidade').innerText = `🇵🇹 ${cidadeAtual}`;
}

function iniciarJogo() {
    let nomeInput = document.getElementById('player-name').value.trim();
    if(!nomeInput) nomeInput = "Marco Silva";

    p = {
        nome: nomeInput, idade: 0, dinheiro: 1000, 
        cunha: Math.floor(Math.random() * 40) + 10,
        saude: 100, felicidade: 90, emprego: "Bebé", vivo: true,
        genero: generoAtual, cidade: cidadeAtual, avatarBase: estiloCabelo.split(" ")[0],
        loucura: Math.floor(Math.random() * 100), karma: Math.floor(Math.random() * 40) + 60,
        bens: []
    };

    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    document.getElementById('ui-nome').innerText = p.nome;
    document.getElementById('ui-detalhes').innerText = `${p.genero} | ${p.cidade}`;
    
    atualizarUI();
    logar(`✨ Nasceste em ${p.cidade}! Loucura inicial: ${p.loucura}%, Karma: ${p.karma}%.`);
}

function atualizarUI() {
    document.getElementById('ui-idade').innerText = `${p.idade} anos`;
    document.getElementById('ui-emprego').innerText = p.emprego;
    document.getElementById('ui-dinheiro').innerText = `${p.dinheiro}€`;
    document.getElementById('ui-cunha').innerText = `${p.cunha}%`;
    document.getElementById('ui-saude').innerText = `${p.saude}%`;
    document.getElementById('ui-felicidade').innerText = `${p.felicidade}%`;
    document.getElementById('ui-loucura').innerText = `${p.loucura}%`;
    document.getElementById('ui-karma').innerText = `${p.karma}%`;

    // Atualização de Avatar baseado na idade
    let av = p.avatarBase;
    if(!p.vivo) av = "💀";
    else if(p.idade < 3) av = "👶";
    else if(p.idade > 65) av = p.genero === "Feminino" ? "👵" : "👴";
    document.getElementById('ui-avatar').innerText = av;

    // Gerir visibilidade do botão da Escola
    let btnEscola = document.getElementById('btn-estudar');
    if(p.idade >= 6 && p.idade < 18) { btnEscola.style.display = "block"; } else { btnEscola.style.display = "none"; }

    // Atualizar bloco de bens comprados
    let assetsBox = document.getElementById('ui-assets');
    if(p.bens.length > 0) {
        assetsBox.classList.remove('hidden');
        assetsBox.innerText = "🏠 Os teus Bens: " + p.bens.join(", ");
    } else { assetsBox.classList.add('hidden'); }

    if(!p.vivo) {
        document.getElementById('action-buttons').innerHTML = `<button class="btn-danger" style="width:100%" onclick="reiniciar()">🔄 Fim de Jogo - Recomeçar</button>`;
    }
}

function logar(texto) {
    let box = document.getElementById('log');
    box.innerText += `\n\n• ${texto}`;
    box.scrollTop = box.scrollHeight;
}

function envelhecer() {
    if(!p.vivo) return;
    p.idade++;

    // Descontar custos de carros e casas e aplicar ordenados
    let custosBens = p.bens.length * 80;
    p.dinheiro -= custosBens;
    if(custosBens > 0) logar(`💸 Pagaste ${custosBens}€ em impostos de circulação e condomínios.`);

    let salarios = { "Bebé": 0, "Estudante": 0, "Desempregado": 0, "Técnico de IT": 1800, "Deputado": 3800, "Administrador": 7500 };
    let ganho = salarios[p.emprego] || 0;
    if(ganho > 0) {
        let irs = Math.floor(ganho * 0.30);
        p.dinheiro += (ganho - irs);
        document.getElementById('ui-dinheiro').innerText = `${p.dinheiro}€`;
    }

    if(p.idade === 6) { p.emprego = "Estudante"; logar("🎒 Entraste para a escola pública!"); }
    if(p.idade === 18 && p.emprego === "Estudante") { p.emprego = "Desempregado"; logar("🎓 Terminaste o secundário."); }

    if(p.idade > 70) p.saude -= Math.floor(Math.random() * 10);
    if(p.saude <= 0) { p.vivo = false; logar(`💀 Faleceu de causas naturais aos ${p.idade} anos.`); }
    atualizarUI();
}

function atividadesEstudante() {
    if(Math.random() > 0.5) {
        p.cunha = Math.min(100, p.cunha + 12);
        p.karma = Math.max(0, p.karma - 10);
        logar("🎓 Entraste na Associação de Estudantes! Aprendeste a arte do 'tacho' (+Cunha, -Karma).");
    } else {
        p.felicidade = Math.min(100, p.felicidade + 15);
        logar("📚 Estudaste no café central com amigos. Estás mais inteligente e feliz!");
    }
    atualizarUI();
}

function abrirStand() {
    let op = prompt("🛒 O que deseja comprar?\n1. Carro Velho (Datsun) - 800€\n2. Apartamento T1 Lisboa - 5000€");
    if(op === "1") {
        if(p.dinheiro < 800) { alert("Sem dinheiro!"); return; }
        p.dinheiro -= 800; p.bens.push("Datsun 1200 🚗"); p.felicidade = Math.min(100, p.felicidade + 20);
        logar("🚗 Compraste um Datsun clássico! As viagens à esplanada aumentaram a tua Felicidade.");
    } else if(op === "2") {
        if(p.dinheiro < 5000) { alert("Sem dinheiro!"); return; }
        p.dinheiro -= 5000; p.bens.push("T1 em Lisboa 🏠"); p.felicidade = Math.min(100, p.felicidade + 30);
        logar("🏠 Compraste um T1 em Lisboa! Já és considerado um investidor imobiliário de elite.");
    }
    atualizarUI();
}

function procurarEmprego() {
    if(p.idade < 18) { logar("❌ Demasiado novo."); return; }
    if(p.cunha > 65) { p.emprego = "Administrador"; logar("💼 Ajustes diretos garantiram-te a chefia de uma empresa estatal!"); }
    else if(p.cunha > 40) { p.emprego = "Deputado"; logar("💼 Conseguiste colocação nas listas partidárias!"); }
    else { p.emprego = "Técnico de IT"; logar("💼 Contratado numa consultora em Lisboa."); }
    atualizarUI();
}

function tentarCrime() {
    // A Loucura aumenta o ganho mas diminui o Karma. Cunha alta ajuda a safar!
    let fatorSucesso = (p.cunha + p.karma) / 2;
    if(p.loucura > 70) fatorSucesso -= 15; 

    if(Math.random() * 100 < fatorSucesso) {
        let roubo = p.loucura > 50 ? 5000 : 1500;
        p.dinheiro += roubo; p.karma = Math.max(0, p.karma - 15);
        logar(`💰 Esquema milionário funcionou! Lucro: ${roubo}€ devido ao teu fator Loucura (-Karma).`);
    } else {
        p.dinheiro = Math.max(0, p.dinheiro - 1500); p.felicidade -= 25; p.saude -= 10;
        logar("🚨 Foste apanhado nas escutas telefónicas da Judiciária! Tiveste de pagar advogados.");
    }
    atualizarUI();
}

function fazerNetworking() {
    if(p.dinheiro < 150) return;
    p.dinheiro -= 150; p.cunha = Math.min(100, p.cunha + 15); p.karma = Math.max(0, p.karma - 5);
    logar("🥂 Almoço de negócios prolongado pago aos connects! Cunha aumentada.");
    atualizarUI();
}

function reiniciar() { location.reload(); }
