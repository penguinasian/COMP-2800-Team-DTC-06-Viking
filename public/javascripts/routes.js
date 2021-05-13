$("#routeOneOverlay").single_double_click(function () {
    routeDescriptionRedirect('../public/index.html')
  }, function () {
    routeLike('routeOne')
  })

  $("#routeTwoOverlay").single_double_click(function () {
    routeDescriptionRedirect('../public/index.html')
  }, function () {
    routeLike('routeTwo')
  })

  $("#routeThreeOverlay").single_double_click(function () {
    routeDescriptionRedirect('../public/index.html')
  }, function () {
    routeLike('routeThree')
  })

  $("#routeFourOverlay").single_double_click(function () {
    routeDescriptionRedirect('../public/index.html')
  }, function () {
    routeLike('routeFour')
  })

  $("#routeFiveOverlay").single_double_click(function () {
    routeDescriptionRedirect('../public/index.html')
  }, function () {
    routeLike('routeFive')
  })

  $("#routeSixOverlay").single_double_click(function () {
    routeDescriptionRedirect('../public/index.html')
  }, function () {
    routeLike('routeSix')
  })

document.getElementById("routesDisplay").addEventListener('swiped-right', function(e) {
    console.log(e.target); // element that was swiped
    console.log(e.detail); // event data { dir: 'right', xStart: 196, xEnd: 230, yStart: 196, yEnd: 4 }
    let currentPage = document.getElementById('currentPage').innerHTML;
    console.log(currentPage);
    if (currentPage > 1) {
        document.getElementById('currentPage').innerHTML = parseInt(currentPage) - 1;
    }
  });

document.getElementById("routesDisplay").addEventListener('swiped-left', function(e) {
    console.log(e.target); // element that was swiped
    console.log(e.detail); // event data { dir: 'right', xStart: 196, xEnd: 230, yStart: 196, yEnd: 4 }
    let currentPage = document.getElementById('currentPage').innerHTML;
    console.log(currentPage);
    if (currentPage < document.getElementById('totalPages').innerHTML) {
        document.getElementById('currentPage').innerHTML = parseInt(currentPage) + 1;
    }
  });

document.getElementById("routeInfoPage").addEventListener('swiped-right', function(e) {
console.log(e.target); // element that was swiped
console.log(e.detail); // event data { dir: 'right', xStart: 196, xEnd: 230, yStart: 196, yEnd: 4 }
routeDescriptionRedirect("../public/");
});


document.getElementById("filterButton").addEventListener('click', function () {
    changeFilterColour("filterButton");
    expandHiddenWindow("routesDisplay", "filterSettings", "search");
});

document.getElementById("searchButton").addEventListener('click', function () {
    changeFilterColour("searchButton");
    expandHiddenWindow("routesDisplay", "searchSettings", "filter"); 
});

function changeFilterColour(elementID) {
    let elementObj = window.getComputedStyle(document.getElementById(elementID));
    let bgColour = elementObj.getPropertyValue("background-color");
    console.log(bgColour);
    if (bgColour != "rgb(76, 116, 76)") {
        document.getElementById(elementID).style.backgroundColor = "rgb(76, 116, 76)";
        document.getElementById(elementID + "Img").style.filter = "invert(1)";
    } else {
        document.getElementById(elementID).style.backgroundColor = "white"
        document.getElementById(elementID + "Img").style.filter = "invert(0)";
    }
}

function expandHiddenWindow(elementID, replacementElementID, currentElementID) {
    let replacementObj = window.getComputedStyle(document.getElementById(replacementElementID));
    let replacementEleVis = replacementObj.getPropertyValue("visibility");
    let currentObj = window.getComputedStyle(document.getElementById(currentElementID + "Settings"));
    let currentEleVis = currentObj.getPropertyValue("visibility");

    if (currentEleVis != "hidden") {
        document.getElementById(currentElementID + "Settings").style.height = "0";
        document.getElementById(currentElementID + "Settings").style.visibility = "hidden";
        changeFilterColour(currentElementID + "Button");
    }

    if (replacementEleVis == "visible") {
        document.getElementById(elementID).style.height = "100%";
        document.getElementById(elementID).style.visibility = "visible";
        document.getElementById(replacementElementID).style.height = "0";
        document.getElementById(replacementElementID).style.visibility = "hidden";
    } else {
        document.getElementById(elementID).style.height = "0";
        document.getElementById(elementID).style.visibility = "hidden";
        document.getElementById(replacementElementID).style.height = "100%";
        document.getElementById(replacementElementID).style.visibility = "visible";
    }

}


function routeLike(elementId) {
    let likedVisibility = document.getElementById(elementId + 'Like').style.visibility;
    if (likedVisibility == "visible") {
        document.getElementById(elementId + 'Like').style.visibility = "hidden";
    } else {
        document.getElementById(elementId + 'Like').style.visibility = "visible";
        document.getElementById(elementId + 'Info').style.visibility = "hidden";
        document.getElementById(elementId + 'Background').style.backgroundColor = "rgba(76,116,76, 0.8)";
        sleep(750).then(() => { 
            document.getElementById(elementId + 'Info').style.visibility = "visible";
            document.getElementById(elementId + 'Background').style.backgroundColor = "rgba(76,116,76, 0.6)";
        });
    }
}

function routeDescriptionRedirect(linkID) {
    //document.location.href = linkID;
    let currentObj = window.getComputedStyle(document.getElementById('routeInfoPage'));
    let currentEleVis = currentObj.getPropertyValue("visibility");
    if (currentEleVis == "hidden") {

        document.getElementById('routesDisplay').style.visibility = "hidden";
        document.getElementById('routesDisplay').style.height = "0";

        document.getElementById('routesNavBar').style.visibility = "hidden";
        document.getElementById('routesNavBar').style.height = "0";

        document.getElementById('routeInfoPage').style.height = "100%";
        document.getElementById('routeInfoPage').style.visibility = "visible";

    } else {
        document.getElementById('routesDisplay').style.visibility = "visible";
        document.getElementById('routesDisplay').style.height = "100%";

        document.getElementById('routesNavBar').style.visibility = "visible";
        document.getElementById('routesNavBar').style.height = "10vw";
        
        document.getElementById('routeInfoPage').style.height = "0";
        document.getElementById('routeInfoPage').style.visibility = "hidden";
    }

}

//Code taken from https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function resizeForms() {
    if (screen.width > 500) {
        
    }
}

resizeForms();




