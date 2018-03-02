# epubTools-numPage

Script Indesign qui insère les pages pour l'export en EPUB

## Mode d'emploi

Ce script insère des marques dans le document.

Il crée un "Texte conditionnel" `epubTools-numPage` et "Style de caractère" `epubTools-numPage-style`.

Afficher les caractères masqués `Texte > Afficher les caractères masqués`
> ![Aperçu du texte conditionnel non visible](/images/Apercu_TexteConditionnel.PNG)

Avant l'export vers l'EPUB, rendre visible `epubTools-numPage` dans la fenêtre `Texte conditionnel` (`Fenêtre > Texte et tableaux > Texte conditionnel`).
> ![Fenêtre Indesign Texte conditionnel non visible](/images/TexteConditionnel_nonVisible.PNG)
> ![Fenêtre Indesign Texte conditionnel visible](/images/TexteConditionnel_Visible.PNG)

Les pages apparaîtront dans l'EPUB sous la forme :

```xhtml
<span class="epubTools-numPage-style">{numéro}</span>
```

Une fois l'EPUB créé, décompresser-le.

- Avec Vscode et le plugin [EpubTools](https://github.com/civodulab/epubtools) installé vous pourrez convertir les span en :

    ```xhtml
    <span id="page{numéro}" title="{numéro}" epub:type="pagebreak" role="doc-pagebreak"></span>
    ```
    
- Sinon, avec un autre éditeur faite un recherche/remplace.