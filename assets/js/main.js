document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================
    // 1. نظام تبديل وتخزين الوضع الليلي والنهاري (Dark/Light Mode)
    // ==========================================
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const htmlElement = document.documentElement;

    // استرجاع الوضع المحفوظ مسبقاً من متصفح المستخدم
    const savedTheme = localStorage.getItem("sehatok_theme") || "light";
    htmlElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", function () {
            let currentTheme = htmlElement.getAttribute("data-theme");
            let newTheme = currentTheme === "dark" ? "light" : "dark";
            
            htmlElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("sehatok_theme", newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector("i");
        if (icon) {
            if (theme === "dark") {
                icon.className = "fa-solid fa-sun text-warning";
            } else {
                icon.className = "fa-solid fa-moon text-muted";
            }
        }
    }


    // ==========================================
    // 2. نظام الفلترة الفورية عبر تبويبات الأقسام (Category Filter Tabs)
    // ==========================================
    const filterButtons = document.querySelectorAll(".filter-tabs .nav-link");
    const centerCards = document.querySelectorAll(".center-card");

    if (filterButtons.length > 0 && centerCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener("click", function () {
                // إزالة كلاس النشاط عن جميع الأزرار وإضافته للزر الحالي
                filterButtons.forEach(btn => btn.classList.remove("active"));
                this.classList.add("active");

                const filterValue = this.getAttribute("data-filter");

                centerCards.forEach(card => {
                    const cardCategory = card.getAttribute("data-category");
                    const parentCol = card.closest(".col-md-6, .col-lg-4");

                    if (!parentCol) return;

                    if (!filterValue || filterValue === "all" || cardCategory === filterValue) {
                        parentCol.style.display = "block";
                    } else {
                        parentCol.style.display = "none";
                    }
                });
            });
        });
    }


    // ==========================================
    // 3. فلترة البحث النصي الحي (Live Search Input)
    // ==========================================
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("keyup", function () {
            const query = this.value.toLowerCase().trim();

            centerCards.forEach(card => {
                const cardTitle = card.querySelector(".card-title, h5")?.textContent.toLowerCase() || "";
                const cardLocation = card.querySelector(".text-muted")?.textContent.toLowerCase() || "";
                const parentCol = card.closest(".col-md-6, .col-lg-4");

                if (!parentCol) return;

                if (cardTitle.includes(query) || cardLocation.includes(query)) {
                    parentCol.style.display = "block";
                } else {
                    parentCol.style.display = "none";
                }
            });
        });
    }


    // ==========================================
    // 4. تفعيل زر البحث في الـ Hero Section للانتقال السلس والفلترة
    // ==========================================
    const heroSearchForm = document.getElementById("heroSearchForm");

    if (heroSearchForm) {
        heroSearchForm.addEventListener("submit", function(e) {
            e.preventDefault(); // منع إعادة تحميل الصفحة

            // أ) الانتقال بسلاسة (Smooth Scroll) إلى قسم المراكز الطبية
            const centersSection = document.querySelector(".medical-centers-section");
            if (centersSection) {
                centersSection.scrollIntoView({ behavior: 'smooth' });
            }

            // ب) فلترة الكروت بناءً على النص المكتوب في حقل البحث بالـ Hero
            const textInput = this.querySelector("input[type='text']");
            if (!textInput) return;
            
            const searchQuery = textInput.value.toLowerCase().trim();

            if (searchQuery && centerCards.length > 0) {
                centerCards.forEach(card => {
                    const cardTitle = card.querySelector(".card-title, h5")?.textContent.toLowerCase() || "";
                    const cardLocation = card.querySelector(".text-muted")?.textContent.toLowerCase() || "";
                    const parentCol = card.closest(".col-md-6, .col-lg-4");

                    if (!parentCol) return;

                    if (cardTitle.includes(searchQuery) || cardLocation.includes(searchQuery)) {
                        parentCol.style.display = "block";
                    } else {
                        parentCol.style.display = "none";
                    }
                });
            }
        });
    }

});


// دالة لجلب ناف بار وفوتر بكل صفحة 
// main.js
document.addEventListener("DOMContentLoaded", function () {
    
    // تحديد ما إذا كانت الصفحة الحالية داخل مجلد pages أو في الجذر الرئيسي
    const isInsidePages = window.location.pathname.includes('/pages/');
    const basePath = isInsidePages ? '../' : './';

    // 1. جلب الناف بار
    const navPlaceholder = document.getElementById("navbar-placeholder");
    if (navPlaceholder) {
        fetch(basePath + "./components/navbar.html")
            .then(response => {
                if (!response.ok) throw new Error("لم يتم العثور على ملف الناف بار");
                return response.text();
            })
            .then(data => {
                navPlaceholder.innerHTML = data;
                adjustNavLinks(isInsidePages); // ضبط الروابط تلقائياً
            })
            .catch(error => console.error("خطأ في جلب الناف بار:", error));
    }

    // 2. جلب الفوتر
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        fetch(basePath + "./components/footer.html")
            .then(response => {
                if (!response.ok) throw new Error("لم يتم العثور على ملف الفوتر");
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => console.error("خطأ في جلب الفوتر:", error));
    }
});

// دالة تصحيح المسارات تلقائياً لتوافق جميع الصفحات
function adjustNavLinks(isInsidePages) {
    const navLinks = document.querySelectorAll("#navbar-placeholder a");
    navLinks.forEach(link => {
        let href = link.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("http")) return;

        if (isInsidePages) {
            // إذا كنا داخل مجلد pages والرابط يوجه لصفحة أخرى بداخل pages
            if (!href.startsWith("../") && !href.startsWith("pages/")) {
                if (href === "index.html") {
                    link.setAttribute("href", "../index.html");
                }
            }
        } else {
            // إذا كنا في الصفحة الرئيسية index.html
            if (!href.startsWith("pages/") && href !== "index.html") {
                link.setAttribute("href", "pages/" + href);
            }
        }
    });
}




document.addEventListener("DOMContentLoaded", function () {
    const isInsidePages = window.location.pathname.includes('/pages/');
    const basePath = isInsidePages ? '../' : './';

    // 1. جلب الناف بار
    const navPlaceholder = document.getElementById("navbar-placeholder");
    if (navPlaceholder) {
        fetch(basePath + "./components/navbar.html")
            .then(res => res.text())
            .then(data => {
                navPlaceholder.innerHTML = data;
                // تفعيل دالة زر الوضع الليلي فور تحميل الناف بار
                initThemeToggle();
            });
    }

    // 2. جلب الفوتر
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        fetch(basePath + "./components/footer.html")
            .then(res => res.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            });
    }
});

// دالة تفعيل وتبديل الوضع الليلي والنهاري
function initThemeToggle() {
    const themeBtn = document.getElementById("themeToggleBtn");
    if (!themeBtn) return;

    // استرجاع الثيم المحفوظ أو الاعتماد على العادي
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(themeBtn, savedTheme);

    themeBtn.addEventListener("click", function () {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeIcon(themeBtn, newTheme);
    });
}

function updateThemeIcon(btn, theme) {
    btn.innerHTML = theme === "dark" 
        ? '<i class="fa-solid fa-sun text-warning"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
}


// تطبيق الثيم المحفوظ فور تحميل أي صفحة لئلا يحدث وميض أبيض
(function() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
})();

document.addEventListener("DOMContentLoaded", function () {
    // تفعيل زر تبديل الثيم بغض النظر عن الصفحة الحالية
    initGlobalThemeToggle();
});

function initGlobalThemeToggle() {
    const themeBtn = document.getElementById("themeToggleBtn");
    if (!themeBtn) return;

    const currentTheme = localStorage.getItem("theme") || "light";
    updateThemeIcon(themeBtn, currentTheme);

    // إزالة أي حدث قديم لمنع التكرار ثم إضافة الحدث الجديد
    themeBtn.replaceWith(themeBtn.cloneNode(true));
    const newThemeBtn = document.getElementById("themeToggleBtn");

    newThemeBtn.addEventListener("click", function () {
        const activeTheme = document.documentElement.getAttribute("data-theme");
        const targetTheme = activeTheme === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", targetTheme);
        localStorage.setItem("theme", targetTheme);
        updateThemeIcon(newThemeBtn, targetTheme);
    });
}

function updateThemeIcon(btn, theme) {
    btn.innerHTML = theme === "dark" 
        ? '<i class="fa-solid fa-sun text-warning"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
}

function sendChatMessage() {
    const input = document.getElementById("userChatMessage");
    const message = input.value.trim();
    if (!message) return;

    const messagesContainer = document.getElementById("chatMessages");

    // إضافة رسالة المستخدم
    const userBubble = `
        <div class="d-flex gap-2 mb-3 justify-content-end">
            <div class="chat-bubble bg-primary-custom text-white p-3 rounded-4 max-w-75">
                ${message}
            </div>
        </div>
    `;
    messagesContainer.insertAdjacentHTML("beforeend", userBubble);
    input.value = "";
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // رد تلقائي تجريبي سريع من المساعد بعد 1 ثانية
    setTimeout(() => {
        const replyBubble = `
            <div class="d-flex gap-2 mb-3">
                <div class="chat-bubble bg-body-tertiary text-main-custom p-3 rounded-4 border max-w-75">
                    سؤال مهم! يفضل دائماً تناول هذا الدواء بعد الوجبة مباشرة مع كوب ماء كامل لتجنب تهيج المعدة. إذا كان لديك أعراض جانبية يرجى إخبار الصيدلي المناوب.
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML("beforeend", replyBubble);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
}








