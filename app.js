/**
 * GERADOR DE FIGURINHAS COPA 2026 - MOTOR DE RENDERIZAÇÃO ATUALIZADO
 * Inclusão de Fundo de Estádio Realista e Logotipo Oficial da Copa via Canvas
 */
 
document.addEventListener('DOMContentLoaded', () => {
    // Seleção de Elementos DOM
    const canvas = document.getElementById('sticker-canvas');
    const ctx = canvas.getContext('2d');
   
    const inputName = document.getElementById('player-name');
    const selectPosition = document.getElementById('player-position');
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
    // URL estável contendo o escudo oficial 2026 recortado (fundo transparente)
    logoWorldCup.src = './img/icon-copa.png';
 
    const stadiumBackground = new Image();
    // URL estável com a imagem de um estádio de futebol vibrante e lotado
    stadiumBackground.src = './img/icon-estadio.png';
 
    // Garante a re-renderização assim que os assets externos forem baixados
    logoWorldCup.onload = renderSticker;
    stadiumBackground.onload = renderSticker;
 
    // Inicialização do Canvas Base
    renderSticker();
 
    // ==========================================================================
    // ESCUTADORES DE EVENTOS (EVENT LISTENERS)
    // ==========================================================================
    inputName.addEventListener('input', renderSticker);
    selectPosition.addEventListener('change', renderSticker);
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
    // MOTOR DE RENDERIZAÇÃO DO CANVAS
    // ==========================================================================
    function renderSticker() {
        const W = canvas.width;  // 800
        const H = canvas.height; // 1100
 
        ctx.clearRect(0, 0, W, H);
 
        // 1. NOVO FUNDO: RENDERIZAÇÃO DO ESTÁDIO REALISTA COM EFEITOS
        if (stadiumBackground.complete && stadiumBackground.naturalWidth !== 0) {
            // Desenha a imagem do estádio cobrindo todo o fundo
            ctx.drawImage(stadiumBackground, 0, 0, W, H);
           
            // Camada de sobreposição escura/azulada sutil para dar contraste e clima noturno
            ctx.fillStyle = 'rgba(0, 20, 60, 0.45)';
            ctx.fillRect(0, 0, W, H);
        } else {
            // Fallback caso a rede falhe
            const bgGrad = ctx.createRadialGradient(W/2, H/2, 50, W/2, H/2, W);
            bgGrad.addColorStop(0, '#003399');
            bgGrad.addColorStop(1, '#001144');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, W, H);
        }
 
        // Efeito de Holofotes Dramáticos (Vigias de Luz cruzando o teto)
        ctx.save();
        ctx.globalAlpha = 0.25; // Aumentado para maior dramaticidade
        const lightGrad = ctx.createLinearGradient(W/2, 0, W/2, H);
        lightGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        lightGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        lightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = lightGrad;
 
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(W / 2 - 100 + (i * 100), 0);
            ctx.lineTo(-400 + (i * 600), H);
            ctx.lineTo(200 + (i * 600), H);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
 
        // Partículas de brilho suspensas no ar (Confetes)
        ctx.save();
        ctx.globalAlpha = 0.5;
        const sparkles = [
            {x: 100, y: 300, r: 6, c: '#ffdf00'}, {x: 700, y: 350, r: 10, c: '#008751'},
            {x: 650, y: 220, r: 5, c: '#ffffff'}, {x: 200, y: 500, r: 8, c: '#ffdf00'}
        ];
        sparkles.forEach(s => {
            ctx.fillStyle = s.c;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
 
        // 2. RECORTAR E DESENHAR A FOTO DO JOGADOR
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
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(0, 0, W, H);
            ctx.font = 'italic 700 28px Montserrat';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.textAlign = 'center';
            ctx.fillText('INSIRA A FOTO DO ATLETA', W / 2, H / 2);
        }
        ctx.restore();
 
        // 3. MOLDURAS E BORDAS DO CARD
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(15, 15, W - 30, H - 30);
 
        ctx.lineWidth = 14;
        ctx.strokeStyle = '#ffdf00';
        ctx.strokeRect(25, 25, W - 50, H - 50);
 
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#008751';
        ctx.strokeRect(34, 34, W - 68, H - 68);
 
        // 4. CABEÇALHO COM LOGOTIPO OFICIAL DA COPA DO MUNDO NO CANTO SUPERIOR ESQUERDO
        const logoX = 52;
        const logoY = 52;
        const logoW = 160;
        const logoH = 175;
 
        // Caixa de fundo escura estilizada para abrigar a logo oficial
        ctx.fillStyle = 'rgba(10, 31, 29, 0.85)';
        ctx.beginPath();
        ctx.roundRect(46, 46, 172, 187, [12]);
        ctx.fill();
 
        if (logoWorldCup.complete && logoWorldCup.naturalWidth !== 0) {
            // Desenha o Logotipo Oficial da Copa de 2026 enviado
            ctx.drawImage(logoWorldCup, logoX, logoY, logoW, logoH);
        } else {
            // Texto alternativo temporário em vetor se o link externo demorar a carregar
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 26px Montserrat';
            ctx.fillText('FIFA 2026', 132, 140);
        }
 
        // Emblema BRA / Bandeira Nacional (Direita)
        const flagX = W - 190;
        const flagY = 46;
        ctx.fillStyle = '#002776';
        ctx.beginPath();
        ctx.roundRect(flagX, flagY, 140, 155, [12]);
        ctx.fill();
       
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
 
        ctx.fillStyle = '#002776';
        ctx.beginPath();
        ctx.arc(flagX + 70, flagY + 50, 18, 0, Math.PI * 2);
        ctx.fill();
 
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Teko';
        ctx.textAlign = 'center';
        ctx.fillText('BRA', flagX + 70, flagY + 132);
 
        // 5. RODAPÉ (TARJETA DE IDENTIFICAÇÃO)
        const nameBoxY = H - 240;
       
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 8;
 
        ctx.fillStyle = '#ffdf00';
        ctx.beginPath();
        ctx.moveTo(80, nameBoxY);
        ctx.lineTo(W - 80, nameBoxY);
        ctx.lineTo(W - 110, nameBoxY + 150);
        ctx.lineTo(110, nameBoxY + 150);
        ctx.closePath();
        ctx.fill();
 
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
 
        ctx.fillStyle = '#111111';
        ctx.beginPath();
        ctx.moveTo(140, nameBoxY + 95);
        ctx.lineTo(W - 140, nameBoxY + 95);
        ctx.lineTo(W - 155, nameBoxY + 140);
        ctx.lineTo(155, nameBoxY + 140);
        ctx.closePath();
        ctx.fill();
 
        ctx.fillStyle = '#008751';
        ctx.font = 'bold 22px Montserrat';
        ctx.textAlign = 'center';
        ctx.fillText('JOGADOR', W / 2, nameBoxY + 32);
 
        const rawName = inputName.value.trim() || 'SEU NOME';
        ctx.fillStyle = '#002776';
        ctx.font = '900 58px Teko';
        ctx.fillText(rawName.toUpperCase(), W / 2, nameBoxY + 82);
 
        const rawPosition = selectPosition.value;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px Teko';
        ctx.letterSpacing = '2px';
        ctx.fillText(rawPosition, W / 2, nameBoxY + 128);
        ctx.letterSpacing = '0px';
 
        drawFootballIcon(95, H - 120, 28);
        drawFootballIcon(W - 95, H - 120, 28);
    }
 
    function drawFootballIcon(x, y, radius) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#222222';
        ctx.stroke();
 
        ctx.fillStyle = '#222222';
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