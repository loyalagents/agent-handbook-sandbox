import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import styles from './styles.module.css';

type SliderRootProps = {
  defaultValue?: any;
  max?: number;
  step?: number;
  name?: string;
};

const SliderRoot = ({
  defaultValue = [50],
  max = 100,
  step = 1,
  name,
}: SliderRootProps) => (
  <Slider.Root
    className={styles['slider-root']}
    defaultValue={defaultValue}
    max={max}
    step={step}
  >
    <Slider.Track className={styles['slider-track']}>
      <Slider.Range className={styles['slider-range']} />
    </Slider.Track>
    <Slider.Thumb className={styles['slider-thumb']} aria-label={name} />
  </Slider.Root>
);

export default SliderRoot;
