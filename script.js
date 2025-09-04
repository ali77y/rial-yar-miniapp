// تنظیمات اولیه و متغیرهای جهانی
let activeTab = "gold"; // تب فعال پیش‌فرض
const apiEndpoints = {
    gold: "https://api.tgju.org/v1/data/sana/summary/latest",
    currency: "https://api.tgju.org/v1/data/sana/summary/latest",
    crypto: "https://apiv2.nobitex.ir/v3/orderbook/all"
};

const apiKeys = {
    gold: "your_gold_api_key_if_needed", // در صورت نیاز کلید API را اینجا وارد کنید
    currency: "your_currency_api_key_if_needed", // در صورت نیاز کلید API را اینجا وارد کنید
};

// اطلاعات طلا و سکه
const goldItems = [
    { id: "geram18", name: "طلای 18 عیار" },
    { id: "geram24", name: "طلای 24 عیار" },
    { id: "gold_melted", name: "طلای آب‌شده نقدی" },
    { id: "ons", name: "انس طلا" },
    { id: "emami", name: "سکه امامی" },
    { id: "bahar", name: "سکه بهار آزادی" },
    { id: "nim", name: "نیم سکه" },
    { id: "rob", name: "ربع سکه" },
    { id: "gerami", name: "سکه یک گرمی" }
];

// اطلاعات ارزهای خارجی
const currencyItems = [
    { id: "usd", name: "دلار (USD)" },
    { id: "eur", name: "یورو (EUR)" },
    { id: "gbp", name: "پوند (GBP)" },
    { id: "aed", name: "درهم امارات (AED)" },
    { id: "try", name: "لیر ترکیه (TRY)" },
    { id: "cad", name: "دلار کانادا (CAD)" },
    { id: "aud", name: "دلار استرالیا (AUD)" },
    { id: "cny", name: "یوآن چین (CNY)" },
    { id: "afn", name: "افغانی (AFN)" },
    { id: "thb", name: "بات تایلند (THB)" },
    { id: "amd", name: "درام ارمنستان (AMD)" },
    { id: "bhd", name: "دینار بحرین (BHD)" },
    { id: "iqd", name: "دینار عراق (IQD)" },
    { id: "kwd", name: "دینار کویت (KWD)" },
    { id: "rub", name: "روبل روسیه (RUB)" },
    { id: "pkr", name: "روپیه پاکستان (PKR)" },
    { id: "inr", name: "روپیه هند (INR)" },
    { id: "sar", name: "ریال عربستان (SAR)" },
    { id: "omr", name: "ریال عمان (OMR)" },
    { id: "qar", name: "ریال قطر (QAR)" },
    { id: "myr", name: "رینگیت مالزی (MYR)" },
    { id: "chf", name: "فرانک سوئیس (CHF)" },
    { id: "sek", name: "کرون سوئد (SEK)" },
    { id: "gel", name: "لاری گرجستان (GEL)" },
    { id: "syp", name: "لیر سوریه (SYP)" },
    { id: "azn", name: "منات آذربایجان (AZN)" },
    { id: "jpy", name: "یکصد ین ژاپن (JPY)" }
];

// اطلاعات ارزهای دیجیتال
const cryptoItemsIRT = [
    { id: "BTCIRT", name: "بیت‌کوین" },
    { id: "ETHIRT", name: "اتریوم" },
    { id: "LTCIRT", name: "لایت‌کوین" },
    { id: "USDTIRT", name: "تتر" },
    { id: "XRPIRT", name: "ریپل" },
    { id: "BCHIRT", name: "بیت‌کوین‌کش" },
    { id: "BNBIRT", name: "بایننس‌کوین" },
    { id: "EOSIRT", name: "ایاس" },
    { id: "XLMIRT", name: "استلار" },
    { id: "ETCIRT", name: "اتریوم‌کلاسیک" },
    { id: "TRXIRT", name: "ترون" },
    { id: "DOGEIRT", name: "دوج‌کوین" },
    { id: "UNIIRT", name: "یونی‌سواپ" },
    { id: "DAIIRT", name: "دای" },
    { id: "LINKIRT", name: "چین‌لینک" },
    { id: "DOTIRT", name: "پولکادات" },
    { id: "AAVEIRT", name: "آوه" },
    { id: "ADAIRT", name: "کاردانو" },
    { id: "SHIBIRT", name: "شیبا اینو" },
    { id: "FTMIRT", name: "فانتوم" },
    { id: "MATICIRT", name: "پالیگان" },
    { id: "AXSIRT", name: "اکسی اینفینیتی" },
    { id: "MANAIRT", name: "مانا (دیسنترالند)" },
    { id: "SANDIRT", name: "سندباکس" },
    { id: "AVAXIRT", name: "آوالانچ" },
    { id: "MKRIRT", name: "میکر" },
    { id: "GMTIRT", name: "جی‌ام‌تی (StepN)" },
    { id: "USDCIRT", name: "یو‌اس‌دی‌کوین" },
    { id: "CHZIRT", name: "چیلیز" },
    { id: "GRTIRT", name: "گراف" },
    { id: "CRVIRT", name: "کرو" }
];

const cryptoItemsUSDT = [
    { id: "BTCUSDT", name: "بیت‌کوین" },
    { id: "ETHUSDT", name: "اتریوم" },
    { id: "LTCUSDT", name: "لایت‌کوین" },
    { id: "XRPUSDT", name: "ریپل" },
    { id: "BCHUSDT", name: "بیت‌کوین‌کش" },
    { id: "BNBUSDT", name: "بایننس‌کوین" },
    { id: "EOSUSDT", name: "ایاس" },
    { id: "XLMUSDT", name: "استلار" },
    { id: "ETCUSDT", name: "اتریوم‌کلاسیک" },
    { id: "TRXUSDT", name: "ترون" },
    { id: "DOGEUSDT", name: "دوج‌کوین" },
    { id: "UNIUSDT", name: "یونی‌سواپ" },
    { id: "DAIUSDT", name: "دای" },
    { id: "LINKUSDT", name: "چین‌لینک" },
    { id: "DOTUSDT", name: "پولکادات" },
    { id: "AAVEUSDT", name: "آوه" },
    { id: "ADAUSDT", name: "کاردانو" },
    { id: "SHIBUSDT", name: "شیبا اینو" },
    { id: "FTMUSDT", name: "فانتوم" },
    { id: "MATICUSDT", name: "پالیگان" },
    { id: "AXSUSDT", name: "اکسی اینفینیتی" },
    { id: "MANAUSDT", name: "مانا (دیسنترالند)" },
    { id: "SANDUSDT", name: "سندباکس" },
    { id: "AVAXUSDT", name: "آوالانچ" },
    { id: "MKRUSDT", name: "میکر" },
    { id: "GMTUSDT", name: "جی‌ام‌تی (StepN)" },
    { id: "USDCUSDT", name: "یو‌اس‌دی‌کوین" },
    { id: "SOLUSDT", name: "سولانا" },
    { id: "APEUSDT", name: "ایپ‌کوین" },
    { id: "FILUSDT", name: "فایل‌کوین" }
];

// تنظیمات رنگ‌های برنامه
const tabColors = {
    gold: "#ffd700",      // رنگ طلایی برای تب طلا
    currency: "#4CAF50",  // رنگ سبز برای تب ارز خارجی
    crypto: "#2196F3"     // رنگ آبی برای تب ارز دیجیتال
};

// کد اصلی اجرا می‌شود وقتی صفحه کامل بارگذاری شد
document.addEventListener("DOMContentLoaded", function() {
    // حذف ممنوعیت زوم
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
        metaViewport.content = metaViewport.content.replace(/user-scalable=no/, 'user-scalable=yes');
    }
    
    // بدست آوردن تمام المنت‌های تب و اضافه کردن رویداد کلیک
    const tabs = document.querySelectorAll(".tab-item");
    tabs.forEach(tab => {
        tab.addEventListener("click", function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });
    
    // تنظیم حالت پیش‌فرض تب فعال
    const initialActiveTab = document.querySelector('.tab-item[data-tab="gold"]');
    if (initialActiveTab) {
        initialActiveTab.classList.add("active");
        document.getElementById("gold-content").classList.add("active");
        fetchData("gold");
    }
    
    // تنظیم رنگ تب‌ها و لودینگ‌ها
    setTabColors();
});

// تغییر تب فعال
function switchTab(tabId) {
    // پاک کردن کلاس‌های فعال قبلی
    document.querySelectorAll(".tab-item").forEach(item => {
        item.classList.remove("active");
    });
    document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.remove("active");
    });
    
    // تنظیم تب فعال جدید
    document.querySelector(`.tab-item[data-tab="${tabId}"]`).classList.add("active");
    document.getElementById(`${tabId}-content`).classList.add("active");
    
    // تنظیم متغیر تب فعال و دریافت داده‌ها
    activeTab = tabId;
    fetchData(tabId);
}

// تنظیم رنگ تب‌ها و لودینگ‌ها
function setTabColors() {
    // تنظیم رنگ تب‌ها
    const goldTab = document.querySelector('.tab-item[data-tab="gold"]');
    const currencyTab = document.querySelector('.tab-item[data-tab="currency"]');
    const cryptoTab = document.querySelector('.tab-item[data-tab="crypto"]');
    
    if (goldTab) {
        goldTab.style.borderColor = tabColors.gold;
    }
    if (currencyTab) {
        currencyTab.style.borderColor = tabColors.currency;
    }
    if (cryptoTab) {
        cryptoTab.style.borderColor = tabColors.crypto;
    }
    
    // تنظیم رنگ لودینگ‌ها
    const goldLoader = document.querySelector('#gold-content .loader-container .loader');
    const currencyLoader = document.querySelector('#currency-content .loader-container .loader');
    const cryptoLoader = document.querySelector('#crypto-content .loader-container .loader');
    
    if (goldLoader) {
        goldLoader.style.borderTopColor = tabColors.gold;
    }
    if (currencyLoader) {
        currencyLoader.style.borderTopColor = tabColors.currency;
    }
    if (cryptoLoader) {
        cryptoLoader.style.borderTopColor = tabColors.crypto;
    }
}

// نمایش یا مخفی کردن لودر مربوط به یک تب خاص
function toggleLoader(tabId, show) {
    const loaderContainer = document.querySelector(`#${tabId}-content .loader-container`);
    if (loaderContainer) {
        loaderContainer.style.display = show ? "flex" : "none";
    }
}

// دریافت داده‌ها بر اساس تب فعال
function fetchData(tabId) {
    toggleLoader(tabId, true);
    
    // دریافت داده‌ها بسته به نوع تب
    switch(tabId) {
        case "gold":
            fetchGoldData();
            break;
        case "currency":
            fetchCurrencyData();
            break;
        case "crypto":
            fetchCryptoData();
            break;
    }
}

// دریافت داده‌های طلا و سکه
function fetchGoldData() {
    fetch(apiEndpoints.gold)
        .then(response => response.json())
        .then(data => {
            // پردازش داده‌های طلا
            const goldContainer = document.getElementById("gold-content");
            goldContainer.innerHTML = "";
            
            // ایجاد محتویات لودر
            const loaderContainer = document.createElement("div");
            loaderContainer.className = "loader-container";
            loaderContainer.innerHTML = `
                <div class="loader" style="border-top-color: ${tabColors.gold}"></div>
                <p>در حال دریافت قیمت‌ها...</p>
            `;
            goldContainer.appendChild(loaderContainer);
            
            // ایجاد کارت‌های طلا
            goldItems.forEach(item => {
                // جستجو برای پیدا کردن داده مناسب در پاسخ API
                const priceData = data.sana[item.id] || { p: "نامشخص" };
                const price = priceData.p ? formatNumber(priceData.p) : "نامشخص";
                
                // ایجاد کارت برای هر آیتم
                const card = document.createElement("div");
                card.className = "price-card";
                card.innerHTML = `
                    <div class="price-card-inner gold">
                        <h3>${item.name}</h3>
                        <p class="price">${price} <span class="currency">تومان</span></p>
                    </div>
                `;
                goldContainer.appendChild(card);
            });
            
            // نمایش زمان به‌روزرسانی
            const lastUpdateTime = new Date();
            const updateTimeElement = document.createElement("div");
            updateTimeElement.className = "update-time";
            updateTimeElement.textContent = `آخرین به‌روزرسانی: ${formatDateTime(lastUpdateTime)}`;
            goldContainer.appendChild(updateTimeElement);
            
            // مخفی کردن لودر
            toggleLoader("gold", false);
        })
        .catch(error => {
            console.error("خطا در دریافت قیمت‌های طلا:", error);
            displayError("gold", "خطا در دریافت قیمت‌های طلا. لطفاً دوباره تلاش کنید.");
            toggleLoader("gold", false);
        });
}

// دریافت داده‌های ارزهای خارجی
function fetchCurrencyData() {
    fetch(apiEndpoints.currency)
        .then(response => response.json())
        .then(data => {
            // پردازش داده‌های ارز
            const currencyContainer = document.getElementById("currency-content");
            currencyContainer.innerHTML = "";
            
            // ایجاد محتویات لودر
            const loaderContainer = document.createElement("div");
            loaderContainer.className = "loader-container";
            loaderContainer.innerHTML = `
                <div class="loader" style="border-top-color: ${tabColors.currency}"></div>
                <p>در حال دریافت قیمت‌ها...</p>
            `;
            currencyContainer.appendChild(loaderContainer);
            
            // ایجاد کارت‌های ارز
            currencyItems.forEach(item => {
                // جستجو برای پیدا کردن داده مناسب در پاسخ API
                const priceData = data.sana[item.id] || { p: "نامشخص" };
                const price = priceData.p ? formatNumber(priceData.p) : "نامشخص";
                
                // ایجاد کارت برای هر آیتم
                const card = document.createElement("div");
                card.className = "price-card";
                card.innerHTML = `
                    <div class="price-card-inner currency">
                        <h3>${item.name}</h3>
                        <p class="price">${price} <span class="currency">تومان</span></p>
                    </div>
                `;
                currencyContainer.appendChild(card);
            });
            
            // نمایش زمان به‌روزرسانی
            const lastUpdateTime = new Date();
            const updateTimeElement = document.createElement("div");
            updateTimeElement.className = "update-time";
            updateTimeElement.textContent = `آخرین به‌روزرسانی: ${formatDateTime(lastUpdateTime)}`;
            currencyContainer.appendChild(updateTimeElement);
            
            // مخفی کردن لودر
            toggleLoader("currency", false);
        })
        .catch(error => {
            console.error("خطا در دریافت قیمت‌های ارز:", error);
            displayError("currency", "خطا در دریافت قیمت‌های ارز. لطفاً دوباره تلاش کنید.");
            toggleLoader("currency", false);
        });
}

// دریافت داده‌های ارزهای دیجیتال
function fetchCryptoData() {
    fetch(apiEndpoints.crypto)
        .then(response => response.json())
        .then(data => {
            // پردازش داده‌های ارزهای دیجیتال
            const cryptoContainer = document.getElementById("crypto-content");
            cryptoContainer.innerHTML = "";
            
            // ایجاد محتویات لودر
            const loaderContainer = document.createElement("div");
            loaderContainer.className = "loader-container";
            loaderContainer.innerHTML = `
                <div class="loader" style="border-top-color: ${tabColors.crypto}"></div>
                <p>در حال دریافت قیمت‌ها...</p>
            `;
            cryptoContainer.appendChild(loaderContainer);
            
            // ایجاد بخش ارزهای دیجیتال تومانی
            const irtSection = document.createElement("div");
            irtSection.className = "crypto-section";
            
            const irtHeader = document.createElement("h2");
            irtHeader.textContent = "قیمت به تومان";
            irtHeader.className = "section-header";
            irtSection.appendChild(irtHeader);
            
            // ایجاد کارت‌ها برای ارزهای دیجیتال تومانی
            cryptoItemsIRT.forEach(item => {
                if (data.status === 'ok' && data[item.id]) {
                    const priceData = data[item.id];
                    let price = "نامشخص";
                    
                    if (priceData.lastTradePrice) {
                        // تبدیل به عدد و فرمت‌بندی
                        const priceNum = parseInt(priceData.lastTradePrice);
                        price = formatNumber(priceNum / 10); // تبدیل ریال به تومان
                    }
                    
                    // ایجاد کارت برای هر آیتم
                    const card = document.createElement("div");
                    card.className = "price-card";
                    card.innerHTML = `
                        <div class="price-card-inner crypto">
                            <h3>${item.name}</h3>
                            <p class="price">${price} <span class="currency">تومان</span></p>
                        </div>
                    `;
                    irtSection.appendChild(card);
                }
            });
            
            cryptoContainer.appendChild(irtSection);
            
            // ایجاد بخش ارزهای دیجیتال دلاری
            const usdtSection = document.createElement("div");
            usdtSection.className = "crypto-section";
            
            const usdtHeader = document.createElement("h2");
            usdtHeader.textContent = "قیمت به دلار";
            usdtHeader.className = "section-header";
            usdtSection.appendChild(usdtHeader);
            
            // ایجاد کارت‌ها برای ارزهای دیجیتال دلاری
            cryptoItemsUSDT.forEach(item => {
                if (data.status === 'ok' && data[item.id]) {
                    const priceData = data[item.id];
                    let price = "نامشخص";
                    
                    if (priceData.lastTradePrice) {
                        // تبدیل به عدد و فرمت‌بندی با حداقل اعشار مورد نیاز
                        const priceNum = parseFloat(priceData.lastTradePrice);
                        price = formatCryptoUSDPrice(priceNum);
                    }
                    
                    // ایجاد کارت برای هر آیتم
                    const card = document.createElement("div");
                    card.className = "price-card";
                    card.innerHTML = `
                        <div class="price-card-inner crypto">
                            <h3>${item.name}</h3>
                            <p class="price">${price} <span class="currency">دلار</span></p>
                        </div>
                    `;
                    usdtSection.appendChild(card);
                }
            });
            
            cryptoContainer.appendChild(usdtSection);
            
            // نمایش زمان به‌روزرسانی
            const lastUpdateTime = new Date();
            const updateTimeElement = document.createElement("div");
            updateTimeElement.className = "update-time";
            updateTimeElement.textContent = `آخرین به‌روزرسانی: ${formatDateTime(lastUpdateTime)}`;
            cryptoContainer.appendChild(updateTimeElement);
            
            // مخفی کردن لودر
            toggleLoader("crypto", false);
        })
        .catch(error => {
            console.error("خطا در دریافت قیمت‌های ارز دیجیتال:", error);
            displayError("crypto", "خطا در دریافت قیمت‌های ارز دیجیتال. لطفاً دوباره تلاش کنید.");
            toggleLoader("crypto", false);
        });
}

// نمایش خطا در صورت بروز مشکل
function displayError(tabId, message) {
    const container = document.getElementById(`${tabId}-content`);
    
    // ایجاد المنت خطا
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    
    // اضافه کردن دکمه تلاش مجدد
    const retryButton = document.createElement("button");
    retryButton.textContent = "تلاش مجدد";
    retryButton.className = "retry-button";
    retryButton.addEventListener("click", function() {
        fetchData(tabId);
    });
    
    errorElement.appendChild(retryButton);
    container.appendChild(errorElement);
}

// تبدیل عدد به فرمت فارسی با جداکننده هزارگان
function formatNumber(number) {
    if (typeof number === 'string') {
        number = parseFloat(number);
    }
    
    if (isNaN(number)) {
        return "نامشخص";
    }
    
    // گرد کردن به نزدیکترین عدد صحیح برای مقادیر بزرگ
    if (number > 1000) {
        number = Math.round(number);
    }
    
    // تبدیل به رشته با جداکننده هزارگان
    return number.toLocaleString('fa-IR');
}

// فرمت‌بندی قیمت‌های دلاری ارزهای دیجیتال
function formatCryptoUSDPrice(price) {
    if (isNaN(price)) {
        return "نامشخص";
    }
    
    // قیمت‌های بزرگ (مانند بیت‌کوین) بدون اعشار
    if (price >= 1000) {
        return Math.floor(price).toLocaleString('en-US');
    }
    // قیمت‌های متوسط با دو رقم اعشار
    else if (price >= 1) {
        return price.toFixed(2).replace(/\.00$/, '');
    }
    // قیمت‌های کوچک با تعداد اعشار مناسب
    else {
        let decimals = 6;
        // برای قیمت‌های بسیار کوچک، اعشار بیشتری نمایش می‌دهیم
        if (price < 0.0001) {
            decimals = 8;
        }
        return price.toFixed(decimals).replace(/\.?0+$/, '');
    }
}

// تبدیل تاریخ به فرمت مناسب نمایش
function formatDateTime(date) {
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    
    return date.toLocaleString('fa-IR', options);
}

// شروع برنامه با بارگذاری داده‌های پیش‌فرض تب طلا
fetchData("gold");
