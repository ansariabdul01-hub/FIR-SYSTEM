const express = require("express");
const { body, validationResult } = require("express-validator");
const FIR = require("../models/FIR");
const auth = require("../middleware/auth");
const { generateBlockchainHash } = require("../services/blockchain");

const router = express.Router();

// @route   POST /api/fir/submit
// @desc    Submit a new FIR
// @access  Private
router.post(
  "/submit",
  auth,
  [
    body("complainantName")
      .notEmpty()
      .withMessage("Complainant name is required"),
    body("complainantPhone").notEmpty().withMessage("Phone number is required"),
    body("complainantEmail").isEmail().withMessage("Valid email is required"),
    body("incidentDate").notEmpty().withMessage("Incident date is required"),
    body("incidentLocation")
      .notEmpty()
      .withMessage("Incident location is required"),
    body("incidentDescription")
      .notEmpty()
      .withMessage("Incident description is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const firData = {
        ...req.body,
        userId: req.user._id,
        status: "pending",
      };

      const fir = new FIR(firData);
      await fir.save();

      // Generate blockchain hash
      const blockchainData = await generateBlockchainHash(fir);
      fir.blockchainHash = blockchainData.hash;
      fir.blockchainTransactionId = blockchainData.transactionId;
      await fir.save();

      res.status(201).json({
        message: "FIR submitted successfully",
        fir: {
          id: fir._id,
          blockchainHash: fir.blockchainHash,
          status: fir.status,
        },
      });
    } catch (error) {
      console.error("FIR Submit Error:", error);
      res.status(500).json({ message: "Server error while submitting FIR" });
    }
  },
);

// @route   GET /api/fir/my-firs
// @desc    Get all FIRs of logged in user
// @access  Private
router.get("/my-firs", auth, async (req, res) => {
  try {
    const firs = await FIR.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("reviewedBy", "name email");
    res.json(firs);
  } catch (error) {
    console.error("Get FIRs Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/fir/:id
// @desc    Get single FIR by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const fir = await FIR.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("reviewedBy", "name email");

    if (!fir) {
      return res.status(404).json({ message: "FIR not found" });
    }

    // Check if user owns this FIR or is an officer/admin
    if (
      fir.userId._id.toString() !== req.user._id.toString() &&
      req.user.role === "user"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(fir);
  } catch (error) {
    console.error("Get FIR Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/fir/:id/status
// @desc    Update FIR status (for officers)
// @access  Private (Officer/Admin only)
router.put("/:id/status", auth, async (req, res) => {
  try {
    if (req.user.role !== "officer" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Officer role required." });
    }

    const {
      status,
      reviewComments,
      rejectionReason,
      caseNumber,
      resolutionDetails,
    } = req.body;
    const fir = await FIR.findById(req.params.id);

    if (!fir) {
      return res.status(404).json({ message: "FIR not found" });
    }

    fir.status = status || fir.status;
    fir.reviewedBy = req.user._id;
    if (reviewComments) fir.reviewComments = reviewComments;
    if (rejectionReason) fir.rejectionReason = rejectionReason;
    if (caseNumber) fir.caseNumber = caseNumber;
    if (resolutionDetails) fir.resolutionDetails = resolutionDetails;
    if (status === "resolved" && resolutionDetails) {
      fir.finalReport = `Case ${fir.caseNumber || "N/A"} has been resolved. ${resolutionDetails}`;
    }

    await fir.save();
    res.json({ message: "FIR status updated successfully", fir });
  } catch (error) {
    console.error("Update FIR Status Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/fir/all/pending
// @desc    Get all pending FIRs (for officers)
// @access  Private (Officer/Admin only)
router.get("/all/pending", auth, async (req, res) => {
  try {
    if (req.user.role !== "officer" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const firs = await FIR.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate("userId", "name email phone");
    res.json(firs);
  } catch (error) {
    console.error("Get Pending FIRs Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/fir/all/active
// @desc    Get all active FIRs (for officers)
// @access  Private (Officer/Admin only)
router.get("/all/active", auth, async (req, res) => {
  try {
    if (req.user.role !== "officer" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const firs = await FIR.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .populate("userId", "name email phone");
    res.json(firs);
  } catch (error) {
    console.error("Get Active FIRs Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/fir/:id/report
// @desc    Generate FIR report
// @access  Private
router.get("/:id/report", auth, async (req, res) => {
  try {
    const fir = await FIR.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("reviewedBy", "name email");

    if (!fir) {
      return res.status(404).json({ message: "FIR not found" });
    }

    // Check access
    if (
      fir.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== "officer" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Generate simple text report (can be enhanced with PDF library)
    const report = `
FIR REPORT
==========

Case Number: ${fir.caseNumber || "N/A"}
Status: ${fir.status.toUpperCase()}
Date Generated: ${new Date().toLocaleString()}

COMPLAINANT INFORMATION
-----------------------
Name: ${fir.complainantName}
Phone: ${fir.complainantPhone}
Email: ${fir.complainantEmail}
Address: ${fir.complainantAddress}

INCIDENT DETAILS
----------------
Date: ${new Date(fir.incidentDate).toLocaleString()}
Location: ${fir.incidentLocation}
Description: ${fir.incidentDescription}

BLOCKCHAIN VERIFICATION
------------------------
Hash: ${fir.blockchainHash}
Transaction ID: ${fir.blockchainTransactionId || "N/A"}

${
  fir.status === "resolved"
    ? `
RESOLUTION
----------
${fir.resolutionDetails || "N/A"}
`
    : ""
}

${
  fir.reviewComments
    ? `
OFFICER COMMENTS
----------------
${fir.reviewComments}
`
    : ""
}

This report is digitally signed and verified on the blockchain.
Report ID: ${fir._id}
`;

    res.setHeader("Content-Type", "text/plain");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="FIR-Report-${fir.caseNumber || fir._id.toString().slice(-6)}.txt"`,
    );

    res.send(report);
  } catch (error) {
    console.error("Generate Report Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
