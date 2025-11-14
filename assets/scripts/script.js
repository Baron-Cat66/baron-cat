assets/scripts/script.js
document.addEventListener("DOMContentLoaded", () => {
    const playBtn = document.getElementById('playBtn');
    const stopBtn = document.getElementById('stopBtn');
    const bgm = document.getElementById('bgm');
    const rightNews = document.getElementById('rightNews');

    // プレイボタンのクリック
    playBtn.addEventListener('click', () => {
        bgm.play();  // 再生開始
        playBtn.style.display = 'none';   // プレイボタン非表示
        stopBtn.style.display = 'block';  // ストップボタン表示
    });

    // ストップボタンのクリック
    stopBtn.addEventListener('click', () => {
        bgm.pause();  // 停止
        bgm.currentTime = 0;  // 最初から
        stopBtn.style.display = 'none';  // ストップボタン非表示
        playBtn.style.display = 'block';  // プレイボタン表示
    });

    // noteの最新記事を取得して右カラムに表示
    async function loadNoteArticles() {
        const url = "https://note.com/baron_cat/rss";
        const response = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent(url));
        const data = await response.json();

        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");

        const items = xml.querySelectorAll("item");
        const container = document.getElementById("rightNews");

        items.forEach((item, index) => {
            if (index >= 3) return;   // 最新3件のみ

            const title = item.querySelector("title")?.textContent || "";
            const link = item.querySelector("link")?.textContent || "";

            // サムネ（enclosure または description 内の img）
            let thumb = "";
            const enclosure = item.querySelector("enclosure");
            if (enclosure) {
                thumb = enclosure.getAttribute("url");
            } else {
                const desc = item.querySelector("description")?.textContent || "";
                const imgMatch = desc.match(/<img.*?src="(.*?)"/);
                if (imgMatch) thumb = imgMatch[1];
            }

            const html = `
                <div class="note-article">
                    <a href="${link}" target="_blank">
                        <img src="${thumb}" alt="">
                    </a>
                    <p class="note-article-title">${title}</p>
                </div>
            `;

            container.insertAdjacentHTML("beforeend", html);
        });

        // 記事が挿入された後に高さを更新
        const rightNews = document.querySelector('.right-news');
        rightNews.style.height = 'auto';  // 高さを自動調整
    }

    loadNoteArticles();
});
