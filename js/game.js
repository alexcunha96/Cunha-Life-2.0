let p = {};

function iniciarJogo() {
    let nomeInput = document.getElementById('player-name').value.trim();
    if(!nomeInput) nomeInput = "Alexandre";

    p = {
        nome: nomeInput, 
        idade: 0, 
        dinheiro: 1000, 
        cunha: Math.floor(Math.random() * 40) + 10,
        saude: 100, 
        felicidade: 90, 
        emprego: "Bebé", 
        vivo: true,
        genero: Math.random() > 0.5 ? "Masculino" : "Feminino",
        orientacao: Math.random() > 0.3 ? "Hetero" : "Gay"
    };

    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    atualizarUI();
    logar(`✨ Nasceste! É um orgulho ser cidadão nacional.`);
}

function atualizarUI() {
    document.getElementById('ui-nome').innerText = p.nome;
    document.getElementById('ui-detalhes').innerText = `${p.genero} | ${p.orientacao}`;
    document.getElementById('ui-idade').innerText = `${p.idade} anos`;
    document.getElementById('ui-emprego').innerText = p.emprego;
    document.getElementById('ui-dinheiro').innerText = `${p.dinheiro}€`;
    document.getElementById('ui-cunha').innerText = `${p.cunha}%`;
    document.getElementById('ui-saude').innerText = `${p.saude}%`;
    document.getElementById('ui-felicidade').innerText = `${p.felicidade}%`;

    let av = "🧑";
    if(!p.vivo) av = "💀";
    else if(p.idade < 3) av = "👶";
    else if(p.idade < 12) av = "👦";
    else if(p.idade > 65) av = p.genero === "Feminino" ? "👵" : "👴";
    else if(p.saude < 30) av = "🩺";
    document.getElementById('ui-avatar').innerText = av;

    if(!p.vivo) {
        document.getElementById('action-buttons').innerHTML = `
            <button class="btn-danger" style="width:100%" onclick="reiniciar()">
                🔄 Fim de Jogo - Recomeçar
            </button>
        `;
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

    let salarios = { 
        "Bebé": 0, "Estudante": 50, "Desempregado": 0, 
        "Técnico de IT": 1800, "Deputado": 3800, "Administrador": 7500 
    };
    
    let ganho = salarios[p.emprego] || 0;
    if(ganho > 0) {
        let irs = Math.floor(ganho * 0.30);
        p.dinheiro += (ganho - irs);
        logar(`Ganhaste ${ganho - irs}€ de salário (Retenção IRS: -${irs}€).`);
    }

    if(p.idade === 6) p.emprego = "Estudante";
    if(p.idade === 18 && p.emprego === "Estudante") {
        p.emprego = "Desempregado";
        logar("🎓 Terminaste a escola! Usa os teus connects para arranjar tacho.");
    }

    if(p.idade > 70) p.saude -= Math.floor(Math.random() * 8);
    if(p.saude <= 0) { 
        p.vivo = false; 
        logar(`💀 Faleceu aos ${p.idade} anos.`); 
    }

    if(Math.random() < 0.35 && p.vivo) {
        let evs = [
            "Herdaste uma herança de um tio da Suíça! (+5000€)", 
            "Apanhaste uma multa de trânsito. (-120€)", 
            "Ganhaste uma raspadinha! (+200€)"
        ];
        let sorteio = evs[Math.floor(Math.random() * evs.length)];
        logar(`✨ EVENTO: ${sorteio}`);
        if(sorteio.includes("Suíça")) p.dinheiro += 5000;
        if(sorteio.includes("multa")) p.dinheiro -= 120;
        if(sorteio.includes("raspadinha")) p.dinheiro += 200;
    }
    atualizarUI();
}

function procurarEmprego() {
    if(p.idade < 18) { logar("❌ Tens de ser maior de idade para trabalhar."); return; }
    if(p.cunha > 70) { 
        p.emprego = "Administrador"; 
        logar("💼 Uma grande cunha pôs-te como Administrador Estatal!"); 
    } else if(p.cunha > 45) { 
        p.emprego = "Deputado"; 
        logar("💼 Entraste nas listas do partido! Agora és Deputado."); 
    } else { 
        p.emprego = "Técnico de IT"; 
        logar("💼 Foste contratado como Técnico de IT através de entrevista normal."); 
    }
    atualizarUI();
}

function fazerNetworking() {
    if(p.dinheiro < 150) { logar("❌ Não tens dinheiro para pagar mariscadas."); return; }
    p.dinheiro -= 150;
    p.cunha = Math.min(100, p.cunha + 15);
    logar("🥂 Jantarada paga! Conheceste pessoas influentes e a tua Cunha subiu.");
    atualizarUI();
}

function tentarCrime() {
    if(Math.random() < (p.cunha / 100)) {
        p.dinheiro += 3000;
        logar("💰 O teu esquema correu bem e os teus contactos abafaram o caso! (+3000€)");
    } else {
        p.dinheiro = Math.max(0, p.dinheiro - 2000);
        p.felicidade -= 20;
        logar("🚨 Foste apanhado pelo Ministério Público e multado! (-2000€)");
    }
    atualizarUI();
}

function reiniciar() { 
    location.reload(); 
}
