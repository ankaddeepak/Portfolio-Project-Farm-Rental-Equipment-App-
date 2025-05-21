// import Booking from "../models/bookingModel.js";
// import Equipment from "../models/equipmentModel.js";

// // Create a booking
// export const createBooking = async (req, res) => {
//   try {
//     const { equipmentId, startDate, endDate } = req.body;

//     const equipment = await Equipment.findById(equipmentId);
//     if (!equipment) {
//       return res.status(404).json({ message: 'Equipment not found' });
//     }

//     const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
//     const totalPrice = days * equipment.rentPrice;

//     const newBooking = new Booking({
//       equipment: equipmentId,
//       user: req.user._id,
//       startDate,
//       endDate,
//       totalPrice,
//     });

//     await newBooking.save();

//     res.status(201).json({ message: 'Booking successful', booking: newBooking });
//   } catch (error) {
//     res.status(500).json({ message: 'Booking failed', error: error.message });
//   }
// };

// // export const createBooking = async (req, res) => {
// //   try {
// //     const { equipmentId, startDate, endDate } = req.body;

// //     // Get equipment price
// //     const equipment = await Equipment.findById(equipmentId);
// //     if (!equipment) return res.status(404).json({ message: "Equipment not found" });

// //     const days =
// //       (new Date(endDate).getTime() - new Date(startDate).getTime()) /
// //       (1000 * 3600 * 24);
// //     const totalPrice = days * equipment.pricePerAcre;

// //     const booking = new Booking({
// //       user: req.user?.id || "6651bff0e4b2ddf19b4c02cc", // or hardcode for now
// //       equipment: equipmentId,
// //       startDate,
// //       endDate,
// //       totalPrice,
// //     });

// //     const saved = await booking.save();
// //     res.status(201).json(saved);
// //   } catch (error) {
// //     console.error("Booking Error:", error);
// //     res.status(500).json({ message: "Booking failed", error: error.message });
// //   }
// // };

// // Get all bookings
// export const getBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .populate("user", "name email")
//       .populate("equipment", "name image pricePerAcre");

//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch bookings", error });
//   }
// };

// export const getUserBookings = async (req, res) => {
//     try {
//       // Get bookings only for the logged-in user
//       const bookings = await Booking.find({ user: req.user.id })
//         .populate("equipment", "name image pricePerDay");
  
//       res.status(200).json(bookings);
//     } catch (error) {
//       console.error("Error fetching user bookings:", error);
//       res.status(500).json({ message: "Failed to fetch user bookings", error: error.message });
//     }
//   };
  


import Booking from "../models/bookingModel.js";
import Equipment from "../models/equipmentModel.js";

// 1. Booking validation and creation
export const createBooking = async (req, res) => {
  try {
    const { equipmentId, startDate, endDate, user } = req.body;

    // 1. Validate the start and end date
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "Start date must be before end date." });
    }

    // 2. Check if the equipment is available for the selected date range
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found." });
    }

    // Assuming equipment has 'bookedDates' to store unavailable dates (you can modify it based on your actual schema)
    const bookedDates = equipment.bookedDates || [];
    const isAvailable = bookedDates.every(
      (bookedDate) =>
        new Date(startDate) > new Date(bookedDate.endDate) || new Date(endDate) < new Date(bookedDate.startDate)
    );

    if (!isAvailable) {
      return res.status(400).json({ message: "Equipment is already booked for this time range." });
    }

    // 3. Create a booking record
    const newBooking = new Booking({
      equipmentId,
      userId: user._id, // assuming user ID is in the request (via JWT)
      startDate,
      endDate,
      totalPrice: equipment.pricePerDay * (new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24), // Example price calculation
    });

    await newBooking.save();

    // 4. Update equipment availability (bookedDates)
    equipment.bookedDates.push({ startDate, endDate });
    await equipment.save();

    return res.status(201).json({ message: "Booking created successfully.", booking: newBooking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Booking failed", error: error.message });
  }
};

// 2. Fetch all bookings of a user
export const getUserBookings = async (req, res) => {
    try {
      const userBookings = await Booking.find({ userId: req.user._id }).populate('equipmentId', 'name pricePerDay'); // Populating equipment details
  
      if (!userBookings || userBookings.length === 0) {
        return res.status(404).json({ message: "No bookings found for this user." });
      }
  
      return res.status(200).json({ bookings: userBookings });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
    }
  };
  
