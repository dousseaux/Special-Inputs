/**
 * DJSON Editor, a cross-browser JSON editor
 * https://github.com/dousseaux/special_inputs
 *
 * Copyright 2017, Pedro Dousseau
 * Licensed under the MIT license.
 * Version: 0.1.0
 * Date: 18 July 2017"
 */

var DJSONeditor = function(textarea, div) {

    $(div).html("");
    $(div).append('<div class="djson-menu"></div>');
    $(div).append('<div class="djson-editor-text"></div>');

    var menu = $(div).find(".djson-menu");
    var target_div = $(div).find(".djson-editor-text");

    $(menu).html('<i class="fa fa-expand djson-expand"></i>')

    // ########### PRIVATE FUNCTIONS ############
    var filterText = function(restores_sel) {
        restores_sel = (typeof restores_sel !== 'undefined') ?  restores_sel : 1;
        // Save position and replace rangy element with a code
        var savedSel = null
        if (restores_sel) {
            savedSel = rangy.saveSelection();
            var rangyposition = $('.rangySelectionBoundary').prop('outerHTML');
            $('.rangySelectionBoundary').replaceWith('|rangy|')
        }
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
        str = str.replace(/([\,\[][\s]*)(\"[^\"]+\")([\s]*[\,\]])/gi, function key_subs(x, p1, p2, p3) {
            return p1 + '<span class="djson-array">' + p2 + "</span>" + p3
        });
        str = str.replace(/\:/gi, function key_subs(x) {
            return '<span class="djson-colon">' + x + "</span>"
        });
        str = str.replace(/[\{\}]/gi, function key_subs(x) {
            return '<span class="djson-brace">' + x + "</span>"
        });
        str = str.replace(/[\[\]]/gi, function key_subs(x) {
            return '<span class="djson-bracket">' + x + "</span>"
        });
        // #### END OF FILTERS ####window.clipboardData.getData("Text")
        // Restore line breaks from codes
        str = str.replace(/\|br\|/g, "<br>")

        // Decode rangy position to html element
        if (restores_sel) {
            str = str.replace(/\|rangy\|/g, rangyposition);
        }

        // Write html back to div
        $(target_div).html(str)

        // Get non-html content and add to texarea
        $(target_div).html($(target_div).html().replace(/<br>/g, "|br|"));
        str = $(target_div).text().replace(/\|br\|/g, "\r\n");
        // str = str.replace(/[ ]{4}/g, "\t");
        $(target_div).html($(target_div).html().replace(/\|br\|/g, "<br>"));
        $(textarea).text(str);

        // Restore caret position using rangy element
        if (restores_sel) {
            rangy.restoreSelection(savedSel);
        }
    }
    var filterClipBoard = function(event) {
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
    var expand = function() {
        if ($(div).attr('full-screen') === "true") {
            $(div).attr('full-screen', "false")
            $(div).removeClass("full-screen");
            $(menu).find('.djson-expand').removeClass('fa-compress');
            $(menu).find('.djson-expand').addClass('fa-expand');
        } else {
            $(div).attr('full-screen', "true")
            $(div).addClass("full-screen");
            $(menu).find('.djson-expand').removeClass('fa-expand');
            $(menu).find('.djson-expand').addClass('fa-compress');
        }
    }
    var addTab = function(event) {
        if (event.keyCode === 9) { // tab was pressed
            // Save position and replace rangy element with a code and add tab spaces
            var savedSel = rangy.saveSelection();
            var rangyposition = $('.rangySelectionBoundary').prop('outerHTML');
            $('.rangySelectionBoundary').replaceWith('&nbsp;&nbsp;&nbsp;&nbsp;|rangy|')
            var str = $(target_div).html();
            // Decode rangy position to html element
            str = str.replace(/\|rangy\|/g, rangyposition);
            $(target_div).html(str)
            // Restore caret position using rangy element
            rangy.restoreSelection(savedSel);
            // Prevent to lose the focus
            event.preventDefault();
            // Filter changed text
            filterText();
        }
    }

    // ########### PUBLIC FUNCTIONS ############
    this.setText = function(text) {
        text = text.replace(/\n/g, "<br>");
        text = text.replace(/\t/g, "&nbsp&nbsp&nbsp&nbsp");
        text = text.replace(/\s/g, "&nbsp");
        $(target_div).html(text);
        filterText(false);
    };

    // ############ SET EVENTS ############
    $(target_div).attr('contentEditable', true);
    $(target_div).on('input', filterText);
    $(target_div).on('paste', filterClipBoard);
    $(menu).find('.djson-expand').click(expand);
    $(target_div).keydown(addTab);


    // INTIALIZE
    $(div).addClass('djson-editor');
    this.setText($(textarea).text());
    filterText();
}
