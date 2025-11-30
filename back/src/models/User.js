const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    basic_info: {
      name: String,
      email: String,
      phone: String,
      dob: Date,
      gender: { type: String, enum: ["male", "female", "other"] }
    },

    // ======================
    // NESTED PAYMENT DETAILS
    // ======================
    payment_detail: {
      status: { type: String, enum: ["paid", "unpaid", "pending"], default: "pending" },
      method: { type: String, enum: ["cash", "card", "upi", "netbanking"] },
      last_paid_date: Date,
      invoices: [
        {
          invoice_id: String,
          amount: Number,
          paid_on: Date,
          mode: String
        }
      ]
    },

    // ======================
    // EMPLOYMENT (nested)
    // ======================
    employment: {
      company: String,
      department: String,
      job_title: String,
      employee_id: String,
      contract: {
        type: { type: String, enum: ["full_time", "part_time", "contract"] },
        start_date: Date,
        end_date: Date,
        salary_breakup: {
          base: Number,
          hra: Number,
          bonus: Number
        }
      }
    },

    // ======================
    // TRAVEL DETAILS (nested deeply)
    // ======================
    travel_details: {
      travel_status: { type: String, enum: ["traveling", "not_traveling"], default: "not_traveling" },
      destination: String,
      start_date: Date,
      end_date: Date,
      booking: {
        hotel: {
          name: String,
          address: String,
          check_in: Date,
          check_out: Date
        },
        flight: {
          flight_detail: {
            number: String,
            airline: String,
            departure_city: String,
            arrival_city: String,
            departure_time: Date,
            arrival_time: Date,
            seat: String
          }
        },
        cab: {
          cab_detail: {
            cab_type: String,
            driver_name: String,
            pickup: String,
            drop: String,
            ride_time: Date
          }
        }
      }
    },

    // ======================
    // KYC (nested deeply)
    // ======================
    kyc: {
      verified: { type: Boolean, default: false },
      documents: {
        aadhaar: {
          number: String,
          verified: Boolean
        },
        pan: {
          number: String,
          verified: Boolean
        },
        passport: {
          number: String,
          expiry: Date,
          verified: Boolean
        }
      }
    },

    // ======================
    // USER PREFERENCES (deep nested)
    // ======================
    preferences: {
      language: String,
      ui: {
        theme: {
          mode: { type: String, enum: ["light", "dark"] },
          settings: {
            font_size: Number,
            color_blind_mode: Boolean
          }
        }
      }
    },

    // ======================
    // NOTIFICATION SETTINGS (nested deeply)
    // ======================
    notifications: {
      email: {
        enabled: Boolean,
        settings: {
          marketing: Boolean,
          transactional: Boolean,
          alerts: Boolean
        }
      },
      sms: {
        enabled: Boolean,
        settings: {
          otp: Boolean,
          alerts: Boolean
        }
      }
    },

    // SYSTEM METADATA
    account_status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active"
    },
    last_login: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
