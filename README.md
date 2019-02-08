# epubTools-numPage

Script InDesign qui insère les numéros des pages pour l'export en EPUB.

## Mode d'emploi

Le script crée un "Texte conditionnel" `epubTools-numPage` et un "Style de caractère" `epubTools-numPage-style`.

Le texte conditionnel est placé au début du premier bloc de texte dans la page (celui qui a la position la plus haute dans la page).

> ![Capture d'écran : boîte de dialogue du script](/images/Boite_du_script.PNG)

Utilisez le mode d'affichage normal (`Affichage > Mode de l'écran > normal`) puis affichez les caractères masqués (`Texte > Afficher les caractères masqués`)
> ![Aperçu du texte conditionnel non visible](/images/Apercu_TexteConditionnel.PNG)


**IMPORTANT !** Avant l'export vers l'EPUB, rendre visible `epubTools-numPage` dans la fenêtre `Texte conditionnel` (`Fenêtre > Texte et tableaux > Texte conditionnel`).
> ![Fenêtre InDesign Texte conditionnel non visible](/images/TexteConditionnel_nonVisible.PNG)
> ![Fenêtre InDesign Texte conditionnel visible](/images/TexteConditionnel_Visible.PNG)

Le texte conditionnel n'est pas perceptible à l'écran, la taille de sa police est de 0,1 point afin de ne pas modifier la mise en page du document.

Les pages apparaîtront dans l'EPUB sous la forme :

```xhtml
<span class="epubTools-numPage-style">{numéro}</span>
```

Une fois l'EPUB créé, décompressez-le.

- Avec Vscode et le plugin [EpubTools](https://marketplace.visualstudio.com/items?itemName=civodulab.epubtools) installé vous pourrez convertir les `span` en :

    ```xhtml
    <span id="page{numéro}" title="{numéro}" epub:type="pagebreak" role="doc-pagebreak"></span>
    ```
    en utilisant la commande `EpubTools: A11Y` puis `DPub-Aria roles|epub:type`.
    
- Avec un autre éditeur faites un recherche/remplace.