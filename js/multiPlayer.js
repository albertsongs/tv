/**
 * @albertsongs (https://github.com/albertsongs)
 */
class MultiPlayer {
    constructor(videoPlayer, iframePlayer, qrCode, initVolume, changePlayerVolumeHandler) {
        this.videoPlayer = videoPlayer;
        this.iframePlayer = iframePlayer;
        this.qrCode = qrCode;
        this.videoPlayer.volume = this.volume = initVolume;
        this.changePlayerVolumeHandler = changePlayerVolumeHandler;
        this.videoIndex = 0;
        this.videoPlayer.onended = () => this.nextTrack();
        this.showSubtitles();
        this.hls = new Hls();
        this.hls.on(Hls.Events.MANIFEST_PARSED,function() {
            this.videoPlayer.play();
        });
    }
    handleCommand(command) {
        switch (command.type) {
            case 'PLAY_YOUTUBE_VIDEO':
                this.loadYoutubeVideo(command.payload);
                break;
            case 'PLAY_VIDEO':
                this.loadRawVideo(command.payload);
                this.videoIndex = this.getVideoIndex(command.payload);
                break;
            case 'PLAY_PAUSE':
                this.playPause();
                break;
            case 'NEXT':
                this.nextTrack();
                break;
            case 'PREVIOUS':
                this.previousTrack();
                break
            case 'VOLUME_UP':
                if (this.volume === 1) {
                    return;
                }
                this.volume += 0.1;
                this.videoPlayer.volume = this.volume;
                this.changePlayerVolumeHandler(this.volume);
                break
            case 'VOLUME_DOWN':
                if (this.volume === 0) {
                    return;
                }
                this.volume -= 0.1;
                this.changePlayerVolumeHandler(this.volume);
                this.videoPlayer.volume = this.volume;
                break
        }
    }
    setVideos(videos) {
        this.videos = videos;
        this.videosCount = this.videos.length;
        this.setVideoIndexes();
    }
    setVideoIndexes(){
        this.videoIndexes = [];
        let index = 0;
        for(let video of this.videos){
            this.videoIndexes[video.id] = index++;
        }
    }
    loadYoutubeVideo(videoInfo) {
        const youtubeLinkPattern = "https://www.youtube.com/embed/%videoId%?autoplay=1&cc_load_policy=1" +
            "&list=%playlistId%&listType=playlist&loop=1&color=white";
        this.videoPlayer.style.setProperty('display', 'none');
        this.iframePlayer.style.setProperty('display', 'block');
        this.videoPlayer.pause();
        this.iframePlayer.src = youtubeLinkPattern
            .replace('%videoId%', videoInfo.youtube.videoId)
            .replace('%playlistId%', videoInfo.youtube.playlistId);
    }
    loadHlsVideoStream(videoInfo){
        if(!Hls.isSupported()) {
            return;
        }
        this.iframePlayer.style.setProperty('display', 'none');
        this.videoPlayer.style.setProperty('display', 'block');
        this.videoPlayer.innerHTML = "";
        this.hls.loadSource(videoInfo.url);
        this.hls.attachMedia(this.videoPlayer);
    }
    loadRawVideo(videoInfo) {
        if (videoInfo.url.match(/.m3u8/) !== null) {
            return this.loadHlsVideoStream(videoInfo);
        }
        this.hls.stopLoad();
        if (videoInfo.subtitlesUrl !== null) {
            const trackPattern = "" +
                "<track id='subtitles' label='Russian' kind='subtitles' srclang='ru' " +
                "src='%source%' default>"
            this.videoPlayer.innerHTML = trackPattern.replace('%source%', videoInfo.subtitlesUrl);
            this.showSubtitles();
        }
        this.videoPlayer.src = videoInfo.url;
        this.iframePlayer.style.setProperty('display', 'none');
        this.videoPlayer.style.setProperty('display', 'block');
    }
    loadRawVideoByIndex(index) {
        if(this.videos === undefined || this.videos.length < index + 1) {
            return;
        }
        this.loadRawVideo(this.videos[index]);
    }
    playPause() {
        this.videoPlayer.paused
            ? this.videoPlayer.play()
            : this.videoPlayer.pause();
    }
    nextTrack() {
        this.videoIndex = (this.videoIndex + 1) % this.videosCount;
        this.loadRawVideoByIndex(this.videoIndex);
    }
    previousTrack() {
        this.videoIndex = this.videoIndex === 0
            ? this.videosCount - 1
            : (this.videoIndex - 1) % this.videosCount;
        this.loadRawVideoByIndex(this.videoIndex);
    }
    getVideoIndex(videoInfo) {
        if (videoInfo.id === null) {
            return (this.videoIndex + 1) % this.videosCount;
        }
        return this.videoIndexes[videoInfo.id];
    }
    showSubtitles(){
        this.videoPlayer.textTracks.getTrackById("subtitles").mode = "showing";
    }
    buildConnectQR(receiverId) {
        let connectUrl = location.protocol + "//" + location.host + "/rc?receiverId="  + receiverId;
        this.qrCode.innerHTML = "";
        new QRCode(this.qrCode, connectUrl);
    }
    toggleQrCodeVisibility() {
        let cssPropertyOpacity = 'opacity';
        let qrElemOpacity = this.qrCode.style.getPropertyValue(cssPropertyOpacity);
        qrElemOpacity = parseFloat(qrElemOpacity) < 1 ? '1' : '0';
        this.qrCode.style.setProperty(cssPropertyOpacity, qrElemOpacity);
        this.qrCode.style.setProperty('animation', 'none');
    }
}