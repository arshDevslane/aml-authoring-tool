import React from 'react';
import { SupportedLanguagesLabel } from '@/models/enums/SupportedLanguages.enum';
import FormikInput from '../FormikInput/FormikInput';

type Props = {
  name: string;
  label: string;
  supportedLanguages: string[];
};

const MultiLangFormikInput = ({ name, label, supportedLanguages }: Props) => (
  <div className='flex flex-col w-full mb-3 items-start'>
    {supportedLanguages.map((lang, index) => (
      <FormikInput
        key={lang}
        name={`${name}.${lang}`}
        label={index === 0 ? label : undefined}
        placeholder={`${label} (${
          SupportedLanguagesLabel[lang as keyof typeof SupportedLanguagesLabel]
        })`}
        required={index === 0}
      />
    ))}
  </div>
);

export default MultiLangFormikInput;
