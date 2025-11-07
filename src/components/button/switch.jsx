const Switch = ({ onChange, defaultChecked }) => {
    return (
        <label className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-gray-900">
            <input
                className="peer sr-only"
                type="checkbox"
                defaultChecked={defaultChecked}
                onChange={onChange}
            />
            <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent" />
        </label>
    );
};

export default Switch;