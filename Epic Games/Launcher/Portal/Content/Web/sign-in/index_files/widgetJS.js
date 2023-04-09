
var com = com || {};
window.console = window.console || {log: function() {}};
com.epicgames = com.epicgames || {};
com.epicgames.account = com.epicgames.account || {};
com.epicgames.account.web = com.epicgames.account.web || {};
com.epicgames.account.web.URLS = com.epicgames.account.web.URLS || {};
com.epicgames.account.web.URLS.base = "https://accounts.epicgames-ci.ol.epicgames.net";
com.epicgames.account.web.URLS.authorize = "https://accounts.epicgames-ci.ol.epicgames.net/authorize/index";
com.epicgames.account.web.URLS.doAuthorize = "https://accounts.epicgames-ci.ol.epicgames.net/authorize/doAuthorize";
com.epicgames.account.web.URLS.doLogin = "https://accounts.epicgames-ci.ol.epicgames.net/login/doLogin";
com.epicgames.account.web.URLS.loginLauncher = "https://accounts.epicgames-ci.ol.epicgames.net/login/launcher";
com.epicgames.account.web.URLS.registerLauncher = "https://accounts.epicgames-ci.ol.epicgames.net/register/launcher";
com.epicgames.account.web.URLS.doRegister = "https://accounts.epicgames-ci.ol.epicgames.net/register/doRegister";
com.epicgames.account.web.URLS.doHeadless = "https://accounts.epicgames-ci.ol.epicgames.net/headless/doHeadless";
com.epicgames.account.web.URLS.loginPsn = "https://accounts.epicgames-ci.ol.epicgames.net/login/psn";
com.epicgames.account.web.URLS.showSdn = "https://accounts.epicgames-ci.ol.epicgames.net/sdnCheck/showSdn";
com.epicgames.account.web.URLS.requestPasswordReset = "https://accounts.epicgames-ci.ol.epicgames.net/requestPasswordReset/index";
com.epicgames.account.web.URLS.doRequestPasswordReset = "https://accounts.epicgames-ci.ol.epicgames.net/requestPasswordReset/doRequestReset";
com.epicgames.account.web.URLS.doDisplayNameChange = "https://accounts.epicgames-ci.ol.epicgames.net/displayNameChange/doDisplayNameChange";
com.epicgames.account.web.URLS.doLogout = "https://accounts.epicgames-ci.ol.epicgames.net/logout/doLogout";
com.epicgames.account.web.URLS.logout = "https://accounts.epicgames-ci.ol.epicgames.net/logout/index";
com.epicgames.account.web.URLS.doEdit = "https://accounts.epicgames-ci.ol.epicgames.net/edit/doEdit";
com.epicgames.account.web.URLS.edit = "https://accounts.epicgames-ci.ol.epicgames.net/edit/index";
com.epicgames.account.web.URLS.logoutDialogContents = "https://accounts.epicgames-ci.ol.epicgames.net/logout/logoutDialogContents";
com.epicgames.account.web.URLS.widgetJS = "./index_files/accountportalwidgets-680d18b19d55b4f632fee9334039a5a7.js";
com.epicgames.account.web.URLS.widgetCSS = "./index_files/accountportalwidgets-29af5daadeaccad5fb47f64b04c8fab8.css";
com.epicgames.account.web.URLS.i18nMessagesJSON = "https://accounts.epicgames-ci.ol.epicgames.net/i18njs";
com.epicgames.account.web.URLS.doRedirectWithErrorUrl = "https://accounts.epicgames-ci.ol.epicgames.net/error/doRedirectWithError";
com.epicgames.account.web.URLS.linkPsn = "https://accounts.epicgames-ci.ol.epicgames.net/linkPsn/index";
com.epicgames.account.web.URLS.doLinkPsn = "https://accounts.epicgames-ci.ol.epicgames.net/linkPsn/doLinkPsn";
com.epicgames.account.web.URLS.doShowPsnLink = "https://accounts.epicgames-ci.ol.epicgames.net/linkPsn/doShow";
com.epicgames.account.web.URLS.doLinkPsnConfirm = "https://accounts.epicgames-ci.ol.epicgames.net/linkPsn/doConfirm";
com.epicgames.account.web.URLS.twitchAlreadyLinked = "https://accounts.epicgames-ci.ol.epicgames.net/linkTwitch/alreadyLinked";
com.epicgames.account.web.URLS.doLinkTwitch = "https://accounts.epicgames-ci.ol.epicgames.net/linkTwitch/doLinkTwitch";
com.epicgames.account.web.URLS.doLinkYouTube = "https://accounts.epicgames-ci.ol.epicgames.net/linkYouTube/doLinkYouTube";
com.epicgames.account.web.URLS.doLinkMsId = "https://accounts.epicgames-ci.ol.epicgames.net/linkMsId/doLinkMsId";
com.epicgames.account.web.URLS.msIdAlreadyLinked = "https://accounts.epicgames-ci.ol.epicgames.net/linkMsId/alreadyLinked";
com.epicgames.account.web.URLS.facebookLogin = "https://accounts.epicgames-ci.ol.epicgames.net/login/facebook";
com.epicgames.account.web.URLS.googleLogin = "https://accounts.epicgames-ci.ol.epicgames.net/login/google";
com.epicgames.account.web.URLS.externalLogin = "https://accounts.epicgames-ci.ol.epicgames.net/login/external";
com.epicgames.account.web.URLS.doExternalLogin = "https://accounts.epicgames-ci.ol.epicgames.net/login/doExternal";
com.epicgames.account.web.URLS.checkExternalLoginStatus = "https://accounts.epicgames-ci.ol.epicgames.net/login/externalLoginStatus";
com.epicgames.account.web.URLS.noXboxAccount = "https://accounts.epicgames-ci.ol.epicgames.net/linkMsId/noXboxAccount";
com.epicgames.account.web.loaded = false;
com.epicgames.account.web.runLocal = true;
com.epicgames.account.web.useHooks = window.ue && window.ue.signinprompt;

com.epicgames.account.web.load = function(callback)
{
    callback = callback || function (){};

    if (!com.epicgames.account.web.loaded)
    {
        console.log("Loading widget js");
        com.epicgames.account.web.loaded = true;
        // load the css
        var dynamicCSS = document.createElement("link");
        dynamicCSS.rel = "stylesheet";
        dynamicCSS.type = "text/css";
        dynamicCSS.href = com.epicgames.account.web.URLS.widgetCSS;

        document.getElementsByTagName('head')[0].appendChild(dynamicCSS);


        // load the JS
        var dynamicJS = document.createElement("script");
        dynamicJS.src = com.epicgames.account.web.URLS.widgetJS;

            function loaded() {

                if (dynamicJS.readyState === undefined)
                {
                    console.log("Loaded, running callback");
                    callback();
                }
                else if (dynamicJS.readyState === 'loaded' || dynamicJS.readyState === 'complete') {
                    console.log("Loaded, running callback");
                    dynamicJS.onreadystatechange = null;
                    callback();
                }
            };


        if (dynamicJS.addEventListener) {
          dynamicJS.addEventListener("load", loaded, false);
        }
        else if (dynamicJS.readyState) {
          dynamicJS.onreadystatechange = loaded;
        }

        document.getElementsByTagName('body')[0].appendChild(dynamicJS);
    }
    else
    {
        console.log("Already loaded, running callback");
        callback();
    }
}

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
};