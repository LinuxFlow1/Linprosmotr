(function() {
    "use strict";
    
    Lampa.Lang.add('share_btn', {
        ru: 'Совместный просмотр',
        en: 'Watch together'
    });

    function ShareButton() {
        this.create = function() {};
        this.build = function() {
            const btn = $('<div class="settings-param selector" data-action="share-gen">').text(Lampa.Lang.translate('share_btn'));
            btn.on('hover:enter', () => {
                const url = Lampa.Player.video().url;
                const shareUrl = `https://rave.example.com/join?video=${encodeURIComponent(url)}`;
                
                Lampa.Modal.open({
                    title: 'Скопируйте ссылку',
                    html: `<input value="${shareUrl}" readonly style="width: 100%; padding: 10px;">`,
                    onBack: () => Lampa.Modal.close()
                });
            });
            
            $('.settings__list').append(btn);
        };
    }

    Lampa.Component.add('share_btn', ShareButton);
    
    if (window.appready) new ShareButton().build();
    else Lampa.Listener.follow('app', (e) => e.type === 'ready' && new ShareButton().build());
})();
