import { Button } from 'react-bootstrap';
import React, { JSX } from 'react';
import { ButtonGroup, ButtonGroupProps } from 'react-bootstrap';

interface BooleanButtonProps extends ButtonGroupProps {
  value: boolean;
  onTrue?: () => void;
  onFalse?: () => void;
  falseVariant?: string;
  trueVariant?: string;
  falseLabel?: string;
  trueLabel?: string;
}

export const BooleanButton = ({
  value,
  onTrue,
  onFalse,
  falseVariant,
  trueVariant,
  falseLabel,
  trueLabel,
  ...buttonGroupProps
}: BooleanButtonProps): JSX.Element => {
  return (
    <ButtonGroup {...buttonGroupProps}>
      <Button
        variant={!value ? falseVariant || 'danger' : 'dark'}
        className={value ? 'text-muted' : undefined}
        onClick={() => {
          if (value && onFalse) {
            onFalse();
          }
        }}
      >
        {falseLabel || 'Off'}
      </Button>
      <Button
        variant={value ? trueVariant || 'success' : 'dark'}
        className={!value ? 'text-muted' : undefined}
        onClick={() => {
          if (!value && onTrue) {
            onTrue();
          }
        }}
      >
        {trueLabel || 'On'}
      </Button>
    </ButtonGroup>
  );
};
