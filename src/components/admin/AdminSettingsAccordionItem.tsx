import React from 'react';
import { Accordion, Form } from 'react-bootstrap';
import { AccordionItemProps } from 'react-bootstrap/esm/AccordionItem';
import { LocalSettingsKeys } from '../settings/LocalSettings';
import { useLocalSettingsContext } from '../contexts/LocalSettingsProvider';

interface Props extends AccordionItemProps {}

export const AdminSettingsAccordionItem = (props: Props) => {
  const localSettings = useLocalSettingsContext();
  const [adminViewDisabled, setAdminViewDisabled] = localSettings[LocalSettingsKeys.adminViewDisabledState];
  return (
    <Accordion.Item {...props}>
      <Accordion.Header>Settings</Accordion.Header>
      <Accordion.Body>
        <div>
          <Form.Check
            type="switch"
            label="Admin View"
            id="toggle-switch-id"
            checked={!adminViewDisabled}
            onChange={(e) => setAdminViewDisabled(!e.target.checked)}
          />
          <p className="text-muted">
            {adminViewDisabled && 'Admin view is disabled.'}
            {!adminViewDisabled && 'Admin view is enabled.'}
          </p>
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
};
