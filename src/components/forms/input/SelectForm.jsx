import './selectForm.css';

const SelectForm = ({
  label,
  id,
  value,
  onChange,
  options = [],
  disabled = false
}) => {
  return (
    <div className="form-control">
      <label htmlFor={id}>{label}</label>

      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <option value="" disabled>
          Selecione uma opção
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectForm;
