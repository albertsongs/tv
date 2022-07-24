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

window.onresize = correctVideoPlayerHeight;
correctVideoPlayerHeight();

let logLevel = parseLogLevel();
let logger = new Logger(document.getElementById('appLog'), logLevel);
window.onerror = (err) => logger.debug(JSON.stringify(err)); //for debug on TV
let apiUrl = 'https://albertsongs.asuscomm.com';
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
            multiPlayer.loadRawVideoById(0);
            break;
        case '2':
            multiPlayer.loadRawVideoById(1);
            break;
        case '3':
            multiPlayer.loadRawVideoById(2);
            break;
        case '4':
            multiPlayer.loadRawVideoById(3);
            break;
        case '5':
            multiPlayer.loadRawVideoById(4);
            break;
        case '6':
            multiPlayer.loadRawVideoById(5);
            break;
        case '7':
            multiPlayer.loadRawVideoById(6);
            break;
        case '8':
            multiPlayer.loadRawVideoById(7);
            break;
        case '9':
            multiPlayer.loadRawVideoById(8);
            break;
        default:
            logger.debug(JSON.stringify({
                key: e.key,
                keyCode: e.keyCode
            }));
    }
};
