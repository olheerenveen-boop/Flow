function showAlert(message){

    const box =
    document.getElementById("game-alert");


    box.innerHTML = message;


    box.style.display = "block";


    setTimeout(()=>{

        box.style.display = "none";

    },3000);

}