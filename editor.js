//Ajax Call to get randow word of len 4
function RandomWord(elem, stringRand, wordRand) {
    var requestStr = "http://randomword.setgetgo.com/get.php?len=4";
    var tmp = null;
    $.ajax({
        type: "GET",
        url: requestStr,
        dataType: "jsonp",
        success: function (data) {
            tmp = data.Word;
            console.log(wordRand + " : " + tmp);
            $(elem).text(stringRand.replace(wordRand, tmp));
        }
    });
}


$(document).ready(function () {

    var selectedPara = null;
    var selectedText, flagEdit = true;


    $("#arrngeOff").click(function () {
        $("#scrollable").sortable(); //Initialize the UI-Sortable
        $("#scrollable").sortable("enable"); //Enable:required to renable the sorting of pargraphs

        flagEdit = false;

        $(this).css("display", "none");
        $("#arrngeOn").css("display", "block");
    });

    $("#arrngeOn").click(function () {
        $(this).css("display", "none");
        $("#arrngeOff").css("display", "block");

        flagEdit = true;

        $("#scrollable").sortable("disable"); //Disable the sorting functionality
    });

    //summary:To check whether the Title and para have any text if not show palceholders.
    var checkText = function () {
        //As there can be multiple paragraphs, hence each used
        $(".editablePara").each(function () {
            if ($(this).html().length === 0)
                $(this).addClass("placeholder").html("Enter Text.....");
        });
        if ($(".editableTitle").html().length == 0)
            $(".editableTitle").addClass("placeholder").html("Title");
    };

    //to reset to default
    $("body").click(function () {
        checkText();
        $("#tooltip").css("display", "none");
    });

    //Remove the placeholder text when user clicks on title or paragraph.
    $(".editorWrapper").on("click focus", ".editablePara, .editableTitle", function (event) {
        if (!flagEdit) {
            alert("Turn Off the arrangement, then edit!!");
            return false;
        }
        event.stopPropagation();
        $("#tooltip").css("display", "none");
        checkText();
        if ($(this).hasClass("placeholder"))
            $(this).html("").removeClass("placeholder");
    });

    //Detect "Enter/Return" key wusing ACII code i.e. 13 and onPress crating a new paragraph
    $(".editorWrapper").on("keydown", ".editablePara", function (event) {
        $("#tooltip").css("display", "none");
        if (event.which == 13) {
            event.preventDefault();
            var elem = $("<p></p>").text("Enter Text.....").attr("contenteditable", "true").addClass("placeholder editablePara");
            elem = $("<div></div").html(elem);
            $(this).parent("div").after(elem);
        }
    });


    //Summary: To display the tooltip on selection via doble click or using Shift + arrow keys.
    $(".editorWrapper").on("dblclick keyup", ".editablePara, .editableTitle", function (event) {
        selectedText = window.getSelection().toString();
        if (selectedText.length > 0) {
            //first make the tooltip display and set position over the paragraph.
            $("#tooltip").css("display", "block").css("top", $(this).offset().top - 35).css("left", event.clientY - 40);
            //saving the paragraph value for future use in changing the style.
            selectedPara = $(this);
        }
    });

    //To toggle Bold on or off if selected same set of letters, and can apply mutiple styles.
    $("#bold").click(function () {
        if (selectedText && selectedPara) {
            var temp = $("span").filter(function () {
                return $(this).text() === selectedText;
            });
            if (temp.size() > 0) {
                if ($(temp).hasClass("bold")) {
                    $(temp).removeClass("bold");
                    $("#tooltip").css("display", "none");
                    return false;
                }
                $(temp).addClass("bold");
                $("#tooltip").css("display", "none");
                return false;
            }

            var oldPara = $(selectedPara).text();
            var elem = "<span class='bold'>" + selectedText + "</span>";
            $(selectedPara).html(oldPara.replace(selectedText, elem));
        }

        $("#tooltip").css("display", "none");
    });

    //To toggle Underline on or off if selected same set of letters, and can apply mutiple styles.
    $("#underline").click(function () {
        if (selectedText && selectedPara) {
            var temp = $("span").filter(function () {
                return $(this).text() === selectedText;
            });
            if (temp.size() > 0) {
                if ($(temp).hasClass("underline")) {
                    $(temp).removeClass("underline");
                    $("#tooltip").css("display", "none");
                    return false;
                }
                $(temp).addClass("underline");
                $("#tooltip").css("display", "none");
                return false;
            }

            var oldPara = $(selectedPara).text();
            var elem = "<span class='underline'>" + selectedText + "</span>";
            $(selectedPara).html(oldPara.replace(selectedText, elem));
        }
        $("#tooltip").css("display", "none");
    });

    //To toggle Red text on or off if selected same set of letters, and can apply mutiple styles.
    $("#red").click(function () {
        if (selectedText && selectedPara) {
            var temp = $("span").filter(function () {
                return $(this).text() === selectedText;
            });
            if (temp.size() > 0) {
                if ($(temp).hasClass("red")) {
                    $(temp).removeClass("red");
                    $("#tooltip").css("display", "none");
                    return false;
                }
                $(temp).addClass("red");
                $("#tooltip").css("display", "none");
                return false;
            }

            var oldPara = $(selectedPara).text();
            var elem = "<span class='red'>" + selectedText + "</span>";
            $(selectedPara).html(oldPara.replace(selectedText, elem));
        }
        $("#tooltip").css("display", "none");
    });


    //Get the links from User Input on button press.
    $("#done").click(function () {
        $(".editablePara").each(function () {
            var string = $(this).text();
            var mainRegex = /<a.+?a>/g;
            var links;
            while (links = mainRegex.exec(string)) {
                var subStr = links[0];
                var url = "",
                    linkText = "";

                var urlRegex = /(href=".+?"[\s>])/g;
                url = urlRegex.exec(subStr);
                if (url)
                    url = url[0].substr(6, url[0].length - 8);
                else {
                    url = "#";
                }

                var linkTextReg = />.+?<\/a>/g;
                linkText = linkTextReg.exec(subStr);
                //linkText = linkText[0].trim();
                linkText = linkText[0].substr(1, linkText[0].length - 5);

                var anchor = $("<a></a>").attr("href", url).attr("target", "blank").html(linkText).addClass("coverLinks");
                $("#coverLink").append(anchor);
            }
        });
    });


    //Replace 4 letter word with random word
    $("#randomize").click(function () {
        $(".editablePara").each(function () {
            var stringRand = $(this).text();
            var lastIndex = 0;
            var randomWord;
            stringRand = stringRand.substr(lastIndex);

            var sliceWordReg = /\b\w{4}([\s/.,]|$)/g;

            var wordRand;
            while (wordRand = sliceWordReg.exec(stringRand)) {
                if (wordRand[0].substr(-1).match(/\w/))
                    wordRand = wordRand[0];
                else
                    wordRand = wordRand[0].substr(0, wordRand[0].length - 1);

                RandomWord($(this), stringRand, wordRand);
            }
        });
    });
});