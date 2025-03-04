const express = require("express");
const Bus = require("../models/bus");
const protect = require("../middleware/authMiddleware");
const Reservation = require("../models/reservation");
const User = require("../models/person");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Add a new bus (protected route)
router.post("/addbus",  async (req, res) => {
  try {
    const {
      busName,
      busNo,
      busType,
      routeFrom, // Changed routeForm to routeFrom
      routeTo,
      arrivalTime,
      departureTime,
      fare,
      availableSeats,
      date,
    } = req.body;

    // Basic input validation (add more as needed)
    if (!busName || !busNo || !routeFrom || !routeTo || !fare || !availableSeats) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBus = new Bus({
      busName,
      busNo,
      busType,
      routeFrom,
      routeTo,
      arrivalTime,
      departureTime,
      fare,
      availableSeats,
      date,
    });

    await newBus.save();

    res.status(201).json({ message: "Bus added successfully" });
    if(res.status(201)){
      console.log("successofully")
    }
  } catch (error) {
    console.error("Error adding bus:", error); // Use a proper logging library in production
    res.status(500).json({ message: "Failed to add bus", error: error.message });
  }
});

// Get all buses
router.get("/buses", async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (error) {
    console.error("Error getting buses:", error); 
    res.status(500).json({ message: "Failed to get buses", error: error.message });
  }
});

router.get("/viewAllBus", async (req, res) => {
  try {
      console.log("find bus")
      const buses = await Bus.find();
      res.json(buses);
  } catch (error) {
      console.error("Error getting buses:", error);
      res.status(500).json({ message: "Failed to get buses", error: error.message });
  }
});


//booking

router.post("/reservation/:busId", async (req, res) => {
  try {
      console.log("reservation");
      console.log(req.body);
      // const { busId } = req.body;
      // console.log(busId);
      // Assuming user ID is passed in the body or headers, not query params
      const { reservationDate, source, destination ,busId} = req.body;

      // const user = await User.findById(userId);
      // if (!user) {
      //     return res.status(404).json({ message: "User not found" });
      // }

      const bus = await Bus.findById(busId);
      if (!bus) {
          return res.status(404).json({ message: "Bus not found" });
      }

      if (bus.availableSeats <= 0) {
          return res.status(400).json({ message: "No seats available" });
      }

      const newReservation = new Reservation({
          
          busId,
          reservationDate,
          source,
          destination,
      });

      await newReservation.save();

      bus.availableSeats -= 1;
      await bus.save();

      res.status(201).json({
          message: "Ticket booked successfully",
          reservationId: newReservation._id,
      });
  } catch (error) {
      console.error("Error booking ticket:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
      console.log(error)
  }
});

router.put("/updateBus/:id", protect, async (req, res) => {
  try {
      const { id } = req.params;
      const updatedBus = await Bus.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedBus) {
          return res.status(404).json({ message: "Bus not found" });
      }
      res.json(updatedBus);
  } catch (error) {
      console.error("Error updating bus:", error);
      res.status(500).json({ message: "Failed to update bus", error: error.message });
  }
});


module.exports = router;