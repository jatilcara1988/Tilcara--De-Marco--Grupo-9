const themeSaved = localStorage.getItem("tema");
const logoImage = document.getElementById("logoImage");
const pageIcon = document.getElementById("pageIcon");
const themeBtn = document.getElementById("themeBtn");

function updateLogoImage(isDarkMode) {
    if (logoImage) {
        logoImage.src = isDarkMode ? "/favicon2.jpg" : "/favicon1.jpg";
    }
    if (pageIcon) {
        pageIcon.href = isDarkMode ? "/favicon2.jpg" : "/favicon1.jpg";
    }
    if (themeBtn) {
        themeBtn.textContent = isDarkMode ? "🌙" : "☀️";
    }
}

if(themeSaved === "dark"){
    document.body.classList.add("dark");
    updateLogoImage(true);
} else {
    updateLogoImage(false);
}

if(themeBtn){
    themeBtn.addEventListener("click",()=>{
        console.log("Change theme:", document.body.classList.contains("dark") ? "light" : "dark");
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("tema", isDark ? "dark" : "light");
        updateLogoImage(isDark);
    });
}