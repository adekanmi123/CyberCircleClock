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
    setInterval(() => {
        if (lastMouseMove + 2000 < Date.now()) {
            stopMouse();
        }
    }, 200);
    $(document).on('mousemove', () => {
        lastMouseMove = Date.now();
        startMouse();
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
function FullscreenApplication() {
    fullscreenMode = !fullscreenMode;
    
    var window = remote.getCurrentWindow();
    window.setFullScreen(fullscreenMode);
    
    if (window.isFullScreen()) {
        scrSvr = powerSaveBlocker.start('prevent-display-sleep');
    } else {
        if (scrSvr) {
            powerSaveBlocker.stop(scrSvr);
        }
    }
}

