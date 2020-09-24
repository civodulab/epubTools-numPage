//#target "indesign"
var mesLivres = app.books;
var cdName = "epubTools-numPage",
  stylePN = "epubTools-numPage-style";
var erreursPages = [];
var mesFichiers = [];


// on copie les fichiers ouverts dans mesFichiers
if (app.documents.length !== 0) {
  for (l = 0; l !== app.documents.length; l++) {
    mesFichiers.push({ doc: app.documents[l], open: true });
  }
}
// on copie les fichiers de chaque livre ouvert dans mesFichiers
if (mesLivres.length !== 0) {
  for (k = 0; k !== mesLivres.length; k++) {
    for (m = 0; m !== mesLivres[k].bookContents.length; m++) {
      mesFichiers.push({ doc: mesLivres[k].bookContents[m], open: false });
    }
  }
}

mesFichiers = removeDuplicateObject(mesFichiers);

// suppression des doublons
function removeDuplicateObject(arr) {
  var keys = {};
  var a = [];
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    var key = item.doc.name;
    if (key in keys) {
      continue;
    }
    keys[key] = 1;
    a.push(item);
  }
  return a;
}


// progressbar
var w = new Window(
  "palette{text:'Please be patient...',bounds:[100,100,580,140]," +
    "progress:Progressbar{bounds:[20,10,460,30] , minvalue:0,value:0}};"
);
var d = w.graphics;
d.backgroundColor = d.newBrush(d.BrushType.SOLID_COLOR, [0.0, 0.0, 0.0, 1]);
w.center();
w.show();

for (p = 0; p !== mesFichiers.length; p++) {
  mesFunctions(mesFichiers[p].doc, mesFichiers[p].open);
}


function mesFunctions(doc, open) {
  var monDoc = (!open && app.open(File(doc.fullName), false)) || doc;
  testCondition(monDoc);
  supprimeNum(monDoc);
  bouclePage(monDoc);
  !open && monDoc.close(SaveOptions.YES);
  if (erreursPages.length !== 0) {
    alert("Erreurs sur les pages : " + erreursPages.join("; "));
  }
}

function supprimeNum(doc) {
  w.text = "Supprime Num existant dans " + doc.name;
  w.progress.maxvalue = 1;
  w.progress.value = 0;
  w.progress.value++;
  w.update();
  app.findTextPreferences = NothingEnum.nothing;
  app.changeTextPreferences = NothingEnum.nothing;
  doc.conditions.item(cdName).visible = true;
  app.findTextPreferences.appliedConditions = [cdName];
  doc.changeText();
  app.findTextPreferences = NothingEnum.nothing;
  app.changeTextPreferences = NothingEnum.nothing;
  doc.conditions.item(cdName).visible = false;
}

function testCondition(doc) {
  w.progress.maxvalue = 1;
  w.progress.value = 0;
  w.text = "Vérifie si le style est présent.";
  w.progress.value++;

  w.update();
  if (!doc.conditions.item(cdName).isValid) {
    var cd = doc.conditions.add();
    cd.name = cdName;
  }
  doc.conditions.item(cdName).visible = false;
  try {
    myCharacterStyle = doc.characterStyles.item(stylePN);
    myName = myCharacterStyle.name;
  } catch (myError) {
    myCharacterStyle = doc.characterStyles.add({ name: stylePN });
  }
  myCharacterStyle.pointSize = 0.1;
  myCharacterStyle.styleExportTagMaps.add({
    exportType: "EPUB",
    exportTag: "span",
    exportClass: "epubTools-numPage",
    exportAttributes: "",
  });
}

function bouclePage(doc) {
  var pages = doc.pages;
   var i = 0,
     lpages = pages.length;
  w.text = "Insertion pages dans " + doc.name;
  w.progress.maxvalue = lpages;
  w.progress.value = 0;
  w.update();
 
  for (; i !== lpages; i++) {
    var myObjectList = new Array();
    var items = pages[i].textFrames;
    if (items.length !== 0) {
      for (var j = 0; j < items.length; j++) {
        if (items[j].contents !== "") {
          myObjectList.push(items[j]);
        }
      }
      if (myObjectList.length !== 0) {
        myOrderTextFrame(doc, myObjectList, pages[i].name);
      }
    }
    w.progress.value++;
  }
}

function myOrderTextFrame(doc, myObjectList, numPage) {
  myObjectList.sort(mySortByTextFramePosition);
  var myTextFrame = myObjectList[0];
  try {
    insertionPage(doc, myTextFrame, numPage);
  } catch (err) {
    erreursPages.push(numPage);
  }
}

function insertionPage(doc, myTextFrame, numPage) {
  var myInsertionPoint = myTextFrame.insertionPoints.item(0),
    myCharacterStyle = doc.characterStyles.item(stylePN),
    maCD = doc.conditions.item(cdName, true);

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
