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
window.onkeydown = (e) => logger.debug(JSON.stringify({key:e.key}));
let apiUrl = 'https://albertsongs.asuscomm.com';
let receiverId = localStorage.getItem('receiverId');
let changeReceiverIdHandler = (receiverId) => localStorage.setItem('receiverId', receiverId);
let changePlayerVolumeHandler = (volume) => localStorage.setItem('volume', volume);

let multiPlayer = new MultiPlayer(
    document.getElementById('player'),
    document.getElementById('iframePlayer'),
    localStorage.getItem('volume'),
    changePlayerVolumeHandler
)

let app = new App(apiUrl, receiverId, multiPlayer, changeReceiverIdHandler, logger);
app.registerReceiver();