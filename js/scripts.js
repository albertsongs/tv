function correctVideoPlayerHeight() {
    let iframeVideoIPlayer = document.getElementById("iframePlayer");
    iframeVideoIPlayer.style.setProperty("height", window.innerHeight + "px");
    let videoPlayer = document.getElementById("player");
    videoPlayer.style.setProperty("height", window.innerHeight + "px");
}

window.onresize = correctVideoPlayerHeight;
correctVideoPlayerHeight();

let logger = new Logger(document.getElementById('appLog'));
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
        default:
            logger.debug(JSON.stringify({
                key: e.key,
                keyCode: e.keyCode
            }));
    }
};

let app = new App(apiUrl, receiverId, multiPlayer, changeReceiverIdHandler, logger);
app.registerReceiver();