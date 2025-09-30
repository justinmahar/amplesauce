import classes from 'classnames';
import React, { JSX } from 'react';
import { Button, ButtonProps } from 'react-bootstrap';
import { IconBaseProps, IconType } from 'react-icons';

export interface IconButtonProps extends ButtonProps {
  /** Make button block-level by wrapping with div that has grid display */
  block?: boolean;
  /** The icon to use */
  icon: IconType;
  /** True to position icon at the end. Positions at start otherwise. */
  end?: boolean;
  /** Enable text wrapping. */
  wrap?: boolean;
  /** Props for icon */
  iconProps?: IconBaseProps;
}

export const IconButton = ({ block, icon, end, wrap, ...props }: IconButtonProps): JSX.Element => {
  const Icon = icon;
  const iconOnly = typeof props.children === 'undefined';

  const buttonElement = (
    <Button {...props} className={classes(iconOnly ? 'position-relative' : undefined, props.className)}>
      {iconOnly && (
        <>
          <Icon className={classes('position-absolute top-50 start-50 translate-middle', props.iconProps?.className)} />
          <Icon className={classes('invisible', props.iconProps?.className)} />
        </>
      )}
      {!iconOnly && (
        <div
          className={classes(
            'd-flex align-items-center justify-content-center gap-2',
            wrap ? 'flex-wrap' : 'text-nowrap',
          )}
        >
          {
            <Icon
              {...props.iconProps}
              className={classes(end ? 'order-last' : undefined, props.iconProps?.className)}
            />
          }
          <div>{props.children}</div>
        </div>
      )}
    </Button>
  );

  return block ? <div className="d-grid">{buttonElement}</div> : buttonElement;
};
