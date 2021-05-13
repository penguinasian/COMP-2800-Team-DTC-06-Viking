$("#routeOneOverlay").single_double_click(function () {
    routeDescriptionRedirect('../public/index.html')
  }, function () {
    routeLike('routeOne')
  })


document.getElementById("routesContent").addEventListener('swiped-right', function(e) {
    console.log(e.target); // element that was swiped
    console.log(e.detail); // event data { dir: 'right', xStart: 196, xEnd: 230, yStart: 196, yEnd: 4 }
    routeDescriptionRedirect('../public/index.html');
  });

function routeLike(elementId) {
    let likedVisibility = document.getElementById(elementId + 'Like').style.visibility;
    if (likedVisibility) {
        document.getElementById(elementId + 'Like').style.visibility = "hidden";
    } else {
        document.getElementById(elementId + 'Like').style.visibility = "visible";
        document.getElementById(elementId + 'Info').style.visibility = "hidden";
    }
}

function routeDescriptionRedirect(linkID) {
    window.location.href = linkID;
}





