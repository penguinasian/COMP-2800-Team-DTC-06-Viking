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
let boxId = parseInt(infoArray[7]);

let startDate = req_begins.toISOString().substring(0, 10);
let endDate = req_ends.toISOString().substring(0, 10);
let currnetDateObject = new Date();
let currentDate = currnetDateObject.toISOString().substring(0, 10);
console.log(startDate);
console.log(req_ends);
console.log(available);
console.log("LockerID " + LockerId);
console.log("boxID " + boxId);
console.log("today " + currentDate);




function increaseValue() {
    var value = parseInt(document.getElementById('quantity').value, 10);
    value = isNaN(value) ? 0 : value;
    value > 19 ? value = 19 : '';
    value++;
    document.getElementById('quantity').value = value;
    updateInformation()

}

function decreaseValue() {
    var value = parseInt(document.getElementById('quantity').value, 10);
    value = isNaN(value) ? 0 : value;
    value < 2 ? value = 2 : '';
    value--;
    document.getElementById('quantity').value = value;
    updateInformation()
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
    let totalPrice = chargePerWeek * quantity * weeks


    $('#address').text(address);
    $('#slots').text(`${available} / ${numOfBoxes}`);
    $('#address2').text(address);
    $('#start').text(startDate);
    $('#end').text(endDate);
    $('#length').text(`${weeks} weeks`);
    $('#qty').text(quantity);
    $('#totalPrice').text(`$ ${totalPrice}`);
};


function testUserSign() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log("Success")
            var user = firebase.auth().currentUser;
            var uid = user.uid;
            console.log(uid)
        } else {
            // No user is signed in.
            console.log("not log-in")
        }
    });
}


document.getElementById('pay').addEventListener('click', function (event) {
    let totalPrice =  parseInt(document.getElementById("totalPrice").textContent.substring(2,5))
    
    
    console.log('button clicked')
    console.log('LocekrId ' + LockerId);
    console.log('BOX_ID ' + boxId);
    console.log('RES_BEGIN ' + startDate);
    console.log('RES_DURATION_WEEKS ' + weeks);
    console.log('RES_PAYMENT_DATE ' + currentDate);
    console.log('RES_PAYMENT_AMOUNT ' + totalPrice);


    db.collection("reservation").add({
        // USER_ID: uid,
        LOCKER_ID: LockerId,
        BOX_ID: boxId,
        RES_BEGIN: startDate,
        RES_DURATION_WEEKS: weeks,
        RES_PAYMENT_DATE: currentDate,
        RES_PAYMENT_AMOUNT: totalPrice
    });

    console.log('Updated')

    // firebase.auth().onAuthStateChanged(function (user) {
    //     if (user) {
    //         // User is signed in.
    //         console.log("Success")
    //         let user = firebase.auth().currentUser;
    //         let uid = user.uid;
    //         let totalPrice =  parseInt(document.getElementById("totalPrice").textContent.substring(2,5))

    //         console.log(uid)
    //         db.collection("test").add({
    //             USER_ID: uid,
    //             LOCKER_ID: LockerId,
    //             BOX_ID: boxId,
    //             RES_BEGIN: startDate,
    //             RES_DURATION_WEEKS: weeks,
    //             RES_PAYMENT_DATE: currentDate,
    //             RES_PAYMENT_AMOUNT: totalPrice
    //         });

    //     } else {
    //         // No user is signed in.
    //         console.log("not log-in")
    //     }
    // });
});





updateInformation()








