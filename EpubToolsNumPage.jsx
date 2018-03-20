//#target "indesign"
var cdName = "epubTools-numPage",
    stylePN = "epubTools-numPage-style",
    doc = app.activeDocument,
    pages = doc.pages;

testCondition();
bouclePage();


function testCondition() {
    if (!app.activeDocument.conditions.item(cdName).isValid) {
        var cd = app.activeDocument.conditions.add();
        cd.name = cdName;
    }
    app.activeDocument.conditions.item(cdName).visible = false;
    try {
        myCharacterStyle = app.activeDocument.characterStyles.item(stylePN);
        //If the style does not exist, trying to get its name will generate an error.
        myName = myCharacterStyle.name;
    }
    catch (myError) {
        //The style did not exist, so create it.
        myCharacterStyle = app.activeDocument.characterStyles.add({ name: stylePN });
    }

}

function bouclePage() {
    var w = new Window('palette', 'Ajout pages noire');
    w.pbar = w.add('progressbar', undefined, 0, pages.length);
    w.pbar.preferredSize.width = 300;
    w.show();
    for (var i = 0; i < pages.length; i++) {

        var myObjectList = new Array;
        var items = pages[i].textFrames;
        if (items.length !== 0) {
            for (var j = 0; j < items.length; j++) {
                if (items[j].parent.constructor.name === "Spread") {
                    if (items[j].contents !== ""&&(items[j].nextTextFrame||items[j].previousTextFrame)) {
                        myObjectList.push(items[j]);
                        $.write(items[j]);
                        // items[j].select();
                    }
                }
            }
            if (myObjectList.length !== 0) {
                myOrderTextFrame(myObjectList, i + 1);
            }
        }
        w.pbar.value = i;
    }
}


function myOrderTextFrame(myObjectList, numPage) {
    myObjectList.sort(mySortByTextFramePosition);
    var myTextFrame = myObjectList[0];
    try {
        // anchoredFrame(myTextFrame, numPage);
        insertionPage(myTextFrame, numPage);
    }
    catch (err) {
        alert("Erreur page " + numPage);
    }

}

function insertionPage(myTextFrame, numPage) {
    var myInsertionPoint = myTextFrame.insertionPoints.item(0),
        myCharacterStyle = app.activeDocument.characterStyles.item(stylePN),
        maCD = app.activeDocument.conditions.item(cdName, true);

    myInsertionPoint.contents = "" + numPage;
    myInsertionPoint.applyCharacterStyle(myCharacterStyle, true);
    myInsertionPoint.applyConditions(maCD, true);
    // myTextFrame.parentStory.insertionPoints.item(-1).contents = "Not equal to";
    // myTextFrame.parentStory.characters.item(0).applyCharacterStyle(myCharacterStyle, true);
}

function mySortByTextFramePosition(a, b) {
    var ya = a.geometricBounds[0];
    var yb = b.geometricBounds[0];
    if (ya < yb) {
        return -1;
    }
    if (ya > yb) {
        return 1;
    }
    return 0;
}


