import React from "react";

const GenderCheckbox = ({ onCheckboxChange, selectedGender }) => {
  return (
    <div className="flex justify-around text-white mt-4 mb-2">
      {["male", "female", "other"].map((gender) => (
        <label
          key={gender}
          className={`flex items-center gap-2
            ${
              selectedGender === gender
            }`}
        >
          <input
            type="radio"
            name="gender"
            value={gender}
            checked={selectedGender === gender}
            onChange={() => onCheckboxChange(gender)}
            className="h-5 w-5 form-radio text-purple-700 accent-purple-700"
          />
          <span className="capitalize">{gender}</span>
        </label>
      ))}
    </div>
  );
};

export default GenderCheckbox;
