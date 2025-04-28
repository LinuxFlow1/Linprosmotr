(function () {
    "use strict";

    // Додаємо переклади для назви кнопки
    Lampa.Lang.add({
        plugin_button: {
            ru: "Кнопка плагина",
            en: "Plugin Button",
            uk: "Кнопка плагіна",
            be: "Кнопка плагіна",
            zh: "插件按钮",
            pt: "Botão do Plugin",
            bg: "Бутон на плъгина"
        }
    });

    // Функція для додавання SVG-кнопки в налаштування
    function addPluginButton() {
        // Визначаємо новий SVG для кнопки з іншим дизайном
        function getButtonHTML() {
            var svg = '<svg width="100" height="40" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">' +
                      '<rect x="0" y="0" width="100" height="40" rx="10" fill="#28a745"/>' + // Змінено колір на зелений і округлені кути
                      '<circle cx="20" cy="20" r="10" fill="white"/>' + // Додано біле коло як значок
                      '<text x="60" y="25" font-size="14" text-anchor="middle" fill="white">' + // Переміщено текст і змінено розмір
                      Lampa.Lang.translate("plugin_button") +
                      '</text>' +
                      '</svg>';

            return '<div class="settings-param selector">' + svg + '</div>';
        }

        // Додаємо параметр у налаштування
        Lampa.SettingsApi.addParam({
            component: 'interface', // Розділ у налаштуваннях (можна змінити на 'general', 'player' тощо)
            param: {
                name: 'plugin_button',
                type: 'info',       // Тип 'info' для відображення кастомного HTML
                html: getButtonHTML, // Функція, що повертає HTML кнопки з SVG
                onRender: function(element) {
                    // Додаємо обробник натискання кнопки
                    element.find('.selector').on('hover:enter', function() {
                        console.log('Plugin button pressed!');
                        // Додайте сюди свою дію, наприклад, Lampa.Activity.out() чи іншу функцію
                    });
                }
            },
            field: {
                name: Lampa.Lang.translate('plugin_button') // Назва в налаштуваннях
            }
        });
    }

    // Ініціалізація плагіна
    function createPluginButton() {
        if (window.appready) addPluginButton();
        else {
            Lampa.Listener.follow("app", function (e) {
                if (e.type == "ready") addPluginButton();
            });
        }
    }

    // Переконуємося, що плагін ініціалізується лише раз
    if (!window.plugin_button_ready) {
        window.plugin_button_ready = true;
        createPluginButton();
    }
})();
