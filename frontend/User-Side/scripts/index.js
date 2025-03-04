const moving_bus = document.querySelector("#moving-bus");

function openCustomAlert(message) {
    const customAlert = document.getElementById("customAlert");
    const customAlertMessage = document.getElementById("customAlertMessage");

    customAlertMessage.textContent = message;
    customAlert.style.display = "block";
    setTimeout(() => {
        closeCustomAlert();
        window.location.href = "http://127.0.0.1:5500/index.html";
    }, 3000);
}

function closeCustomAlert() {
    const customAlert = document.getElementById("customAlert");
    customAlert.style.display = "none";
}

window.addEventListener("scroll", toggleStickyNavbar);

const amenitiesData = [
    { icon: "fa-wifi", name: "Wifi" },
    { icon: "fa-couch", name: "Pillow" },
    { icon: "fa-bottle-water", name: "Water Bottle" },
    { icon: "fa-lightbulb", name: "Reading Lights" },
    { icon: "fa-plug", name: "Charging Point" },
    { icon: "fa-tv", name: "Central Television" },
    { icon: "fa-headset", name: "24x7 Support" },
];

function createAmenityElement(icon, name) {
    const amenityDiv = document.createElement("div");
    amenityDiv.classList.add("box");

    const amenityContent = document.createElement("div");
    amenityContent.classList.add("amenity");

    const iconElement = document.createElement("i");
    iconElement.classList.add("fas", icon);
    amenityContent.appendChild(iconElement);

    const nameElement = document.createElement("h2");
    nameElement.textContent = name;
    amenityContent.appendChild(nameElement);

    amenityDiv.appendChild(amenityContent);

    return amenityDiv;
}

function displayAmenities(startIndex) {
    const slider = document.querySelector(".slider");
    slider.innerHTML = "";

    for (let i = startIndex; i < startIndex + 6; i++) {
        const index = i % amenitiesData.length;
        const amenity = createAmenityElement(
            amenitiesData[index].icon,
            amenitiesData[index].name
        );
        slider.appendChild(amenity);
    }
}

let currentSlide = 0;
const totalBoxes = amenitiesData.length;
const sliderContainer = document.querySelector(".slider-container");

function slideToNext() {
    currentSlide = (currentSlide + 6) % totalBoxes;
    displayAmenities(currentSlide);
}

displayAmenities(currentSlide);
setInterval(slideToNext, 3000);

let account = document.getElementById("account");
// let profileImg = document.getElementById("profileImg");
let logout = document.getElementById("logout");
let username = JSON.parse(localStorage.getItem("username")) || null;
let uuid = JSON.parse(localStorage.getItem("uuid")) || null; // Retrieve uuid
console.log(uuid);

function updateAccountView() {
    if (!username || !uuid) { // Check both username and uuid
        account.innerText = "LogIn";
        account.style.cssText = "border-radius: 5px; padding: 4px; background-color: #0E9E4D; color: white;";
        account.href = "login.html";
        // profileImg.style.display = "none";
        logout.style.display = "none";
    } else {
        account.innerText = username.split(" ")[0].toUpperCase();
        account.href = "";
        account.style.cssText = "";
        // profileImg.style.display = "block";
        logout.style.display = "block";
    }
}

updateAccountView();

function logoutUser() {
    if (!uuid) {
        openCustomAlert("Please Login First");
    } else {
        let url = `http://localhost:8080/user/logout?key=${uuid}`;
        fetch(url, {
            method: "POST",
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Logout failed");
                }
            })
            .then((data) => {
                openCustomAlert("User LogOut Successful!!");
                localStorage.removeItem("username");
                localStorage.removeItem("uuid");
                username = null;
                uuid = null; // Clear uuid
                updateAccountView();
            })
            .catch((error) => {
                console.error("Error during logout:", error);
                openCustomAlert("Logout failed. Please try again.");
            });
    }
}