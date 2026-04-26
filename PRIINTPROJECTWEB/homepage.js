"use strict";
// ==========================================
// 1. ESTADO GLOBAL E VARIÁVEIS 
// ==========================================
const userProfile = {};
let currentLang = localStorage.getItem("lang") || 'pt';
let ttsEnabled = false;
// ==========================================
// 2. MÓDULO DE INTERNACIONALIZAÇÃO
// ==========================================
const translations = {
    navAbout: { pt: "Sobre", en: "About" },
    navServices: { pt: "Equipe", en: "Team" },
    navContact: { pt: "Contato", en: "Contact" },
    a11yTitle: { pt: "Personalize a sua interface", en: "Customize your interface" },
    a11yDesc: { pt: "Como prefere visualizar a plataforma para o seu conforto?", en: "How would you prefer to view the platform for your comfort?" },
    a11yBtnDefault: { pt: "Visual Padrão PRIINT", en: "PRIINT Default Visual" },
    a11yBtnContrast: { pt: "Alto Contraste", en: "High Contrast" },
    a11yBtnSoft: { pt: "Cores Suaves", en: "Soft Colors" },
    a11yBtnTTS: { pt: "Ativar Voz (TTS)", en: "Enable Voice (TTS)" },
    a11yBtnSave: { pt: "Salvar e Continuar", en: "Save and Continue" },
    heroBadge: { pt: "Acessibilidade & IA 🚀", en: "Accessibility & AI 🚀" },
    heroTitle: { pt: "O projeto <span>PRIINT</span>", en: "The <span>PRIINT</span> Project" },
    heroSubtitle: { pt: "Projeto de Integração Internacional Tecnológica.", en: "Project for International Technological Integration." },
    heroText: { pt: "Construímos jornadas de aprendizado que se moldam ao seu cérebro, não o contrário. Descubra como nossa IA adapta o conhecimento para o seu foco.", en: "We build learning journeys that mold to your brain, not the other way around. Discover how our AI adapts knowledge to your focus." },
    btnStart: { pt: "Iniciar Mapeamento", en: "Start Mapping" },
    btnSystem: { pt: "Conheça o Sistema", en: "Discover the System" },
    card1Title: { pt: "Sobre o Projeto", en: "About the Project" },
    card1Text: { pt: "O PRIINT nasceu da necessidade de quebrar o modelo educacional padrão. Através de um mapeamento cognitivo, nossa arquitetura adapta formatos, cores e ritmos de estudo para maximizar sua retenção de forma nativa.", en: "PRIINT was born from the need to break the standard educational model. Through cognitive mapping, our architecture adapts formats, colors, and study rhythms to maximize your retention natively." },
    card2Title: { pt: "Nossa Equipe", en: "Our Team" },
    card2Text: { pt: "Unimos metodologias ágeis e engenharia de software para construir interfaces focadas no usuário. Nossa equipe inclui dois neurodivergentes, garantindo que a empatia e a vivência real guiem o desenvolvimento.", en: "We unite agile methodologies and software engineering to build user-focused interfaces. Our team includes two neurodivergences, ensuring empathy and real experience guide development." },
    card3Title: { pt: "Inclusão por Design", en: "Inclusion by Design" },
    card3Text: { pt: "Não tratamos a acessibilidade como uma funcionalidade extra. Ela é o alicerce do PRIINT. Desde o alto contraste até a leitura de tela nativa, tudo é pensado para reduzir a sobrecarga cognitiva.", en: "We don't treat accessibility as an extra feature. It is the foundation of PRIINT. From high contrast to native screen reading, everything is designed to reduce cognitive overload." },
    howTitle: { pt: "Como funciona?", en: "How does it work?" },
    step1Title: { pt: "1. Mapeamento Rápido", en: "1. Quick Mapping" },
    step1Text: { pt: "Responda a 10 perguntas baseadas em suas preferências visuais e necessidade de pausas.", en: "Answer 10 questions based on your visual preferences and need for breaks." },
    step2Title: { pt: "2. Processamento por IA", en: "2. AI Processing" },
    step2Text: { pt: "Nossos algoritmos identificam seu padrão de aprendizagem em milissegundos.", en: "Our algorithms identify your learning pattern in milliseconds." },
    step3Title: { pt: "3. Trilha Personalizada", en: "3. Custom Path" },
    step3Text: { pt: "Receba o formato ideal de estudo (texto, áudio ou visual) com o ritmo perfeito para você.", en: "Get the ideal study format (text, audio, or visual) with the perfect rhythm for you." },
    longExp: { pt: "O cérebro humano não aprende de forma linear. Enquanto alguns retêm mais informações com blocos de texto e silêncio absoluto, outros precisam de estímulos visuais, gamificação e pausas estruturadas (como a técnica Pomodoro). O PRIINT elimina a frustração de tentar se encaixar em um método que não foi feito para você.", en: "The human brain doesn't learn linearly. While some retain more information with text blocks and absolute silence, others need visual stimuli, gamification, and structured breaks (like the Pomodoro technique). PRIINT eliminates the frustration of trying to fit into a method that wasn't made for you." },
    contactTitle: { pt: "Pronto para transformar a educação?", en: "Ready to transform education?" },
    contactText: { pt: "Interessado em levar a tecnologia PRIINT para a sua instituição acadêmica ou ser um parceiro no desenvolvimento?", en: "Interested in bringing PRIINT technology to your academic institution or partnering in development?" },
    btnContact: { pt: "Falar com a Equipe", en: "Talk to the Team" },
    authTitle: { pt: "Seu perfil está pronto! 🚀", en: "Your profile is ready! 🚀" },
    authDesc: { pt: "Crie uma conta rápida para salvar seu mapeamento cognitivo e gerar seu plano de estudos.", en: "Create a quick account to save your cognitive mapping and generate your study plan." },
    authName: { pt: "Como prefere ser chamado?", en: "What should we call you?" },
    authEmail: { pt: "Seu melhor e-mail", en: "Your best email" },
    authPass: { pt: "Crie uma senha", en: "Create a password" },
    authGender: { pt: "Qual a sua identidade de gênero?", en: "What is your gender identity?" },
    authBtn: { pt: "Salvar Meu Perfil e Entrar", en: "Save Profile and Log In" },
    questTitle: { pt: "Mapeamento de Foco e Retenção", en: "Focus and Retention Mapping" },
    q1: { pt: "1. Consigo manter a concentração ao ler textos longos sem interrupções.", en: "1. I can maintain my concentration when reading long texts without interruptions." },
    q2: { pt: "2. A minha aprendizagem melhora quando o conteúdo é dividido em blocos pequenos.", en: "2. My learning improves when content is broken down into small blocks." },
    q3: { pt: "3. Sinto necessidade de fazer pausas frequentes (a cada 15-20 min) para manter o foco.", en: "3. I feel the need to take frequent breaks (every 15-20 min) to maintain focus." },
    q4: { pt: "4. Distraio-me facilmente com muitos elementos visuais, cores ou ícones na tela.", en: "4. I am easily distracted by too many visual elements, colors, or icons on the screen." },
    q5: { pt: "5. Prefiro ouvir uma explicação em áudio do que ler o mesmo conteúdo em texto.", en: "5. I prefer to listen to an audio explanation rather than reading the same content in text." },
    q6: { pt: "6. Tenho dificuldade em organizar por onde começar a estudar um tema novo.", en: "6. I have difficulty organizing where to start studying a new topic." },
    q7: { pt: "7. Entendo melhor o conteúdo quando ele é apresentado em tópicos e listas em vez de parágrafos.", en: "7. I understand content better when it is presented in bullet points and lists instead of paragraphs." },
    q8: { pt: "8. Sinto cansaço visual rápido ao ler em telas com fundo muito claro ou muito brilhante.", en: "8. I experience quick visual fatigue when reading on screens with very light or bright backgrounds." },
    q9: { pt: "9. Consigo lembrar facilmente do que estudei no dia anterior sem precisar de revisão.", en: "9. I can easily remember what I studied the day before without needing to review." },
    q10: { pt: "10. Imagens, diagramas e vídeos são essenciais para eu entender conceitos complexos.", en: "10. Images, diagrams, and videos are essential for me to understand complex concepts." },
    questSubmitBtn: { pt: "Finalizar Mapeamento e Gerar Estudo", en: "Finish Mapping and Generate Study" },
    authCreating: { pt: "Criando conta...", en: "Creating account..." },
    questFinished: { pt: "Concluído!", en: "Finished!" },
    questAnalyzing: { pt: "Analisando Perfil...", en: "Analyzing Profile..." },
    scaleMin: { pt: "1 - Ruim", en: "1 - Poor" },
    scaleMax: { pt: "10 - Excepcional", en: "10 - Exceptional" },
    scaleExplanation: { pt: "Onde 1 significa que você discorda totalmente ou acha muito ruim, e 10 significa que você concorda totalmente ou acha excepcional.", en: "Where 1 means you completely disagree or find it poor, and 10 means you completely agree or find it exceptional." },
    warningExit: { pt: "Tem certeza que deseja sair? Todo o seu progresso no mapeamento será perdido.", en: "Are you sure you want to leave? All your mapping progress will be lost." }
};
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (key && translations[key]) {
            if (el.tagName === 'INPUT') {
                el.placeholder = translations[key][lang];
            }
            else {
                el.innerHTML = translations[key][lang];
            }
        }
    });
    const langBtn = document.getElementById("btn-lang-toggle");
    if (langBtn) {
        langBtn.innerText = lang === "pt" ? "EN" : "PT";
        langBtn.setAttribute("aria-label", lang === "pt" ? "Switch to English" : "Mudar para Português");
    }
    document.querySelectorAll('.label-min').forEach(el => el.innerText = translations.scaleMin[lang]);
    document.querySelectorAll('.label-max').forEach(el => el.innerText = translations.scaleMax[lang]);
}
function toggleLanguage() {
    setLanguage(currentLang === 'pt' ? 'en' : 'pt');
}
// ==========================================
// 3. TTS (LEITOR DE VOZ E SOTAQUES)
// ==========================================
function speakText(text) {
    if (!ttsEnabled || !text)
        return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    const targetLangCode = currentLang === 'pt' ? 'pt-BR' : 'en-US';
    msg.lang = targetLangCode;
    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
        const exactVoice = voices.find(v => v.lang === targetLangCode || v.lang === targetLangCode.replace('-', '_'));
        const generalVoice = voices.find(v => v.lang.toLowerCase().startsWith(currentLang));
        if (exactVoice) {
            msg.voice = exactVoice;
        }
        else if (generalVoice) {
            msg.voice = generalVoice;
        }
    }
    msg.rate = 1.0;
    window.speechSynthesis.speak(msg);
}
function enableTTS() {
    if ('speechSynthesis' in window) {
        ttsEnabled = !ttsEnabled;
        const btn = document.getElementById('btn-tts');
        if (ttsEnabled) {
            if (btn) {
                btn.style.backgroundColor = 'var(--text-color)';
                btn.style.color = '#000';
            }
            const title = document.getElementById('a11y-title')?.innerText || "";
            const desc = document.querySelector('#step-accessibility p')?.innerText || "";
            speakText(title + ". " + desc);
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
function attachHoverTTS() {
    const interactables = document.querySelectorAll('button, a');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            if (!ttsEnabled || window.speechSynthesis.speaking)
                return;
            const target = e.currentTarget;
            let textToRead = target.innerText.trim();
            if (!textToRead) {
                textToRead = target.getAttribute('aria-label') || "";
            }
            if (textToRead) {
                const msg = new SpeechSynthesisUtterance(textToRead);
                msg.lang = currentLang === 'pt' ? 'pt-BR' : 'en-US';
                window.speechSynthesis.speak(msg);
            }
        });
    });
}
// ==========================================
// 4. LÓGICA DE INTERFACE, FUGAS E QUESTIONÁRIO
// ==========================================
// Função Mestra para Resetar o App (Fuga do Questionário ou Fechar Modal)
function resetApp() {
    const homepageContent = document.getElementById('homepage-content');
    const questionnaireSection = document.getElementById('step-questionnaire');
    const authModal = document.getElementById('auth-modal');
    const submitContainer = document.getElementById('final-submit-container');
    // Restaura as visibilidades
    if (homepageContent)
        homepageContent.style.display = 'block';
    if (questionnaireSection)
        questionnaireSection.style.display = 'none';
    if (authModal)
        authModal.style.display = 'none';
    if (submitContainer)
        submitContainer.style.display = 'none';
    // Limpa a memória das respostas
    for (let key in userProfile)
        delete userProfile[key];
    // Reseta visualmente as bolinhas
    document.querySelectorAll('.scale-btn').forEach(btn => btn.classList.remove('selected'));
    // Reseta os cards para a primeira pergunta
    const cards = document.querySelectorAll('.question-card');
    cards.forEach((card, index) => {
        if (index === 0)
            card.classList.add('active');
        else
            card.classList.remove('active');
    });
    // Restaura o botão de Enviar Mapeamento
    const submitBtn = document.querySelector('#final-submit-container .primary-btn');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = translations.questSubmitBtn[currentLang];
        submitBtn.style.backgroundColor = "var(--primary-color)";
        submitBtn.style.color = "#19245b";
    }
    // Limpa o formulário de login se tiver algo escrito
    const authForm = document.getElementById('auth-form');
    if (authForm)
        authForm.reset();
    // Se o TTS estava falando a pergunta, cala a boca
    if (ttsEnabled)
        window.speechSynthesis.cancel();
}
// Função que intercepta cliques no Header
function handleHomeNavigation(event, targetId) {
    const questionnaireSection = document.getElementById('step-questionnaire');
    // Se o usuário clicou no header MAS está dentro do questionário
    if (questionnaireSection && questionnaireSection.style.display !== 'none') {
        event.preventDefault(); // Impede o clique normal
        // Pergunta se ele quer mesmo perder os dados
        if (confirm(translations.warningExit[currentLang])) {
            resetApp();
            // Depois de resetar, leva ele para onde ele queria ir
            if (targetId !== 'top') {
                setTimeout(() => {
                    const target = document.getElementById(targetId);
                    if (target)
                        target.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
            else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }
    else {
        // Se já estiver na homepage, apenas rola para o topo se clicar na logo
        if (targetId === 'top') {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}
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
function setTheme(theme) {
    document.body.classList.remove('high-contrast', 'low-stimulus');
    if (theme !== 'default')
        document.body.classList.add(theme);
}
function goToQuestionnaire() {
    const homepageContent = document.getElementById('homepage-content');
    const questionnaireSection = document.getElementById('step-questionnaire');
    if (homepageContent && questionnaireSection) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        homepageContent.style.display = 'none';
        questionnaireSection.style.display = 'block';
        setTimeout(() => {
            const activeLegend = document.querySelector('.question-card.active legend');
            if (activeLegend && ttsEnabled) {
                speakText(activeLegend.innerText + ". " + translations.scaleExplanation[currentLang]);
            }
        }, 500);
    }
}
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
            btn.addEventListener('click', () => {
                if (questionId) {
                    userProfile[questionId] = i;
                    console.log("Perfil parcial:", userProfile);
                    container.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    setTimeout(() => {
                        if (questionCards[index])
                            questionCards[index].classList.remove('active');
                        if (index + 1 < questionCards.length) {
                            questionCards[index + 1].classList.add('active');
                            const nextText = questionCards[index + 1].querySelector('legend')?.innerText;
                            if (nextText)
                                speakText(nextText);
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
        const labelsDiv = document.createElement('div');
        labelsDiv.className = 'scale-labels';
        labelsDiv.innerHTML = `<span class="label-min">${translations.scaleMin[currentLang]}</span><span class="label-max">${translations.scaleMax[currentLang]}</span>`;
        container.parentElement?.appendChild(labelsDiv);
    });
}
async function submitToAI(event) {
    event.preventDefault();
    const answeredCount = Object.keys(userProfile).length;
    if (answeredCount < 10) {
        const msg = currentLang === 'pt' ? `Você respondeu apenas ${answeredCount} perguntas de 10.` : `You answered only ${answeredCount} out of 10 questions.`;
        alert(msg);
        speakText(msg);
        return;
    }
    const payload = { userId: "placeholder", timestamp: new Date().toISOString(), retentionProfile: userProfile };
    const submitBtn = document.querySelector('#final-submit-container .primary-btn');
    if (!submitBtn)
        return;
    const originalText = submitBtn.innerText;
    submitBtn.innerText = translations.questAnalyzing[currentLang];
    submitBtn.disabled = true;
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!response.ok)
            throw new Error("Falha no servidor.");
        submitBtn.innerText = translations.questFinished[currentLang];
        submitBtn.style.backgroundColor = "#ffbd59";
        submitBtn.style.color = "#19245b";
        speakText(translations.questFinished[currentLang]);
        setTimeout(() => {
            const modal = document.getElementById('auth-modal');
            console.log('✅ Perfil Cognitivo enviado com sucesso:', payload);
            if (modal) {
                modal.style.display = 'flex';
                speakText(translations.authTitle[currentLang]);
            }
        }, 1500);
    }
    catch (error) {
        alert("Erro ao conectar.");
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}
function finalizeRegistration(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button');
    if (submitBtn) {
        submitBtn.innerText = translations.authCreating[currentLang];
        submitBtn.disabled = true;
    }
    setTimeout(() => {
        const msg = currentLang === 'pt' ? "Conta criada com sucesso!" : "Account created successfully!";
        alert(msg);
        // Chama o ResetApp para fechar a tela e voltar o usuário para a Home após concluir!
        resetApp();
    }, 1500);
}
// ==========================================
// 5. INICIALIZAÇÃO E EXPORTAÇÃO GLOBAL
// ==========================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    openA11yModal();
    generateScaleButtons();
    initScrollAnimations();
    attachHoverTTS();
});
// Vincula todas as funções globais para que o HTML consiga enxergá-las sem problemas
window.toggleLanguage = toggleLanguage;
window.enableTTS = enableTTS;
window.goToQuestionnaire = goToQuestionnaire;
window.submitToAI = submitToAI;
window.finalizeRegistration = finalizeRegistration;
window.openA11yModal = openA11yModal;
window.closeA11yModal = closeA11yModal;
window.setTheme = setTheme;
window.handleHomeNavigation = handleHomeNavigation;
window.resetApp = resetApp;
