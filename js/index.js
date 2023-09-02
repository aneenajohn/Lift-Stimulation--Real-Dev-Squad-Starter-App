const userInputPage = document.querySelector('.user-input');
const floors = document.querySelector('.floor-input');
const lifts = document.querySelector('.lift-input');
const simulateBtn = document.querySelector('.simulate-btn');
const simulatedLifts = document.querySelector('.simulated-lifts');
const alert = document.createElement("p");

let isInputValid = false;
let liftsData = [];
let eventQueue = [];
let isLiftFree = true;
let isTransitionInProgress = false;

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
            simulatedLifts.style.position = "relative";
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

    if(liftsData.length === 1) {
        nearestLift = liftsData[0].liftId;
    }else {
        for(const lift of liftsData) {
            if(lift.state === "idle") {
                const distance = Math.abs(targetFloor - lift.currentFloor);
                if(distance < shortestDistance) {
                    shortestDistance = distance;
                    nearestLift = lift.liftId;
                }
            }
        }
    }

    console.log({nearestLift});
    return nearestLift;
}

function getFloorsInQueue() {
    let floors ="";
    for(let i = 0;i< eventQueue.length; i++) {
        floors += eventQueue[i].floorNumber
    }

    console.log("Floors: ", floors, floors.length, )
    if(floors.length === 1) {
        return String(floors);
    }else {
        floors = String(floors).split("").join(",");
        return floors;
    }
}

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
            btnUp.classList.add("lift-btn")

            btnUp.addEventListener("click", () => {
                console.log("isLiftFree: ", isLiftFree);
                if (isLiftFree) {
                    console.log("Inside isLiftFree: ", isLiftFree);
                    const nearestIdleLift = findNearestIdleLift(floorNumber);
                    moveLiftToFloor(floorNumber, nearestIdleLift);
                    isLiftFree = false;
                } else {
                    eventQueue.push({ floorNumber, direction: "up" });
                    console.log("Outside isLiftFree", eventQueue)
                    alert.classList.add("alert");
                    alert.style.display = "block";
                    let floorList = getFloorsInQueue()
                    alert.innerText = `${floorList.length !== 1 ? "Floors" : "Floor"} ${floorList} ${floorList.length !== 1 ? 'are' : 'is'} in queue`;
                    simulatedLifts.appendChild(alert);
                }
            });

            const btnDown = document.createElement("button");
            btnDown.innerText = "▼";
            btnDown.classList.add("lift-btn");
            btnDown.addEventListener("click", () => {
                if (isLiftFree) {
                    const nearestIdleLift = findNearestIdleLift(floorNumber);
                    moveLiftToFloor(floorNumber, nearestIdleLift);
                    isLiftFree = false;
                } else {
                    eventQueue.push({ floorNumber, direction: "down" });
                    console.log("Outside isLiftFree", eventQueue)
                    alert.classList.add("alert");
                    alert.style.display = "block";
                    let floorList = getFloorsInQueue()
                    alert.innerText = `${floorList.length !== 1 ? "Floors" : "Floor"} ${floorList} ${floorList.length !== 1 ? 'are' : 'is'} in queue`;
                    simulatedLifts.appendChild(alert);
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

async function moveLiftToFloor(targetFloor, liftNumber) {
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

        // const distance = Math.abs(currentFloor - targetFloor) * liftHeight;
        const animationDuration = 2; // 2 seconds per floor

        const floorDistance = Math.abs(currentFloor - targetFloor);
        const totalAnimationDuration = floorDistance * animationDuration;

        let translateYDistance = -((targetFloor - 1) * liftHeight);

        lift.style.transition = `transform ${totalAnimationDuration}s ease-in-out`;
        lift.style.transform = `translateY(${translateYDistance}rem)`;
        liftsData[liftNumber-1].currentFloor = targetFloor;

        // Wait for the lift to reach the target floor
        await new Promise(resolve => setTimeout(resolve, totalAnimationDuration * 1000));

        // Open the doors
        openDoors(lift, leftDoor, rightDoor);

        // Close the doors after a delay
        await new Promise(resolve => setTimeout(resolve, 2500)); // Adjust the delay as needed
        closeDoors(lift,leftDoor, rightDoor);

        // Check if there are events in the queue
        if (eventQueue.length > 0) {
            const nextEvent = eventQueue.shift();
            if (nextEvent?.floorNumber) {
                const nearestIdleLift = findNearestIdleLift(nextEvent.floorNumber);
                moveLiftToFloor(nextEvent.floorNumber, nearestIdleLift);
            }
        } else {
            isLiftFree = true;
            alert.style.display = "none";
        }
    }

    console.log("From moveLiftToFloor: ", liftsData)
}

function openDoors(lift, leftDoor, rightDoor) {
    lift.classList.add("opened-door");
    leftDoor.classList.add("closed-door");
    rightDoor.classList.add("closed-door");
    openLeftDoor(leftDoor);
    openRightDoor(rightDoor);
}

function closeDoors(lift,leftDoor, rightDoor) {
    leftDoor.style.transform = `translateX(0)`;
    leftDoor.style.transition = `transform 2.5s ease-in-out`;
    rightDoor.style.transform = `translateX(0)`;
    rightDoor.style.transition = `transform 2.5s ease-in-out`;

    // Add transitionend listener for closing doors
    leftDoor.addEventListener("transitionend", () => {
        lift.classList.remove("opened-door");
        leftDoor.classList.remove("closed-door");
        leftDoor.style.transition = "";
    }, { once: true });

    rightDoor.addEventListener("transitionend", () => {
        rightDoor.classList.remove("closed-door");
        rightDoor.style.transition = "";
    }, { once: true });
}

function openLeftDoor(leftDoor) {
    leftDoor.style.transform = `translateX(-1.25rem)`;
    leftDoor.style.transition = `transform 2.5s ease-in-out`;
}

function openRightDoor(rightDoor) {
    rightDoor.style.transform = `translateX(1.25rem)`;
    rightDoor.style.transition = `transform 2.5s ease-in-out`;
}
