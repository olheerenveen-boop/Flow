// ===============================
// CARREGAMENTO DOS DADOS DO JOGADOR
// ===============================

// Carrega os dados do jogador atualmente logado
// armazenados no localStorage
let playerData = JSON.parse(localStorage.getItem('flow_data'));

const buySound = new Audio("sons/compra.mp3");

// Segurança: se não existir utilizador logado
// ou faltar o email, volta para a página inicial/login
if (!playerData || !playerData.email) {
    window.location.href = "index.html";
}

// Cria a chave personalizada das skins deste utilizador
const skinKey = `skins_${playerData.email}`;

// Carrega as skins compradas pelo utilizador.
// Caso não exista nenhuma lista guardada,
// a skin "Default" é adicionada automaticamente.
let ownedSkins =
    JSON.parse(localStorage.getItem(skinKey))
    || ['Default'];

// ===============================
// BASE DE DADOS DAS SKINS
// ===============================

// Lista de todas as skins disponíveis na loja.
// Cada skin possui:
// - id → identificador único
// - country → nome da skin
// - price → preço
// - currency → moeda usada na compra
// - img → imagem da skin
const skins = [

    //Masculinas
    //Skins Comuns
    { id: 1, country: "Argentina", price: 40, currency: "coins", level:1, img: "imagens/Argentina.png" },
    { id: 2, country: "EUA", price: 50, currency: "coins", level: 2, img: "imagens/EUA.png" },

    { id: 3, country: "China", price: 65, currency: "coins", level: 2, img: "imagens/China.png" },
    { id: 4, country: "Japão", price: 80, currency: "coins", level: 3, img: "imagens/Japão.png" },
    { id: 5, country: "Alemanha", price: 100, currency: "coins", level: 3, img: "imagens/Alemanha.png" },
    { id: 6, country: "França", price: 120, currency: "coins", level: 4, img: "imagens/França.png" },
    { id: 7, country: "Rússia", price: 140, currency: "coins", level: 4, img: "imagens/Rússia.png" },
    { id: 8, country: "Nigéria", price: 150, currency: "coins", level: 5, img: "imagens/Nigéria.png" },
    { id: 9, country: "Espanha", price: 200, currency: "coins", level: 5, img: "imagens/Espanha.png" },
    { id: 10, country: "Egipto", price: 250, currency: "coins", level: 6, img: "imagens/Egipto.png" },

    //Skins Raras
    { id: 11, country: "México", price: 10, currency: "diamonds", level: 7, img: "imagens/México.png" },
    { id: 12, country: "Brasil", price: 20, currency: "diamonds", level: 8, img: "imagens/Brasil.png" },
    { id: 13, country: "Portugal", price: 30, currency: "diamonds", level: 9, img:"imagens/Portugal.png" },
    { id: 14, country: "Austrália", price: 40, currency: "diamonds", level: 10, img: "imagens/Austrália.png" },

    //Femininas 
    //Skins Comuns
    { id: 15, country: "Irlanda", price: 40, currency: "coins", level: 1, img: "imagens/Irlanda.png" },
    { id: 16, country: "Países Baixos", price: 50, currency: "coins", level: 2, img: "imagens/Países Baixos.png" },
    { id: 17, country: "Itália", price: 65, currency: "coins", level: 2, img: "imagens/Itália.png" },
    { id: 18, country: "Peru", price: 80, currency: "coins", level: 3, img: "imagens/Peru.png" },
    { id: 19, country: "Reino Unido", price: 100, currency: "coins", level: 3, img: "imagens/Reino Unido.png" },
    { id: 20, country: "Nepal", price: 120, currency: "coins", level: 4, img: "imagens/Nepal.png" },
    { id: 21, country: "Arábia Saudita", price: 140, currency: "coins", level: 4, img: "imagens/Arábia Saudita.png" },
    { id: 22, country: "Ucrânia", price: 150, currency: "coins", level: 5, img: "imagens/Ucrânia.png" },
    { id: 23, country: "Índia", price: 200, currency: "coins", level: 5, img: "imagens/Índia.png" },
    { id: 24, country: "Nova Zelândia", price: 250, currency: "coins", level: 6, img: "imagens/Nova Zelândia.png" },

    //Skins Raras
    { id: 25, country: "Vaticano", price: 10, currency: "diamonds", level: 7, img: "imagens/Vaticano.png" },
    { id: 26, country: "Jamaica", price: 20, currency: "diamonds", level: 8, img: "imagens/Jamaica.png" },
    { id: 27, country: "Noruega", price: 30, currency: "diamonds", level: 9, img: "imagens/Noruega.png" },
    { id: 28, country: "Grécia", price: 40, currency: "diamonds", level: 10, img: "imagens/Grécia.png" },
    
];

// ===============================
// RENDERIZAÇÃO DA LOJA
// ===============================

// Atualiza toda a interface da loja
function renderShop() {

    // Obtém o container onde as skins serão exibidas
    const grid = document.getElementById('shop-grid');

    // Limpa o conteúdo anterior
    grid.innerHTML = "";

    // Atualiza os valores de moedas e diamantes no ecrã
    document.getElementById('coins').innerText = playerData.coins;
    document.getElementById('diamonds').innerText = playerData.diamonds;

    // Percorre todas as skins da loja
    skins.forEach(skin => {

        // Verifica se o jogador já possui esta skin
        const isOwned = ownedSkins.includes(skin.country);

        const hasLevel =
        playerData.level >=
        (skin.level || 1);

        console.log(
        skin.country,
        hasLevel
        );

        // Verifica se esta skin está equipada
        const isEquipped =
            playerData.equippedSkin === skin.country;

        // Cria o cartão visual da skin
        const card = document.createElement('div');
        card.className = 'skin-card';

        // Se for uma imagem, cria a tag img
        // Caso contrário mostra texto/emoji
        let imgContent =
            skin.img.includes("/")
                ? `<img src="${skin.img}">`
                : skin.img;

        // Escolhe o ícone da moeda
        let currencyIcon =
            skin.currency === "coins"
                ? "💰"
                : "💎";

        // Botão padrão de compra
        let btn = `
            <button class="btn-buy can-buy"
                onclick="buySkin(${skin.id})">
                Comprar (${skin.price} ${currencyIcon})
            </button>
        `;

        if (!hasLevel) {

            btn = `
            <button class="btn-buy"
            style="
                background:#555;
                color:white;
                cursor:not-allowed;
            ">
            🔒 Nível ${skin.level}
        </button>
    `;
        }

        // Se estiver equipada
        if (isEquipped) {

            btn = `
                <button class="btn-buy equipped">
                    Equipado
                </button>
            `;

        }

        // Se já possuir mas não estiver equipada
        else if (isOwned) {

            btn = `
                <button class="btn-buy owned"
                    onclick="equipSkin('${skin.country}')">
                    Equipar
                </button>
            `;
        }

        // Monta o HTML do cartão
        card.innerHTML = `
            <strong>${skin.country}</strong>
            <div class="character-img">
                ${imgContent}
            </div>
            ${btn}
        `;

        // Adiciona o cartão à loja
        grid.appendChild(card);
    });
}

// ===============================
// COMPRA DE SKINS
// ===============================

// Compra uma skin através do ID
function buySkin(id) {


    const s = skins.find(x => x.id === id);


    if (!s) {

        console.log("Skin inexistente");

        return;

    }


    if (playerData.level < (s.level || 1)) {


        alert(
            "🔒 Precisas de nível " + s.level
        );


        return;

    }


    if (playerData[s.currency] >= s.price) {


        playerData[s.currency] -= s.price;


        ownedSkins.push(s.country);

        buySound.play();


        save();


    } else {


        alert("Saldo insuficiente!");

    }
}

// ===============================
// EQUIPAR SKINS
// ===============================

// Define uma skin como equipada
function equipSkin(name) {

    // Atualiza a skin equipada
    playerData.equippedSkin = name;

    // Guarda alterações
    save();
}

// ===============================
// SALVAMENTO DOS DADOS
// ===============================

// Guarda todas as alterações no localStorage
function save() {

    // Chave personalizada dos dados do utilizador
    const userKey = `flow_user_${playerData.email}`;

    // Chave personalizada das skins
    const skinKey = `skins_${playerData.email}`;

    // Guarda os dados atuais da sessão
    localStorage.setItem(
        'flow_data',
        JSON.stringify(playerData)
    );

    // Guarda os dados permanentes do utilizador
    localStorage.setItem(
        userKey,
        JSON.stringify(playerData)
    );

    // Guarda a lista de skins compradas
    localStorage.setItem(
        skinKey,
        JSON.stringify(ownedSkins)
    );

    // Atualiza a interface
    renderShop();
}

// ===============================
// INICIALIZAÇÃO
// ===============================

// Renderiza a loja quando a página abre
renderShop();