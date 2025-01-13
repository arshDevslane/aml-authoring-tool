import React, { useMemo } from 'react';
import {
  SupportedLanguages,
  SupportedLanguagesLabel,
} from '@/models/enums/SupportedLanguages.enum';
import { cn } from '@/lib/utils';
import { Board } from '@/models/entities/Board';
import * as yup from 'yup';
import FormikInput from '../FormikInput/FormikInput';

type Props = {
  name: string;
  label: string;
  supportedLanguages: Record<string, boolean>;
};

export const useMultiLanguage = (selectedBoard?: Board) => {
  const supportedLanguages = useMemo(() => {
    const res = {} as { [k: string]: boolean };
    const requiredLangs = Object.keys(selectedBoard?.supported_lang ?? {});

    if (!requiredLangs.includes(SupportedLanguages.EN)) {
      requiredLangs.unshift(SupportedLanguages.EN);
    }
    requiredLangs.forEach((lang) => {
      res[lang] = true;
    });

    Object.values(SupportedLanguages).forEach((lang) => {
      if (!res[lang]) {
        res[lang] = false;
      }
    });
    return res;
  }, [selectedBoard]);

  const multiLanguageSchemaObject = (label: string) =>
    Object.values(SupportedLanguages).reduce((schema, lang) => {
      if (supportedLanguages[lang]) {
        schema[lang] = yup
          .string()
          .required()
          .label(`${SupportedLanguagesLabel[lang]} ${label}`);
      } else {
        schema[lang] = yup
          .string()
          .label(`${SupportedLanguagesLabel[lang]} ${label}`);
      }
      return schema;
    }, {} as Record<SupportedLanguages, yup.StringSchema>);

  return {
    supportedLanguages,
    multiLanguageSchemaObject,
  };
};

const MultiLangFormikInput = ({ name, label, supportedLanguages }: Props) => (
  <div className={cn('flex flex-col w-full mb-3 items-start')}>
    {Object.values(SupportedLanguages).map((lang, index) => (
      <FormikInput
        key={lang}
        name={`${name}.${lang}`}
        label={index === 0 ? label : undefined}
        placeholder={`${label} (${
          SupportedLanguagesLabel[lang as keyof typeof SupportedLanguagesLabel]
        }) ${supportedLanguages[lang] ? '' : '(Optional)'}`}
        required={index === 0}
        className='[&_+_p]:relative [&_+_p]:top-0'
      />
    ))}
  </div>
);

export default MultiLangFormikInput;
