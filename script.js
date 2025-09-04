// حالت خودکار دارک/لایت بر اساس تم تلگرام کاربر
const themeBtn = document.getElementById('theme-toggle');
const root = document.body;

// متغیرهای مهم برای نمایش قیمت‌ها
const goldItemsContainer = document.getElementById('gold-items');
const currencyItemsContainer = document.getElementById('currency-items');
const cryptoItemsContainer = document.getElementById('crypto-items');
const currencyLoading = document.getElementById('currency-loading');
const currencyError = document.getElementById('currency-error');
const updateTimeElement = document.getElementById('update-time');

// تابع تنظیم تم
function setThemeByTelegram() {
    if (window.Telegram?.WebApp) {
        if (window.Telegram.WebApp.colorScheme === "dark") {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    } else if (window.localStorage.getItem('theme') === 'dark') {
        root.classList.add('dark');
    }
}

// اجرای تنظیم تم
setThemeByTelegram();

// دکمه تغییر تم
themeBtn.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// مدیریت ناوبری
function navigateTo(targetSection) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.getElementById(targetSection).classList.remove('hidden');
    
    // اگر هدف صفحه ارز است، بارگذاری داده‌ها
    if (targetSection === 'currency-page') {
        showCurrencyData();
    }
}

// تنظیم دکمه‌های ناوبری
document.getElementById('goto-converter')?.addEventListener('click', () => navigateTo('converter-page'));
document.getElementById('goto-currency')?.addEventListener('click', () => navigateTo('currency-page'));

// تنظیم دکمه‌های برگشت
document.querySelectorAll('.back-button').forEach(button => {
    button.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        if (target) navigateTo(target);
    });
});

// تنظیم تب‌ها
document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        if (!target) return;
        
        // تغییر کلاس active تب‌ها
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // تغییر بخش فعال
        document.querySelectorAll('.currency-section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(target)?.classList.remove('hidden');
    });
});

// فرمت‌بندی اعداد بزرگ
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// نمایش داده‌های قیمت ارز و طلا
function showCurrencyData() {
    console.log("شروع نمایش داده‌های ارزی");
    
    // نمایش لودینگ
    if (currencyLoading) currencyLoading.classList.remove('hidden');
    if (currencyError) currencyError.classList.add('hidden');
    
    // پاک کردن داده‌های قبلی
    if (goldItemsContainer) goldItemsContainer.innerHTML = '';
    if (currencyItemsContainer) currencyItemsContainer.innerHTML = '';
    if (cryptoItemsContainer) cryptoItemsContainer.innerHTML = '';
    
    // اجرای تأخیری برای اطمینان از آماده بودن DOM
    setTimeout(() => {
        try {
            // تاریخ به‌روزرسانی
            const now = new Date();
            const persianDate = `1404/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
            const persianTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            
            // نمایش زمان به‌روزرسانی
            if (updateTimeElement) {
                updateTimeElement.textContent = `آخرین به‌روزرسانی: ${persianDate} ساعت ${persianTime}`;
            }
            
            // نمایش داده‌های طلا
            if (goldItemsContainer) {
                const goldHTML = getGoldDataHTML();
                goldItemsContainer.innerHTML = goldHTML;
                console.log("داده‌های طلا نمایش داده شد");
            }
            
            // نمایش داده‌های ارز
            if (currencyItemsContainer) {
                const currencyHTML = getCurrencyDataHTML();
                currencyItemsContainer.innerHTML = currencyHTML;
                console.log("داده‌های ارز نمایش داده شد");
            }
            
            // نمایش داده‌های ارز دیجیتال
            if (cryptoItemsContainer) {
                const cryptoHTML = getCryptoDataHTML();
                cryptoItemsContainer.innerHTML = cryptoHTML;
                console.log("داده‌های ارز دیجیتال نمایش داده شد");
            }
            
        } catch (error) {
            console.error("خطا در نمایش داده‌ها:", error);
            if (currencyError) currencyError.classList.remove('hidden');
        } finally {
            if (currencyLoading) currencyLoading.classList.add('hidden');
        }
    }, 300);
}

// ساخت HTML برای داده‌های طلا
function getGoldDataHTML() {
    const goldData = [
        { name: "طلای 18 عیار", price: 8620500, change: 15000, unit: "تومان" },
        { name: "طلای 24 عیار", price: 11494000, change: 20000, unit: "تومان" },
        { name: "انس طلا", price: 2610, change: 5, unit: "دلار" },
        { name: "سکه امامی", price: 92010000, change: 250000, unit: "تومان" },
        { name: "سکه بهار آزادی", price: 90500000, change: 200000, unit: "تومان" },
        { name: "نیم سکه", price: 51000000, change: 120000, unit: "تومان" },
        { name: "ربع سکه", price: 31000000, change: 80000, unit: "تومان" },
        { name: "سکه گرمی", price: 18500000, change: 40000, unit: "تومان" }
    ];
    
    return goldData.map(item => {
        const changeClass = item.change > 0 ? 'change-up' : 
                          item.change < 0 ? 'change-down' : 'change-neutral';
        
        const changeIcon = item.change > 0 ? 'arrow_upward' : 
                         item.change < 0 ? 'arrow_downward' : 'remove';
        
        return `
            <div class="currency-item gold">
                <div class="currency-header">
                    <span class="currency-name">${item.name}</span>
                </div>
                <div class="currency-price">
                    ${formatNumber(item.price)} <span class="currency-unit">${item.unit}</span>
                </div>
                <div class="currency-changes">
                    <span class="${changeClass}">
                        <i class="material-icons change-icon">${changeIcon}</i>
                        ${item.change > 0 ? '+' : ''}${formatNumber(item.change)}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

// ساخت HTML برای داده‌های ارز
function getCurrencyDataHTML() {
    const currencyData = [
        { name: "دلار آمریکا", price: 101640, change: 140, unit: "تومان" },
        { name: "یورو", price: 118660, change: 180, unit: "تومان" },
        { name: "پوند انگلیس", price: 136920, change: 220, unit: "تومان" },
        { name: "درهم امارات", price: 27852, change: 45, unit: "تومان" },
        { name: "لیر ترکیه", price: 2480, change: -20, unit: "تومان" },
        { name: "دلار کانادا", price: 76000, change: 120, unit: "تومان" },
        { name: "دلار استرالیا", price: 70000, change: 90, unit: "تومان" },
        { name: "یوآن چین", price: 14240, change: 30, unit: "تومان" }
    ];
    
    return currencyData.map(item => {
        const changeClass = item.change > 0 ? 'change-up' : 
                          item.change < 0 ? 'change-down' : 'change-neutral';
        
        const changeIcon = item.change > 0 ? 'arrow_upward' : 
                         item.change < 0 ? 'arrow_downward' : 'remove';
        
        return `
            <div class="currency-item forex">
                <div class="currency-header">
                    <span class="currency-name">${item.name}</span>
                </div>
                <div class="currency-price">
                    ${formatNumber(item.price)} <span class="currency-unit">${item.unit}</span>
                </div>
                <div class="currency-changes">
                    <span class="${changeClass}">
                        <i class="material-icons change-icon">${changeIcon}</i>
                        ${item.change > 0 ? '+' : ''}${formatNumber(item.change)}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

// ساخت HTML برای داده‌های ارز دیجیتال
function getCryptoDataHTML() {
    const cryptoData = [
        { name: "بیت کوین", price: 6420000000, change: 8000000, unit: "تومان" },
        { name: "اتریوم", price: 420000000, change: 2500000, unit: "تومان" },
        { name: "تتر", price: 102000, change: 150, unit: "تومان" },
        { name: "ریپل", price: 1780000, change: 12000, unit: "تومان" },
        { name: "بایننس کوین", price: 12600000, change: 80000, unit: "تومان" },
        { name: "کاردانو", price: 150000, change: 3000, unit: "تومان" }
    ];
    
    return cryptoData.map(item => {
        const changeClass = item.change > 0 ? 'change-up' : 
                          item.change < 0 ? 'change-down' : 'change-neutral';
        
        const changeIcon = item.change > 0 ? 'arrow_upward' : 
                         item.change < 0 ? 'arrow_downward' : 'remove';
        
        return `
            <div class="currency-item crypto">
                <div class="currency-header">
                    <span class="currency-name">${item.name}</span>
                </div>
                <div class="currency-price">
                    ${formatNumber(item.price)} <span class="currency-unit">${item.unit}</span>
                </div>
                <div class="currency-changes">
                    <span class="${changeClass}">
                        <i class="material-icons change-icon">${changeIcon}</i>
                        ${item.change > 0 ? '+' : ''}${formatNumber(item.change)}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

// بخش تبدیل ریال به تومان
const conversionTypeSelect = document.getElementById('conversion-type');
const amountLabel = document.getElementById('amount-label');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convert-btn');
const resultContainer = document.getElementById('result-container');
const numericResult = document.getElementById('numeric-result');
const textResult = document.getElementById('text-result');

// تنظیم متن لیبل براساس نوع تبدیل
conversionTypeSelect?.addEventListener('change', function() {
    if (this.value === 'toman-to-rial') {
        if (amountLabel) amountLabel.textContent = 'مبلغ را به تومان وارد کنید:';
    } else {
        if (amountLabel) amountLabel.textContent = 'مبلغ را به ریال وارد کنید:';
    }
    if (resultContainer) resultContainer.classList.add('hidden');
});

// رویداد کلیک دکمه تبدیل
convertBtn?.addEventListener('click', function() {
    const inputVal = amountInput?.value.replace(/[^\d]/g, '') || '0';
    if (!inputVal || inputVal === '0') {
        alert('لطفاً یک عدد وارد کنید');
        return;
    }
    
    let result, textVal;
    if (conversionTypeSelect?.value === 'toman-to-rial') {
        result = parseInt(inputVal) * 10;
        textVal = numToText(result) + ' ریال';
        if (numericResult) numericResult.textContent = formatNumber(result) + ' ریال';
    } else {
        result = Math.floor(parseInt(inputVal) / 10);
        textVal = numToText(result) + ' تومان';
        if (numericResult) numericResult.textContent = formatNumber(result) + ' تومان';
    }
    
    if (textResult) textResult.textContent = textVal;
    if (resultContainer) resultContainer.classList.remove('hidden');
});

// تبدیل عدد به متن (نسخه ساده‌شده)
function numToText(num) {
    const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
    const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
    const tens = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
    
    if (num === 0) return 'صفر';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
        const ten = Math.floor(num / 10);
        const one = num % 10;
        return ones[one] ? tens[ten] + ' و ' + ones[one] : tens[ten];
    }
    
    return num.toLocaleString('fa-IR') + ' (متن عدد خیلی بزرگ است)';
}

// شروع خودکار نمایش داده‌های ارزی بعد از بارگذاری صفحه
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded: صفحه بارگذاری شد');
    
    // نمایش داده‌ها برای هر صفحه فعال
    if (!document.getElementById('currency-page').classList.contains('hidden')) {
        showCurrencyData();
    }
    
    // افزودن رویداد برای دکمه تلاش مجدد
    document.getElementById('retry-btn')?.addEventListener('click', showCurrencyData);
});

// بارگذاری مجدد در حالت سرویس کارگر
window.addEventListener('load', function() {
    console.log('Window loaded: پنجره بارگذاری شد');
    
    // اجرای مجدد با تاخیر برای اطمینان از بارگذاری کامل DOM
    setTimeout(() => {
        if (!document.getElementById('currency-page').classList.contains('hidden')) {
            showCurrencyData();
        }
    }, 500);
});

// تنظیم جستجوی ارز
document.getElementById('currency-search')?.addEventListener('input', function() {
    const searchTerm = this.value.trim().toLowerCase();
    const items = document.querySelectorAll('#currency-items .currency-item');
    
    items.forEach(item => {
        const name = item.querySelector('.currency-name').textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});
