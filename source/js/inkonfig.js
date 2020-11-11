window.onload = function () {
    if (window.jQuery) {
        chocolateyCheckboxUpdate();
        document.querySelector("#wizard").style.display = "block";
        document.querySelector(".loading").style.display = "none";
    }
};

function chocolateyCheckboxUpdate() {
    if (document.querySelector("#installSoftware").checked == true) {
        document.querySelector("#softwareSelection").style.display = "block";
    } else {
        document.querySelector("#softwareSelection").style.display = "none";
    }
}

$("input.no-spaces").on({
    keydown: function (e) {
        if (e.which === 32)
            return false;
    },
    change: function () {
        this.value = this.value.replace(/\s/g, "");
    }
});

function generateScript() {
    var scriptContent = `@echo off

setlocal EnableDelayedExpansion

NET FILE 1>NUL 2>NUL
if '%errorlevel%' == '0' ( goto continue ) else ( goto getPrivileges ) 

:getPrivileges
if '%1'=='ELEV' ( goto continue )

set "batchPath=%~f0"
set "batchArgs=ELEV"

set "script=%0"
set script=%script:"=%
IF '%0'=='!script!' ( GOTO PathQuotesDone )
    set "batchPath=""%batchPath%"""
:PathQuotesDone

:ArgLoop
IF '%1'=='' ( GOTO EndArgLoop ) else ( GOTO AddArg )
    :AddArg
    set "arg=%1"
    set arg=%arg:"=%
    IF '%1'=='!arg!' ( GOTO NoQuotes )
        set "batchArgs=%batchArgs% "%1""
        GOTO QuotesDone
        :NoQuotes
        set "batchArgs=%batchArgs% %1"
    :QuotesDone
    shift
    GOTO ArgLoop
:EndArgLoop

ECHO Set UAC = CreateObject^("Shell.Application"^) > "%temp%\\OEgetPrivileges.vbs"
ECHO UAC.ShellExecute "cmd", "/c ""!batchPath! !batchArgs!""", "", "runas", 1 >> "%temp%\\OEgetPrivileges.vbs"
"%temp%\\OEgetPrivileges.vbs" 
exit /B

:continue
IF '%1'=='ELEV' ( shift /1 )
cd /d %~dp0

title Inkonfig Configuration Script
echo.
echo  ___                        __ _       
echo ^|_ _^|_ __   ___ ___  _ __  / _(_) __ _ 
echo  ^| ^|^| '_ \\ / __/ _ \\^| '_ \\^| ^|_^| ^|/ _\` ^|
echo  ^| ^|^| ^| ^| ^| (_^| (_) ^| ^| ^| ^|  _^| ^| (_^| ^|
echo ^|___^|_^| ^|_^|\\___\\___/^|_^| ^|_^|_^| ^|_^|\\__, ^|
echo             Configuration Script ^|___/     
echo.
echo Generated by Inkonfig Wizard ver. ${InkonfigVersion}
echo.
echo Press any key to start the script... 
pause>nul
echo.
echo Configuring your settings, please wait...`;

    if (document.getElementById("pcName").value) {
        var pcname = document.getElementById("pcName").value
        scriptContent += `\nREM New PC Name`;
        scriptContent += `\nWMIC computersystem where caption="%computername%" rename "${pcname}"`;
    }

    if (document.getElementById("tempPaths").value) {
        scriptContent += `\nREM New Temp Paths`;
        var tempPaths = document.getElementById("tempPaths").value
        scriptContent += `\nIF NOT EXIST "${tempPaths}" ( mkdir ${tempPaths} )`;
        scriptContent += `\nsetx /m TEMP ${tempPaths}`;
        scriptContent += `\nsetx /m TMP ${tempPaths}`;
        scriptContent += `\nsetx TEMP ${tempPaths}`;
        scriptContent += `\nsetx TMP ${tempPaths}`;
    }

    if (document.getElementById("showFileExt").value == "true") {
        scriptContent += `\nREM Show file extensions`;
        scriptContent += `\nREG add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v HideFileExt /t REG_DWORD /d 0 /f`;
    } else if (document.getElementById("showFileExt").value == "false") {
        scriptContent += `\nREM Hide file extensions (system default)`;
        scriptContent += `\nREG add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v HideFileExt /t REG_DWORD /d 1 /f`;
    }

    if (document.getElementById("enableHibernation").value == "true") {
        scriptContent += `\nREM Enabled Hibernation`;
        scriptContent += `\npowercfg -H ON`;
    } else if (document.getElementById("enableHibernation").value == "false") {
        scriptContent += `\nREM Disabled Hibernation (system default)`;
        scriptContent += `\npowercfg -H OFF`;
    }

    if (document.getElementById("secondsInTaskbarClock").value == "true") {
        scriptContent += `\nREM Show seconds in taskbar clock`;
        scriptContent += `\nREG add "HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "ShowSecondsInSystemClock" /t REG_DWORD /d "1" /f`;
    } else if (document.getElementById("secondsInTaskbarClock").value == "false") {
        scriptContent += `\nREM Hide seconds in taskbar clock (system default)`;
        scriptContent += `\nREG add "HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "ShowSecondsInSystemClock" /t REG_DWORD /d "0" /f`;
    }

    if (document.getElementById("disableAds").value == "true") {
        scriptContent += `\nREM Ads Disabled`;
        scriptContent += `\nREG add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SilentInstalledAppsEnabled" /t REG_DWORD /d "0" /f`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SystemPaneSuggestionsEnabled" /t REG_DWORD /d "0" /f`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "ShowSyncProviderNotifications" /t REG_DWORD /d "0" /f`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SoftLandingEnabled" /t REG_DWORD /d "0" /f`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "RotatingLockScreenEnabled" /t REG_DWORD /d "0" /f`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "RotatingLockScreenOverlayEnabled" /t REG_DWORD /d "0" /f`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SubscribedContent-310093Enabled" /t REG_DWORD /d "0" /f`;
    } else if (document.getElementById("disableAds").value == "false") {
        scriptContent += `\nREM Ads Enabled (system default)`;
        scriptContent += `\nREG add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SilentInstalledAppsEnabled" /t REG_DWORD /d "1" /f`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SystemPaneSuggestionsEnabled" /t REG_DWORD /d "1" /f`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "ShowSyncProviderNotifications" /t REG_DWORD /d "1" /f`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SoftLandingEnabled" /t REG_DWORD /d "1" /f`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "RotatingLockScreenEnabled" /t REG_DWORD /d "1" /f`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "RotatingLockScreenOverlayEnabled" /t REG_DWORD /d "1" /f`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SubscribedContent-310093Enabled" /t REG_DWORD /d "1" /f`;
    }

    if (document.getElementById("ctrlAltDel").value == "true") {
        scriptContent += `\nREM Enable CTRL + ALT + DEL log in requirement`;
        scriptContent += `\nREG add "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon" /v "DisableCAD" /t REG_DWORD /d "0" /f`;
    } else if (document.getElementById("ctrlAltDel").value == "false") {
        scriptContent += `\nREM Disable CTRL + ALT + DEL log in requirement (system default)`;
        scriptContent += `\nREG add "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon" /v "DisableCAD " /t REG_DWORD /d "1" /f`;
    }

    if (document.getElementById("verboseLogonStatus").value == "true") {
        scriptContent += `\nREM Enable verbose logon messages`;
        scriptContent += `\nREG add "HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" /v "VerboseStatus" /t REG_DWORD /d "1" /f`;
    } else if (document.getElementById("verboseLogonStatus").value == "false") {
        scriptContent += `\nREM Disable verbose logon messages (system default)`;
        scriptContent += `\nREG add "HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" /v "VerboseStatus" /t REG_DWORD /d "0" /f`;
    }

    if (document.getElementById("launchExplorerTo").value == "thispc") {
        scriptContent += `\nREM Launch windows explorer to This PC`;
        scriptContent += `\nREG add "HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "LaunchTo" /t REG_DWORD /d "1" /f`;
    } else if (document.getElementById("launchExplorerTo").value == "quickaccess") {
        scriptContent += `\nREM Launch windows explorer to Quick Access (system default)`;
        scriptContent += `\nREG add "HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "LaunchTo" /t REG_DWORD /d "2" /f`;
    }

    if (document.getElementById("shutdownEventTracker").value == "true") {
        scriptContent += `\nREM Enable shutdown event tracker`;
        scriptContent += `\nREG add "HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Reliability" /v "ShutdownReasonOn" /t REG_DWORD /d "1" /f`;
        scriptContent += `\nREG add "HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Reliability" /v "ShutdownReasonUI" /t REG_DWORD /d "1" /f`;
    } else if (document.getElementById("shutdownEventTracker").value == "false") {
        scriptContent += `\nREM Disable shutdown event tracker`;
        scriptContent += `\nREG add "HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Reliability" /v "ShutdownReasonOn" /t REG_DWORD /d "0" /f`;
        scriptContent += `\nREG add "HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Reliability" /v "ShutdownReasonUI" /t REG_DWORD /d "0" /f`;
    }

    if (document.getElementById("openWithNotepadFCM").value == "true") {
        scriptContent += `\nREM Show Open with Notepad in File Context Menu`;
        scriptContent += `\nREG add "HKCR\\*\\shell\\Open with Notepad\\command" /ve /t REG_SZ /d "notepad.exe %%1" /f`;
    } else if (document.getElementById("openWithNotepadFCM").value == "false") {
        scriptContent += `\nREM Hide Open with Notepad from the File Context Menu`;
        scriptContent += `\nREG delete "HKCR\\*\\shell\\Open with Notepad" /f`;
    }

    if (document.getElementById("shellDocuments").value) {
        var shellDocuments = document.getElementById("shellDocuments").value
        scriptContent += `\nREM Change Location for Documents`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders" /v "{F42EE2D3-909F-4907-8871-4C22FC0BF756}" /t REG_EXPAND_SZ /d "${shellDocuments}" /f`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders" /v "Personal" /t REG_EXPAND_SZ /d "${shellDocuments}" /f`;
    }

    if (document.getElementById("shellPictures").value) {
        var shellPictures = document.getElementById("shellPictures").value
        scriptContent += `\nREM Change Location for Pictures`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders" /v "{0DDD015D-B06C-45D5-8C4C-F59713854639}" /t REG_EXPAND_SZ /d "${shellPictures}" /f`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders" /v "My Pictures /t REG_EXPAND_SZ /d "${shellPictures}" /f`;
    } 

    if (document.getElementById("shellVideos").value) {
        var shellVideos = document.getElementById("shellVideos").value
        scriptContent += `\nREM Change Location for Videos`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders" /v "{35286A68-3C57-41A1-BBB1-0EAE73D76C95}" /t REG_EXPAND_SZ /d "${shellVideos}" /f`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders" /v "My Video" /t REG_EXPAND_SZ /d "${shellVideos}" /f`;
    } 

    if (document.getElementById("shellMusic").value) {
        var shellMusic = document.getElementById("shellMusic").value
        scriptContent += `\nREM Change Location for Videos`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders" /v "{A0C69A99-21C8-4671-8703-7934162FCF1D}" /t REG_EXPAND_SZ /d "${shellMusic}" /f`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders" /v "My Music" /t REG_EXPAND_SZ /d "${shellMusic}" /f`;
    } 

    if (document.getElementById("shellDesktop").value) {
        var shellDesktop = document.getElementById("shellDesktop").value
        scriptContent += `\nREM Change Location for Desktop`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders" /v "Desktop" /t REG_EXPAND_SZ /d "${shellDesktop}" /f`;
    } 

    if (document.getElementById("shellDownload").value) {
        var shellDownload = document.getElementById("shellDownload").value
        scriptContent += `\nREM Change Location for Downloads`;
        scriptContent += `\nREG add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders" /v "{7D83EE9B-2244-4E70-B1F5-5393042AF1E4}" /t REG_EXPAND_SZ /d "${shellDownload}" /f`;
    } 

    if (document.getElementById("installSoftware").checked == true) {
        if (document.getElementById("dontInstallChocolatey").checked == false) {
            scriptContent += `\n@"%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\\chocolatey\\bin"`;
        }
        if (document.getElementById("additionalPackages").value) {
            var additionalPackages = document.getElementById("additionalPackages").value;
            scriptContent += `\nchoco install ${additionalPackages} --y`;
        }
    }

    if (document.getElementById("enableWSL").checked == true) {
        scriptContent += `\nREM Enable Windows Subsystem for Linux`;
        scriptContent += `\n@"%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux`
    }

    if (document.getElementById("enableVMP").checked == true) {
        scriptContent += `\nREM Enable Virtual Machine Platform`;
        scriptContent += `\ndism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`
    }

    if (document.getElementById("restartPC").checked == true) {
        scriptContent += `\necho Your configuration has been applied`
        scriptContent += `\necho Press any key to restart your computer.`
        scriptContent += `\npause>nul`
        scriptContent += `\nshutdown /r /t 5`
    } else {
        scriptContent += `\necho Your configuration has been applied`
        scriptContent += `\necho Press any key to exit.`
        scriptContent += `\npause>nul`
    }

    if (document.getElementById("scriptName").value) {
        var scriptName = document.getElementById("scriptName").value;
    } else {
        var scriptName = "InkonfigScript"
    }

    download(scriptContent, `${scriptName}.bat`, "text/bat");
}

function download(data, filename, type) {
    var file = new Blob([data], {
        type: type
    });
    if (window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(file, filename);
    else {
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

var inkonfigMenu = $("#inkonfig-menu"),
    inkonfigMenuHeight = inkonfigMenu.outerHeight() + 15,
    menuItems = inkonfigMenu.find("a"),
    scrollItems = menuItems.map(function () {
        var item = $($(this).attr("href"));
        if (item.length) {
            return item;
        }
    });

$(window).scroll(function () {
    var fromTop = $(this).scrollTop() + inkonfigMenuHeight;

    var cur = scrollItems.map(function () {
        if ($(this).offset().top < fromTop)
            return this;
    });
    cur = cur[cur.length - 1];
    var id = cur && cur.length ? cur[0].id : "";
    menuItems
        .parent().removeClass("is-active")
        .end().filter("[href='#" + id + "']").parent().addClass("is-active");
});

var scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.onscroll = function () {
    if (document.documentElement.scrollTop > 100) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

function scrollToTop() {
    document.documentElement.scrollTop = 0; 
}