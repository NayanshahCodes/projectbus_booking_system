document.addEventListener("DOMContentLoaded", function () {
    let searchTicketForm = document.getElementById("search-ticket-form");
    let fetchedBusContainer = document.getElementById("fetched-bus-container");
    let bookHeading = document.getElementById("book-heading");

    if (fetchedBusContainer) {
        console.log("Element with ID 'fetched-bus-container' found.");
    } else {
        console.error("Element with ID 'fetched-bus-container' not found.");
    }

    if (bookHeading) {
        bookHeading.style.display = "none";
        console.log("Element with ID 'book-heading' found.");
    } else {
        console.error("Element with ID 'book-heading' not found.");
    }

    let busDetails = []; // Initialize busDetails

    searchTicketForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        await displayBus(busDetails); // Pass busDetails to displayBus
    });
});

async function displayBus(busDetails) {
    console.log("Form submitted");

    let fromCity = document.getElementById("formCity").value.trim();
    let toCity = document.getElementById("toCity").value.trim();
    let departureDate = document.getElementById("departue-date").value.trim();
    
    console.log("From:", fromCity, "To:", toCity, "Date:", departureDate);

    // Input Validation
    if (!fromCity || !toCity || !departureDate) {
        alert("Please fill in all required fields.");
        return;
    }

    console.log("Fetching bus details...");

    try {
        let response = await fetch(`http://localhost:5000/api/admin/viewAllBus`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json(); // Await response JSON
        console.log("Buses fetched:", data);

        // Ensure 'data' is an array
        if (!Array.isArray(data)) {
            console.error("Invalid data format. Expected an array.");
            return;
        }

        // Log each bus's details
        data.forEach(bus => {
            console.log(`Bus: ${bus.busName}, Type: ${bus.busType}, From: ${bus.routeFrom}, To: ${bus.routeTo}, Departure: ${bus.departureTime}, Arrival: ${bus.arrivalTime},Date:${bus.date} Price: ${bus.fare}, Seats: ${bus.availableSeats},id=${bus._id}`);
        });

        // Check available buses
        checkBusDetails(data, fromCity, toCity, departureDate, busDetails);

    } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to fetch bus details. Please try again.");
    }
}

function checkBusDetails(data, fromCity, toCity, departureDate, busDetails) {
    console.log("Checking bus details...");

    // Clear previous bus details
    busDetails.length = 0;

    data.forEach((bus) => {
        if (bus.routeFrom === fromCity && bus.routeTo === toCity) {
            busDetails.push(bus);
        }
    });

    if (busDetails.length === 0) {
        alert(`No bus available from ${fromCity} to ${toCity}`);
        return;
    }

    createBusDetails(busDetails, departureDate);
}

function createBusDetails(busDetails, departureDate) {
    console.log("Creating bus details...");
    let fetchedBusContainer = document.getElementById("fetched-bus-container");

    if (fetchedBusContainer) {
        fetchedBusContainer.innerHTML = ""; // Clear previous results

        busDetails.forEach((bus) => {
            fetchedBusContainer.appendChild(createBusDiv(bus, departureDate));
        });

        console.log("Bus details displayed successfully.");
    } else {
        console.error("Element 'fetched-bus-container' not found.");
    }
}

function createBusDiv(bus, departureDate) {
    let busDetailsContainer = document.createElement("div");
    busDetailsContainer.classList.add("bus-details-container");

    let busInfo = `
        <p><strong>Bus Name:</strong> ${bus.busName}</p>
        <p><strong>Bus Type:</strong> ${bus.busType}</p>
        <p><strong>Route:</strong> ${bus.routeFrom} → ${bus.routeTo}</p>
        <p><strong>Departure:</strong> ${bus.departureTime}</p>
        <p><strong>Arrival:</strong> ${bus.arrivalTime}</p>
        <p><strong>Price:</strong> ${bus.fare}</p>
        <p><strong>Seats Available:</strong> ${bus.availableSeats}</p>
    `;
    busDetailsContainer.innerHTML = busInfo;

    let bookButton = document.createElement("button");
    bookButton.innerText = "Book";
    bookButton.addEventListener("click", () => bookTicket(bus, departureDate));

    busDetailsContainer.appendChild(bookButton);
    return busDetailsContainer;
}

async function bookTicket(bus, departureDate) {
    // Assuming you have the userId available in your frontend
    // Example: userId might be stored in a variable or retrieved from local storage
    // const userId = JSON.parse(localStorage.getItem("userId")); // Example retrieval

    const currBus = bus._id;
    console.log("inside booking");
    // console.log(userId, currBus);

    // const bookApi = `http://localhost:5000/api/admin/reservation/${currBus}`;

    let bodyToSend = {
        // userId: userId, // Include userId in the body
        reservationDate: departureDate,
        source: bus.routeFrom,
        destination: bus.routeTo,
        busId: currBus
    };

    try {
        console.log("hello")
        const response = await fetch(`http://localhost:5000/api/admin/reservation/${currBus}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyToSend),
        });
        console.log("hello")
        if (!response.ok) {
            const text = await response.text();
            console.error("Server response was not OK:", text);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            alert(`Ticket Booked Successfully! Your Ticket Id is ${data.reservationId}`);
            window.location.href = "index.html";
        } else {
            alert(`Error: ${data.message || "Failed to book ticket"}`);
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("An error occurred. Please try again.");
        console.log("Ticket booking failed.",error)
    }
}