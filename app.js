/**
 * GERADOR DE FIGURINHAS COPA 2026 - MOTOR DE RENDERIZAÇÃO ATUALIZADO
 * Versão: LENDÁRIA ULTRA-BRILHANTE / HOLOGRÁFICA
 */
 
document.addEventListener('DOMContentLoaded', () => {
    // Seleção de Elementos DOM
    const canvas = document.getElementById('sticker-canvas');
    const ctx = canvas.getContext('2d');
    
    const inputName = document.getElementById('player-name');
    const selectPosition = document.getElementById('player-position');
    const selectRarity = document.getElementById('sticker-rarity');
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    
    // Controles de Ajuste
    const adjustmentsPanel = document.getElementById('adjustments-panel');
    const zoomSlider = document.getElementById('zoom-slider');
    const xSlider = document.getElementById('x-slider');
    const ySlider = document.getElementById('y-slider');
    const zoomVal = document.getElementById('zoom-val');
    const xVal = document.getElementById('x-val');
    const yVal = document.getElementById('y-val');
    
    const btnDownload = document.getElementById('btn-download');
    const btnSpinner = document.getElementById('btn-spinner');
 
    // Estado Global da Aplicação
    let userImage = null;
    let imgScale = 1.0;
    let imgX = 0;
    let imgY = 0;
 
    // Pré-carregamento de Ativos Visuais Oficiais
    const logoWorldCup = new Image();
    logoWorldCup.src = './img/icon-copa.png';
 
    const stadiumBackground = new Image();
    stadiumBackground.src = './img/icon-estadio.png';
 
    logoWorldCup.onload = renderSticker;
    stadiumBackground.onload = renderSticker;
 
    renderSticker();
 
    // ==========================================================================
    // ESCUTADORES DE EVENTOS
    // ==========================================================================
    inputName.addEventListener('input', renderSticker);
    selectPosition.addEventListener('change', renderSticker);
    selectRarity.addEventListener('change', renderSticker);
    dropZone.addEventListener('click', () => fileInput.click());
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
 
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
 
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    });
 
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    });
 
    zoomSlider.addEventListener('input', (e) => {
        imgScale = parseFloat(e.target.value) / 100;
        zoomVal.textContent = `${e.target.value}%`;
        renderSticker();
    });
 
    xSlider.addEventListener('input', (e) => {
        imgX = parseInt(e.target.value);
        xVal.textContent = e.target.value;
        renderSticker();
    });
 
    ySlider.addEventListener('input', (e) => {
        imgY = parseInt(e.target.value);
        yVal.textContent = e.target.value;
        renderSticker();
    });
 
    btnDownload.addEventListener('click', downloadSticker);
 
    function processFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Por favor, envie um arquivo de imagem válido.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                userImage = img;
                imgScale = 1.0;
                imgX = 0;
                imgY = 0;
                zoomSlider.value = 100;
                xSlider.value = 0;
                ySlider.value = 0;
                zoomVal.textContent = '100%';
                xVal.textContent = '0';
                yVal.textContent = '0';
                
                adjustmentsPanel.classList.remove('id-disabled');
                zoomSlider.removeAttribute('disabled');
                xSlider.removeAttribute('disabled');
                ySlider.removeAttribute('disabled');
                
                renderSticker();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
 
    // ==========================================================================
    // MOTOR DE RENDERIZAÇÃO DO CANVAS (EDIÇÃO ULTRA GLOW)
    // ==========================================================================
    function renderSticker() {
        const W = canvas.width;  
        const H = canvas.height; 
        const isLegendary = selectRarity.value === 'legendary'; 
 
        // Atualização das variáveis globais do CSS do site
        if (isLegendary) {
            document.body.classList.add('rarity-legendary');
            document.documentElement.style.setProperty('--primary-color', '#4a148c'); 
            document.documentElement.style.setProperty('--accent-color', '#ffd700');  
        } else {
            document.body.classList.remove('rarity-legendary');
            document.documentElement.style.setProperty('--primary-color', '#002776'); 
            document.documentElement.style.setProperty('--accent-color', '#ffdf00');  
        }

        ctx.clearRect(0, 0, W, H);
 
        // 1. FUNDO DO CARD
        if (stadiumBackground.complete && stadiumBackground.naturalWidth !== 0) {
            ctx.drawImage(stadiumBackground, 0, 0, W, H);
            
            // Se for lendária, aplica um filtro gradiente cósmico por cima do estádio
            if (isLegendary) {
                const cosmicGrad = ctx.createLinearGradient(0, 0, W, H);
                cosmicGrad.addColorStop(0, 'rgba(30, 0, 60, 0.6)');
                cosmicGrad.addColorStop(0.5, 'rgba(74, 20, 140, 0.4)');
                cosmicGrad.addColorStop(1, 'rgba(0, 0, 50, 0.7)');
                ctx.fillStyle = cosmicGrad;
            } else {
                ctx.fillStyle = 'rgba(0, 20, 60, 0.45)';
            }
            ctx.fillRect(0, 0, W, H);
        } else {
            const bgGrad = ctx.createRadialGradient(W/2, H/2, 50, W/2, H/2, W);
            if (isLegendary) {
                bgGrad.addColorStop(0, '#6a1b9a');
                bgGrad.addColorStop(0.5, '#311b92');
                bgGrad.addColorStop(1, '#0a0015');
            } else {
                bgGrad.addColorStop(0, '#003399');
                bgGrad.addColorStop(1, '#001144');
            }
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, W, H);
        }
 
        // HOLOFOTES POTENCIALIZADOS (Modo Show)
        ctx.save();
        ctx.globalAlpha = isLegendary ? 0.5 : 0.25; 
        
        for (let i = 0; i < 4; i++) {
            const lightGrad = ctx.createLinearGradient(W/2, 0, W/2, H);
            if (isLegendary) {
                // Alterna entre feixes dourados e turquesas brilhantes
                if(i % 2 === 0) {
                    lightGrad.addColorStop(0, 'rgba(255, 240, 150, 1)');
                    lightGrad.addColorStop(0.6, 'rgba(255, 215, 0, 0.2)');
                } else {
                    lightGrad.addColorStop(0, 'rgba(150, 255, 255, 1)');
                    lightGrad.addColorStop(0.6, 'rgba(0, 229, 255, 0.2)');
                }
                lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else {
                lightGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
                lightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            }
            
            ctx.fillStyle = lightGrad;
            ctx.beginPath();
            ctx.moveTo(W / 2 - 150 + (i * 100), 0);
            ctx.lineTo(-500 + (i * 650), H);
            ctx.lineTo(300 + (i * 650), H);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
 
        // 2. MÁSCARA DE RECORTE DA FOTO DO JOGADOR
        ctx.save();
        const pad = 45;
        ctx.beginPath();
        ctx.moveTo(pad + 20, 260);
        ctx.lineTo(W - pad - 20, 260);
        ctx.quadraticCurveTo(W - pad, 260, W - pad, 280);
        ctx.lineTo(W - pad, H - 240);
        ctx.quadraticCurveTo(W - pad, H - 210, W - pad - 60, H - 210);
        ctx.lineTo(pad + 60, H - 210);
        ctx.quadraticCurveTo(pad, H - 210, pad, H - 240);
        ctx.lineTo(pad, 280);
        ctx.quadraticCurveTo(pad, 260, pad + 20, 260);
        ctx.closePath();
        ctx.clip();
 
        if (userImage) {
            const renderW = userImage.width * imgScale;
            const renderH = userImage.height * imgScale;
            const posX = (W / 2) - (renderW / 2) + imgX;
            const posY = (H / 2) - (renderH / 2) - 30 + imgY;
            ctx.drawImage(userImage, posX, posY, renderW, renderH);
            
            // NOVO: Overlay de Película Holográfica sobre a foto do jogador!
            if (isLegendary) {
                ctx.save();
                ctx.globalCompositeOperation = 'color-dodge'; // Mistura de cor que destaca brilhos intensos
                const holoOverlay = ctx.createLinearGradient(0, 260, W, H - 210);
                holoOverlay.addColorStop(0, 'rgba(255, 0, 128, 0.15)');
                holoOverlay.addColorStop(0.3, 'rgba(0, 255, 255, 0.15)');
                holoOverlay.addColorStop(0.7, 'rgba(255, 255, 0, 0.15)');
                holoOverlay.addColorStop(1, 'rgba(128, 0, 255, 0.15)');
                ctx.fillStyle = holoOverlay;
                ctx.fillRect(pad, 260, W - (pad*2), H - 470);
                ctx.restore();
            }

        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(0, 0, W, H);
            ctx.font = 'italic 700 28px Montserrat';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.textAlign = 'center';
            ctx.fillText('INSIRA A FOTO DO ATLETA', W / 2, H / 2);
        }
        ctx.restore();
 
        // SUPER CHUVA DE BRILHOS (Mais partículas e tamanhos variados)
        ctx.save();
        const sparkles = isLegendary ? [
            {x: 80, y: 290, r: 12, c: '#ffd700'}, {x: 720, y: 320, r: 15, c: '#00ffff'},
            {x: 680, y: 180, r: 8, c: '#ffffff'}, {x: 150, y: 480, r: 14, c: '#ff007f'},
            {x: 400, y: 120, r: 10, c: '#e0b0ff'}, {x: 280, y: 350, r: 6, c: '#ffffff'},
            {x: 550, y: 550, r: 11, c: '#ffd700'}, {x: 120, y: 700, r: 9, c: '#00ffff'},
            {x: 690, y: 680, r: 13, c: '#ff007f'}, {x: 400, y: 500, r: 7, c: '#ffd700'}
        ] : [
            {x: 100, y: 300, r: 6, c: '#ffdf00'}, {x: 700, y: 350, r: 10, c: '#008751'},
            {x: 650, y: 220, r: 5, c: '#ffffff'}, {x: 200, y: 500, r: 8, c: '#ffdf00'}
        ];
        
        sparkles.forEach(s => {
            ctx.globalAlpha = isLegendary ? 0.85 : 0.5;
            // Efeito Glow individual em cada partícula lendária
            if (isLegendary) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = s.c;
            }
            ctx.fillStyle = s.c;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore(); // Reseta os efeitos de glow das partículas
 
        // ==========================================================================
        // 3. MOLDURAS E BORDAS HIPER REFORÇADAS
        // ==========================================================================
        let borderColor1 = '#ffffff';
        let borderColor2 = '#ffdf00'; 
        let borderColor3 = '#008751'; 

        if (isLegendary) {
            // Gradiente 45º Metálico e Vibrante para a borda principal
            const holoGrad = ctx.createLinearGradient(0, 0, W, H);
            holoGrad.addColorStop(0, '#9c27b0');   // Roxo Vibrante
            holoGrad.addColorStop(0.2, '#ff007f'); // Neon Pink
            holoGrad.addColorStop(0.4, '#ffeb3b'); // Ouro Puro
            holoGrad.addColorStop(0.6, '#00e5ff'); // Ciano Elétrico
            holoGrad.addColorStop(0.8, '#ff007f'); // Neon Pink de novo
            holoGrad.addColorStop(1, '#9c27b0');   
            
            borderColor2 = holoGrad;
            borderColor3 = '#ffd700'; // Linha interna Dourada real
        }

        // Borda 1 (Externa Fina branca)
        ctx.lineWidth = 6;
        ctx.strokeStyle = borderColor1;
        ctx.strokeRect(15, 15, W - 30, H - 30);
 
        // Borda 2 (A Borda Principal Grossa)
        ctx.save();
        if (isLegendary) {
            ctx.shadowBlur = 25;
            ctx.shadowColor = '#ff007f'; // Borda Lendária agora emana luz rosa neon!
        }
        ctx.lineWidth = 16; // Um pouco mais grossa para destacar o efeito metalizado
        ctx.strokeStyle = borderColor2; 
        ctx.strokeRect(26, 26, W - 52, H - 52);
        ctx.restore();
 
        // Borda 3 (Interna de acabamento)
        ctx.lineWidth = 4;
        ctx.strokeStyle = borderColor3;
        ctx.strokeRect(36, 36, W - 72, H - 72);
 
        // 4. CABEÇALHO E LOGOTIPO
        const logoX = 52;
        const logoY = 52;
        const logoW = 160;
        const logoH = 175;
 
        ctx.fillStyle = isLegendary ? 'rgba(42, 0, 79, 0.95)' : 'rgba(10, 31, 29, 0.85)';
        ctx.beginPath();
        ctx.roundRect(46, 46, 172, 187, [12]);
        ctx.fill();
        
        // Borda dourada na caixinha da logo se lendária
        if(isLegendary) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#ffd700';
            ctx.stroke();
        }
 
        if (logoWorldCup.complete && logoWorldCup.naturalWidth !== 0) {
            ctx.drawImage(logoWorldCup, logoX, logoY, logoW, logoH);
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 26px Montserrat';
            ctx.fillText('FIFA 2026', 132, 140);
        }
 
        // Emblema BRA / Bandeira Nacional (Direita)
        const flagX = W - 190;
        const flagY = 46;
        ctx.fillStyle = isLegendary ? '#2a0066' : '#002776'; 
        ctx.beginPath();
        ctx.roundRect(flagX, flagY, 140, 155, [12]);
        ctx.fill();
        
        if(isLegendary) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#ffd700';
            ctx.stroke();
        }
        
        ctx.fillStyle = '#008751';
        ctx.fillRect(flagX + 20, flagY + 20, 100, 60);
        ctx.fillStyle = '#ffdf00';
        ctx.beginPath();
        ctx.moveTo(flagX + 70, flagY + 20);
        ctx.lineTo(flagX + 115, flagY + 50);
        ctx.lineTo(flagX + 70, flagY + 80);
        ctx.lineTo(flagX + 25, flagY + 50);
        ctx.closePath();
        ctx.fill();
 
        ctx.fillStyle = isLegendary ? '#2a0066' : '#002776';
        ctx.beginPath();
        ctx.arc(flagX + 70, flagY + 50, 18, 0, Math.PI * 2);
        ctx.fill();
 
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Teko';
        ctx.textAlign = 'center';
        ctx.fillText('BRA', flagX + 70, flagY + 132);
 
        // 5. RODAPÉ (TARJETA DO JOGADOR SUPER ESTILIZADA)
        const nameBoxY = H - 240;
       
        ctx.save();
        ctx.shadowColor = isLegendary ? 'rgba(239, 0, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = isLegendary ? 25 : 18;
        ctx.shadowOffsetY = 8;
 
        // Caixa Amarela/Dourada principal
        ctx.fillStyle = isLegendary ? '#ffd700' : '#ffdf00'; 
        ctx.beginPath();
        ctx.moveTo(80, nameBoxY);
        ctx.lineTo(W - 80, nameBoxY);
        ctx.lineTo(W - 110, nameBoxY + 150);
        ctx.lineTo(110, nameBoxY + 150);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
 
        // Caixa Escura Interna
        ctx.fillStyle = isLegendary ? '#1a0033' : '#111111'; 
        ctx.beginPath();
        ctx.moveTo(140, nameBoxY + 95);
        ctx.lineTo(W - 140, nameBoxY + 95);
        ctx.lineTo(W - 155, nameBoxY + 140);
        ctx.lineTo(155, nameBoxY + 140);
        ctx.closePath();
        ctx.fill();
 
        // Label "JOGADOR" ou "LENDÁRIA"
        ctx.fillStyle = isLegendary ? '#aa00ff' : '#008751';
        ctx.font = 'bold 22px Montserrat';
        ctx.textAlign = 'center';
        ctx.fillText(isLegendary ? 'RARIDADE LENDÁRIA' : 'JOGADOR', W / 2, nameBoxY + 32);
 
        // Texto do Nome do Atleta
        const rawName = inputName.value.trim() || 'SEU NOME';
        ctx.fillStyle = isLegendary ? '#ffffff' : '#002776'; 
        
        ctx.save();
        if (isLegendary) {
            // Um leve contorno escuro para o nome branco "saltar" na versão lendária
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#000000';
        }
        ctx.font = '900 58px Teko';
        ctx.fillText(rawName.toUpperCase(), W / 2, nameBoxY + 82);
        ctx.restore();
 
        // Texto da Posição
        const rawPosition = selectPosition.value;
        ctx.fillStyle = isLegendary ? '#ffd700' : '#ffffff'; // Posição em letras douradas se for lendário
        ctx.font = 'bold 26px Teko';
        ctx.letterSpacing = '2px';
        ctx.fillText(rawPosition, W / 2, nameBoxY + 128);
        ctx.letterSpacing = '0px';
 
        // Ícones de Bola de Futebol Estilizados
        drawFootballIcon(95, H - 120, 28, isLegendary);
        drawFootballIcon(W - 95, H - 120, 28, isLegendary);
    }
 
    function drawFootballIcon(x, y, radius, isLegendary) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = isLegendary ? '#9c27b0' : '#222222';
        ctx.stroke();
 
        ctx.fillStyle = isLegendary ? '#ff0080' : '#222222'; // Gomos rosa neon cintilantes se raras!
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
            const px = x + Math.cos(angle) * (radius * 0.4);
            const py = y + Math.sin(angle) * (radius * 0.4);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
 
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
            const x1 = x + Math.cos(angle) * (radius * 0.4);
            const y1 = y + Math.sin(angle) * (radius * 0.4);
            const x2 = x + Math.cos(angle) * radius;
            const y2 = y + Math.sin(angle) * radius;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        ctx.restore();
    }
 
    function downloadSticker() {
        const nameVal = inputName.value.trim();
        if (!userImage) {
            alert('🚨 Ops! Você precisa adicionar uma foto antes de baixar sua figurinha.');
            return;
        }
        if (!nameVal) {
            alert('🚨 Por favor, digite o nome do jogador para personalizar o cromo.');
            inputName.focus();
            return;
        }
 
        btnDownload.setAttribute('disabled', 'true');
        btnSpinner.classList.remove('hidden');
        document.querySelector('.btn-text').textContent = 'PROCESSANDO...';
 
        setTimeout(() => {
            try {
                const dataUrl = canvas.toDataURL('image/png', 1.0);
                const link = document.createElement('a');
                const sanitizedName = nameVal.toLowerCase().replace(/[^a-z0-9]/g, '-');
                link.download = `figurinha-copa2026-${sanitizedName}.png`;
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error(err);
                alert('Ocorreu um erro ao gerar o arquivo de alta resolução.');
            } finally {
                btnDownload.removeAttribute('disabled');
                btnSpinner.classList.add('hidden');
                document.querySelector('.btn-text').textContent = 'GERAR E BAIXAR FIGURINHA';
            }
        }, 800);
    }
});