
// 1. Set parameters of package installation
const APP_DISPLAY_NAME = "Allow HTML Temp";
const APP_NAME = "allowhtmltemp";
const APP_VERSION = "2.0.1";

const supported_locales = ["en-US", "cs-CZ", "da-DK", "de-AT", "el-GR", "es-ES", "fr-FR", "hr-HR", "it-IT", "nl-NL", "pl-PL", "pt-BR", "ru-RU", "sk-SK", "zh-CN", "zh-TW"];

const APP_PACKAGE = "/" + APP_NAME;
const APP_JAR_FILE = APP_NAME + ".jar";
const APP_SKIN_JAR_FILE = APP_NAME + ".jar";
const APP_SKIN_MOZ_JAR_FILE = APP_NAME + "-moz.jar";
const APP_CONTENT_FOLDER = "content/allowhtmltemp/";
const APP_LOCALE_FOLDER1 = "locale/";
const APP_SKIN_CLASSIC_FOLDER = "skin/classic/allowhtmltemp/";
const APP_SKIN_MODERN_FOLDER = "skin/modern/allowhtmltemp/";


const INST_TO_PROFILE = "Möchten Sie "+APP_DISPLAY_NAME+" in Ihr Profil installieren?\nDies bedeutet, dass nach einem Programm-Update keine Neuinstallation notwendig ist.\n\n[ OK ] für das Profil-Verzeichnis\n[ Abbrechen ] für das Programm-Verzeichnis";


// 2. Initialise package
initInstall(APP_NAME, APP_PACKAGE, APP_VERSION);

// Get package directories
// profile installs only work since 2003-03-06
var instToProfile = false;
var instToProfile = ((buildID>2003030600 || buildID==0000000000) && confirm(INST_TO_PROFILE));
var chromef = instToProfile ? getFolder("Profile", "chrome") : getFolder("chrome");
setPackageFolder(chromef);

var isTbird = false;

// 3. Flag files/folders to be added
addFile("", "chrome/" + APP_JAR_FILE, chromef, "");
addFile("", "chrome/" + APP_SKIN_MOZ_JAR_FILE, chromef, "");

err = getLastError();

if (err == SUCCESS) {

  // 4. Register chrome (this is what contents.rdf is used for)
  if(instToProfile) {
    registerChrome(CONTENT | PROFILE_CHROME, getFolder(chromef, APP_JAR_FILE), APP_CONTENT_FOLDER);
    for (var s in supported_locales) {
      registerChrome(LOCALE | PROFILE_CHROME, getFolder(chromef, APP_JAR_FILE), APP_LOCALE_FOLDER1 + supported_locales[s] + "/allowhtmltemp/");
    }
    registerChrome(SKIN | PROFILE_CHROME, getFolder(chromef, APP_SKIN_MOZ_JAR_FILE), APP_SKIN_CLASSIC_FOLDER);
    registerChrome(SKIN | PROFILE_CHROME, getFolder(chromef, APP_SKIN_MOZ_JAR_FILE), APP_SKIN_MODERN_FOLDER);
  } else {
    registerChrome(CONTENT | DELAYED_CHROME, getFolder(chromef, APP_JAR_FILE), APP_CONTENT_FOLDER);
    for (var s in supported_locales) {
      registerChrome(LOCALE | DELAYED_CHROME, getFolder(chromef, APP_JAR_FILE), APP_LOCALE_FOLDER1 + supported_locales[s] + "/allowhtmltemp/");
    }
    registerChrome(SKIN | DELAYED_CHROME, getFolder(chromef, APP_SKIN_MOZ_JAR_FILE), APP_SKIN_CLASSIC_FOLDER);
    registerChrome(SKIN | DELAYED_CHROME, getFolder(chromef, APP_SKIN_MOZ_JAR_FILE), APP_SKIN_MODERN_FOLDER);
  }

  // 5. Perform the installation
  err = performInstall();

  // 6. Report on success or otherwise  
  if(err == SUCCESS || err == 999) {
    refreshPlugins();
    alert(APP_DISPLAY_NAME+" "+APP_VERSION+" wurde erfolgreich installiert!\nBitte starten Sie das Programm jetzt neu.");
  } else {
    alert("Die Installation der Erweiterung ist fehlgeschlagen.\nDer Fehlercode lautet: " + err);
    cancelInstall(err);
  }
} else {
  alert("Die Erweiterung konnte nicht installiert werden.\n"
       +"Eventuell haben Sie keine ausreichenden Zugriffsrechte\n"
       +"auf das Profil- oder Programm-Verzeichnis.\n"
       +"\nDer Fehlercode lautet:" + err);
  cancelInstall(err);
}

// OS type detection
// which platform?
function getPlatform() {
  var platformStr;
  var platformNode;

  if('platform' in Install) {
    platformStr = new String(Install.platform);

    if (!platformStr.search(/^Macintosh/))
      platformNode = 'mac';
    else if (!platformStr.search(/^Win/))
      platformNode = 'win';
    else
      platformNode = 'unix';
  } else {
    var fOSMac  = getFolder("Mac System");
    var fOSWin  = getFolder("Win System");

    logComment("fOSMac: "  + fOSMac);
    logComment("fOSWin: "  + fOSWin);

    if(fOSMac != null)
      platformNode = 'mac';
    else if(fOSWin != null)
      platformNode = 'win';
    else
      platformNode = 'unix';
  }

  return platformNode;
} 
