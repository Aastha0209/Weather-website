const newsApiKey = "35b3171387ea4fb998394f0cf7a96c5c"; // Your NewsAPI key

window.addEventListener("load", fetchNews);

async function fetchNews() {
    const url = `https://newsapi.org/v2/everything?q=weather&sortBy=publishedAt&language=en&apiKey=${newsApiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error fetching news");

        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        document.getElementById("news-feed").textContent = "Error loading news";
    }
}

function displayNews(articles) {
    const newsFeed = document.getElementById("news-feed");
    newsFeed.innerHTML = "";
    
    articles.slice(0, 10).forEach(article => {
        const newsItem = document.createElement("div");
        newsItem.classList.add("news-item");
        newsItem.innerHTML = `
            <img src="${article.urlToImage || 'placeholder.jpg'}" alt="News Image">
            <h3>${article.title}</h3>
            <p>${article.description || "No description available."}</p>
            <a href="${article.url}" target="_blank">Read More</a>
        `;
        newsFeed.appendChild(newsItem);
    });
}

