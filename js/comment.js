// async function closeDoors(liftNumber, delay) {
//     const lift = document.querySelector(`#lift-${liftNumber}`);
//     const leftDoor = document.querySelector(`#leftDoor-${liftNumber}`);
//     const rightDoor = document.querySelector(`#rightDoor-${liftNumber}`);

//     await new Promise((resolve) => setTimeout(resolve, delay));

//     leftDoor.style.transform = `translateX(0)`;
//     leftDoor.style.transition = `transform 2.5s ease-in-out`;
//     rightDoor.style.transform = `translateX(0)`;
//     rightDoor.style.transition = `transform 2.5s ease-in-out`;

//     // Add transitionend listener for closing doors
//     await new Promise((resolve) => {
//         const closeDoorsHandler = () => {
//             leftDoor.removeEventListener("transitionend", closeDoorsHandler);
//             lift.classList.remove("opened-door");
//             leftDoor.classList.remove("closed-door");
//             rightDoor.classList.remove("closed-door");
//             leftDoor.style.transition = "";
//             rightDoor.style.transition = "";
//             liftsData[liftNumber - 1].state = "idle";
//             resolve();
//         };
//         leftDoor.addEventListener("transitionend", closeDoorsHandler, { once: true });
//     });
// }

// function closeLeftDoor() {
//     setTimeout(() => {
//         leftDoor.style.transform =`translateX(0)`;
//         leftDoor.style.transition = `transform 2.5s ease-in-out`;

//         // Add transitionend listener for closing left door
//         leftDoor.addEventListener("transitionend", () => {
//             // Remove the opened-door class and reset the left door transition
//             lift.classList.remove("opened-door");
//             leftDoor.classList.remove("closed-door");
//             leftDoor.style.transition = "";
//             liftsData[liftNumber-1].state = "idle"

//             // Check if there are events in the queue
//             if (eventQueue.length > 0) {
//                 setTimeout(() => {
//                     const nextEvent = eventQueue.shift();
//                     if(nextEvent?.floorNumber) {
//                         const nearestIdleLift = findNearestIdleLift(nextEvent.floorNumber);
//                         if(eventQueue.length > 0) {
//                             // alert.innerText = `Floor ${getFloorsInQueue()} added to queue`;
//                             let floorList = getFloorsInQueue()
//                             alert.innerText = `${floorList.length !== 1 ? "Floors" : "Floor"} ${floorList} ${floorList.length !== 1 ? 'are' : 'is'} in queue`;
//                         }
//                         moveLiftToFloor(nextEvent.floorNumber, nearestIdleLift);
//                     }
//                 }, 2500); // Adjust the delay as needed
//             } else {
//                 isLiftFree = true;
//                 alert.style.display = "none";
//             }
//             console.log("Print once transition ends")
//         });
//     },2500)
// }

// function closeRightDoor() {
//     setTimeout(() => {
//         rightDoor.style.transform = `translateX(0)`;
//         rightDoor.style.transition = `transform 2.5s ease-in-out`;

//         // Add transitionend listener for closing right door
//         rightDoor.addEventListener("transitionend", () => {
//             // Reset the right door transition
//             rightDoor.classList.remove("closed-door");
//             rightDoor.style.transition = "";
//         });
//     },2500)
// }

