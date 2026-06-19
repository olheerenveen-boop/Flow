// ======================
// LOGIN E REGISTO
// ======================

// Função principal responsável por:
// - Fazer login em contas existentes
// - Criar novas contas
function handleAuth() {

    // Obtém o nome digitado e remove espaços extras
    const name =
        document.getElementById('username')
        .value.trim();

    // Obtém o email, remove espaços
    // e converte para minúsculas
    const email =
        document.getElementById('email')
        .value.trim()
        .toLowerCase();

    // Obtém a palavra-passe
    const pass =
        document.getElementById('password')
        .value;

    // Verifica se todos os campos foram preenchidos
    if (!name || !email || !pass) {

        alert("Preencha tudo.");
        return;
    }

    // ======================
    // VALIDAÇÃO DOS DADOS
    // ======================

        // Nome mínimo
        if (name.length < 3) {

            alert("O nome precisa ter pelo menos 3 caracteres.");
            return;

        }


        // Email tem que ter formato válido
        if (!email.includes("@") || (name.length < 5) ||!email.includes(".com")) {

            alert("Coloque um email válido.");
            return;

        }


        // Password mínimo
        if (pass.length < 4) {

            alert("Crie uma password mais segura.");
            return;

        }

    // Cria uma chave única para cada utilizador
    // usando o email
    const userKey = `flow_user_${email}`;

    // Procura a conta guardada no localStorage
    const saved = localStorage.getItem(userKey);

    // ======================
    // LOGIN EXISTENTE
    // ======================

    // Se encontrou uma conta com este email
    if (saved) {

        // Converte os dados guardados
        // de JSON para objeto JavaScript
        const account = JSON.parse(saved);

        // Verifica se a palavra-passe está correta
        if (account.password !== pass) {

            alert("Senha errada.");
            return;
        }

        // Guarda os dados da sessão ativa
        setSession(account);

        // Redireciona para a página principal
        window.location.href = "home.html";

        return;
    }

    // ======================
    // NOVA CONTA
    // ======================

    // Cria o objeto do novo utilizador
    const newUser = {

        // Dados básicos
        name,
        email,
        password: pass,

        // Vida atual
        hp: 50,

        // Vida máxima
        maxHp: 50,

        // Experiência atual
        xp: 0,

        // XP necessário para subir de nível
        maxXp: 25,

        // Nível inicial
        level: 1,

        // Recursos iniciais
        coins: 0,
        diamonds: 0,

        // Skin equipada por defeito
        equippedSkin: "Default",

        // Data da última validação diária
        lastValidation: new Date().toDateString(),

        // Último relatório gerado
        dailyReport: null,

        // Data de criação da conta
        createdAt: new Date().toISOString()
    };

    // Guarda o novo utilizador permanentemente
    localStorage.setItem(
        userKey,
        JSON.stringify(newUser)
    );

    // Inicia a sessão do novo utilizador
    setSession(newUser);

    // Mensagem de sucesso
    alert("Conta criada.");

    // Redireciona para a página principal
    window.location.href = "home.html";
}

// ======================
// SESSÃO ATIVA
// ======================

// Guarda o utilizador atualmente logado
// numa área de sessão rápida
function setSession(user) {

    localStorage.setItem(
        "flow_data",
        JSON.stringify(user)
    );
}