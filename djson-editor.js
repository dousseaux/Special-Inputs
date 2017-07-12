function json_editor(textarea, target_div) {
    var filterText =  function(){
        // Save position and replace rangy element with a code
        var savedSel = rangy.saveSelection();
        var rangyposition = $('.rangySelectionBoundary').prop('outerHTML');
        $('.rangySelectionBoundary').replaceWith('|rangy|')
        // Replace line breaks with a code
        $(target_div).html($(target_div).html().replace(/<br>/g, "|br|"));
        // Get text without html elements
        var str = $(target_div).text();
        // #### APPLY FILTERS ####
        str = str.replace(/(\"[a-z|]+\")(?:\:)/gi, function key_subs(x, p1) {
            return '<span class="djson-key">' + p1 + "</span>:"
        });
        str = str.replace(/(?:\:[\s\|]?)(\"[^\:]+\")(\,|(\|br\|)|\})/gi, function key_subs(x, p1, p2) {
            return ': <span class="djson-prop">' + p1 + "</span>" + p2
        });
        str = str.replace(/([\,\[][ ]*)(\"[^\"]+\")([ ]*[\,\]])/gi, function key_subs(x, p1, p2, p3) {
            return p1 + '<span class="djson-array">' + p2 + "</span>" + p3
        });
        str = str.replace(/([\,\[][ ]*)(\"[^\"]+\")([ ]*[\,\]])/gi, function key_subs(x, p1, p2, p3) {
            return p1 + '<span class="djson-array">' + p2 + "</span>" + p3
        });
        str = str.replace(/\:/gi, function key_subs(x) {
            return '<span class="djson-colon">' + x + "</span>"
        });
        str = str.replace(/[\{\}]/gi, function key_subs(x) {
            return '<span class="djson-bracket">' + x + "</span>"
        });
        // #### END OF FILTERS ####window.clipboardData.getData("Text")
        // Restore line breaks from codes
        str = str.replace(/\|br\|/g, "<br>")

        // Decode rangy position to html element
        str = str.replace(/\|rangy\|/g, rangyposition);
        // Write html back to div
        $(target_div).html(str)

        // Restore caret position using rangy element

        // Get non-html content and add to texarea
        $(target_div).html($(target_div).html().replace(/<br>/g, "|br|"));
        str = $(target_div).text().replace(/\|br\|/g, "\r\n");
        // str = str.replace(/[ ]{4}/g, "\t");
        $(target_div).html($(target_div).html().replace(/\|br\|/g, "<br>"));
        $(textarea).text(str);

        rangy.restoreSelection(savedSel);
    }

    var filterClipBoard = function(event){
        // Save div current selection
        var savedSel = rangy.saveSelection();
        // Get text from clipboard
        var text = null;
        if (window.clipboardData)
          text = window.clipboardData.getData("Text");
        else if (event.originalEvent && event.originalEvent.clipboardData)
          text = event.originalEvent.clipboardData.getData("Text");
        // Edit text to be pasted
        text = text.replace(/\n/g, "<br>");
        text = text.replace(/\t/g, "&nbsp&nbsp&nbsp&nbsp");
        text = text.replace(/\s/g, "&nbsp");
        // Recopy edited text to clipboard
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(text).select();
        document.execCommand("copy");
        $temp.remove();
        // Restore div selection
        rangy.restoreSelection(savedSel);
        // Filter text after being pasted
        setTimeout(filterText, 100);
    }

    $(target_div).attr('contentEditable', true);
    $(target_div).on('input', filterText);
    $(target_div).on('paste', filterClipBoard);
    filterText();
}
