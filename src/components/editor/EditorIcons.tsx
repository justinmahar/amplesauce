import React from 'react';
import { IconType } from 'react-icons';
import { AiFillWarning } from 'react-icons/ai';
import { FaCheck } from 'react-icons/fa';
import { FaCopy } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';
import { FaTrashRestoreAlt } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { GiStack } from 'react-icons/gi';
import { FaAsterisk } from 'react-icons/fa';
import { key } from '../utils/utils';

export const EditorIcons = {
  Add: FaPlus,
  Edit: FiEdit,
  Copy: FaCopy,
  CopyAll: GiStack,
  Check: FaCheck,
  Warning: AiFillWarning,
  Delete: FaTrashAlt,
  Restore: FaTrashRestoreAlt,
  New: FaAsterisk,
};

export const getIconSelectOptions = (icons: Record<string, IconType>) => {
  const ideaIconKeys = Object.keys(icons);
  const iconOptions = ideaIconKeys.map((iconKey, index) => {
    return (
      <option key={key('icon', iconKey, index)} value={iconKey}>
        {iconKey}
      </option>
    );
  });
  return iconOptions;
};
