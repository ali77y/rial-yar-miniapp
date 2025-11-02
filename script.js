// حالت خودکار دارک/لایت بر اساس تم تلگرام کاربر
const themeBtn = document.getElementById('theme-toggle');
const root = document.body;

// متغیرهای مهم برای نمایش قیمت‌ها
const goldItemsContainer = document.getElementById('gold-items');
const currencyItemsContainer = document.getElementById('currency-items');
const cryptoItemsContainer = document.getElementById('crypto-items');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.getElementById('loading-text'); // نیاز به وجود این المان در HTML
const currencyError = document.getElementById('currency-error');
const updateTimeElement = document.getElementById('update-time');
const cryptoSearch = document.getElementById('crypto-search');

// برای ذخیره تب فعال فعلی
let activeTab = 'gold-section';

// متغیر global برای ذخیره داده‌های API
let globalApiData = null;

// تابع تنظیم تم بر اساس Telegram WebApp theme
function setThemeByTelegram() {
    const webapp = window.Telegram?.WebApp;
    if (webapp && webapp.themeParams) {
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

setThemeByTelegram();

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

const cryptoNames = {
    "BTC": "بیت‌کوین", "ETH": "اتریوم", "LTC": "لایت‌کوین", "USDT": "تتر", "XRP": "ریپل",
    "BCH": "بیت‌کوین‌کش", "BNB": "بایننس‌کوین", "EOS": "ایاس", "XLM": "استلار", "ETC": "اتریوم‌کلاسیک",
    "TRX": "ترون", "PMN": "پی‌ام‌ان", "DOGE": "دوج‌کوین", "UNI": "یونی‌سواپ", "DAI": "دای",
    "LINK": "چین‌لینک", "DOT": "پولکادات", "AAVE": "آوه", "ADA": "کاردانو", "SHIB": "شیبا اینو",
    "FTM": "فانتوم", "MATIC": "پالیگان", "AXS": "اکسی اینفینیتی", "MANA": "مانا (دیسنترالند)", "SAND": "سندباکس",
    "AVAX": "آوالانچ", "MKR": "میکر", "GMT": "جی‌ام‌تی (StepN)", "USDC": "یو‌اس‌دی‌کوین", "BAND": "بند پروتکل",
    "COMP": "کامپاند", "HBAR": "هدرا هش‌گراف", "WBTC": "رپد بیت‌کوین", "GLM": "گولم", "ENS": "اتریوم نیم سرویس",
    "AEVO": "ایوو", "RSR": "ریزرو رایتس", "API3": "ای‌پی‌آی۳", "ONE": "هارمونی وان", "EGALA": "گالا",
    "XTZ": "تزوس", "FLOW": "فلو", "CVC": "سیویک", "NMR": "نومرای", "BAT": "بیسیک اتنشن توکن",
    "TRB": "تلور", "RDNT": "رادینت", "OM": "اومیس‌گو", "YFI": "یرن فایننس", "QNT": "کوانت",
    "IMX": "ایمیوتبل ایکس", "GMX": "جی‌ام‌ایکس", "ETHFI": "اتریوم‌فای", "GRT": "گراف", "WLD": "ورلد‌کوین",
    "NOT": "نات‌کوین", "MAGIC": "مجیک", "MEME": "میم‌کوین", "SOL": "سولانا", "BAL": "بالانسر",
    "DAO": "دائو میکر", "SNX": "سینتتیکس", "SSV": "اس‌اس‌وی نتورک", "RNDR": "رندر", "NEAR": "نیر پروتکل",
    "WOO": "وو نتورک", "CRV": "کرو", "EGLD": "مولتی‌ورس‌ایکس (الروند)", "LPT": "لایو‌پییر", "BICO": "بیکونومی",
    "ANT": "آراگون", "1INCH": "وان‌اینچ", "SLP": "اسموث لاو پوشن", "CVX": "کانوکس فایننس", "TON": "تون‌کوین",
    "BLUR": "بلور", "CELR": "سلر نتورک", "DYDX": "دی‌وای‌دی‌اکس", "ZRO": "لایه‌زیرو", "ARB": "آربیتروم",
    "APT": "آپتوس", "UMA": "یو‌ام‌ای", "ZRX": "زیروایکس", "SUSHI": "سوشی‌سواپ", "FET": "فچ.ای‌آی",
    "ALGO": "الگوراند", "MASK": "مسک نتورک", "STORJ": "استورج", "XMR": "مونرو", "SNT": "استاتوس",
    "APE": "ایپ‌کوین", "FIL": "فایل‌کوین", "ENJ": "انجین‌کوین", "OMG": "اومیس‌گو", "CHZ": "چیلیز",
    "JST": "جاست", "HMSTR": "همستر", "MAJOR": "میجر", "GAL": "گالاکسی", "AGIX": "سینگولاریتی نت",
    "LDO": "لیدو دائو", "SKL": "اسکیل نتورک", "AGLD": "ادونچر گلد", "MDT": "می‌دیتا", "LRC": "لوپرینگ",
    "1M_BTT": "بیت‌تورنت (۱M)", "1M_NFT": "NFT (۱M)", "100K_FLOKI": "فلوکی (100K)", "1B_BABYDOGE": "بیبی‌دوج (1B)"
};

// --- کمک‌فانکشن‌ها ---
function formatNumber(num) {
    return num.toLocaleString('fa-IR');
}
function formatDollarPrice(price, includeDecimal = false) {
    const numPrice = parseFloat(price);
    if (numPrice >= 10 || !includeDecimal) return formatNumber(Math.round(numPrice));
    return formatNumber(Math.round(numPrice * 100) / 100);
}
function gregorianToJalali(g_d, g_m, g_y) {
    const g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];
    let jy = g_y <= 1600 ? 0 : 979;
    g_y -= g_y <= 1600 ? 621 : 1600;
    let gy2 = g_m > 2 ? g_y + 1 : g_y;
    let days = 365*g_y + Math.floor((gy2+3)/4) - Math.floor((gy2+99)/100) + Math.floor((gy2+399)/400) - 80 + g_d + g_d_m[g_m-1];
    jy += 33*Math.floor(days/12053);
    days %= 12053;
    jy += 4*Math.floor(days/1461);
    days %= 1461;
    if (days > 365) {
        jy += Math.floor((days-1)/365);
        days = (days-1)%365;
    }
    let jm,jd;
    if (days < 186) { jm = 1 + Math.floor(days/31); jd = 1 + days%31; }
    else { jm = 7 + Math.floor((days-186)/30); jd = 1 + (days-186)%30; }
    return [jy,jm,jd];
}
function updateLastUpdateTime() {
    const now = new Date();
    const [jy,jm,jd] = gregorianToJalali(now.getDate(), now.getMonth()+1, now.getFullYear());
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    if (updateTimeElement) updateTimeElement.textContent = `آخرین به‌روزرسانی: ${jy}/${String(jm).padStart(2,'0')}/${String(jd).padStart(2,'0')} ساعت ${hh}:${mm}`;
}

// --- کنترل overlay با رنگ تب فعلی ---
function clearOverlayClasses() {
    if (!loadingOverlay) return;
    loadingOverlay.classList.remove('overlay-gold','overlay-forex','overlay-crypto');
}
function showLoading(section) {
    if (!loadingOverlay) return;
    clearOverlayClasses();
    if (section === 'gold-section') {
        loadingOverlay.classList.add('overlay-gold');
        if (loadingText) loadingText.textContent = 'در حال دریافت قیمت‌های طلا و سکه...';
    } else if (section === 'currency-section') {
        loadingOverlay.classList.add('overlay-forex');
        if (loadingText) loadingText.textContent = 'در حال دریافت قیمت‌های ارزهای خارجی...';
    } else if (section === 'crypto-section') {
        loadingOverlay.classList.add('overlay-crypto');
        if (loadingText) loadingText.textContent = 'در حال دریافت قیمت‌های ارزهای دیجیتال...';
    } else {
        if (loadingText) loadingText.textContent = 'در حال دریافت قیمت‌ها...';
    }
    loadingOverlay.classList.remove('hidden');
    loadingOverlay.setAttribute('aria-hidden','false');
}
function hideLoading() {
    if (!loadingOverlay) return;
    loadingOverlay.classList.add('hidden');
    loadingOverlay.setAttribute('aria-hidden','true');
    clearOverlayClasses();
}

// تولید داده‌های Real-time (فقط برای دمو / fallback)
function generateRealTimeData() {
    const now = new Date();
    const rf = (now.getMinutes()*now.getSeconds() + now.getMilliseconds())/100000;
    return {
        '18ayar': Math.round(10593060 + (rf * 100000)),
        'abshodeh': Math.round(45890 + (rf * 1000)),
        'usd_xau': Math.round((4002.93 + (rf * 50))*100)/100,
        'sekkeh': Math.round(111600 + (rf * 2000)),
        'bahar': Math.round(105100 + (rf * 2000)),
        'nim': Math.round(58100 + (rf * 1000)),
        'rob': Math.round(33800 + (rf * 500)),
        'gerami': Math.round(16500 + (rf * 300)),
        'usd': Math.round(108750 + (rf * 2000)),
        'eur': Math.round(126140 + (rf * 2500)),
        'gbp': Math.round(143060 + (rf * 2800)),
        'aed': Math.round(29890 + (rf * 600)),
        'try': Math.round(2590 + (rf * 50)),
        'cad': Math.round(77390 + (rf * 1500)),
        'aud': Math.round(71370 + (rf * 1400)),
        'cny': Math.round(15280 + (rf * 300)),
        'afn': Math.round(1635 + (rf * 30)),
        'thb': Math.round(3355 + (rf * 60)),
        'amd': Math.round(285.14 + (rf * 5)),
        'bhd': Math.round(289990 + (rf * 5000)),
        'iqd': Math.round(83.25 + (rf * 2)),
        'kwd': Math.round(354330 + (rf * 7000)),
        'rub': Math.round(1355 + (rf * 25)),
        'pkr': Math.round(385.12 + (rf * 8)),
        'inr': Math.round(1225 + (rf * 25)),
        'sar': Math.round(29000 + (rf * 600)),
        'omr': Math.round(284280 + (rf * 5000)),
        'qar': Math.round(29920 + (rf * 600)),
        'myr': Math.round(25970 + (rf * 500)),
        'chf': Math.round(135060 + (rf * 2700)),
        'sek': Math.round(11450 + (rf * 200)),
        'gel': Math.round(40050 + (rf * 800)),
        'syp': Math.round(9.84 + (rf * 0.2)),
        'azn': Math.round(63820 + (rf * 1200)),
        'jpy': Math.round(705 + (rf * 15))
    };
}

// بارگذاری همه داده‌ها
async function loadAllData() {
    try {
        if (currencyError) currencyError.classList.add('hidden');
        updateLastUpdateTime();

        // نمایش loading بر اساس تب فعال
        showLoading(activeTab);

        // دریافت یا تولید داده‌ها (در پروژه واقعی اینجا fetch از API قرار می‌گیرد)
        const apiData = generateRealTimeData();
        globalApiData = apiData;

        if (activeTab === 'gold-section') await loadGoldDataWithAPI(apiData);
        else if (activeTab === 'currency-section') await loadCurrencyDataWithAPI(apiData);
        else if (activeTab === 'crypto-section') await loadCryptoData();
    } catch (err) {
        console.error('loadAllData error', err);
        hideLoading();
        if (currencyError) currencyError.classList.remove('hidden');
    }
}

// بارگذاری طلا با API (یا داده تولیدی)
async function loadGoldDataWithAPI(apiData) {
    try {
        if (!goldItemsContainer) return;
        const goldHTML = getGoldDataFromAPI(apiData);
        goldItemsContainer.innerHTML = goldHTML;
        // اطمینان از مخفی شدن overlay بعد از نمایش
        setTimeout(() => hideLoading(), 350);
    } catch (err) {
        console.error('loadGoldDataWithAPI', err);
        hideLoading();
        if (currencyError) currencyError.classList.remove('hidden');
    }
}

// بارگذاری ارزها
async function loadCurrencyDataWithAPI(apiData) {
    try {
        if (!currencyItemsContainer) return;
        const currencyHTML = getCurrencyDataFromAPI(apiData);
        currencyItemsContainer.innerHTML = currencyHTML;
        setTimeout(() => hideLoading(), 350);
    } catch (err) {
        console.error('loadCurrencyDataWithAPI', err);
        hideLoading();
        if (currencyError) currencyError.classList.remove('hidden');
    }
}

async function loadGoldData() {
    if (globalApiData) await loadGoldDataWithAPI(globalApiData);
    else await loadAllData();
}
async function loadCurrencyData() {
    if (globalApiData) await loadCurrencyDataWithAPI(globalApiData);
    else await loadAllData();
}

// پردازش طلا: به جز 'طلای 18 عیار' و 'انس طلا' بقیه مقادیر *1000 شوند (اضافه شدن 3 صفر)
function getGoldDataFromAPI(apiData) {
    const goldSymbols = [
        { key: '18ayar', name: 'طلای 18 عیار', unit: 'تومان' },
        { key: 'abshodeh', name: 'طلای آب‌شده', unit: 'تومان' },
        { key: 'usd_xau', name: 'انس طلا', unit: 'دلار' },
        { key: 'sekkeh', name: 'سکه امامی', unit: 'تومان' },
        { key: 'bahar', name: 'سکه بهار آزادی', unit: 'تومان' },
        { key: 'nim', name: 'نیم سکه', unit: 'تومان' },
        { key: 'rob', name: 'ربع سکه', unit: 'تومان' },
        { key: 'gerami', name: 'سکه یک گرمی', unit: 'تومان' }
    ];

    const goldItems = [];

    goldSymbols.forEach(symbol => {
        const raw = apiData[symbol.key];
        if (raw === undefined || raw === null) {
            console.log(`❌ ${symbol.key} یافت نشد در apiData`);
            return;
        }
        let price = parseFloat(raw);
        if (isNaN(price)) {
            console.log(`❌ قیمت ${symbol.key} نامعتبر:`, raw);
            return;
        }

        // برای همه موارد به جز 'طلای 18 عیار' و 'انس طلا'، 3 صفر اضافه کن
        if (symbol.name !== 'طلای 18 عیار' && symbol.name !== 'انس طلا') {
            price = price * 1000;
        }

        goldItems.push({
            name: symbol.name,
            price: price,
            unit: symbol.unit
        });
    });

    if (goldItems.length === 0) {
        return '<p class="no-data">❌ اطلاعات طلا و سکه در حال حاضر در دسترس نیست</p>';
    }

    return goldItems.map(item => {
        return `
            <div class="currency-item gold">
                <div class="currency-header">
                    <span class="currency-name">${item.name}</span>
                </div>
                <div class="currency-price">
                    ${formatNumber(Math.round(item.price))} <span class="currency-unit">${item.unit}</span>
                </div>
            </div>
        `;
    }).join('');
}

// پردازش ارزهای خارجی
function getCurrencyDataFromAPI(apiData) {
    const currencySymbols = [
        { key: 'usd', name: 'دلار آمریکا (USD)', type: 'main' },
        { key: 'eur', name: 'یورو (EUR)', type: 'main' },
        { key: 'gbp', name: 'پوند انگلیس (GBP)', type: 'main' },
        { key: 'aed', name: 'درهم امارات (AED)', type: 'main' },
        { key: 'try', name: 'لیر ترکیه (TRY)', type: 'main' },
        { key: 'cad', name: 'دلار کانادا (CAD)', type: 'main' },
        { key: 'aud', name: 'دلار استرالیا (AUD)', type: 'main' },
        { key: 'cny', name: 'یوآن چین (CNY)', type: 'main' },
        { key: 'afn', name: 'افغانی (AFN)', type: 'other' },
        { key: 'thb', name: 'بات تایلند (THB)', type: 'other' },
        { key: 'amd', name: 'درام ارمنستان (AMD)', type: 'other' },
        { key: 'bhd', name: 'دینار بحرین (BHD)', type: 'other' },
        { key: 'iqd', name: 'دینار عراق (IQD)', type: 'other' },
        { key: 'kwd', name: 'دینار کویت (KWD)', type: 'other' },
        { key: 'rub', name: 'روبل روسیه (RUB)', type: 'other' },
        { key: 'pkr', name: 'روپیه پاکستان (PKR)', type: 'other' },
        { key: 'inr', name: 'روپیه هند (INR)', type: 'other' },
        { key: 'sar', name: 'ریال عربستان (SAR)', type: 'other' },
        { key: 'omr', name: 'ریال عمان (OMR)', type: 'other' },
        { key: 'qar', name: 'ریال قطر (QAR)', type: 'other' },
        { key: 'myr', name: 'رینگیت مالزی (MYR)', type: 'other' },
        { key: 'chf', name: 'فرانک سوئیس (CHF)', type: 'other' },
        { key: 'sek', name: 'کرون سوئد (SEK)', type: 'other' },
        { key: 'gel', name: 'لاری گرجستان (GEL)', type: 'other' },
        { key: 'syp', name: 'لیره سوریه (SYP)', type: 'other' },
        { key: 'azn', name: 'منات آذربایجان (AZN)', type: 'other' },
        { key: 'jpy', name: 'یکصد ین ژاپن (JPY)', type: 'other' }
    ];

    const currencyItems = [];

    currencySymbols.forEach(symbol => {
        const raw = apiData[symbol.key];
        if (raw === undefined || raw === null) return;
        const price = parseFloat(raw);
        if (isNaN(price)) return;
        currencyItems.push({
            name: symbol.name,
            price: price,
            type: symbol.type
        });
    });

    if (currencyItems.length === 0) {
        return '<p class="no-data">❌ اطلاعات ارزهای خارجی در حال حاضر در دسترس نیست</p>';
    }

    return currencyItems.map(item => {
        return `
            <div class="currency-item forex">
                <div class="currency-header">
                    <span class="currency-name">${item.name}</span>
                </div>
                <div class="currency-price">
                    ${formatNumber(Math.round(item.price))} <span class="currency-unit">تومان</span>
                </div>
            </div>
        `;
    }).join('');
}

// --- ارزهای دیجیتال (از نوبیتکس) ---
async function loadCryptoData() {
    try {
        if (cryptoItemsContainer) cryptoItemsContainer.innerHTML = '';
        await fetchCryptoData();
    } catch (err) {
        console.error('loadCryptoData', err);
        hideLoading();
        if (currencyError) currencyError.classList.remove('hidden');
    }
}
async function fetchCryptoData() {
    try {
        const response = await fetch('https://apiv2.nobitex.ir/v3/orderbook/all');
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
            if (cryptoItemsContainer) {
                cryptoItemsContainer.innerHTML = getCryptoDataHTMLFromAPI(data);
                setupCryptoSearch();
            }
        } else throw new Error('invalid crypto data');
    } catch (err) {
        console.error('fetchCryptoData', err);
        if (cryptoItemsContainer) cryptoItemsContainer.innerHTML = '<p class="no-data">❌ خطا در دریافت اطلاعات ارزهای دیجیتال</p>';
    } finally {
        setTimeout(() => hideLoading(), 350);
    }
}

function setupCryptoSearch() {
    if (!cryptoSearch) return;
    cryptoSearch.addEventListener('input', function() {
        const term = this.value.trim().toLowerCase();
        const items = document.querySelectorAll('#crypto-items .currency-item');
        items.forEach(item => {
            const name = item.querySelector('.currency-name')?.textContent.toLowerCase() || '';
            const symbol = item.getAttribute('data-symbol')?.toLowerCase() || '';
            item.style.display = (name.includes(term) || symbol.includes(term)) ? 'flex' : 'none';
        });
    });
}

function getCryptoDataHTMLFromAPI(data) {
    const cryptoList = [];
    for (const irtSymbol of cryptoCurrenciesIRT) {
        if (data[irtSymbol] && data[irtSymbol].lastTradePrice) {
            const base = irtSymbol.replace('IRT','');
            const usdt = base + 'USDT';
            const irtPrice = data[irtSymbol].lastTradePrice;
            const usdtPrice = data[usdt] ? data[usdt].lastTradePrice : null;
            const short = base.replace(/^1[BKM]_/, '').replace(/^100K_/, '').replace(/^1B_/, '');
            const name = cryptoNames[short] || short;
            cryptoList.push({ symbol: base, name, irtPrice, usdtPrice });
        }
    }
    for (const usdtSymbol of cryptoCurrenciesUSDT) {
        const base = usdtSymbol.replace('USDT','');
        if (!cryptoList.some(i => i.symbol === base) && data[usdtSymbol] && data[usdtSymbol].lastTradePrice) {
            const name = cryptoNames[base] || base;
            cryptoList.push({ symbol: base, name, irtPrice: null, usdtPrice: data[usdtSymbol].lastTradePrice });
        }
    }
    if (cryptoList.length === 0) return '<p class="no-data">❌ اطلاعات ارزهای دیجیتال در دسترس نیست</p>';
    cryptoList.sort((a,b) => (a.symbol==='BTC'?-1:(b.symbol==='BTC'?1:(a.symbol==='ETH'?-1:(b.symbol==='ETH'?1:a.name.localeCompare(b.name))))));
    return cryptoList.map(crypto => {
        let irtHtml = '';
        if (crypto.irtPrice) {
            const toman = Math.floor(parseInt(crypto.irtPrice)/10);
            irtHtml = `<div class="crypto-price-irt">${formatNumber(toman)} <span class="crypto-unit">تومان</span></div>`;
        }
        let usdtHtml = '';
        if (crypto.usdtPrice) {
            const showDecimal = parseFloat(crypto.usdtPrice) < 10;
            usdtHtml = `<div class="crypto-price-usdt">${formatDollarPrice(crypto.usdtPrice, showDecimal)} <span class="crypto-unit">دلار</span></div>`;
        }
        return `
            <div class="currency-item crypto" data-symbol="${crypto.symbol}">
                <div class="currency-header">
                    <span class="currency-name">${crypto.name}</span>
                    <span class="currency-symbol">${crypto.symbol}</span>
                </div>
                <div class="crypto-prices">
                    ${irtHtml}
                    ${usdtHtml}
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

conversionTypeSelect?.addEventListener('change', function() {
    if (this.value === 'toman-to-rial') {
        if (amountLabel) amountLabel.textContent = 'مبلغ را به تومان وارد کنید:';
    } else {
        if (amountLabel) amountLabel.textContent = 'مبلغ را به ریال وارد کنید:';
    }
    if (resultContainer) resultContainer.classList.add('hidden');
});

let rawNumber = '';

function convertPersianToEnglishNumbers(input) {
    const persianNumbers = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    const englishNumbers = ['0','1','2','3','4','5','6','7','8','9'];
    for (let i=0;i<10;i++) input = input.replace(new RegExp(persianNumbers[i],'g'), englishNumbers[i]);
    return input;
}

amountInput?.addEventListener('input', function(e) {
    this.value = convertPersianToEnglishNumbers(this.value);
    const start = this.selectionStart, end = this.selectionEnd;
    rawNumber = this.value.replace(/[^\d]/g,'');
    if (rawNumber === '') { this.value = ''; return; }
    let formatted = '';
    for (let i=0;i<rawNumber.length;i++) {
        if (i>0 && (rawNumber.length - i) % 3 === 0) formatted += ',';
        formatted += rawNumber[i];
    }
    this.value = formatted;
    const commasBefore = formatted.substring(0,start).split(',').length - 1;
    this.setSelectionRange(start + commasBefore, end + commasBefore);
});

convertBtn?.addEventListener('click', function() {
    const inputValue = rawNumber || amountInput?.value.replace(/[^\d]/g,'');
    if (!inputValue) { alert('لطفاً یک عدد وارد کنید'); return; }
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
        if (i > 0 && (numStr.length - i) % 3 === 0) result += ',';
        result += numStr[i];
    }
    return result;
}

copyNumericBtn?.addEventListener('click', function() { copyToClipboard(numericResult.textContent); showToast('نتیجه عددی کپی شد'); });
copyTextBtn?.addEventListener('click', function() { copyToClipboard(textResult.textContent); showToast('نتیجه متنی کپی شد'); });

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

// number-to-words helpers
const units = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
const tens = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
const teens = ['ده','یازده','دوازده','سیزده','چهارده','پانزده','شانزده','هفده','هجده','نوزده'];
const hundreds = ['','صد','دویست','سیصد','چهارصد','پانصد','ششصد','هفتصد','هشتصد','نهصد'];
const scales = ['','هزار','میلیون','میلیارد','تریلیون','کوادریلیون'];

function numberToWords(numStr) {
    if (numStr === '0') return 'صفر';
    let words = '', scaleIndex = 0;
    for (let i = numStr.length; i > 0; i -= 3) {
        const start = Math.max(0, i-3);
        const chunk = parseInt(numStr.substring(start,i),10);
        if (chunk !== 0) {
            const cw = convertChunkToWords(chunk);
            words = cw + (scaleIndex>0 ? ' ' + scales[scaleIndex] : '') + (words ? ' و ' + words : '');
        }
        scaleIndex++;
    }
    return words;
}
function convertChunkToWords(chunk) {
    let result = '';
    const hundred = Math.floor(chunk/100);
    if (hundred>0) result += hundreds[hundred];
    const remainder = chunk % 100;
    if (remainder>0) {
        if (result.length>0) result += ' و ';
        if (remainder < 10) result += units[remainder];
        else if (remainder < 20) result += teens[remainder - 10];
        else {
            const ten = Math.floor(remainder/10), unit = remainder%10;
            result += tens[ten];
            if (unit>0) result += ' و ' + units[unit];
        }
    }
    return result;
}

// --- ناوبری و شروع ---
function navigateTo(targetSection) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(targetSection)?.classList.remove('hidden');
    if (targetSection === 'currency-page') loadAllData();
}
document.getElementById('goto-converter')?.addEventListener('click', () => navigateTo('converter-page'));
document.getElementById('goto-currency')?.addEventListener('click', () => navigateTo('currency-page'));
document.querySelectorAll('.back-button').forEach(btn => btn.addEventListener('click', function() {
    const t = this.getAttribute('data-target') || this.dataset.target;
    if (t) navigateTo(t);
}));

// tab buttons: update to call showLoading with section
document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        if (!target) return;
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.currency-section').forEach(s => s.classList.add('hidden'));
        document.getElementById(target)?.classList.remove('hidden');
        activeTab = target;
        showLoading(activeTab);
        if (target === 'gold-section') loadGoldData();
        else if (target === 'currency-section') loadCurrencyData();
        else if (target === 'crypto-section') loadCryptoData();
    });
});

// retry
document.getElementById('retry-btn')?.addEventListener('click', loadAllData);

// search handlers
document.getElementById('currency-search')?.addEventListener('input', function() {
    const term = this.value.trim().toLowerCase();
    const items = document.querySelectorAll('#currency-items .currency-item');
    items.forEach(item => {
        const name = item.querySelector('.currency-name')?.textContent.toLowerCase() || '';
        item.style.display = name.includes(term) ? 'flex' : 'none';
    });
});

// startup
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded');
    activeTab = 'gold-section';
    // Note: main menu shown by default. When user opens currency page, loadAllData will run.
});

// ensure overlay hidden on initial load
window.addEventListener('load', function() {
    console.log('window loaded');
    // hide overlay just in case
    setTimeout(() => {
        try { hideLoading(); } catch (e) { /* ignore */ }
    }, 200);
});

// Telegram WebApp integration
if (window.Telegram?.WebApp) {
    try {
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.ready();
        if (window.Telegram.WebApp.onEvent) {
            window.Telegram.WebApp.onEvent('themeChanged', setThemeByTelegram);
        }
    } catch (e) {
        console.warn('Telegram WebApp integration error:', e);
    }
}
