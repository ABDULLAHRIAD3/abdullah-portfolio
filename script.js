// Set Current Year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');
const navClose = document.getElementById('navClose');
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
function openMenu() {
    hamburger.classList.add('active');
    if (navMenu) navMenu.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scroll
}

function closeMenu() {
    hamburger.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
}

if (hamburger) {
    hamburger.addEventListener('click', () => {
        if (navMenu && navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
}

if (navClose) navClose.addEventListener('click', closeMenu);
if (navOverlay) navOverlay.addEventListener('click', closeMenu);

navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) { // Close on link click for mobile/tablet
            closeMenu();
        }
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && navMenu && navMenu.classList.contains('active')) {
        closeMenu(); // Auto-close if resized to desktop
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
        proj_details: "View Details",
        proj_overview: "Overview & Architecture",
        proj_features: "Key Features",
        proj_stack: "Technology Stack",
        proj1_badge: "AI Learning Platform",
        proj1_name: "Personal AI Learning Coach",
        proj1_desc: "An AI-powered learning platform that transforms PDFs and study materials into an adaptive learning experience using RAG, AI tutoring, mastery tracking, and personalized recommendations.",
        proj1_desc_full: "An AI-powered learning platform that transforms PDFs and study materials into an adaptive learning experience using RAG, AI tutoring, mastery tracking, and personalized recommendations.",
        proj1_overview_desc: "This project revolutionizes self-study by utilizing modern web technologies and generative AI to create a truly personalized learning experience. By uploading raw study materials such as PDFs, the system utilizes Retrieval-Augmented Generation (RAG) to process the content, index it, and build a customized, interactive curriculum tailored to the user's pace and comprehension level.",
        proj1_feat1: "AI Tutoring with conversational guidance",
        proj1_feat2: "Mastery and mistake tracking algorithms",
        proj1_feat3: "Spaced repetition for long-term retention",
        proj1_feat4: "Personalized study and review recommendations",

        proj2_badge: "Python Automation",
        proj2_name: "Smart Desktop File Organizer",
        proj2_desc: "A Python automation tool with CLI and GUI interfaces that automatically organizes messy folders based on file type or modification date while preventing accidental overwrites.",
        proj2_desc_full: "A Python automation tool with CLI and GUI interfaces that automatically organizes messy folders based on file type or modification date while preventing accidental overwrites.",
        proj2_overview_desc: "Dealing with cluttered download folders and desktops is a universal problem. This tool automates the tedious process of categorizing and moving files. It features two user interfaces: a robust Command Line Interface (CLI) for power users and automation scripts, and a graphical interface (GUI) built with Tkinter for everyday use.",
        proj2_feat1: "Intelligent file categorization by extension and type",
        proj2_feat2: "Date-based organization modes",
        proj2_feat3: "Duplicate protection and safe file handling",
        proj2_feat4: "Dry-run mode for testing and detailed logging",

        proj3_badge: "Data Visualization",
        proj3_name: "Financial Analysis Dashboard",
        proj3_desc: "An interactive financial analytics dashboard that processes Arabic financial datasets and provides KPIs, risk segmentation, debt analysis, and Excel exports.",
        proj3_desc_full: "An interactive financial analytics dashboard that processes Arabic financial datasets and provides KPIs, risk segmentation, debt analysis, and Excel exports.",
        proj3_overview_desc: "This analytical tool is designed to process and visualize complex financial data seamlessly. Built using Python's Dash and Plotly frameworks, it effectively handles large CSV datasets, specifically catering to Arabic data encodings. It turns raw tabular data into actionable business intelligence through highly interactive dashboards and KPI summaries.",
        proj3_feat1: "Interactive KPI Dashboards and Data Visualizations",
        proj3_feat2: "Seamless processing of Arabic CSV datasets",
        proj3_feat3: "Risk segmentation and detailed debt analysis",
        proj3_feat4: "Automated Excel report generation",
        gallery_title: "Project Screenshots",
        ai_gal_t1: "AI Learning Dashboard",
        ai_gal_d1: "Centralized view of learning progress, mastery levels, and study recommendations.",
        ai_gal_t2: "Document Processing",
        ai_gal_d2: "Upload PDFs and transform study materials into structured learning content.",
        ai_gal_t3: "Interactive AI Tutor",
        ai_gal_d3: "Engage in conversational learning to clarify doubts and reinforce concepts.",
        ai_gal_t4: "Mistake Tracking",
        ai_gal_d4: "Automatically identify weak points and schedule spaced repetition reviews.",
        ai_gal_t5: "Personalized Curriculum",
        ai_gal_d5: "Dynamic study paths tailored to individual pacing and comprehension.",
        fo_gal_t1: "Main User Interface",
        fo_gal_d1: "Clean Tkinter-based graphical interface for effortless desktop file organization.",
        fo_gal_t2: "CLI Execution",
        fo_gal_d2: "Robust command-line interface with detailed logging for power users.",
        fo_gal_t3: "Extension Settings",
        fo_gal_d3: "Easily configure custom file extensions and categorization rules.",
        fo_gal_t4: "Dry-Run Mode",
        fo_gal_d4: "Safely preview file movements without committing any actual changes.",
        fo_gal_t5: "Date Organization",
        fo_gal_d5: "Automatically group files into folders based on their creation or modification dates.",
        fd_gal_t1: "Interactive Dashboard",
        fd_gal_d1: "High-level overview of key performance indicators and financial health.",
        fd_gal_t2: "Debt Analysis",
        fd_gal_d2: "In-depth visual charts breaking down debt structures and aging.",
        fd_gal_t3: "Risk Segmentation",
        fd_gal_d3: "Categorize customers into risk profiles to optimize collection strategies.",
        fd_gal_t4: "Arabic Data Support",
        fd_gal_d4: "Seamlessly process and visualize CSV datasets with complex Arabic encodings.",
        fd_gal_t5: "Excel Exporting",
        fd_gal_d5: "Generate automated, formatted Excel reports for stakeholders with one click.",
        proj_demo: "Live Demo",
        proj_source: "Source Code",
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
        proj_details: "عرض التفاصيل",
        proj_overview: "نظرة عامة والهيكل",
        proj_features: "الميزات الرئيسية",
        proj_stack: "التقنيات المستخدمة",
        proj1_badge: "منصة تعلم بالذكاء الاصطناعي",
        proj1_name: "المدرب الشخصي للتعلم بالذكاء الاصطناعي",
        proj1_desc: "منصة تعليمية مدعومة بالذكاء الاصطناعي تقوم بتحويل ملفات PDF والمواد الدراسية إلى تجربة تعليمية مخصصة باستخدام RAG، والتوجيه الذكي، وتتبع الإتقان، والتوصيات الشخصية.",
        proj1_desc_full: "منصة تعليمية مدعومة بالذكاء الاصطناعي تقوم بتحويل ملفات PDF والمواد الدراسية إلى تجربة تعليمية مخصصة باستخدام RAG، والتوجيه الذكي، وتتبع الإتقان، والتوصيات الشخصية.",
        proj1_overview_desc: "يُحدث هذا المشروع ثورة في الدراسة الذاتية من خلال استخدام تقنيات الويب الحديثة والذكاء الاصطناعي التوليدي لإنشاء تجربة تعليمية شخصية حقًا. من خلال تحميل المواد الدراسية مثل ملفات PDF، يستخدم النظام توليد الاسترجاع المعزز (RAG) لمعالجة المحتوى وفهرسته وبناء منهج تفاعلي مخصص لسرعة ومستوى الفهم الخاص بالمستخدم.",
        proj1_feat1: "توجيه ذكي مع محادثة تفاعلية",
        proj1_feat2: "خوارزميات تتبع الإتقان والأخطاء",
        proj1_feat3: "التكرار المتباعد للاحتفاظ بالمعلومات على المدى الطويل",
        proj1_feat4: "توصيات دراسة ومراجعة مخصصة",

        proj2_badge: "أتمتة بايثون",
        proj2_name: "منظم الملفات الذكي لسطح المكتب",
        proj2_desc: "أداة أتمتة باستخدام بايثون بواجهات رسومية (GUI) وسطر الأوامر (CLI) تنظم المجلدات الفوضوية تلقائيًا بناءً على نوع الملف أو تاريخ التعديل مع منع الكتابة الفوقية عن طريق الخطأ.",
        proj2_desc_full: "أداة أتمتة باستخدام بايثون بواجهات رسومية (GUI) وسطر الأوامر (CLI) تنظم المجلدات الفوضوية تلقائيًا بناءً على نوع الملف أو تاريخ التعديل مع منع الكتابة الفوقية عن طريق الخطأ.",
        proj2_overview_desc: "التعامل مع مجلدات التنزيلات وسطح المكتب الفوضوية هو مشكلة عالمية. تعمل هذه الأداة على أتمتة العملية الشاقة لتصنيف ونقل الملفات. تحتوي على واجهتي مستخدم: واجهة سطر أوامر قوية (CLI) للمستخدمين المتقدمين ونصوص الأتمتة، وواجهة رسومية (GUI) مبنية بواسطة Tkinter للاستخدام اليومي.",
        proj2_feat1: "تصنيف الملفات الذكي حسب الامتداد والنوع",
        proj2_feat2: "أوضاع تنظيم تعتمد على التاريخ",
        proj2_feat3: "حماية من التكرار والتعامل الآمن مع الملفات",
        proj2_feat4: "وضع التشغيل التجريبي للاختبار والتسجيل المفصل",

        proj3_badge: "تصوير البيانات",
        proj3_name: "لوحة تحكم التحليلات المالية",
        proj3_desc: "لوحة تحكم تحليلية مالية تفاعلية تعالج مجموعات البيانات المالية العربية وتوفر مؤشرات الأداء الرئيسية وتجزئة المخاطر وتحليل الديون وتصدير Excel.",
        proj3_desc_full: "لوحة تحكم تحليلية مالية تفاعلية تعالج مجموعات البيانات المالية العربية وتوفر مؤشرات الأداء الرئيسية وتجزئة المخاطر وتحليل الديون وتصدير Excel.",
        proj3_overview_desc: "تم تصميم هذه الأداة التحليلية لمعالجة وتصوير البيانات المالية المعقدة بسلاسة. مبنية باستخدام إطارات Dash و Plotly في بايثون، وتتعامل بكفاءة مع مجموعات بيانات CSV الضخمة، خصوصًا الموجهة لترميز البيانات باللغة العربية. تحول البيانات المجدولة الأولية إلى ذكاء أعمال قابل للتنفيذ من خلال لوحات تحكم تفاعلية للغاية وملخصات مؤشرات الأداء الرئيسية.",
        proj3_feat1: "لوحات تحكم تفاعلية ومؤشرات أداء (KPIs)",
        proj3_feat2: "معالجة سلسة لمجموعات بيانات CSV العربية",
        proj3_feat3: "تجزئة المخاطر وتحليل مفصل للديون",
        proj3_feat4: "إنشاء تلقائي لتقارير إكسل (Excel)",
        gallery_title: "لقطات شاشة للمشروع",
        ai_gal_t1: "لوحة تحكم التعلم بالذكاء الاصطناعي",
        ai_gal_d1: "عرض مركزي لتقدم التعلم، ومستويات الإتقان، وتوصيات الدراسة.",
        ai_gal_t2: "معالجة المستندات",
        ai_gal_d2: "قم بتحميل ملفات PDF وتحويل المواد الدراسية إلى محتوى تعليمي منظم.",
        ai_gal_t3: "معلم تفاعلي ذكي",
        ai_gal_d3: "انخرط في تعلم تحادثي لتوضيح الشكوك وتعزيز المفاهيم.",
        ai_gal_t4: "تتبع الأخطاء",
        ai_gal_d4: "تحديد نقاط الضعف تلقائيًا وجدولة المراجعات المتباعدة.",
        ai_gal_t5: "منهج مخصص",
        ai_gal_d5: "مسارات دراسية ديناميكية مصممة لتناسب سرعة واستيعاب الفرد.",
        fo_gal_t1: "واجهة المستخدم الرئيسية",
        fo_gal_d1: "واجهة رسومية نظيفة مبنية بـ Tkinter لتنظيم ملفات سطح المكتب بسهولة.",
        fo_gal_t2: "تنفيذ سطر الأوامر (CLI)",
        fo_gal_d2: "واجهة سطر أوامر قوية مع تسجيل مفصل للمستخدمين المتقدمين.",
        fo_gal_t3: "إعدادات الامتدادات",
        fo_gal_d3: "تكوين امتدادات الملفات المخصصة وقواعد التصنيف بسهولة.",
        fo_gal_t4: "وضع التشغيل التجريبي",
        fo_gal_d4: "معاينة آمنة لحركات الملفات دون إجراء أي تغييرات فعلية.",
        fo_gal_t5: "التنظيم حسب التاريخ",
        fo_gal_d5: "تجميع الملفات تلقائيًا في مجلدات بناءً على تواريخ إنشائها أو تعديلها.",
        fd_gal_t1: "لوحة تحكم تفاعلية",
        fd_gal_d1: "نظرة عامة عالية المستوى على مؤشرات الأداء الرئيسية والصحة المالية.",
        fd_gal_t2: "تحليل الديون",
        fd_gal_d2: "مخططات مرئية متعمقة تفصل هياكل الديون وتواريخها.",
        fd_gal_t3: "تجزئة المخاطر",
        fd_gal_d3: "تصنيف العملاء إلى ملفات تعريف المخاطر لتحسين استراتيجيات التحصيل.",
        fd_gal_t4: "دعم البيانات العربية",
        fd_gal_d4: "معالجة وتصوير مجموعات بيانات CSV بترميزات عربية معقدة بسلاسة.",
        fd_gal_t5: "تصدير إلى إكسل",
        fd_gal_d5: "إنشاء تقارير إكسل منسقة ومؤتمتة لأصحاب المصلحة بنقرة واحدة.",
        proj_demo: "معاينة حية",
        proj_source: "الكود المصدري",
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

// 6. Premium SaaS Showcase Logic
const showcaseConfig = {
    'ai-coach': [
        { img: 'images/ai-coach/screenshot-1.webp', titleKey: 'ai_gal_t1', descKey: 'ai_gal_d1' },
        { img: 'images/ai-coach/screenshot-2.webp', titleKey: 'ai_gal_t2', descKey: 'ai_gal_d2' },
        { img: 'images/ai-coach/screenshot-3.webp', titleKey: 'ai_gal_t3', descKey: 'ai_gal_d3' },
        { img: 'images/ai-coach/screenshot-4.webp', titleKey: 'ai_gal_t4', descKey: 'ai_gal_d4' },
        { img: 'images/ai-coach/screenshot-5.webp', titleKey: 'ai_gal_t5', descKey: 'ai_gal_d5' }
    ],
    'file-organizer': [
        { img: 'images/file-organizer/screenshot-1.webp', titleKey: 'fo_gal_t1', descKey: 'fo_gal_d1' },
        { img: 'images/file-organizer/screenshot-2.webp', titleKey: 'fo_gal_t2', descKey: 'fo_gal_d2' },
        { img: 'images/file-organizer/screenshot-3.webp', titleKey: 'fo_gal_t3', descKey: 'fo_gal_d3' },
        { img: 'images/file-organizer/screenshot-4.webp', titleKey: 'fo_gal_t4', descKey: 'fo_gal_d4' },
        { img: 'images/file-organizer/screenshot-5.webp', titleKey: 'fo_gal_t5', descKey: 'fo_gal_d5' }
    ],
    'financial-dashboard': [
        { img: 'images/financial-dashboard/screenshot-1.webp', titleKey: 'fd_gal_t1', descKey: 'fd_gal_d1' },
        { img: 'images/financial-dashboard/screenshot-2.webp', titleKey: 'fd_gal_t2', descKey: 'fd_gal_d2' },
        { img: 'images/financial-dashboard/screenshot-3.webp', titleKey: 'fd_gal_t3', descKey: 'fd_gal_d3' },
        { img: 'images/financial-dashboard/screenshot-4.webp', titleKey: 'fd_gal_t4', descKey: 'fd_gal_d4' },
        { img: 'images/financial-dashboard/screenshot-5.webp', titleKey: 'fd_gal_t5', descKey: 'fd_gal_d5' }
    ]
};

class SaaSShowcase {
    constructor(wrapper) {
        this.wrapper = wrapper;
        this.projectId = wrapper.getAttribute('data-project');
        this.config = showcaseConfig[this.projectId];
        if (!this.config || this.config.length === 0) return;
        
        this.currentIndex = 0;
        this.totalCards = this.config.length;
        this.interval = null;
        this.isHovered = false;

        this.buildDOM();
        this.init();
    }

    buildDOM() {
        // Build the cards container
        let showcaseHTML = '<div class="saas-showcase">';
        this.config.forEach((item, index) => {
            showcaseHTML += `
                <div class="saas-card">
                    <img src="${item.img}" alt="Screenshot ${index + 1}" loading="lazy">
                </div>
            `;
        });
        showcaseHTML += '</div>';

        // Build the controls container
        let controlsHTML = `
            <div class="saas-controls">
                <button class="saas-btn saas-prev"><i class="fa-solid fa-chevron-left"></i></button>
                <div class="saas-dots">
                    ${this.config.map(() => '<div class="saas-dot"></div>').join('')}
                </div>
                <button class="saas-btn saas-next"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
        `;

        // Build the info/caption container
        let infoHTML = `
            <div class="saas-info-container">
                <div class="saas-info-content">
                    <h3 class="saas-info-title"></h3>
                    <p class="saas-info-desc"></p>
                </div>
            </div>
        `;

        this.wrapper.innerHTML = showcaseHTML + controlsHTML + infoHTML;

        // Select the newly created nodes
        this.container = this.wrapper.querySelector('.saas-showcase');
        this.cards = Array.from(this.wrapper.querySelectorAll('.saas-card'));
        this.dots = Array.from(this.wrapper.querySelectorAll('.saas-dot'));
        this.prevBtn = this.wrapper.querySelector('.saas-prev');
        this.nextBtn = this.wrapper.querySelector('.saas-next');
        this.infoContent = this.wrapper.querySelector('.saas-info-content');
        this.infoTitle = this.wrapper.querySelector('.saas-info-title');
        this.infoDesc = this.wrapper.querySelector('.saas-info-desc');
    }

    init() {
        this.updateClasses();
        this.updateCaption();
        
        this.nextBtn.addEventListener('click', () => {
            this.stopAutoPlay();
            this.next();
        });
        this.prevBtn.addEventListener('click', () => {
            this.stopAutoPlay();
            this.prev();
        });
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.stopAutoPlay();
                this.goTo(index);
            });
        });

        this.wrapper.addEventListener('mouseenter', () => {
            this.isHovered = true;
            this.stopAutoPlay();
        });
        
        this.wrapper.addEventListener('mouseleave', () => {
            this.isHovered = false;
            this.startAutoPlay();
        });

        // Listen for language changes globally to refresh text
        langToggle.addEventListener('click', () => {
            // Need a tiny delay to ensure global lang has toggled
            setTimeout(() => this.updateCaption(), 50);
        });

        this.startAutoPlay();
    }

    updateClasses() {
        this.cards.forEach((card, index) => {
            card.className = 'saas-card'; // Reset
            
            if (index === this.currentIndex) {
                card.classList.add('active');
            } else if (index === (this.currentIndex + 1) % this.totalCards) {
                card.classList.add('next-1');
            } else if (index === (this.currentIndex + 2) % this.totalCards) {
                card.classList.add('next-2');
            } else if (index === (this.currentIndex + 3) % this.totalCards) {
                card.classList.add('next-3');
            } else {
                card.classList.add('prev-1');
            }
        });

        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    updateCaption() {
        const item = this.config[this.currentIndex];
        
        // Fade out
        this.infoContent.style.opacity = '0';
        this.infoContent.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            this.infoTitle.textContent = translations[currentLang][item.titleKey];
            this.infoDesc.textContent = translations[currentLang][item.descKey];
            
            // Re-apply data-i18n for robust global toggles, though we just manually set it above
            this.infoTitle.setAttribute('data-i18n', item.titleKey);
            this.infoDesc.setAttribute('data-i18n', item.descKey);

            // Fade in
            this.infoContent.style.opacity = '1';
            this.infoContent.style.transform = 'translateY(0)';
        }, 300); // Wait for fade out
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalCards;
        this.updateClasses();
        this.updateCaption();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
        this.updateClasses();
        this.updateCaption();
    }

    goTo(index) {
        if (this.currentIndex === index) return;
        this.currentIndex = index;
        this.updateClasses();
        this.updateCaption();
    }

    startAutoPlay() {
        this.stopAutoPlay();
        if (!this.isHovered) {
            this.interval = setInterval(() => this.next(), 2400);
        }
    }

    stopAutoPlay() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// Initialize all showcases on the page
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.saas-showcase-wrapper').forEach(wrapper => {
        new SaaSShowcase(wrapper);
    });
});
