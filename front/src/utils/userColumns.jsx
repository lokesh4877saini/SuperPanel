import React from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // icons for actions

const userColumns = [
  { label: "Name", path: "basic_info.name" },
  { label: "Email", path: "basic_info.email" },
  { label: "Phone", path: "basic_info.phone" },
  { label: "DOB", path: "basic_info.dob", isDate: true },
  { label: "Gender", path: "basic_info.gender" },
  { label: "Payment Status", path: "payment_detail.status" },
  { label: "Invoices", path: "payment_detail.invoices" },
  { label: "Company", path: "employment.company" },
  { label: "Salary Base", path: "employment.contract.salary_breakup.base" },
  { label: "HRA", path: "employment.contract.salary_breakup.hra" },
  { label: "Bonus", path: "employment.contract.salary_breakup.bonus" },
  { label: "KYC Verified", path: "kyc.verified" },
  {
    label: "Aadhaar",
    path: "kyc.documents.aadhaar",
    render: (value) =>
      value ? `${value.number} | ${value.verified ? "Yes" : "No"}` : "-"
  },
  {
    label: "PAN",
    path: "kyc.documents.pan",
    render: (value) =>
      value ? `${value.number} | ${value.verified ? "Yes" : "No"}` : "-"
  },
  {
    label: "Passport",
    path: "kyc.documents.passport",
    render: (value) =>
      value
        ? `${value.number} | ${value.verified ? "Yes" : "No"} | ${value.expiry ? new Date(value.expiry).toLocaleDateString() : "-"}`
        : "-"
  },
  { label: "Account Status", path: "account_status" },
  { label: "Last Login", path: "last_login", isDate: true },
  {
    label: "Actions",
    path: "actions",
    render: (_, row, { onEdit, onRemove, onView }) => (
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <button
          title="View"
          className="action-btn view"
          onClick={() => onView(row)}
        >
          <FaEye />
        </button>
        <button
          title="Edit"
          className="action-btn edit"
          onClick={() => onEdit(row)}
        >
          <FaEdit />
        </button>
        <button
          title="Remove"
          className="action-btn remove"
          onClick={() => onRemove(row)}
        >
          <FaTrash />
        </button>
      </div>
    )
  }
];

export default userColumns;
