const accessKey = "glVNCWDZyCOHUMNTQUew0ETwJ7qYhVlCQkZinmhTdJ0"; // Your Unsplash Access Key

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const imagesContainer = document.getElementById("images-container");

let currentPage = 1;
let currentQuery = "";

searchButton.addEventListener("click", () => {
  currentQuery = searchInput.value.trim();
  if (currentQuery) {
    imagesContainer.innerHTML = ""; // Clear old images
    currentPage = 1;
    searchImages(currentQuery, currentPage);
  }
});

async function searchImages(query, page) {
  const url = `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=10&client_id=${accessKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data); // For debugging

    if (data.results && data.results.length > 0) {
      data.results.forEach(photo => {
        const imageCard = document.createElement("div");
        imageCard.classList.add("image-card");

        const img = document.createElement("img");
        img.src = photo.urls.small;
        img.alt = photo.alt_description || "No description";

        const description = document.createElement("p");
        description.textContent = photo.alt_description || "No description available";

        imageCard.appendChild(img);
        imageCard.appendChild(description);
        imagesContainer.appendChild(imageCard);
      });

      // Show Load More button
      if (!document.getElementById("load-more")) {
        const loadMoreButton = document.createElement("button");
        loadMoreButton.id = "load-more";
        loadMoreButton.textContent = "Load More";
        loadMoreButton.classList.add("load-more-btn");
        loadMoreButton.addEventListener("click", () => {
          currentPage++;
          searchImages(currentQuery, currentPage);
          if (currentPage * 10 >= 50) {
            loadMoreButton.style.display = "none"; // Hide button after 50 images
          }
        });
        document.body.appendChild(loadMoreButton);
      }

    } else {
      imagesContainer.innerHTML = `<p>No images found. Try another search.</p>`;
    }
  } catch (error) {
    console.error("Error fetching images:", error);
    imagesContainer.innerHTML = `<p>Something went wrong. Please try again.</p>`;
  }
}
