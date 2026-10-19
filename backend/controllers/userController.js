import User from "../models/User.js";

export const getMyProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        location: req.user.location,
        avgRating: req.user.avgRating,
        ratingCount: req.user.ratingCount,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { name, location } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 50) {
        return res.status(400).json({
          success: false,
          message: "Name must be between 2 and 50 characters",
        });
      }

      updates.name = name.trim();
    }

    if (location !== undefined) {
      if (location === null) {
        updates.location = undefined;
      } else {
        const coordinates = location?.coordinates;

        if (
          location?.type !== "Point" ||
          !Array.isArray(coordinates) ||
          coordinates.length !== 2 ||
          !coordinates.every(
            (coordinate) =>
              typeof coordinate === "number" && Number.isFinite(coordinate)
          ) ||
          coordinates[0] < -180 ||
          coordinates[0] > 180 ||
          coordinates[1] < -90 ||
          coordinates[1] > 90
        ) {
          return res.status(400).json({
            success: false,
            message: "Location must contain valid longitude and latitude coordinates",
          });
        }

        updates.location = {
          type: "Point",
          coordinates,
        };
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide a name or location to update",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        avgRating: user.avgRating,
        ratingCount: user.ratingCount,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};