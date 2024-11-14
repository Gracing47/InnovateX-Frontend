import React from 'react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';

interface InputFieldProps {
  placeholder: string;
  onSubmit: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ placeholder, onSubmit }) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onSubmit(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="space-y-4">
      <Input
        className="w-full text-lg"
        placeholder={placeholder}
        value={inputValue}
        onKeyDown={handleKeyDown}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="flex justify-center">
        <Button
          className="w-full max-w-sm"
          onClick={() => {
            if (inputValue.trim()) {
              onSubmit(inputValue);
              setInputValue('');
            }
          }}
        >
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default InputField;
