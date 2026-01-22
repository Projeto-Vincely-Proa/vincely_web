import './inputForm.css';

const InputForm = ({
    label,
    type = 'text',
    name,
    id,
    placeholder,
    value,
    onChange,
    required = false,
    disabled = false,
    inputMode = '',
    pattern = ''
}) => {
    return (
        <div className="input-form">
            {label && <label htmlFor={id}>{label}</label>}
            <input
                type={type}
                name={name}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                {...(pattern ? { pattern } : {})}
                {...(inputMode ? { inputMode } : {})}
            />
        </div>
    )
}

export default InputForm