"use strict";
const userProfile = {};
// ========================
// CONTROLE DE TELAS E MODAIS
// ========================
function openA11yModal() {
    const modal = document.getElementById('step-accessibility');
    if (modal)
        modal.style.display = 'flex';
}
function closeA11yModal() {
    const modal = document.getElementById('step-accessibility');
    if (modal)
        modal.style.display = 'none';
}
function goToQuestionnaire() {
    const homepageContent = document.getElementById('homepage-content');
    const questionnaireSection = document.getElementById('step-questionnaire');
    if (homepageContent && questionnaireSection) {
        homepageContent.style.display = 'none';
        questionnaireSection.style.display = 'block';
        setTimeout(() => {
            if (typeof window.readCurrentScreen === 'function') {
                window.readCurrentScreen();
            }
        }, 300);
    }
}
function setTheme(theme) {
    document.body.classList.remove('high-contrast', 'low-stimulus');
    if (theme !== 'default') {
        document.body.classList.add(theme);
    }
}
// ========================
// QUESTIONNAIRE 
// ========================
function generateScaleButtons() {
    const scaleContainers = document.querySelectorAll('.scale-1-to-10');
    const questionCards = document.querySelectorAll('.question-card');
    scaleContainers.forEach((container, index) => {
        const questionId = container.getAttribute('data-question');
        for (let i = 1; i <= 10; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'scale-btn';
            btn.innerText = i.toString();
            btn.setAttribute('data-val', i.toString());
            if (i === 1)
                btn.setAttribute('aria-label', '1 - Discordo Totalmente');
            if (i === 10)
                btn.setAttribute('aria-label', '10 - Concordo Totalmente');
            btn.addEventListener('click', () => {
                if (questionId) {
                    userProfile[questionId] = i;
                    console.log("Perfil atualizado:", userProfile);
                    container.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    setTimeout(() => {
                        if (questionCards[index])
                            questionCards[index].classList.remove('active');
                        if (index + 1 < questionCards.length) {
                            questionCards[index + 1].classList.add('active');
                            setTimeout(() => { window.readCurrentScreen(); }, 100);
                        }
                        else {
                            const submitContainer = document.getElementById('final-submit-container');
                            if (submitContainer)
                                submitContainer.style.display = 'block';
                        }
                    }, 400);
                }
            });
            container.appendChild(btn);
        }
    });
}
generateScaleButtons();
// =====================
// AI E CADASTRO
// =====================
async function submitToAI(event) {
    event.preventDefault();
    const answeredCount = Object.keys(userProfile).length;
    // Adaptado para 3 perguntas nesta versão
    if (answeredCount < 3) {
        alert(`Você respondeu apenas ${answeredCount} perguntas. Por favor, volte e preencha todas.`);
        return;
    }
    const payload = {
        userId: "placeholder",
        timestamp: new Date().toISOString(),
        retentionProfile: userProfile
    };
    console.log("Back-end recebendo:", payload);
    const submitBtn = document.querySelector('#final-submit-container .primary-btn');
    if (!submitBtn)
        return;
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Analisando Perfil...";
    submitBtn.disabled = true;
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok)
            throw new Error("Falha no servidor.");
        const dataFromServer = await response.json();
        console.log("Resposta IA:", dataFromServer);
        submitBtn.innerText = "Concluído!";
        submitBtn.style.backgroundColor = "#ffbd59";
        submitBtn.style.color = "#19245b";
        setTimeout(() => {
            const modal = document.getElementById('auth-modal');
            if (modal)
                modal.style.display = 'flex';
        }, 1500);
    }
    catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar.");
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}
function finalizeRegistration(event) {
    event.preventDefault();
    const btn = event.target;
    const submitBtn = btn.querySelector('button');
    if (submitBtn) {
        submitBtn.innerText = "Criando conta...";
        submitBtn.disabled = true;
    }
    setTimeout(() => {
        alert("Sucesso! Apresentação concluída. Redirecionando para o Dashboard...");
    }, 1000);
}
// ==========================================
// TRANSLATION (i18n)
// ==========================================
const translations = {
    pt: {
        title: "O projeto PRIINT",
        navAbout: "Sobre",
        navServices: "Serviços",
        navContact: "Contato",
        a11yTitle: "Personalize a sua interface",
        a11yDesc: "Como prefere visualizar a plataforma para o seu conforto?",
        btnAdvance: "Avançar"
    },
    en: {
        title: "The PRIINT Project",
        navAbout: "About",
        navServices: "Services",
        navContact: "Contact",
        a11yTitle: "Customize your interface",
        a11yDesc: "How would you prefer to view the platform for your comfort?",
        btnAdvance: "Next"
    }
};
let currentLang = 'pt';
function changeLanguage(lang) {
    currentLang = lang;
    const h1 = document.querySelector('h1');
    if (h1)
        h1.innerText = translations[lang].title;
    const aboutLink = document.querySelector('a[href="#sobre"]');
    if (aboutLink)
        aboutLink.innerText = translations[lang].navAbout;
    const servicesLink = document.querySelector('a[href="#equipe"]'); // Ajustado para equipe
    if (servicesLink)
        servicesLink.innerText = translations[lang].navServices;
    const contactLink = document.querySelector('a[href="#contato"]');
    if (contactLink)
        contactLink.innerText = translations[lang].navContact;
    const a11yTitle = document.getElementById('a11y-title');
    if (a11yTitle)
        a11yTitle.innerText = translations[lang].a11yTitle;
    const a11yDesc = document.querySelector('#step-accessibility p');
    if (a11yDesc)
        a11yDesc.innerText = translations[lang].a11yDesc;
    console.log(`🌐 Idioma alterado para: ${lang.toUpperCase()}`);
}
// ==================
// TTS(TEXT-TO-SPEECH)
// ==================
let ttsEnabled = false;
function enableTTS() {
    if ('speechSynthesis' in window) {
        ttsEnabled = !ttsEnabled;
        const btn = document.querySelector('button[onclick="enableTTS()"]');
        if (ttsEnabled) {
            if (btn) {
                btn.style.backgroundColor = 'var(--text-color)';
                btn.style.color = '#000';
            }
            readCurrentScreen();
        }
        else {
            window.speechSynthesis.cancel();
            if (btn) {
                btn.style.backgroundColor = 'var(--button-bg)';
                btn.style.color = 'var(--button-text)';
            }
        }
    }
    else {
        alert("Desculpe, o seu navegador não suporta leitura de tela nativa.");
    }
}
function readCurrentScreen() {
    if (!ttsEnabled)
        return;
    window.speechSynthesis.cancel();
    let textToRead = "";
    const a11ySection = document.getElementById('step-accessibility');
    const questSection = document.getElementById('step-questionnaire');
    if (a11ySection && a11ySection.style.display !== 'none') {
        const title = document.getElementById('a11y-title')?.innerText || "";
        const desc = document.querySelector('#step-accessibility p')?.innerText || "";
        textToRead = title + ". " + desc;
    }
    else if (questSection && questSection.style.display !== 'none') {
        const activeLegend = document.querySelector('.question-card.active legend');
        if (activeLegend) {
            textToRead = activeLegend.innerText;
        }
    }
    if (textToRead) {
        const msg = new SpeechSynthesisUtterance(textToRead);
        msg.lang = currentLang === 'pt' ? 'pt-BR' : 'en-US';
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
    }
}
// PONTE GLOBAL
window.changeLanguage = changeLanguage;
window.enableTTS = enableTTS;
window.readCurrentScreen = readCurrentScreen;
window.goToQuestionnaire = goToQuestionnaire;
window.submitToAI = submitToAI;
window.finalizeRegistration = finalizeRegistration;
window.openA11yModal = openA11yModal;
window.closeA11yModal = closeA11yModal;
window.setTheme = setTheme;
