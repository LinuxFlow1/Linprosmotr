(function () {
    const config = {
        apiKey: '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',
        models: [
            { id: 'llama3-8b-8192', name: 'Meta Llama 3 8B' },
            { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
            { id: 'gemma-7b-it', name: 'Gemma 7B' }
        ],
        style: `
            .groq-modal {
                position: fixed; top: 10%; left: 30%; background: #1e1e1e; padding: 20px; border-radius: 8px;
                z-index: 10001; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: opacity 0.3s;
            }
            .groq-btn {
                position: fixed; bottom: 20px; right: 20px; z-index: 10000; background: #4CAF50; color: white;
                padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; display: flex; align-items: center;
                gap: 8px; font-family: sans-serif; box-shadow: 0 2px 6px rgba(0,0,0,0.2); border-radius: 20px;
            }
            .groq-close { position: absolute; top: 5px; right: 10px; color: white; cursor: pointer; font-size: 1.2em; }
            svg.ai-icon {
                width: 20px; height: 20px; vertical-align: middle; stroke: #fff; stroke-width: 2; fill: none;
                transition: transform 0.3s ease;
            }
            .groq-btn:hover svg.ai-icon { transform: rotate(12deg); }
        `
    };

    const aiIcon = `
        <svg class="ai-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12H16M12 8V16M15 9L9 15M9 9L15 15" stroke-linecap="round"/>
        </svg>
    `;

    // Добавление стилей
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = config.style;
    document.head.appendChild(styleSheet);

    // Кнопка с иконкой
    const btn = document.createElement('button');
    btn.className = 'groq-btn';
    btn.innerHTML = `${aiIcon} Chat с Groq`;

    // Модальное окно
    const modal = document.createElement('div');
    modal.className = 'groq-modal';
    modal.style.display = 'none';
    modal.innerHTML = `
        <span class="groq-close">&times;</span>
        <h3 style="color:#fff;margin:0 0 10px;">Выберите модель:</h3>
        <select id="model-select" style="width:100%;margin-bottom:10px;padding:5px;"></select>
        <textarea id="user-input" placeholder="Введите ваш запрос..." 
                  style="width:100%;height:100px;margin-bottom:10px;padding:8px;font-family:sans-serif;"></textarea>
        <button id="send-btn" style="padding:8px 12px;background:#2196F3;color:white;border:none;border-radius:4px;cursor:pointer;">Отправить</button>
        <pre id="response" style="margin-top:15px;color:#ccc;white-space:pre-wrap;font-family:sans-serif;line-height:1.4;"></pre>
    `;

    // Вставка в DOM
    document.body.appendChild(btn);
    document.body.appendChild(modal);

    // Заполнение списка моделей
    const select = modal.querySelector('#model-select');
    const response = modal.querySelector('#response');
    config.models.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.text = m.name;
        select.appendChild(opt);
    });

    // Обработчики событий
    btn.onclick = () => {
        modal.style.display = 'block';
        modal.focus();
    };
    
    modal.querySelector('.groq-close').onclick = () => modal.style.display = 'none';

    modal.querySelector('#send-btn').onclick = async () => {
        const model = select.value;
        const prompt = modal.querySelector('#user-input').value.trim();
        if (!prompt) return alert('Введите запрос!');
        
        response.textContent = 'Загрузка...';

        try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 512,
                    temperature: 0.7
                })
            });

            const data = await res.json();
            response.textContent = data.choices[0]?.message?.content || 'Ошибка ответа.';
        } catch (e) {
            console.error(e);
            response.textContent = 'Произошла ошибка.';
        }
    };
})();
