import React, { FC, useRef, useState } from 'react';
import {
  IonItem,
  IonLabel,
  IonDatetime,
  useIonViewDidEnter,
  IonIcon,
  IonPopover,
  IonModal,
  IonList,
  IonNote,
  IonAccordionGroup,
  IonAccordion,
} from '@ionic/react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import './styles.scss';

import { JSX } from '@ionic/core';

type Props = JSX.IonDatetime & {
  /**
   * Function invoke on value change.
   */
  onChange: any;
  /**
   * Time or Date format label.
   */
  format?: string;
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

  const autoFocus = () => autoFocusProp && input.current.open();
  useIonViewDidEnter(autoFocus);

  let format = formatProp;

  format = format || 'DD/MM/YYYY';

  let label = labelProp || format;

  if (!skipTranslation) {
    label = t(label);
  }

  const onDateChange = (e: any) =>
    onChange({ target: { value: e.detail.value } });

  const max =
    typeof maxProp === 'function' ? (maxProp as any)().toISOString() : maxProp;
  const min =
    typeof minProp === 'function' ? (minProp as any)().toISOString() : minProp;

  return (
    <IonItem
      className={clsx('date-input-attr', className)}
      disabled={disabled}
      id="open-modal"
      {...itemProps}
    >
      {icon && <IonIcon slot="start" icon={icon} />}
      <IonLabel>{label}</IonLabel>

      {/* <IonModal
        id="date-time-modal"
        trigger="open-modal"
        // breakpoints={[0.5]}
        // initialBreakpoint={0.5}
        // handle={false}
      > */}
      {/* <IonPopover trigger="open-modal" showBackdrop={false}> */}
      <IonAccordionGroup>
        <IonAccordion value="colors" toggleIcon="">
          <IonItem slot="header">
            <IonLabel>Colors</IonLabel>
            <IonNote slot="end">{value?.split('T')[0]}</IonNote>
          </IonItem>
          <IonItem slot="content">
            <IonDatetime
              ref={input}
              // cancelText={t('Cancel')}
              // doneText={t('OK')}
              // showDefaultButtons
              value={value}
              onIonChange={onDateChange}
              max={max}
              min={min}
              {...other}
            />
          </IonItem>
        </IonAccordion>
      </IonAccordionGroup>
      {/* </IonModal> */}
      {/* </IonPopover> */}
    </IonItem>
  );
};

export default DateInput;
