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

    let busDetails = []; // Initialize busDetails here

    searchTicketForm.addEventListener("submit", function (event) {
        event.preventDefault();
        displayBus(busDetails); // Pass busDetails to displayBus
    });
});

async function displayBus(busDetails) {
    console.log("Form submitted");

    let fromCity = document.getElementById("formCity").value.trim();
    let toCity = document.getElementById("toCity").value.trim();
    let departureDate = document.getElementById("departue-date").value.trim();
    console.log(fromCity, toCity, departureDate);

    // Input Validation
    if (!fromCity || !toCity || !departureDate) {
        alert("Please fill in all required fields.");
        return;
    }

    console.log("Fetching bus details..");

    try {
        console.log("Fetching bus details...");
        console.log("Fetching buses...");
        fetch(`http://localhost:5000/api/admin/viewAllBus`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                console.log("Response OK");
                return response.json();
            }
            return response.json();
        })
        .then((data) => {
            console.log("Buses fetched:", data);
            console.log(data.busName,data.busType,data.routeFrom,data.routeTo,data.departureTime,data.arrivalTime,data.price,data.seats)
        })
        console.log(data)
        console.log("Buses fetched:", data);
        console.log(data.busName,data.busType,data.routeFrom,data.routeTo,data.departureTime,data.arrivalTime,data.price,data.seats)

        console.log(fromCity, toCity, departureDate);

        console.log(fromCity, toCity, departureDate);
        console.log("Before checkBusDetails");

        checkBusDetails(data, fromCity, toCity, departureDate, busDetails);
        console.log("After checkBusDetails");

    } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to fetch bus details. Please try again.");
    }
}

function checkBusDetails(data, fromCity, toCity, departureDate, busDetails) {
    console.log("Checking bus details...");
    busDetails.length = 0; // Clear the busDetails array before adding new data.
    data.forEach((element) => {
        if (element.routeFrom === fromCity && element.routeTo === toCity) {
            busDetails.push(element);
        }
    });

    if (busDetails.length === 0) {
        alert(
            "Dear Customer, there is no bus available from " +
                fromCity +
                " to " +
                toCity
        );
        window.location.reload();
        return;
    }

    createBusDetails(busDetails, departureDate);
}

function createBusDetails(busDetails, departureDate) {
    console.log("createbusdetails");
    console.log(busDetails);
    console.log(departureDate);
    console.log(fetchedBusContainer);

    if (fetchedBusContainer) {
        console.log("Element with ID 'fetched-bus-container' found.");
        fetchedBusContainer.innerHTML = ""; // Clear the fetchedBusContainer before adding new buses.
        busDetails.forEach((bus) => { //Use bus as the parameter.
            fetchedBusContainer.appendChild(createBusDiv(bus, departureDate));
            console.log("Bus details created");
        });
    } else {
        console.log("Element with ID 'fetched-bus-container' not found.");
    }
}

function createBusDiv(bus, departureDate) {
    let busDetailsContainer = document.createElement("div");
    busDetailsContainer.classList.add("bus-details-contaner");

    // ... (rest of the createBusDiv function remains the same)

    let bookButton = document.createElement("button");
    bookButton.id = "book-ticket";
    bookButton.innerText = "Book";

    bookButton.addEventListener("click", () => {
        bookTicket(bus, departureDate);
    });

    // ... (rest of the createBusDiv function remains the same)

    return busDetailsContainer;
}

async function bookTicket(bus, departureDate) {
    const currUser = JSON.parse(localStorage.getItem("uuid"));
    const currBus = bus.busId;
    const bookApi = `http://localhost:5000/reservation/add/${currBus}?key=${currUser}`;

    let bodyToSend = {
        reservationDate: departureDate,
        source: bus.routeFrom,
        destination: bus.routeTo,
    };

    try {
        const response = await fetch(bookApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyToSend),
        });

        const data = await response.json();

        if (response.ok) {
            alert(
                "Ticket Booked Successfully!\nYour Ticket Id is " +
                    data.reservationId
            );
            window.location.href = "http://127.0.0.1:5500/index.html";
        } else {
            alert(`Error: ${data.message || "Failed to book ticket"}`);
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("An error occurred. Please try again.");
    }
}