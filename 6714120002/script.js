const API_KEY = 'KEY_HERE'; 
let currentCountry = 'th';
let allArticles = [];

const loadBtn = document.getElementById('loadNewsBtn');
const moreNewsBtn = document.getElementById('moreNewsBtn');
const newsList = document.getElementById('newsList');
const loader = document.getElementById('loader');
const tabs = document.querySelectorAll('.tab-btn');

// ฟังก์ชันหลักดึงข้อมูล
async function getNews(country) {
    try {
        loader.classList.remove('hidden');
        newsList.innerHTML = '';
        moreNewsBtn.classList.add('hidden');
        
        const url = `https://gnews.io/api/v4/top-headlines?country=${country}&max=10&apikey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            allArticles = data.articles;
            // แสดงเฉพาะ 5 ข่าวแรกในรูปแบบ Grid 3-2
            displayArticles(allArticles.slice(0, 5));
            
            if (allArticles.length > 5) {
                moreNewsBtn.classList.remove('hidden');
            }
        } else {
            newsList.innerHTML = `<div class="empty-state">ไม่พบข่าวในขณะนี้ กรุณาลองใหม่ภายหลัง</div>`;
        }
    } catch (error) {
        newsList.innerHTML = `<div class="empty-state" style="color:red">ขออภัย เกิดข้อผิดพลาด: ${error.message}</div>`;
    } finally {
        loader.classList.add('hidden');
    }
}

function displayArticles(articles) {
    articles.forEach(article => {
        const li = document.createElement('li');
        li.className = 'news-item';
        const dateObj = new Date(article.publishedAt);
        const formattedDate = dateObj.toLocaleDateString('th-TH', { 
            day: 'numeric', 
            month: 'long',
            year: 'numeric' 
        });

        li.innerHTML = `
            <img src="${article.image || 'https://via.placeholder.com/800x450?text=No+Image'}" alt="news">
            <div class="news-content">
                <h3>${article.title}</h3>
                <p class="description">${article.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
                <div class="meta-info">
                    <span class="source-tag">${article.source.name}</span>
                    <span>${formattedDate}</span>
                </div>
                <a href="${article.url}" target="_blank" class="read-more-btn">อ่านบทความเต็ม →</a>
            </div>
        `;
        newsList.appendChild(li);
    });
}

// ระบบสลับประเทศ (เปลี่ยนค่า currentCountry และรอการกดปุ่มโหลด)
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCountry = tab.getAttribute('data-country');
        // เคลียร์หน้าจอเพื่อให้ผู้ใช้กดปุ่มโหลดใหม่
        newsList.innerHTML = `<div class="empty-state">เปลี่ยนประเทศเป็น ${tab.innerText} แล้ว กด "โหลดข่าวล่าสุด" เพื่ออัปเดต</div>`;
        moreNewsBtn.classList.add('hidden');
    });
});

// กดปุ่มเพื่อโหลดข่าว (ตามโจทย์)
loadBtn.addEventListener('click', () => getNews(currentCountry));

// โหลดเพิ่ม (อันดับ 6-10)
moreNewsBtn.addEventListener('click', () => {
    displayArticles(allArticles.slice(5));
    moreNewsBtn.classList.add('hidden');
});

// หมายเหตุ: บรรทัด getNews(currentCountry); ถูกลบออกเพื่อให้เป็นไปตามโจทย์ที่ต้องกดปุ่มก่อน
