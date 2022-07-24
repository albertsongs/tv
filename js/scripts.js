let logLevel = parseLogLevel();
let logger = new Logger(document.getElementById('appLog'), logLevel);
window.onerror = (err) => logger.debug(JSON.stringify(err)); //for debug on TV

window.onresize = correctVideoPlayerHeight;
correctVideoPlayerHeight();

let receiverId = localStorage.getItem('receiverId');
let changeReceiverIdHandler = (receiverId) => localStorage.setItem('receiverId', receiverId);
let changePlayerVolumeHandler = (volume) => localStorage.setItem('volume', volume);

let multiPlayer = new MultiPlayer(
    document.getElementById('player'),
    document.getElementById('iframePlayer'),
    document.getElementById('qrcode'),
    localStorage.getItem('volume') || 1,
    changePlayerVolumeHandler
)

let apiUrl = 'https://albertsongs.asuscomm.com';
let app = new App(apiUrl, receiverId, multiPlayer, changeReceiverIdHandler, logger);
app.registerReceiver();

window.onkeydown = (e) => {
    switch (e.key) {
        case 'ArrowLeft':
        case 'MediaPlayPausePrevious':
            multiPlayer.previousTrack();
            break;
        case 'ArrowRight':
        case 'MediaPlayPauseNext':
            multiPlayer.nextTrack();
            break;
        case 'MediaPlayPause':
        case 'Unidentified':
            multiPlayer.playPause();
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            break;
        case 'Info':
        case 'F2':
            multiPlayer.toggleQrCodeVisibility();
            break;
        case '1':
            multiPlayer.loadRawVideoByIndex(0);
            break;
        case '2':
            multiPlayer.loadRawVideoByIndex(1);
            break;
        case '3':
            multiPlayer.loadRawVideoByIndex(2);
            break;
        case '4':
            multiPlayer.loadRawVideoByIndex(3);
            break;
        case '5':
            multiPlayer.loadRawVideoByIndex(4);
            break;
        case '6':
            multiPlayer.loadRawVideoByIndex(5);
            break;
        case '7':
            multiPlayer.loadRawVideoByIndex(6);
            break;
        case '8':
            multiPlayer.loadRawVideoByIndex(7);
            break;
        case '9':
            multiPlayer.loadRawVideoByIndex(8);
            break;
        default:
            logger.debug(JSON.stringify({
                key: e.key,
                keyCode: e.keyCode
            }));
    }
};

function correctVideoPlayerHeight() {
    let iframeVideoIPlayer = document.getElementById("iframePlayer");
    iframeVideoIPlayer.style.setProperty("height", window.innerHeight + "px");
    let videoPlayer = document.getElementById("player");
    videoPlayer.style.setProperty("height", window.innerHeight + "px");
}

function parseLogLevel() {
    let search = window.location.search.split('=');
    if(search.length < 2 || search[0] !== '?logLevel') {
        return 'info';
    }
    return search[1];
}