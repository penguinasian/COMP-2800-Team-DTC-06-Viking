/* This part of code is partially copied from https://codepen.io/mtbroomell/pen/yNwwdv and modified based on this situation: */
function increaseValue() {
    var value = parseInt(document.getElementById('quantity').value, 10);
    value = isNaN(value) ? 0 : value;
    value > 19 ? value = 19 : '';
    value++;
    document.getElementById('quantity').value = value;
  }
  
function decreaseValue() {
    var value = parseInt(document.getElementById('quantity').value, 10);
    value = isNaN(value) ? 0 : value;
    value < 2 ? value = 2 : '';
    value--;
    document.getElementById('quantity').value = value;
}

// summary toggle button(show, hide)
document.getElementById('summary').addEventListener('click', function(event) {
    console.log('button clicked')
    let table = document.getElementsByClassName('summaryTable')[0]
    if (table.style.display === 'none') {
        table.style.display = 'block';
    } else {
        table.style.display = 'none';
    }
});

// let startDate = $( "#datepicker" ).datepicker({ dateFormat: "yy-m-dd" })
let startDate = document.getElementById('startDate').value
console.log('test')
console.log(startDate)






