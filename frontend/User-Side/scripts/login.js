let account = document.getElementById("account");
let profileImg = document.getElementById("profileImg");
let logout = document.getElementById("logout");
let username = JSON.parse(localStorage.getItem("username")) || null;
let uuid = JSON.parse(localStorage.getItem("uuid")) || null;

function updateAccountView() {
    if (!username || !uuid) {
        account.innerText = "LogIn";
        account.style.cssText = "border-radius: 5px; padding: 4px; background-color: #0E9E4D; color: white;";
        account.href = "login.html";
        profileImg.style.display = "none";
        logout.style.display = "none";
    } else {
        account.innerText = username.split(" ")[0].toUpperCase();
        account.style.cssText = ""; // Reset styles
        profileImg.style.display = "block";
        logout.style.display = "block";

        // Fetch user profile when account button is clicked
        account.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default link behavior
            fetchUserProfile(uuid);
        });
    }
}

async function fetchUserProfile(uuid) {
    let url = `http://localhost:5000/api/users/profile?key=${uuid}`; // Replace with your actual API endpoint

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Profile Data:", data);

        // Display the profile data (you'll need to customize this part)
        displayProfile(data);

    } catch (error) {
        showToast("Network Error. Please try again.");
        console.error("Error fetching profile data:", error);
    }
}

function displayProfile(profileData) {
    // Customize this function to display the profile data as needed
    // Example:
    alert(`
        User ID: ${profileData.userId}
        Email: ${profileData.email}
        // Add other profile details here
    `);
}

// Call updateAccountView on page load
updateAccountView();

function logoutUser() {
    if (!uuid) {
        showToast("Please Login First");
    } else {
        let url = `http://localhost:5000/user/logout?key=${uuid}`; // Replace with your actual logout API endpoint
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
                showToast("User LogOut Successful!!");
                localStorage.removeItem("username");
                localStorage.removeItem("uuid");
                username = null;
                uuid = null;
                updateAccountView();
            })
            .catch((error) => {
                console.error("Error during logout:", error);
                showToast("Logout failed. Please try again.");
            });
    }
}