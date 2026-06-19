let player =
    JSON.parse(
        localStorage.getItem("flow_data")
    );

    document.getElementById("coins").innerText =
    player.coins;


    document.getElementById("diamonds").innerText =
    player.diamonds;

const container =
    document.getElementById(
        "stats-container"
    );

container.innerHTML = `

    <h2>${player.name}</h2>

    <p>⭐ Level: ${player.level}</p>

    <p>❤️ HP: ${player.hp}/${player.maxHp}</p>

    <p>⭐ XP: ${player.xp}/${player.maxXp}</p>

    <p>💰 Coins: ${player.coins}</p>

    <p>💎 Diamonds: ${player.diamonds}</p>

    <p>🎭 Skin equipada:
       ${player.equippedSkin}
    </p>

`;

const historyContainer =
    document.getElementById(
        "history-container"
    );

const lastReports =
    player.reports.slice(-3).reverse();

lastReports.forEach(report => {


    const hp = report.punishments?.hpChange ?? 0;


    const hpText =
        hp > 0
            ? `+${hp}`
            : hp;


    historyContainer.innerHTML += `

        <div style="
            border:1px solid #ccc;
            padding:10px;
            margin-bottom:10px;
            border-radius:10px;
        ">

            <h3>📅 ${report.date}</h3>

            <p>
                ✅ Tarefas:
                ${report.completedTasks.length}
            </p>

            <p>
                ⭐ XP:
                ${report.rewards.xp}
            </p>

            <p>
                💰 Coins:
                ${report.rewards.coins}
            </p>

            <p>
                💎 Diamantes:
                ${report.rewards.diamonds}
            </p>

            <p>
                ❤️ HP:
                ${hpText}
            </p>

            <p>
                💀 Morte:
                ${report.death ? "Sim" : "Não"}
            </p>

        </div>

    `;

    const generalStats =
    document.getElementById(
        "general-stats"
    );


let totalTasks = 0;
let totalXP = 0;
let totalCoins = 0;
let totalDiamonds = 0;
let totalDeaths = 0;
let totalFailed = 0;


// percorre todos os relatórios
player.reports.forEach(report => {


    // soma tarefas feitas
    totalTasks += report.completedTasks.length;


    // soma recompensas
    totalXP += report.rewards.xp;

    totalCoins += report.rewards.coins;

    totalDiamonds += report.rewards.diamonds;

    totalFailed += 
    report.failedTasks 
    ? report.failedTasks.length 
    : 0;

    // conta mortes
    if (report.death) {

        totalDeaths++;

    }


});




generalStats.innerHTML = `

    <h2>📈 Estatísticas Gerais</h2>


    <p>
        📅 Dias jogados:
        ${player.reports.length}
    </p>


    <p>
        ✅ Tarefas concluídas:
        ${totalTasks}
    </p>

    <p>
    ❌ Falhadas:
    ${report.failedTasks ? report.failedTasks.length : 0}
    </p>


    <p>
        ⭐ XP ganho:
        ${totalXP}
    </p>


    <p>
        💰 Coins ganhos:
        ${totalCoins}
    </p>


    <p>
        💎 Diamantes ganhos:
        ${totalDiamonds}
    </p>


    <p>
        💀 Mortes:
        ${totalDeaths}
    </p>

`;

});