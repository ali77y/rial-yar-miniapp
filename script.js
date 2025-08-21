// برقراری ارتباط با تلگرام
const webapp = window.Telegram?.WebApp;
if (webapp) {
    webapp.expand();
    webapp.ready();
}

// انتخاب المان‌های DOM
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
    
    // پاک کردن نتایج قبلی
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

// اضافه کردن جداکننده هزارگان هنگام تایپ
amountInput.addEventListener('input', function(e) {
    // تبدیل اعداد فارسی به انگلیسی
    this.value = convertPersianToEnglishNumbers(this.value);
    
    // ذخیره موقعیت کرسر
    const start = this.selectionStart;
    const end = this.selectionEnd;
    
    // حفظ عدد خالص قبلی اگر کاربر در حال تایپ است
    if (e.inputType === 'insertText' && /\d/.test(e.data)) {
        // اضافه کردن رقم جدید به موقعیت مناسب
        const cleanValue = this.value.replace(/[^\d]/g, '');
        rawNumber = cleanValue;
    } 
    // اگر کاربر در حال حذف کردن است
    else if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
        rawNumber = this.value.replace(/[^\d]/g, '');
    }
    // برای پیست کردن یا سایر حالت‌ها
    else {
        rawNumber = this.value.replace(/[^\d]/g, '');
    }
    
    // حفظ مقدار خالی
    if (rawNumber === '') {
        this.value = '';
        return;
    }
    
    // فرمت‌دهی با جداکننده هزارگان به صورت دستی برای اعداد بزرگ
    let formattedValue = '';
    for (let i = 0; i < rawNumber.length; i++) {
        if (i > 0 && (rawNumber.length - i) % 3 === 0) {
            formattedValue += ',';
        }
        formattedValue += rawNumber[i];
    }
    
    this.value = formattedValue;
    
    // تنظیم مجدد موقعیت کرسر با در نظر گرفتن کاماهای اضافه شده
    const commasBefore = formattedValue.substring(0, start).split(',').length - 1;
    this.setSelectionRange(start + commasBefore, end + commasBefore);
});

// دکمه تبدیل
convertBtn.addEventListener('click', function() {
    // دریافت مقدار عددی خالص
    const inputValue = rawNumber || amountInput.value.replace(/[^\d]/g, '');
    
    if (!inputValue) {
        alert('لطفاً یک عدد وارد کنید');
        return;
    }
    
    let rialValue, tomanValue;
    
    // انجام تبدیل براساس نوع انتخاب شده
    if (conversionTypeSelect.value === 'toman-to-rial') {
        tomanValue = BigInt(inputValue);
        rialValue = tomanValue * BigInt(10);
        
        // نمایش نتیجه عددی - تبدیل به string برای اعداد بزرگ
        numericResult.textContent = formatLargeNumber(rialValue.toString()) + ' ریال';
        
        // تبدیل به حروف
        textResult.textContent = `${numberToWords(rialValue.toString())} ریال`;
    } else {
        rialValue = BigInt(inputValue);
        tomanValue = rialValue / BigInt(10);
        
        // نمایش نتیجه عددی
        numericResult.textContent = formatLargeNumber(tomanValue.toString()) + ' تومان';
        
        // تبدیل به حروف
        textResult.textContent = `${numberToWords(tomanValue.toString())} تومان`;
    }
    
    // نمایش نتایج
    resultContainer.classList.remove('hidden');
});

// تابع فرمت‌دهی اعداد بزرگ با جداکننده هزارگان
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

// کپی کردن نتیجه عددی
copyNumericBtn.addEventListener('click', function() {
    copyToClipboard(numericResult.textContent);
    showToast('نتیجه عددی کپی شد');
});

// کپی کردن نتیجه متنی
copyTextBtn.addEventListener('click', function() {
    copyToClipboard(textResult.textContent);
    showToast('نتیجه متنی کپی شد');
});

// تابع کپی به کلیپ‌بورد
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// نمایش پیام toast
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

// تعریف واحدهای پولی در فارسی
const units = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
const tens = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
const scales = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون', 'کوادریلیون'];

// تبدیل عدد به حروف فارسی
function numberToWords(numStr) {
    if (numStr === '0') return 'صفر';
    
    let words = '';
    let scaleIndex = 0;
    
    // تقسیم عدد به گروه‌های سه رقمی
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

// تبدیل اعداد سه رقمی به حروف
function convertChunkToWords(chunk) {
    let result = '';
    
    // صدگان
    const hundred = Math.floor(chunk / 100);
    if (hundred > 0) {
        result += hundreds[hundred];
    }
    
    // دهگان و یکان
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
