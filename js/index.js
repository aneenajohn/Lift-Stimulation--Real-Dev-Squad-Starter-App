const userInputPage = document.querySelector('.user-input');
const floors = document.querySelector('.floor-input');
const lifts = document.querySelector('.lift-input');
const simulateBtn = document.querySelector('.simulate-btn');
const simulatedLifts = document.querySelector('.simulated-lifts');

let isInputValid = false;
let liftsData = [];

function cleanupInputs() {
    floors.value = "";
    lifts.value = "";
}

simulateBtn.addEventListener("click", (e) => {
    e.preventDefault()
    console.log(floors.value, lifts.value)
    if(!Number(floors.value) || Number(floors.value) < 1) {
        cleanupInputs();
        alert("Enter valid number of floors");
    }else if(!Number(lifts.value) || Number(lifts.value) < 1) {
        cleanupInputs();
        alert("Enter valid number of lifts")
    }else if(Number(floors.value) === 1){
        cleanupInputs();
        alert("There should be at least 2 floors");
    }else if(Number(lifts.value) > 5) {
        alert("Max allowed lifts: 5")
    }else if(Number(lifts.value) > Number(floors.value)) {
        alert("Lifts can't be more than the number of floors")
    }else {
        isInputValid = true;
        simulatedLifts.innerHTML= `<button class="btn back-btn">Back</button>`
        userInputPage.style.display = "none";
        simulatedLifts.style.display =  "block";

        // DOCS: Back btn to toggle page
        const backBtn = document.querySelector(".back-btn");
        backBtn.addEventListener("click", (e) => {
            simulatedLifts.style.display = "none";
            userInputPage.style.display = "block";
            liftsData = [];
            cleanupInputs();
        })

        generateFloorsAndLifts(floors.value, lifts.value)
    }
})

function generateFloorsAndLifts (floorCount, liftCount) {
    const container = document.createElement("div");
    container.classList.add("container");

    generateLiftsData(liftCount);

    console.log("Data: ", liftsData);

    for(let i = 0; i <= floorCount; i++) {
        const floorContainer = document.createElement("div");
        floorContainer.classList.add("floor-container");
        floorContainer.classList.add(`row-${i}`)
        if(i !== floorCount-1) {
            floorContainer.style.height = "3.5rem";
        }

        const lineSplit = document.createElement("div");
        lineSplit.classList.add("line-split");

        floorContainer.appendChild(lineSplit);

        const floorNumber = floorCount - i;

        if(i < floorCount) {
            const floorContents = document.createElement("div");
            floorContents.classList.add("floor-contents");

            const btnContainer = document.createElement("div");

            const btnUp = document.createElement("button");
            btnUp.innerText = "▲"
            // "⬆️"
            btnUp.classList.add("lift-btn")
            btnUp.addEventListener("click", () => {
                moveLiftToFloor(floorNumber);
            });

            const btnDown = document.createElement("button");
            btnDown.innerText = "▼";
            // ⬇️
            btnDown.classList.add("lift-btn");
            btnDown.addEventListener("click", () => {
                moveLiftToFloor(floorNumber);
            });

            const lift = document.createElement("div");
            lift.classList.add("lift");

            const floorLabel = document.createElement("p");
            floorLabel.innerText = `Floor ${floorNumber}`;
            floorLabel.classList.add("floor-label");

            btnContainer.appendChild(btnUp);
            btnContainer.appendChild(btnDown);
            floorContents.appendChild(btnContainer);

            console.log({floorCount , i})
            console.log(floorCount-1 === i)
            if(i === floorCount -1) {
                floorContents.appendChild(lift);
            }
            floorContents.appendChild(floorLabel);

            floorContainer.appendChild(floorContents);
        }
        container.appendChild(floorContainer);
        simulatedLifts.appendChild(container);
    }
}

function generateLiftsData(liftCount) {
    for(let i=0; i<liftCount; i++){
        let liftData = {
            liftId: i+1,
            state: "idle", //DOCS: can have idle || up || down
            currentFloor: 1
        }
        liftsData.push(liftData);
    }
}

function moveLiftToFloor(targetFloor) {
    const lift = document.querySelector(".lift");
    const liftHeight = 3.5; // Height of each floor container

    if (isInputValid && liftsData.length > 0) {
        const currentFloor = liftsData[0].currentFloor;
        const distance = Math.abs(currentFloor - targetFloor) * liftHeight;
        const animationDuration = 2; // 2 seconds per floor
        // console.log(`Lift moving from floor ${currentFloor} to floor ${targetFloor}`);

        let translateYDistance = -((targetFloor - 1) * liftHeight);
        // console.log({currentFloor, targetFloor});

        lift.style.transition = `transform ${animationDuration}s ease-in-out`;
        lift.style.transform = `translateY(${translateYDistance}rem)`;

        // console.log({translateYDistance})
        liftsData[0].currentFloor = targetFloor;

        setTimeout(() => {
            lift.style.transition = "";
        }, animationDuration * 1000); // Reset transition after it completes
    }
}
