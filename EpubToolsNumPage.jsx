//#target "indesign"
var cdName = "epubTools-numPage",
    stylePN = "epubTools-numPage-style",
    doc = app.activeDocument,
    pages = doc.pages;


dialogInterface();


function dialogInterface() {
    var myDialog = app.dialogs.add({ name: "Numérotation EPUB" });
    //Add a dialog column.
    var maColonne = myDialog.dialogColumns.add();

    with (maColonne) {
        //Create a border panel.
        with (borderPanels.add()) {
            with (dialogColumns.add()) {
                staticTexts.add({ staticLabel: "Début de la numérotation:", minWidth: 170 });
            }
            with (dialogColumns.add()) {
                var debutNum = integerEditboxes.add({ editValue: 1, minWidth: 30 });
            }
        }
        with (borderPanels.add()) {
            with (dialogColumns.add()) {
                staticTexts.add({ staticLabel: "Début de la première page:", minWidth: 170 });
            }
            with (dialogColumns.add()) {
                var debutPage = integerEditboxes.add({ editValue: 1, minWidth: 30 });
            }
        }
    }

    var myResult = myDialog.show();
    if (myResult == true) {
        testCondition();
        bouclePage(debutNum.editValue, debutPage.editValue);
    }
    myDialog.destroy();
}


function testCondition() {
    if (!app.activeDocument.conditions.item(cdName).isValid) {
        var cd = app.activeDocument.conditions.add();
        cd.name = cdName;
    }
    app.activeDocument.conditions.item(cdName).visible = false;
    try {
        myCharacterStyle = app.activeDocument.characterStyles.item(stylePN);
        myName = myCharacterStyle.name;
    }
    catch (myError) {
        myCharacterStyle = app.activeDocument.characterStyles.add({ name: stylePN });
    }

}

function bouclePage(debutNum, debutPage) {
    var w = new Window('palette', 'Ajout pages noire');
    w.pbar = w.add('progressbar', undefined, 0, pages.length);
    w.pbar.preferredSize.width = 300;
    w.show();
    for (var i = debutPage - 1; i < pages.length; i++) {

        var myObjectList = new Array;
        var items = pages[i].textFrames;
        if (items.length !== 0) {
            for (var j = 0; j < items.length; j++) {
                if (items[j].parent.constructor.name === "Spread") {
                    if (items[j].contents !== "" && (items[j].nextTextFrame || items[j].previousTextFrame)) {
                        myObjectList.push(items[j]);
                    }
                }
            }
            if (myObjectList.length !== 0) {
                myOrderTextFrame(myObjectList, (debutNum));
            }
        }
        w.pbar.value = i;
        debutNum++;
    }
}


function myOrderTextFrame(myObjectList, numPage) {
    myObjectList.sort(mySortByTextFramePosition);
    var myTextFrame = myObjectList[0];
    try {
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


