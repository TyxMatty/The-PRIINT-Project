"use strict";
const userProfile = {};
// ========================
// MODALS
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
// AI AND SIGN-IN
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
    submitBtn.innerText = translations[currentLang].questAnalyzing;
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
        submitBtn.innerText = translations[currentLang].questFinished;
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
    const form = event.target;
    const submitBtn = form.querySelector('button');
    if (submitBtn) {
        submitBtn.innerText = translations[currentLang].authCreating;
        submitBtn.disabled = true;
    }
    setTimeout(() => {
        const msg = currentLang === 'pt' ? "Conta criada com sucesso!" : "Account created successfully!";
        alert(msg);
    }, 1000);
}
// ==========================================
// TRANSLATION (i18n) 
// ==========================================
const translations = {
    pt: {
        navAbout: "Sobre", navServices: "Equipe", navContact: "Contato",
        a11yTitle: "Personalize a sua interface",
        a11yDesc: "Como prefere visualizar a plataforma para o seu conforto?",
        a11yBtnDefault: "Visual Padrão PRIINT", a11yBtnContrast: "Alto Contraste",
        a11yBtnSoft: "Cores Suaves", a11yBtnTTS: "Ativar Voz (TTS)", a11yBtnSave: "Salvar e Continuar",
        heroBadge: "Acessibilidade & IA 🚀",
        heroSubtitle: "Plataforma de Reconhecimento e Integração de Inteligências Neurodivergentes e Típicas.",
        heroText: "Construímos jornadas de aprendizado que se moldam ao seu cérebro, não o contrário. Descubra como nossa IA adapta o conhecimento para o seu foco.",
        btnStart: "Iniciar Mapeamento", btnSystem: "Conheça o Sistema",
        card1Title: "Sobre o Projeto", card1Text: "O PRIINT nasceu da necessidade de quebrar o modelo educacional padrão. Através de um mapeamento cognitivo, nossa arquitetura adapta formatos, cores e ritmos de estudo para maximizar sua retenção de forma nativa.",
        card2Title: "Nossa Equipe", card2Text: "Unimos metodologias ágeis e engenharia de software para construir interfaces focadas no usuário. Nossa equipe inclui dois neurodivergentes, garantindo que a empatia e a vivência real guiem o desenvolvimento.",
        card3Title: "Inclusão por Design", card3Text: "Não tratamos a acessibilidade como uma funcionalidade extra. Ela é o alicerce do PRIINT. Desde o alto contraste até a leitura de tela nativa, tudo é pensado para reduzir a sobrecarga cognitiva.",
        howTitle: "Como funciona?",
        step1Title: "1. Mapeamento Rápido", step1Text: "Responda a 10 perguntas baseadas em suas preferências visuais e necessidade de pausas.",
        step2Title: "2. Processamento por IA", step2Text: "Nossos algoritmos identificam seu padrão de aprendizagem em milissegundos.",
        step3Title: "3. Trilha Personalizada", step3Text: "Receba o formato ideal de estudo (texto, áudio ou visual) com o ritmo perfeito para você.",
        contactTitle: "Pronto para transformar a educação?", contactText: "Interessado em levar a tecnologia PRIINT para a sua instituição acadêmica ou ser um parceiro no desenvolvimento?",
        btnContact: "Falar com a Equipe",
        authTitle: "Seu perfil está pronto! 🚀",
        authDesc: "Crie uma conta rápida para salvar seu mapeamento cognitivo e gerar seu plano de estudos.",
        authName: "Como prefere ser chamado?", authEmail: "Seu melhor e-mail",
        authPass: "Crie uma senha", authGender: "Qual a sua identidade de gênero?",
        authBtn: "Salvar Meu Perfil e Entrar",
        questTitle: "Mapeamento de Foco e Retenção",
        q1: "1. Consigo manter a concentração ao ler textos longos sem interrupções.",
        q2: "2. A minha aprendizagem melhora quando o conteúdo é dividido em blocos pequenos.",
        q3: "3. Sinto necessidade de fazer pausas frequentes (a cada 15-20 min) para manter o foco.",
        q4: "4. Distraio-me facilmente com muitos elementos visuais, cores ou ícones na tela.",
        q5: "5. Prefiro ouvir uma explicação em áudio do que ler o mesmo conteúdo em texto.",
        q6: "6. Tenho dificuldade em organizar por onde começar a estudar um tema novo.",
        q7: "7. Entendo melhor o conteúdo quando ele é apresentado em tópicos e listas em vez de parágrafos.",
        q8: "8. Sinto cansaço visual rápido ao ler em telas com fundo muito claro ou muito brilhante.",
        q9: "9. Consigo lembrar facilmente do que estudei no dia anterior sem precisar de revisão.",
        q10: "10. Imagens, diagramas e vídeos são essenciais para eu entender conceitos complexos.",
        questSubmitBtn: "Finalizar Mapeamento e Gerar Estudo",
        authCreating: "Criando conta...",
        questFinished: "Concluído!",
        questAnalyzing: "Analisando Perfil..."
    },
    en: {
        navAbout: "About", navServices: "Team", navContact: "Contact",
        a11yTitle: "Customize your interface",
        a11yDesc: "How would you prefer to view the platform for your comfort?",
        a11yBtnDefault: "PRIINT Default Visual", a11yBtnContrast: "High Contrast",
        a11yBtnSoft: "Soft Colors", a11yBtnTTS: "Enable Voice (TTS)", a11yBtnSave: "Save and Continue",
        heroBadge: "Accessibility & AI 🚀",
        heroSubtitle: "Platform for Recognition and Integration of Neurodivergent and Typical Intelligences.",
        heroText: "We build learning journeys that mold to your brain, not the other way around. Discover how our AI adapts knowledge to your focus.",
        btnStart: "Start Mapping", btnSystem: "Discover the System",
        card1Title: "About the Project", card1Text: "PRIINT was born from the need to break the standard educational model. Through cognitive mapping, our architecture adapts formats, colors, and study rhythms to maximize your retention natively.",
        card2Title: "Our Team", card2Text: "We unite agile methodologies and software engineering to build user-focused interfaces. Our team includes two neurodivergent members, ensuring empathy and real experience guide development.",
        card3Title: "Inclusion by Design", card3Text: "We don't treat accessibility as an extra feature. It is the foundation of PRIINT. From high contrast to native screen reading, everything is designed to reduce cognitive overload.",
        howTitle: "How does it work?",
        step1Title: "1. Quick Mapping", step1Text: "Answer 10 questions based on your visual preferences and need for breaks.",
        step2Title: "2. AI Processing", step2Text: "Our algorithms identify your learning pattern in milliseconds.",
        step3Title: "3. Custom Path", step3Text: "Get the ideal study format (text, audio, or visual) with the perfect rhythm for you.",
        contactTitle: "Ready to transform education?", contactText: "Interested in bringing PRIINT technology to your academic institution or partnering in development?",
        btnContact: "Talk to the Team",
        authTitle: "Your profile is ready! 🚀",
        authDesc: "Create a quick account to save your cognitive mapping and generate your study plan.",
        authName: "What should we call you?", authEmail: "Your best email",
        authPass: "Create a password", authGender: "What is your gender identity?",
        authBtn: "Save Profile and Log In",
        questTitle: "Focus and Retention Mapping",
        q1: "1. I can maintain my concentration when reading long texts without interruptions.",
        q2: "2. My learning improves when content is broken down into small blocks.",
        q3: "3. I feel the need to take frequent breaks (every 15-20 min) to maintain focus.",
        q4: "4. I am easily distracted by too many visual elements, colors, or icons on the screen.",
        q5: "5. I prefer to listen to an audio explanation rather than reading the same content in text.",
        q6: "6. I have difficulty organizing where to start studying a new topic.",
        q7: "7. I understand content better when it is presented in bullet points and lists instead of paragraphs.",
        q8: "8. I experience quick visual fatigue when reading on screens with very light or bright backgrounds.",
        q9: "9. I can easily remember what I studied the day before without needing to review.",
        q10: "10. Images, diagrams, and videos are essential for me to understand complex concepts.",
        questSubmitBtn: "Finish Mapping and Generate Study",
        authCreating: "Creating account...",
        questFinished: "Finished!",
        questAnalyzing: "Analyzing Profile..."
    }
};
let currentLang = 'pt';
function changeLanguage(lang) {
    currentLang = lang;
    // Função auxiliar de texto
    const setTxt = (selector, text) => {
        const el = document.querySelector(selector);
        if (el)
            el.innerText = text;
    };
    // Header & Hero
    setTxt('a[href="#sobre"]', translations[lang].navAbout);
    setTxt('a[href="#equipe"]', translations[lang].navServices);
    setTxt('a[href="#contato"]', translations[lang].navContact);
    setTxt('.hero-badge', translations[lang].heroBadge);
    setTxt('.hero-subtitle', translations[lang].heroSubtitle);
    setTxt('.hero-text', translations[lang].heroText);
    setTxt('.hero-actions .primary-btn', translations[lang].btnStart);
    setTxt('.hero-actions .secondary-btn', translations[lang].btnSystem);
    // Cards
    setTxt('#sobre h2', translations[lang].card1Title);
    setTxt('#sobre p', translations[lang].card1Text);
    setTxt('#equipe h2', translations[lang].card2Title);
    setTxt('#equipe p', translations[lang].card2Text);
    setTxt('#inclusao h2', translations[lang].card3Title);
    setTxt('#inclusao p', translations[lang].card3Text);
    // Como Funciona
    setTxt('.section-title', translations[lang].howTitle);
    const steps = document.querySelectorAll('.step-item');
    if (steps.length >= 3) {
        steps[0].querySelector('.marca-texto').innerText = translations[lang].step1Title;
        steps[0].querySelector('p').innerText = translations[lang].step1Text;
        steps[1].querySelector('.marca-texto').innerText = translations[lang].step2Title;
        steps[1].querySelector('p').innerText = translations[lang].step2Text;
        steps[2].querySelector('.marca-texto').innerText = translations[lang].step3Title;
        steps[2].querySelector('p').innerText = translations[lang].step3Text;
    }
    // Contato
    setTxt('.contact-section h2', translations[lang].contactTitle);
    setTxt('.contact-section p', translations[lang].contactText);
    setTxt('.contact-section .primary-btn', translations[lang].btnContact);
    // Modal Acessibilidade
    setTxt('#a11y-title', translations[lang].a11yTitle);
    setTxt('#step-accessibility p', translations[lang].a11yDesc);
    const a11yBtns = document.querySelectorAll('#step-accessibility .btn-group button');
    if (a11yBtns.length >= 4) {
        a11yBtns[0].innerText = translations[lang].a11yBtnDefault;
        a11yBtns[1].innerText = translations[lang].a11yBtnContrast;
        a11yBtns[2].innerText = translations[lang].a11yBtnSoft;
        a11yBtns[3].innerText = translations[lang].a11yBtnTTS;
    }
    setTxt('#step-accessibility .primary-btn', translations[lang].a11yBtnSave);
    // Modal Autenticação
    setTxt('#auth-modal h2', translations[lang].authTitle);
    setTxt('#auth-modal p', translations[lang].authDesc);
    const authInputs = document.querySelectorAll('#auth-form input');
    if (authInputs.length >= 4) {
        authInputs[0].placeholder = translations[lang].authName;
        authInputs[1].placeholder = translations[lang].authEmail;
        authInputs[2].placeholder = translations[lang].authPass;
        authInputs[3].placeholder = translations[lang].authGender;
    }
    setTxt('#auth-form .primary-btn', translations[lang].authBtn);
    setTxt('#form-title', translations[lang].questTitle);
    setTxt('#final-submit-container .primary-btn', translations[lang].questSubmitBtn);
    const legends = document.querySelectorAll('.question-card legend');
    if (legends.length >= 10) {
        legends[0].innerText = translations[lang].q1;
        legends[1].innerText = translations[lang].q2;
        legends[2].innerText = translations[lang].q3;
        legends[3].innerText = translations[lang].q4;
        legends[4].innerText = translations[lang].q5;
        legends[5].innerText = translations[lang].q6;
        legends[6].innerText = translations[lang].q7;
        legends[7].innerText = translations[lang].q8;
        legends[8].innerText = translations[lang].q9;
        legends[9].innerText = translations[lang].q10;
    }
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
// ========================
// ANIMAÇÕES DE SCROLL
// ========================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    const hiddenElements = document.querySelectorAll('.fade-in');
    hiddenElements.forEach((el) => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', initScrollAnimations);
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
window.initScrollAnimations = initScrollAnimations;