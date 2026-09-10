<template>
  <div class="app">
    <div v-if="!isLoggedIn" class="login-container">
      <div class="login-box">
        <h1>TASWIYAH HUB</h1>
        <p class="subtitle">أهلاً بك في مكتبك المالي</p>
        <p class="description">سجل الدخول للمتابعة إلى مساحة التسوية</p>

        <form @submit.prevent="login">
          <div class="form-group">
            <label>اسم المستخدم</label>
            <input v-model="username" type="text" placeholder="admin" />
          </div>

          <div class="form-group">
            <label>كلمة المرور</label>
            <input v-model="password" type="password" placeholder="••••••••" />
          </div>

          <button type="submit" class="login-btn">تسجيل الدخول →</button>
        </form>

        <p class="credentials">{{ loginHint }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>

      <div class="info-box">
        <div class="logo-placeholder"></div>
        <h2>قرار مالي واضح، من أول كشف.</h2>
        <p>مساحة عمل يومية لمراجعة الفواتير والحسابات، مع أثر واقعي لكل مظفة.</p>
        <p class="note">● بيانتك محفوظة محلياً في هذا المشروع.</p>
      </div>
    </div>

    <div v-else class="dashboard">
      <header class="header">
        <h1>Taswiyah Hub</h1>
        <button @click="logout" class="logout-btn">تسجيل الخروج</button>
      </header>
      <main class="main-content">
        <div class="welcome">
          <h2>مرحباً، {{ user.username }}</h2>
          <p>رقم التطبيق: {{ appVersion }}</p>
        </div>

        <div class="api-status">
          <h3>حالة الخادم</h3>
          <div :class="['status-card', apiStatus.status]">
            <p><strong>الحالة:</strong> {{ apiStatus.message }}</p>
            <p><strong>الوقت:</strong> {{ apiStatus.timestamp }}</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const username = ref('admin');
const password = ref('admin123');
const isLoggedIn = ref(false);
const user = ref({});
const errorMessage = ref('');
const loginHint = ref('admin / admin123');
const appVersion = ref('1.0.0');
const apiStatus = ref({ status: 'loading', message: 'جاري التحقق...', timestamp: '' });

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const login = async () => {
  errorMessage.value = '';
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      user.value = data.user;
      isLoggedIn.value = true;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      checkApiStatus();
    } else {
      errorMessage.value = 'خطأ في بيانات المستخدم أو كلمة المرور';
    }
  } catch (error) {
    errorMessage.value = `خطأ في الاتصال: ${error.message}`;
    console.error('Login error:', error);
  }
};

const logout = () => {
  isLoggedIn.value = false;
  user.value = {};
  username.value = 'admin';
  password.value = 'admin123';
  errorMessage.value = '';
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const checkApiStatus = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      apiStatus.value = {
        status: 'ok',
        message: data.message || 'الخادم يعمل بشكل صحيح',
        timestamp: data.timestamp,
      };
    }
  } catch (error) {
    apiStatus.value = {
      status: 'error',
      message: 'لا يمكن الاتصال بالخادم',
      timestamp: new Date().toISOString(),
    };
  }
};

onMounted(() => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    user.value = JSON.parse(savedUser);
    isLoggedIn.value = true;
    checkApiStatus();
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
  background: #0f1419;
}

.app {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
  color: #fff;
}

/* Login Styles */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.login-box,
.info-box {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(100, 150, 255, 0.2);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.info-box {
  max-width: 500px;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  margin-right: 40px;
}

.login-box h1 {
  font-size: 28px;
  color: #fbbf24;
  margin-bottom: 10px;
  text-align: center;
}

.subtitle {
  font-size: 20px;
  color: #e0e7ff;
  text-align: center;
  margin-bottom: 10px;
}

.description {
  font-size: 14px;
  color: #94a3b8;
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #cbd5e1;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(100, 150, 255, 0.3);
  border-radius: 8px;
  background: rgba(15, 20, 25, 0.5);
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #6495ff;
  background: rgba(15, 20, 25, 0.8);
}

.login-btn {
  width: 100%;
  padding: 14px 16px;
  background: #fbbf24;
  color: #000;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.login-btn:hover {
  background: #f59e0b;
  transform: translateY(-2px);
}

.credentials {
  text-align: center;
  font-size: 12px;
  color: #64748b;
  margin-top: 15px;
}

.error {
  color: #ef4444;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

.logo-placeholder {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  margin: 0 auto 20px;
}

.info-box h2 {
  font-size: 24px;
  margin-bottom: 15px;
  text-align: right;
}

.info-box p {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 10px;
  text-align: right;
  color: rgba(255, 255, 255, 0.9);
}

.note {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

/* Dashboard Styles */
.dashboard {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(100, 150, 255, 0.2);
  border-radius: 16px;
  padding: 20px 30px;
  margin-bottom: 30px;
}

.header h1 {
  color: #fbbf24;
  font-size: 24px;
}

.logout-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #dc2626;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(100, 150, 255, 0.2);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
}

.welcome h2 {
  color: #fbbf24;
  font-size: 22px;
  margin-bottom: 10px;
}

.welcome p {
  color: #94a3b8;
}

.api-status h3 {
  color: #fbbf24;
  margin-bottom: 15px;
  font-size: 18px;
}

.status-card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(100, 150, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
}

.status-card.ok {
  border-color: #10b981;
}

.status-card.error {
  border-color: #ef4444;
}

.status-card.loading {
  border-color: #6495ff;
}

.status-card p {
  margin: 10px 0;
  color: #cbd5e1;
}

.status-card strong {
  color: #fbbf24;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .info-box {
    margin-right: 0;
    margin-top: 20px;
  }

  .login-box,
  .info-box {
    max-width: 100%;
  }
}
</style>
