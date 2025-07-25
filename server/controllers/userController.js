import sql from "../configs/db.js";


export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const creations = await sql`
      SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.status(200).json({
      success: true,
      creations,
    });
  } catch (error) {
    console.error("Error fetching user creations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user creations",
      error: error.message,
    });
  }
}

export const getPublicCreations = async (req, res) => {
  try {
    const creations = await sql`
      SELECT id, user_id, prompt, content, likes, created_at
      FROM creations
      WHERE publish = true
      ORDER BY created_at DESC
    `;

    res.status(200).json({
      success: true,
      creations,
    });
  } catch (error) {
    console.error("Error fetching public creations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch public creations",
      error: error.message,
    });
  }
};


export const toggleLikeCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await sql`
      SELECT * FROM creations WHERE id = ${id}
    `;

    if (!creation) {
      return res.status(400).json({
        success: false,
        message: "Failed to find creation",
      });
    }

    let currentLikes = creation.likes;
    if (!Array.isArray(currentLikes)) {
      currentLikes = [];
    }

    const userIdStr = userId.toString();

    let updatedLikes;
    let message;
    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((user) => user !== userIdStr);
      message = "Creation unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation liked";
    }

    // ✅ No need for sql.raw — pass array directly
    await sql`
      UPDATE creations
      SET likes = ${updatedLikes}::text[]
      WHERE id = ${id}
    `;

    res.status(200).json({
      success: true,
      message,
      likes: updatedLikes,
    });
  } catch (error) {
    console.error("Error toggling like on creation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle like on creation",
      error: error.message,
    });
  }
};
