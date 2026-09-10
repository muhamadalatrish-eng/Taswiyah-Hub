# 🪟 دليل إعداد Taswiyah Hub على Windows

> **للعمل المحلي (Local Development)**

---

## 📋 المتطلبات الأساسية

### 1. تثبيت Node.js و npm

- **تحميل Node.js**: https://nodejs.org/ (اختر الإصدار LTS)
- **التحقق من التثبيت**:
  ```cmd
  node --version
  npm --version
  ```

### 2. تثبيت Git (اختياري لكن مهم)

- **تحميل Git**: https://git-scm.com/
- **التحقق من التثبيت**:
  ```cmd
  git --version
  ```

---

## 🚀 خطوات البدء السريعة

### الخطوة 1: فك ضغط المشروع

1. قم بفك ضغط `Taswiyah-Hub.zip`
2. اذهب إلى المجلد: `cd Taswiyah-Hub`

### الخطوة 2: تشغيل برنامج الإعداد

انقر مرتين على الملف: **`dev-setup.cmd`**

```
✓ يتحقق من تثبيت Node.js و npm
✓ ينزل جميع المكتبات المطلوبة
✓ ينشئ ملف .env بالإعدادات الصحيحة
```

### الخطوة 3: تشغيل التطبيق

انقر مرتين على الملف: **`start-dev.cmd`**

```
✓ يشغل Backend على http://localhost:3000
✓ يشغل Frontend على http://localhost:5173
✓ يفتح الصفحة تلقائياً في المتصفح
```

---

## 💻 طريقة يدوية بدون الملفات

إذا لم تعمل الملفات `cmd`, استخدم Command Prompt:

### الخطوة 1: فك الضغط والدخول

```cmd
cd C:\المسار\Taswiyah-Hub
```

### الخطوة 2: تثبيت المكتبات

```cmd
npm install
```

### الخطوة 3: إنشاء ملف `.env`

انسخ محتوى `.env.example` في ملف جديد باسم `.env`:

```
NODE_ENV=development
API_PORT=3000
API_HOST=localhost
VITE_API_URL=http://localhost:3000
VITE_BASE_PATH=/
```

### الخطوة 4: تشغيل التطبيق

```cmd
npm run dev
```

---

## 🌐 الوصول إلى التطبيق

بعد تشغيل الأوامر، ستظهر رسالة في Command Prompt:

```
  ➜  Local:   http://localhost:5173/
  ➜  API:     http://localhost:3000/
```

**افتح المتصفح واذهب إلى**: `http://localhost:5173`

ستظهر صفحة تسجيل الدخول:
```
اسم المستخدم: admin
كلمة المرور:  admin123
```

---

## 🔧 حل المشاكل الشائعة

### ❌ المشكلة: "node command not found"

**الحل:**
- أعد تثبيت Node.js
- تأكد من إضافة Node.js إلى PATH
- أعد تشغيل Command Prompt بعد التثبيت

---

### ❌ المشكلة: صفحة بدون CSS أو تصميم

**الحل:**
- تأكد من أن `VITE_BASE_PATH=/` في ملف `.env`
- امسح الـ cache: `Ctrl+Shift+Delete` في المتصفح
- أعد تحميل الصفحة: `Ctrl+F5`

---

### ❌ المشكلة: "Port 3000 already in use"

**الحل - الطريقة 1:** غير رقم المنفذ في `.env`:
```
API_PORT=3001
VITE_API_URL=http://localhost:3001
```

**الحل - الطريقة 2:** أوقف البرنامج المستخدم للمنفذ:
```cmd
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

---

### ❌ المشكلة: "404 Not Found" للـ CSS

**الحل:**
```cmd
# امسح مجلد node_modules
rmdir /s node_modules

# أعد تثبيت المكتبات
npm install

# شغل التطبيق من جديد
npm run dev
```

---

## 📁 هيكل المشروع

```
Taswiyah-Hub/
├── api-server/          ← Backend (Node.js + Express)
│   ├── server.js
│   └── package.json
├── taswiyah-hub/        ← Frontend (Vue.js + Vite)
│   ├── src/
│   ├── vite.config.ts
│   └── package.json
├── package.json         ← Root package.json (يشغل الاثنين معاً)
├── .env.example
├── dev-setup.cmd        ← برنامج الإعداد
└── start-dev.cmd        ← برنامج التشغيل
```

---

## 🎯 الأوامر المتاحة

| الأمر | الوصف |
|------|-------|
| `npm run dev` | تشغيل Backend و Frontend معاً |
| `npm run dev:api` | تشغيل Backend فقط |
| `npm run dev:web` | تشغيل Frontend فقط |
| `npm run build` | بناء التطبيق للإنتاج |
| `npm run start` | تشغيل في بيئة الإنتاج |
| `npm run install:all` | تثبيت المكتبات لجميع الأجزاء |

---

## 📝 ملاحظات مهمة

✅ **قبل البدء:**
- تأكد من توفر 500 ميجابايت مساحة حرة
- اغلق أي برامج تستخدم المنفذ 3000 أو 5173
- استخدم Command Prompt أو PowerShell

✅ **أثناء التطوير:**
- لا تغلق Command Prompt طالما تطور
- اضغط `Ctrl+C` لإيقاف التطبيق
- التغييرات تُحفظ تلقائياً (Hot Reload)

✅ **للإنتاج:**
- استخدم `npm run build` أولاً
- ثم `npm run start`
- استخدم reverse proxy (Nginx) للأمان

---

## 📞 الدعم

إذا واجهت مشكلة:
1. اقرأ قسم "حل المشاكل الشائعة"
2. تحقق من أن جميع المتطلبات مثبتة
3. احذف `node_modules` وأعد التثبيت
4. أعد تشغيل Command Prompt

---

**تم إنشاء هذا الدليل بتاريخ:** 2026-09-10
