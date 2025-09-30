import React from 'react';

export interface Editor<ValueType> {
  isNew: boolean;
  value: ValueType | undefined;
  oldValue: ValueType | undefined;
  hasChanges: boolean;
  setHasChanges: (hasChanges: boolean) => void;
  create: (defaultValue?: ValueType) => void;
  edit: (editValue: ValueType) => void;
  commit: () => void;
  clear: () => void;
  reset: () => void;
  setValue: (changedValue: ValueType) => void;
  /**
   * Merge the partial with the editor value.
   * @param partial The partial to merge.
   * @param recursive When true, all nested objects are merged with each other instead of replaced.
   */
  mergePartial: (partial: { [fieldName: string]: any }, recursive?: boolean) => void;
  yamlText: string;
  isComplete: boolean;
  setIsComplete: (isComplete: boolean) => void;
  options: UseEditorOptions<ValueType>;
}

export function useEditor<ValueType>(options?: UseEditorOptions<ValueType>): Editor<ValueType> {
  const [isNew, setIsNew] = React.useState(true);
  const [value, setValue] = React.useState<ValueType | undefined>(undefined);
  const [oldValue, setOldValue] = React.useState<ValueType | undefined>(undefined);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [yamlUpdateDate, setYAMLUpdateDate] = React.useState(new Date().getTime());
  const [yamlText, setYAMLText] = React.useState('');
  const [isComplete, setIsComplete] = React.useState(false);

  const create = React.useCallback((defaultValue?: ValueType) => {
    setValue({ ...defaultValue } as ValueType);
    setOldValue({ ...defaultValue } as ValueType);
    setIsNew(true);
    setHasChanges(false);
    setYAMLUpdateDate(new Date().getTime());
  }, []);

  const edit = React.useCallback((editValue: ValueType) => {
    setValue({ ...editValue });
    setOldValue(editValue);
    setIsNew(false);
    setHasChanges(false);
    setYAMLUpdateDate(new Date().getTime());
  }, []);

  const commit = React.useCallback(() => {
    if (value && options?.onCommit) {
      options.onCommit(value);
    }
    setHasChanges(false);
  }, [options, value]);

  const clear = React.useCallback(() => {
    setIsNew(false);
    setValue(undefined);
    setOldValue(undefined);
    setHasChanges(false);
    setYAMLUpdateDate(new Date().getTime());
  }, []);

  const reset = React.useCallback(() => {
    setValue({ ...oldValue } as ValueType);
    setHasChanges(false);
    setYAMLUpdateDate(new Date().getTime());
  }, [oldValue]);

  const doSetValue = React.useCallback((changedValue: ValueType) => {
    setValue(changedValue);
    setYAMLUpdateDate(new Date().getTime());
    setHasChanges(true);
  }, []);

  const merge = React.useCallback(
    (original: Record<string, any>, partial: Record<string, any>): Record<string, any> => {
      let merged = { ...original };
      const keys = Object.keys(partial);
      keys.forEach((key) => {
        if (
          original &&
          typeof original[key] === 'object' &&
          partial &&
          typeof partial[key] === 'object' &&
          !Array.isArray(original[key]) &&
          !Array.isArray(partial[key])
        ) {
          merged = { ...merged, [key]: merge(original[key], partial[key]) };
        } else {
          merged = { ...merged, [key]: partial[key] };
        }
      });
      return merged;
    },
    [],
  );
  const mergePartial = React.useCallback(
    (partial: { [fieldName: string]: any }, recursive = true) => {
      doSetValue((recursive ? merge(value as Record<string, any>, partial) : { ...value, ...partial }) as ValueType);
    },
    [doSetValue, merge, value],
  );

  React.useEffect(() => {
    const YAML = require('json-to-pretty-yaml'); // eslint-disable-line
    const scrubbedValue = value ? (options?.scrubItem ? options.scrubItem(value) : { ...value }) : {};
    if (value) {
      setYAMLText(
        YAML.stringify([scrubbedValue])
          .replace(/(\r\n|\n) {2}/g, '$1')
          .replace(/^\n/, ''),
      );
    } else {
      setYAMLText('');
    }
  }, [yamlUpdateDate]);

  const editor: Editor<ValueType> = {
    isNew,
    value,
    oldValue,
    hasChanges,
    setHasChanges,
    create,
    edit,
    commit,
    clear,
    reset,
    setValue: doSetValue,
    mergePartial,
    yamlText,
    isComplete,
    setIsComplete,
    options: options ?? {},
  };

  return editor;
}

interface UseEditorOptions<ValueType> {
  scrubItem?: (item: ValueType) => ValueType;
  onCommit?: (newValue: ValueType, oldValue?: ValueType) => void;
}
