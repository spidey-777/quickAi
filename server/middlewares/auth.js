// Middlewaree to check user Id

export const auth = async(req, res, next) => {
     console.log("🔍 req.auth =", req.auth);
     console.log("🧪 Inside custom auth middleware");
  console.log("🔍 req.auth =", req.auth); // This should be set by Clerk

  if (!req.auth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Assuming req.auth.userId is set by the requireAuth middleware
  req.userId = req.auth.userId;
  next();
}