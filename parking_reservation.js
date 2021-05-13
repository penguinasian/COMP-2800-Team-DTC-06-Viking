

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






