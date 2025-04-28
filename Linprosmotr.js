(function() {
    "use strict"; // Строгий режим [[1]][[3]]

    // Локализация [[2]]
    Lampa.Lang.add({
        share_menu: {
            ru: "Совместный просмотр",
            en: "Watch together",
            uk: "Спільний перегляд",
            be: "Агульны прагляд",
            zh: "一起观看",
            pt: "Assistir juntos",
            bg: "Заедно гледане"
        }
    });

    // Компонент совместного просмотра
    function share_m(object) {
        this.create = function() {};
        this.build = function() {}; // this.activity.loader(false);
        this.start = function() {};
        this.pause = function() {};
        this.stop = function() {};
        this.render = function() {};
        this.destroy = function() {};
    }

    // Добавление пункта меню
    function addShareButton() {
        // SVG иконка [[7]]
        const ico = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7 0-.24-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
        `;

        // Создание элемента меню [[4]]
        const menu_item = $(
            `<li class="menu__item selector" data-action="share_stream">
                <div class="menu__ico">${ico}</div>
                <div class="menu__text">${Lampa.Lang.translate("share_menu")}</div>
            </li>`
        );

        // Обработчик нажатия [[5]]
        menu_item.on("hover:enter", function() {
            const videoUrl = Lampa.Player.video().url;
            const sessionId = Math.random().toString(36).substr(2, 9);
            
            // Генерация ссылки с WebRTC параметрами
            const shareUrl = `https://rave.example.com/join?session=${sessionId}&video=${encodeURIComponent(videoUrl)}`;
            
            // Модальное окно [[6]]
            Lampa.Modal.open({
                title: Lampa.Lang.translate("share_menu"),
                html: `
                    <div style="text-align: center; padding: 20px;">
                        <input type="text" id="share-link" value="${shareUrl}" readonly style="width: 100%; padding: 10px; margin-bottom: 15px;"/>
                        <button onclick="copyShareLink()" class="btn">Копировать ссылку</button>
                    </div>
                `,
                size: 'medium',
                onBack: () => Lampa.Modal.close()
            });

            // Инициализация WebRTC [[7]]
            initWebRTC(sessionId, videoUrl);
        });

        // Вставка в меню [[8]]
        $(".menu .menu__list").eq(1).append(menu_item);
    }

    // Инициализация WebRTC [[9]]
    function initWebRTC(sessionId, videoUrl) {
        const peerConnection = new RTCPeerConnection();
        const videoElement = document.querySelector('video');
        
        // Захват медиапотока [[10]]
        videoElement.captureStream().getTracks().forEach(track => 
            peerConnection.addTrack(track, videoElement.captureStream())
        );

        // Сигнализация через WebSocket [[11]]
        const ws = new WebSocket('wss://your-signaling-server.com');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if(data.sessionId === sessionId) {
                peerConnection.setRemoteDescription(data.sdp);
                peerConnection.addIceCandidate(data.candidate);
            }
        };

        // Создание offer [[12]]
        peerConnection.createOffer().then(offer => {
            peerConnection.setLocalDescription(offer);
            ws.send(JSON.stringify({
                sessionId,
                sdp: peerConnection.localDescription,
                candidate: peerConnection.iceGatheringState
            }));
        });
    }

    // Копирование ссылки [[13]]
    window.copyShareLink = function() {
        const input = document.getElementById('share-link');
        input.select();
        document.execCommand('copy');
        Lampa.Noty.show('Ссылка скопирована!');
    };

    // Инициализация компонента [[14]]
    function createShareMenu() {
        if(window.plugin_share_m_ready) return;
        window.plugin_share_m_ready = true;
        
        Lampa.Component.add("share_m", share_m);
        
        if(window.appready) addShareButton();
        else {
            Lampa.Listener.follow("app", function(e) {
                if(e.type === "ready") addShareButton();
            });
        }
    }

    createShareMenu();
})();
