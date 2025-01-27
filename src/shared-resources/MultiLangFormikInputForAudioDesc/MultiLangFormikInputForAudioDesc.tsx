/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useMemo } from 'react';
import {
  SupportedLanguages,
  SupportedLanguagesLabel,
} from '@/models/enums/SupportedLanguages.enum';
import { calculateMD5, cn, isValueEmpty } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AudioLines, Languages, Pause, Play, Trash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isLoadingTranslationsSelector,
  translationSelector,
} from '@/store/selectors/translation.selector';
import { useField, useFormikContext } from 'formik';
import {
  getTranslationAction,
  removeTranslationAction,
} from '@/store/actions/translation.action';
import { isLoadingTtsSelector } from '@/store/selectors/tts.selector';
import { getTtsAction } from '@/store/actions/tts.action';
import { isLoadingAudioSelector } from '@/store/selectors/audio.selector';
import { removeAudioRecordAction } from '@/store/actions/audio.action';
import Loader from '@/components/Loader/Loader';
import FormikInput from '../FormikInput/FormikInput';

type Props = {
  name: string;
  label: string;
  audioRecords: any[];
};

type InputCompForAudioDescProps = {
  name: string;
  lang: string;
  label: string;
  audioURL?: string;
  audioHash?: string;
};

const InputCompForAudioDesc = ({
  name,
  lang,
  label,
  audioURL,
  audioHash,
}: InputCompForAudioDescProps) => {
  const dispatch = useDispatch();

  const { validateField } = useFormikContext();

  const isLoadingTranslations = useSelector(isLoadingTranslationsSelector);
  const isLoadingTts = useSelector(isLoadingTtsSelector);

  const translations = useSelector(translationSelector);

  const fieldName = `${name}.${lang}`;
  const [_, fieldMeta, fieldHelpers] = useField(fieldName);
  const [__, engFieldMeta] = useField(`${name}.en`);

  const [isTranslatedClicked, setTranslatedClicked] = React.useState(false);
  const [audio] = React.useState(new Audio());
  const [isPlaying, setIsPlaying] = React.useState(false);

  const { value: engFieldValue } = engFieldMeta;

  const { value } = fieldMeta;
  const { setValue } = fieldHelpers;

  const displayAudioIcon = useMemo(() => {
    if (isValueEmpty(value)) return false;
    if (!audioURL && isValueEmpty(value)) return true;

    const textHash = calculateMD5(
      `${value}-${lang}`.replace(/\s+/g, '').toLowerCase()
    );

    return audioHash === textHash;
  }, [audioURL, audioHash, value, lang]);

  const onTranslate = () => {
    setTranslatedClicked(true);
    dispatch(
      getTranslationAction({
        input_string: engFieldValue ?? '',
        target_language: lang,
      })
    );
  };

  const onSpeechSynthesis = () => {
    dispatch(
      getTtsAction({
        input_string: value ?? '',
        target_language: lang,
      })
    );
  };

  const handlePlay = () => {
    audio.src = audioURL!;
    audio.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    audio.pause();
    setIsPlaying(false);
  };

  useEffect(() => {
    audio.addEventListener('ended', handlePause);
    return () => {
      audio.removeEventListener('ended', handlePause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isTranslatedClicked || !translations[lang]) return;

    setValue(translations[lang]);
    setTranslatedClicked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTranslatedClicked, setValue, translations[lang]]);

  useEffect(() => {
    if (!isLoadingTts) {
      validateField(fieldName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingTts]);

  return (
    <div key={lang} className='flex w-full flex-1 gap-2 items-top'>
      <FormikInput
        name={fieldName}
        placeholder={`${label} (${
          SupportedLanguagesLabel[lang as keyof typeof SupportedLanguagesLabel]
        }) (Optional)`}
        className='[&_+_p]:relative [&_+_p]:top-0'
        disabled={isLoadingTranslations || isLoadingTts}
      />
      {lang !== SupportedLanguages.EN && (
        <Button
          type='button'
          className='relative min-w-12'
          onClick={onTranslate}
          disabled={isValueEmpty(engFieldValue) || isLoadingTranslations}
        >
          {isLoadingTranslations ? (
            <Loader className='text-white' />
          ) : (
            <Languages />
          )}
        </Button>
      )}
      <Button
        type='button'
        className='relative min-w-12'
        disabled={isValueEmpty(value) || isLoadingTts}
        onClick={() => {
          if (displayAudioIcon) {
            if (isPlaying) {
              handlePause();
            } else {
              handlePlay();
            }
          } else {
            onSpeechSynthesis();
          }
        }}
      >
        {displayAudioIcon ? (
          isPlaying ? (
            <Pause />
          ) : (
            <Play />
          )
        ) : isLoadingTts ? (
          <Loader className='text-white' />
        ) : (
          <AudioLines />
        )}
      </Button>
      <Button
        type='button'
        variant='outline'
        className='max-w-12 border-red-500'
        onClick={() => {
          setValue('');
          dispatch(removeAudioRecordAction(lang));
          dispatch(removeTranslationAction(lang));
        }}
        disabled={isValueEmpty(value)}
      >
        <Trash
          className={cn(
            !isValueEmpty(value) ? 'text-red-500' : 'text-disabled'
          )}
        />
      </Button>
    </div>
  );
};

const MultiLangFormikInputForAudioDesc = ({
  name,
  label,
  audioRecords,
}: Props) => {
  const isLoadingAudio = useSelector(isLoadingAudioSelector);

  if (isLoadingAudio) {
    return (
      <>
        <p className='font-medium text-sm text-primary'>{label}</p>
        <div className='relative h-20'>
          <Loader />
        </div>
      </>
    );
  }

  return (
    <div className={cn('flex flex-col w-full mb-3 items-start')}>
      <p className='font-medium text-sm text-primary mb-1'>{label}</p>
      {Object.values(SupportedLanguages).map((lang: any) => (
        <InputCompForAudioDesc
          key={lang}
          name={name}
          lang={lang}
          label={label}
          audioURL={audioRecords[lang]?.audio_url}
          audioHash={audioRecords[lang]?.description_hash}
        />
      ))}
    </div>
  );
};

export default MultiLangFormikInputForAudioDesc;
