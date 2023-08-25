const userInputPage = document.querySelector('.user-input');
const floors = document.querySelector('.floor-input');
const lifts = document.querySelector('.lift-input');
const simulateBtn = document.querySelector('.simulate-btn');
const simulatedLifts = document.querySelector('.simulated-lifts');

let isInputValid = false;
let liftsData = [];

// DOCS: Maintain a queue for single lift to serve multiple calls
let requestQueue = [];

function cleanupInputs() {
    floors.value = "";
    lifts.value = "";
}

simulateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if(!Number(floors.value) || Number(floors.value) < 1) {
        cleanupInputs();
        alert("Enter valid number of floors");
    }else if(!Number(lifts.value) || Number(lifts.value) < 1) {
        cleanupInputs();
        alert("Enter valid number of lifts")
    }else if(Number(floors.value) === 1){
        cleanupInputs();
        alert("There should be at least 2 floors");
    }else if(Number(floors.value) > 20){
        alert("Max allowed floors: 20");
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

        generateFloorsAndLifts(floors.value, lifts.value);
    }
})


const findNearestIdleLift = (targetFloor) => {
    let nearestLift = null;
    let shortestDistance = Infinity;

    for(const lift of liftsData) {
        if(lift.state === "idle") {
            const distance = Math.abs(targetFloor - lift.currentFloor);
            if(distance < shortestDistance) {
                shortestDistance = distance;
                nearestLift = lift.liftId;
            }
        }
    }
    return nearestLift;
}

function generateFloorsAndLifts (floorCount, liftCount) {
    const container = document.createElement("div");
    container.classList.add("container");

    generateLiftsData(liftCount);

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
            btnUp.classList.add("lift-btn")
            btnUp.addEventListener("click", () => {
                if(Number(liftCount) >1) {
                    const nearestIdleLift = findNearestIdleLift(floorNumber);
                    if(liftsData[nearestIdleLift-1].state === "idle") {
                        moveLiftToFloor(floorNumber, nearestIdleLift);
                    }
                }else if(Number(liftCount) === 1) {
                    let liftId = 1 // DOCS: Since we have only one lift hardcoding the liftId for the same 
                    if(liftsData[liftId - 1].state === "idle" && requestQueue.length===0) {
                        moveLiftToFloor(floorNumber, liftId)
                    }else {
                        if(!requestQueue.includes(floorNumber)) {
                            requestQueue.push(floorNumber);
                        }
                    }
                }
            });

            const btnDown = document.createElement("button");
            btnDown.innerText = "▼";
            btnDown.classList.add("lift-btn");
            btnDown.addEventListener("click", () => {
                if(Number(liftCount) >1) {
                    const nearestIdleLift = findNearestIdleLift(floorNumber);
                    if(liftsData[nearestIdleLift-1].state === "idle") {
                        moveLiftToFloor(floorNumber, nearestIdleLift);
                    }
                }else if(Number(liftCount) === 1) {
                    let liftId = 1 // DOCS: Since we have only one lift hardcoding the liftId for the same 
                    if(liftsData[liftId - 1].state === "idle" && requestQueue.length===0) {
                        moveLiftToFloor(floorNumber, liftId)
                    }else {
                        if(!requestQueue.includes(floorNumber)) {
                            requestQueue.push(floorNumber);
                        }
                    }
                }
            });

            const floorLabel = document.createElement("p");
            floorLabel.innerText = `Floor ${floorNumber}`;
            floorLabel.classList.add("floor-label");

            btnContainer.appendChild(btnUp);
            btnContainer.appendChild(btnDown);
            floorContents.appendChild(btnContainer);

            for(let j = 0; j< liftCount; j++) {
                const lift = document.createElement("div");
                lift.classList.add("lift");
                lift.id = `lift-${j+1}`;

                const leftDoor = document.createElement("div");
                leftDoor.classList.add("left-door");
                leftDoor.id = `leftDoor-${j+1}`

                const rightDoor = document.createElement("div");
                rightDoor.classList.add("right-door");
                rightDoor.id = `rightDoor-${j+1}`

                lift.appendChild(leftDoor);
                lift.appendChild(rightDoor);

                if(i === floorCount -1) {
                    floorContents.appendChild(lift);
                }
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

function moveLiftToFloor(targetFloor, liftNumber) {
    const lift = document.querySelector(`#lift-${liftNumber}`);
    const leftDoor = document.querySelector(`#leftDoor-${liftNumber}`);
    const rightDoor = document.querySelector(`#rightDoor-${liftNumber}`);
    const liftHeight = 3.5; // Height of each floor container
    const currentFloor = liftsData[liftNumber-1].currentFloor;

    if(targetFloor > currentFloor) {
        liftsData[liftNumber-1].state = "up"
    }else {
        liftsData[liftNumber-1].state = "down"
    }

    if (isInputValid && liftsData.length > 0) {
        const distance = Math.abs(currentFloor - targetFloor) * liftHeight;
        const animationDuration = 2; // 2 seconds per floor

        const floorDistance = Math.abs(currentFloor - targetFloor);
        const totalAnimationDuration = floorDistance * animationDuration;

        let translateYDistance = -((targetFloor - 1) * liftHeight);

        lift.style.transition = `transform ${totalAnimationDuration}s ease-in-out`;
        lift.style.transform = `translateY(${translateYDistance}rem)`;
        liftsData[liftNumber-1].currentFloor = targetFloor;
        

        setTimeout(() => {
            // if( liftsData[liftNumber-1].state === "idle") {
                lift.style.transition = "";
                lift.classList.add("opened-door")
                leftDoor.classList.add("closed-door");
                rightDoor.classList.add("closed-door");
                openLeftDoor();
                openRightDoor();
            // }
        }, totalAnimationDuration * 1000);

        function openLeftDoor() {
            leftDoor.style.transform = `translateX(-1.25rem)`;
            leftDoor.style.transition = `transform 2.5s ease`;
            closeLeftDoor();
        }

        function openRightDoor() {
            rightDoor.style.transform = `translateX(1.25rem)`;
            rightDoor.style.transition = `transform 2.5s ease`;
            closeRightDoor();
        }

    }

    function closeLeftDoor() {
        setTimeout(() => {
            leftDoor.style.transform =`translateX(0)`;
            leftDoor.style.transition = `transform 2.5s ease-in-out`;

            // Add transitionend listener for closing left door
            leftDoor.addEventListener("transitionend", () => {
                // Remove the opened-door class and reset the left door transition
                lift.classList.remove("opened-door");

                leftDoor.classList.remove("closed-door");
                leftDoor.style.transition = "";
            });
        },2500)
    }

    function closeRightDoor() {
        setTimeout(() => {
            rightDoor.style.transform = `translateX(0)`;
            rightDoor.style.transition = `transform 2.5s ease-in-out`;

            // Add transitionend listener for closing right door
            rightDoor.addEventListener("transitionend", () => {
                // Reset the right door transition
                rightDoor.classList.remove("closed-door");
                rightDoor.style.transition = "";
                liftsData[liftNumber-1].state = "idle";
                if(requestQueue.length && Number(lifts.value) === 1) {
                    setTimeout(() => {
                        if(requestQueue[0]) {
                            if(liftsData[liftNumber-1].state === "idle") {
                                moveLiftToFloor(requestQueue[0], 1);
                                requestQueue.shift();
                            }
                            console.log("From moveLiftToFloor: ", liftsData)
                        }
                    }, 1500)
                }
                console.log("Print me once transition ends")
            });
        },2500)
    }
}


// ease-in-out

