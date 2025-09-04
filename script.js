// تنظیمات اصلی
const API_URLS = {
    GOLD: "https://api.tgju.org/v1/data/sana/json",
    CURRENCY: "https://api.tgju.org/v1/data/sana/json",
    CRYPTO_NOBITEX: "https://apiv2.nobitex.ir/v3/orderbook/all"
};

// رنگ‌های هر بخش
const COLORS = {
    GOLD: "#FFD700",
    CURRENCY: "#2E8B57",
    CRYPTO: "#1E90FF"
};

// وضعیت نمایش تب‌ها
let currentTab = "GOLD"; // تب فعال پیش‌فرض
let loadingStates = {
    GOLD: false,
    CURRENCY: false,
    CRYPTO: false
};

let priceData = {
    GOLD: null,
    CURRENCY: null,
    CRYPTO: null
};

// تاریخ آخرین به‌روزرسانی
let lastUpdates = {
    GOLD: null,
    CURRENCY: null,
    CRYPTO: null
};

// لیست ارزهای خارجی
const currencyList = [
    { id: "USD", title: "دلار (USD)" },
    { id: "EUR", title: "یورو (EUR)" },
    { id: "GBP", title: "پوند (GBP)" },
    { id: "AED", title: "درهم امارات (AED)" },
    { id: "TRY", title: "لیر ترکیه (TRY)" },
    { id: "CAD", title: "دلار کانادا (CAD)" },
    { id: "AUD", title: "دلار استرالیا (AUD)" },
    { id: "CNY", title: "یوآن چین (CNY)" },
    { id: "AFN", title: "افغانی (AFN)" },
    { id: "THB", title: "بات تایلند (THB)" },
    { id: "AMD", title: "درام ارمنستان (AMD)" },
    { id: "BHD", title: "دینار بحرین (BHD)" },
    { id: "IQD", title: "دینار عراق (IQD)" },
    { id: "KWD", title: "دینار کویت (KWD)" },
    { id: "RUB", title: "روبل روسیه (RUB)" },
    { id: "PKR", title: "روپیه پاکستان (PKR)" },
    { id: "INR", title: "روپیه هند (INR)" },
    { id: "SAR", title: "ریال عربستان (SAR)" },
    { id: "OMR", title: "ریال عمان (OMR)" },
    { id: "QAR", title: "ریال قطر (QAR)" },
    { id: "MYR", title: "رینگیت مالزی (MYR)" },
    { id: "CHF", title: "فرانک سوئیس (CHF)" },
    { id: "SEK", title: "کرون سوئد (SEK)" },
    { id: "GEL", title: "لاری گرجستان (GEL)" },
    { id: "SYP", title: "لیر سوریه (SYP)" },
    { id: "AZN", title: "منات آذربایجان (AZN)" },
    { id: "JPY", title: "یکصد ین ژاپن (JPY)" }
];

// لیست سکه و طلا
const goldList = [
    { id: "geram18", title: "طلای 18 عیار" },
    { id: "geram24", title: "طلای 24 عیار" },
    { id: "mesghal", title: "طلای آب‌شده نقدی" },
    { id: "ons", title: "انس طلا" },
    { id: "emami", title: "سکه امامی" },
    { id: "bahar", title: "سکه بهار آزادی" },
    { id: "nim", title: "نیم سکه" },
    { id: "rob", title: "ربع سکه" },
    { id: "gerami", title: "سکه یک گرمی" }
];

// لیست ارزهای دیجیتال با عنوان فارسی
const cryptoIRTList = [
    { id: "BTCIRT", title: "بیت‌کوین" },
    { id: "ETHIRT", title: "اتریوم" },
    { id: "LTCIRT", title: "لایت‌کوین" },
    { id: "USDTIRT", title: "تتر" },
    { id: "XRPIRT", title: "ریپل" },
    { id: "BCHIRT", title: "بیت‌کوین‌کش" },
    { id: "BNBIRT", title: "بایننس‌کوین" },
    { id: "EOSIRT", title: "ایاس" },
    { id: "XLMIRT", title: "استلار" },
    { id: "ETCIRT", title: "اتریوم‌کلاسیک" },
    { id: "TRXIRT", title: "ترون" },
    { id: "DOGEIRT", title: "دوج‌کوین" },
    { id: "UNIIRT", title: "یونی‌سواپ" },
    { id: "DAIIRT", title: "دای" },
    { id: "LINKIRT", title: "چین‌لینک" },
    { id: "DOTIRT", title: "پولکادات" },
    { id: "AAVEIRT", title: "آوه" },
    { id: "ADAIRT", title: "کاردانو" },
    { id: "SHIBIRT", title: "شیبا اینو" },
    { id: "FTMIRT", title: "فانتوم" },
    { id: "MATICIRT", title: "پالیگان" },
    { id: "AXSIRT", title: "اکسی اینفینیتی" },
    { id: "MANAIRT", title: "مانا (دیسنترالند)" },
    { id: "SANDIRT", title: "سندباکس" },
    { id: "AVAXIRT", title: "آوالانچ" },
    { id: "MKRIRT", title: "میکر" },
    { id: "GMTIRT", title: "جی‌ام‌تی (StepN)" },
    { id: "USDCIRT", title: "یو‌اس‌دی‌کوین" },
    { id: "CHZIRT", title: "چیلیز" },
    { id: "GRTIRT", title: "گراف" },
    { id: "CRVIRT", title: "کرو" },
    { id: "EGLDIRT", title: "مولتی‌ورس‌ایکس (الروند)" },
    { id: "GALIRT", title: "گالاکسی" },
    { id: "HBARIRT", title: "هدرا هش‌گراف" },
    { id: "IMXIRT", title: "ایمیوتبل ایکس" },
    { id: "WBTCIRT", title: "رپد بیت‌کوین" },
    { id: "ONEIRT", title: "هارمونی وان" },
    { id: "ENSIRT", title: "اتریوم نیم سرویس" },
    { id: "1M_BTTIRT", title: "بیت‌تورنت (۱M)" },
    { id: "SUSHIIRT", title: "سوشی‌سواپ" },
    { id: "LDOIRT", title: "لیدو دائو" },
    { id: "ZROIRT", title: "لایه‌زیرو" },
    { id: "STORJIRT", title: "استورج" },
    { id: "ANTIRT", title: "آراگون" },
    { id: "100K_FLOKIIRT", title: "فلوکی (100K)" },
    { id: "GLMIRT", title: "گولم" },
    { id: "OMIRT", title: "اومیس‌گو" },
    { id: "RDNTIRT", title: "رادینت" },
    { id: "NOTIRT", title: "نات‌کوین" },
    { id: "CVXIRT", title: "کانوکس فایننس" },
    { id: "XTZIRT", title: "تزوس" },
    { id: "FILIRT", title: "فایل‌کوین" },
    { id: "UMAIRT", title: "یو‌ام‌ای" },
    { id: "1B_BABYDOGEIRT", title: "بیبی‌دوج (1B)" },
    { id: "BANDIRT", title: "بند پروتکل" },
    { id: "SSVIRT", title: "اس‌اس‌وی نتورک" },
    { id: "DAOIRT", title: "دائو میکر" },
    { id: "BLURIRT", title: "بلور" },
    { id: "GMXIRT", title: "جی‌ام‌ایکس" },
    { id: "SKLIRT", title: "اسکیل نتورک" },
    { id: "SNTIRT", title: "استاتوس" },
    { id: "NMRIRT", title: "نومرای" },
    { id: "API3IRT", title: "ای‌پی‌آی۳" },
    { id: "WLDIRT", title: "ورلد‌کوین" },
    { id: "SOLIRT", title: "سولانا" },
    { id: "QNTIRT", title: "کوانت" },
    { id: "FETIRT", title: "فچ.ای‌آی" },
    { id: "AGIXIRT", title: "سینگولاریتی نت" },
    { id: "LPTIRT", title: "لایو‌پییر" },
    { id: "SLPIRT", title: "اسموث لاو پوشن" },
    { id: "COMPIRT", title: "کامپاند" },
    { id: "MEMEIRT", title: "میم‌کوین" },
    { id: "BATIRT", title: "بیسیک اتنشن توکن" },
    { id: "TRBIRT", title: "تلور" },
    { id: "AGLDIRT", title: "ادونچر گلد" },
    { id: "MDTIRT", title: "می‌دیتا" },
    { id: "LRCIRT", title: "لوپرینگ" },
    { id: "BICOIRT", title: "بیکونومی" },
    { id: "MAGICIRT", title: "مجیک" },
    { id: "ETHFIIRT", title: "اتریوم‌فای" },
    { id: "1INCHIRT", title: "وان‌اینچ" },
    { id: "1M_NFTIRT", title: "NFT (۱M)" },
    { id: "ARBIRT", title: "آربیتروم" },
    { id: "BALIRT", title: "بالانسر" },
    { id: "TONIRT", title: "تون‌کوین" },
    { id: "CELRIRT", title: "سلر نتورک" },
    { id: "ALGOIRT", title: "الگوراند" },
    { id: "MASKIRT", title: "مسک نتورک" },
    { id: "EGALAIRT", title: "گالا" },
    { id: "FLOWIRT", title: "فلو" },
    { id: "OMGIRT", title: "اومیس‌گو" },
    { id: "ENJIRT", title: "انجین‌کوین" },
    { id: "DYDXIRT", title: "دی‌وای‌دی‌اکس" },
    { id: "JSTIRT", title: "جاست" },
    { id: "HMSTRIRT", title: "همستر" },
    { id: "MAJORIRT", title: "میجر" }
];

const cryptoUSDTList = [
    { id: "BTCUSDT", title: "بیت‌کوین" },
    { id: "ETHUSDT", title: "اتریوم" },
    { id: "LTCUSDT", title: "لایت‌کوین" },
    { id: "XRPUSDT", title: "ریپل" },
    { id: "BCHUSDT", title: "بیت‌کوین‌کش" },
    { id: "BNBUSDT", title: "بایننس‌کوین" },
    { id: "EOSUSDT", title: "ایاس" },
    { id: "XLMUSDT", title: "استلار" },
    { id: "ETCUSDT", title: "اتریوم‌کلاسیک" },
    { id: "TRXUSDT", title: "ترون" },
    { id: "PMNUSDT", title: "پی‌ام‌ان" },
    { id: "DOGEUSDT", title: "دوج‌کوین" },
    { id: "UNIUSDT", title: "یونی‌سواپ" },
    { id: "DAIUSDT", title: "دای" },
    { id: "LINKUSDT", title: "چین‌لینک" },
    { id: "DOTUSDT", title: "پولکادات" },
    { id: "AAVEUSDT", title: "آوه" },
    { id: "ADAUSDT", title: "کاردانو" },
    { id: "SHIBUSDT", title: "شیبا اینو" },
    { id: "FTMUSDT", title: "فانتوم" },
    { id: "MATICUSDT", title: "پالیگان" },
    { id: "AXSUSDT", title: "اکسی اینفینیتی" },
    { id: "MANAUSDT", title: "مانا (دیسنترالند)" },
    { id: "SANDUSDT", title: "سندباکس" },
    { id: "AVAXUSDT", title: "آوالانچ" },
    { id: "MKRUSDT", title: "میکر" },
    { id: "GMTUSDT", title: "جی‌ام‌تی (StepN)" },
    { id: "USDCUSDT", title: "یو‌اس‌دی‌کوین" },
    { id: "BANDUSDT", title: "بند پروتکل" },
    { id: "COMPUSDT", title: "کامپاند" },
    { id: "HBARUSDT", title: "هدرا هش‌گراف" },
    { id: "WBTCUSDT", title: "رپد بیت‌کوین" },
    { id: "GLMUSDT", title: "گولم" },
    { id: "ENSUSDT", title: "اتریوم نیم سرویس" },
    { id: "AEVOUSDT", title: "ایوو" },
    { id: "RSRUSDT", title: "ریزرو رایتس" },
    { id: "API3USDT", title: "ای‌پی‌آی۳" },
    { id: "ONEUSDT", title: "هارمونی وان" },
    { id: "EGALAUSDT", title: "گالا" },
    { id: "XTZUSDT", title: "تزوس" },
    { id: "FLOWUSDT", title: "فلو" },
    { id: "CVCUSDT", title: "سیویک" },
    { id: "NMRUSDT", title: "نومرای" },
    { id: "BATUSDT", title: "بیسیک اتنشن توکن" },
    { id: "TRBUSDT", title: "تلور" },
    { id: "RDNTUSDT", title: "رادینت" },
    { id: "OMUSDT", title: "اومیس‌گو" },
    { id: "YFIUSDT", title: "یرن فایننس" },
    { id: "QNTUSDT", title: "کوانت" },
    { id: "IMXUSDT", title: "ایمیوتبل ایکس" },
    { id: "GMXUSDT", title: "جی‌ام‌ایکس" },
    { id: "ETHFIUSDT", title: "اتریوم‌فای" },
    { id: "GRTUSDT", title: "گراف" },
    { id: "WLDUSDT", title: "ورلد‌کوین" },
    { id: "NOTUSDT", title: "نات‌کوین" },
    { id: "MAGICUSDT", title: "مجیک" },
    { id: "MEMEUSDT", title: "میم‌کوین" },
    { id: "SOLUSDT", title: "سولانا" },
    { id: "BALUSDT", title: "بالانسر" },
    { id: "DAOUSDT", title: "دائو میکر" },
    { id: "SNXUSDT", title: "سینتتیکس" },
    { id: "SSVUSDT", title: "اس‌اس‌وی نتورک" },
    { id: "RNDRUSDT", title: "رندر" },
    { id: "NEARUSDT", title: "نیر پروتکل" },
    { id: "WOOUSDT", title: "وو نتورک" },
    { id: "CRVUSDT", title: "کرو" },
    { id: "EGLDUSDT", title: "مولتی‌ورس‌ایکس (الروند)" },
    { id: "LPTUSDT", title: "لایو‌پییر" },
    { id: "BICOUSDT", title: "بیکونومی" },
    { id: "ANTUSDT", title: "آراگون" },
    { id: "1INCHUSDT", title: "وان‌اینچ" },
    { id: "SLPUSDT", title: "اسموث لاو پوشن" },
    { id: "CVXUSDT", title: "کانوکس فایننس" },
    { id: "TONUSDT", title: "تون‌کوین" },
    { id: "BLURUSDT", title: "بلور" },
    { id: "CELRUSDT", title: "سلر نتورک" },
    { id: "DYDXUSDT", title: "دی‌وای‌دی‌اکس" },
    { id: "ZROUSDT", title: "لایه‌زیرو" },
    { id: "ARBUSDT", title: "آربیتروم" },
    { id: "APTUSDT", title: "آپتوس" },
    { id: "UMAUSDT", title: "یو‌ام‌ای" },
    { id: "ZRXUSDT", title: "زیروایکس" },
    { id: "SUSHIUSDT", title: "سوشی‌سواپ" },
    { id: "FETUSDT", title: "فچ.ای‌آی" },
    { id: "ALGOUSDT", title: "الگوراند" },
    { id: "MASKUSDT", title: "مسک نتورک" },
    { id: "STORJUSDT", title: "استورج" },
    { id: "XMRUSDT", title: "مونرو" },
    { id: "SNTUSDT", title: "استاتوس" },
    { id: "APEUSDT", title: "ایپ‌کوین" },
    { id: "FILUSDT", title: "فایل‌کوین" },
    { id: "ENJUSDT", title: "انجین‌کوین" },
    { id: "OMGUSDT", title: "اومیس‌گو" },
    { id: "CHZUSDT", title: "چیلیز" },
    { id: "JSTUSDT", title: "جاست" },
    { id: "HMSTRUSDT", title: "همستر" },
    { id: "MAJORUSDT", title: "میجر" }
];

// تابع اصلی برای شروع برنامه
document.addEventListener('DOMContentLoaded', function() {
    // حذف قابلیت زوم
    document.documentElement.style.touchAction = 'pan-x pan-y';
    
    // ایجاد ساختار HTML برای تب‌ها
    initializeTabs();
    
    // تنظیم رویدادها برای کلیک روی تب‌ها
    setupTabEvents();
    
    // بارگذاری داده‌ها برای تب فعال
    loadDataForTab(currentTab);

    // تغییر عنوان صفحه
    document.title = "قیمت طلا و ارز";
});

// ایجاد ساختار HTML تب‌ها
function initializeTabs() {
    const tabContainer = document.querySelector('.tabContainer') || createTabContainer();
    tabContainer.innerHTML = `
        <div class="tab gold-tab" data-tab="GOLD">طلا و سکه</div>
        <div class="tab currency-tab" data-tab="CURRENCY">ارزهای خارجی</div>
        <div class="tab crypto-tab" data-tab="CRYPTO">ارزهای دیجیتال</div>
    `;
    
    // ایجاد محتوای تب‌ها
    const contentContainer = document.querySelector('.contentContainer') || createContentContainer();
    contentContainer.innerHTML = `
        <div id="GOLD" class="tabContent">
            <div class="loading-container">
                <div class="loading-spinner gold-spinner"></div>
                <p class="loading-text">در حال دریافت قیمت‌ها...</p>
            </div>
            <div class="price-container"></div>
        </div>
        <div id="CURRENCY" class="tabContent" style="display: none;">
            <div class="loading-container">
                <div class="loading-spinner currency-spinner"></div>
                <p class="loading-text">در حال دریافت قیمت‌ها...</p>
            </div>
            <div class="price-container"></div>
        </div>
        <div id="CRYPTO" class="tabContent" style="display: none;">
            <div class="loading-container">
                <div class="loading-spinner crypto-spinner"></div>
                <p class="loading-text">در حال دریافت قیمت‌ها...</p>
            </div>
            <div class="price-container"></div>
            <div class="crypto-type-selector">
                <button class="crypto-type-button active" data-type="IRT">تومان (IRT)</button>
                <button class="crypto-type-button" data-type="USDT">دلار (USDT)</button>
            </div>
        </div>
    `;
    
    // اضافه کردن استایل‌ها
    addStyles();
}

// ایجاد کانتینر تب‌ها اگر وجود نداشته باشد
function createTabContainer() {
    const container = document.createElement('div');
    container.className = 'tabContainer';
    document.body.appendChild(container);
    return container;
}

// ایجاد کانتینر محتوای تب‌ها اگر وجود نداشته باشد
function createContentContainer() {
    const container = document.createElement('div');
    container.className = 'contentContainer';
    document.body.appendChild(container);
    return container;
}

// اضافه کردن استایل‌ها به صفحه
function addStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        body {
            font-family: 'Tahoma', 'Arial', sans-serif;
            direction: rtl;
            margin: 0;
            padding: 0;
            background-color: #1E1E1E;
            color: #FFFFFF;
        }
        
        .tabContainer {
            display: flex;
            justify-content: space-around;
            background-color: #1E1E1E;
            border-bottom: 1px solid #333;
            padding: 10px 0;
        }
        
        .tab {
            padding: 10px 15px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.3s;
            text-align: center;
            flex: 1;
        }
        
        .tab.active.gold-tab {
            border-bottom: 2px solid ${COLORS.GOLD};
            color: ${COLORS.GOLD};
        }
        
        .tab.active.currency-tab {
            border-bottom: 2px solid ${COLORS.CURRENCY};
            color: ${COLORS.CURRENCY};
        }
        
        .tab.active.crypto-tab {
            border-bottom: 2px solid ${COLORS.CRYPTO};
            color: ${COLORS.CRYPTO};
        }
        
        .tabContent {
            padding: 15px;
            min-height: 300px;
        }
        
        .price-item {
            background-color: #2A2A2A;
            margin-bottom: 8px;
            padding: 15px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
        }
        
        .price-item:before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            border-radius: 4px 0 0 4px;
        }
        
        .price-item.gold-item:before {
            background-color: ${COLORS.GOLD};
        }
        
        .price-item.currency-item:before {
            background-color: ${COLORS.CURRENCY};
        }
        
        .price-item.crypto-item:before {
            background-color: ${COLORS.CRYPTO};
        }
        
        .item-title {
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .item-price {
            font-size: 1.2em;
            color: #2E8B57;
            direction: ltr;
            text-align: left;
        }
        
        .item-info {
            margin-top: 5px;
            font-size: 0.8em;
            color: #999;
        }
        
        .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100px;
        }
        
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            border-top-color: #3498db;
            animation: spin 1s linear infinite;
        }
        
        .gold-spinner {
            border-top-color: ${COLORS.GOLD};
        }
        
        .currency-spinner {
            border-top-color: ${COLORS.CURRENCY};
        }
        
        .crypto-spinner {
            border-top-color: ${COLORS.CRYPTO};
        }
        
        .loading-text {
            margin-top: 10px;
            color: #999;
        }
        
        .last-update {
            text-align: center;
            margin: 15px 0;
            font-size: 0.9em;
            color: #999;
        }
        
        .crypto-type-selector {
            display: flex;
            justify-content: center;
            margin: 15px 0;
            border-radius: 8px;
            overflow: hidden;
            background-color: #2A2A2A;
        }
        
        .crypto-type-button {
            flex: 1;
            padding: 10px;
            border: none;
            background-color: transparent;
            color: white;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .crypto-type-button.active {
            background-color: ${COLORS.CRYPTO};
            color: #1E1E1E;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        /* تنظیم استایل برای تلفن همراه */
        @media (max-width: 480px) {
            .tabContainer {
                flex-wrap: wrap;
            }
            
            .tab {
                flex-basis: 33.33%;
            }
            
            .price-item {
                padding: 12px;
            }
            
            .item-title {
                font-size: 0.9em;
            }
            
            .item-price {
                font-size: 1em;
            }
        }
    `;
    document.head.appendChild(styleElement);
}

// تنظیم رویدادها برای کلیک روی تب‌ها
function setupTabEvents() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // تنظیم رویدادها برای دکمه‌های انتخاب نوع ارز دیجیتال
    const cryptoButtons = document.querySelectorAll('.crypto-type-button');
    cryptoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            document.querySelectorAll('.crypto-type-button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // بارگذاری مجدد ارزهای دیجیتال با نوع انتخاب شده
            renderCryptoData(type);
        });
    });
    
    // نشان دادن تب فعال در ابتدا
    activateTab('GOLD');
}

// تغییر تب فعال
function switchTab(tabId) {
    if (currentTab === tabId) return;
    
    currentTab = tabId;
    activateTab(tabId);
    loadDataForTab(tabId);
}

// فعال‌سازی تب مورد نظر
function activateTab(tabId) {
    // مخفی کردن همه محتواها و حذف کلاس active از همه تب‌ها
    document.querySelectorAll('.tabContent').forEach(content => {
        content.style.display = 'none';
    });
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // نمایش محتوای تب انتخابی و اضافه کردن کلاس active به تب
    document.getElementById(tabId).style.display = 'block';
    document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
    
    // تنظیم رنگ‌ها براساس تب فعال
    const goldTab = document.querySelector('.tab.gold-tab');
    const currencyTab = document.querySelector('.tab.currency-tab');
    const cryptoTab = document.querySelector('.tab.crypto-tab');
    
    // اضافه کردن کلاس active به تب مورد نظر
    if (tabId === 'GOLD') {
        goldTab.classList.add('active');
    } else if (tabId === 'CURRENCY') {
        currencyTab.classList.add('active');
    } else if (tabId === 'CRYPTO') {
        cryptoTab.classList.add('active');
    }
}

// بارگذاری داده‌ها برای تب انتخاب شده
function loadDataForTab(tabId) {
    // نمایش لودینگ
    showLoading(tabId);
    
    if (tabId === 'GOLD') {
        fetchGoldData();
    } else if (tabId === 'CURRENCY') {
        fetchCurrencyData();
    } else if (tabId === 'CRYPTO') {
        fetchCryptoData();
    }
}

// نمایش انیمیشن لودینگ
function showLoading(tabId) {
    loadingStates[tabId] = true;
    const container = document.getElementById(tabId).querySelector('.loading-container');
    container.style.display = 'flex';
}

// مخفی کردن انیمیشن لودینگ
function hideLoading(tabId) {
    loadingStates[tabId] = false;
    const container = document.getElementById(tabId).querySelector('.loading-container');
    container.style.display = 'none';
}

// دریافت داده‌های طلا و سکه
function fetchGoldData() {
    fetch(API_URLS.GOLD)
        .then(response => response.json())
        .then(data => {
            priceData.GOLD = data;
            lastUpdates.GOLD = new Date();
            renderGoldData();
            hideLoading('GOLD');
        })
        .catch(error => {
            console.error('خطا در دریافت قیمت طلا:', error);
            hideLoading('GOLD');
            renderError('GOLD', 'خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.');
        });
}

// دریافت داده‌های ارز خارجی
function fetchCurrencyData() {
    fetch(API_URLS.CURRENCY)
        .then(response => response.json())
        .then(data => {
            priceData.CURRENCY = data;
            lastUpdates.CURRENCY = new Date();
            renderCurrencyData();
            hideLoading('CURRENCY');
        })
        .catch(error => {
            console.error('خطا در دریافت قیمت ارز:', error);
            hideLoading('CURRENCY');
            renderError('CURRENCY', 'خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.');
        });
}

// دریافت داده‌های ارز دیجیتال
function fetchCryptoData() {
    fetch(API_URLS.CRYPTO_NOBITEX)
        .then(response => response.json())
        .then(data => {
            priceData.CRYPTO = data;
            lastUpdates.CRYPTO = new Date();
            const activeType = document.querySelector('.crypto-type-button.active').getAttribute('data-type');
            renderCryptoData(activeType);
            hideLoading('CRYPTO');
        })
        .catch(error => {
            console.error('خطا در دریافت قیمت ارز دیجیتال:', error);
            hideLoading('CRYPTO');
            renderError('CRYPTO', 'خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.');
        });
}

// نمایش داده‌های طلا و سکه
function renderGoldData() {
    if (!priceData.GOLD) return;
    
    const container = document.querySelector('#GOLD .price-container');
    container.innerHTML = '';
    
    // نمایش زمان آخرین به‌روزرسانی
    const updateInfo = document.createElement('div');
    updateInfo.className = 'last-update';
    updateInfo.innerText = `آخرین به‌روزرسانی: ${formatDateTime(lastUpdates.GOLD)}`;
    container.appendChild(updateInfo);
    
    // نمایش اطلاعات سکه و طلا
    goldList.forEach(item => {
        const price = getPriceFromData(priceData.GOLD, item.id);
        if (price) {
            const priceElement = createPriceElement(item.title, formatPrice(price), 'gold-item');
            container.appendChild(priceElement);
        }
    });
}

// نمایش داده‌های ارز خارجی
function renderCurrencyData() {
    if (!priceData.CURRENCY) return;
    
    const container = document.querySelector('#CURRENCY .price-container');
    container.innerHTML = '';
    
    // نمایش زمان آخرین به‌روزرسانی
    const updateInfo = document.createElement('div');
    updateInfo.className = 'last-update';
    updateInfo.innerText = `آخرین به‌روزرسانی: ${formatDateTime(lastUpdates.CURRENCY)}`;
    container.appendChild(updateInfo);
    
    // نمایش اطلاعات ارزهای خارجی
    currencyList.forEach(item => {
        const price = getPriceFromData(priceData.CURRENCY, item.id);
        if (price) {
            const priceElement = createPriceElement(item.title, formatPrice(price), 'currency-item');
            container.appendChild(priceElement);
        }
    });
}

// نمایش داده‌های ارز دیجیتال
function renderCryptoData(type = 'IRT') {
    if (!priceData.CRYPTO) return;
    
    const container = document.querySelector('#CRYPTO .price-container');
    container.innerHTML = '';
    
    // نمایش زمان آخرین به‌روزرسانی
    const updateInfo = document.createElement('div');
    updateInfo.className = 'last-update';
    updateInfo.innerText = `آخرین به‌روزرسانی: ${formatDateTime(lastUpdates.CRYPTO)}`;
    container.appendChild(updateInfo);
    
    // انتخاب لیست ارزهای مناسب براساس نوع
    const cryptoList = type === 'IRT' ? cryptoIRTList : cryptoUSDTList;
    
    // نمایش اطلاعات ارزهای دیجیتال
    cryptoList.forEach(item => {
        const cryptoData = priceData.CRYPTO.data[item.id];
        if (cryptoData) {
            let price = cryptoData.lastTradePrice;
            
            // فرمت‌بندی قیمت براساس نوع ارز
            let formattedPrice;
            if (type === 'IRT') {
                formattedPrice = formatPrice(price) + ' تومان';
            } else {
                // برای ارزهای دلاری، اعداد اعشاری بیش از حد نیاز را حذف می‌کنیم
                const numPrice = parseFloat(price);
                if (numPrice >= 1) {
                    formattedPrice = formatDollarPrice(numPrice, 2);
                } else {
                    // برای ارزهای با قیمت کمتر از 1 دلار، 6 رقم اعشار نمایش داده می‌شود
                    formattedPrice = formatDollarPrice(numPrice, 6);
                }
            }
            
            const priceElement = createPriceElement(item.title, formattedPrice, 'crypto-item');
            container.appendChild(priceElement);
        }
    });
}

// نمایش پیام خطا
function renderError(tabId, message) {
    const container = document.querySelector(`#${tabId} .price-container`);
    container.innerHTML = `<div class="error-message">${message}</div>`;
}

// ایجاد المان قیمت
function createPriceElement(title, price, className) {
    const element = document.createElement('div');
    element.className = `price-item ${className}`;
    element.innerHTML = `
        <div class="item-title">${title}</div>
        <div class="item-price">${price}</div>
    `;
    return element;
}

// دریافت قیمت از داده‌ها
function getPriceFromData(data, id) {
    // پیاده‌سازی مناسب براساس ساختار داده‌های API
    if (data && data[id]) {
        return data[id].p;
    }
    return null;
}

// فرمت‌بندی قیمت به صورت فارسی
function formatPrice(price) {
    if (!price) return '---';
    
    // تبدیل به عدد
    let numPrice;
    if (typeof price === 'string') {
        numPrice = parseInt(price.replace(/,/g, ''));
    } else {
        numPrice = price;
    }
    
    // فرمت‌بندی با جداکننده هزارتایی
    return numPrice.toLocaleString('fa-IR') + ' تومان';
}

// فرمت‌بندی قیمت به صورت دلاری
function formatDollarPrice(price, decimals = 2) {
    if (!price) return '---';
    return price.toLocaleString('en-US', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals 
    }) + ' $';
}

// فرمت‌بندی تاریخ و زمان
function formatDateTime(date) {
    if (!date) return '---';
    
    // تبدیل اعداد به فارسی
    const options = { 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric'
    };
    
    return new Intl.DateTimeFormat('fa-IR', options).format(date);
}
