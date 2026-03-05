
// Dark Mode Toggle

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  document.getElementById("darkMode").textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
}
// SHOW / HIDE NAV BUTTONS

function updateNavbar() {
  const loggedIn = localStorage.getItem("token");

  if (loggedIn) {
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("signupBtn").style.display = "none";
    document.getElementById("logoutBtn").style.display = "block";
  } else {
    document.getElementById("loginBtn").style.display = "block";
    document.getElementById("signupBtn").style.display = "block";
    document.getElementById("logoutBtn").style.display = "none";
  }
}
// OPEN / CLOSE MODALS
function openModal(type) {
  document.getElementById(type + "Modal").style.display = "block";
}

function closeModal(type) {
  document.getElementById(type + "Modal").style.display = "none";
}

window.onclick = function (event) {
  if (event.target.className === "modal") {
    event.target.style.display = "none";
  }
};
// SIGNUP FUNCTION
function signupUser() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!name || !email || !password) {
    alert("Please fill all fields!");
    return;
  }
  const user = {
    name,
    email,
    password,
  };

  // save user details in localStorage
  localStorage.setItem("user", JSON.stringify(user));
  alert("Signup Successful!");
  closeModal("signup");
}

// LOGIN FUNCTION
function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) {
    alert("No user found! Please signup first.");
    return;
  }

  if (email === storedUser.email && password === storedUser.password) {
    localStorage.setItem("token", "logged_in_token");
    alert("Login Successful!");
    closeModal("login");
    updateNavbar();
  } else {
    alert("Incorrect email or password!");
  }
}

// LOGOUT FUNCTION

function logoutUser() {
  localStorage.removeItem("token");
  updateNavbar();
  alert("Logged out successfully!");
}


// FETCH NEWS
async function fetchNews() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first to fetch news!");
    return;
  }

  const country = document.getElementById("country").value;
  const category = document.getElementById("category").value;

  const loading = document.getElementById("loading");
  const newsContainer = document.getElementById("news");
  newsContainer.innerHTML = "";
  loading.style.display = "block";

  try {
    const res = await fetch(
      `https://newsdata.io/api/1/latest?apikey=pub_610c959324104ecd8d62a50f1a24fd99&country=${country}&category=${category}&language=en`
    );
    const data = await res.json();
    loading.style.display = "none";

    if (!data.results || data.results.length === 0) {
      newsContainer.innerHTML = "<p>No news found.</p>";
      return;
    }

    data.results.forEach((article) => {
      const card = document.createElement("div");
      card.className = "news-card";
      card.innerHTML = `
        <img src="${article.image_url ||
        "https://via.placeholder.com/400x200?text=No+Image"
        }" alt="News Image">
        <div class="content">
          <p>${article.title}</p>
          <a href="${article.link}" target="_blank">Read more →</a>
        </div>
      `;
      newsContainer.appendChild(card);
    });
  } catch (err) {
    loading.style.display = "none";
    newsContainer.innerHTML = "<p>Error fetching news.</p>";
    console.error(err);
  }
}
// RUN AT PAGE LOAD
updateNavbar();
