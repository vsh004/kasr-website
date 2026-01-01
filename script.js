// ==================== MODEL ====================
const model = {
    // داده‌های کاربر
    userProgress: {
        path: 'c',
        completedExercises: {},
        assessments: {},
        scores: {}
    },
    
    // داده‌های کسرها
    fractions: {
        // تعریف کسرهای معتبر و نحوه نمایش آنها
        validFractions: ['1/2', '1/4', '3/4', '2/4', '1/3', '2/3', '1/1', '0/1'],
        
        // تبدیل کسر به مقدار اعشاری
        toDecimal: function(fraction) {
            const parts = fraction.split('/');
            if (parts.length !== 2) return null;
            
            const numerator = parseInt(parts[0]);
            const denominator = parseInt(parts[1]);
            
            if (denominator === 0) return null;
            return numerator / denominator;
        },
        
        // ساده کردن کسر
        simplify: function(fraction) {
            const parts = fraction.split('/');
            if (parts.length !== 2) return fraction;
            
            let numerator = parseInt(parts[0]);
            let denominator = parseInt(parts[1]);
            
            // پیدا کردن بزرگترین مقسوم‌علیه مشترک
            const gcd = this.gcd(numerator, denominator);
            
            numerator /= gcd;
            denominator /= gcd;
            
            return `${numerator}/${denominator}`;
        },
        
        // محاسبه بزرگترین مقسوم‌علیه مشترک
        gcd: function(a, b) {
            if (b === 0) return a;
            return this.gcd(b, a % b);
        },
        
        // اعتبارسنجی فرمت کسر
        isValidFormat: function(input) {
            // بررسی فرمت صحیح مانند "1/2"
            const fractionPattern = /^\d+\/\d+$/;
            return fractionPattern.test(input);
        },
        
        // مقایسه دو کسر
        compare: function(fraction1, fraction2) {
            const dec1 = this.toDecimal(fraction1);
            const dec2 = this.toDecimal(fraction2);
            
            if (dec1 === null || dec2 === null) return null;
            
            if (dec1 > dec2) return '>';
            if (dec1 < dec2) return '<';
            return '=';
        }
    },
    
    // داده‌های اشکال
    shapes: {
        // رنگ‌آمیزی شکل بر اساس کسر
        colorShape: function(shapeId, fraction) {
            const shape = document.getElementById(shapeId);
            if (!shape) return false;
            
            const fillElement = shape.querySelector('.shape-fill');
            if (!fillElement) return false;
            
            // تجزیه کسر
            const parts = fraction.split('/');
            if (parts.length !== 2) return false;
            
            const numerator = parseInt(parts[0]);
            const denominator = parseInt(parts[1]);
            
            if (denominator === 0 || numerator > denominator) return false;
            
            // محاسبه درصد رنگ‌آمیزی
            const percentage = (numerator / denominator) * 100;
            
            // تعیین جهت رنگ‌آمیزی بر اساس نوع شکل
            const isCircle = shape.classList.contains('circle');
            
            if (isCircle) {
                // برای دایره از گرادینت دایره‌ای استفاده می‌کنیم
                fillElement.style.background = `conic-gradient(#4dabf7 0%, #4dabf7 ${percentage}%, transparent ${percentage}%, transparent 100%)`;
            } else {
                // برای مربع از گرادینت خطی افقی استفاده می‌کنیم
                fillElement.style.background = `linear-gradient(90deg, #4dabf7 0%, #4dabf7 ${percentage}%, transparent ${percentage}%, transparent 100%)`;
            }
            
            return true;
        },
        
        // پاک کردن رنگ شکل
        clearShape: function(shapeId) {
            const shape = document.getElementById(shapeId);
            if (!shape) return false;
            
            const fillElement = shape.querySelector('.shape-fill');
            if (!fillElement) return false;
            
            fillElement.style.background = 'transparent';
            return true;
        }
    },
    
    // داده‌های بازی
    game: {
        totalPeople: 8,
        frontPeople: 0,
        
        // به‌روزرسانی تعداد افراد
        updatePeople: function(change) {
            this.frontPeople += change;
            
            // محدود کردن به بازه ۰ تا کل افراد
            if (this.frontPeople < 0) this.frontPeople = 0;
            if (this.frontPeople > this.totalPeople) this.frontPeople = this.totalPeople;
            
            return this.frontPeople;
        },
        
        // محاسبه کسر
        calculateFraction: function() {
            return `${this.frontPeople}/${this.totalPeople}`;
        },
        
        // ساده کردن کسر افراد
        simplifyFraction: function() {
            return model.fractions.simplify(this.calculateFraction());
        }
    },
    
    // ذخیره پیشرفت
    saveProgress: function() {
        localStorage.setItem('fractionWorksheetProgress', JSON.stringify(this.userProgress));
        console.log('پیشرفت ذخیره شد:', this.userProgress);
    },
    
    // بارگذاری پیشرفت
    loadProgress: function() {
        const saved = localStorage.getItem('fractionWorksheetProgress');
        if (saved) {
            this.userProgress = JSON.parse(saved);
            console.log('پیشرفت بارگذاری شد:', this.userProgress);
            return true;
        }
        return false;
    },
    
    // ریست کردن همه چیز
    resetProgress: function() {
        this.userProgress = {
            path: 'c',
            completedExercises: {},
            assessments: {},
            scores: {}
        };
        localStorage.removeItem('fractionWorksheetProgress');
        console.log('همه داده‌ها ریست شدند');
    }
};

// ==================== VIEW ====================
const view = {
    // نمایش کاربرگ انتخاب شده
    showWorksheet: function(pathId) {
        // پنهان کردن همه کاربرگ‌ها
        const worksheets = document.querySelectorAll('.worksheet-container');
        worksheets.forEach(worksheet => {
            worksheet.classList.remove('active');
        });
        
        // نمایش کاربرگ انتخاب شده
        const selectedWorksheet = document.getElementById(pathId);
        if (selectedWorksheet) {
            selectedWorksheet.classList.add('active');
        }
        
        // به‌روزرسانی دکمه‌های فعال
        const buttons = document.querySelectorAll('.path-btn');
        buttons.forEach(button => {
            button.classList.remove('active');
        });
        
        if (pathId === 'path-c') {
            document.querySelector('.path-c-btn').classList.add('active');
        } else if (pathId === 'path-b') {
            document.querySelector('.path-b-btn').classList.add('active');
        } else if (pathId === 'path-a') {
            document.querySelector('.path-a-btn').classList.add('active');
        }
        
        // به‌روزرسانی مسیر در مدل
        model.userProgress.path = pathId.replace('path-', '');
    },
    
    // نمایش نتیجه
    showResult: function(elementId, message, type = 'info') {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.textContent = message;
        element.className = 'result-message';
        
        switch(type) {
            case 'success':
                element.classList.add('result-success');
                break;
            case 'error':
                element.classList.add('result-error');
                break;
            case 'info':
                element.classList.add('result-info');
                break;
        }
        
        // پاک کردن پیام بعد از 5 ثانیه
        setTimeout(() => {
            element.textContent = '';
            element.className = 'result-message';
        }, 5000);
    },
    
    // به‌روزرسانی نمایش افراد در بازی
    updatePeopleDisplay: function() {
        const totalPeopleGrid = document.getElementById('total-people');
        const frontPeopleGrid = document.getElementById('front-people');
        
        if (!totalPeopleGrid || !frontPeopleGrid) return;
        
        // پاک کردن محتوای فعلی
        totalPeopleGrid.innerHTML = '';
        frontPeopleGrid.innerHTML = '';
        
        // ایجاد افراد کل کلاس
        for (let i = 0; i < model.game.totalPeople; i++) {
            const person = document.createElement('div');
            person.className = 'person';
            person.textContent = i + 1;
            totalPeopleGrid.appendChild(person);
        }
        
        // ایجاد افراد جلو
        for (let i = 0; i < model.game.frontPeople; i++) {
            const person = document.createElement('div');
            person.className = 'person active';
            person.textContent = i + 1;
            frontPeopleGrid.appendChild(person);
        }
        
        // نمایش کسر
        const fraction = model.game.calculateFraction();
        const simplified = model.game.simplifyFraction();
        document.getElementById('game-fraction').value = fraction;
        
        // نمایش پیام در صورت لزوم
        if (fraction === simplified) {
            view.showResult('game-result', `عالی! کسر ${fraction} به ساده‌ترین شکل است.`, 'success');
        } else {
            view.showResult('game-result', `کسر ${fraction} برابر است با ${simplified} (ساده‌شده)`, 'info');
        }
    },
    
    // علامت‌گذاری شکل انتخاب شده
    markSelectedShape: function(shapeId) {
        // حذف انتخاب از همه شکل‌ها
        const allShapes = document.querySelectorAll('.shape-selectable');
        allShapes.forEach(shape => {
            shape.classList.remove('selected');
        });
        
        // انتخاب شکل کلیک شده
        const selectedShape = document.getElementById(shapeId);
        if (selectedShape) {
            selectedShape.classList.add('selected');
            
            // نمایش کسر مربوطه
            const fraction = selectedShape.getAttribute('data-fraction');
            view.showResult('most-colored-result', `شکل با کسر ${fraction} انتخاب شد.`, 'success');
        }
    },
    
    // به‌روزرسانی وضعیت تطبیق
    updateMatchStatus: function(shapeId, isCorrect) {
        const statusElement = document.getElementById(`match-status-${shapeId.split('-').pop()}`);
        if (!statusElement) return;
        
        if (isCorrect) {
            statusElement.textContent = '✅ تطبیق درست!';
            statusElement.style.color = '#28a745';
        } else {
            statusElement.textContent = '❌ تطبیق نادرست';
            statusElement.style.color = '#dc3545';
        }
    }
};

// ==================== CONTROLLER ====================
const controller = {
    // مقداردهی اولیه
    init: function() {
        console.log('کنترلر مقداردهی اولیه شد');
        
        // بارگذاری پیشرفت ذخیره شده
        model.loadProgress();
        
        // تنظیم رویدادهای اینپوت‌های کسر
        this.setupFractionInputs();
        
        // مقداردهی اولیه بازی افراد
        this.initPeopleGame();
        
        // نمایش مسیر فعلی
        const currentPath = model.userProgress.path || 'c';
        view.showWorksheet(`path-${currentPath}`);
        
        // تنظیم رویداد ذخیره هنگام بسته شدن صفحه
        window.addEventListener('beforeunload', () => {
            model.saveProgress();
        });
    },
    
    // تنظیم رویدادهای اینپوت‌های کسر
    setupFractionInputs: function() {
        const fractionInputs = document.querySelectorAll('.fraction-input, .fraction-input-small');
        
        fractionInputs.forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const shapeId = this.getAttribute('data-shape');
                    if (shapeId) {
                        controller.applyFraction(this.id, shapeId);
                    }
                }
            });
            
            // اعتبارسنجی بلادرنگ
            input.addEventListener('input', function() {
                const value = this.value.trim();
                if (value && model.fractions.isValidFormat(value)) {
                    this.style.borderColor = '#51cf66';
                } else if (value) {
                    this.style.borderColor = '#ff6b6b';
                } else {
                    this.style.borderColor = '#ddd';
                }
            });
        });
    },
    
    // مقداردهی اولیه بازی افراد
    initPeopleGame: function() {
        model.game.frontPeople = 4; // مقدار پیش‌فرض
        view.updatePeopleDisplay();
    },
    
    // اعمال کسر بر روی شکل
    applyFraction: function(inputId, shapeId) {
        const input = document.getElementById(inputId);
        if (!input) return;
        
        const fraction = input.value.trim();
        
        // اعتبارسنجی کسر
        if (!fraction) {
            view.showResult('most-colored-result', 'لطفاً یک کسر وارد کنید.', 'error');
            return;
        }
        
        if (!model.fractions.isValidFormat(fraction)) {
            view.showResult('most-colored-result', 'فرمت کسر نامعتبر است. فرمت صحیح: عدد/عدد (مانند 1/2)', 'error');
            return;
        }
        
        // اعمال رنگ‌آمیزی روی شکل
        const success = model.shapes.colorShape(shapeId, fraction);
        
        if (success) {
            view.showResult('most-colored-result', `شکل با کسر ${fraction} رنگ‌آمیزی شد.`, 'success');
            
            // ذخیره در پیشرفت
            const exerciseKey = `${shapeId}-${fraction}`;
            model.userProgress.completedExercises[exerciseKey] = true;
            model.saveProgress();
        } else {
            view.showResult('most-colored-result', 'مشکلی در رنگ‌آمیزی شکل رخ داد. لطفاً کسر معتبری وارد کنید.', 'error');
        }
    },
    
    // پاک کردن شکل
    clearShape: function(shapeId) {
        const success = model.shapes.clearShape(shapeId);
        
        if (success) {
            view.showResult('most-colored-result', 'رنگ‌آمیزی شکل پاک شد.', 'info');
        }
    },
    
    // انتخاب شکل بیشتر رنگ شده
    selectMostColoredShape: function(shapeId) {
        view.markSelectedShape(shapeId);
        
        // ذخیره پاسخ
        model.userProgress.completedExercises[`most-colored-${shapeId}`] = true;
        model.saveProgress();
    },
    
    // بررسی مقایسه کسرها
    checkComparison: function() {
        const selectedOption = document.querySelector('input[name="comparison-c"]:checked');
        
        if (!selectedOption) {
            view.showResult('comparison-result', 'لطفاً یک گزینه انتخاب کنید.', 'error');
            return;
        }
        
        const selectedValue = selectedOption.value;
        let message = '';
        let type = 'error';
        
        if (selectedValue === '1/4') {
            message = '✅ درست است! 1/4 کوچک‌تر از 1/2 است.';
            type = 'success';
        } else {
            message = '❌ پاسخ صحیح 1/4 است. زیرا 1/4 برابر 0.25 و 1/2 برابر 0.5 است.';
        }
        
        view.showResult('comparison-result', message, type);
        
        // ذخیره نتیجه
        model.userProgress.completedExercises['comparison-c'] = selectedValue;
        model.saveProgress();
    },
    
    // بررسی کسر بازی
    checkGameFraction: function() {
        const input = document.getElementById('game-fraction');
        if (!input) return;
        
        const enteredFraction = input.value.trim();
        const correctFraction = model.game.calculateFraction();
        const simplifiedFraction = model.game.simplifyFraction();
        
        let message = '';
        let type = 'error';
        
        if (enteredFraction === correctFraction || enteredFraction === simplifiedFraction) {
            message = `✅ عالی! کسر صحیح ${correctFraction} است (ساده‌شده: ${simplifiedFraction}).`;
            type = 'success';
        } else {
            message = `❌ کسر صحیح ${correctFraction} است (ساده‌شده: ${simplifiedFraction}).`;
        }
        
        view.showResult('game-result', message, type);
        
        // ذخیره نتیجه
        model.userProgress.completedExercises['game-fraction'] = enteredFraction;
        model.saveProgress();
    },
    
    // اضافه کردن فرد به بازی
    addPerson: function() {
        model.game.updatePeople(1);
        view.updatePeopleDisplay();
    },
    
    // حذف فرد از بازی
    removePerson: function() {
        model.game.updatePeople(-1);
        view.updatePeopleDisplay();
    },
    
    // اتصال کسر به شکل
    connectFraction: function(fraction, shapeId) {
        const shape = document.getElementById(shapeId);
        if (!shape) return;
        
        const expectedFraction = shape.getAttribute('data-expected');
        const isCorrect = fraction === expectedFraction;
        
        // رنگ‌آمیزی شکل
        model.shapes.colorShape(shapeId, fraction);
        
        // به‌روزرسانی وضعیت
        view.updateMatchStatus(shapeId, isCorrect);
        
        // نمایش نتیجه کلی
        if (isCorrect) {
            view.showResult('matching-result', `✅ درست است! ${fraction} با شکل مطابقت دارد.`, 'success');
        } else {
            view.showResult('matching-result', `❌ ${fraction} با شکل مطابقت ندارد. پاسخ صحیح: ${expectedFraction}`, 'error');
        }
        
        // ذخیره نتیجه
        model.userProgress.completedExercises[`match-${shapeId}`] = isCorrect;
        model.saveProgress();
    },
    
    // به‌روزرسانی ارزیابی
    updateAssessment: function(assessmentId, isChecked) {
        model.userProgress.assessments[assessmentId] = isChecked;
        model.saveProgress();
        
        console.log(`ارزیابی ${assessmentId} به ${isChecked ? 'فعال' : 'غیرفعال'} تغییر کرد`);
    },
    
    // انتقال به مسیر دیگر
    transferToPath: function(targetPath) {
        if (targetPath === 'b' || targetPath === 'a') {
            const confirmTransfer = confirm(`آیا مطمئن هستید که می‌خواهید به مسیر ${targetPath.toUpperCase()} انتقال یابید؟`);
            if (confirmTransfer) {
                view.showWorksheet(`path-${targetPath}`);
                model.userProgress.path = targetPath;
                model.saveProgress();
            }
        }
    },
    
    // نمایش کاربرگ
    showWorksheet: view.showWorksheet,
    
    // ذخیره پیشرفت
    saveProgress: function() {
        model.saveProgress();
        alert('پیشرفت شما ذخیره شد.');
    },
    
    // ریست کردن همه چیز
    resetAll: function() {
        const confirmReset = confirm('آیا مطمئن هستید که می‌خواهید همه پیشرفت‌ها را پاک کنید؟ این عمل قابل بازگشت نیست.');
        if (confirmReset) {
            model.resetProgress();
            location.reload(); // بارگذاری مجدد صفحه
        }
    }
};

// راه‌اندازی برنامه هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', function() {
    controller.init();
});