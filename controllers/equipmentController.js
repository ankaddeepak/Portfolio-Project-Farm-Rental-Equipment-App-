import Equipment from "../models/equipmentModel.js";

// Add new equipment
export const addEquipment = async (req, res) => {
  try {
    const { name, image, description, pricePerAcre, available } = req.body;

    const newEquipment = new Equipment({
      name,
      image,
      description,
      pricePerAcre,
      available,
    //   owner: req.user.id, // assuming you're using authentication middleware
    });

    const savedEquipment = await newEquipment.save();
    res.status(201).json(savedEquipment);
  } catch (error) {
    res.status(500).json({ message: "Failed to add equipment", error });
  }
};

// Get all equipment
export const getAllEquipment = async (req, res) => {
  try {
    // const equipmentList = await Equipment.find().populate("owner", "name email");
    // res.status(200).json(equipmentList);
    const equipmentList = await Equipment.find(); // remove .populate for now
    res.status(200).json(equipmentList);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch equipment", error });
  }
};

// Get single equipment by ID
export const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate("owner", "name email");

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.status(200).json(equipment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching equipment", error });
  }
};
