firebase.auth().onAuthStateChanged(function (user) {
    if  (!user) {
        window.location.href="https://viking-eaee3.web.app/login.html";
    } 
});



const chargePerWeek = 2.5;

/* This part of code is partially copied from https://codepen.io/mtbroomell/pen/yNwwdv and modified based on this situation: */
let params = (new URL(document.location)).searchParams;
let dataInput = params.get("array");
let infoArray = dataInput.split("|");
console.log(infoArray);
// address, check-in, check-out, available, total_slots, weeks, locker_id, box_id
let address = infoArray[0];
let req_begins = new Date(infoArray[1]);
let req_ends = new Date(infoArray[2]);
let available = parseInt(infoArray[3]);
let numOfBoxes = parseInt(infoArray[4]);
let weeks = parseInt(infoArray[5]);
let LockerId = parseInt(infoArray[6]);
let boxIdString = infoArray[7];
let boxIdArray = boxIdString.split(",").map(function(item) {return parseInt(item, 10);});

let startDate = req_begins.toISOString().substring(0, 10);
let endDate = req_ends.toISOString().substring(0, 10);
let currnetDateObject = new Date();
let currentDate = currnetDateObject.toISOString().substring(0, 10);
let priceForEachBox;
let quantity;
let userID;
console.log(startDate);
console.log(req_ends);
console.log(available);
console.log("LockerID " + LockerId);
console.log(boxIdArray);
console.log("today " + currentDate);






function increaseValue() {
    var value = parseInt(document.getElementById('quantity').value, 10);
    value = isNaN(value) ? 0 : value;
    value > available-1 ? value = available-1 : '';
    value++;
    document.getElementById('quantity').value = value;
    updateInformation();
}

function decreaseValue() {
    var value = parseInt(document.getElementById('quantity').value, 10);
    value = isNaN(value) ? 0 : value;
    value < 2 ? value = 2 : '';
    value--;
    document.getElementById('quantity').value = value;
    updateInformation();
}

// summary toggle button(show, hide)
document.getElementById('summary').addEventListener('click', function (event) {
    console.log('button clicked')
    let table = document.getElementsByClassName('summaryTable')[0]
    if (table.style.display === 'none') {
        table.style.display = 'block';
    } else {
        table.style.display = 'none';
    }
});


function updateInformation() {

    let quantity = parseInt(document.getElementById("quantity").value);
    let totalPrice = chargePerWeek * quantity * weeks;


    $('#address').text(address);
    $('#slots').text(`${available} / ${numOfBoxes}`);
    $('#address2').text(address);
    $('#start').text(startDate);
    $('#end').text(endDate);
    $('#length').text(`${weeks} weeks`);
    $('#qty').text(quantity);
    $('#totalPrice').text(`$ ${totalPrice}`);
};


// function testUserSign() {
//     firebase.auth().onAuthStateChanged(function (user) {
//         if (user) {
//             // User is signed in.
//             console.log("Success")
//             var user = firebase.auth().currentUser;
//             var uid = user.uid;
//             console.log(uid)
//         } else {
//             // No user is signed in.
//             console.log("not log-in")
//         }
//     });
// }



document.getElementById('pay').addEventListener('click', function (event) {
    
    priceForEachBox =  chargePerWeek * weeks;
    quantity = parseInt(document.getElementById("quantity").value);
    
    console.log('button clicked');
    console.log('quantity ' + quantity);
    for (let i = 0; i < quantity; i++) {
        console.log('LOCKER_ID:' + LockerId);
        console.log('BOX_ID:' + boxIdArray[i]);
        console.log('RES_BEGIN:' + startDate);
        console.log('RES_DURATION_WEEKS:' + weeks);
        console.log('RES_PAYMENT_DATE:' + currentDate);
        console.log('RES_PAYMENT_AMOUNT:' + priceForEachBox);
    }

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log("Successful user authentication!");
            let user = firebase.auth().currentUser;
            

            db.collection("users").doc(user.uid)
            .get()
            .then(function (doc) {
                userID = doc.data().USER_ID;
                console.log(userID);
                let firstBox = 0;
                writeToDatabase(firstBox);
            });
            

        } else {
            // No user is signed in.
            window.location.href="https://viking-eaee3.web.app/login.html";
            console.log("not log-in");
        }
    });
});


function writeToDatabase(boxNumber) {
    db.collection("reservation").add({
        LOCKER_ID: LockerId,
        BOX_ID: boxIdArray[boxNumber],
        USER_ID: userID,
        RES_BEGIN: startDate,
        RES_DURATION_WEEKS: weeks,
        RES_PAYMENT_DATE: currentDate,
        RES_PAYMENT_AMOUNT: priceForEachBox
    }).then((docRef) => {
        boxNumber++;
        console.log("docRef: " + docRef);
        console.log("number: " + boxNumber);
        console.log("quantity: " + quantity);
        if (boxNumber == quantity) {
            window.location.replace="https://viking-eaee3.web.app/profile.html";
        } else {
            writeToDatabase(boxNumber);
            console.log("Added Box number: " + boxNumber);
        }
    });
}


updateInformation();








