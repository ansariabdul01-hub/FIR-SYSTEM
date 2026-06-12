const mongoose = require('mongoose');

const firSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caseNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  complainantName: {
    type: String,
    required: true
  },
  complainantPhone: {
    type: String,
    required: true
  },
  complainantEmail: {
    type: String,
    required: true
  },
  complainantAddress: {
    type: String,
    required: true
  },
  incidentDate: {
    type: Date,
    required: true
  },
  incidentLocation: {
    type: String,
    required: true
  },
  incidentDescription: {
    type: String,
    required: true
  },
  evidence: [{
    type: {
      type: String,
      enum: ['image', 'document', 'video', 'audio']
    },
    url: String,
    description: String
  }],
  witnesses: [{
    name: String,
    phone: String,
    address: String
  }],
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'resolved'],
    default: 'pending'
  },
  blockchainHash: {
    type: String,
    default: ''
  },
  blockchainTransactionId: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewComments: {
    type: String,
    default: ''
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  resolutionDetails: {
    type: String,
    default: ''
  },
  finalReport: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before saving
firSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FIR', firSchema);

