(function() {
    "use strict";

    // Локализация [[1]][[4]]
    Lampa.Lang.add({
        share_settings: {
            ru: "Совместный просмотр",
            en: "Watch together",
            uk: "Спільний перегляд"
        },
        copy_link: {
            ru: "Копировать ссылку",
            en: "Copy link"
        }
    });

    // Компонент настроек [[6]]
    function ShareSettings() {
        this.create = function() {};
        this.build = function() {};
        this.start = function() {};
        this.pause = function() {};
        this.stop = function() {};
        this.render = function() {};
        this.destroy = function() {};
    }

    // Добавление в настройки [[5]][[8]]
    function addToSettings() {
        const settings_item = $(
            `<div class="settings__section">
                <div class="settings__item selector" data-action="generate_share_link">
                    <div class="settings__text">${Lampa.Lang.translate("share_settings")}</div>
                </div>
            </div>`
        );

        // Обработчик нажатия [[2]]
        settings_item.on("hover:enter", function() {
            const videoUrl = Lampa.Player.video().url;
            const sessionId = Math.random().toString(36).substr(2, 9);
            const shareUrl = `https://rave.example.com/join?session=${sessionId}&video=${encodeURIComponent(videoUrl)}`;

            Lampa.Modal.open({
                title: Lampa.Lang.translate("share_settings"),
                html: `
                    <div style="text-align: center; padding: 20px;">
                        <input type="text" id="share-link" value="${shareUrl}" readonly style="width: 100%; padding: 10px;"/>
                        <button onclick="copyShareLink()" class="btn">${Lampa.Lang.translate("copy_link")}</button>
                    </div>
                `,
                onBack: () => Lampa.Modal.close()
            });

            initWebRTC(sessionId, videoUrl);
        });

        // Вставка в настройки [[7]]
        $(".settings__list").append(settings_item);
    }

    // Инициализация WebRTC [[9]]
    function initWebRTC(sessionId, videoUrl) {
        const peer = new RTCPeerConnection();
        const video = document.querySelector('video');

        video.captureStream().getTracks().forEach(track => 
            peer.addTrack(track, video.captureStream())
        );

        const ws = new WebSocket('wss://your-signaling-server.com');
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if(data.sessionId === sessionId) {
                peer.setRemoteDescription(data.sdp);
                peer.addIceCandidate(data.candidate);
            }
        };

        peer.createOffer().then(offer => {
            peer.setLocalDescription(offer);
            ws.send(JSON.stringify({
                sessionId,
                sdp: peer.localDescription,
                candidate: peer.iceGatheringState
            }));
        });
    }

    // Копирование ссылки [[3]]
    window.copyShareLink = function() {
        const input = document.getElementById('share-link');
        input.select();
        document.execCommand('copy');
        Lampa.Noty.show('Ссылка скопирована!');
    };

    // Инициализация плагина [[4]]
    function initPlugin() {
        if(window.plugin_share_settings) return;
        window.plugin_share_settings = true;

        Lampa.Component.add("share_settings", ShareSettings);

        if(window.appready) addToSettings();
        else {
            Lampa.Listener.follow("app", function(e) {
                if(e.type === "ready") addToSettings();
            });
        }
    }

    initPlugin();
})();
