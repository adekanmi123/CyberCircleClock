function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    $('#clock').text(h + ":" + m + ":" + s);
    
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}
jQuery(function($) {
    startTime();

    // mouse move controll
    lastMouseMove = Date.now();
    mouseHidden = false;
    $(document).on('mousemove', () => {
        startMouse();
        
        clearTimeout(lastMouseMove);
        lastMouseMove = setTimeout(stopMouse, 2000);
    });

    function stopMouse() {
        if (mouseHidden) {
            return;
        }
        $('body').css('cursor', 'none');
        $('#heat').fadeOut(1000);
        mouseHidden = true;
    }
    function startMouse() {
        if (!mouseHidden) {
            return;
        }
        $('body').css('cursor', 'default');
        $('#heat').fadeIn(100);
        mouseHidden = false;
    }
});

const remote = require('electron').remote;
const {powerSaveBlocker} = remote;
function CloseApplication() {
    var window = remote.getCurrentWindow();
    window.close();
}

let fullscreenMode = false;
let scrSvr = null;
var win = remote.getCurrentWindow();

function FullscreenApplication() {
    win.setFullScreen(!fullscreenMode);
}

win.on('enter-full-screen', () => {
    fullscreenMode = true;
    scrSvr = powerSaveBlocker.start('prevent-display-sleep');
});
win.on('leave-full-screen', () => {
    fullscreenMode = false;
    if (scrSvr !== null) {
        powerSaveBlocker.stop(scrSvr);
    }
});

