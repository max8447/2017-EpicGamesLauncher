String.prototype.format = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

var i18nMessages = {};
var username = "";
var isSignedIn = false;
var codeChecked = false;
var defaultLanguage = "en";

// We should probably move this to it's own file (and shared across all pages with a web-view)
var config = {
    redeemSuccessDelay: 2000,
    supportedLocales: ["en", "fr", "de", "es", "es-MX", "es-ES", "ko", "ja", "zh-CN", "it", "ru", "ar", "pt-BR", "pl"],
    redeemFadeInDelay: 50,
	redeemFadeOutDelay: 300
}

function getQueryParam(paramName)
{
    paramName = paramName.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + paramName + "=([^&#]*)"),
        results = regex.exec(window.location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

var loadI18N = function(lang, callback)
{
    if (typeof(lang) === 'function') {
        // Clean up function parameters.
        callback = lang;
        lang = null;
    }

    callback = callback || function (){};
    var doLoad = true;
    for (var prop in i18nMessages)
    {
        if (i18nMessages.hasOwnProperty(prop))
        {
            doLoad = false;
        }
    }
    
    if (doLoad) {
        if (!lang) {
            lang = getQueryParam("lang");
        }
        console.log("Requested lang: " + lang);
        // based on the languages we support, use the language library to do
        // a fallback on what to use (e.g. if don't support 'es-MX' but we support
        // 'es' and we are requested 'es-ES', then this will return 'es')
        // the function returns an array of strings
        var langArr = preferredLanguages(lang, config.supportedLocales);
        console.log("preferredLanguages: " + langArr);
        // Guarantee an entry by always pushing our default
        langArr.push(defaultLanguage);
        // Select first preferred that we support
        lang = langArr[0];
        // Load from file
        var fileName = "./i18_" + lang + ".json";
        console.log("Messages loading from file " + fileName);
        
        // If we're running locally, load the JSON file from the local filestorage
        $.getJSON(fileName,
            function(json) {
                i18nMessages = json;
                callback();
        })
        .fail(function( jqxhr, textStatus, error ) {
            console.log( "error: " + error );
            if (lang !== defaultLanguage) {
                console.log("Falling back to default language: " + defaultLanguage);
                loadI18N(defaultLanguage, callback);
            }
        })
    }
}

function checkCodeLength(event) {
    var element = document.getElementById("redeemCodeInputId");
    var code = element.value;

    // If we already have 20 characters and they are trying to insert a valid character
    // don't allow it
    var code = code.replace(/[^a-zA-Z0-9]*/g, "");

    var keycode = event.keyCode;
    var isValidChar = (keycode > 47 && keycode < 58) || (keycode > 64 && keycode < 91) || (keycode > 95 && keycode < 112);

    if (code.length >= 20 && isValidChar) {
        event.preventDefault();
        return false;
    }

    return true;
}

function formatCode(event) {
    event = event || {};
	
	if (event.type == "keydown" && event.keyCode != 8) {
		return;
	}
	
    //console.log(event);
    //console.log("key pressed: " + JSON.stringify(event));
    var element = document.getElementById("redeemCodeInputId");
    var code = element.value;
    
    var startLength = code.length;
    var cursorPosition = element.selectionStart;
    var endPosition = element.selectionEnd;
        
    // If the user just pressed the arrow keys, do nothing
    if (event.keyCode >= 37 && event.keyCode <= 40) {
        return;
    }

    if (code) {		
        // To make parsing easier, remove all invalid characters. Just take a-z,A-Z,0-9
        code = code.replace(/[^a-zA-Z0-9]*/g, "");

        if (code.length > 20) {
            code = code.substring(0, 20);
        }

        var formattedCode = "";
        var index = 0;
        for(var i=0; i <code.length; i++) {
            if (i != 0 && i % 5 == 0) {
                formattedCode += '-';
            }

            formattedCode += code[i];
        }
		
        if (event.keyCode != 8) {
            if (formattedCode.length == 5 || formattedCode.length == 11 || formattedCode.length == 17) {
                formattedCode += "-";
            }
        }
		
        // Quality-of-life code to make the cursor in the right position
        if (cursorPosition == 5 || cursorPosition == 6 || 
                cursorPosition == 11 || cursorPosition == 12 || 
                cursorPosition == 17 || cursorPosition == 18) {
            
            if (cursorPosition == endPosition && startLength < formattedCode.length) {
                cursorPosition += 1;                
                endPosition = cursorPosition;
            }
        }
    
        element.value = formattedCode;
        
        element.setSelectionRange(cursorPosition, endPosition);
        
        if (element.value !== "") {
            $(element).addClass('filled');
        } else {
            $(element).removeClass('filled');
        }
        
        if (code.length == 20) {
            if (!codeChecked) {
                $('#redeemDiv').addClass('loading');
                codeChecked = true;
                setRedemptionButton(true);
                if (window.ue) {
                    // if the user is signed in, it will redeem, otherwise it will just lock

                    window.ue.coderedemption.evaluatecode(code.toUpperCase());
                    //window.ue.coderedemption.redeemcode(code);
                }
                else {
                    codeRedemptionCallback({},{responsetype: "evaluate"});
                }
            }
        } else {
            productClear();
        }
    } else {        
        productClear();
    }
    
}

// TODO: Replace this with a proper way of loading i18 messages
function getI18Message(messageCode) {    
    var message = i18nMessages[messageCode] === undefined ? messageCode : i18nMessages[messageCode];

    return message;
}

function updateStrings() {
    // Find all tags with the attribute "data-loc-code" and replace their contents
    // with a localized one
    var language = getQueryParam('lang');
    $("html").addClass(language)
            
    $("[data-loc-code]").each(function() {
        var locVal = getI18Message($(this).attr("data-loc-code"));
        if (locVal) {
            $(this).html(locVal);
            console.log(locVal); 
        }
    });
}

function prefillCode() {    
    var code = getQueryParam('code');
    
    if (code) {        
        var element = document.getElementById("redeemCodeInputId");
        element.value = code;
        formatCode();
    }
}

function closeRedemption() {
    console.log("closing redemption");
        
    $('#redeem-modal').fadeOut(config.redeemFadeOutDelay, function() {    
        if (window.ue) {
            window.ue.coderedemption.close();
            
            // TODO: Remove this once the launcher handles "close" all by itself. Using this for testing 
            if (isSignedIn) {
                window.close();
            } else {
                window.ue.coderedemption.gotosignin();
            }
            // END TODO
        }
    });
}

function setRedemptionButton(enable) {
    var $redeemBtn = $('.action-redeem');
    
    if (enable) {     
        $redeemBtn.prop("disabled", false).addClass('active');   
    } else {
        $redeemBtn.prop("disabled", true).removeClass('active');   
    }
}

function productClear() {
    var $redeemBox = $('.redeem-code-box');
    var $redeemStatus = $('.redeem-status');
    var $epicLogo = $('.epic-logo');
    var $productImg = $('.product-image');
    var $redeemBtn = $('.action-redeem');

    $redeemBox.removeClass('error');
    $redeemBox.removeClass('success');
    $redeemBox.removeClass('loading');
    $redeemBox.removeClass('nonredemptionError');
    
    $redeemBtn.removeClass("loading");
    
    $redeemStatus.html(getI18Message("messages.com.epicgames.launcher.codeRedemption.statusContent"));
    $epicLogo.show();
    $productImg.hide();
    setRedemptionButton(false);
    
    codeChecked = false;
}

function updateDefaultSkin(product) {
    var $epicLogo = $('.epic-logo');
    var $welcomeMessage = $('#welcomeMessage');

    if(product.imageurl){
        $epicLogo.attr('src', "");
        $epicLogo.attr('src', product.imageurl).show();
    }

    if(product.description){
        var newMessage = getI18Message(product.description);
        $welcomeMessage.html(newMessage);
    }
}

function productSuccess(product) {
    var $redeemStatus = $('#redeemStatus');
    var $redeemBox = $('#redeemDiv');
    var $epicLogo = $('.epic-logo');
    var $productImg = $('.product-image');
    var $redeemBtn = $('.action-redeem');
        
    if (product.valid) {
        $redeemBox.addClass('success');
        $redeemBox.removeClass('error');
        
        product.message = getI18Message("messages.com.epicgames.launcher.codeRedemption.validCode");
    } else {
        if (!product.message || product.message === "") {
            product.message = getI18Message("messages.com.epicgames.launcher.codeRedemption.unknownError");
        }
        
        if (!product.isredemptionerror) {
            $redeemBox.addClass('nonredemptionError');
            $redeemBox.removeClass('error');
            $redeemBox.removeClass('success');
            //setRedemptionButton(false);
        } else {
            $redeemBox.removeClass('nonredemptionError');            
            $redeemBox.addClass('error');
            $redeemBox.removeClass('success');
            //setRedemptionButton(false);
        }
    }
    
    var statusMessage = getI18Message(product.message);
    
    var buttonValue = isSignedIn ? getI18Message("messages.com.epicgames.launcher.redeem") : getI18Message("messages.com.epicgames.launcher.continue");
    
    $redeemBtn.html(buttonValue);
    $redeemBtn.removeClass("loading");
        
    $redeemStatus.html(statusMessage.format(product.name, buttonValue, username));
        
    if (!product.imageurl || product.imageurl === "") {
        $productImg.hide();        
        $epicLogo.show();
    } else {
        $epicLogo.hide();
        $productImg.attr('src', "");
        $productImg.attr('src', product.imageurl).show();
    }
}

function codeRedemptionCallback(product, responsetype) {
    console.log(`Product ${JSON.stringify(product)}`);
    console.log(`ResponseType ${JSON.stringify(responsetype)}`);
    
    $('#redeemDiv').removeClass('loading');
    
    switch(responsetype) {
        case "redeem":
            // If redeem succeeded, we're done. If not, we want to display whatever error occurred
            if (product.valid) {
                productSuccess(product);
                showRedeemComplete();
            } else {
                productSuccess(product);
            }
            break;
        case "welcomeskin":
            updateDefaultSkin(product);
            break;
        case "lock":
            var $continueBtn = $('#continueButton');
            $continueBtn.unbind( "click" );
            if(product.valid) {
                $continueBtn.click(function(){
                    continueToAccount();
                })
            }
            else {
                $continueBtn.click(function(){
                    setRedemptionButton(false);
                    var element = document.getElementById("redeemCodeInputId");
                    var code = element.value;
                    code = code.replace(/[^a-zA-Z0-9]*/g, "");

                    window.ue.coderedemption.evaluatecode(code.toUpperCase());
                    setRedemptionButton(true);
                });
            }
        case "evaluate":
            productSuccess(product)
            break;
        default:
            // Do nothing on an ussorported or empty responseType
        break;
    }
}

function redeemCode() {
    setRedemptionButton(false);
    
    if (window.ue) {
        var $redeemBtn = $("#redeemButton");
        $redeemBtn.addClass("loading");
        
        var element = document.getElementById("redeemCodeInputId");
        var code = element.value;
        
        code = code.replace(/[^a-zA-Z0-9]*/g, "");
        
        $redeemBtn.html("&nbsp")
        window.ue.coderedemption.redeemcode(code);
        setRedemptionButton(true);
    }
}

function continueToAccount() {
    $('.before-redeem').hide();
    $('.after-redeem').show();
    
}

function showRedeemComplete() {
    //var $redeemStatus = $('.redeem-status');
    setRedemptionButton(false);
    var $redeemBox = $('.redeem-code-box');
    var $redeemBtn = $('#redeemButton');
    
    //$redeemStatus.html(getI18Message("messages.com.epicgames.launcher.codeRedemption.redeemSuccess"));
    $redeemBox.addClass('redeemSuccess');
    $redeemBtn.html(getI18Message("messages.com.epicgames.launcher.redeemed"));
    $redeemBtn.removeClass("loading");
    
    // Let's display the success for 1.5 seconds and then close the redemption screen
    setTimeout(function() {
      closeRedemption();  
    }, config.redeemSuccessDelay)
}

$(document).ready(function () {
    // Before we do anything, we need to load the localized strings. Most machines would load this almost instantly. However
    // if the CPU is busy of the I/O is slow, the "flash" could be noticeable. Let's hide everything until we've completed
    // loading and it's ready    
    var $overlay = $('#redeem-modal');
    $overlay.hide();
    
    loadI18N(function() {
        
        var $redeemInput = $('.redeem-code');
        var $redeemBtn = $('#redeemButton');
        var $continueBtn = $('#continueButton');
        var $signinBtn = $('.action-signin');
        var $registerBtn = $('.action-create');
        var $redeemStatus = $('.redeem-status');
        var $redeemBox = $('.redeem-code-box');
        var $productImg = $('.product-image');
        var $epicLogo = $('.epic-logo');
        var $closeBtn = $('.close-btn, .action-cancel');

        $redeemInput.bind('input keydown', function(e){
            formatCode(e);
        })
        
        $redeemBtn.click(function(){
            redeemCode();
        });
        
        $signinBtn.click(function(){
            if (window.ue) {
                ue.coderedemption.gotosignin();
            }
        });
        
        $registerBtn.click(function(){
            if (window.ue) {
                ue.coderedemption.gotocreateaccount();
            }
        });

        //close action
        $closeBtn.click(function(){
            closeRedemption();
        });

        updateStrings();

        if (!window.ue) {
            document.body.style.backgroundColor = "black";
        }
        else {
            // disable right click context menu
            window.addEventListener("contextmenu",
                function (e) {
                    e.preventDefault()
                    return false;
                });

            var postJsBridgeInit = function () {
                if (window.ue.coderedemption) {
                    // Register code redemption callback
                    window.ue.coderedemption.registerresponsecallback(codeRedemptionCallback);
                    // now that all strings are loaded, we want to check the login status before updating any UI
                    window.ue.coderedemption.isusersignedin().then(signedIn => {
                        $("body").addClass(signedIn ? "online" : "offline");

                        var bootstrap = function () {
                            prefillCode();
                            // we're ready to go
                            $overlay.fadeIn(config.redeemFadeInDelay);
                        }

                        isSignedIn = signedIn;
                        if (signedIn) {
                            $("#redeemButton").show();
                            $("#continueButton").hide();

                            window.ue.common.getsignedinuser().then(userObject => {
                                username = userObject.displayname;
                                bootstrap();
                            });
                        } else {
                            $("#redeemButton").hide();
                            $("#continueButton").show();
                            bootstrap();
                        }
                    });
                }
                else {
                    setTimeout(postJsBridgeInit, 50);
                }
            };
            postJsBridgeInit();
        }
    });
});
