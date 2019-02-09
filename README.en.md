# epubTools-numPage

Script for InDesign to add the pages numbers for EPUB export.

## Manual

The script creates a "Conditional text" `epubTools-numPage` and a "Character Style" ` epubTools-pagenum-style`.

The conditional text is placed on the first text box (highest position) in the page.

> ![Screen capture: dialogue box from the script](/images/Boite_du_script.PNG)

First field "Début de la numérotation": start of numbering.

Second field "Début de la première page": from which page to start numbering.


Use normal view mode (`View > Screen mode > Normal`) then show the hidden characters (`Type > Show Hidden Characters`)
> ![Screen capture: some text with conditional text visible](/images/Apercu_TexteConditionnel.PNG)

**IMPORTANT!** Before EPUB export, the conditional text  `epubTools-numPage` must be visible. Check it in the box in the "Conditional text" InDesign's window (`Windows > Type & Tables > Conditional text`).
> ![Screen capture: InDesign toolbox with generated conditional visibility unchecked](/images/EN_TexteConditionnel_nonVisible.PNG)
> ![Screen capture: InDesign toolbox with generated conditional visibility checked](/images/EN_TexteConditionnel_Visible.PNG)

The conditional text is not visible on the screen, the size of its font is 0.1 point to don't change the layout of the document.


Pages' numbers in the EPUB will look like:

```xhtml
<span class="epubTools-numPage-style">{number}</span>
```

Unzip the EPUB and do replacements:

- With Vscode and [EpubTools](https://marketplace.visualstudio.com/items?itemName=civodulab.epubtools) extension, you can convert `span` into:

    ```xhtml
    <span id="page{number}" title="{number}" epub:type="pagebreak" role="doc-pagebreak"></span>
    ```
    Use `EpubTools: A11Y` then `DPub-Aria roles|epub:type` commands.
    
- With another editor, do a search/replace with Regex.