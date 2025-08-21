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

// اضافه کردن جداکننده هزارگان هنگام تایپ
amountInput.addEventListener('input', function() {
    // حذف کاراکترهای غیر عددی
    let value = this.value.replace(/[^\d]/g, '');
    
    // اضافه کردن کاما به عنوان جداکننده هزارگان
    if (value) {
        this.value = Number(value).toLocaleString('fa-IR');
    }
});

// دکمه تبدیل
convertBtn.addEventListener('click', function() {
    // دریافت مقادیر ورودی
    const conversionType = conversionTypeSelect.value;
    const inputValue = amountInput.value.replace(/[^\d]/g, '');
    
    if (!inputValue) {
        alert('لطفاً یک عدد وارد کنید');
        return;
    }
    
    let rialValue, tomanValue;
    
    // انجام تبدیل براساس نوع انتخاب شده
    if (conversionType === 'toman-to-rial') {
        tomanValue = parseInt(inputValue);
        rialValue = tomanValue * 10;
        
        // نمایش نتیجه عددی
        numericResult.textContent = `${rialValue.toLocaleString('fa-IR')} ریال`;
        
        // تبدیل به حروف
        textResult.textContent = `${numberToWords(rialValue)} ریال`;
    } else {
        rialValue = parseInt(inputValue);
        tomanValue = Math.floor(rialValue / 10);
        
        // نمایش نتیجه عددی
        numericResult.textContent = `${tomanValue.toLocaleString('fa-IR')} تومان`;
        
        // تبدیل به حروف
        textResult.textContent = `${numberToWords(tomanValue)} تومان`;
    }
    
    // نمایش نتایج
    resultContainer.classList.remove('hidden');
});

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
function numberToWords(number) {
    if (number === 0) return 'صفر';
    
    const numStr = number.toString();
    let words = '';
    let scaleIndex = 0;
    
    // تقسیم عدد به گروه‌های سه رقمی
    for (let i = numStr.length; i > 0; i -= 3) {
        const start = Math.max(0, i - 3);
        const chunk = parseInt(numStr.substring(start, i));
        
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
