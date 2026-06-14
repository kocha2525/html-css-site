// 読み込むセクションファイル
const sectionFiles = [
    "sections/html.html",
    "sections/css.html",
    "sections/selector.html",
    "sections/properties.html",
    "sections/box.html",
    "sections/display.html",
    "sections/flex.html",
    "sections/float.html",
];

const content = document.getElementById("content");
const toc = document.getElementById("toc");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// ===========================
// セクション読み込み
// ===========================
async function loadSections() {
    for (let file of sectionFiles) {
        const res = await fetch(file);
        const html = await res.text();

        const div = document.createElement("div");
        div.classList.add("section");
        div.innerHTML = html;

        content.appendChild(div);
    }
    generateTOC();
}

loadSections();

// ===========================
// 目次生成
// ===========================
function generateTOC() {
    const sections = document.querySelectorAll(".section h2");
    toc.innerHTML = "";

    sections.forEach((sec, i) => {
        const id = "section-" + i;
        sec.id = id;

        const link = document.createElement("a");
        link.href = "#" + id;
        link.textContent = sec.textContent;

        toc.appendChild(link);
    });
}

// ===========================
// ハイライト削除
// ===========================
function clearHighlights() {
    document.querySelectorAll("mark").forEach(mark => {
        const text = document.createTextNode(mark.textContent);
        mark.parentNode.replaceChild(text, mark);
    });
}

// ===========================
// ハイライト（安全版）
// ===========================
function highlightText(root, keyword) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const regex = new RegExp(keyword, "gi");

    let node;
    while ((node = walker.nextNode())) {
        if (regex.test(node.nodeValue)) {
            const parts = node.nodeValue.split(regex);
            const frag = document.createDocumentFragment();

            parts.forEach((part, i) => {
                frag.appendChild(document.createTextNode(part));
                if (i < parts.length - 1) {
                    const mark = document.createElement("mark");
                    mark.textContent = keyword;
                    frag.appendChild(mark);
                }
            });

            node.parentNode.replaceChild(frag, node);
        }
    }
}

// ===========================
// 最初のハイライトへスクロール（1回だけ）
// ===========================
function scrollToFirstHighlight() {
    const first = document.querySelector("mark");
    if (first) {
        first.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}

// ===========================
// 検索
// ===========================
searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim();
    searchResults.innerHTML = "";

    clearHighlights();
    if (!keyword) return;

    const sections = document.querySelectorAll(".section");

    sections.forEach(sec => {
        if (sec.textContent.includes(keyword)) {

            highlightText(sec, keyword);

            const id = sec.querySelector("h2").id;

            const card = document.createElement("div");
            card.classList.add("result-card");
            card.style.cursor = "pointer";

            card.innerHTML = `
                <h4>${sec.querySelector("h2").textContent}</h4>
                <p>${sec.textContent.substring(0, 120)}...</p>
            `;

            // ★ 直接キーワードへ飛ぶ（ズレない）
            card.addEventListener("click", () => {
                const first = sec.querySelector("mark");

                if (first) {
                    first.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            });

            searchResults.appendChild(card);
        }
    });
});

// ===========================
// ダークモード切り替え
// ===========================
document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// ===========================
// サイドバー開閉
// ===========================
const sidebar = document.getElementById("sidebar");
document.getElementById("toggleSidebar").addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

// ===========================
// トップに戻るボタン
// ===========================
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 300 ? "block" : "none";
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// ===========================
// 検索欄に戻るボタン
// ===========================
const backToSearch = document.getElementById("backToSearch");

window.addEventListener("scroll", () => {
    backToSearch.style.display = window.scrollY > 400 ? "block" : "none";
});

backToSearch.addEventListener("click", () => {
    searchInput.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});
