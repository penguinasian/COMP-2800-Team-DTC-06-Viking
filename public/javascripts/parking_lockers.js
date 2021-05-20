
// This code is partially copied from https://codepen.io/mtbroomell/pen/yNwwdv and modified based on this situation:
function increaseValue() {
    var value = parseInt(document.getElementById('duration').value, 10);
    value = isNaN(value) ? 0 : value;
    value > 52 ? value = 52 : '';
    value++;
    document.getElementById('duration').value = value;
  }
  
function decreaseValue() {
    var value = parseInt(document.getElementById('duration').value, 10);
    value = isNaN(value) ? 0 : value;
    value < 3 ? value = 3 : '';
    value--;
    document.getElementById('duration').value = value;
}