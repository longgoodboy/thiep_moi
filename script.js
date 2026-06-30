const app = document.querySelector('.invite-app');
const openButtons = [document.querySelector('#openInviteBtn'), document.querySelector('#openInviteBtn2')].filter(Boolean);
const tabButtons = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('[data-panel-content]');
const bgLayer = document.querySelector('.bg-layer');
const copyAddressBtn = document.querySelector('#copyAddressBtn');
const musicBtn = document.querySelector('#musicBtn');

let activePanel = 'info';
let musicOn = false;

const panelPhotoMap = {
  info: '1',
  program: '2',
  location: '3',
  dresscode: '4',
  rsvp: '5'
};

function syncPanel(panelName) {
  const nextPanel = panels.length && document.querySelector(`[data-panel-content="${panelName}"]`) ? panelName : 'info';
  activePanel = nextPanel;
  app.dataset.activePanel = nextPanel;

  // Set which photo to show
  const photoNum = panelPhotoMap[nextPanel] || '5';
  app.dataset.photo = photoNum;

  tabButtons.forEach((button) => {
    const isActive = button.dataset.panel === nextPanel;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  panels.forEach((panel) => {
    panel.classList.toggle('active-panel', panel.dataset.panelContent === nextPanel);
  });
}

function replayOpenPulse() {
  const button = document.querySelector('.open-invite-btn');
  if (!button) return;
  button.classList.remove('open-pulse');
  void button.offsetWidth;
  button.classList.add('open-pulse');
  window.setTimeout(() => button.classList.remove('open-pulse'), 750);
}

openButtons.forEach((button) => {
  button.addEventListener('click', () => {
    app.classList.toggle('is-open');
    if (app.classList.contains('is-open')) {
      replayOpenPulse();
      syncPanel('info');
      if (window.innerWidth <= 768) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  });
});

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    app.classList.add('is-open');
    syncPanel(button.dataset.panel);
  });
});

copyAddressBtn?.addEventListener('click', async () => {
  const address = 'Hội trường Nguyễn Văn Đạo, Đại học Quốc gia Hà Nội, 144 Xuân Thủy, Cầu Giấy, Hà Nội';
  try {
    await navigator.clipboard.writeText(address);
    copyAddressBtn.textContent = 'Đã sao chép';
    setTimeout(() => {
      copyAddressBtn.textContent = 'Sao chép địa chỉ';
    }, 1400);
  } catch (err) {
    copyAddressBtn.textContent = 'Không thể sao chép';
  }
});

const bgMusic = document.getElementById('bgMusic');

function toggleMusic(forcePlay = false) {
  if (!bgMusic) return;
  
  if (forcePlay && !musicOn) {
    musicOn = true;
  } else if (!forcePlay) {
    musicOn = !musicOn;
  } else {
    return;
  }

  musicBtn?.classList.toggle('is-on', musicOn);
  if (musicBtn) musicBtn.innerHTML = `${musicOn ? '♫' : '♪'} <span>Nhạc nền</span>`;
  
  if (musicOn) {
    bgMusic.play().catch(e => console.log('Audio play blocked:', e));
  } else {
    bgMusic.pause();
  }
}

musicBtn?.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent trigger from body click
  toggleMusic();
});

// Autoplay on first user interaction (browser restriction workaround)
document.body.addEventListener('click', () => {
  if (!musicOn) {
    toggleMusic(true);
  }
}, { once: true });

if (musicBtn) musicBtn.innerHTML = '♪ <span>Nhạc nền</span>';
if (!bgLayer) console.warn('Missing bg-layer');
syncPanel(activePanel);
