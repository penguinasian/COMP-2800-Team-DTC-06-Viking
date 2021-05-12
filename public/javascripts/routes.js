document.getElementById("routeOneOverlay").addEventListener("touchstart", function() {testMouseOver('routeOneInfo');});
document.getElementById("routeOneOverlay").addEventListener("mouseup", function() {removeMouseOut('routeOneInfo');});
document.getElementById("routeOneOverlay").addEventListener("dblclick", function() {routeDescriptionRedirect('../public/index.html');});

document.getElementById("routesContent").addEventListener('swiped-right', function(e) {
    console.log(e.target); // element that was swiped
    console.log(e.detail); // event data { dir: 'right', xStart: 196, xEnd: 230, yStart: 196, yEnd: 4 }
    routeDescriptionRedirect('../public/index.html');
  });

function testMouseOver(elementId) {
    document.getElementById(elementId).style.visibility = "visible";
}

function removeMouseOut(elementID) {
    document.getElementById(elementID).style.visibility = "hidden";
}

function routeDescriptionRedirect(linkID) {
    window.location.href = linkID;
}





