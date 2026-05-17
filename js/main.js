// 游戏入口 - 初始化所有模块
let game;
let staticNoise;

// 预加载进度跟踪
let loadedAssets = 0;
let totalAssets = 0;

// =========================
// Accessibility text alerts
// =========================
function showAccessibilityText(message) {
    let alertBox = document.getElementById('accessibility-alert');

    if (!alertBox) {
        alertBox = document.createElement('div');
        alertBox.id = 'accessibility-alert';

        alertBox.style.position = 'fixed';
        alertBox.style.top = '20px';
        alertBox.style.left = '50%';
        alertBox.style.transform = 'translateX(-50%)';

        alertBox.style.background = 'rgba(0,0,0,0.85)';
        alertBox.style.color = 'white';

        alertBox.style.padding = '15px 25px';
        alertBox.style.fontSize = '28px';
        alertBox.style.fontWeight = 'bold';
        alertBox.style.fontFamily = 'Arial';

        alertBox.style.border = '3px solid white';
        alertBox.style.borderRadius = '10px';

        alertBox.style.zIndex = '999999';
        alertBox.style.pointerEvents = 'none';

        document.body.appendChild(alertBox);
    }

    alertBox.textContent = message;

    clearTimeout(alertBox.hideTimeout);

    alertBox.style.display = 'block';

    alertBox.hideTimeout = setTimeout(() => {
        alertBox.style.display = 'none';
    }, 2000);
}

// =========================
// 屏幕震动效果（无障碍提示）
// vertical = 上下震动（Trump进入通风管）
// horizontal = 左右震动（Trump离开通风管）
// =========================
function shakeScreen(direction = 'vertical', intensity = 10, duration = 500) {
    const body = document.body;
    let start = null;

    function animateShake(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;

        if (elapsed < duration) {
            const offset = Math.sin(elapsed * 0.05) * intensity;

            if (direction === 'vertical') {
                body.style.transform = `translateY(${offset}px)`;
            } else {
                body.style.transform = `translateX(${offset}px)`;
            }

            requestAnimationFrame(animateShake);
        } else {
            body.style.transform = '';
        }
    }

    requestAnimationFrame(animateShake);
}

// =========================
// Trump vent accessibility helpers
// =========================
function trumpEnteredVents() {
    shakeScreen('vertical', 12, 700);
    showAccessibilityText('⚠ TRUMP ENTERED VENTS');
}

function trumpLeftVents() {
    shakeScreen('horizontal', 12, 700);
    showAccessibilityText('⚠ TRUMP LEFT VENTS');
}

// 禁用浏览器默认行为，提升游戏体验
function disableBrowserDefaults() {
    // 禁用右键菜单
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    }, { capture: true });
    
    // 禁用拖拽
    document.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
    }, { capture: true });
    
    // 禁用选择文本（双击、长按等）
    document.addEventListener('selectstart', (e) => {
        e.preventDefault();
        return false;
    }, { capture: true });
    
    // 禁用复制
    document.addEventListener('copy', (e) => {
        e.preventDefault();
        return false;
    }, { capture: true });
    
    // 禁用剪切
    document.addEventListener('cut', (e) => {
        e.preventDefault();
        return false;
    }, { capture: true });
    
    // 禁用某些快捷键
    document.addEventListener('keydown', (e) => {
        // 禁用 Ctrl+A (全选)
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            return false;
        }
        // 禁用 Ctrl+C (复制)
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            return false;
        }
        // 禁用 Ctrl+X (剪切)
        if (e.ctrlKey && e.key === 'x') {
            e.preventDefault();
            return false;
        }
        // 禁用 Ctrl+S (保存)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            return false;
        }
        // 禁用 Ctrl+P (打印)
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            return false;
        }
        // 禁用 Ctrl+U (查看源代码)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
    }, { capture: true });
    
    // 禁用触摸设备的长按菜单
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false, capture: true });
    
    // 禁用双指缩放
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false, capture: true });
    
    // 阻止鼠标选择文本
    document.addEventListener('mousedown', (e) => {
        // 允许按钮点击
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return true;
        }

        // 阻止其他元素的鼠标按下（防止拖拽选择）
        if (e.detail > 1) {
            e.preventDefault();
            return false;
        }
    }, { capture: true });
}

// 更新预加载进度
function updatePreloadProgress(progress) {
    const progressBar = document.getElementById('progress-bar');
    const percentage = document.getElementById('preloader-percentage');
    
    if (progressBar && percentage) {
        progressBar.style.width = progress + '%';
        percentage.textContent = Math.round(progress) + '%';
    }
}

// 预加载所有游戏资源
async function preloadGameAssets() {
    const basePath = window.location.pathname.includes('/FNAE-HTML5-1.2.2-fix/') 
        ? '/FNAE-HTML5-1.2.2-fix/' 
        : './';
    
    // 定义所有需要预加载的资源
    const imagePaths = [
        'assets/images/original.png',
        'assets/images/Cam1.png',
        'assets/images/Cam2.png',
        'assets/images/Cam3.png',
        'assets/images/Cam4.png',
        'assets/images/Cam5.png',
        'assets/images/Cam6.png',
        'assets/images/Cam7.png',
        'assets/images/Cam8.png',
        'assets/images/Cam9.png',
        'assets/images/Cam10.png',
        'assets/images/Cam11.png',
        'assets/images/jump.png',
        'assets/images/menubackground.png',
        'assets/images/cutscene.png',
        'assets/images/fa3.png',
        'assets/images/FNAE-Map-layout.png',
        'assets/images/enemyep1.png',
        'assets/images/ep1.png',
        'assets/images/ep4.png',
        'assets/images/enemyep4.png',
        'assets/images/scaryhawk.png',
        'assets/images/scaryep.png',
        'assets/images/scarytrump.png',
        'assets/images/winscreen.png',
        'assets/images/goldenstephen.png'
    ];
    
    const soundPaths = [
        'assets/sounds/music.ogg',
        'assets/sounds/music3.ogg',
        'assets/sounds/Static_sound.ogg',
        'assets/sounds/vents.ogg',
        'assets/sounds/jumpcare.ogg',
        'assets/sounds/Blip.ogg',
        'assets/sounds/winmusic.ogg',
        'assets/sounds/chimes.ogg',
        'assets/sounds/Crank1.ogg',
        'assets/sounds/Crank2.ogg',
        'assets/sounds/goldenstephenscare.ogg'
    ];
    
    totalAssets = imagePaths.length + soundPaths.length;
    loadedAssets = 0;
    
    // 预加载图片
    const imagePromises = imagePaths.map(path => {
        return new Promise((resolve) => {
            const img = new Image();

            img.onload = () => {
                loadedAssets++;
                updatePreloadProgress((loadedAssets / totalAssets) * 100);
                resolve();
            };

            img.onerror = () => {
                console.warn(`Failed to load image: ${path}`);
                loadedAssets++;
                updatePreloadProgress((loadedAssets / totalAssets) * 100);
                resolve();
            };

            img.src = basePath + path;
        });
    });
    
    // 预加载音频
    const audioPromises = soundPaths.map(path => {
        return new Promise((resolve) => {
            const audio = new Audio();

            audio.addEventListener('canplaythrough', () => {
                loadedAssets++;
                updatePreloadProgress((loadedAssets / totalAssets) * 100);
                resolve();
            }, { once: true });

            audio.addEventListener('error', () => {
                console.warn(`Failed to load audio: ${path}`);
                loadedAssets++;
                updatePreloadProgress((loadedAssets / totalAssets) * 100);
                resolve();
            }, { once: true });

            audio.src = basePath + path;
            audio.load();
        });
    });
    
    // 等待所有资源加载完成
    await Promise.all([...imagePromises, ...audioPromises]);
    
    updatePreloadProgress(100);

    await new Promise(resolve => setTimeout(resolve, 500));
}

// 隐藏预加载动画
function hidePreloader() {
    const preloader = document.getElementById('preloader');

    if (preloader) {
        preloader.classList.add('fade-out');

        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
}

// 页面加载完成后启动
window.addEventListener('DOMContentLoaded', async () => {
    disableBrowserDefaults();
    
    await preloadGameAssets();
    
    preloadBackgrounds();
    
    hidePreloader();
    
    game = new Game();
    staticNoise = new StaticNoise();
    
    game.updateContinueButton();
    
    const mainMenu = document.getElementById('main-menu');
    
    const urlParams = new URLSearchParams(window.location.search);
    const autostart = urlParams.get('autostart');
    
    const menuMusic = document.getElementById('menu-music');

    if (menuMusic) {
        menuMusic.volume = 0.5;
        
        if (autostart === '1') {
            menuMusic.play().catch(() => {
                setupManualPlayback();
            });
        } else {
            setupManualPlayback();
        }
        
        function setupManualPlayback() {
            const playMusic = () => {
                if (mainMenu && !mainMenu.classList.contains('hidden')) {
                    menuMusic.play().catch(() => {});
                }

                document.removeEventListener('click', playMusic);
                document.removeEventListener('keydown', playMusic);
            };
            
            document.addEventListener('click', playMusic);
            document.addEventListener('keydown', playMusic);
        }
    }
    
    // 监听主菜单显示/隐藏
    const observer = new MutationObserver(() => {
        if (mainMenu && !mainMenu.classList.contains('hidden')) {
            startScaryFaceFlicker();
            staticNoise.start();
        } else {
            stopScaryFaceFlicker();
            staticNoise.stop();
        }
    });
    
    if (mainMenu) {
        observer.observe(mainMenu, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        if (!mainMenu.classList.contains('hidden')) {
            startScaryFaceFlicker();
            staticNoise.start();
        }
    }

    // =========================
    // DEMO ACCESSIBILITY TEST
    // Remove these after testing
    // =========================

    // Press V = Trump enters vents
    // Press B = Trump leaves vents

// =========================
// Accessibility text alerts
// =========================

function showAccessibilityText(message) {
    let box = document.getElementById('accessibility-alert');

    if (!box) {
        box = document.createElement('div');
        box.id = 'accessibility-alert';

        box.style.position = 'fixed';
        box.style.top = '20px';
        box.style.left = '50%';
        box.style.transform = 'translateX(-50%)';

        box.style.background = 'rgba(0,0,0,0.85)';
        box.style.color = 'white';

        box.style.padding = '16px 28px';
        box.style.fontSize = '32px';
        box.style.fontWeight = 'bold';

        box.style.border = '3px solid red';
        box.style.borderRadius = '12px';

        box.style.zIndex = '999999';
        box.style.pointerEvents = 'none';

        document.body.appendChild(box);
    }

    box.textContent = message;
    box.style.display = 'block';

    clearTimeout(box.hideTimeout);

    box.hideTimeout = setTimeout(() => {
        box.style.display = 'none';
    }, 2500);
}

// Detect sounds being played
const originalPlay = HTMLAudioElement.prototype.play;

HTMLAudioElement.prototype.play = function(...args) {

    const src = this.src || "";

    console.log("PLAYING SOUND:", src);

    if (src.includes("vent-crawling.mp3")) {
        showAccessibilityText("⚠ TRUMP IN VENTS");
    }

    return originalPlay.apply(this, args);
};

});
// 监听来自父页面的消息（iframe 通信）
window.addEventListener('message', (event) => {
    if (event.data.type === 'USER_CLICKED_PLAY') {
        const menuMusic = document.getElementById('menu-music');

        if (menuMusic) {
            menuMusic.volume = 0.5;

            menuMusic.play().catch(() => {
                // 播放失败时忽略
            });
        }
    }
});