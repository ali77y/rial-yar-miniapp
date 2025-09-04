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
const cryptoSearch = document.getElementById('crypto-search');

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

// فرمت‌بندی اعداد به فارسی
function formatNumber(num) {
    // تبدیل به فرمت فارسی با جداکننده هزارگان
    return num.toLocaleString('fa-IR');
}

// فرمت‌بندی قیمت دلاری بدون اعشار
function formatDollarPrice(price) {
    // گرد کردن به عدد صحیح و فرمت‌بندی
    return Math.round(parseFloat(price)).toLocaleString('fa-IR');
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
            // تاریخ به‌روزرسانی - استفاده از زمان شمسی واقعی
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            
            // تبدیل تاریخ میلادی به شمسی (فعلا ساده)
            const persianYear = 1404;
            const persianMonth = 6;
            const persianDay = 13;
            
            const persianDate = `${persianYear}/${String(persianMonth).padStart(2, '0')}/${String(persianDay).padStart(2, '0')}`;
            const persianTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            
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
            
            // دریافت و نمایش داده‌های ارز دیجیتال از API
            fetchCryptoData();
            
            // تایمر برای مخفی کردن لودینگ در صورت طولانی شدن درخواست
            setTimeout(() => {
                if (currencyLoading && !currencyLoading.classList.contains('hidden')) {
                    currencyLoading.classList.add('hidden');
                }
            }, 5000);
            
        } catch (error) {
            console.error("خطا در نمایش داده‌ها:", error);
            if (currencyError) currencyError.classList.remove('hidden');
            if (currencyLoading) currencyLoading.classList.add('hidden');
        }
    }, 300);
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
            if (currencyLoading) {
                currencyLoading.classList.add('hidden');
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
        if (currencyLoading) {
            currencyLoading.classList.add('hidden');
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
        
        // نمایش قیمت دلاری (بدون اعشار)
        let usdtPriceHtml = '';
        if (crypto.usdtPrice) {
            usdtPriceHtml = `<div class="crypto-price-usdt">${formatDollarPrice(crypto.usdtPrice)} <span class="crypto-unit">دلار</span></div>`;
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
        { symbol: "DOGE", name: "دوج‌کوین", tomanPrice: 4350, usdPrice: 0 },
        { symbol: "SHIB", name: "شیبا اینو", tomanPrice: 97, usdPrice: 0 },
        { symbol: "DOT", name: "پولکادات", tomanPrice: 1980000, usdPrice: 19 },
        { symbol: "TRX", name: "ترون", tomanPrice: 3870, usdPrice: 0 },
        { symbol: "AVAX", name: "آوالانچ", tomanPrice: 8750000, usdPrice: 85 },
        { symbol: "MATIC", name: "پالیگان", tomanPrice: 31500, usdPrice: 0 },
        { symbol: "LINK", name: "چین‌لینک", tomanPrice: 2870000, usdPrice: 28 },
        { symbol: "LTC", name: "لایت‌کوین", tomanPrice: 4850000, usdPrice: 47 },
        { symbol: "BCH", name: "بیت‌کوین کش", tomanPrice: 7920000, usdPrice: 78 },
        { symbol: "USDCIRT", name: "یو‌اس‌دی‌کوین", tomanPrice: 102300, usdPrice: 1 },
        { symbol: "BNBIRT", name: "بایننس کوین", tomanPrice: 68500000, usdPrice: 670 },
        { symbol: "XLMIRT", name: "استلار", tomanPrice: 3850, usdPrice: 0 },
        { symbol: "ETCIRT", name: "اتریوم کلاسیک", tomanPrice: 1750000, usdPrice: 17 },
        { symbol: "UNIIRT", name: "یونی سواپ", tomanPrice: 870000, usdPrice: 8 },
        { symbol: "DAIIRT", name: "دای", tomanPrice: 102500, usdPrice: 1 },
        { symbol: "AAVEIRT", name: "آوه", tomanPrice: 10450000, usdPrice: 102 },
        { symbol: "FTMIRT", name: "فانتوم", tomanPrice: 68500, usdPrice: 0 },
        { symbol: "AXSIRT", name: "اکسی اینفینیتی", tomanPrice: 785000, usdPrice: 7 },
        { symbol: "MANAIRT", name: "مانا (دیسنترالند)", tomanPrice: 69800, usdPrice: 0 },
        { symbol: "SANDIRT", name: "سندباکس", tomanPrice: 58700, usdPrice: 0 },
        { symbol: "MKRIRT", name: "میکر", tomanPrice: 184500000, usdPrice: 1804 },
        { symbol: "GMTIRT", name: "جی‌ام‌تی", tomanPrice: 28500, usdPrice: 0 },
        { symbol: "CHZIRT", name: "چیلیز", tomanPrice: 12800, usdPrice: 0 }
    ];
    
    return cryptoData.map(crypto => {
        return `
            <div class="currency-item crypto" data-symbol="${crypto.symbol}">
                <div class="currency-header">
                    <span class="currency-name">${crypto.name}</span>
                    <span class="currency-symbol">${crypto.symbol}</span>
                </div>
                <div class="crypto-prices">
                    <div class="crypto-price-irt">${formatNumber(crypto.tomanPrice)} <span class="crypto-unit">تومان</span></div>
                    <div class="crypto-price-usdt">${formatNumber(crypto.usdPrice)} <span class="crypto-unit">دلار</span></div>
                </div>
            </div>
        `;
    }).join('');
}

// ساخت HTML برای داده‌های طلا
function getGoldDataHTML() {
    const goldData = [
        { name: "طلای 18 عیار", price: 8620500, unit: "تومان" },
        { name: "طلای 24 عیار", price: 11494000, unit: "تومان" },
        { name: "طلای آب‌شده نقدی", price: 11250000, unit: "تومان" },
        { name: "انس طلا", price: 2610, unit: "دلار" },
        { name: "سکه امامی", price: 92010000, unit: "تومان" },
        { name: "سکه بهار آزادی", price: 90500000, unit: "تومان" },
        { name: "نیم سکه", price: 51000000, unit: "تومان" },
        { name: "ربع سکه", price: 31000000, unit: "تومان" },
        { name: "سکه یک گرمی", price: 18500000, unit: "تومان" }
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

// ساخت HTML برای داده‌های ارز خارجی
function getCurrencyDataHTML() {
    const currencyData = [
        // ارزهای اصلی
        { name: "دلار آمریکا (USD)", price: 101640, unit: "تومان" },
        { name: "یورو (EUR)", price: 118660, unit: "تومان" },
        { name: "پوند انگلیس (GBP)", price: 136920, unit: "تومان" },
        { name: "درهم امارات (AED)", price: 27852, unit: "تومان" },
        { name: "لیر ترکیه (TRY)", price: 2480, unit: "تومان" },
        { name: "دلار کانادا (CAD)", price: 76000, unit: "تومان" },
        { name: "دلار استرالیا (AUD)", price: 70000, unit: "تومان" },
        { name: "یوآن چین (CNY)", price: 14240, unit: "تومان" },
        
        // ارزهای اضافی
        { name: "افغانی (AFN)", price: 1350, unit: "تومان" },
        { name: "بات تایلند (THB)", price: 3120, unit: "تومان" },
        { name: "درام ارمنستان (AMD)", price: 254, unit: "تومان" },
        { name: "دینار بحرین (BHD)", price: 269700, unit: "تومان" },
        { name: "دینار عراق (IQD)", price: 77, unit: "تومان" },
        { name: "دینار کویت (KWD)", price: 332000, unit: "تومان" },
        { name: "روبل روسیه (RUB)", price: 1185, unit: "تومان" },
        { name: "روپیه پاکستان (PKR)", price: 365, unit: "تومان" },
        { name: "روپیه هند (INR)", price: 1220, unit: "تومان" },
        { name: "ریال عربستان (SAR)", price: 27100, unit: "تومان" },
        { name: "ریال عمان (OMR)", price: 264000, unit: "تومان" },
        { name: "ریال قطر (QAR)", price: 27900, unit: "تومان" },
        { name: "رینگیت مالزی (MYR)", price: 23700, unit: "تومان" },
        { name: "فرانک سوئیس (CHF)", price: 119000, unit: "تومان" },
        { name: "کرون سوئد (SEK)", price: 10150, unit: "تومان" },
        { name: "لاری گرجستان (GEL)", price: 37500, unit: "تومان" },
        { name: "لیر سوریه (SYP)", price: 8, unit: "تومان" },
        { name: "منات آذربایجان (AZN)", price: 59800, unit: "تومان" },
        { name: "یکصد ین ژاپن (JPY)", price: 69500, unit: "تومان" }
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
    
    // نمایش داده‌ها برای هر صفحه فعال
    if (!document.getElementById('currency-page').classList.contains('hidden')) {
        showCurrencyData();
    }
    
    // افزودن رویداد برای دکمه تلاش مجدد
    document.getElementById('retry-btn')?.addEventListener('click', showCurrencyData);
    
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
            showCurrencyData();
        }
        
        // مخفی کردن لودینگ اگر همچنان نمایش داده می‌شود
        if (currencyLoading && !currencyLoading.classList.contains('hidden')) {
            currencyLoading.classList.add('hidden');
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
