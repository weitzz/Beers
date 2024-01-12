import { useState } from 'react'

interface TypesProps {
    email: EmailProps;
    userExists: UserExistsProps;
}


interface EmailProps {
    regex: RegExp;
    message: string;
}

interface UserExistsProps {
    message: string;
}

const types: TypesProps = {
    email: {
        regex: /\S+@\S+\.\S+/,
        message: 'Preencha um email válido'
    },
    userExists: {
        message: 'Usuário existente'
    }
}

const checkEmailExists = async (email: string) => {
    try {
        const response = await fetch('/api/checkEmailExists', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
        const { exists } = await response.json();
        return exists;
    } catch (error) {
        console.error('Error checking email existence:', error);
        return false;
    }
}

const useForm = (type: keyof TypesProps | false = false) => {
    const [value, setValue] = useState('')
    const [error, setError] = useState<string | null>(null)



    const validate = async (value: string) => {
        if (type === false) return true;
        if (value.length === 0) {
            setError('Preencha um valor válido');
            return false;
        }
        else if (type && type in types) {
            const selectedType = types[type];
            if ('regex' in selectedType && !selectedType.regex.test(value)) {
                setError(selectedType.message);
                return false;
            }
        }
        setError(null);
        return true;
    };

    const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        if (error) setValue(target.value)
        setValue(target.value);
    }

    return {
        value,
        setValue,
        onChange,
        error,
        validate: () => validate(value),
        onBlur: () => validate(value)
    }
}

export default useForm