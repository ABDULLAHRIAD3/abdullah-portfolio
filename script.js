// Set Current Year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const sections = document.querySelectorAll('section');
const langToggle = document.getElementById('langToggle');

// 1. Sticky Navbar & Active Link
window.addEventListener('scroll', () => {
    let current = '';

    // Sticky Navbar
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll Top Button
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }

    // Highlight Active Section
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 250)) {
            current = section.getAttribute('id');
        }
    });

    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// 2. Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');

    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'fixed';
        navLinks.style.top = '0';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.height = '100vh';
        navLinks.style.background = 'rgba(2, 6, 23, 0.98)';
        navLinks.style.justifyContent = 'center';
        navLinks.style.zIndex = '999';
    }
});

navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        if (window.innerWidth <= 768) {
            navLinks.style.display = 'none';
        }
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'row';
        navLinks.style.position = 'static';
        navLinks.style.height = 'auto';
        navLinks.style.background = 'transparent';
    } else {
        if (!hamburger.classList.contains('active')) {
            navLinks.style.display = 'none';
        }
    }
});

// 3. Scroll to Top
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 4. Reveal Animations via Intersection Observer
const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Unobserve after revealing
        }
    });
};

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

// 5. Language Translation Logic
const translations = {
    en: {
        nav_home: "Home",
        nav_expertise: "Expertise",
        nav_work: "Work",
        nav_experience: "Experience",
        nav_contact: "Contact",
        nav_resume: 'Resume <i class="fa-solid fa-arrow-right"></i>',
        hero_status: "Available for new opportunities",
        hero_title: 'Building <span class="text-gradient">high-performance</span><br> digital systems.',
        hero_desc: "I am Abdullah Riad, a Senior Software Engineer specializing in scalable architectures, modern full-stack development, and solving complex technical challenges at an enterprise level.",
        hero_cta_work: "Explore My Work",
        hero_cta_github: "GitHub Profile",
        skills_title: 'Technical <span class="text-gradient">Expertise</span>',
        skills_subtitle: "A comprehensive toolkit for modern software engineering.",
        bento_frontend_title: "Web Applications",
        bento_frontend_desc: "Building highly interactive, accessible, and performant user interfaces using modern frameworks and standard web APIs.",
        bento_backend_title: "AI Developer",
        bento_backend_desc: "Designing robust APIs, microservices, and monolithic backends optimized for scale and speed.",
        bento_data_title: "Automation Tools",
        bento_data_desc: "Structuring relational and NoSQL databases for high-availability.",
        bento_cloud_title: "Cloud & DevOps",
        bento_cloud_desc: "Automating deployments, CI/CD pipelines, and infrastructure management.",
        projects_title: 'Featured <span class="text-gradient">Projects</span>',
        projects_subtitle: "Selected works that showcase architectural design and technical problem-solving.",
        proj1_badge: "Enterprise Analytics",
        proj1_name: "Nexus Data Platform",
        proj1_desc: "A high-throughput real-time analytics dashboard capable of ingesting and visualizing millions of data points per minute. Built with performance and memory optimization at its core.",
        proj1_metric1: "Faster Queries",
        proj1_metric2: "Events/sec",
        proj_demo: "Live Demo",
        proj_source: "Source Code",
        proj2_badge: "Security Infrastructure",
        proj2_name: "AuthGuard Microservice",
        proj2_desc: "A zero-trust authentication gateway serving multiple frontends. It handles OAuth2 flows, MFA, and intelligent rate limiting using a custom token validation strategy.",
        proj2_source: "View Architecture",
        exp_title: "Professional Journey",
        exp1_role: "Senior Software Engineer",
        exp1_company: "TechNova Systems",
        exp1_desc: "Led the migration from a monolithic legacy system to a highly available microservices architecture. Improved CI/CD pipelines reducing deployment time by 60%.",
        exp2_role: "Full Stack Engineer",
        exp2_company: "Global Digital Innovations",
        exp2_desc: "Developed core application features using React and Node.js. Architected scalable database schemas and integrated third-party payment APIs processing $2M+ monthly.",
        phil_title: "Engineering Philosophy",
        phil1_title: "Simplicity over Complexity",
        phil1_desc: "Code is read more often than it is written. I prioritize clear, maintainable logic over clever but obscure one-liners.",
        phil2_title: "Fail-Safe by Design",
        phil2_desc: "Anticipating failure is key. I implement robust error handling, circuit breakers, and comprehensive testing.",
        phil3_title: "Performance matters",
        phil3_desc: "Every millisecond counts. Profiling, optimizing queries, and strategic caching are always in my workflow.",
        contact_title: "Ready to scale your next project?",
        contact_desc: "I'm currently evaluating new opportunities. Let's discuss how my expertise can align with your engineering goals.",
        contact_linkedin: "LinkedIn",
        contact_github: "GitHub",
        contact_twitter: "X (Twitter)",
        footer_credits: "Engineered with precision.",
        footer_status: "All systems operational"
    },
    ar: {
        nav_home: "الرئيسية",
        nav_expertise: "الخبرات",
        nav_work: "الأعمال",
        nav_experience: "المسيرة",
        nav_contact: "تواصل معي",
        nav_resume: 'السيرة الذاتية <i class="fa-solid fa-arrow-left"></i>',
        hero_status: "متاح لفرص جديدة",
        hero_title: 'بناء أنظمة رقمية <br> <span class="text-gradient">عالية الأداء</span>.',
        hero_desc: "أنا عبدالله رياض، مهندس برمجيات أول متخصص في البنى البرمجية القابلة للتوسع، وتطوير الويب الحديث، وحل التحديات التقنية المعقدة على مستوى المؤسسات.",
        hero_cta_work: "استكشف أعمالي",
        hero_cta_github: "حسابي على جيت هاب",
        skills_title: 'الخبرات <span class="text-gradient">التقنية</span>',
        skills_subtitle: "مجموعة أدوات متكاملة لهندسة البرمجيات الحديثة.",
        bento_frontend_title: "تطبيقات الويب",
        bento_frontend_desc: "بناء واجهات تفاعلية وسريعة وسهلة الوصول باستخدام أحدث إطارات العمل وتقنيات الويب القياسية.",
        bento_backend_title: "تطوير الذكاء الاصطناعي",
        bento_backend_desc: "تصميم واجهات برمجية قوية وخدمات مصغرة محسنة للسرعة والتوسع للتعامل مع الأحمال العالية.",
        bento_data_title: "أدوات الأتمتة",
        bento_data_desc: "هيكلة قواعد البيانات العلائقية وغير العلائقية بطريقة تضمن التوافر والموثوقية العالية.",
        bento_cloud_title: "السحابة والعمليات",
        bento_cloud_desc: "أتمتة النشر وخطوات التكامل المستمر (CI/CD) وإدارة البنية التحتية بكفاءة.",
        projects_title: 'أبرز <span class="text-gradient">المشاريع</span>',
        projects_subtitle: "أعمال مختارة توضح جودة التصميم المعماري والقدرة على حل المشكلات التقنية الصعبة.",
        proj1_badge: "تحليلات المؤسسات",
        proj1_name: "منصة بيانات نكسس",
        proj1_desc: "لوحة تحكم للتحليلات اللحظية واستيعاب وعرض ملايين البيانات في الدقيقة. تم بناؤها بالأساس مع مراعاة تحسين الأداء والذاكرة.",
        proj1_metric1: "استعلامات أسرع",
        proj1_metric2: "حدث/ثانية",
        proj_demo: "معاينة حية",
        proj_source: "الكود المصدري",
        proj2_badge: "البنية التحتية الأمنية",
        proj2_name: "خدمة AuthGuard",
        proj2_desc: "بوابة مصادقة تدعم جبهات متعددة. تتعامل مع تدفقات OAuth2 والمصادقة الثنائية وتحديد معدل الطلبات باستخدام استراتيجية مخصصة.",
        proj2_source: "عرض البنية",
        exp_title: "المسيرة المهنية",
        exp1_role: "مهندس برمجيات أول",
        exp1_company: "أنظمة تيك نوفا (TechNova)",
        exp1_desc: "قيادة الانتقال من النظام الموحد القديم إلى بنية الخدمات المصغرة (Microservices). تحسين خطوط النشر الآلي لتقليص وقت النشر بنسبة 60٪.",
        exp2_role: "مهندس برمجيات متكامل",
        exp2_company: "الابتكارات الرقمية العالمية",
        exp2_desc: "تطوير ميزات التطبيق الأساسية باستخدام React و Node.js. تصميم مخططات قواعد البيانات وربط بوابات دفع تعالج أكثر من مليونين دولار شهريًا.",
        phil_title: "الفلسفة الهندسية",
        phil1_title: "البساطة بدلاً من التعقيد",
        phil1_desc: "الكود يُقرأ أكثر مما يُكتب. أُفضل المنطق الواضح والقابل للصيانة على الأسطر البرمجية المعقدة غير المفهومة.",
        phil2_title: "تصميم مقاوم للأعطال",
        phil2_desc: "توقع الفشل هو الأساس. أقوم بتنفيذ معالجة قوية للأخطاء واختبارات شاملة وأنظمة حماية مساعدة لتجنب التوقف.",
        phil3_title: "الأداء له أهميته",
        phil3_desc: "كل جزء من الثانية مهم. تحليل الأداء، وتحسين الاستعلامات والتخزين المؤقت الاستراتيجي دائمًا جزء من عملي.",
        contact_title: "هل أنت مستعد لمشروعك القادم؟",
        contact_desc: "أنا بالوقت الحالي أستكشف الفرص الجديدة والطلبات. دعنا نناقش كيف يمكن لخبراتي أن تتناسب وتفيد أهداف مؤسستك الهندسية.",
        contact_linkedin: "لينكد إن (LinkedIn)",
        contact_github: "جيت هاب (GitHub)",
        contact_twitter: "إكس (X)",
        footer_credits: "صُنع بدقة وإتقان.",
        footer_status: "جميع الأنظمة تعمل بكفاءة"
    }
};

let currentLang = 'en';

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    const htmlEl = document.documentElement;

    // Update language direction and attributes
    htmlEl.setAttribute('lang', currentLang);
    htmlEl.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

    // Update button content
    if (currentLang === 'ar') {
        langToggle.innerHTML = 'English <i class="fa-solid fa-globe"></i>';
    } else {
        langToggle.innerHTML = 'عربي <i class="fa-solid fa-globe"></i>';
    }

    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });

    // Refresh scroll animations
    document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('active'); // forcefully show them so content doesn't break
    });
});
