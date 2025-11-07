import PropTypes from "prop-types";

const CheckboxGroup = ({options, selectedValues, onChange}) => {
    const handleChange = (value) => {
        const isSelected = selectedValues.includes(value);
        const updatedValues = isSelected
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];

        onChange(updatedValues);
    };

    return (
        <div className="flex flex-col gap-2">
            {options.map((option) => {
                const isChecked = selectedValues.includes(option.value);
                return (
                    <label key={option.value} className="cursor-pointer  ">
                        <div
                            className={`flex items-center gap-1 border-2  bg-white rounded-full px-2 py-2 transition-all duration-200 ${
                                isChecked
                                    ? "border-blue-500 bg-blue-100 text-blue-600"
                                    : "border-gray-300 text-gray-600 hover:border-blue-400"
                            }`}
                            onClick={() => handleChange(option.value)}
                        >
                            <div className="w-5 h-5 flex items-center justify-center">
                                <div
                                    className={`w-3 h-3 rounded-full ${
                                        isChecked ? "bg-blue-600" : "bg-gray-300"
                                    }`}
                                ></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4">{option.icon}</span>
                                <span className="text-sm font-medium">{option.label}</span>
                            </div>
                        </div>
                    </label>
                );
            })}
        </div>
    );
};

CheckboxGroup.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.node,
        })
    ).isRequired,
    selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default CheckboxGroup;
