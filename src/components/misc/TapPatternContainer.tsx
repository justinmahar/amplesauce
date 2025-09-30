import * as React from 'react';
import { Subs } from 'react-sub-unsub';

export interface TapPatternContainerProps {
  children?: any;
  pattern: string;
  timeout?: number;
  printPatternOnTimeout?: boolean;
  patternToEncrypt?: string;
  /** Number between 0 and 1. 0 is exact. */
  marginOfError?: number;
  cipherKey?: string;
  onSuccess?: () => void;
}

export default function TapPatternContainer(props: TapPatternContainerProps): React.JSX.Element {
  const [tapTimes, setTapTimes] = React.useState<number[]>([]);

  const tapTimeout = typeof props.timeout === 'number' ? props.timeout : 500;
  const marginOfError = typeof props.marginOfError === 'number' ? props.marginOfError : 0.3;
  const cipherKey = typeof props.cipherKey === 'string' ? props.cipherKey : 'tap-pattern-container';

  const reset = (): void => {
    setTapTimes([]);
  };
  if (props.patternToEncrypt) {
    console.log(`"${keyRotate(props.patternToEncrypt, cipherKey)}"`);
  }
  const patternScores: number[] = keyRotate(props.pattern, cipherKey, true)
    .split(/,\s*/)
    .map((value: string) => parseFloat(value.trim()));

  React.useEffect(() => {
    const theirScores: number[] = [];
    if (tapTimes.length >= 2) {
      const norm = tapTimes[1] - tapTimes[0];
      for (let i = 1; i < tapTimes.length; i++) {
        const prev: number = tapTimes[i - 1];
        const curr: number = tapTimes[i];
        const delay: number = curr - prev;
        const ratio: number = delay / norm;
        const ratioFixed: number = Math.round(ratio * 100) / 100;
        theirScores.push(ratioFixed);
      }
    }

    if (tapTimes.length - 1 === patternScores.length) {
      let succeeded = true;
      for (let i = 0; i < patternScores.length; i++) {
        const correctScore = patternScores[i];
        const theirScore = theirScores[i];
        succeeded =
          succeeded && theirScore >= correctScore - marginOfError && theirScore <= correctScore + marginOfError;
        if (!succeeded) {
          break;
        }
      }
      if (succeeded) {
        reset();
        if (props.onSuccess) {
          props.onSuccess();
        }
      }
    }
    const subs = new Subs();
    if (tapTimes.length > 0) {
      subs.setTimeout(() => {
        if (props.printPatternOnTimeout) {
          console.log(theirScores);
        }
        reset();
      }, tapTimeout);
    }
    return subs.createCleanup();
  }, [
    marginOfError,
    patternScores,
    patternScores.length,
    props,
    props.printPatternOnTimeout,
    tapTimeout,
    tapTimes,
    tapTimes.length,
  ]);

  const handleClick = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    const newTapTimes = [...tapTimes, new Date().getTime()];
    setTapTimes(newTapTimes);
  };

  return <div onClick={handleClick}>{props.children}</div>;
}

TapPatternContainer.defaultProps = {
  external: false,
  useNewWindow: false,
  timeout: 1000,
};

const keyRotate = (text: string, key: string, reverse = false): string => {
  const bound = 0x10000;
  return String.fromCharCode.apply(
    null,
    text.split('').map(function (v, i) {
      let rotation = key[i % key.length].charCodeAt(0);
      if (reverse) rotation = -rotation;
      return (v.charCodeAt(0) + rotation + bound) % bound;
    }),
  );
};
