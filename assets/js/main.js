// ==========================================
// 0. تطبيق الثيم المحفوظ فوراً لمنع الوميض الأبيض
// ==========================================
(function() {
    const savedTheme = localStorage.getItem("sehatok_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
})();

document.addEventListener("DOMContentLoaded", function () {

    // تحديد مسار الجذور ديناميكياً بناءً على مكان الصفحة الحالية
    const isInsidePages = window.location.pathname.includes('/pages/');
    const basePath = isInsidePages ? '../' : './';


    // ==========================================
    // 1. جلب الناف بار والفوتر وتفعيل المكونات المرتبطة بهما
    // ==========================================
    
    // أ) جلب الناف بار
    const navPlaceholder = document.getElementById("navbar-placeholder");
    if (navPlaceholder) {
        fetch(basePath + 'components/navbar.html')
            .then(response => {
                if (!response.ok) throw new Error("لم يتم العثور على ملف الناف بار");
                return response.text();
            })
            .then(data => {
                navPlaceholder.innerHTML = data;
                adjustNavLinks(isInsidePages); // ضبط الروابط تلقائياً
                initThemeToggle();             // تفعيل زر الوضع الليلي بعد ظهوره
            })
            .catch(error => console.error("خطأ في جلب الناف بار:", error));
    }

    // ب) جلب الفوتر
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        fetch(basePath + 'components/footer.html')
            .then(response => {
                if (!response.ok) throw new Error("لم يتم العثور على ملف الفوتر");
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => console.error("خطأ في جلب الفوتر:", error));
    }


    // ==========================================
    // 2. نظام تبديل وتخزين الوضع الليلي والنهاري (Dark/Light Mode)
    // ==========================================
    function initThemeToggle() {
        const themeToggleBtn = document.getElementById("themeToggleBtn");
        if (!themeToggleBtn) return;

        const currentTheme = localStorage.getItem("sehatok_theme") || "light";
        updateThemeIcon(themeToggleBtn, currentTheme);

        // إزالة أي مستمع حدث قديم لمنع التكرار عند إعادة الجلب
        themeToggleBtn.replaceWith(themeToggleBtn.cloneNode(true));
        const newThemeBtn = document.getElementById("themeToggleBtn");

        newThemeBtn.addEventListener("click", function () {
            let activeTheme = document.documentElement.getAttribute("data-theme");
            let newTheme = activeTheme === "dark" ? "light" : "dark";
            
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("sehatok_theme", newTheme);
            updateThemeIcon(newThemeBtn, newTheme);
        });
    }

    function updateThemeIcon(btn, theme) {
        if (!btn) return;
        if (theme === "dark") {
            btn.innerHTML = '<i class="fa-solid fa-sun text-warning"></i>';
        } else {
            btn.innerHTML = '<i class="fa-solid fa-moon text-muted"></i>';
        }
    }


    // ==========================================
    // 3. نظام الفلترة الفورية عبر تبويبات الأقسام (Category Filter Tabs)
    // ==========================================
    const filterButtons = document.querySelectorAll(".filter-tabs .nav-link");
    const centerCards = document.querySelectorAll(".center-card");

    if (filterButtons.length > 0 && centerCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener("click", function () {
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
    // 4. فلترة البحث النصي الحي (Live Search Input)
    // ==========================================
    const searchInput = document.getElementById("searchInput");
    if (searchInput && centerCards.length > 0) {
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
    // 5. تفعيل زر البحث في الـ Hero Section للانتقال السلس والفلترة
    // ==========================================
    const heroSearchForm = document.getElementById("heroSearchForm");

    if (heroSearchForm) {
        heroSearchForm.addEventListener("submit", function(e) {
            e.preventDefault(); 

            const centersSection = document.querySelector(".medical-centers-section");
            if (centersSection) {
                centersSection.scrollIntoView({ behavior: 'smooth' });
            }

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


// ==========================================
// 6. دالة تصحيح المسارات تلقائياً للناف بار لتوافق جميع الصفحات
// ==========================================
function adjustNavLinks(isInsidePages) {
    const navLinks = document.querySelectorAll("#navbar-placeholder a");
    navLinks.forEach(link => {
        let href = link.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("http")) return;

        if (isInsidePages) {
            if (!href.startsWith("../") && !href.startsWith("pages/")) {
                if (href === "index.html") {
                    link.setAttribute("href", "../index.html");
                }
            }
        } else {
            if (!href.startsWith("pages/") && href !== "index.html") {
                link.setAttribute("href", "pages/" + href);
            }
        }
    });
}


// ==========================================
// 7. دالة إرسال رسائل الدردشة (Chatbot Widget)
// ==========================================
function sendChatMessage() {
    const input = document.getElementById("userChatMessage");
    if (!input) return;
    const message = input.value.trim();
    if (!message) return;

    const messagesContainer = document.getElementById("chatMessages");
    if (!messagesContainer) return;

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

    // رد تلقائي تجريبي من المساعد بعد 1 ثانية
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