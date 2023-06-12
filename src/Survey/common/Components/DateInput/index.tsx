import React, { FC, useRef, useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { JSX } from '@ionic/core';
import {
  IonItem,
  IonLabel,
  IonDatetime,
  IonIcon,
  IonAccordionGroup,
  IonAccordion,
} from '@ionic/react';
import './styles.scss';

/**
 * CHANGELOG:
 *
 * No formatting
 * Label will not be shown as format by default
 */

type Props = JSX.IonDatetime & {
  /**
   * Function invoke on value change.
   */
  onChange: any;
  /**
   * Time or Date format label.
   */
  format?: {
    locales?: string | string[];
    options: Intl.DateTimeFormatOptions;
  };
  /**
   * Current value.
   */
  value?: string;
  /**
   * Class name to the whole radio input wrapper.
   */
  className?: string;
  /**
   * The maximum datetime allowed.
   */
  max?: string | (() => Date);
  /**
   * The minimum datetime allowed.
   */
  min?: string | (() => Date);
  /**
   * Skip translation.
   */
  skipTranslation?: boolean;
  /**
   * Icon for the item.
   */
  icon?: string;
  /**
   * Label of the component.
   */
  label?: string;
  /**
   * Disable data-time keyboard open.
   */
  autoFocus?: boolean;
  /**
   * Is the value changing disabled.
   */
  disabled?: boolean;
  /**
   * Any extra props passed to the IonItem component.
   */
  itemProps?: any;
};

const DateInput: FC<Props> = ({
  className,
  skipTranslation,
  format: formatProp,
  onChange: onChangeProp,
  value: valueProp,
  max: maxProp,
  min: minProp,
  icon,
  label: labelProp,
  autoFocus: autoFocusProp = true,
  disabled,
  itemProps,
  ...other
}) => {
  const input = useRef<any>();
  const { t } = useTranslation();

  const [value, setValue] = useState(valueProp);

  let formattedValue;
  if (value) {
    const defaultLocale = 'en-GB';
    const defaultFormat: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    formattedValue = new Date(value).toLocaleString(
      formatProp?.locales || defaultLocale,
      formatProp?.options || defaultFormat
    );
  }

  const onChange = (e: any) => {
    setValue(e.target.value);

    const date = new Date(e.target.value);

    if (date.toString() === 'Invalid Date') {
      return;
    }

    if (e.target.value) {
      onChangeProp(e.target.value);
    }
  };

  const label = !skipTranslation || !labelProp ? labelProp : t(labelProp);

  const onDateChange = (e: any) =>
    onChange({ target: { value: e.detail.value } });

  const max =
    typeof maxProp === 'function' ? (maxProp as any)().toISOString() : maxProp;
  const min =
    typeof minProp === 'function' ? (minProp as any)().toISOString() : minProp;

  const id = 'date-input-attr'; // used to control the only nested accordion

  return (
    <IonAccordionGroup
      className={clsx('date-input-attr', className)}
      disabled={disabled}
      value={autoFocusProp ? id : undefined}
      {...itemProps}
    >
      <IonAccordion value={id}>
        <IonItem slot="header">
          {icon && <IonIcon slot="start" icon={icon} />}
          <IonLabel>{label}</IonLabel>
          <IonLabel slot="end">{formattedValue}</IonLabel>
        </IonItem>

        <IonItem slot="content">
          <IonDatetime
            ref={input}
            value={value}
            onIonChange={onDateChange}
            max={max}
            min={min}
            disabled={disabled}
            {...other}
          />
        </IonItem>
      </IonAccordion>
    </IonAccordionGroup>
  );
};

export default DateInput;
