// حالت خودکار دارک/لایت بر اساس تم تلگرام کاربر
const themeBtn = document.getElementById('theme-toggle');
const root = document.body;

// متغیرهای مهم برای نمایش قیمت‌ها
const goldItemsContainer = document.getElementById('gold-items');
const currencyItemsContainer = document.getElementById('currency-items');
const cryptoItemsContainer = document.getElementById('crypto-items');
const goldLoading = document.getElementById('gold-loading');
const currencyLoading = document.getElementById('currency-loading');
const cryptoLoading = document.getElementById('crypto-loading');
const currencyError = document.getElementById('currency-error');
const updateTimeElement = document.getElementById('update-time');
const cryptoSearch = document.getElementById('crypto-search');

// برای ذخیره تب فعال فعلی
let activeTab = 'gold-section';

// کلید API جدید navasan.tech (شما باید این کلید را جایگزین کنید)
const API_KEY = 'YOUR_API_KEY_HERE'; // اینجا کلید API خود را وارد کنید

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

// لیست ارزهای دیجیتال موردنظر برای نمایش (ریالی)
const cryptoCurrenciesIRT = [
    "BTCIRT", "ETHIRT", "LTCIRT", "USDTIRT", "XRPIRT", "BCHIRT", "BNBIRT", "EOSIRT", 
    "XLMIRT", "ETCIRT", "TRXIRT", "DOGEIRT", "UNIIRT", "DAIIRT", "LINKIRT", "DOTIRT", 
    "AAVEIRT", "ADAIRT", "SHIBIRT", "FTMIRT", "MATICIRT", "AXSIRT", "MANAIRT", "SANDIRT", 
    "AVAXIRT", "MKRIRT", "GMTIRT", "USDCIRT", "CHZIRT", "GRTIRT", "CRVIRT", "EGLDIRT", 
    "GALIRT", "HBARIRT", "IMXIRT", "WBTCIRT", "ONEIRT", "ENSIRT", "1M_BTTIRT", "SUSHIIRT", 
    "LDOIRT", "ZROIRT", "STORJIRT", "ANTIRT", "100K_FLOKIIRT", "GLMIRT", "OMIRT", "RDNTIRT", 
    "NOTIRT", "CVXIRT", "XTZIRT", "FILIRT", "UMAIRT", "1B_BABYDOGEIRT", "BANDIRT", "SSVIRT", 
    "DAOIRT", "BLURIRT", "GMXIRT", "SKLIRT", "SNTIRT", "NMRIRT", "API3IRT", "WLDIRT", 
    "SOLIRT", "QNTIRT", "FETIRT", "AGIXIRT", "LPTIRT", "SLPIRT", "COMPIRT", "MEMEIRT", 
    "BATIRT", "TRBIRT", "AGLDIRT", "MDTIRT", "LRCIRT", "BICOIRT", "MAGICIRT", "ETHFIIRT", 
    "1INCHIRT", "1M_NFTIRT", "ARBIRT", "BALIRT", "TONIRT", "CELRIRT", "ALGOIRT", "MASKIRT", 
    "EGALAIRT", "FLOWIRT", "OMGIRT", "ENJIRT", "DYDXIRT", "JSTIRT", "HMSTRIRT", "MAJORIRT"
];

// لیست ارزهای دیجیتال موردنظر برای نمایش (دلاری)
const cryptoCurrenciesUSDT = [
    "BTCUSDT", "ETHUSDT", "LTCUSDT", "XRPUSDT", "BCHUSDT", "BNBUSDT", "EOSUSDT", 
    "XLMUSDT", "ETCUSDT", "TRXUSDT", "PMNUSDT", "DOGEUSDT", "UNIUSDT", "DAIUSDT", 
    "LINKUSDT", "DOTUSDT", "AAVEUSDT", "ADAUSDT", "SHIBUSDT", "FTMUSDT", "MATICUSDT", 
    "AXSUSDT", "MANAUSDT", "SANDUSDT", "AVAXUSDT", "MKRUSDT", "GMTUSDT", "USDCUSDT", 
    "BANDUSDT", "COMPUSDT", "HBARUSDT", "WBTCUSDT", "GLMUSDT", "ENSUSDT", "AEVOUSDT", 
    "RSRUSDT", "API3USDT", "ONEUSDT", "EGALAUSDT", "XTZUSDT", "FLOWUSDT", "CVCUSDT", 
    "NMRUSDT", "BATUSDT", "TRBUSDT", "RDNTUSDT", "OMUSDT", "YFIUSDT", "QNTUSDT", 
    "IMXUSDT", "GMXUSDT", "ETHFIUSDT", "GRTUSDT", "WLDUSDT", "NOTUSDT", "MAGICUSDT", 
    "MEMEUSDT", "SOLUSDT", "BALUSDT", "DAOUSDT", "SNXUSDT", "SSVUSDT", "RNDRUSDT", 
    "NEARUSDT", "WOOUSDT", "CRVUSDT", "EGLDUSDT", "LPTUSDT", "BICOUSDT", "ANTUSDT", 
    "1INCHUSDT", "SLPUSDT", "CVXUSDT", "TONUSDT", "BLURUSDT", "CELRUSDT", "DYDXUSDT", 
    "ZROUSDT", "ARBUSDT", "APTUSDT", "UMAUSDT", "ZRXUSDT", "SUSHIUSDT", "FETUSDT", 
    "ALGOUSDT", "MASKUSDT", "STORJUSDT", "XMRUSDT", "SNTUSDT", "APEUSDT", "FILUSDT", 
    "ENJUSDT", "OMGUSDT", "CHZUSDT", "JSTUSDT", "HMSTRUSDT", "MAJORUSDT"
];

// نام‌های فارسی ارزهای دیجیتال 
const cryptoNames = {
    "BTC": "بیت‌کوین",
    "ETH": "اتریوم",
    "LTC": "لایت‌کوین",
    "USDT": "تتر",
    "XRP": "ریپل",
    "BCH": "بیت‌کوین‌کش",
    "BNB": "بایننس‌کوین",
    "EOS": "ایاس",
    "XLM": "استلار",
    "ETC": "اتریوم‌کلاسیک",
    "TRX": "ترون",
    "PMN": "پی‌ام‌ان",
    "DOGE": "دوج‌کوین",
    "UNI": "یونی‌سواپ",
    "DAI": "دای",
    "LINK": "چین‌لینک",
    "DOT": "پولکادات",
    "AAVE": "آوه",
    "ADA": "کاردانو",
    "SHIB": "شیبا اینو",
    "FTM": "فانتوم",
    "MATIC": "پالیگان",
    "AXS": "اکسی اینفینیتی",
    "MANA": "مانا (دیسنترالند)",
    "SAND": "سندباکس",
    "AVAX": "آوالانچ",
    "MKR": "میکر",
    "GMT": "جی‌ام‌تی (StepN)",
    "USDC": "یو‌اس‌دی‌کوین",
    "BAND": "بند پروتکل",
    "COMP": "کامپاند",
    "HBAR": "هدرا هش‌گراف",
    "WBTC": "رپد بیت‌کوین",
    "GLM": "گولم",
    "ENS": "اتریوم نیم سرویس",
    "AEVO": "ایوو",
    "RSR": "ریزرو رایتس",
    "API3": "ای‌پی‌آی۳",
    "ONE": "هارمونی وان",
    "EGALA": "گالا",
    "XTZ": "تزوس",
    "FLOW": "فلو",
    "CVC": "سیویک",
    "NMR": "نومرای",
    "BAT": "بیسیک اتنشن توکن",
    "TRB": "تلور",
    "RDNT": "رادینت",
    "OM": "اومیس‌گو",
    "YFI": "یرن فایننس",
    "QNT": "کوانت",
    "IMX": "ایمیوتبل ایکس",
    "GMX": "جی‌ام‌ایکس",
    "ETHFI": "اتریوم‌فای",
    "GRT": "گراف",
    "WLD": "ورلد‌کوین",
    "NOT": "نات‌کوین",
    "MAGIC": "مجیک",
    "MEME": "میم‌کوین",
    "SOL": "سولانا",
    "BAL": "بالانسر",
    "DAO": "دائو میکر",
    "SNX": "سینتتیکس",
    "SSV": "اس‌اس‌وی نتورک",
    "RNDR": "رندر",
    "NEAR": "نیر پروتکل",
    "WOO": "وو نتورک",
    "CRV": "کرو",
    "EGLD": "مولتی‌ورس‌ایکس (الروند)",
    "LPT": "لایو‌پییر",
    "BICO": "بیکونومی",
    "ANT": "آراگون",
    "1INCH": "وان‌اینچ",
    "SLP": "اسموث لاو پوشن",
    "CVX": "کانوکس فایننس",
    "TON": "تون‌کوین",
    "BLUR": "بلور",
    "CELR": "سلر نتورک",
    "DYDX": "دی‌وای‌دی‌اکس",
    "ZRO": "لایه‌زیرو",
    "ARB": "آربیتروم",
    "APT": "آپتوس",
    "UMA": "یو‌ام‌ای",
    "ZRX": "زیروایکس",
    "SUSHI": "سوشی‌سواپ",
    "FET": "فچ.ای‌آی",
    "ALGO": "الگوراند",
    "MASK": "مسک نتورک",
    "STORJ": "استورج",
    "XMR": "مونرو",
    "SNT": "استاتوس",
    "APE": "ایپ‌کوین",
    "FIL": "فایل‌کوین",
    "ENJ": "انجین‌کوین",
    "OMG": "اومیس‌گو",
    "CHZ": "چیلیز",
    "JST": "جاست",
    "HMSTR": "همستر",
    "MAJOR": "میجر",
    "GAL": "گالاکسی",
    "AGIX": "سینگولاریتی نت",
    "LDO": "لیدو دائو",
    "SKL": "اسکیل نتورک",
    "AGLD": "ادونچر گلد",
    "MDT": "می‌دیتا",
    "LRC": "لوپرینگ",
    "1M_BTT": "بیت‌تورنت (۱M)",
    "1M_NFT": "NFT (۱M)",
    "100K_FLOKI": "فلوکی (100K)",
    "1B_BABYDOGE": "بیبی‌دوج (1B)"
};

// مدیریت ناوبری
function navigateTo(targetSection) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.getElementById(targetSection).classList.remove('hidden');
    
    // اگر هدف صفحه ارز است، بارگذاری داده‌ها
    if (targetSection === 'currency-page') {
        loadAllData();
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

// مخفی کردن همه لودینگ‌ها
function hideAllLoadings() {
    if (goldLoading) goldLoading.classList.add('hidden');
    if (currencyLoading) currencyLoading.classList.add('hidden');
    if (cryptoLoading) cryptoLoading.classList.add('hidden');
}

// نمایش لودینگ متناسب با تب فعال
function showLoading(tabName) {
    hideAllLoadings();
    
    if (tabName === 'gold-section' && goldLoading) {
        goldLoading.classList.remove('hidden');
    } else if (tabName === 'currency-section' && currencyLoading) {
        currencyLoading.classList.remove('hidden');
    } else if (tabName === 'crypto-section' && cryptoLoading) {
        cryptoLoading.classList.remove('hidden');
    }
}

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
        
        // ذخیره تب فعال و بارگذاری داده‌های مخصوص آن
        activeTab = target;
        
        // بارگذاری داده‌ها برای تب فعال
        if (target === 'gold-section') {
            showLoading('gold-section');
            loadGoldData();
        } else if (target === 'currency-section') {
            showLoading('currency-section');
            loadCurrencyData();
        } else if (target === 'crypto-section') {
            showLoading('crypto-section');
            loadCryptoData();
        }
    });
});

// فرمت‌بندی اعداد به فارسی
function formatNumber(num) {
    // تبدیل به فرمت فارسی با جداکننده هزارگان
    return num.toLocaleString('fa-IR');
}

// فرمت‌بندی قیمت دلاری
function formatDollarPrice(price, includeDecimal = false) {
    const numPrice = parseFloat(price);
    
    // برای اعداد بزرگتر از 10، اعشار نمایش داده نشود
    if (numPrice >= 10 || !includeDecimal) {
        return formatNumber(Math.round(numPrice));
    } else {
        // برای اعداد کوچکتر، تا دو رقم اعشار نمایش داده شود
        return formatNumber(Math.round(numPrice * 100) / 100);
    }
}

// تابع تبدیل تاریخ میلادی به شمسی
function gregorianToJalali(g_d, g_m, g_y) {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    
    let jy = g_y <= 1600 ? 0 : 979;
    g_y -= g_y <= 1600 ? 621 : 1600;
    
    let gy2 = g_m > 2 ? g_y + 1 : g_y;
    let days = 365 * g_y + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) +
               Math.floor((gy2 + 399) / 400) - 80 + g_d + g_d_m[g_m - 1];
    
    jy += 33 * Math.floor(days / 12053);
    days %= 12053;
    
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    
    if (days > 365) {
        jy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }
    
    let jm, jd;
    if (days < 186) {
        jm = 1 + Math.floor(days / 31);
        jd = 1 + days % 31;
    } else {
        jm = 7 + Math.floor((days - 186) / 30);
        jd = 1 + (days - 186) % 30;
    }
    
    return [jy, jm, jd];
}

// به‌روزرسانی زمان آخرین به‌روزرسانی - با تاریخ شمسی
function updateLastUpdateTime() {
    const now = new Date();
    const [jalaliYear, jalaliMonth, jalaliDay] = gregorianToJalali(
        now.getDate(),
        now.getMonth() + 1,
        now.getFullYear()
    );
    
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    const persianDate = `${jalaliYear}/${String(jalaliMonth).padStart(2, '0')}/${String(jalaliDay).padStart(2, '0')}`;
    const persianTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    // نمایش زمان به‌روزرسانی
    if (updateTimeElement) {
        updateTimeElement.textContent = `آخرین به‌روزرسانی: ${persianDate} ساعت ${persianTime}`;
    }
}

// دریافت داده‌ها از API جدید navasan.tech
async function fetchCurrencyRatesFromAPI() {
    try {
        console.log('دریافت داده‌ها از API navasan.tech...');
        
        const response = await fetch(`http://api.navasan.tech/latest/?api_key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('داده‌های API دریافت شد:', data);
        
        return data;
    } catch (error) {
        console.error('خطا در دریافت داده‌ها از API:', error);
        return null;
    }
}

// تبدیل نماد API به نماد استاندارد
function getStandardSymbol(apiSymbol) {
    const symbolMapping = {
        'usd': 'USD',
        'eur': 'EUR',
        'gbp': 'GBP',
        'aed': 'AED',
        'cad': 'CAD',
        'aud': 'AUD',
        'cny': 'CNY',
        'jpy': 'JPY',
        'try': 'TRY',
        'sar': 'SAR',
        'qar': 'QAR',
        'omr': 'OMR',
        'chf': 'CHF',
        'inr': 'INR',
        'pkr': 'PKR',
        'iqd': 'IQD',
        'syp': 'SYP',
        'sek': 'SEK',
        'bhd': 'BHD',
        'afn': 'AFN',
        'myr': 'MYR',
        'thb': 'THB',
        'rub': 'RUB',
        'azn': 'AZN',
        'amd': 'AMD',
        'gel': 'GEL',
        'kwd': 'KWD',
        'sekkeh': 'IR_COIN_EMAMI',
        'bahar': 'IR_COIN_BAHAR',
        'nim': 'IR_COIN_HALF',
        'rob': 'IR_COIN_QUARTER',
        'gerami': 'IR_COIN_1G',
        '18ayar': 'IR_GOLD_18K',
        'abshodeh': 'IR_GOLD_MELTED',
        'usd_xau': 'XAUUSD'
    };
    
    return symbolMapping[apiSymbol] || apiSymbol.toUpperCase();
}

// دریافت اطلاعات آیتم براساس نماد API
function getItemInfo(apiSymbol) {
    const itemInfoMap = {
        'usd': { name: 'دلار آمریکا (USD)', type: 'currency' },
        'eur': { name: 'یورو (EUR)', type: 'currency' },
        'gbp': { name: 'پوند انگلیس (GBP)', type: 'currency' },
        'aed': { name: 'درهم امارات (AED)', type: 'currency' },
        'cad': { name: 'دلار کانادا (CAD)', type: 'currency' },
        'aud': { name: 'دلار استرالیا (AUD)', type: 'currency' },
        'cny': { name: 'یوآن چین (CNY)', type: 'currency' },
        'jpy': { name: 'یکصد ین ژاپن (JPY)', type: 'currency' },
        'try': { name: 'لیر ترکیه (TRY)', type: 'currency' },
        'sar': { name: 'ریال عربستان (SAR)', type: 'currency' },
        'qar': { name: 'ریال قطر (QAR)', type: 'currency' },
        'omr': { name: 'ریال عمان (OMR)', type: 'currency' },
        'chf': { name: 'فرانک سوئیس (CHF)', type: 'currency' },
        'inr': { name: 'روپیه هند (INR)', type: 'currency' },
        'pkr': { name: 'روپیه پاکستان (PKR)', type: 'currency' },
        'iqd': { name: 'دینار عراق (IQD)', type: 'currency' },
        'syp': { name: 'لیره سوریه (SYP)', type: 'currency' },
        'sek': { name: 'کرون سوئد (SEK)', type: 'currency' },
        'bhd': { name: 'دینار بحرین (BHD)', type: 'currency' },
        'afn': { name: 'افغانی (AFN)', type: 'currency' },
        'myr': { name: 'رینگیت مالزی (MYR)', type: 'currency' },
        'thb': { name: 'بات تایلند (THB)', type: 'currency' },
        'rub': { name: 'روبل روسیه (RUB)', type: 'currency' },
        'azn': { name: 'منات آذربایجان (AZN)', type: 'currency' },
        'amd': { name: 'درام ارمنستان (AMD)', type: 'currency' },
        'gel': { name: 'لاری گرجستان (GEL)', type: 'currency' },
        'kwd': { name: 'دینار کویت (KWD)', type: 'currency' },
        'sekkeh': { name: 'سکه امامی', type: 'gold' },
        'bahar': { name: 'سکه بهار آزادی', type: 'gold' },
        'nim': { name: 'نیم سکه', type: 'gold' },
        'rob': { name: 'ربع سکه', type: 'gold' },
        'gerami': { name: 'سکه یک گرمی', type: 'gold' },
        '18ayar': { name: 'طلای 18 عیار', type: 'gold' },
        'abshodeh': { name: 'طلای آب‌شده', type: 'gold' },
        'usd_xau': { name: 'انس طلا', type: 'gold' }
    };
    
    return itemInfoMap[apiSymbol] || { 
        name: apiSymbol.toUpperCase(), 
        type: 'currency' 
    };
}

// بارگذاری همه داده‌ها
function loadAllData() {
    // پنهان کردن خطاها
    if (currencyError) currencyError.classList.add('hidden');
    
    // به‌روزرسانی زمان
    updateLastUpdateTime();
    
    // بارگذاری داده‌ها بر اساس تب فعال
    if (activeTab === 'gold-section') {
        showLoading('gold-section');
        loadGoldData();
    } else if (activeTab === 'currency-section') {
        showLoading('currency-section');
        loadCurrencyData();
    } else if (activeTab === 'crypto-section') {
        showLoading('crypto-section');
        loadCryptoData();
    }
}

// بارگذاری داده‌های طلا از API
async function loadGoldData() {
    try {
        console.log('بارگذاری داده‌های طلا...');
        
        if (goldItemsContainer) {
            // نمایش لودینگ
            if (goldLoading) goldLoading.classList.remove('hidden');
            
            // دریافت داده‌ها از API
            const apiData = await fetchCurrencyRatesFromAPI();
            
            let goldHTML = '';
            
            if (apiData) {
                // پردازش داده‌های دریافتی از API
                goldHTML = getGoldDataFromAPI(apiData);
            } else {
                // استفاده از داده‌های پشتیبان
                goldHTML = getGoldDataHTML();
            }
            
            goldItemsContainer.innerHTML = goldHTML;
            
            // پنهان کردن لودینگ
            if (goldLoading) goldLoading.classList.add('hidden');
        }
    } catch (error) {
        console.error("خطا در بارگذاری داده‌های طلا:", error);
        if (goldLoading) goldLoading.classList.add('hidden');
        if (currencyError) currencyError.classList.remove('hidden');
    }
}

// بارگذاری داده‌های ارز خارجی از API
async function loadCurrencyData() {
    try {
        console.log('بارگذاری داده‌های ارز خارجی...');
        
        if (currencyItemsContainer) {
            // نمایش لودینگ
            if (currencyLoading) currencyLoading.classList.remove('hidden');
            
            // دریافت داده‌ها از API
            const apiData = await fetchCurrencyRatesFromAPI();
            
            let currencyHTML = '';
            
            if (apiData) {
                // پردازش داده‌های دریافتی از API
                currencyHTML = getCurrencyDataFromAPI(apiData);
            } else {
                // استفاده از داده‌های پشتیبان
                currencyHTML = getCurrencyDataHTML();
            }
            
            currencyItemsContainer.innerHTML = currencyHTML;
            
            // پنهان کردن لودینگ
            if (currencyLoading) currencyLoading.classList.add('hidden');
        }
    } catch (error) {
        console.error("خطا در بارگذاری داده‌های ارز:", error);
        if (currencyLoading) currencyLoading.classList.add('hidden');
        if (currencyError) currencyError.classList.remove('hidden');
    }
}

// بارگذاری داده‌های ارز دیجیتال
function loadCryptoData() {
    try {
        // نمایش لودینگ
        if (cryptoLoading) cryptoLoading.classList.remove('hidden');
        
        // پاک کردن داده‌های قبلی
        if (cryptoItemsContainer) cryptoItemsContainer.innerHTML = '';
        
        // دریافت داده‌های API
        fetchCryptoData();
    } catch (error) {
        console.error("خطا در بارگذاری داده‌های ارز دیجیتال:", error);
        if (cryptoLoading) cryptoLoading.classList.add('hidden');
        if (currencyError) currencyError.classList.remove('hidden');
    }
}

// دریافت داده‌های ارزهای دیجیتال از API نوبیتکس
async function fetchCryptoData() {
    try {
        console.log("دریافت داده‌های ارز دیجیتال از API نوبیتکس");
        
        const response = await fetch('https://apiv2.nobitex.ir/v3/orderbook/all');
        const data = await response.json();
        
        if (data && Object.keys(data).length > 0) {
            console.log("داده‌های ارز دیجیتال دریافت شد");
            
            // ساخت HTML ارزهای دیجیتال
            if (cryptoItemsContainer) {
                const cryptoHTML = getCryptoDataHTMLFromAPI(data);
                cryptoItemsContainer.innerHTML = cryptoHTML;
                console.log("داده‌های ارز دیجیتال نمایش داده شد");
                
                // تنظیم جستجوی ارزهای دیجیتال
                setupCryptoSearch();
            }
            
            // مخفی کردن لودینگ
            if (cryptoLoading) {
                cryptoLoading.classList.add('hidden');
            }
            
        } else {
            throw new Error("داده‌های دریافتی از API معتبر نیستند");
        }
    } catch (error) {
        console.error("خطا در دریافت داده‌های ارز دیجیتال:", error);
        
        // استفاده از داده‌های پشتیبان در صورت خطا
        if (cryptoItemsContainer) {
            const cryptoHTML = getFallbackCryptoHTML();
            cryptoItemsContainer.innerHTML = cryptoHTML;
            console.log("داده‌های پشتیبان ارز دیجیتال نمایش داده شد");
            
            // تنظیم جستجوی ارزهای دیجیتال
            setupCryptoSearch();
        }
        
        // مخفی کردن لودینگ
        if (cryptoLoading) {
            cryptoLoading.classList.add('hidden');
        }
    }
}

// تنظیم جستجوی ارزهای دیجیتال
function setupCryptoSearch() {
    if (cryptoSearch) {
        cryptoSearch.addEventListener('input', function() {
            const searchTerm = this.value.trim().toLowerCase();
            const cryptoItems = document.querySelectorAll('#crypto-items .currency-item');
            
            cryptoItems.forEach(item => {
                const cryptoName = item.querySelector('.currency-name').textContent.toLowerCase();
                const cryptoSymbol = item.getAttribute('data-symbol')?.toLowerCase() || '';
                
                if (cryptoName.includes(searchTerm) || cryptoSymbol.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// ساخت HTML برای داده‌های طلا از API
function getGoldDataFromAPI(apiData) {
    const goldSymbols = ['18ayar', 'abshodeh', 'usd_xau', 'sekkeh', 'bahar', 'nim', 'rob', 'gerami'];
    const goldItems = [];
    
    goldSymbols.forEach(symbol => {
        if (apiData[symbol] && apiData[symbol].value) {
            const itemInfo = getItemInfo(symbol);
            goldItems.push({
                name: itemInfo.name,
                price: apiData[symbol].value,
                unit: symbol === 'usd_xau' ? 'دلار' : 'تومان'
            });
        }
    });
    
    // اگر داده‌ای از API نیامد، از داده‌های پشتیبان استفاده کن
    if (goldItems.length === 0) {
        return getGoldDataHTML();
    }
    
    return goldItems.map(item => {
        return `
            <div class="currency-item gold">
                <div class="currency-header">
                    <span class="currency-name">${item.name}</span>
                </div>
                <div class="currency-price">
                    ${formatNumber(parseFloat(item.price))} <span class="currency-unit">${item.unit}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ساخت HTML برای داده‌های ارز خارجی از API
function getCurrencyDataFromAPI(apiData) {
    const mainCurrencies = ['usd', 'eur', 'gbp', 'aed', 'try', 'cad', 'aud', 'cny'];
    const otherCurrencies = ['afn', 'thb', 'amd', 'bhd', 'iqd', 'kwd', 'rub', 'pkr', 'inr', 
                            'sar', 'omr', 'qar', 'myr', 'chf', 'sek', 'gel', 'syp', 'azn', 'jpy'];
    
    const currencyItems = [];
    
    // ارزهای اصلی
    mainCurrencies.forEach(symbol => {
        if (apiData[symbol] && apiData[symbol].value) {
            const itemInfo = getItemInfo(symbol);
            currencyItems.push({
                name: itemInfo.name,
                price: apiData[symbol].value,
                type: 'main'
            });
        }
    });
    
    // سایر ارزها
    otherCurrencies.forEach(symbol => {
        if (apiData[symbol] && apiData[symbol].value) {
            const itemInfo = getItemInfo(symbol);
            currencyItems.push({
                name: itemInfo.name,
                price: apiData[symbol].value,
                type: 'other'
            });
        }
    });
    
    // اگر داده‌ای از API نیامد، از داده‌های پشتیبان استفاده کن
    if (currencyItems.length === 0) {
        return getCurrencyDataHTML();
    }
    
    return currencyItems.map(item => {
        return `
            <div class="currency-item forex">
                <div class="currency-header">
                    <span class="currency-name">${item.name}</span>
                </div>
                <div class="currency-price">
                    ${formatNumber(parseFloat(item.price))} <span class="currency-unit">تومان</span>
                </div>
            </div>
        `;
    }).join('');
}

// ساخت HTML برای داده‌های ارز دیجیتال از API
function getCryptoDataHTMLFromAPI(data) {
    // بررسی ارزهای موجود در API
    const cryptoList = [];
    
    // جمع‌آوری داده‌های ارزهای ریالی
    cryptoCurrenciesIRT.forEach(irtSymbol => {
        if (data[irtSymbol] && data[irtSymbol].lastTradePrice) {
            // گرفتن نام کوتاه ارز (مثلاً BTC از BTCIRT)
            const baseSymbol = irtSymbol.replace('IRT', '');
            
            // معادل USDT آن
            const usdtSymbol = baseSymbol + 'USDT';
            
            // اگر در داده‌های API موجود باشد
            const irtPrice = data[irtSymbol].lastTradePrice;
            const usdtPrice = data[usdtSymbol] ? data[usdtSymbol].lastTradePrice : null;
            
            // نام فارسی ارز
            const shortSymbol = baseSymbol.replace(/^1[BKM]_/, '').replace(/^100K_/, '').replace(/^1B_/, '');
            const name = cryptoNames[shortSymbol] || shortSymbol;
            
            cryptoList.push({
                symbol: baseSymbol,
                name: name,
                irtPrice: irtPrice,
                usdtPrice: usdtPrice
            });
        }
    });
    
    // اضافه کردن ارزهای دلاری که فقط قیمت دلاری دارند
    cryptoCurrenciesUSDT.forEach(usdtSymbol => {
        const baseSymbol = usdtSymbol.replace('USDT', '');
        const irtSymbol = baseSymbol + 'IRT';
        
        // اگر قبلاً اضافه نشده و در داده‌ها موجود است
        if (!cryptoList.some(item => item.symbol === baseSymbol) && data[usdtSymbol] && data[usdtSymbol].lastTradePrice) {
            const usdtPrice = data[usdtSymbol].lastTradePrice;
            
            // نام فارسی ارز
            const shortSymbol = baseSymbol.replace(/^1[BKM]_/, '').replace(/^100K_/, '').replace(/^1B_/, '');
            const name = cryptoNames[shortSymbol] || shortSymbol;
            
            cryptoList.push({
                symbol: baseSymbol,
                name: name,
                irtPrice: null,
                usdtPrice: usdtPrice
            });
        }
    });
    
    // اگر هیچ ارزی یافت نشد
    if (cryptoList.length === 0) {
        return '<p class="no-data">اطلاعات ارزهای دیجیتال در دسترس نیست</p>';
    }
    
    // مرتب‌سازی بر اساس اهمیت (BTC و ETH اول، بقیه به ترتیب الفبا)
    cryptoList.sort((a, b) => {
        if (a.symbol === 'BTC') return -1;
        if (b.symbol === 'BTC') return 1;
        if (a.symbol === 'ETH') return -1;
        if (b.symbol === 'ETH') return 1;
        return a.name.localeCompare(b.name);
    });
    
    // ساخت HTML برای هر ارز دیجیتال
    return cryptoList.map(crypto => {
        // نمایش قیمت ریالی (تومانی)
        let irtPriceHtml = '';
        if (crypto.irtPrice) {
            // تبدیل قیمت ریال به تومان
            const tomanPrice = Math.floor(parseInt(crypto.irtPrice) / 10);
            irtPriceHtml = `<div class="crypto-price-irt">${formatNumber(tomanPrice)} <span class="crypto-unit">تومان</span></div>`;
        }
        
        // نمایش قیمت دلاری (با مدیریت اعشار)
        let usdtPriceHtml = '';
        if (crypto.usdtPrice) {
            // برای اعداد کوچکتر از 10، اعشار نمایش داده شود
            const showDecimal = parseFloat(crypto.usdtPrice) < 10;
            usdtPriceHtml = `<div class="crypto-price-usdt">${formatDollarPrice(crypto.usdtPrice, showDecimal)} <span class="crypto-unit">دلار</span></div>`;
        }
        
        return `
            <div class="currency-item crypto" data-symbol="${crypto.symbol}">
                <div class="currency-header">
                    <span class="currency-name">${crypto.name}</span>
                    <span class="currency-symbol">${crypto.symbol}</span>
                </div>
                <div class="crypto-prices">
                    ${irtPriceHtml}
                    ${usdtPriceHtml}
                </div>
            </div>
        `;
    }).join('');
}

// ساخت HTML برای داده‌های پشتیبان ارز دیجیتال
function getFallbackCryptoHTML() {
    const cryptoData = [
        { symbol: "BTC", name: "بیت‌کوین", tomanPrice: 11218050000, usdPrice: 109650 },
        { symbol: "ETH", name: "اتریوم", tomanPrice: 690000000, usdPrice: 6750 },
        { symbol: "USDT", name: "تتر", tomanPrice: 102500, usdPrice: 1 },
        { symbol: "XRP", name: "ریپل", tomanPrice: 21850, usdPrice: 1 },
        { symbol: "BNB", name: "بایننس‌کوین", tomanPrice: 68500000, usdPrice: 670 },
        { symbol: "ADA", name: "کاردانو", tomanPrice: 16800, usdPrice: 1 },
        { symbol: "SOL", name: "سولانا", tomanPrice: 34400000, usdPrice: 336 },
        { symbol: "DOGE", name: "دوج‌کوین", tomanPrice: 4350, usdPrice: 0.125 },
        { symbol: "SHIB", name: "شیبا اینو", tomanPrice: 97, usdPrice: 0.000009 },
        { symbol: "DOT", name: "پولکادات", tomanPrice: 1980000, usdPrice: 19 },
        { symbol: "TRX", name: "ترون", tomanPrice: 3870, usdPrice: 0.13 },
        { symbol: "AVAX", name: "آوالانچ", tomanPrice: 8750000, usdPrice: 85 },
        { symbol: "MATIC", name: "پالیگان", tomanPrice: 31500, usdPrice: 0.31 },
        { symbol: "LINK", name: "چین‌لینک", tomanPrice: 2870000, usdPrice: 28 },
        { symbol: "LTC", name: "لایت‌کوین", tomanPrice: 4850000, usdPrice: 47 },
        { symbol: "BCH", name: "بیت‌کوین کش", tomanPrice: 7920000, usdPrice: 78 },
        { symbol: "USDC", name: "یو‌اس‌دی‌کوین", tomanPrice: 102300, usdPrice: 1 },
        { symbol: "XLM", name: "استلار", tomanPrice: 3850, usdPrice: 0.11 },
        { symbol: "ETC", name: "اتریوم کلاسیک", tomanPrice: 1750000, usdPrice: 17 },
        { symbol: "UNI", name: "یونی سواپ", tomanPrice: 870000, usdPrice: 8 },
        { symbol: "DAI", name: "دای", tomanPrice: 102500, usdPrice: 1 },
        { symbol: "AAVE", name: "آوه", tomanPrice: 10450000, usdPrice: 102 },
        { symbol: "FTM", name: "فانتوم", tomanPrice: 68500, usdPrice: 0.67 },
        { symbol: "AXS", name: "اکسی اینفینیتی", tomanPrice: 785000, usdPrice: 7 },
        { symbol: "MANA", name: "مانا (دیسنترالند)", tomanPrice: 69800, usdPrice: 0.68 },
        { symbol: "SAND", name: "سندباکس", tomanPrice: 58700, usdPrice: 0.57 },
        { symbol: "MKR", name: "میکر", tomanPrice: 184500000, usdPrice: 1804 },
        { symbol: "GMT", name: "جی‌ام‌تی", tomanPrice: 28500, usdPrice: 0.28 },
        { symbol: "CHZ", name: "چیلیز", tomanPrice: 12800, usdPrice: 0.13 },
        { symbol: "GRT", name: "گراف", tomanPrice: 21500, usdPrice: 0.21 }
    ];
    
    return cryptoData.map(crypto => {
        // قیمت دلاری با مدیریت اعشار
        const showDecimal = crypto.usdPrice < 10;
        
        return `
            <div class="currency-item crypto" data-symbol="${crypto.symbol}">
                <div class="currency-header">
                    <span class="currency-name">${crypto.name}</span>
                    <span class="currency-symbol">${crypto.symbol}</span>
                </div>
                <div class="crypto-prices">
                    <div class="crypto-price-irt">${formatNumber(crypto.tomanPrice)} <span class="crypto-unit">تومان</span></div>
                    <div class="crypto-price-usdt">${formatDollarPrice(crypto.usdPrice, showDecimal)} <span class="crypto-unit">دلار</span></div>
                </div>
            </div>
        `;
    }).join('');
}

// ساخت HTML برای داده‌های طلا - با قیمت‌های جدید
function getGoldDataHTML() {
    const goldData = [
        { name: "طلای 18 عیار", price: 10593060, unit: "تومان" },
        { name: "طلای آب‌شده", price: 45890, unit: "تومان" },
        { name: "انس طلا", price: 4002.93, unit: "دلار" },
        { name: "سکه امامی", price: 111600, unit: "تومان" },
        { name: "سکه بهار آزادی", price: 105100, unit: "تومان" },
        { name: "نیم سکه", price: 58100, unit: "تومان" },
        { name: "ربع سکه", price: 33800, unit: "تومان" },
        { name: "سکه یک گرمی", price: 16500, unit: "تومان" }
    ];
    
    return goldData.map(item => {
        return `
            <div class="currency-item gold">
                <div class="currency-header">
                    <span class="currency-name">${item.name}</span>
                </div>
                <div class="currency-price">
                    ${formatNumber(item.price)} <span class="currency-unit">${item.unit}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ساخت HTML برای داده‌های ارز خارجی - با قیمت‌های جدید
function getCurrencyDataHTML() {
    const currencyData = [
        // ارزهای اصلی
        { name: "دلار آمریکا (USD)", price: 108750, unit: "تومان" },
        { name: "یورو (EUR)", price: 126140, unit: "تومان" },
        { name: "پوند انگلیس (GBP)", price: 143060, unit: "تومان" },
        { name: "درهم امارات (AED)", price: 29890, unit: "تومان" },
        { name: "لیر ترکیه (TRY)", price: 2590, unit: "تومان" },
        { name: "دلار کانادا (CAD)", price: 77390, unit: "تومان" },
        { name: "دلار استرالیا (AUD)", price: 71370, unit: "تومان" },
        { name: "یوآن چین (CNY)", price: 15280, unit: "تومان" },
        
        // سایر ارزها
        { name: "افغانی (AFN)", price: 1635, unit: "تومان" },
        { name: "بات تایلند (THB)", price: 3355, unit: "تومان" },
        { name: "درام ارمنستان (AMD)", price: 285.14, unit: "تومان" },
        { name: "دینار بحرین (BHD)", price: 289990, unit: "تومان" },
        { name: "دینار عراق (IQD)", price: 83.25, unit: "تومان" },
        { name: "دینار کویت (KWD)", price: 354330, unit: "تومان" },
        { name: "روبل روسیه (RUB)", price: 1355, unit: "تومان" },
        { name: "روپیه پاکستان (PKR)", price: 385.12, unit: "تومان" },
        { name: "روپیه هند (INR)", price: 1225, unit: "تومان" },
        { name: "ریال عربستان (SAR)", price: 29000, unit: "تومان" },
        { name: "ریال عمان (OMR)", price: 284280, unit: "تومان" },
        { name: "ریال قطر (QAR)", price: 29920, unit: "تومان" },
        { name: "رینگیت مالزی (MYR)", price: 25970, unit: "تومان" },
        { name: "فرانک سوئیس (CHF)", price: 135060, unit: "تومان" },
        { name: "کرون سوئد (SEK)", price: 11450, unit: "تومان" },
        { name: "لاری گرجستان (GEL)", price: 40050, unit: "تومان" },
        { name: "لیره سوریه (SYP)", price: 9.84, unit: "تومان" },
        { name: "منات آذربایجان (AZN)", price: 63820, unit: "تومان" },
        { name: "یکصد ین ژاپن (JPY)", price: 705, unit: "تومان" }
    ];
    
    return currencyData.map(item => {
        return `
            <div class="currency-item forex">
                <div class="currency-header">
                    <span class="currency-name">${item.name}</span>
                </div>
                <div class="currency-price">
                    ${formatNumber(item.price)} <span class="currency-unit">${item.unit}</span>
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
const copyNumericBtn = document.getElementById('copy-numeric');
const copyTextBtn = document.getElementById('copy-text');

// تنظیم متن لیبل براساس نوع تبدیل
conversionTypeSelect?.addEventListener('change', function() {
    if (this.value === 'toman-to-rial') {
        if (amountLabel) amountLabel.textContent = 'مبلغ را به تومان وارد کنید:';
    } else {
        if (amountLabel) amountLabel.textContent = 'مبلغ را به ریال وارد کنید:';
    }
    if (resultContainer) resultContainer.classList.add('hidden');
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

amountInput?.addEventListener('input', function(e) {
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

convertBtn?.addEventListener('click', function() {
    const inputValue = rawNumber || amountInput?.value.replace(/[^\d]/g, '');
    if (!inputValue) {
        alert('لطفاً یک عدد وارد کنید');
        return;
    }
    let rialValue, tomanValue;
    if (conversionTypeSelect?.value === 'toman-to-rial') {
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

copyNumericBtn?.addEventListener('click', function() {
    copyToClipboard(numericResult.textContent);
    showToast('نتیجه عددی کپی شد');
});

copyTextBtn?.addEventListener('click', function() {
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

// شروع خودکار نمایش داده‌ها
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded: صفحه بارگذاری شد');
    
    // تنظیم تب فعال اولیه
    activeTab = 'gold-section';
    
    // نمایش داده‌ها برای صفحه فعال
    if (!document.getElementById('currency-page').classList.contains('hidden')) {
        loadAllData();
    }
    
    // افزودن رویداد برای دکمه تلاش مجدد
    document.getElementById('retry-btn')?.addEventListener('click', loadAllData);
    
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
});

// بارگذاری مجدد در حالت سرویس کارگر
window.addEventListener('load', function() {
    console.log('Window loaded: پنجره بارگذاری شد');
    
    // اجرای مجدد با تاخیر برای اطمینان از بارگذاری کامل DOM
    setTimeout(() => {
        if (!document.getElementById('currency-page').classList.contains('hidden')) {
            loadAllData();
        }
    }, 500);
});

// برقراری ارتباط با تلگرام
if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.expand();
    window.Telegram.WebApp.ready();
    
    // اگر کاربر در تلگرام تم را تغییر داد (در لحظه)
    if (window.Telegram.WebApp.onEvent) {
        window.Telegram.WebApp.onEvent('themeChanged', setThemeByTelegram);
    }
}
