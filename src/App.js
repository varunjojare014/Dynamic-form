import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Sample API responses for form structures
  const formStructures = {
    userInformation: {
      fields: [
        {
          name: "firstName",
          type: "text",
          label: "First Name",
          required: true,
        },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false },
      ],
    },
    addressInformation: {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        {
          name: "state",
          type: "dropdown",
          label: "State",
          options: ["California", "Texas", "New York"],
          required: true,
        },
        { name: "zipCode", type: "text", label: "Zip Code", required: false },
      ],
    },
    paymentInformation: {
      fields: [
        {
          name: "cardNumber",
          type: "text",
          label: "Card Number",
          required: true,
        },
        {
          name: "expiryDate",
          type: "date",
          label: "Expiry Date",
          required: true,
        },
        { name: "cvv", type: "password", label: "CVV", required: true },
        {
          name: "cardholderName",
          type: "text",
          label: "Cardholder Name",
          required: true,
        },
      ],
    },
  };

  const [selectedForm, setSelectedForm] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState({
    userInformation: [],
    addressInformation: [],
    paymentInformation: [],
  });
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Feedback message state
  const [progress, setProgress] = useState(0); // Progress bar state

  // Handle form field change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Calculate the progress bar based on filled required fields
  useEffect(() => {
    const requiredFields = formFields.filter((field) => field.required);
    const filledFields = requiredFields.filter(
      (field) => formData[field.name] && formData[field.name].trim() !== ""
    );
    const progressPercentage =
      (filledFields.length / requiredFields.length) * 100;
    setProgress(progressPercentage);
  }, [formData, formFields]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedForm) {
      // Add the current form data to the respective form type
      setSubmittedData((prevData) => ({
        ...prevData,
        [selectedForm]: [...prevData[selectedForm], formData],
      }));
      setFeedbackMessage("Sign-up Successful!"); // Set success message
      setTimeout(() => setFeedbackMessage(""), 3000); // Clear message after 3 seconds
      setFormData({}); // Reset form data after submission
    }
  };

  // Handle form selection change (dropdown)
  const handleFormSelection = (e) => {
    const formType = e.target.value;
    setSelectedForm(formType);
    setFormFields(formStructures[formType]?.fields || []);
    setFormData({}); // Reset form data on form change
  };

  // Render dynamic form fields based on selected form
  const renderFormFields = () => {
    return formFields.map((field) => (
      <div key={field.name} className="form-field">
        <label>
          {field.label}
          {field.required && <span className="required">*</span>}
        </label>
        {field.type === "dropdown" ? (
          <select
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleInputChange}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleInputChange}
            required={field.required}
          />
        )}
      </div>
    ));
  };

  // Render submitted data in separate tables
  const renderSubmittedData = () => {
    return Object.keys(submittedData).map((formType) => {
      if (submittedData[formType].length > 0) {
        return (
          <div key={formType}>
            <h2>{formType.replace(/([A-Z])/g, " $1").toUpperCase()}</h2>
            <table>
              <thead>
                <tr>
                  {formStructures[formType].fields.map((field) => (
                    <th key={field.name}>{field.label}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submittedData[formType].map((data, index) => (
                  <tr key={index}>
                    {formStructures[formType].fields.map((field) => (
                      <td key={field.name}>{data[field.name]}</td>
                    ))}
                    <td>
                      <button onClick={() => handleEdit(formType, index)}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(formType, index)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      return null; // Do not render the table if no data exists
    });
  };

  // Handle delete action
  const handleDelete = (formType, index) => {
    const updatedData = [...submittedData[formType]];
    updatedData.splice(index, 1);
    setSubmittedData((prevData) => ({
      ...prevData,
      [formType]: updatedData,
    }));
    setFeedbackMessage("Entry deleted successfully!"); // Set delete success message
    setTimeout(() => setFeedbackMessage(""), 3000); // Clear message after 3 seconds
  };

  // Handle edit action
  const handleEdit = (formType, index) => {
    setFormData(submittedData[formType][index]);
    setSelectedForm(formType);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dynamic Form</h1>
      </header>

      {feedbackMessage && (
        <div className="feedback-message">{feedbackMessage}</div>
      )}

      <div className="form-container">
        <div className="form-selection">
          <label>Select Form Type</label>
          <select onChange={handleFormSelection} value={selectedForm}>
            <option value="">--Select Form--</option>
            <option value="userInformation">User Information</option>
            <option value="addressInformation">Address Information</option>
            <option value="paymentInformation">Payment Information</option>
          </select>
        </div>

        {selectedForm && (
          <form onSubmit={handleSubmit} className="dynamic-form">
            {renderFormFields()}
            <button type="submit">Submit</button>
          </form>
        )}
      </div>

      {/* Progress Bar */}
      {selectedForm && formFields.length > 0 && (
        <div className="progress-container">
          <div className="progress-bar-background">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span>{Math.round(progress)}% Completed</span>
        </div>
      )}

      <div className="submitted-data">{renderSubmittedData()}</div>
    </div>
  );
}

export default App;
