(function () {
  'use strict';
  console.log('[main.js] loaded');

  //  إعداد المسارات هنا  
  const PATHS = {
    home: '../HTML/index.html', 
    register: '../HTML/sign up.html', 
    login:'../HTML/login.html'
  };

  function showToast(message, type = 'success', timeout = 3000) {
    try {
      const toast = document.createElement('div');
      toast.className = `toast align-items-center text-bg-${type} border-0 show`;
      toast.setAttribute('role', 'alert');
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.right = '20px';
      toast.style.zIndex = 9999;
      toast.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button>
        </div>
      `;
      toast.querySelector('.btn-close')?.addEventListener('click', () => toast.remove());
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), timeout);
    } catch (err) {
      console.warn('showToast fallback to alert', err); 
      alert(message);
    }
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function getSavedUser() {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error parsing saved user JSON:', err);
      return null;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    console.log('[main] DOM ready');

    // --------- Login form handling ----------
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      console.log('[main] loginForm found');
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const emailEl = document.getElementById('email'); 
        const passEl = document.getElementById('password');

        if (!emailEl || !passEl) {
          console.error('Login fields not found: check IDs (email, password)');
          showToast('خطأ داخلي: حقول تسجيل الدخول غير موجودة', 'danger');
          return;
        }

        const email = emailEl.value.trim();
        const password = passEl.value;

        if (!email || !password) {
          showToast('الرجاء تعبئة البريد وكلمة المرور!', 'danger');
          return;
        }
        if (!isValidEmail(email)) {
          showToast('الرجاء إدخال بريد إلكتروني صالح!', 'danger');
          return;
        }

        const savedUser = getSavedUser();
        console.log('[main] savedUser:', savedUser);

        if (!savedUser) {
          // لا يوجد حساب — اطلب من المستخدم التسجيل
          showToast('لا يوجد حساب مسجل، سيتم تحويلك لصفحة إنشاء حساب', 'warning');
          setTimeout(() => {
            window.location.href = PATHS.register;
          }, 1000);
          return;
        }

        // يوجد حساب مخزن — قارن البريد و كلمة المرور
        if (savedUser.email === email && savedUser.password === password) {
          showToast('تم تسجيل الدخول بنجاح — جاري التحويل', 'success');
          setTimeout(() => {
            window.location.href = PATHS.home;
          }, 800);
        } else {
          showToast('البريد أو كلمة المرور غير صحيحة', 'danger');
        }
      });
    } else {
      console.log('[main] loginForm not present on this page');
    }

    // --------- Register form handling ----------
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      console.log('[main] registerForm found');
      registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const fullName = (document.getElementById('fullName') || {}).value?.trim() || '';
        const email = (document.getElementById('email') || {}).value?.trim() || '';
        const password = (document.getElementById('password') || {}).value || '';
        const confirmPassword = (document.getElementById('confirmPassword') || {}).value || '';

        if (!fullName || !email || !password || !confirmPassword) {
          showToast('يرجى تعبئة جميع الحقول!', 'danger');
          return;
        }
        if (!isValidEmail(email)) {
          showToast('البريد الإلكتروني غير صالح!', 'danger');
          return;
        }
        if (password !== confirmPassword) {
          showToast('كلمتا المرور غير متطابقتين!', 'danger');
          return;
        }

        // خزن المستخدم
        const user = { fullName, email, password };
        try {
          localStorage.setItem('user', JSON.stringify(user));
          console.log('[main] user saved to localStorage');
          showToast('تم إنشاء الحساب بنجاح', 'success');
          setTimeout(() => {
            window.location.href = PATHS.login;
          }, 1000);
        } catch (err) {
          console.error('Error saving user to localStorage', err);
          showToast('خطأ في حفظ البيانات', 'danger');
        }
      });
    } else {
      console.log('[main] registerForm not present on this page');
    }

    // --------- Order form (example) ----------
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
      console.log('[main] orderForm found');
      orderForm.addEventListener('submit', function (e) {
        e.preventDefault();
        showToast('تم إرسال طلب التفصيل بنجاح!', 'success');
        orderForm.reset();
      });
    }
  });
})();


// Lightbox functionality
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const caption = document.getElementById("caption");
  const closeBtn = document.querySelector(".close");

  document.querySelectorAll(".gallery-item img").forEach(img => {
    img.addEventListener("click", () => {
      lightbox.style.display = "block";
      lightboxImg.src = img.src;
      caption.textContent = img.alt;
    });
  });

// here 
  closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  // اغلاق عند الضغط على الخلفية
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  });
});
