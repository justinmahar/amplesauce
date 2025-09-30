import copy from 'copy-to-clipboard';
import React from 'react';
import { Button, Modal, ModalProps } from 'react-bootstrap';
import { IconButton } from '../misc/IconButton';
import { Editor } from './useEditor';
import { ConfirmResetPromptModal } from './ConfirmResetPromptModal';
import { DiscardChangesPromptModal } from './DiscardChangesPromptModal';
import { EditorIcons } from './EditorIcons';
import { Subs } from 'react-sub-unsub';

const COPY_BUTTON_TEXT = 'Copy YAML';
const COPIED_BUTTON_TEXT = 'Copied!';
const COPY_ALL_BUTTON_TEXT = 'Copy All YAML';
const COPIED_ALL_BUTTON_TEXT = 'Copied All!';

export interface EditorModalProps<ValueType> extends ModalProps {
  setShow: (show: boolean) => void;
  name?: string;
  editor: Editor<ValueType>;
  allItems?: ValueType[];
  idFieldName?: string;
  hideCopyYamlButtons?: boolean;
}

export function EditorModal<ValueType>({
  setShow,
  name,
  editor,
  allItems,
  idFieldName,
  hideCopyYamlButtons,
  children,
  ...modalProps
}: EditorModalProps<ValueType>) {
  const [showDiscardChangesPromptModal, setShowDiscardChangesPromptModal] = React.useState(false);
  const [showConfirmResetPromptModal, setShowConfirmResetPromptModal] = React.useState(false);
  const [copyAllButtonText, setCopyAllButtonText] = React.useState(COPY_ALL_BUTTON_TEXT);
  const [copyButtonText, setCopyButtonText] = React.useState(COPY_BUTTON_TEXT);
  const [deleted, setDeleted] = React.useState(false);

  React.useEffect(() => {
    setDeleted(false);
  }, [modalProps.show]);

  const handleClose = () => {
    if (editor.hasChanges) {
      setShowDiscardChangesPromptModal(true);
    } else {
      clearAndClose();
    }
  };

  const handleReset = () => {
    setShowConfirmResetPromptModal(true);
  };

  const reset = () => {
    editor.reset();
    setDeleted(false);
    setShowConfirmResetPromptModal(false);
  };

  const clearAndClose = () => {
    editor.clear();
    setShow(false);
    setShowDiscardChangesPromptModal(false);
  };

  const handleCopyButton = () => {
    copy(editor.yamlText);
    setCopyButtonText(COPIED_BUTTON_TEXT);
    editor.setHasChanges(false);
  };

  React.useEffect(() => {
    const subs = new Subs();
    subs.setTimeout(() => {
      setCopyButtonText(COPY_BUTTON_TEXT);
    }, 1000);
    return subs.createCleanup();
  }, [copyButtonText]);

  const handleCopyAllButton = () => {
    const YAML = require('json-to-pretty-yaml'); // eslint-disable-line
    if (allItems && idFieldName) {
      const itemIndex = allItems.findIndex((currItem) => {
        try {
          const currId = (currItem as any)[idFieldName];
          const editorValueId = ((editor.isNew ? editor.value : editor.oldValue) as any)[idFieldName];
          return currId && editorValueId && currId === editorValueId;
        } catch (e) {
          /* empty */
        }
        return false;
      });
      const allItemsToCopy = [...allItems];
      if (editor.value) {
        if (itemIndex >= 0) {
          if (!editor.isNew && deleted) {
            allItemsToCopy.splice(itemIndex, 1);
          } else {
            allItemsToCopy.splice(itemIndex, 1, editor.value);
          }
        } else {
          allItemsToCopy.push(editor.value);
        }
      }

      allItemsToCopy
        .map((item) => {
          const scrubbedItem = item ? (editor.options?.scrubItem ? editor.options.scrubItem(item) : { ...item }) : {};
          return scrubbedItem;
        })
        .sort((a, b) => {
          try {
            const aId = (a as any)[idFieldName];
            const bId = (b as any)[idFieldName];
            if (typeof aId === 'string' && typeof bId === 'string') {
              return aId.localeCompare(bId);
            }
          } catch (e) {
            /* empty */
          }
          return 0;
        });

      const allYamlText = YAML.stringify(allItemsToCopy)
        .replace(/(\r\n|\n) {2}/g, '$1')
        .replace(/^\n/, '');
      copy(allYamlText);
      setCopyAllButtonText(COPIED_ALL_BUTTON_TEXT);
      editor.setHasChanges(false);
    }
  };

  React.useEffect(() => {
    const subs = new Subs();
    subs.setTimeout(() => {
      setCopyAllButtonText(COPY_ALL_BUTTON_TEXT);
    }, 1000);
    return subs.createCleanup();
  }, [copyAllButtonText]);

  const allItemsSupported = !!(allItems && idFieldName);
  let copyAllYamlDisabled = !allItemsSupported;
  let idConflictDetected = false;

  if (allItems && idFieldName) {
    try {
      const editorNewValueId = editor.value ? (editor.value as any)[idFieldName] : undefined;
      const editorOldValueId = editor.oldValue ? (editor.oldValue as any)[idFieldName] : undefined;
      if (editorNewValueId !== editorOldValueId) {
        const conflictIndex = allItems.findIndex((currItem) => {
          const currId = (currItem as any)[idFieldName];
          return currId && editorNewValueId && currId === editorNewValueId;
        });
        if (conflictIndex >= 0) {
          copyAllYamlDisabled = true;
          idConflictDetected = true;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Modal size="lg" onHide={handleClose} animation={false} {...modalProps}>
      <DiscardChangesPromptModal
        show={showDiscardChangesPromptModal}
        onCancel={() => setShowDiscardChangesPromptModal(false)}
        onDiscard={clearAndClose}
      />
      <ConfirmResetPromptModal
        show={showConfirmResetPromptModal}
        onCancel={() => setShowConfirmResetPromptModal(false)}
        onReset={reset}
      />
      <Modal.Header closeButton>
        {editor.value && (
          <Modal.Title>
            {editor.isNew ? `New` + (name ? ` ${name}` : '') : `Edit` + (name ? ` ${name}` : '')}
          </Modal.Title>
        )}
      </Modal.Header>
      <Modal.Body>{editor.value && children}</Modal.Body>
      <Modal.Footer className="d-flex flex-wrap gap-1 justify-content-between">
        <div className="d-flex flex-wrap align-items-center gap-2">
          {!editor.isNew && allItemsSupported && (
            <IconButton
              icon={!deleted ? EditorIcons.Delete : EditorIcons.Restore}
              variant="danger"
              onClick={() => {
                setDeleted(!deleted);
                editor.setHasChanges(true);
              }}
            />
          )}
          {deleted && <div className="text-danger fw-bold">Deleted</div>}
        </div>
        <div className="d-flex flex-wrap align-items-center gap-1">
          {idConflictDetected && (
            <div className="d-flex align-items-center gap-1 text-danger">
              <EditorIcons.Warning /> ID conflict
            </div>
          )}
          {!hideCopyYamlButtons && (
            <IconButton
              icon={copyAllButtonText === COPIED_ALL_BUTTON_TEXT ? EditorIcons.Check : EditorIcons.CopyAll}
              variant={
                idConflictDetected
                  ? 'outline-danger'
                  : copyAllYamlDisabled
                    ? 'outline-secondary'
                    : deleted
                      ? 'outline-danger'
                      : editor.isComplete
                        ? 'success'
                        : 'outline-primary'
              }
              onClick={handleCopyAllButton}
              disabled={copyAllYamlDisabled}
            >
              {copyAllButtonText}
            </IconButton>
          )}
          {!hideCopyYamlButtons && (
            <IconButton
              icon={copyButtonText === COPIED_BUTTON_TEXT ? EditorIcons.Check : EditorIcons.Copy}
              variant={editor.isComplete ? 'success' : 'outline-primary'}
              onClick={handleCopyButton}
            >
              {copyButtonText}
            </IconButton>
          )}
          <Button variant="danger" onClick={handleReset} disabled={!editor.hasChanges}>
            Reset
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
