import {
  ChangeEvent,
  HTMLInputAutoCompleteAttribute
} from "react";

type FormatInputProps = {
  id?: string,
  name?: string,
  className?: string,
  type?: string,
  value?: string,
  error?: string | string[] | undefined,
  autoComplete?: HTMLInputAutoCompleteAttribute,
  autoFocus?: boolean,
  required?: boolean,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

function FormInput({
  id, name, className, type = "text", value, error, autoComplete,
  autoFocus = false, required = false, onChange
}: FormatInputProps) {
  return (
    <div className="mb-5">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className={
          "text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " +
          `bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-300'} ` +
          className
        }
        onChange={onChange}
        required={required}
      />
      {error && Array.isArray(error) ? (
        error.map((errMsg, idx) => <p key={idx} className="text-red-400">{errMsg}</p>)
      ) : (
        <p className="text-red-400">{error}</p>
      )}
    </div>
  );
}

export default FormInput;
