import React from 'react';
import { Form, Stack } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import { EditorModal, EditorModalProps } from './EditorModal';
import { CancelableFormControl } from '../misc/CancelableFormControl';
import { slugify } from '../utils/utils';

type Template = any;

export interface EditTemplateModalProps extends DivProps {}

export const EditTemplateModal = (props: EditorModalProps<Template>) => {
  const editor = props.editor;
  const allItems = React.useMemo(
    () =>
      [
        { name: 'Item A', uid: 'a' },
        { name: 'Item B', uid: 'b' },
        { name: 'Item C', uid: 'c' },
      ].map((node) => {
        return { ...node, fields: undefined };
      }),
    [],
  );

  const formLabelClass = 'small mb-0';
  return (
    <EditorModal name={editor.oldValue?.name || 'Item'} allItems={allItems} idFieldName="uid" {...props}>
      {editor.value && (
        <Stack gap={2}>
          <Form.Group controlId="name-group">
            <Form.Label className={formLabelClass}>Name</Form.Label>
            <CancelableFormControl
              type="text"
              placeholder="Name"
              value={editor.value.name ?? ''}
              onChange={(e) => {
                editor.mergePartial({ name: e.target.value, uid: slugify(e.target.value) });
              }}
              onCancel={() => editor.mergePartial({ name: '' })}
            />
          </Form.Group>
          <CancelableFormControl
            type="text"
            placeholder="UID"
            value={editor.value.uid ?? ''}
            onChange={(e) => editor.mergePartial({ uid: e.target.value })}
            onCancel={() => editor.mergePartial({ uid: '' })}
          />
        </Stack>
      )}
    </EditorModal>
  );
};

export const defaultNewTemplate: Template = {
  name: '',
  uid: '',
};
