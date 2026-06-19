    // Busca os dados do jogador guardados no localStorage
    let player = JSON.parse(localStorage.getItem('flow_data'));

    const deathSound = new Audio("sons/morte.mp3");

    if (!player.dailyReport) {

        createDailyReport();

    }


    createReports();


    savePlayer();


    if (!player.reports) {

        player.reports = [];

        savePlayer();

    }

    

    // =======================
    // VALIDAÇÃO DIÁRIA
    // =======================

    function checkNewDay() {

        const today = new Date().toDateString();


        if (player.lastValidation !== today) {


            console.log("Novo dia detectado");


            // 1 - calcular HP
            calculateDailyHP();
            
            // 2 - verificar se morreu
            checkDeath();

            // 2 - gerar relatório do dia anterior
            generateDailyReport();

            // 3 - resetar tarefas
            resetTasks();


            // 4 - criar novo relatório vazio
            resetDailyReport();


            // 5 - atualizar data
            player.lastValidation = today;


            savePlayer();


            console.log("Dia atualizado");

        }

    }

    function createDailyReport() {

        player.dailyReport = {

            date: new Date().toDateString(),

            completedTasks: [],
            failedTasks: [],

            rewards: {
                xp: 0,
                coins: 0,
                diamonds: 0
            },

            punishments: {
            hpChange: 0
            },

            death:false

        };

    }

    function createReports(){

        if(!player.reports){

            player.reports = [];

        }

    }

    function calculateDailyHP() {

        let hpChange = 0;

        if (!player.dailyReport.completedTasks) {

        player.dailyReport.completedTasks = [];

    }


    if (!player.dailyReport.failedTasks) {

        player.dailyReport.failedTasks = [];

    }


    // limpa antes de calcular novamente
    player.dailyReport.completedTasks = [];

    player.dailyReport.failedTasks = [];


                tasks.forEach(task => {

                    if(task.completed){

                player.dailyReport.completedTasks.push(
                    task.name
            );

            }
            else{

                player.dailyReport.failedTasks.push(
                    task.name
                );

            }


            if (task.type === "habit") {

                hpChange += task.completed ? 5 : -5;


            } else {

                hpChange += task.completed ? 2 : -2;

            }


        });


        player.hp += hpChange;


        // impede passar do máximo
        if (player.hp > player.maxHp) {

            player.hp = player.maxHp;

        }


        // impede ficar negativo
        if (player.hp < 0) {

            player.hp = 0;

        }


        player.dailyReport.punishments.hpChange =
            hpChange;

            player.lastHPValidation = new Date().toDateString();


            checkDeath();


            savePlayer();

            updateStats();


        console.log("HP alterado:", hpChange);
        console.log("HP atual:", player.hp);

    }

    function checkDeath() {


        if (player.hp <= 0) {


            console.log("Jogador morreu");

            deathSound.play();

            
            alert("💀 O jogador morreu! Perdeu 20 moedas.");


            if (player.dailyReport) {

                player.dailyReport.death = true;

                player.dailyReport.punishments.hpChange =
                player.dailyReport.punishments.hpChange || 0;

            }


            player.coins =
            Math.max(0, player.coins - 20);


            player.hp = player.maxHp;


            savePlayer();

            updateStats();


        }

    }

    function showReport(report){


        const modal =
        document.getElementById("reportModal");


        const content =
        document.getElementById("reportContent");


        content.innerHTML = `

        <p>
        📅 ${report.date}
        </p>


        <p>
        ✅ Fez:
        <br>
        ${report.completedTasks.join(", ")}
        </p>


        <p>
        🎁 Resultado:
        <br>

        ⭐ XP:
        ${report.rewards.xp > 0 ? "+" : ""}
        ${report.rewards.xp}


        <br>

        💰 Coins:
        ${report.rewards.coins > 0 ? "+" : ""}
        ${report.rewards.coins}


        <br>

        💎 Diamantes:
        ${report.rewards.diamonds > 0 ? "+" : ""}
        ${report.rewards.diamonds}

        </p>


        <p>

        ❤️ HP:

        ${report.punishments.hpChange !== undefined 
        ? (report.punishments.hpChange > 0 
            ? "+" + report.punishments.hpChange 
            : report.punishments.hpChange)
        : "0"}

        </p>

        `;


        modal.style.display = "block";

    }



    function closeReport(){

        document.getElementById("reportModal")
        .style.display = "none";

    }

    function generateDailyReport(){


        const report = {

            date: player.dailyReport.date,

            completedTasks:
            player.dailyReport.completedTasks,

            failedTasks:
            player.dailyReport.failedTasks,


            rewards:
            player.dailyReport.rewards,


            punishments:
            player.dailyReport.punishments,

            death:
            player.dailyReport.death

        };


        console.log("RELATÓRIO GUARDADO");

        console.log(report);


        showReport(report);


        player.reports.push(report);


        if(player.reports.length > 30){

        player.reports =
            player.reports.slice(-30);

        }


    savePlayer();

    } 

    function resetDailyReport(){

        player.dailyReport = {

            date: new Date().toDateString(),

            completedTasks: [],
            failedTasks: [],

            rewards: {
                xp: 0,
                coins: 0,
                diamonds: 0
            },

            punishments:{
                hpChange:0
            },

            death:false

        };


        savePlayer();


        console.log("Novo relatório criado");

    }

    function resetTasks(){

        tasks.forEach(task => {

            task.completed = false;
            task.rewarded = false;

        });


        localStorage.setItem(
            `tasks_${player.email}`,
            JSON.stringify(tasks)
        );


        renderAll();


        console.log("Tarefas resetadas");

    }

    // Guarda os dados atualizados do jogador
    function savePlayer() {

        // Atualiza sessão atual
        localStorage.setItem(
            "flow_data",
            JSON.stringify(player)
        );


        // Atualiza conta permanente
        localStorage.setItem(
            `flow_user_${player.email}`,
            JSON.stringify(player)
        );
    }

    // Atualiza os valores visíveis na tela
    function updateStats() {


        // Moedas
        document.getElementById("coins").innerText =
            player.coins;


        // Diamantes
        document.getElementById("diamonds").innerText =
            player.diamonds;


        // Nome e nível
        document.getElementById("user-info").innerText =
            `${player.name} - Level ${player.level}`;


        // HP
        document.getElementById("hp-text").innerText =
            `${player.hp}/${player.maxHp}`;


        // Barra HP
        document.getElementById("hp-fill").style.width =
            `${(player.hp / player.maxHp) * 100}%`;


        // XP
        document.getElementById("xp-text").innerText =
            `${player.xp}/${player.maxXp}`;


        // Barra XP
        document.getElementById("xp-fill").style.width =
            `${(player.xp / player.maxXp) * 100}%`;

            updateAvatar();

    }

    function updateAvatar(){

        const avatar =
        document.getElementById("avatar-container");


        if(player.equippedSkin){

            avatar.innerHTML = 
            `<img src="Imagens/${player.equippedSkin}.png"
            style="height:100px;">`;

        } else {

        avatar.innerHTML =
        `<img src="Imagens/default.png">`;

        }

    }

    // =======================
    // SISTEMA DE XP E NÍVEL
    // =======================


    // Adiciona XP ao jogador
    function addXP(amount) {


        player.xp += amount;


        while (player.xp >= player.maxXp) {


            player.xp -= player.maxXp;


            player.level++;


            player.maxXp = player.level * 25;


        }


        savePlayer();
        updateStats();


    }


    // Remove XP do jogador
    function removeXP(amount) {


        player.xp -= amount;


        // Impede XP negativo
        if (player.xp < 0) {

            player.xp = 0;

        }


        savePlayer();
        updateStats();

    }

    // Se não existir jogador ou não tiver email, redireciona para a página de login
    if (!player || !player.email) {
        window.location.href = "index.html";
    }

    // Carrega as tarefas do utilizador.
    let tasks = JSON.parse(localStorage.getItem(`tasks_${player.email}`)) || [];

    /* =======================
    TASKS
    ======================= */

    // Adiciona uma nova tarefa
    function addTask() {
        const nameInput = document.getElementById('taskName');
        const typeInput = document.getElementById('taskType');

        if (nameInput.value.trim() === "") return;

        tasks.push({
        id: Date.now(),
        name: nameInput.value,
        type: typeInput.value,
        completed: false,
        rewarded: false,
        hpResult: 0
        });

        nameInput.value = "";
        saveAndRender();
        closeModal();
    }

    // Remove uma tarefa
    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveAndRender();
    }

    // =======================
    // RECOMPENSAS DAS TAREFAS
    // =======================

    function giveReward(task) {

        if (task.type === "habit") {

            player.coins += 5;
            player.diamonds += 1;
            addXP(5);

        } else {

            player.coins += 2;
            addXP(2);

        }

        task.rewarded = true;

        task.reward = {
            xp: task.type === "habit" ? 5 : 2,
            coins: task.type === "habit" ? 5 : 2,
            diamonds: task.type === "habit" ? 5 : 0
        };

        if (player.dailyReport) {

            player.dailyReport.completedTasks.push(task.name);

            player.dailyReport.rewards.xp += task.reward.xp;

            player.dailyReport.rewards.coins += task.reward.coins;

            player.dailyReport.rewards.diamonds += task.reward.diamonds;

        }

        savePlayer();
    }


    function removeReward(task) {

        if (task.type === "habit") {

            player.coins -= 5;
            player.diamonds -= 1;
            removeXP(5);

        } else {

            player.coins -= 2;
            removeXP(2);

        }

        task.rewarded = false;

        if (player.dailyReport && task.reward) {

        player.dailyReport.completedTasks =
            player.dailyReport.completedTasks.filter(
                t => t !== task.name
            );

        player.dailyReport.rewards.xp -= task.reward.xp;

        player.dailyReport.rewards.coins -= task.reward.coins;

        player.dailyReport.rewards.diamonds -= task.reward.diamonds;

        }

        savePlayer();
    }

    // Atualiza o estado de conclusão da tarefa
    function processTask(id, checked) {

        const task = tasks.find(t => t.id === id);

        if (!task) return;


        task.completed = checked;


        if (checked && !task.rewarded) {

            giveReward(task);

        }


        if (!checked && task.rewarded) {

            removeReward(task);

        }


        saveAndRender();

        updateStats();
    }

    /* =======================
    MODAL
    ======================= */

    function openModal() {
        document.getElementById('taskModal').style.display = 'block';
    }

    function closeModal() {
        document.getElementById('taskModal').style.display = 'none';
    }

    /* =======================
    SAVE
    ======================= */

    function saveAndRender() {
        const taskKey = `tasks_${player.email}`;
        localStorage.setItem(taskKey, JSON.stringify(tasks));
        renderAll();
    }

    /* =======================
    RENDER
    ======================= */

    function renderAll() {
        // Atualiza nome do utilizador
        document.getElementById('user-info').innerText = player.name;

        // Renderiza cada categoria de tarefas
        ['habit', 'daily', 'todo'].forEach(type => {
            const list = document.getElementById(`list-${type}`);
            list.innerHTML = "";

            tasks.filter(t => t.type === type).forEach(task => {
                const item = document.createElement('div');
                item.className = 'task-item';

                // Define os controlos da tarefa
                let actionHTML = `<input type="checkbox" ${task.completed ? 'checked' : ''} onchange="processTask(${task.id}, this.checked)">`;

                item.innerHTML = `
                    <div class="task-row">
                        <strong>${task.name}</strong>
                        <button class="btn-delete" onclick="deleteTask(${task.id})">🗑️</button>
                    </div>
                    <div class="task-row">
                        <small style="color:#666">${type.toUpperCase()}</small>
                        ${actionHTML}
                    </div>
                `;
                list.appendChild(item);
            });
        });
    }

    function confirmLogout(){

        return confirm(
            "Tem certeza que deseja sair?"
        );

    }

    // Executa a renderização inicial
    renderAll();
    updateStats();
    checkNewDay();