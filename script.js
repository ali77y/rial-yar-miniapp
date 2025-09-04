// حالت خودکار دارک/لایت بر اساس تم تلگرام کاربر
const themeBtn = document.getElementById('theme-toggle');
const root = document.body;

// تابع تنظیم تم بر اساس Telegram WebApp theme
function setThemeByTelegram() {
    const webapp = window.Telegram?.WebApp;
    if (webapp && webapp.themeParams) {
        // تلگرام دارک مود است؟
        if (webapp.themeParams.bg_color && webapp.themeParams.bg_color.toLowerCase() === "#181818") {
            root.classList.add('dark');
            window.localStorage.setItem('theme', 'dark');
        } else if (webapp.themeParams.bg_color && webapp.themeParams.bg_color.toLowerCase() === "#ffffff") {
            root.classList.remove('dark');
            window.localStorage.setItem('theme', 'light');
        } else if (webapp.colorScheme === "dark") {
            root.classList.add('dark');
            window.localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            window.localStorage.setItem('theme', 'light');
        }
    } else {
        // fallback: اگر از تلگرام نبود، به حالت قبلی یا سیستم
        if (window.localStorage.getItem('theme')) {
            if (window.localStorage.getItem('theme') === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.classList.add('dark');
            window.localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            window.localStorage.setItem('theme', 'light');
        }
    }
}

// فراخوانی تابع تنظیم تم هنگام بارگذاری
setThemeByTelegram();

// دکمه تغییر تم
themeBtn.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// برقراری ارتباط با تلگرام
const webapp = window.Telegram?.WebApp;
if (webapp) {
    webapp.expand();
    webapp.ready();

    // اگر کاربر در تلگرام تم را تغییر داد (در لحظه)
    if (webapp.onEvent) {
        webapp.onEvent('themeChanged', setThemeByTelegram);
    }
}

// مدیریت ناوبری صفحات
const sections = document.querySelectorAll('.page-section');
const mainMenu = document.getElementById('main-menu');
const converterPage = document.getElementById('converter-page');
const currencyPage = document.getElementById('currency-page');

// دکمه‌های ناوبری
const gotoConverterBtn = document.getElementById('goto-converter');
const gotoCurrencyBtn = document.getElementById('goto-currency');
const backButtons = document.querySelectorAll('.back-button');

// تابع تغییر صفحه
function navigateTo(targetSection) {
    console.log('تغییر صفحه به:', targetSection);
    
    // مخفی کردن همه صفحات
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    
    // نمایش صفحه هدف
    document.getElementById(targetSection).classList.remove('hidden');
    
    // اگر هدف صفحه ارز است و داده‌ها قبلاً دریافت نشده‌اند، آنها را دریافت کن
    if (targetSection === 'currency-page' && !currencyData) {
        fetchCurrencyData();
    }
}

// گوش دادن به رویدادهای کلیک دکمه‌های ناوبری
gotoConverterBtn.addEventListener('click', function() {
    navigateTo('converter-page');
});

gotoCurrencyBtn.addEventListener('click', function() {
    navigateTo('currency-page');
});

// اصلاح رویداد کلیک دکمه‌های برگشت
backButtons.forEach(button => {
    button.addEventListener('click', function() {
        const targetSection = this.getAttribute('data-target');
        navigateTo(targetSection);
    });
});

// بخش تبدیل ریال به تومان
const conversionTypeSelect = document.getElementById('conversion-type');
const amountLabel = document.getElementById('amount-label');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convert-btn');
const resultContainer = document.getElementById('result-container');
const numericResult = document.getElementById('numeric-result');
const textResult = document.getElementById('text-result');
const copyNumericBtn = document.getElementById('copy-numeric');
const copyTextBtn = document.getElementById('copy-text');

// تنظیم متن لیبل براساس نوع تبدیل
conversionTypeSelect.addEventListener('change', function() {
    if (this.value === 'toman-to-rial') {
        amountLabel.textContent = 'مبلغ را به تومان وارد کنید:';
    } else {
        amountLabel.textContent = 'مبلغ را به ریال وارد کنید:';
    }
    resultContainer.classList.add('hidden');
});

// متغیر برای ذخیره مقدار عددی خالص
let rawNumber = '';

// تبدیل اعداد فارسی به انگلیسی
function convertPersianToEnglishNumbers(input) {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let i = 0; i < 10; i++) {
        const regex = new RegExp(persianNumbers[i], 'g');
        input = input.replace(regex, englishNumbers[i]);
    }
    return input;
}

amountInput.addEventListener('input', function(e) {
    this.value = convertPersianToEnglishNumbers(this.value);
    const start = this.selectionStart;
    const end = this.selectionEnd;
    if (e.inputType === 'insertText' && /\d/.test(e.data)) {
        const cleanValue = this.value.replace(/[^\d]/g, '');
        rawNumber = cleanValue;
    } else if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
        rawNumber = this.value.replace(/[^\d]/g, '');
    } else {
        rawNumber = this.value.replace(/[^\d]/g, '');
    }
    if (rawNumber === '') {
        this.value = '';
        return;
    }
    let formattedValue = '';
    for (let i = 0; i < rawNumber.length; i++) {
        if (i > 0 && (rawNumber.length - i) % 3 === 0) {
            formattedValue += ',';
        }
        formattedValue += rawNumber[i];
    }
    this.value = formattedValue;
    const commasBefore = formattedValue.substring(0, start).split(',').length - 1;
    this.setSelectionRange(start + commasBefore, end + commasBefore);
});

convertBtn.addEventListener('click', function() {
    const inputValue = rawNumber || amountInput.value.replace(/[^\d]/g, '');
    if (!inputValue) {
        alert('لطفاً یک عدد وارد کنید');
        return;
    }
    let rialValue, tomanValue;
    if (conversionTypeSelect.value === 'toman-to-rial') {
        tomanValue = BigInt(inputValue);
        rialValue = tomanValue * BigInt(10);
        numericResult.textContent = formatLargeNumber(rialValue.toString()) + ' ریال';
        textResult.textContent = `${numberToWords(rialValue.toString())} ریال`;
    } else {
        rialValue = BigInt(inputValue);
        tomanValue = rialValue / BigInt(10);
        numericResult.textContent = formatLargeNumber(tomanValue.toString()) + ' تومان';
        textResult.textContent = `${numberToWords(tomanValue.toString())} تومان`;
    }
    resultContainer.classList.remove('hidden');
});

function formatLargeNumber(numStr) {
    let result = '';
    for (let i = 0; i < numStr.length; i++) {
        if (i > 0 && (numStr.length - i) % 3 === 0) {
            result += ',';
        }
        result += numStr[i];
    }
    return result;
}

copyNumericBtn.addEventListener('click', function() {
    copyToClipboard(numericResult.textContent);
    showToast('نتیجه عددی کپی شد');
});

copyTextBtn.addEventListener('click', function() {
    copyToClipboard(textResult.textContent);
    showToast('نتیجه متنی کپی شد');
});

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }, 100);
}

const units = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
const tens = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
const scales = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون', 'کوادریلیون'];

function numberToWords(numStr) {
    if (numStr === '0') return 'صفر';
    let words = '';
    let scaleIndex = 0;
    for (let i = numStr.length; i > 0; i -= 3) {
        const start = Math.max(0, i - 3);
        const chunk = parseInt(numStr.substring(start, i), 10);
        if (chunk !== 0) {
            const chunkWords = convertChunkToWords(chunk);
            words = chunkWords + (scaleIndex > 0 ? ' ' + scales[scaleIndex] : '') + 
                   (words ? ' و ' + words : '');
        }
        scaleIndex++;
    }
    return words;
}

function convertChunkToWords(chunk) {
    let result = '';
    const hundred = Math.floor(chunk / 100);
    if (hundred > 0) {
        result += hundreds[hundred];
    }
    const remainder = chunk % 100;
    if (remainder > 0) {
        if (result.length > 0) result += ' و ';
        if (remainder < 10) {
            result += units[remainder];
        } else if (remainder < 20) {
            result += teens[remainder - 10];
        } else {
            const ten = Math.floor(remainder / 10);
            const unit = remainder % 10;
            result += tens[ten];
            if (unit > 0) {
                result += ' و ' + units[unit];
            }
        }
    }
    return result;
}

// بخش نمایش قیمت ارز و طلا
const currencyTabs = document.querySelectorAll('.tab-btn');
const currencySections = document.querySelectorAll('.currency-section');
const goldItemsContainer = document.getElementById('gold-items');
const currencyItemsContainer = document.getElementById('currency-items');
const cryptoItemsContainer = document.getElementById('crypto-items');
const currencySearch = document.getElementById('currency-search');
const currencyLoading = document.getElementById('currency-loading');
const currencyError = document.getElementById('currency-error');
const retryBtn = document.getElementById('retry-btn');
const updateTimeElement = document.getElementById('update-time');

// متغیر برای ذخیره داده‌های دریافتی از API
let currencyData = null;

// تابع تغییر تب
currencyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // تغییر کلاس active برای دکمه‌ها
        currencyTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // تغییر بخش نمایش داده شده
        const targetSection = tab.getAttribute('data-target');
        currencySections.forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(targetSection).classList.remove('hidden');
    });
});

// جستجوی ارز
currencySearch.addEventListener('input', () => {
    const searchTerm = currencySearch.value.trim().toLowerCase();
    filterCurrencies(searchTerm);
});

function filterCurrencies(searchTerm) {
    const currencyItems = document.querySelectorAll('#currency-items .currency-item');
    
    currencyItems.forEach(item => {
        const currencyName = item.querySelector('.currency-name').textContent.toLowerCase();
        const currencySymbol = item.querySelector('.currency-symbol').textContent.toLowerCase();
        
        if (currencyName.includes(searchTerm) || currencySymbol.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// دریافت داده‌های ارز و طلا از API
async function fetchCurrencyData() {
    try {
        console.log('شروع دریافت داده‌های ارز و طلا');
        currencyLoading.classList.remove('hidden');
        currencyError.classList.add('hidden');
        goldItemsContainer.innerHTML = '';
        currencyItemsContainer.innerHTML = '';
        cryptoItemsContainer.innerHTML = '';
        
        const response = await fetch('https://brsapi.ir/Api/Market/Gold_Currency.php?key=BHS7FccYcBzulc4jQYIhfrbzCiUhziRm');
        
        if (!response.ok) {
            throw new Error(`خطای HTTP: ${response.status}`);
        }
        
        const responseText = await response.text();
        console.log('پاسخ API دریافت شد. طول پاسخ:', responseText.length);
        
        let data;
        try {
            data = JSON.parse(responseText);
            console.log('داده‌ها با موفقیت پارس شدند.');
        } catch (e) {
            console.error('خطا در پارس کردن JSON:', e);
            throw new Error('داده‌های نامعتبر از API');
        }
        
        if (!data || !data.currency || !data.gold) {
            console.error('ساختار API نامعتبر است:', data);
            throw new Error('داده‌های نامعتبر از API');
        }
        
        console.log(`تعداد ارزها: ${data.currency.length}, تعداد طلا: ${data.gold.length}`);
        
        currencyData = data;
        
        // نمایش داده‌ها
        displayGoldData(data.gold);
        displayCurrencyData(data.currency);
        displayCryptoData(data.currency);
        
        // نمایش زمان به‌روزرسانی
        const updateInfo = data.currency[0] || data.gold[0];
        if (updateInfo && updateInfo.date && updateInfo.time) {
            updateTimeElement.textContent = `آخرین به‌روزرسانی: ${updateInfo.date} ساعت ${updateInfo.time}`;
        }
        
        currencyLoading.classList.add('hidden');
    } catch (error) {
        console.error('خطا در دریافت داده‌ها:', error);
        currencyLoading.classList.add('hidden');
        currencyError.classList.remove('hidden');
    }
}

// تابع نمایش داده‌های طلا و سکه
function displayGoldData(goldData) {
    console.log('نمایش داده‌های طلا و سکه. تعداد آیتم‌ها:', goldData.length);
    
    if (!goldData || !Array.isArray(goldData) || goldData.length === 0) {
        goldItemsContainer.innerHTML = '<p class="no-data">اطلاعات طلا و سکه در دسترس نیست</p>';
        return;
    }
    
    // فیلتر کردن آیتم‌های طلا و سکه
    const goldItems = goldData.filter(item => {
        const validItem = item && item.symbol && item.price !== undefined;
        if (!validItem) console.log('آیتم نامعتبر طلا/سکه:', item);
        return validItem && (
            item.type === 'gold' || 
            (item.symbol.startsWith('IR_GOLD') || 
             item.symbol.startsWith('IR_COIN') || 
             item.symbol === 'XAUUSD')
        );
    });
    
    console.log('تعداد آیتم‌های طلا و سکه پس از فیلتر:', goldItems.length);
    
    if (goldItems.length === 0) {
        goldItemsContainer.innerHTML = '<p class="no-data">اطلاعات طلا و سکه در دسترس نیست</p>';
        return;
    }
    
    // اطمینان از اینکه همه آیتم‌ها مقدار قیمت معتبر دارند
    goldItems.forEach(item => {
        if (typeof item.price !== 'number') {
            console.log('تبدیل قیمت به عدد برای:', item.symbol);
            item.price = parseInt(item.price, 10) || 0;
        }
    });
    
    // مرتب‌سازی آیتم‌ها
    const sortedGoldItems = goldItems.sort((a, b) => {
        // ترتیب: XAUUSD، طلای ۲۴ عیار، طلای ۱۸ عیار، طلای آب‌شده، سکه امامی، سکه بهار، نیم سکه، ربع سکه، سکه گرمی
        const order = {
            'IR_GOLD_24K': 1,
            'IR_GOLD_18K': 2,
            'IR_GOLD_MELTED': 3,
            'XAUUSD': 0,
            'IR_COIN_EMAMI': 4,
            'IR_COIN_BAHAR': 5,
            'IR_COIN_HALF': 6,
            'IR_COIN_QUARTER': 7,
            'IR_COIN_1G': 8
        };
        
        const orderA = order[a.symbol] !== undefined ? order[a.symbol] : 99;
        const orderB = order[b.symbol] !== undefined ? order[b.symbol] : 99;
        
        return orderA - orderB;
    });
    
    // ساخت HTML برای هر آیتم
    goldItemsContainer.innerHTML = sortedGoldItems.map(item => {
        // محاسبه تغییرات قیمت
        const changeClass = !item.change ? 'change-neutral' : 
                          item.change > 0 ? 'change-up' : 'change-down';
        
        const changeIcon = !item.change ? 'remove' : 
                         item.change > 0 ? 'arrow_upward' : 'arrow_downward';
        
        const changeText = !item.change ? '0' : 
                         (item.change > 0 ? '+' : '') + formatLargeNumber(item.change);
        
        return `
            <div class="currency-item gold">
                <div class="currency-header">
                    <span class="currency-name">${item.name}</span>
                    <span class="currency-symbol">${item.symbol}</span>
                </div>
                <div class="currency-price">
                    ${formatLargeNumber(item.price)} <span class="currency-unit">${item.unit || 'تومان'}</span>
                </div>
                <div class="currency-changes">
                    <span class="${changeClass}">
                        <i class="material-icons change-icon">${changeIcon}</i>
                        ${changeText}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

// تابع نمایش داده‌های ارزهای خارجی
function displayCurrencyData(currencyData) {
    if (!currencyData || !Array.isArray(currencyData) || currencyData.length === 0) {
        currencyItemsContainer.innerHTML = '<p class="no-data">اطلاعات ارز در دسترس نیست</p>';
        return;
    }
    
    // فیلتر کردن ارزهای خارجی (با type=currency و symbol شروع نشده با IR_ یا شروع نشده با حرف B - برای ارزهای دیجیتال)
    const forexItems = currencyData.filter(item => 
        item.type === 'currency' && 
        item.symbol && 
        !item.symbol.startsWith('IR_') &&
        !(item.symbol.startsWith('BTC') || 
          item.symbol.startsWith('ETH') || 
          item.symbol.startsWith('USDT') || 
          item.symbol.startsWith('XRP') || 
          item.symbol.startsWith('BNB') || 
          item.symbol.startsWith('ADA') || 
          item.symbol.startsWith('SOL') || 
          item.symbol.startsWith('USDC'))
    );
    
    if (forexItems.length === 0) {
        currencyItemsContainer.innerHTML = '<p class="no-data">اطلاعات ارز در دسترس نیست</p>';
        return;
    }
    
    // مرتب‌سازی ارزها - ارزهای اصلی در ابتدا، بقیه به ترتیب الفبا
    const mainCurrencies = ['USD', 'EUR', 'GBP', 'AED', 'TRY', 'CAD', 'AUD', 'CNY'];
    
    const sortedForexItems = forexItems.sort((a, b) => {
        const isAMain = mainCurrencies.includes(a.symbol);
        const isBMain = mainCurrencies.includes(b.symbol);
        
        if (isAMain && !isBMain) return -1;
        if (!isAMain && isBMain) return 1;
        
        if (isAMain && isBMain) {
            return mainCurrencies.indexOf(a.symbol) - mainCurrencies.indexOf(b.symbol);
        }
        
        return a.name.localeCompare(b.name);
    });
    
    // ساخت HTML برای هر ارز
    currencyItemsContainer.innerHTML = sortedForexItems.map(item => {
        // محاسبه تغییرات قیمت
        const changeClass = !item.change ? 'change-neutral' : 
                          item.change > 0 ? 'change-up' : 'change-down';
        
        const changeIcon = !item.change ? 'remove' : 
                         item.change > 0 ? 'arrow_upward' : 'arrow_downward';
        
        const changeText = !item.change ? '0' : 
                         (item.change > 0 ? '+' : '') + formatLargeNumber(item.change);
        
        return `
            <div class="currency-item forex">
                <div class="currency-header">
                    <span class="currency-name">${item.name}</span>
                    <span class="currency-symbol">${item.symbol}</span>
                </div>
                <div class="currency-price">
                    ${formatLargeNumber(item.price)} <span class="currency-unit">${item.unit || 'تومان'}</span>
                </div>
                <div class="currency-changes">
                    <span class="${changeClass}">
                        <i class="material-icons change-icon">${changeIcon}</i>
                        ${changeText}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

// تابع نمایش داده‌های ارزهای دیجیتال
function displayCryptoData(currencyData) {
    if (!currencyData || !Array.isArray(currencyData) || currencyData.length === 0) {
        cryptoItemsContainer.innerHTML = '<p class="no-data">اطلاعات ارزهای دیجیتال در دسترس نیست</p>';
        return;
    }
    
    // فیلتر کردن ارزهای دیجیتال (عموماً با شناسه‌های BTC، ETH و غیره)
    const cryptoItems = currencyData.filter(item => 
        item.type === 'currency' && 
        item.symbol && 
        (item.symbol.startsWith('BTC') || 
         item.symbol.startsWith('ETH') || 
         item.symbol.startsWith('USDT') || 
         item.symbol.startsWith('XRP') || 
         item.symbol.startsWith('BNB') || 
         item.symbol.startsWith('ADA') || 
         item.symbol.startsWith('SOL') || 
         item.symbol.startsWith('USDC'))
    );
    
    if (cryptoItems.length === 0) {
        cryptoItemsContainer.innerHTML = '<p class="no-data">اطلاعات ارزهای دیجیتال در دسترس نیست</p>';
        return;
    }
    
    // مرتب‌سازی ارزهای دیجیتال - بیت‌کوین اول، بقیه به ترتیب الفبا
    const sortedCryptoItems = cryptoItems.sort((a, b) => {
        if (a.symbol.startsWith('BTC') && !b.symbol.startsWith('BTC')) return -1;
        if (!a.symbol.startsWith('BTC') && b.symbol.startsWith('BTC')) return 1;
        
        return a.name.localeCompare(b.name);
    });
    
    // ساخت HTML برای هر ارز دیجیتال
    cryptoItemsContainer.innerHTML = sortedCryptoItems.map(item => {
        // محاسبه تغییرات قیمت
        const changeClass = !item.change ? 'change-neutral' : 
                          item.change > 0 ? 'change-up' : 'change-down';
        
        const changeIcon = !item.change ? 'remove' : 
                         item.change > 0 ? 'arrow_upward' : 'arrow_downward';
        
        const changeText = !item.change ? '0' : 
                         (item.change > 0 ? '+' : '') + formatLargeNumber(item.change);
        
        return `
            <div class="currency-item crypto">
                <div class="currency-header">
                    <span class="currency-name">${item.name}</span>
                    <span class="currency-symbol">${item.symbol}</span>
                </div>
                <div class="currency-price">
                    ${formatLargeNumber(item.price)} <span class="currency-unit">${item.unit || 'تومان'}</span>
                </div>
                <div class="currency-changes">
                    <span class="${changeClass}">
                        <i class="material-icons change-icon">${changeIcon}</i>
                        ${changeText}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

// رویداد دکمه تلاش مجدد
retryBtn.addEventListener('click', fetchCurrencyData);
