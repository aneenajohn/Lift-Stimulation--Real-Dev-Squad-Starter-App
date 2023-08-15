const userInputPage = document.querySelector('.user-input');
const floors = document.querySelector('.floor-input');
const lifts = document.querySelector('.lift-input');
const simulateBtn = document.querySelector('.simulate-btn');
const simulatedLifts = document.querySelector('.simulated-lifts');

let isInputValid = false;

function cleanupInputs() {
    floors.value = "";
    lifts.value = "";
}

simulateBtn.addEventListener("click", (e) => {
    e.preventDefault()
    console.log(floors.value, lifts.value)
    if(!floors.value) {
        cleanupInputs();
        alert("Enter number of floors");
    }else if(Number(floors.value) > 20) {
        cleanupInputs();
        alert("Max allowed floors: 20")
    }else if(!lifts.value) {
        cleanupInputs();
        alert("Enter number of lifts")
    }else if(lifts.value > 5) {
        alert("Max allowed lifts: 5")
    }else {
        isInputValid = true;
        simulatedLifts.innerHTML= `<h1 class="font-color-primary">Inputs Validated</h1>`

        userInputPage.style.display = "none"
    }
})


